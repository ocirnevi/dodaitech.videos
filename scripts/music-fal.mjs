// Cama musical con ElevenLabs Music vía fal.ai ($0.60 por minuto de salida, redondeado hacia arriba).
// Diseñada para seguir los tiempos del guion: hook → descenso → giro (re-hook) → tensión → payoff → cola en loop.
//   node --env-file=<.env> scripts/music-fal.mjs            # DRY RUN: imprime plan y costo
//   node --env-file=<.env> scripts/music-fal.mjs --yes [--variant plan|prompt|both] [--out public/music/ai-iceberg]
import 'dotenv/config';
import {fal} from '@fal-ai/client';
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const YES = args.includes('--yes');
const VARIANT = flag('--variant', 'both');
const OUT = resolve(ROOT, flag('--out', 'public/music/ai-iceberg'));
const BPM = 120; // 15 frames por beat a 30 fps

// Secciones alineadas al guion de docs/briefs/ai-iceberg.md (ms). Total 46 s.
const GLOBAL_POS = [
  'cinematic minimal electronic documentary underscore', `${BPM} BPM`, 'C minor', 'four-on-the-floor soft kick',
  'sidechained warm analog pad', 'ticking closed hi-hats', 'deep clean sub bass', 'dry modern mix', 'subtle tension',
  'instrumental', 'great production quality',
];
const GLOBAL_NEG = ['vocals', 'lyrics', 'singing', 'lead melody', 'guitar', 'orchestral epic', 'cheesy', 'lo-fi hiss', 'reverb wash', 'busy arrangement'];
// v2 (ajuste tras analizar v1: el modelo adelantó el giro a 16 s y el payoff a 32 s, y dejó silencio al final)
const V2 = args.includes('--v2');
const sections = V2
  ? [
      {section_name: 'Hook', duration_ms: 6000, positive_local_styles: ['starts immediately with a single deep kick hit on the downbeat', 'sparse pulse', 'low drone', 'space for narration'], negative_local_styles: ['intro swell', 'fade in']},
      {section_name: 'Descent A', duration_ms: 16000, positive_local_styles: ['steady minimal pulse', 'soft kick every beat', 'quiet pad', 'small ticking percussion', 'understated', 'no change'], negative_local_styles: ['build', 'climax', 'new layers']},
      {section_name: 'Turn', duration_ms: 4000, positive_local_styles: ['short filter sweep riser', 'new hi-hat layer enters', 'tension rises', 'one bass drop on the last beat'], negative_local_styles: ['vocals']},
      {section_name: 'Descent B', duration_ms: 12000, positive_local_styles: ['denser pulse', 'ticking sixteenth hi-hats', 'darker pad', 'sub bass pulses', 'tension holds', 'still space for narration'], negative_local_styles: ['climax', 'melody']},
      {section_name: 'Breath', duration_ms: 3000, positive_local_styles: ['everything drops out except the low drone and a quiet ticking', 'suspense', 'held breath'], negative_local_styles: ['kick', 'hi-hats']},
      {section_name: 'Payoff', duration_ms: 5000, positive_local_styles: ['impact hit on the downbeat', 'pad opens wide and bright', 'full pulse returns', 'resolution'], negative_local_styles: ['vocals']},
      {section_name: 'Loop tail', duration_ms: 4000, positive_local_styles: ['returns to the sparse hook pulse with the same low drone', 'keeps playing at the same level', 'ends on a downbeat so it loops seamlessly'], negative_local_styles: ['silence', 'fade out', 'ending flourish', 'ritardando']},
    ]
  : [
      {section_name: 'Hook', duration_ms: 6000, positive_local_styles: ['starts immediately with a single deep kick hit on the downbeat', 'sparse pulse', 'low drone', 'space for narration'], negative_local_styles: ['intro swell', 'fade in']},
      {section_name: 'Descent A', duration_ms: 14000, positive_local_styles: ['steady minimal pulse', 'soft kick every beat', 'quiet pad', 'small ticking percussion', 'understated'], negative_local_styles: ['build', 'climax']},
      {section_name: 'Turn', duration_ms: 4000, positive_local_styles: ['short filter sweep riser', 'new hi-hat layer enters', 'tension rises', 'one bass drop on the last beat'], negative_local_styles: ['vocals']},
      {section_name: 'Descent B', duration_ms: 14000, positive_local_styles: ['denser pulse', 'ticking sixteenth hi-hats', 'darker pad', 'sub bass pulses', 'tension holds', 'still space for narration'], negative_local_styles: ['climax', 'melody']},
      {section_name: 'Payoff', duration_ms: 5000, positive_local_styles: ['impact hit on the downbeat', 'pad opens wide and bright', 'kick drops out for two beats then returns', 'resolution'], negative_local_styles: ['vocals']},
      {section_name: 'Loop tail', duration_ms: 3000, positive_local_styles: ['returns to the sparse hook pulse', 'ends clean on a downbeat so it loops seamlessly into the start'], negative_local_styles: ['fade out', 'ending flourish']},
    ];
