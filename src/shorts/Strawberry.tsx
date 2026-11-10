import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../components/Sfx';
import type {Word} from '../script';
import {useBrand, usePalette, type Brand} from '../theme';
import {Headline} from './AiMemory';
import {FollowBrand, SceneLabel, SOFT, Stage, clamp01, makeShort, trig, trigAfter, useCopy, useSp, type SceneProps, type ShortConfig} from './kit';

/**
 * "Strawberries beat oranges on vitamin C" — guion de Enrico (10 nov). Fábrica para Hello Nutrition AI y Mi Nutriólogo.
 * Protagonista: la balanza fresa vs naranja. Cifras USDA (59 vs 53 mg/100 g) que aparecen DESPUÉS de que el karaoke las dice.
 * Rojo de la fresa y naranja de la naranja = color del objeto (excepción como el limón), el acento de marca sigue verde.
 * Bloques: el dato (claro) · para qué sirve: colágeno, hierro (oscuro) · el consejo (claro).
 */
export type StrawberryCopy = {
  hook: {lines: string[]; oranges: string};
  yep: {lines: string[]; win: string};
  numbers: {n1: string; n2: string; oranges: string};
  more: {lines: string[]; immune: string};
  collagen: {collagen: string; words: [string, string, string]};
  iron: {lines: string[]; absorb: string};
  boost: {lines: string[]; word: string};
  follow: {nameLines: string[]; nameWord: string; sub: string; subWord: string};
};
const RED = '#E74D3C';
const ORANGE = '#F39A2B';

