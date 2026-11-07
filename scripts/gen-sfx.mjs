// Kit mínimo de SFX sintetizado (WAV 16-bit mono). Cero descargas, determinista.
// Basado en el patrón del skill remotion-motion-graphics.
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sfx');
mkdirSync(OUT, {recursive: true});
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const wav = (samples) => {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  return buf;
};
const secs = (s) => Math.round(s * SR);
const write = (name, out) => writeFileSync(join(OUT, name), wav(out));

// whoosh: ráfaga de ruido filtrada con barrido
{ const N = secs(0.38); const o = new Float32Array(N); let lp = 0;
  for (let i = 0; i < N; i++) { const t = i / N; const env = Math.sin(Math.PI * Math.pow(t, 0.6)) ** 2; const c = 0.04 + 0.3 * Math.sin(Math.PI * t); lp += c * (rnd() - lp); o[i] = lp * env * 0.9; }
  write('whoosh.wav', o); }
// pop: seno con caída de tono
{ const N = secs(0.13); const o = new Float32Array(N); let p = 0;
  for (let i = 0; i < N; i++) { const t = i / N; p += (2 * Math.PI * (720 - 400 * t)) / SR; o[i] = Math.sin(p) * Math.exp(-t * 9) * 0.75; }
  write('pop.wav', o); }
// tick: blip agudo
{ const N = secs(0.045); const o = new Float32Array(N); let p = 0;
  for (let i = 0; i < N; i++) { const t = i / N; p += (2 * Math.PI * 2100) / SR; o[i] = Math.sin(p) * Math.exp(-t * 14) * 0.45; }
  write('tick.wav', o); }
// bass: golpe grave
{ const N = secs(0.5); const o = new Float32Array(N); let p = 0;
  for (let i = 0; i < N; i++) { const t = i / N; p += (2 * Math.PI * (80 - 30 * t)) / SR; o[i] = (Math.sin(p) + 0.3 * Math.sin(2 * p)) * Math.exp(-t * 6) * 0.9; }
  write('bass.wav', o); }
// riser: ruido + tono ascendente, 0.6 s, para antes de un corte
{ const N = secs(0.6); const o = new Float32Array(N); let p = 0, lp = 0;
  for (let i = 0; i < N; i++) { const t = i / N; p += (2 * Math.PI * (180 + 900 * t * t)) / SR; lp += (0.02 + 0.2 * t) * (rnd() - lp); o[i] = (0.35 * Math.sin(p) + 0.9 * lp) * Math.pow(t, 1.6) * 0.8; }
  write('riser.wav', o); }
// shimmer: acorde brillante corto para el título
{ const N = secs(0.9); const o = new Float32Array(N);
  for (const f of [880, 1108.7, 1318.5, 1760]) { let p = rnd() * Math.PI; for (let i = 0; i < N; i++) { const t = i / N; p += (2 * Math.PI * f) / SR; o[i] += Math.sin(p) * Math.exp(-t * 4) * 0.12; } }
  write('shimmer.wav', o); }
console.log('SFX en', OUT);