const total = sections.reduce((a, s) => a + s.duration_ms, 0);
const prompt = `Cinematic minimal electronic documentary underscore, ${BPM} BPM, C minor, instrumental only, ${total / 1000} seconds. ` +
  `Start immediately with just one deep kick hit on the downbeat and a low drone, no intro swell. Keep a steady four-on-the-floor soft kick, sidechained warm analog pad and ticking closed hi-hats, dry modern mix, lots of space for a narrator. ` +
  `At 20 seconds bring in a short filter-sweep riser and a new hi-hat layer, tension rises. From 24 to 38 seconds get denser and darker with sub bass pulses, no melody. ` +
  `At 38 seconds land an impact hit on the downbeat, pad opens wide and bright, kick drops out for two beats then returns. Last 3 seconds return to the sparse hook pulse and end clean on a downbeat so it loops. No vocals, no guitar, no orchestral epic.`;

const minutes = Math.ceil(total / 60000);
const n = VARIANT === 'both' ? 2 : 1;
console.log(`fal-ai/elevenlabs/music · ${total / 1000}s · ${BPM} BPM · variante(s): ${VARIANT} · costo ≈ $${(0.6 * minutes * n).toFixed(2)} USD`);
console.log(sections.map((s) => `  ${s.section_name}: ${s.duration_ms / 1000}s`).join('\n'));
if (!YES) { console.log('DRY RUN. Agrega --yes para generar.'); process.exit(0); }
if (!process.env.FAL_KEY) throw new Error('Falta FAL_KEY');
fal.config({credentials: process.env.FAL_KEY});
mkdirSync(OUT, {recursive: true});

const jobs = [];
const planSections = sections.map((s) => ({...s, lines: []})); // instrumental: sin letras, pero el campo es obligatorio
if (VARIANT === 'plan' || VARIANT === 'both') jobs.push([V2 ? 'plan-v2' : 'plan', {composition_plan: {positive_global_styles: GLOBAL_POS, negative_global_styles: GLOBAL_NEG, sections: planSections}, respect_sections_durations: true, output_format: 'mp3_44100_192'}]);
if (VARIANT === 'prompt' || VARIANT === 'both') jobs.push(['prompt', {prompt, music_length_ms: total, force_instrumental: true, output_format: 'mp3_44100_192'}]);
for (const [name, input] of jobs) {
  process.stdout.write(`  generando ${name}… `);
  const {data} = await fal.subscribe('fal-ai/elevenlabs/music', {input});
  const res = await fetch(data.audio.url);
  const mp3 = join(OUT, `${name}.mp3`);
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-ar', '48000', join(OUT, `${name}.wav`)]);
  writeFileSync(join(OUT, `${name}.request.json`), JSON.stringify(input, null, 1));
  console.log('ok →', mp3);
}
console.log(`listo. Analiza con: ~/.pyenv/versions/3.12.13/bin/python scripts/analyze-music.py ${OUT}/plan.wav`);
