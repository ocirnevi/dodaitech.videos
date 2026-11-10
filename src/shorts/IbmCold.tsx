import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import scriptJson from '../../script/ibm-cold.json';
import narration from '../data/ibm-cold/narration.json';
import wordsJson from '../data/ibm-cold/words.json';
import beatsJson from '../data/ibm-cold/beats.json';
import {Sfx} from '../components/Sfx';
import type {Word} from '../script';
import {dodaitech, useBrand, usePalette} from '../theme';
import {Headline, Pill} from './AiMemory';
import {Check, Cross, FollowBrand, LAYOUT, SceneLabel, SOFT, Stage, TurnLine, clamp01, makeShort, trig, trigAfter, useHost, useSp, type SceneProps} from './kit';

/**
 * dodaitech · "Why IBM freezes its quantum computers" — guion de Enrico (10 nov). Armature: los qubits son frágiles; el frío los calma.
 * Protagonistas: el "candelabro" del refrigerador de dilución (platos que bajan de temperatura) y la esfera del qubit.
 * Bloques: pregunta + "más frío que el espacio" (oscuro) · bits vs qubits (claro) · el problema: calor = errores (oscuro) ·
 * la solución en el refrigerador y −273 °C (claro) · la ironía final (oscuro). Cifras con fuente en el guion.
 */

/* ---------- Piezas ---------- */
const Chandelier: React.FC<{x: number; y: number; s?: number; o?: number; lit?: number; dark?: boolean; labels?: boolean}> = ({x, y, s = 1, o = 1, lit = 1, dark = true, labels = false}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  const plates = [{w: 300, t: '50 K'}, {w: 250, t: '4 K'}, {w: 200, t: '0.8 K'}, {w: 160, t: '0.1 K'}, {w: 124, t: '0.015 K'}];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {plates.map((pl, i) => {
        const yy = -260 + i * 120;
        const on = clamp01(lit * plates.length - i);
        return (
          <g key={i}>
            {i < plates.length - 1 && [-0.32, -0.1, 0.12, 0.3].map((f, j) => <path key={j} d={`M ${f * pl.w} ${yy + 14} C ${f * pl.w * 1.2} ${yy + 60} ${f * plates[i + 1].w * 0.8} ${yy + 70} ${f * plates[i + 1].w} ${yy + 106}`} fill="none" stroke={b.accent} strokeWidth={4} opacity={0.5 + 0.4 * on} />)}
            <rect x={-pl.w / 2} y={yy - 14} width={pl.w} height={28} rx={8} fill={b.accent} opacity={0.35 + 0.65 * on} />
            <rect x={-pl.w / 2} y={yy - 14} width={pl.w} height={8} rx={4} fill={b.onSoot} opacity={0.25} />
            {labels && <text x={pl.w / 2 + 26} y={yy + 10} fontFamily={b.font} fontSize={30} fontWeight={700} fill={on > 0.5 ? b.accent : p.text3}>{pl.t}</text>}
          </g>
        );
      })}
      <rect x={-34} y={250} width={68} height={50} rx={8} fill={p.surface} stroke={b.accent} strokeWidth={4} />
      <path d="M -20 262 h 40 M -20 276 h 40 M -20 290 h 40" stroke={b.accent} strokeWidth={3} />
    </g>
  );
};
/** Esfera de Bloch: círculo, ecuador y flecha del estado (ángulo en grados desde |0⟩ arriba). */
const Bloch: React.FC<{x: number; y: number; r?: number; angle: number; o?: number; dark?: boolean; jitter?: number; labels?: boolean}> = ({x, y, r = 200, angle, o = 1, dark = false, jitter = 0, labels = true}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  const a = ((angle + jitter) * Math.PI) / 180;
  const tx = Math.sin(a) * r * 0.9, ty = -Math.cos(a) * r * 0.9;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={r} fill={dark ? 'rgba(241,241,237,0.04)' : b.paper} stroke={p.text} strokeWidth={5} />
      <ellipse rx={r} ry={r * 0.28} fill="none" stroke={p.text3} strokeWidth={3} strokeDasharray="10 10" />
      <line x1={0} y1={-r} x2={0} y2={r} stroke={p.text3} strokeWidth={2} />
      <line x1={0} y1={0} x2={tx} y2={ty} stroke={b.accent} strokeWidth={10} strokeLinecap="round" />
      <circle cx={tx} cy={ty} r={16} fill={b.accent} />
      <circle r={8} fill={p.text} />
      {labels && <text x={0} y={-r - 24} textAnchor="middle" fontFamily={b.font} fontSize={40} fontWeight={700} fill={p.text2}>|0⟩</text>}
      {labels && <text x={0} y={r + 56} textAnchor="middle" fontFamily={b.font} fontSize={40} fontWeight={700} fill={p.text2}>|1⟩</text>}
    </g>
  );
};
const Switch: React.FC<{x: number; y: number; on: number; o?: number; label: string}> = ({x, y, on, o = 1, label}) => {
  const b = useBrand();
  const p = usePalette('light');
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={-120} y={-62} width={240} height={124} rx={62} fill={on > 0.5 ? b.accent : b.paper} stroke={p.lineStrong} strokeWidth={4} />
      <circle cx={interpolate(on, [0, 1], [-58, 58])} cy={0} r={48} fill={on > 0.5 ? b.onSoot : p.text3} />
      <text x={0} y={150} textAnchor="middle" fontFamily={b.font} fontSize={96} fontWeight={800} fill={p.text}>{label}</text>
    </g>
  );
};
const Snowflake: React.FC<{x: number; y: number; s?: number; o?: number; rot?: number; color?: string}> = ({x, y, s = 1, o = 1, rot = 0, color}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} stroke={color ?? b.accent} strokeWidth={8} strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1={0} y1={-90} x2={0} y2={90} />
          <path d="M -20 -70 L 0 -50 L 20 -70 M -20 70 L 0 50 L 20 70" fill="none" />
        </g>
      ))}
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const host = useHost();
  const s = useSp(frame, fps, 2, 20, SOFT);
  const lit = clamp01((frame - 10) / 50);
  void scene;
  return (
    <AbsoluteFill>
      <Headline lines={['−273 °C.', 'On purpose.']} mode="dark" frame={frame + 14} fps={fps} size={host ? 92 : 112} top={host ? 230 : LAYOUT.headlineTop} />
      <Stage>
        <Snowflake x={860} y={host ? 300 : 360} s={0.5} o={s * 0.6} rot={frame * 0.6} />
        <Chandelier x={540} y={host ? 700 : 880} s={host ? 0.6 : 0.92} o={s} lit={lit} />
      </Stage>
      <Sfx name="lib/ice-snap" at={6} volume={0.45} />
    </AbsoluteFill>
  );
};

