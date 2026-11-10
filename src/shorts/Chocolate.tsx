import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Sfx} from '../components/Sfx';
import type {Word} from '../script';
import {useBrand, usePalette, type Brand} from '../theme';
import {Headline} from './AiMemory';
import {Check, FollowBrand, SceneLabel, SOFT, Stage, TurnLine, clamp01, makeShort, trig, trigAfter, useCopy, useSp, type SceneProps, type ShortConfig} from './kit';

/**
 * "Dark chocolate: the right kind matters" — guion de Enrico (10 nov). Fábrica para Hello Nutrition AI y Mi Nutriólogo.
 * Protagonista: la barra de chocolate (oscura vs con leche) y las moléculas de flavanol (hexágonos verdes).
 * Bloques: la sorpresa y el detalle (claro) · por qué: flavanoles y flujo, el azúcar (oscuro) · qué buscar y el matiz (claro/oscuro) · disfrutar bien (claro).
 * Café del chocolate = color del objeto; el acento de marca sigue verde. "70%+" entra después de que el karaoke lo dice.
 */
export type ChocolateCopy = {
  hook: {lines: string[]; health: string};
  catch: {lines: string[]; equal: string};
  flavanols: {flavanols: string; flow: string};
  sugar: {lines: string[]; sugar: string; cocoa: string};
  look: {lines: string[]};
  checklist: {lines: string[]; higher: string; sugar: string; small: string};
  remember: {lines: string[]; word: string; tags: [string, string]};
  enjoy: {lines: string[]; word: string};
  right: {lines: string[]; word: string};
  follow: {nameLines: string[]; nameWord: string; sub: string; subWord: string};
};
const DARK = '#4A2C1F';
const MILK = '#A9754E';
const RED = '#E74D3C';

/* ---------- Piezas ---------- */
const Bar: React.FC<{x: number; y: number; s?: number; o?: number; color?: string; cols?: number; rows?: number; rot?: number; bite?: boolean}> = ({x, y, s = 1, o = 1, color = DARK, cols = 3, rows = 4, rot = 0, bite = false}) => {
  const cw = 80, ch = 70;
  const w = cols * cw, h = rows * ch;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={h + 20} rx={18} fill={color} />
      {Array.from({length: rows * cols}).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        if (bite && c === cols - 1 && r === 0) return null;
        return <rect key={i} x={-w / 2 + c * cw + 6} y={-h / 2 + r * ch + 6} width={cw - 12} height={ch - 12} rx={8} fill="rgba(255,255,255,0.10)" stroke="rgba(0,0,0,0.25)" strokeWidth={3} />;
      })}
      {bite && <circle cx={w / 2} cy={-h / 2} r={56} fill="var(--bite, transparent)" />}
    </g>
  );
};
const Heart: React.FC<{x: number; y: number; s?: number; o?: number; color?: string}> = ({x, y, s = 1, o = 1, color}) => {
  const b = useBrand();
  return <path transform={`translate(${x} ${y}) scale(${s})`} opacity={o} d="M 0 30 C -50 -10 -60 -40 -36 -56 C -18 -68 -4 -58 0 -46 C 4 -58 18 -68 36 -56 C 60 -40 50 -10 0 30 Z" fill={color ?? b.accent} />;
};
const Molecule: React.FC<{x: number; y: number; s?: number; o?: number; rot?: number}> = ({x, y, s = 1, o = 1, rot = 0}) => {
  const b = useBrand();
  const hex = (cx: number) => Array.from({length: 6}, (_, i) => `${cx + Math.cos((i * Math.PI) / 3) * 30},${Math.sin((i * Math.PI) / 3) * 30}`).join(' ');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} fill="none" stroke={b.accent} strokeWidth={6} strokeLinejoin="round">
      <polygon points={hex(-30)} />
      <polygon points={hex(30)} />
      <line x1={60} y1={0} x2={86} y2={-16} />
      <circle cx={92} cy={-20} r={7} fill={b.accent} />
    </g>
  );
};
const Pod: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(-20) scale(${s})`} opacity={o}>
    <ellipse rx={70} ry={130} fill="#8E5A2F" stroke="rgba(0,0,0,0.3)" strokeWidth={5} />
    {[-40, -14, 14, 40].map((xx) => <path key={xx} d={`M ${xx} -120 Q ${xx * 1.25} 0 ${xx} 120`} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={4} />)}
  </g>
);
const Vessel: React.FC<{x: number; y: number; w: number; speed: number; widen: number; o?: number}> = ({x, y, w, speed, widen, o = 1}) => {
  const frame = useCurrentFrame();
  const p = usePalette('dark');
  const hh = 50 + 26 * widen;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={`M 0 ${-hh} C ${w * 0.3} ${-hh - 14} ${w * 0.7} ${-hh + 14} ${w} ${-hh} M 0 ${hh} C ${w * 0.3} ${hh + 14} ${w * 0.7} ${hh - 14} ${w} ${hh}`} fill="none" stroke={p.text} strokeWidth={8} strokeLinecap="round" />
      {Array.from({length: 7}).map((_, i) => <circle key={i} cx={(frame * (2 + 6 * speed) + i * (w / 7)) % w} cy={Math.sin(i * 1.7) * hh * 0.4} r={14} fill={RED} />)}
    </g>
  );
};
const Cube: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const p = usePalette('dark');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} strokeLinejoin="round">
      <path d="M -30 -14 L 0 -30 L 30 -14 L 0 2 Z" fill="#FFFFFF" stroke={p.text3} strokeWidth={3} />
      <path d="M -30 -14 V 20 L 0 36 V 2 Z" fill="#E9E9EC" stroke={p.text3} strokeWidth={3} />
      <path d="M 30 -14 V 20 L 0 36 V 2 Z" fill="#D6D6DB" stroke={p.text3} strokeWidth={3} />
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<ChocolateCopy>().hook;
  const at = trig(scene, c.health, fps);
  const bar = useSp(frame, fps, 2, 18, SOFT);
  const h = useSp(frame, fps, at - 1, 14);
  const beat = 1 + 0.06 * Math.max(0, Math.sin(frame * 0.35));
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 14} fps={fps} size={104} />
      <Stage>
        <Bar x={460} y={920} s={1.05} o={bar} rot={-8} />
        <Heart x={760} y={760} s={1.6 * h * beat} o={h} />
      </Stage>
      <Sfx name="lib/pop" at={6} volume={0.4} />
      <Sfx name="lib/twinkle" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Catch: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const c = useCopy<ChocolateCopy>().catch;
  const at = trig(scene, c.equal, fps);
  const s = useSp(frame, fps, 2, 16, SOFT);
  const neq = useSp(frame, fps, at - 1, 12);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <Bar x={300} y={930} s={0.8} o={s} color={DARK} />
        <Bar x={780} y={930} s={0.8} o={s} color={MILK} />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${720 + i * 60} ${1150})`}><Cube x={0} y={0} s={1} o={neq} /></g>)}
        <text x={540} y={970} textAnchor="middle" fontFamily={b.font} fontSize={140} fontWeight={800} fill={b.accent} opacity={neq}>≠</text>
      </Stage>
      <Sfx name="lib/snap" at={at} volume={0.5} />
    </AbsoluteFill>
  );
};

