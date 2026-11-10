import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import scriptJson from '../../script/starlink-lasers.json';
import narration from '../data/starlink-lasers/narration.json';
import wordsJson from '../data/starlink-lasers/words.json';
import beatsJson from '../data/starlink-lasers/beats.json';
import {Sfx} from '../components/Sfx';
import type {Word} from '../script';
import {dodaitech, useBrand, usePalette} from '../theme';
import {Headline, Pill} from './AiMemory';
import {FollowBrand, LAYOUT, SceneLabel, SOFT, Stage, TurnLine, clamp01, makeShort, trig, trigAfter, useHost, useSp, type SceneProps} from './kit';

/**
 * dodaitech · "How Starlink beams internet from space" — guion de Enrico (10 nov). Armature: radio arriba, abajo a una estación;
 * si no hay estación, láser entre satélites: una red en el cielo.
 * Protagonistas: el satélite y el paquete de datos (punto naranja) que viaja. Bloques: pregunta y constelación (oscuro) ·
 * cómo funciona paso a paso (claro) · el giro de los láseres (oscuro) · rapidez y la red en el cielo (claro). Cifras con fuente.
 */

/* ---------- Piezas ---------- */
const Sat: React.FC<{x: number; y: number; s?: number; o?: number; rot?: number; dark?: boolean}> = ({x, y, s = 1, o = 1, rot = 0, dark = true}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <rect x={-150} y={-30} width={100} height={60} rx={6} fill={p.surface} stroke={p.text2} strokeWidth={4} />
      <rect x={50} y={-30} width={100} height={60} rx={6} fill={p.surface} stroke={p.text2} strokeWidth={4} />
      {[-125, -100, -75, 75, 100, 125].map((xx) => <line key={xx} x1={xx} y1={-30} x2={xx} y2={30} stroke={p.text3} strokeWidth={2} />)}
      <line x1={-50} y1={0} x2={-30} y2={0} stroke={p.text2} strokeWidth={4} />
      <line x1={30} y1={0} x2={50} y2={0} stroke={p.text2} strokeWidth={4} />
      <rect x={-30} y={-40} width={60} height={80} rx={10} fill={b.accent} />
      <circle cx={0} cy={0} r={10} fill={b.onSoot} />
    </g>
  );
};
const EarthArc: React.FC<{cy?: number; r?: number; o?: number; dark?: boolean}> = ({cy = 2350, r = 1300, o = 1, dark = true}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  return (
    <g opacity={o}>
      <circle cx={540} cy={cy} r={r + 30} fill={b.accent} opacity={0.08} />
      <circle cx={540} cy={cy} r={r} fill={dark ? b.soot3 : b.paper} stroke={p.lineStrong} strokeWidth={4} />
      <path d={`M 120 ${cy - r + 120} C 300 ${cy - r + 60} 420 ${cy - r + 160} 600 ${cy - r + 110} C 760 ${cy - r + 70} 860 ${cy - r + 150} 980 ${cy - r + 120}`} fill="none" stroke={p.text3} strokeWidth={5} opacity={0.6} />
    </g>
  );
};
const Globe: React.FC<{x: number; y: number; r: number; o?: number; dark?: boolean}> = ({x, y, r, o = 1, dark = true}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={r} fill={dark ? b.soot3 : b.paper} stroke={p.lineStrong} strokeWidth={4} />
      <ellipse rx={r} ry={r * 0.35} fill="none" stroke={p.text3} strokeWidth={2} opacity={0.6} />
      <ellipse rx={r * 0.45} ry={r} fill="none" stroke={p.text3} strokeWidth={2} opacity={0.6} />
      <path d={`M ${-r * 0.6} ${-r * 0.2} C ${-r * 0.3} ${-r * 0.4} ${-r * 0.1} ${-r * 0.1} ${r * 0.2} ${-r * 0.3} M ${-r * 0.3} ${r * 0.4} C 0 ${r * 0.2} ${r * 0.3} ${r * 0.5} ${r * 0.6} ${r * 0.3}`} fill="none" stroke={p.text2} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
const House: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const b = useBrand();
  const p = usePalette('light');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} strokeLinejoin="round">
      <path d="M -110 0 L 0 -90 L 110 0 V 120 H -110 Z" fill={b.paper} stroke={p.text} strokeWidth={6} />
      <rect x={-30} y={50} width={60} height={70} fill={p.surface} stroke={p.text} strokeWidth={5} />
      <g transform="translate(60 -70) rotate(-35)">
        <rect x={-34} y={-6} width={68} height={12} rx={6} fill={b.accent} />
        <line x1={0} y1={6} x2={0} y2={40} stroke={p.text} strokeWidth={5} />
      </g>
    </g>
  );
};
const Dish: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const b = useBrand();
  const p = usePalette('light');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} strokeLinecap="round">
      <path d="M -90 -40 A 100 60 -30 0 0 60 -110" fill={b.paper} stroke={p.text} strokeWidth={6} transform="rotate(10)" />
      <line x1={-10} y1={-50} x2={30} y2={-110} stroke={p.text} strokeWidth={5} />
      <circle cx={30} cy={-112} r={8} fill={b.accent} />
      <path d="M -20 -30 L -40 80 M -20 -30 L 20 80 M -60 80 H 40" stroke={p.text} strokeWidth={6} />
    </g>
  );
};
/** Ondas de radio que viajan de A a B. */
const Waves: React.FC<{x1: number; y1: number; x2: number; y2: number; t: number; o?: number}> = ({x1, y1, x2, y2, t, o = 1}) => {
  const b = useBrand();
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={b.accent} strokeWidth={3} strokeDasharray="6 14" opacity={0.6} />
      {[0, 1, 2].map((i) => {
        const k = ((t * 1.5 + i / 3) % 1);
        const x = x1 + (x2 - x1) * k, y = y1 + (y2 - y1) * k;
        return <path key={i} transform={`translate(${x} ${y}) rotate(${ang})`} d="M -10 -26 A 30 30 0 0 1 -10 26" fill="none" stroke={b.accent} strokeWidth={6} strokeLinecap="round" opacity={1 - Math.abs(k - 0.5)} />;
      })}
    </g>
  );
};
const Packet: React.FC<{x: number; y: number; o?: number}> = ({x, y, o = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={30} fill={b.accent} opacity={0.2} />
      <circle r={16} fill={b.accent} />
    </g>
  );
};
const along = (pts: number[][], t: number) => {
  const n = pts.length - 1;
  const seg = Math.min(n - 1, Math.floor(clamp01(t) * n));
  const lt = clamp01(t) * n - seg;
  return [interpolate(lt, [0, 1], [pts[seg][0], pts[seg + 1][0]]), interpolate(lt, [0, 1], [pts[seg][1], pts[seg + 1][1]])];
};