const Space: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const at = trig(scene, 'space', fps);
  const scale = useSp(frame, fps, 2, 16, SOFT);
  const m1 = useSp(frame, fps, at - 2, 14);
  const m2 = useSp(frame, fps, at + 8, 14);
  const yOf = (k: number) => 1200 - Math.log10(k * 1000 + 1) / Math.log10(300001) * 560;
  return (
    <AbsoluteFill>
      <Headline lines={['Beyond', 'freezing.']} mode="dark" frame={frame + 10} fps={fps} size={110} />
      <Stage>
        <g opacity={scale}>
          <rect x={500} y={620} width={80} height={600} rx={40} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} />
          {[[300, '300 K'], [4, '4 K']].map(([k, t]) => <text key={t as string} x={610} y={yOf(k as number) + 10} fontFamily={b.font} fontSize={28} fill={p.text3}>{t}</text>)}
        </g>
        <g opacity={m1} transform={`translate(${interpolate(m1, [0, 1], [-30, 0])} 0)`}>
          <line x1={420} y1={yOf(2.7)} x2={500} y2={yOf(2.7)} stroke={p.text} strokeWidth={5} />
          {[[300, -30], [360, 20], [250, 30], [330, 60]].map(([x, dy], i) => <circle key={i} cx={x} cy={yOf(2.7) + dy} r={4 + (i % 2) * 2} fill={p.text} />)}
          <text x={400} y={yOf(2.7) - 30} textAnchor="end" fontFamily={b.font} fontSize={40} fontWeight={700} fill={p.text}>2.7 K</text>
        </g>
        <g opacity={m2} transform={`translate(${interpolate(m2, [0, 1], [30, 0])} 0)`}>
          <line x1={580} y1={yOf(0.015)} x2={660} y2={yOf(0.015)} stroke={b.accent} strokeWidth={6} />
          <Chandelier x={820} y={yOf(0.015) - 20} s={0.32} />
          <text x={680} y={yOf(0.015) + 64} fontFamily={b.font} fontSize={44} fontWeight={800} fill={b.accent}>0.015 K</text>
        </g>
        <rect x={508} y={yOf(0.015)} width={64} height={1212 - yOf(0.015)} rx={32} fill={b.accent} opacity={m2} />
      </Stage>
      <Sfx name="tick" at={at} volume={0.45} />
      <Sfx name="lib/ice-snap" at={at + 8} volume={0.45} />
    </AbsoluteFill>
  );
};