const Flavanols: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<ChocolateCopy>().flavanols;
  const aFl = trig(scene, c.flavanols, fps);
  const aFlow = trig(scene, c.flow, fps);
  const pod = useSp(frame, fps, 0, 16, SOFT);
  const mol = clamp01((frame - aFl + 4) / 30);
  const flow = useSp(frame, fps, aFlow - 2, 24, SOFT);
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Stage>
        <Pod x={220} y={720} s={0.9} o={pod} />
        {[0, 1, 2, 3].map((i) => {
          const t = clamp01(mol * 1.3 - i * 0.12);
          return <Molecule key={i} x={interpolate(t, [0, 1], [240, 520 + i * 110])} y={interpolate(t, [0, 1], [720, 640 + (i % 2) * 120])} s={0.7} o={t} rot={frame * 0.8 + i * 40} />;
        })}
        <Vessel x={140} y={1080} w={800} speed={flow} widen={flow} o={useSp(frame, fps, aFl, 16)} />
      </Stage>
      <Sfx name="lib/twinkle" at={aFl} volume={0.4} />
      <Sfx name="lib/woosh" at={aFlow} volume={0.35} />
    </AbsoluteFill>
  );
};

const Sugar: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const c = useCopy<ChocolateCopy>().sugar;
  const aS = trig(scene, c.sugar, fps);
  const aC = trig(scene, c.cocoa, fps);
  const gs = clamp01((frame - aS + 4) / 22);
  const gc = clamp01((frame - aC + 4) / 16);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="dark" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <rect x={180} y={640} width={720} height={540} rx={30} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
        {Array.from({length: 18}).map((_, i) => {
          const c2 = i % 6, r = Math.floor(i / 6);
          const k = clamp01(gs * 18 - i);
          return <Cube key={i} x={290 + c2 * 100} y={1100 - r * 80 - 60 * (1 - k)} s={1.25} o={k} />;
        })}
        <rect x={210} y={680} width={660 * gc * 0.14} height={60} rx={14} fill={DARK} />
        <Pod x={210 + 660 * 0.14 + 60} y={710} s={0.28} o={gc} />
      </Stage>
      <Sfx name="lib/pop" at={aS} volume={0.45} />
      <Sfx name="tick" at={aC} volume={0.45} />
    </AbsoluteFill>
  );
};

const Look: React.FC<SceneProps> = ({scene}) => {
  const c = useCopy<ChocolateCopy>().look;
  return <TurnLine label={scene.label} lines={c.lines} />;
};