/* ---------- Escenas ---------- */
const Hook: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const host = useHost();
  const sat = useSp(frame, fps, 4, 20, SOFT);
  const aCab = trig(scene, 'cables', fps);
  const cut = useSp(frame, fps, aCab - 1, 12);
  const sy = host ? 560 : 820;
  return (
    <AbsoluteFill>
      <Headline lines={['Wi-Fi', 'from orbit.']} mode="dark" frame={frame + 14} fps={fps} size={host ? 92 : 112} top={host ? 230 : LAYOUT.headlineTop} />
      <Stage>
        {!host && <EarthArc cy={2450} />}
        <Sat x={620} y={sy + Math.sin(frame * 0.05) * 10} s={host ? 0.8 : 1} o={sat} rot={-8} />
        <g opacity={cut} transform={`translate(250 ${host ? 780 : 1020})`}>
          <path d="M -80 40 C -40 -40 40 60 80 -20" fill="none" stroke={p.text2} strokeWidth={10} strokeLinecap="round" />
          <line x1={-70} y1={-50} x2={70} y2={60} stroke={b.accent} strokeWidth={10} strokeLinecap="round" />
        </g>
      </Stage>
      <Sfx name="lib/snap" at={aCab} volume={0.5} />
    </AbsoluteFill>
  );
};

const Answer: React.FC<SceneProps> = ({fps}) => {
  const frame = useCurrentFrame();
  const z = useSp(frame, fps, 0, 18, SOFT);
  return (
    <AbsoluteFill>
      <Stage>
        <EarthArc cy={2450} />
        <Sat x={540} y={880} s={interpolate(z, [0, 1], [1, 1.7])} rot={interpolate(z, [0, 1], [-8, 0])} />
      </Stage>
      <Sfx name="lib/twinkle" at={4} volume={0.4} />
    </AbsoluteFill>
  );
};