const Why: React.FC<SceneProps> = ({fps}) => {
  const frame = useCurrentFrame();
  const s = useSp(frame, fps, 1, 16, SOFT);
  return (
    <AbsoluteFill>
      <Stage><Snowflake x={540} y={900} s={2.2 * s} o={s} rot={frame * 1.2} /></Stage>
      <Sfx name="lib/glassy-snap" at={3} volume={0.5} />
    </AbsoluteFill>
  );
};

const Bits: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const aBits = Math.min(trig(scene, 'bits', fps), 8);
  const aOne = trig(scene, 'one', fps);
  const s1 = useSp(frame, fps, aBits - 2, 14);
  const on = useSp(frame, fps, aOne - 1, 10);
  return (
    <AbsoluteFill>
      <Headline lines={['On or', 'off.']} mode="light" frame={frame + 10} fps={fps} size={120} />
      <Stage>
        <Switch x={300} y={860} on={0} o={s1} label="0" />
        <Switch x={780} y={860} on={on} o={s1} label="1" />
      </Stage>
      <Sfx name="tick" at={aOne} volume={0.5} />
    </AbsoluteFill>
  );
};

const Qubits: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const at = trig(scene, 'qubits', fps);
  const s = useSp(frame, fps, Math.min(at, 12) - 6, 18, SOFT);
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Stage><Bloch x={540} y={880} r={230 * s + 1} angle={frame * 4} o={s} labels={false} /></Stage>
      <Sfx name="lib/twinkle" at={at} volume={0.4} />
    </AbsoluteFill>
  );
};

const Super: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const at = trig(scene, 'combination', fps);
  const settle = useSp(frame, fps, at, 22, SOFT);
  const swing = 90 + 90 * Math.sin(frame * 0.12);
  const angle = interpolate(settle, [0, 1], [swing, 70]);
  const eq = useSp(frame, fps, trigAfter(scene, 'one', fps, 4), 14);
  return (
    <AbsoluteFill>
      <Headline lines={['Both,', 'at once.']} mode="light" frame={frame + 10} fps={fps} size={112} />
      <Stage>
        <Bloch x={540} y={860} r={210} angle={angle} />
        <text x={540} y={1180} textAnchor="middle" fontFamily={b.font} fontSize={64} fontWeight={800} fill={p.text} opacity={eq}>α|0⟩ + β|1⟩</text>
      </Stage>
      <Sfx name="lib/woosh" at={at} volume={0.35} />
    </AbsoluteFill>
  );
};

