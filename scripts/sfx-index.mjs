// Índice y selector de SFX sobre librerías locales (Sonniss GDC, Freesound CC0 descargados, etc.).
//   node scripts/sfx-index.mjs index [dir]            → library/sfx-index.json (nombre, ruta, duración, tamaño, vendor)
//   node scripts/sfx-index.mjs pick <palabras> [--max 2.0] [--min 0.1] [--n 10]   → candidatos por palabra clave en nombre/carpeta
//   node scripts/sfx-index.mjs kit                     → copia a public/sfx/ el mejor candidato por categoría del kit (whoosh, impact, tick, riser, pop, glitch, shimmer, reverse, notification, shutter)
import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {basename, dirname, extname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_DIR = resolve(ROOT, '..', 'dodaitech.assets');
const INDEX = join(ROOT, 'library', 'sfx-index.json');
const [cmd = 'index', ...rest] = process.argv.slice(2);
const flag = (k, d) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (['.wav', '.flac', '.aif', '.aiff', '.mp3', '.ogg'].includes(extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
};
const dur = (p) => {
  try { return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString()); } catch { return null; }
};

if (cmd === 'index') {
  const dir = resolve(rest[0] && !rest[0].startsWith('--') ? rest[0] : DEFAULT_DIR);
  const files = walk(dir);
  console.log(`${files.length} archivos de audio en ${dir}`);
  const items = files.map((p, i) => {
    if (i % 200 === 0) process.stdout.write(`  ${i}/${files.length}\r`);
    const rel = relative(dir, p);
    return {name: basename(p, extname(p)), path: p, rel, vendor: rel.split('/')[0], duration: dur(p), size: statSync(p).size};
  });
  mkdirSync(dirname(INDEX), {recursive: true});
  writeFileSync(INDEX, JSON.stringify({root: dir, count: items.length, items}, null, 0));
  console.log(`\níndice → ${INDEX}`);
} else {
  if (!existsSync(INDEX)) throw new Error('Primero: node scripts/sfx-index.mjs index <dir>');
  const {items} = JSON.parse(readFileSync(INDEX, 'utf8'));
  const norm = (s) => s.toLowerCase().replace(/[_\-.]/g, ' ');
  const search = (words, {min = 0.05, max = 3, n = 10} = {}) => {
    const ws = words.map((w) => w.toLowerCase());
    return items
      .filter((it) => it.duration != null && it.duration >= min && it.duration <= max)
      .map((it) => {
        const hay = norm(it.rel);
        const score = ws.reduce((a, w) => a + (hay.includes(w) ? 1 : 0), 0) + (norm(it.name).startsWith(ws[0]) ? 0.5 : 0);
        return {...it, score};
      })
      .filter((it) => it.score >= 1)
      .sort((a, b) => b.score - a.score || a.duration - b.duration)
      .slice(0, n);
  };
  if (cmd === 'pick') {
    const words = rest.filter((w) => !w.startsWith('--') && isNaN(Number(w)));
    const res = search(words, {min: Number(flag('--min', 0.05)), max: Number(flag('--max', 3)), n: Number(flag('--n', 10))});
    for (const r of res) console.log(`${r.duration.toFixed(2)}s  ${r.rel}`);
    if (!res.length) console.log('sin resultados');
  } else if (cmd === 'kit') {
    // categorías del kit mínimo (docs/03-sonido.md) → palabras clave de búsqueda
    const KIT = {
      whoosh: [['whoosh', 'swish', 'swoosh'], 0.15, 0.6],
      'whoosh-long': [['whoosh', 'transition', 'sweep'], 0.6, 1.5],
      impact: [['impact', 'hit', 'boom', 'thud'], 0.3, 2.0],
      bass: [['sub', 'bass', 'drop', 'boom'], 0.4, 2.5],
      tick: [['tick', 'click', 'blip'], 0.03, 0.3],
      pop: [['pop', 'bubble', 'plop'], 0.05, 0.4],
      glitch: [['glitch', 'stutter', 'static'], 0.1, 0.5],
      riser: [['riser', 'rise', 'build', 'uplifter'], 1.0, 4.0],
      shimmer: [['shimmer', 'sparkle', 'chime', 'magic'], 0.4, 2.0],
      reverse: [['reverse', 'rev'], 0.3, 2.0],
      notification: [['notification', 'alert', 'ding', 'ui'], 0.1, 1.0],
      shutter: [['shutter', 'camera', 'photo'], 0.1, 1.0],
    };
    mkdirSync(join(ROOT, 'public', 'sfx', 'lib'), {recursive: true});
    const chosen = {};
    for (const [cat, [words, min, max]] of Object.entries(KIT)) {
      const [best] = search(words, {min, max, n: 1});
      if (!best) { console.log(`${cat}: sin candidato`); continue; }
      const dest = join(ROOT, 'public', 'sfx', 'lib', `${cat}.wav`);
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', best.path, '-ar', '48000', '-ac', '1', '-af', 'silenceremove=start_periods=1:start_threshold=-50dB', dest]);
      chosen[cat] = {source: best.rel, duration: best.duration};
      console.log(`${cat}: ${best.rel} (${best.duration.toFixed(2)}s)`);
    }
    writeFileSync(join(ROOT, 'public', 'sfx', 'lib', 'kit.json'), JSON.stringify(chosen, null, 1));
  }
}