const Thousands: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const at = trig(scene, 'thousands', fps);
  const pillAt = trigAfter(scene, 'starlink', fps, 4);
  const g = useSp(frame, fps, 0, 16, SOFT);
  const dots = clamp01((frame - at + 4) / 20);
  const orbits = [{rx: 360, ry: 120, rot: -20}, {rx: 340, ry: 150, rot: 30}, {rx: 380, ry: 90, rot: 75}];
  return (
    <AbsoluteFill>
      <Stage>
        <Globe x={540} y={920} r={190} o={g} />
        {orbits.map((o, oi) => (
          <g key={oi} transform={`translate(540 920) rotate(${o.rot})`}>
            <ellipse rx={o.rx} ry={o.ry} fill="none" stroke="rgba(241,241,237,0.15)" strokeWidth={2} opacity={g} />
            {Array.from({length: 18}).map((_, i) => {
              const a = (i / 18) * Math.PI * 2 + frame * 0.012 * (oi + 1);
              const show = clamp01(dots * 18 - i);
              return <circle key={i} cx={Math.cos(a) * o.rx} cy={Math.sin(a) * o.ry} r={6} fill="#fb5618" opacity={show} />;
            })}
          </g>
        ))}
      </Stage>
      <Pill text="Starlink" x={540} y={560} s={useSp(frame, fps, pillAt, 14)} mode="dark" accent size={64} />
      <Sfx name="lib/arp-down" at={at} volume={0.35} />
    </AbsoluteFill>
  );
};

const How: React.FC<SceneProps> = () => <TurnLine lines={['Step', 'by step.']} />;

const Antenna: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const aWeb = Math.min(trig(scene, 'website', fps), 40);
  const aSig = trig(scene, 'signal', fps);
  const aKm = trigAfter(scene, 'kilometers', fps, 2);
  const h = useSp(frame, fps, aWeb - 2, 16, SOFT);
  const w = useSp(frame, fps, aSig - 2, 12);
  const km = useSp(frame, fps, aKm, 14);
  return (
    <AbsoluteFill>
      <SceneLabel text="step 1 · up" />
      <Stage>
        <Sat x={760} y={520} s={0.7} dark={false} />
        <House x={300} y={1040} s={1} o={h} />
        <Waves x1={360} y1={950} x2={730} y2={560} t={frame / 30} o={w} />
        <g opacity={km}>
          <line x1={940} y1={540} x2={940} y2={1140} stroke={p.text3} strokeWidth={3} />
          <path d="M 920 540 H 960 M 920 1140 H 960" stroke={p.text3} strokeWidth={3} />
          <text x={920} y={860} textAnchor="end" fontFamily={b.font} fontSize={40} fontWeight={800} fill={b.accent}>≈ 550 km</text>
        </g>
      </Stage>
      <Sfx name="tick" at={aWeb} volume={0.45} />
      <Sfx name="lib/woosh" at={aSig} volume={0.35} />
    </AbsoluteFill>
  );
};

const Ground: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const aDown = trig(scene, 'down', fps);
  const aNet = trig(scene, 'internet', fps);
  const dish = useSp(frame, fps, Math.max(0, aDown - 8), 16, SOFT);
  const t = clamp01((frame - aDown) / 22);
  const net = useSp(frame, fps, aNet - 2, 14);
  const [px, py] = along([[600, 560], [760, 980]], t);
  return (
    <AbsoluteFill>
      <SceneLabel text="step 2 · down" />
      <Stage>
        <Sat x={560} y={520} s={0.7} dark={false} />
        <line x1={600} y1={560} x2={760} y2={980} stroke={b.accent} strokeWidth={4} strokeDasharray="8 12" opacity={dish} />
        <Dish x={780} y={1060} s={1.1} o={dish} />
        {t > 0 && t < 1 && <Packet x={px} y={py} />}
        <line x1={840} y1={1130} x2={980 - 600} y2={1130} stroke={b.accent} strokeWidth={5} opacity={net} strokeDasharray="10 10" />
        <Globe x={300} y={1080} r={100} o={net} dark={false} />
      </Stage>
      <Sfx name="lib/woosh" at={aDown} volume={0.35} />
      <Sfx name="lib/coin" at={aNet} volume={0.45} />
    </AbsoluteFill>
  );
};