const Checklist: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const c = useCopy<ChocolateCopy>().checklist;
  const a1 = trigAfter(scene, c.higher, fps, 4);
  const a2 = trig(scene, c.sugar, fps);
  const a3 = trig(scene, c.small, fps);
  const ats = [a1, a2, a3];
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        {ats.map((a, i) => {
          const s = useSp(frame, fps, a - 2, 14, SOFT);
          const y = 700 + i * 170;
          const ghost = useSp(frame, fps, 2 + i * 4, 12, SOFT) * (1 - s);
          return (
            <React.Fragment key={i}>
            <rect x={150} y={y - 66} width={780} height={132} rx={30} fill="none" stroke={p.lineStrong} strokeWidth={3} strokeDasharray="14 12" opacity={ghost} />
            <g opacity={s} transform={`translate(${interpolate(s, [0, 1], [-40, 0])} 0)`}>
              <rect x={150} y={y - 66} width={780} height={132} rx={30} fill={b.paper} stroke={p.lineStrong} strokeWidth={3} />
              {i === 0 && <><rect x={190} y={y - 40} width={170} height={80} rx={18} fill={DARK} /><text x={275} y={y + 16} textAnchor="middle" fontFamily={b.font} fontSize={44} fontWeight={800} fill="#fff">70%+</text></>}
              {i === 1 && <><g transform={`translate(270 ${y})`}><Cube x={0} y={0} s={1.3} /></g><path d={`M 380 ${y - 30} V ${y + 30} M 362 ${y + 12} L 380 ${y + 32} L 398 ${y + 12}`} stroke={b.accent} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></>}
              {i === 2 && <><rect x={200} y={y - 26} width={52} height={52} rx={8} fill={DARK} /><rect x={280} y={y - 44} width={100} height={88} rx={10} fill="none" stroke={p.text3} strokeWidth={4} strokeDasharray="10 8" /></>}
              <Check x={860} y={y} r={34} s={useSp(frame, fps, a + 4, 12)} />
            </g>
            </React.Fragment>
          );
        })}
      </Stage>
      {ats.map((a, i) => <Sfx key={i} name="tick" at={a + 4} volume={0.45} />)}
    </AbsoluteFill>
  );
};

const Remember: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const c = useCopy<ChocolateCopy>().remember;
  const at = trig(scene, c.word, fps);
  const s = useSp(frame, fps, 2, 16, SOFT);
  const show = useSp(frame, fps, at - 2, 16);
  const mols = [[2, 230], [6, 790]];
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Headline lines={c.lines} mode="dark" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <Bar x={290} y={980} s={0.75} o={s} color="#2E1A12" />
        <Bar x={790} y={980} s={0.75} o={s} color={DARK} />
        <text x={290} y={1140} textAnchor="middle" fontFamily={b.font} fontSize={32} fontWeight={600} fill={p.text3} opacity={s}>{c.tags[0]}</text>
        <text x={790} y={1140} textAnchor="middle" fontFamily={b.font} fontSize={32} fontWeight={600} fill={p.text3} opacity={s}>{c.tags[1]}</text>
        {mols.map(([n, cx], j) => Array.from({length: n}).map((_, i) => <Molecule key={`${j}-${i}`} x={cx - 90 + (i % 3) * 90} y={700 + Math.floor(i / 3) * 70} s={0.5} o={show} rot={frame + i * 30} />))}
      </Stage>
      <Sfx name="lib/pop" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Enjoy: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<ChocolateCopy>().enjoy;
  const at = trig(scene, c.word, fps);
  const s = useSp(frame, fps, 1, 16, SOFT);
  const h = useSp(frame, fps, at, 14);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <Bar x={540} y={960} s={0.75} o={s} cols={2} rows={2} rot={6} />
        {[[400, 780], [700, 760], [760, 1060]].map(([x, y], i) => <Heart key={i} x={x} y={y} s={0.8 * h} o={h} />)}
      </Stage>
      <Sfx name="lib/twinkle" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Right: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy<ChocolateCopy>().right;
  const at = trig(scene, c.word, fps);
  const s = useSp(frame, fps, 1, 16, SOFT);
  const pick = useSp(frame, fps, at - 1, 14);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 10} fps={fps} size={110} />
      <Stage>
        <Bar x={320} y={960} s={0.75} o={s} color={DARK} rot={interpolate(pick, [0, 1], [0, -6])} />
        <Bar x={780} y={960} s={0.7} o={s * (1 - 0.6 * pick)} color={MILK} />
        <Check x={420} y={760} r={44} s={pick} />
      </Stage>
      <Sfx name="lib/coin" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Follow: React.FC<SceneProps> = (props) => {
  const c = useCopy<ChocolateCopy>().follow;
  return <FollowBrand {...props} nameLines={c.nameLines} nameWord={c.nameWord} sub={c.sub} subWord={c.subWord} />;
};

export const makeChocolate = (cfg: {script: ShortConfig['script']; narration: ShortConfig['narration']; words: Record<string, Word[]>; beats: ShortConfig['beats']; brand: Brand; copy: ChocolateCopy}) =>
  makeShort({...cfg, scenes: {hook: Hook, catch: Catch, flavanols: Flavanols, sugar: Sugar, turn: Look, checklist: Checklist, remember: Remember, enjoy: Enjoy, right: Right, close: Follow}, bass: ['flavanols', 'look', 'enjoy'], levels: [{id: 'flavanols', base: 0.3}, {id: 'look', base: 0.36}], riserAt: 'look'});
