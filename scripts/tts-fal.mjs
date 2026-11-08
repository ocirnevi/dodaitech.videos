// Narración con ElevenLabs a través de fal.ai (mismo proveedor que usas en Mia Studio).
// Por defecto es un DRY RUN: imprime caracteres y costo estimado y no llama a fal.
//   node --env-file=<.env de Mia> scripts/tts-fal.mjs --script script/<slug>.json            # dry run
//   node --env-file=<.env de Mia> scripts/tts-fal.mjs --script script/<slug>.json --yes      # genera
//   [--voice <id|nombre>] [--model multilingual-v2|eleven-v3|turbo-v2.5] [--speed 1.05] [--only <sceneId>] [--probe 'texto']
// Escribe public/narration/<slug>/<id>.{mp3,wav,fal-timestamps.json}, src/data/<slug>/narration.json y, si fal devuelve
// timestamps, src/data/<slug>/words.json (mismo formato que align.py; así no hace falta whisper).
// La llave: FAL_KEY en el entorno (nunca en este repo).
import 'dotenv/config';
import {fal} from '@fal-ai/client';
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const YES = args.includes('--yes');
const MODEL = flag('--model', 'multilingual-v2'); // multilingual-v2 y turbo-v2.5 aceptan speed/style; eleven-v3 no
const SCRIPT = flag('--script', 'script/chip-supply-chain.json');
const script = JSON.parse(readFileSync(join(ROOT, SCRIPT), 'utf8'));
const SLUG = script.id;
const VOICE = flag('--voice', process.env.VOICE || script.voice || 'Brian');
const LANG = (script.language || 'en-US').slice(0, 2);
const SPEED = Number(flag('--speed', '1.05'));
const ONLY = flag('--only', null);
const PROBE = flag('--probe', null);
const PRICE = {'multilingual-v2': 0.1, 'eleven-v3': 0.1, 'turbo-v2.5': 0.05}[MODEL]; // USD por 1000 caracteres (fal, nov 2026)
if (!PRICE) throw new Error(`modelo desconocido: ${MODEL}`);

const scenes = PROBE ? [{id: 'probe', narration: PROBE}] : ONLY ? script.scenes.filter((s) => s.id === ONLY) : script.scenes;
const chars = scenes.reduce((a, s) => a + s.narration.length, 0);
const cost = (chars / 1000) * PRICE;
console.log(`guion ${SLUG} · modelo fal-ai/elevenlabs/tts/${MODEL} · voz ${VOICE} · ${scenes.length} escenas · ${chars} caracteres · ≈ $${cost.toFixed(3)} USD`);
if (!YES) {
  console.log('DRY RUN. Agrega --yes para generar.');
  process.exit(0);
}
if (!process.env.FAL_KEY) throw new Error('Falta FAL_KEY (ponla en .env, ver .env.example)');
fal.config({credentials: process.env.FAL_KEY});

const OUT = join(ROOT, 'public', 'narration', SLUG);
const DATA = join(ROOT, 'src', 'data', SLUG);
mkdirSync(OUT, {recursive: true});
mkdirSync(DATA, {recursive: true});
const narration = {};
const words = {};
const dur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** Palabras del guion con tiempos, a partir de los timestamps de fal (por palabra {text,start,end} o por carácter). */
export function wordsFromTimestamps(text, ts, total) {
  const tokens = text.split(/\s+/).filter(Boolean);
  let items = [];
  if (Array.isArray(ts) && ts.length && typeof ts[0] === 'object' && 'text' in ts[0]) {
    items = ts.map((t) => ({text: String(t.text), start: Number(t.start ?? t.start_time ?? 0), end: Number(t.end ?? t.end_time ?? 0)}));
  } else if (ts && Array.isArray(ts.characters)) {
    const cs = ts.characters;
    const st = ts.character_start_times_seconds;
    const en = ts.character_end_times_seconds;
    let cur = null;
    cs.forEach((c, i) => {
      if (/\s/.test(c)) {
        if (cur) items.push(cur);
        cur = null;
        return;
      }
      if (!cur) cur = {text: '', start: st[i], end: en[i]};
      cur.text += c;
      cur.end = en[i];
    });
    if (cur) items.push(cur);
  }
  if (!items.length) return null;
  // empareja por orden: cada token del guion toma los siguientes items con letras hasta cubrir su largo (si fal partió una palabra, se funden)
  const out = [];
  let j = 0;
  for (const tok of tokens) {
    const target = norm(tok);
    let start = null;
    let end = null;
    let acc = '';
    while (j < items.length && (start === null || acc.length < target.length)) {
      const it = items[j++];
      const n = norm(it.text);
      if (!n) continue;
      if (start === null) start = it.start;
      end = it.end;
      acc += n;
    }
    if (start === null) start = out.length ? out[out.length - 1].end : 0;
    if (end === null) end = start + 0.2;
    out.push({word: tok, start: Math.round(start * 1000) / 1000, end: Math.round(Math.min(end, total) * 1000) / 1000});
  }
  return out;
}

for (const s of scenes) {
  const input = {text: s.narration, voice: VOICE, language_code: LANG, stability: 0.5, timestamps: true, apply_text_normalization: 'on'};
  if (MODEL !== 'eleven-v3') Object.assign(input, {similarity_boost: 0.75, style: 0.25, speed: SPEED});
  process.stdout.write(`  ${s.id} (${s.narration.length} chars)… `);
  const {data} = await fal.subscribe(`fal-ai/elevenlabs/tts/${MODEL}`, {input});
  const res = await fetch(data.audio.url);
  if (!res.ok) throw new Error(`descarga ${data.audio.url}: ${res.status}`);
  const mp3 = join(OUT, `${s.id}.mp3`);
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  const wav = join(OUT, `${s.id}.wav`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-ar', '48000', '-ac', '1', wav]); // WAV 48 kHz mono como el resto del pipeline
  const d = dur(wav);
  narration[s.id] = {src: `narration/${SLUG}/${s.id}.wav`, durationInSeconds: d};
  if (data.timestamps) {
    writeFileSync(join(OUT, `${s.id}.fal-timestamps.json`), JSON.stringify(data.timestamps, null, 1));
    const w = wordsFromTimestamps(s.narration, data.timestamps, d);
    if (w) words[s.id] = w;
  }
  console.log(`ok ${d.toFixed(2)}s`);
}
if (!PROBE && !ONLY) {
  writeFileSync(join(DATA, 'narration.json'), JSON.stringify(narration, null, 2));
  const complete = Object.keys(words).length === scenes.length;
  if (complete) writeFileSync(join(DATA, 'words.json'), JSON.stringify(words, null, 1));
  else console.log('sin timestamps completos: corre scripts/align.py para words.json');
  console.log(`listo: ${DATA}/narration.json${complete ? ' + words.json' : ''}`);
} else {
  console.log(`listo (parcial): ${OUT}. Para narration.json/words.json completos corre sin --only/--probe, o SKIP_SYNTH=1 ./scripts/tts.sh + align.py`);
}