const NoStation: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const at = trig(scene, 'nearby', fps);
  const q = useSp(frame, fps, at - 1, 12);
  const t = clamp01(frame / 26);
  return (
    <AbsoluteFill>
      <Headline lines={['Middle of', 'the ocean?']} mode="light" frame={frame + 10} fps={fps} size={110} />
      <Stage>
        <Sat x={540} y={660} s={0.7} dark={false} />
        <line x1={540} y1={700} x2={540} y2={700 + 360 * t} stroke={b.accent} strokeWidth={4} strokeDasharray="8 12" />
        {[0, 1, 2].map((i) => <path key={i} d={`M 120 ${1110 + i * 36} ${Array.from({length: 10}).map((_, k) => `q 42 ${(k + i + Math.floor(frame / 8)) % 2 ? -18 : 18} 84 0`).join(' ')}`} fill="none" stroke={p.text3} strokeWidth={5} strokeLinecap="round" opacity={0.7 - i * 0.2} />)}
        <text x={540} y={1060} textAnchor="middle" fontFamily={b.font} fontSize={120} fontWeight={800} fill={b.accent} opacity={q}>?</text>
      </Stage>
      <Sfx name="lib/ping-down" at={at} volume={0.4} />
    </AbsoluteFill>
  );
};

const Interesting: React.FC<SceneProps> = () => <TurnLine mode="dark" lines={['Enter:', 'light.']} />;

const SATS = [[200, 820], [540, 700], [880, 820]];
const Lasers: React.FC<SceneProps & {speed?: boolean}> = ({scene, fps, speed = false}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const at = speed ? 0 : trig(scene, 'lasers', fps);
  const beam = speed ? 1 : useSp(frame, fps, at - 2, 14);
  const lightAt = speed ? trigAfter(scene, 'light', fps, 2) : 0;
  const lbl = speed ? useSp(frame, fps, lightAt, 14) : 0;
  return (
    <AbsoluteFill>
      {!speed && <Headline lines={['Linked', 'by light.']} mode="dark" frame={frame + 10} fps={fps} size={112} />}
      <Stage>
        {[[0, 1], [1, 2]].map(([a, c], i) => {
          const [x1, y1] = SATS[a], [x2, y2] = SATS[c];
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * beam} y2={y1 + (y2 - y1) * beam} stroke={b.accent} strokeWidth={8} strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * beam} y2={y1 + (y2 - y1) * beam} stroke={b.accent} strokeWidth={24} strokeLinecap="round" opacity={0.15} />
              {speed && [0, 1, 2].map((k) => {
                const tt = ((frame / 10 + k / 3 + i * 0.5) % 1);
                return <circle key={k} cx={x1 + (x2 - x1) * tt} cy={y1 + (y2 - y1) * tt} r={12} fill={b.onSoot} />;
              })}
            </g>
          );
        })}
        {SATS.map(([x, y], i) => <Sat key={i} x={x} y={y} s={0.55} />)}
        {speed && <text x={540} y={1060} textAnchor="middle" fontFamily={b.font} fontSize={64} fontWeight={800} fill={p.text} opacity={lbl}>≈ 300,000 km/s</text>}
      </Stage>
      {!speed && <Sfx name="lib/glassy-snap" at={at} volume={0.5} />}
      {speed && <Sfx name="lib/woosh" at={4} volume={0.35} />}
    </AbsoluteFill>
  );
};

const Hop: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const aTrav = trig(scene, 'travel', fps);
  const aEarth = trig(scene, 'earth', fps);
  const pts = [[150, 1050], [240, 740], [440, 630], [640, 630], [840, 740], [930, 1050]];
  const t = clamp01((frame - aTrav) / Math.max(20, aEarth - aTrav + 8));
  const [px, py] = along(pts, t);
  return (
    <AbsoluteFill>
      <Headline lines={['Hop, hop,', 'land.']} mode="dark" frame={frame + 10} fps={fps} size={112} />
      <Stage>
        <EarthArc cy={2270} />
        {pts.slice(1, 5).map(([x, y], i) => <Sat key={i} x={x} y={y} s={0.42} />)}
        <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={b.accent} strokeWidth={4} strokeDasharray="10 12" opacity={0.6} />
        <Dish x={150} y={1100} s={0.5} />
        <Dish x={930} y={1100} s={0.5} />
        {t > 0 && <Packet x={px} y={py} />}
      </Stage>
      {[1, 2, 3, 4].map((i) => <Sfx key={i} name="tick" at={Math.round(aTrav + (i / 5) * Math.max(20, aEarth - aTrav + 8))} volume={0.35} />)}
      <Sfx name="lib/coin" at={aEarth + 8} volume={0.45} />
    </AbsoluteFill>
  );
};