const Powerful: React.FC<SceneProps> = ({fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const n = Math.min(16, Math.pow(2, Math.floor(frame / 8) + 1));
  return (
    <AbsoluteFill>
      <Headline lines={['Exponential.']} mode="light" frame={frame + 10} fps={fps} size={112} accentLine={0} />
      <Stage>
        {Array.from({length: n}).map((_, i) => {
          const c = i % 4, r = Math.floor(i / 4);
          return <g key={i}><Bloch x={300 + c * 160} y={680 + r * 150} r={56} angle={(frame * 6 + i * 40) % 360} labels={false} /></g>;
        })}
        <text x={900} y={660} fontFamily={b.font} fontSize={64} fontWeight={800} fill={b.accent}>2ⁿ</text>
      </Stage>
      <Sfx name="lib/arp-down" at={2} volume={0.35} />
    </AbsoluteFill>
  );
};

const Problem: React.FC<SceneProps> = () => <TurnLine mode="dark" lines={['There’s', 'a catch.']} />;

const Sensitive: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const at = trig(scene, 'sensitive', fps);
  const shake = frame >= at - 4 ? Math.sin(frame * 1.7) * 14 + Math.sin(frame * 2.9) * 8 : 0;
  return (
    <AbsoluteFill>
      <Headline lines={['Handle', 'with care.']} mode="dark" frame={frame + 10} fps={fps} size={112} />
      <Stage><Bloch x={540} y={900} r={220} angle={60} jitter={shake} dark /></Stage>
      <Sfx name="lib/glitch" at={at} volume={0.35} />
    </AbsoluteFill>
  );
};

const Heat: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const aHeat = trig(scene, 'heat', fps);
  const aErr = trig(scene, 'errors', fps);
  const t = clamp01((frame - aHeat) / 30);
  const scramble = frame >= aHeat + 10 ? Math.sin(frame * 0.9) * 70 : 0;
  return (
    <AbsoluteFill>
      <Headline lines={['Heat', '= noise.']} mode="dark" frame={frame + 10} fps={fps} size={112} />
      <Stage>
        <Bloch x={540} y={900} r={200} angle={60} jitter={scramble} dark />
        {Array.from({length: 14}).map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + frame * 0.03;
          const rr = interpolate(t, [0, 1], [460, 230]) + Math.sin(frame * 0.4 + i) * 16;
          return <circle key={i} cx={540 + Math.cos(a) * rr} cy={900 + Math.sin(a) * rr} r={10} fill={b.accent} opacity={t} />;
        })}
        {[0, 1, 2].map((i) => <Cross key={i} x={360 + i * 180} y={1190} r={32} s={useSp(frame, fps, aErr + i * 4, 12)} />)}
      </Stage>
      <Sfx name="lib/woosh" at={aHeat} volume={0.35} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="lib/glitch" at={aErr + i * 4} volume={0.3} />)}
    </AbsoluteFill>
  );
};

const Cool: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const aIbm = trigAfter(scene, 'ibm', fps, 4);
  const aChips = trig(scene, 'chips', fps);
  const aZero = trig(scene, 'zero', fps);
  const pill = useSp(frame, fps, aIbm, 14);
  const lit = clamp01((frame - aChips) / Math.max(10, aZero - aChips));
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Stage><Chandelier x={440} y={850} s={0.92} lit={lit} dark={false} labels /></Stage>
      <Pill text="IBM Quantum" x={780} y={330} s={pill} mode="light" accent size={48} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} name="tick" at={Math.round(aChips + (i / 5) * Math.max(10, aZero - aChips))} volume={0.35} />)}
      <Sfx name="lib/ice-snap" at={aZero} volume={0.45} />
    </AbsoluteFill>
  );
};

/** Contador que baja y llega a −273 DESPUÉS de que el karaoke dijo la cifra (regla de no repetir). */
const Minus: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const land = trigAfter(scene, 'celsius', fps, 2);
  const t = clamp01(frame / Math.max(10, land));
  const ease = 1 - Math.pow(1 - t, 3);
  const v = Math.round(20 - 293 * ease);
  return (
    <AbsoluteFill>
      <Stage>
        <rect x={150} y={640} width={70} height={520} rx={35} fill={b.paper} stroke={p.lineStrong} strokeWidth={4} />
        <rect x={160} y={650 + 500 * ease} width={50} height={500 * (1 - ease) + 1} rx={25} fill={b.accent} />
        <circle cx={185} cy={1180} r={56} fill={b.accent} />
        <Snowflake x={185} y={1180} s={0.4} color={b.onSoot} o={ease} />
      </Stage>
      <div style={{position: 'absolute', left: 280, right: 60, top: 760, fontFamily: b.font, fontWeight: 800, fontSize: 210, letterSpacing: '-0.04em', color: t >= 1 ? b.accent : p.text, fontVariantNumeric: 'tabular-nums'}}>
        {v > 0 ? `+${v}` : v === 0 ? '0' : `−${Math.abs(v)}`}<span style={{fontSize: 90}}>°C</span>
      </div>
      <div style={{position: 'absolute', left: 290, top: 1010, fontFamily: b.font, fontWeight: 600, fontSize: 40, color: p.text3, opacity: t >= 1 ? 1 : 0}}>≈ 0.015 K</div>
      <Sfx name="lib/ice-crack" at={land} volume={0.5} />
    </AbsoluteFill>
  );
};

