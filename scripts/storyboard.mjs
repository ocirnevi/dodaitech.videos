// Storyboard sheet: una imagen con un panel por beat (frame real renderizado) numerado y con su
// tiempo, escena, beat y subtítulo. Es el artefacto de aprobación antes de renderizar el video.
//   node scripts/storyboard.mjs [--script script/chip-supply-chain.json] [--comp ChipSupplyChain] [--cols 4] [--out out/storyboard.png]
//   node scripts/storyboard.mjs --frames 12,318,644      (paneles en frames concretos)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const SCRIPT = resolve(ROOT, flag('--script', 'script/chip-supply-chain.json'));
const COMP = flag('--comp', 'ChipSupplyChain');
const COLS = Number(flag('--cols', '4'));
const OUT = resolve(ROOT, flag('--out', 'out/storyboard.png'));
const TAIL = 14; // debe coincidir con TAIL_FRAMES en src/script.ts

const script = JSON.parse(readFileSync(SCRIPT, 'utf8'));
const SLUG = script.id;
const narration = JSON.parse(readFileSync(join(ROOT, 'src/data', SLUG, 'narration.json'), 'utf8'));
const words = existsSync(join(ROOT, 'src/data', SLUG, 'words.json')) ? JSON.parse(readFileSync(join(ROOT, 'src/data', SLUG, 'words.json'), 'utf8')) : {};
const fps = script.fps;
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// 1. Plan de paneles: por escena, un establecimiento + un panel por beat (24 frames después de la palabra).
//    Si el guion trae targetStart (Shorts pegados a la música) se replica la regla de src/shorts/script.ts.
const GAP = 8;
const beatsPath = script.beatsFile ? join(ROOT, 'public', script.beatsFile) : null;
const beatFramesList = beatsPath && existsSync(beatsPath) ? JSON.parse(readFileSync(beatsPath, 'utf8')).beats.map((b) => Math.round(b * fps)) : [];
const snap = (frame, minFrame) => {
  const c = beatFramesList.filter((b) => b >= minFrame && Math.abs(b - frame) <= 8);
  if (!c.length) return Math.max(frame, minFrame);
  return c.reduce((best, b) => (Math.abs(b - frame) < Math.abs(best - frame) ? b : best));
};
let cursor = 0;
let prevEnd = 0;
const panels = [];
for (const [idx, scene] of script.scenes.entries()) {
  const audioFrames = Math.ceil(narration[scene.id].durationInSeconds * fps);
  let from;
  if (scene.targetStart != null) {
    from = idx === 0 ? 0 : snap(Math.max(prevEnd, Math.round(scene.targetStart * fps)), prevEnd);
    prevEnd = from + audioFrames + GAP;
  } else {
    from = cursor;
    cursor += audioFrames + TAIL;
  }
  const ws = words[scene.id] ?? [];
  const trig = (t) => {
    const w = ws.find((x) => norm(x.word).includes(norm(t)));
    return w ? Math.round(w.start * fps) : 0;
  };
  const captionAt = (local) => {
    const sec = local / fps;
    const i = ws.findIndex((w) => w.start <= sec && sec < w.end + 0.15);
    if (i < 0) return '';
    return ws.slice(Math.max(0, i - 2), i + 3).map((w, k) => (k === Math.min(2, i) ? `[${w.word}]` : w.word)).join(' ');
  };
  const add = (local, label) => panels.push({frame: from + local, scene: scene.id, label, caption: captionAt(local)});
  add(Math.min(14, audioFrames - 1), 'apertura');
  for (const b of scene.beats ?? []) add(trig(b.trigger) + 24, `beat "${b.trigger}" → ${b.kind === 'counter' ? `${b.prefix ?? ''}${b.value}${b.suffix ?? ''} ${b.label}` : b.text}`);
  if (!(scene.beats ?? []).length && audioFrames > 40) add(Math.round(audioFrames * 0.6), 'desarrollo');
}
if (script.scenes[0]?.targetStart != null) panels.push({frame: prevEnd + 20, scene: 'outro', label: 'outro dodaitech', caption: ''});
const explicit = flag('--frames', null);
const plan = explicit ? explicit.split(',').map((f, i) => ({frame: Number(f), scene: '', label: `frame ${f}`, caption: ''})) : panels;

// 2. Render de cada panel (un solo bundle).
const dir = join(ROOT, 'public', 'storyboard');
mkdirSync(dir, {recursive: true});
console.log(`bundling…`);
const serveUrl = await bundle({entryPoint: join(ROOT, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: COMP, chromiumOptions: {gl: 'angle'}, browserExecutable: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const SHEET_ONLY = args.includes('--sheet-only');
const manifest = [];
for (const [i, p] of plan.entries()) {
  const file = `panel-${String(i + 1).padStart(2, '0')}.png`;
  process.stdout.write(`  panel ${i + 1}/${plan.length} frame ${p.frame}… `);
  if (!SHEET_ONLY) await renderStill({composition, serveUrl, frame: Math.min(p.frame, composition.durationInFrames - 1), output: join(dir, file), imageFormat: 'png', chromiumOptions: {gl: 'angle'}, browserExecutable: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  manifest.push({...p, n: i + 1, src: `storyboard/${file}`, time: (p.frame / fps).toFixed(1)});
  console.log('ok');
}
writeFileSync(join(dir, 'manifest.json'), JSON.stringify({title: script.title, comp: COMP, width: composition.width, height: composition.height, cols: COLS, panels: manifest}, null, 1));

// 3. La hoja: composición Remotion que dibuja la retícula con etiquetas. Segundo bundle (rápido, con caché)
//    para que public/storyboard/ con los paneles recién renderizados quede dentro del bundle.
const serveUrl2 = await bundle({entryPoint: join(ROOT, 'src/index.ts')});
const props = {manifest: 'storyboard/manifest.json'};
const sheet = await selectComposition({serveUrl: serveUrl2, id: 'StoryboardSheet', inputProps: props, browserExecutable: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
mkdirSync(dirname(OUT), {recursive: true});
await renderStill({composition: sheet, serveUrl: serveUrl2, frame: 0, output: OUT, imageFormat: 'png', inputProps: props, browserExecutable: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
console.log(`storyboard → ${OUT}  (${plan.length} paneles)`);