/* ---------- Piezas ---------- */
const Berry: React.FC<{x: number; y: number; s?: number; o?: number; rot?: number}> = ({x, y, s = 1, o = 1, rot = 0}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <path d="M 0 80 C -60 50 -80 -10 -64 -40 C -50 -66 -20 -60 0 -52 C 20 -60 50 -66 64 -40 C 80 -10 60 50 0 80 Z" fill={RED} stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
      {[[-30, -20], [0, -26], [30, -20], [-40, 6], [-12, 0], [16, 4], [40, 8], [-22, 30], [8, 30], [-4, 56], [24, 34]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={3.5} ry={6} fill="#FFE6A8" />)}
      <path d="M 0 -52 L -40 -74 L -16 -60 L -20 -86 L 0 -64 L 20 -86 L 16 -60 L 40 -74 Z" fill={b.accent} stroke={b.accentDeep} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
};
const Orange: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle r={72} fill={ORANGE} stroke="rgba(0,0,0,0.2)" strokeWidth={4} />
      <circle r={58} fill="#FBC77A" />
      {Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 4) * 56} y2={Math.sin((i * Math.PI) / 4) * 56} stroke={ORANGE} strokeWidth={4} />)}
      <circle r={8} fill="#FFF3D6" />
      <path d="M 10 -70 C 30 -100 60 -96 70 -86 C 50 -70 30 -66 10 -70 Z" fill={b.accent} />
    </g>
  );
};
const Scale: React.FC<{x: number; y: number; tilt: number; o?: number; children?: [React.ReactNode, React.ReactNode]; labels?: [string, string]}> = ({x, y, tilt, o = 1, children, labels}) => {
  const b = useBrand();
  const p = usePalette('light');
  const a = (tilt * Math.PI) / 180;
  const L = 290;
  const lx = -Math.cos(a) * L, ly = -Math.sin(a) * L, rx = Math.cos(a) * L, ry = Math.sin(a) * L;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d="M -60 330 H 60 L 20 300 V 0 H -20 V 300 Z" fill={p.surface} stroke={p.text} strokeWidth={6} strokeLinejoin="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={p.text} strokeWidth={12} strokeLinecap="round" />
      <circle r={20} fill={b.accent} />
      {[[lx, ly, 0], [rx, ry, 1]].map(([px, py, i]) => (
        <g key={i} transform={`translate(${px} ${py})`}>
          <path d="M 0 0 L -80 140 M 0 0 L 80 140" stroke={p.text3} strokeWidth={4} />
          <path d="M -110 140 H 110 Q 100 180 0 184 Q -100 180 -110 140 Z" fill={b.paper} stroke={p.text} strokeWidth={6} strokeLinejoin="round" />
          <g transform="translate(0 70)">{children?.[i as number]}</g>
          {labels && <text x={0} y={174} textAnchor="middle" fontFamily={b.font} fontSize={30} fontWeight={700} fill={p.text3}>{labels[i as number]}</text>}
        </g>
      ))}
    </g>
  );
};
const Crown: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M -60 30 L -70 -30 L -32 0 L 0 -46 L 32 0 L 70 -30 L 60 30 Z" fill="#F1C40F" stroke={b.ink2} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-60} y={28} width={120} height={20} rx={6} fill="#F1C40F" stroke={b.ink2} strokeWidth={5} />
    </g>
  );
};
const CBadge: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`} opacity={o}>
      <circle r={34} fill={b.accent} />
      <text y={14} textAnchor="middle" fontFamily={b.font} fontSize={40} fontWeight={800} fill={b.onSoot}>C</text>
    </g>
  );
};
const Shield: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const p = usePalette('dark');
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M 0 -120 L 100 -80 V 0 C 100 70 50 110 0 130 C -50 110 -100 70 -100 0 V -80 Z" fill={b.soot3} stroke={p.text} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -40 0 L -10 30 L 46 -30" fill="none" stroke={b.accent} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
const Helix: React.FC<{x: number; y: number; draw: number; o?: number}> = ({x, y, draw, o = 1}) => {
  const b = useBrand();
  const frame = useCurrentFrame();
  const path = (ph: number) => Array.from({length: 61}, (_, i) => {
    const t = i / 60;
    return `${i ? 'L' : 'M'} ${-260 + 520 * t} ${Math.sin(t * Math.PI * 4 + ph + frame * 0.05) * 50}`;
  }).join(' ');
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {[0, 2.1, 4.2].map((ph, i) => <path key={i} d={path(ph)} fill="none" stroke={i === 0 ? b.accent : i === 1 ? b.accentLight : '#F5F5F7'} strokeWidth={14} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - draw)} />)}
    </g>
  );
};
const Bone: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const p = usePalette('dark');
  return (
    <g transform={`translate(${x} ${y}) rotate(-30) scale(${s})`} opacity={o} fill="#F5F5F7" stroke={p.text3} strokeWidth={3}>
      <rect x={-50} y={-12} width={100} height={24} rx={10} />
      {[[-56, -16], [-56, 16], [56, -16], [56, 16]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={20} />)}
    </g>
  );
};
const Skin: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const p = usePalette('dark');
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="none" stroke={p.text} strokeWidth={6} strokeLinecap="round">
      <circle r={64} fill={b.soot3} />
      <path d="M -24 -10 h 0.1 M 24 -10 h 0.1" strokeWidth={14} />
      <path d="M -26 22 Q 0 44 26 22" />
      <path d="M 60 -60 l 12 -12 M 74 -40 l 16 -4" stroke={b.accent} />
    </g>
  );
};
const Vessel: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const frame = useCurrentFrame();
  const p = usePalette('dark');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M -80 -26 C -20 -40 20 -10 80 -26 M -80 26 C -20 12 20 42 80 26" fill="none" stroke={p.text} strokeWidth={6} strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={-70 + ((frame * 3 + i * 40) % 140)} cy={0} r={9} fill={RED} />)}
    </g>
  );
};
const FeTile: React.FC<{x: number; y: number; size: number; glow?: number; locked?: number}> = ({x, y, size, glow = 0, locked = 0}) => {
  const b = useBrand();
  const p = usePalette('dark');
  return (
    <g transform={`translate(${x} ${y})`}>
      {glow > 0 && <rect x={-size / 2 - 30 * glow} y={-size / 2 - 30 * glow} width={size + 60 * glow} height={size + 60 * glow} rx={size * 0.2} fill={b.accent} opacity={0.2 * glow} />}
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.12} fill={p.surface} stroke={b.accent} strokeWidth={6} />
      <text x={-size / 2 + 22} y={-size / 2 + 50} fontFamily={b.font} fontSize={size * 0.12} fontWeight={600} fill={p.text3}>26</text>
      <text x={0} y={size * 0.14} textAnchor="middle" fontFamily={b.font} fontSize={size * 0.42} fontWeight={800} fill={p.text} opacity={1 - locked}>Fe</text>
      {locked > 0 && <g opacity={locked} transform={`translate(0 ${size * 0.05})`}><path d="M -30 -10 V -34 A 30 30 0 0 1 30 -34 V -10" transform={`translate(0 ${-18 * (1 - locked)})`} fill="none" stroke={b.onSoot} strokeWidth={10} /><rect x={-44} y={-12} width={88} height={70} rx={12} fill={b.onSoot} /></g>}
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<StrawberryCopy>().hook;
  const at = trig(scene, c.oranges, fps);
  const s = useSp(frame, fps, 2, 18, SOFT);
  const tip = useSp(frame, fps, at, 20, SOFT);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 14} fps={fps} size={100} />
      <Stage>
        <Scale x={540} y={760} tilt={interpolate(tip, [0, 1], [0, 12])} o={s}>{[<Berry key="b" x={0} y={-10} s={0.75} />, <Orange key="o" x={0} y={-10} s={0.75} />]}</Scale>
      </Stage>
      <Sfx name="lib/pop" at={6} volume={0.4} />
      <Sfx name="lib/coin" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Yep: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<StrawberryCopy>().yep;
  const at = trig(scene, c.win, fps);
  const crown = useSp(frame, fps, at - 2, 16, SOFT);
  const a = (12 * Math.PI) / 180;
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 10} fps={fps} size={110} accentLine={0} />
      <Stage>
        <Scale x={540} y={760} tilt={12} labels={['100 g', '100 g']}>{[<Berry key="b" x={0} y={-10} s={0.75} />, <Orange key="o" x={0} y={-10} s={0.75} />]}</Scale>
        <Crown x={540 - Math.cos(a) * 290} y={760 - Math.sin(a) * 290 - 20 - 200 * (1 - crown)} s={0.8} o={crown} />
      </Stage>
      <Sfx name="lib/twinkle" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Numbers: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const c = useCopy<StrawberryCopy>().numbers;
  const land1 = trigAfter(scene, c.n1, fps, 10);
  const land2 = trigAfter(scene, c.oranges, fps, 6);
  const g1 = clamp01((frame - (land1 - 24)) / 24);
  const g2 = clamp01((frame - (land2 - 24)) / 24);
  const rows: [React.ReactNode, number, number, number, string][] = [[<Berry key="b" x={0} y={0} s={0.6} />, 59, g1, land1, RED], [<Orange key="o" x={0} y={0} s={0.6} />, 53, g2, land2, ORANGE]];
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Stage>
        {rows.map(([icon, val, g, land, col], i) => {
          const y = 760 + i * 250;
          const shown = frame >= land ? val : Math.round(val * Math.min(0.9, (g as number)));
          return (
            <g key={i}>
              <g transform={`translate(190 ${y})`}>{icon}</g>
              <rect x={290} y={y - 46} width={470} height={92} rx={46} fill={b.paper} stroke={p.lineStrong} strokeWidth={3} />
              <rect x={298} y={y - 38} width={454 * (val / 59) * (g as number)} height={76} rx={38} fill={col as string} opacity={0.85} />
              <text x={780} y={y + 20} textAnchor="start" fontFamily={b.font} fontSize={56} fontWeight={800} fill={frame >= (land as number) ? p.text : 'transparent'}>{shown}<tspan fontSize={30} fontWeight={600} fill={p.text3}> mg</tspan></text>
            </g>
          );
        })}
        <text x={540} y={1190} textAnchor="middle" fontFamily={b.font} fontSize={26} fill={p.text3}>USDA FoodData Central</text>
      </Stage>
      <Sfx name="lib/coin" at={land1} volume={0.45} />
      <Sfx name="tick" at={land2} volume={0.45} />
    </AbsoluteFill>
  );
};

const More: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const c = useCopy<StrawberryCopy>().more;
  const at = trig(scene, c.immune, fps);
  const sh = useSp(frame, fps, Math.min(at, 30) - 4, 16, SOFT);
  const plus = useSp(frame, fps, at + 10, 12);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="dark" frame={frame + 10} fps={fps} size={110} />
      <Stage>
        <Shield x={430} y={920} s={1.1 * sh + 0.01} o={sh} />
        <text x={720} y={960} textAnchor="middle" fontFamily={b.font} fontSize={180} fontWeight={800} fill={b.accent} opacity={plus}>+</text>
      </Stage>
      <Sfx name="lib/glassy-snap" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Collagen: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<StrawberryCopy>().collagen;
  const at = trig(scene, c.collagen, fps);
  const draw = clamp01((frame - at + 4) / 24);
  const ats = c.words.map((w) => trig(scene, w, fps));
  const icons = [Skin, Bone, Vessel];
  const xs = [250, 540, 830];
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Stage>
        <Helix x={540} y={720} draw={1} o={0.22 * useSp(frame, fps, 0, 12, SOFT) * (1 - draw)} />
        <Helix x={540} y={720} draw={draw} />
        {icons.map((Icon, i) => {
          const s = useSp(frame, fps, ats[i] - 2, 14, SOFT);
          return <g key={i} transform={`translate(0 ${interpolate(s, [0, 1], [40, 0])})`}><Icon x={xs[i]} y={1020} s={1} o={s} /></g>;
        })}
      </Stage>
      <Sfx name="lib/woosh" at={at} volume={0.35} />
      {ats.map((a, i) => <Sfx key={i} name="lib/pop" at={a} volume={0.45} />)}
    </AbsoluteFill>
  );
};

const Iron: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<StrawberryCopy>().iron;
  const at = trig(scene, c.absorb, fps);
  const open = useSp(frame, fps, at, 14);
  const enter = useSp(frame, fps, 0, 14);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="dark" frame={frame - at + 6} fps={fps} size={100} accentLine={1} />
      <Stage>
        <g opacity={enter}><FeTile x={560} y={940} size={300} glow={open} locked={1 - open} /></g>
        <CBadge x={330} y={760} s={1.6 * enter} o={enter} />
        <Berry x={330} y={1100} s={0.9} o={enter} rot={-10} />
      </Stage>
      <Sfx name="lib/glassy-snap" at={at} volume={0.5} />
    </AbsoluteFill>
  );
};

const Boost: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const c = useCopy<StrawberryCopy>().boost;
  const at = trig(scene, c.word, fps);
  const bowl = useSp(frame, fps, 2, 16, SOFT);
  const badge = useSp(frame, fps, at, 14);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 10} fps={fps} size={110} />
      <Stage>
        <g opacity={bowl} transform={`translate(0 ${interpolate(bowl, [0, 1], [50, 0])})`}>
          {[[420, 900, -14], [540, 880, 6], [660, 900, 18], [480, 940, 10], [600, 945, -8]].map(([x, y, r], i) => <Berry key={i} x={x} y={y} s={0.75} rot={r} />)}
          <path d="M 300 940 A 240 170 0 0 0 780 940 Z" fill={b.paper} stroke={p.text} strokeWidth={8} strokeLinejoin="round" />
          <path d="M 470 1130 H 610" stroke={p.text} strokeWidth={8} strokeLinecap="round" />
        </g>
        <CBadge x={800} y={760} s={1.5 * badge} o={badge} />
      </Stage>
      <Sfx name="lib/coin" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Follow: React.FC<SceneProps> = (props) => {
  const c = useCopy<StrawberryCopy>().follow;
  return <FollowBrand {...props} nameLines={c.nameLines} nameWord={c.nameWord} sub={c.sub} subWord={c.subWord} />;
};

export const makeStrawberry = (cfg: {script: ShortConfig['script']; narration: ShortConfig['narration']; words: Record<string, Word[]>; beats: ShortConfig['beats']; brand: Brand; copy: StrawberryCopy}) =>
  makeShort({...cfg, scenes: {hook: Hook, yep: Yep, numbers: Numbers, more: More, collagen: Collagen, iron: Iron, boost: Boost, close: Follow}, bass: ['more', 'boost'], levels: [{id: 'more', base: 0.3}, {id: 'boost', base: 0.36}], riserAt: 'more'});