const Maintain: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const aMaint = trig(scene, 'maintain', fps);
  const aComp = trig(scene, 'computation', fps);
  const calm = useSp(frame, fps, aMaint, 20, SOFT);
  const lines = clamp01((frame - aComp + 6) / 18);
  return (
    <AbsoluteFill>
      <Headline lines={['Calm qubits,', 'clean math.']} mode="light" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <Bloch x={540} y={860} r={190} angle={60} jitter={(1 - calm) * Math.sin(frame * 1.5) * 30} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${200 + i * 30} 1120 H ${880 - i * 30}`} stroke={b.accent} strokeWidth={6} strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - clamp01(lines * 1.4 - i * 0.15))} opacity={0.4 + 0.15 * i} />)}
        <Check x={850} y={680} r={40} s={useSp(frame, fps, aComp, 12)} />
        <circle cx={540} cy={860} r={210} fill="none" stroke={p.lineStrong} strokeWidth={2} opacity={calm} />
      </Stage>
      <Sfx name="lib/coin" at={aComp} volume={0.45} />
    </AbsoluteFill>
  );
};

const Crazy: React.FC<SceneProps> = () => <TurnLine mode="dark" lines={['Irony', 'alert.']} />;

const Coldest: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const aAdv = trig(scene, 'advanced', fps);
  const aCold = trig(scene, 'coldest', fps);
  const g = useSp(frame, fps, 2, 18, SOFT);
  const ch = useSp(frame, fps, aAdv - 2, 16, SOFT);
  const ice = useSp(frame, fps, aCold - 1, 16);
  return (
    <AbsoluteFill>
      <Headline lines={['Brains', 'on ice.']} mode="dark" frame={frame + 10} fps={fps} size={120} />
      <Stage>
        <g opacity={g}>
          <circle cx={540} cy={960} r={260} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} />
          <path d="M 330 860 C 420 820 470 900 560 860 C 640 830 700 880 760 850 M 300 1000 C 400 980 460 1060 560 1030 C 660 1000 720 1060 790 1020" fill="none" stroke={p.text3} strokeWidth={6} strokeLinecap="round" />
        </g>
        <Chandelier x={540} y={960} s={0.5} o={ch} />
        <Snowflake x={790} y={720} s={0.8 * ice} o={ice} rot={frame} />
        <circle cx={540} cy={960} r={280 + 30 * ice} fill="none" stroke={b.accent} strokeWidth={6} opacity={0.6 * ice} />
      </Stage>
      <Sfx name="lib/ice-snap" at={aCold} volume={0.5} />
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
  scenes: {hook: Hook, space: Space, why: Why, bits: Bits, qubits: Qubits, super: Super, powerful: Powerful, turn: Problem, sensitive: Sensitive, heat: Heat, cool: Cool, minus: Minus, maintain: Maintain, turn2: Crazy, coldest: Coldest, close: Follow},
  bass: ['why', 'problem', 'cool', 'crazy'],
  levels: [{id: 'bits', base: 0.28}, {id: 'problem', base: 0.33}, {id: 'cool', base: 0.38}],
  riserAt: 'problem',
});
export const IbmCold = k.Comp;
export const ibmColdTimeline = k.timeline;
export const IBM_COLD = k.meta;