const Fast: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const lbl = useSp(frame, fps, trigAfter(scene, 'second', fps, 2), 14);
  const spin = Math.min(frame, 37) * 9;
  const large = spin > 180 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Headline lines={['Blink-fast.']} mode="light" frame={frame + 10} fps={fps} size={120} accentLine={0} />
      <Stage>
        <g transform="translate(540 880)">
          <rect x={-24} y={-250} width={48} height={40} rx={8} fill={p.text} />
          <circle r={200} fill={b.paper} stroke={p.text} strokeWidth={10} />
          {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-170} x2={0} y2={-150} stroke={p.text3} strokeWidth={5} transform={`rotate(${i * 30})`} />)}
          <path d={`M 0 0 L 0 -180 A 180 180 0 ${large} 1 ${Math.sin((spin * Math.PI) / 180) * 180} ${-Math.cos((spin * Math.PI) / 180) * 180} Z`} fill={b.accent} opacity={0.2} />
          <line x1={0} y1={0} x2={0} y2={-170} stroke={b.accent} strokeWidth={10} strokeLinecap="round" transform={`rotate(${spin})`} />
          <circle r={14} fill={p.text} />
        </g>
        <text x={540} y={1180} textAnchor="middle" fontFamily={b.font} fontSize={64} fontWeight={800} fill={p.text} opacity={lbl}>≈ 25–60 ms</text>
      </Stage>
      <Sfx name="tick" at={2} volume={0.4} />
    </AbsoluteFill>
  );
};

const Network: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const at = trig(scene, 'network', fps);
  const g = useSp(frame, fps, 0, 16, SOFT);
  const mesh = clamp01((frame - at + 6) / 20);
  const nodes = Array.from({length: 14}).map((_, i) => {
    const a = (i / 14) * Math.PI * 2 + frame * 0.006;
    const rr = i % 2 ? 300 : 250;
    return [540 + Math.cos(a) * rr, 920 + Math.sin(a) * rr * 0.75];
  });
  return (
    <AbsoluteFill>
      <Headline lines={['A web above', 'the web.']} mode="light" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <Globe x={540} y={920} r={170} o={g} dark={false} />
        {nodes.map(([x, y], i) => {
          const [x2, y2] = nodes[(i + 1) % nodes.length];
          const [x3, y3] = nodes[(i + 3) % nodes.length];
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x2} y2={y2} stroke={b.accent} strokeWidth={3} opacity={mesh} />
              {i % 2 === 0 && <line x1={x} y1={y} x2={x3} y2={y3} stroke={b.accent} strokeWidth={2} opacity={mesh * 0.5} />}
              <circle cx={x} cy={y} r={11} fill={b.accent} opacity={g} />
            </g>
          );
        })}
      </Stage>
      <Sfx name="lib/coin" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

const Follow: React.FC<SceneProps> = (props) => <FollowBrand {...props} nameLines={['dodaitech']} nameWord="for" />;

const k = makeShort({
  script: scriptJson,
  narration,
  words: wordsJson as Record<string, Word[]>,
  beats: beatsJson,
  brand: dodaitech,
  scenes: {hook: Hook, answer: Answer, thousands: Thousands, turn: How, antenna: Antenna, ground: Ground, nostation: NoStation, turn2: Interesting, lasers: (p) => <Lasers {...p} />, speed: (p) => <Lasers {...p} speed />, hop: Hop, fast: Fast, network: Network, close: Follow},
  bass: ['how', 'interesting', 'fast'],
  continues: ['answer', 'speed'],
  levels: [{id: 'how', base: 0.28}, {id: 'interesting', base: 0.36}, {id: 'fast', base: 0.4}],
  riserAt: 'interesting',
});
export const StarlinkLasers = k.Comp;
export const starlinkLasersTimeline = k.timeline;
export const STARLINK_LASERS = k.meta;
