// Narración con ElevenLabs a través de fal.ai (mismo proveedor que usas en Mia Studio).
// Por defecto es un DRY RUN: imprime caracteres y costo estimado y no llama a fal.
// Para generar de verdad:  node scripts/tts-fal.mjs --yes [--voice Brian] [--model multilingual-v2|eleven-v3|turbo-v2.5] [--speed 1.08]
// Luego: SKIP_SYNTH=1 npm run tts && npm run align   (re-mide duraciones y alinea palabras)
import 'dotenv/config';
import {fal} from '@fal-ai/client';
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync, readFileSync, existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const YES = args.includes('--yes');
const MODEL = flag('--model', 'multilingual-v2'); // multilingual-v2 y turbo-v2.5 aceptan speed/style; eleven-v3 no
const script = JSON.parse(readFileSync(join(ROOT, 'script', 'chip-supply-chain.json'), 'utf8'));
const VOICE = flag('--voice', process.env.VOICE || script.voice || 'Brian');
const LANG = (script.language || 'en-US').slice(0, 2);
const SPEED = Number(flag('--speed', '1.05'));
const ONLY = flag('--only', null); // --only intro  (una escena) · --probe 'texto' (prueba mínima de voz)
const PROBE = flag('--probe', null);
const PRICE = {'multilingual-v2': 0.1, 'eleven-v3': 0.1, 'turbo-v2.5': 0.05}[MODEL];
if (!PRICE) throw new Error(`modelo desconocido: ${MODEL}`);

const scenes = PROBE ? [{id: 'probe', narration: PROBE}] : ONLY ? script.scenes.filter((s) => s.id === ONLY) : script.scenes;
const chars = scenes.reduce((a, s) => a + s.narration.length, 0);
const cost = (chars / 1000) * PRICE;
console.log(`modelo fal-ai/elevenlabs/tts/${MODEL} · voz ${VOICE} · ${scenes.length} escenas · ${chars} caracteres · ≈ $${cost.toFixed(3)} USD`);
if (!YES) {
  console.log('DRY RUN. Agrega --yes para generar.');
  process.exit(0);
}
if (!process.env.FAL_KEY) throw new Error('Falta FAL_KEY (ponla en .env, ver .env.example)');
fal.config({credentials: process.env.FAL_KEY});

const OUT = join(ROOT, 'public', 'narration');
mkdirSync(OUT, {recursive: true});
for (const s of scenes) {
  const input = {text: s.narration, voice: VOICE, language_code: LANG, stability: 0.5, timestamps: true, apply_text_normalization: 'on'};
  if (MODEL !== 'eleven-v3') Object.assign(input, {similarity_boost: 0.75, style: 0.25, speed: SPEED});
  process.stdout.write(`  ${s.id} (${s.narration.length} chars)… `);
  const {data} = await fal.subscribe(`fal-ai/elevenlabs/tts/${MODEL}`, {input});
  const res = await fetch(data.audio.url);
  const mp3 = join(OUT, `${s.id}.mp3`);
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  // WAV 48 kHz mono como el resto del pipeline
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-ar', '48000', '-ac', '1', join(OUT, `${s.id}.wav`)]);
  if (data.timestamps) writeFileSync(join(OUT, `${s.id}.fal-timestamps.json`), JSON.stringify(data.timestamps, null, 1));
  console.log('ok');
}
console.log(`listo. Ahora: SKIP_SYNTH=1 npm run tts && npm run align`);
if (existsSync(join(ROOT, 'src', 'narration.json'))) console.log('(narration.json se actualizará con las duraciones nuevas)');
