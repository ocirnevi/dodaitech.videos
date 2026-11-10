import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import scriptJson from '../../script/robot-watch.json';
import narration from '../data/robot-watch/narration.json';
import wordsJson from '../data/robot-watch/words.json';
import beatsJson from '../data/robot-watch/beats.json';
import {Sfx} from '../components/Sfx';
import type {Word} from '../script';
import {dodaitech, theme, useBrand, usePalette} from '../theme';
import {Headline, Pill} from './AiMemory';
import {Check, Cross, FollowBrand, LAYOUT, SceneLabel, SOFT, Stage, TurnLine, clamp01, makeShort, trig, trigAfter, useHost, useSp, type SceneProps} from './kit';

/**
 * dodaitech · "Robots that learn by watching you" — guion de Enrico (10 nov). Armature: ver no es hacer.
 * Protagonistas: la cabeza-cámara del robot y el vaso. Bloques: ver (oscuro → claro → píxeles) · aprender (oscuro) ·
 * el giro "copiar no basta" (claro: cuerpo distinto, fuerza) · práctica con feedback (oscuro) · ver → hacer (claro).
 * Ningún texto fijo repite al karaoke: titulares parafraseados, la pill NVIDIA entra después de que se dice.
 */

/* ---------- Piezas ---------- */
const RobotHead: React.FC<{x: number; y: number; s?: number; o?: number; scan?: number}> = ({x, y, s = 1, o = 1, scan = 0}) => {
  const b = useBrand();
  const p = usePalette('dark');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <line x1={0} y1={-120} x2={0} y2={-90} stroke={p.text2} strokeWidth={6} strokeLinecap="round" />
      <circle cx={0} cy={-128} r={10} fill={b.accent} />
      <rect x={-110} y={-90} width={220} height={170} rx={42} fill={p.surface} stroke={p.text2} strokeWidth={6} />
      <circle cx={0} cy={-5} r={48} fill={b.soot} stroke={p.text2} strokeWidth={6} />
      <circle cx={0} cy={-5} r={26} fill={b.accent} />
      <circle cx={-9} cy={-14} r={8} fill={b.onSoot} opacity={0.8} />
      {scan > 0 && <path d={`M 40 -5 L 420 ${-120 + 80 * Math.sin(scan * 3)} L 420 ${110 + 80 * Math.sin(scan * 3)} Z`} fill={b.accent} opacity={0.12} />}
    </g>
  );
};
const Glass: React.FC<{x: number; y: number; s?: number; o?: number; dark?: boolean; tilt?: number; crack?: number}> = ({x, y, s = 1, o = 1, dark = false, tilt = 0, crack = 0}) => {
  const p = usePalette(dark ? 'dark' : 'light');
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`} opacity={o}>
      <path d="M -52 -80 L 52 -80 L 40 80 L -40 80 Z" fill={dark ? 'rgba(241,241,237,0.08)' : 'rgba(27,25,23,0.05)'} stroke={p.text} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -46 -10 L 46 -10 L 40 80 L -40 80 Z" fill={b.accent} opacity={0.25} />
      {crack > 0 && <path d={`M -10 -80 L 4 -40 L -14 -10 L 10 30 L -4 80`} fill="none" stroke={p.text} strokeWidth={4} strokeDasharray="200" strokeDashoffset={200 * (1 - crack)} />}
      {crack > 0 && <path d={`M 4 -40 L 30 -30 M -14 -10 L -36 0`} fill="none" stroke={p.text} strokeWidth={3} opacity={crack} />}
    </g>
  );
};
const Hand: React.FC<{x: number; y: number; s?: number; o?: number; dark?: boolean; grip?: number}> = ({x, y, s = 1, o = 1, dark = false, grip = 0}) => {
  const p = usePalette(dark ? 'dark' : 'light');
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} strokeLinejoin="round" strokeLinecap="round">
      <path d="M 60 -40 C 20 -50 -20 -46 -40 -30 L -40 40 C -20 54 30 54 60 40" fill={dark ? b.soot3 : b.paper} stroke={p.text} strokeWidth={6} />
      {[-24, -4, 16].map((yy, i) => <path key={i} d={`M -40 ${yy} C ${-70 + grip * 16} ${yy - 4} ${-74 + grip * 18} ${yy + 12} -40 ${yy + 14}`} fill="none" stroke={p.text} strokeWidth={6} />)}
      <path d={`M -30 -30 C ${-60 + grip * 10} -60 ${-90 + grip * 20} -40 ${-70 + grip * 14} -20`} fill="none" stroke={p.text} strokeWidth={6} />
      <path d="M 60 -40 L 130 -44 M 60 40 L 130 44" stroke={p.text} strokeWidth={6} />
    </g>
  );
};
const Gripper: React.FC<{x: number; y: number; s?: number; open?: number; o?: number}> = ({x, y, s = 1, open = 0, o = 1}) => {
  const b = useBrand();
  const p = usePalette('light');
  const d = 40 + open * 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-20} y={-200} width={40} height={130} rx={12} fill={p.surface} stroke={p.text} strokeWidth={6} />
      <rect x={-80} y={-80} width={160} height={36} rx={12} fill={b.accent} />
      <path d={`M ${-d} -44 L ${-d} 60 L ${-d + 18} 60`} fill="none" stroke={p.text} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${d} -44 L ${d} 60 L ${d - 18} 60`} fill="none" stroke={p.text} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
/** Medidor de fuerza: arco con zona baja (gris), justa (acento) y alta (tinta). */
const Gauge: React.FC<{x: number; y: number; r?: number; value: number; o?: number; dark?: boolean}> = ({x, y, r = 120, value, o = 1, dark = false}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  const arc = (a0: number, a1: number) => {
    const P = (a: number) => [Math.cos(Math.PI * (1 - a)) * r, -Math.sin(Math.PI * (1 - a)) * r];
    const [x0, y0] = P(a0);
    const [x1, y1] = P(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const ang = Math.PI * (1 - clamp01(value));
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={arc(0, 0.38)} fill="none" stroke={p.text3} strokeWidth={22} />
      <path d={arc(0.4, 0.6)} fill="none" stroke={b.accent} strokeWidth={22} />
      <path d={arc(0.62, 1)} fill="none" stroke={p.text} strokeWidth={22} />
      <line x1={0} y1={0} x2={Math.cos(ang) * (r - 26)} y2={-Math.sin(ang) * (r - 26)} stroke={p.text} strokeWidth={8} strokeLinecap="round" />
      <circle r={14} fill={p.text} />
    </g>
  );
};
const RobotArm: React.FC<{x: number; y: number; s?: number; o?: number; a1?: number; a2?: number; a3?: number; hl?: number}> = ({x, y, s = 1, o = 1, a1 = -60, a2 = 50, a3 = 40, hl = 0}) => {
  const b = useBrand();
  const p = usePalette('light');
  const seg = (len: number) => <rect x={0} y={-16} width={len} height={32} rx={16} fill={p.surface} stroke={p.text} strokeWidth={6} />;
  const joint = <circle r={20 + hl * 6} fill={hl > 0.5 ? b.accent : b.paper} stroke={p.text} strokeWidth={6} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-60} y={0} width={120} height={36} rx={10} fill={p.text} />
      <g transform={`rotate(${a1})`}>
        {seg(170)}
        {joint}
        <g transform={`translate(170 0) rotate(${a2})`}>
          {seg(150)}
          {joint}
          <g transform={`translate(150 0) rotate(${a3})`}>
            {seg(70)}
            {joint}
            <g transform="translate(70 0)"><path d="M 0 -26 L 34 -26 M 0 26 L 34 26 M 0 -26 V 26" stroke={p.text} strokeWidth={10} strokeLinecap="round" fill="none" /></g>
          </g>
        </g>
      </g>
    </g>
  );
};
const HumanArm: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => {
  const p = usePalette('light');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 0 L 70 -170 L 210 -120" fill="none" stroke={p.text} strokeWidth={46} />
      <path d="M 0 0 L 70 -170 L 210 -120" fill="none" stroke={p.surface} strokeWidth={34} />
      <Hand x={250} y={-112} s={0.55} />
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const host = useHost();
  const head = useSp(frame, fps, 2, 18, SOFT);
  const atWatch = Math.min(trig(scene, 'watching', fps), 40);
  const hand = useSp(frame, fps, atWatch - 4, 16, SOFT);
  const cy = host ? 700 : 940;
  return (
    <AbsoluteFill>
      <Headline lines={['Monkey see,', 'robot do?']} mode="dark" frame={frame + 14} fps={fps} size={host ? 88 : 104} top={host ? 230 : LAYOUT.headlineTop} />
      <Stage>
        <RobotHead x={300} y={cy} s={host ? 0.8 : 1} o={head} scan={clamp01((frame - atWatch) / 30) > 0 ? frame / 30 : 0} />
        <g opacity={hand} transform={`translate(${interpolate(hand, [0, 1], [80, 0])} 0)`}>
          <Glass x={760} y={cy + 30} s={host ? 0.8 : 1} dark />
          <Hand x={860} y={cy + 10} s={host ? 0.7 : 0.9} dark />
        </g>
      </Stage>
      <Sfx name="lib/glitch" at={atWatch} volume={0.35} />
    </AbsoluteFill>
  );
};

const Nvidia: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const at = trigAfter(scene, 'nvidia', fps, 4);
  const s = useSp(frame, fps, at, 14);
  const head = useSp(frame, fps, 0, 14);
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Stage>
        <RobotHead x={540} y={980} s={1.2} o={head} scan={frame / 30} />
      </Stage>
      <Pill text="NVIDIA" x={540} y={680} s={s} mode="dark" accent size={72} />
      <Sfx name="lib/pop" at={at} volume={0.5} />
    </AbsoluteFill>
  );
};

/** Ver levantar un vaso; "instant" sigue el mismo plano y dibuja la trayectoria. */
const GlassPick: React.FC<SceneProps & {arc?: boolean}> = ({scene, fps, arc = false}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const atGlass = arc ? 0 : trig(scene, 'glass', fps);
  const reach = arc ? 1 : useSp(frame, fps, Math.max(0, atGlass - 18), 18, SOFT);
  const lift = arc ? 1 : useSp(frame, fps, atGlass, 18, SOFT);
  const atMove = arc ? trig(scene, 'movement', fps) : 0;
  const draw = arc ? clamp01((frame - 2) / 24) : 0;
  const glow = arc ? useSp(frame, fps, atMove - 2, 14) : 0;
  const gx = 540;
  const gy = 1060 - 160 * lift;
  return (
    <AbsoluteFill>
      {arc ? <Headline lines={['Easy', 'for you.']} mode="light" frame={frame + 10} fps={fps} size={112} /> : <Headline lines={['One simple', 'move.']} mode="light" frame={frame + 10} fps={fps} size={112} />}
      <Stage>
        <line x1={240} y1={1150} x2={840} y2={1150} stroke={b.ink3} strokeWidth={4} opacity={0.4} />
        {arc && <path d="M 540 1060 C 540 980 540 940 540 900" fill="none" stroke={b.accent} strokeWidth={8} strokeDasharray="220" strokeDashoffset={220 * (1 - draw)} strokeLinecap="round" opacity={0.8} />}
        {arc && <circle cx={540} cy={900} r={130 + 20 * glow} fill={b.accent} opacity={0.12 * glow} />}
        <Glass x={gx} y={gy} />
        <Hand x={gx + 60 + 220 * (1 - reach)} y={gy - 4} grip={lift} />
      </Stage>
      {!arc && <Sfx name="lib/pop" at={atGlass} volume={0.45} />}
      {arc && <Sfx name="lib/coin" at={atMove} volume={0.4} />}
    </AbsoluteFill>
  );
};

/** Lo que ve el robot: el mismo vaso en un visor; luego se vuelve píxeles (continúa). */
const RobotView: React.FC<SceneProps & {pix?: boolean}> = ({scene, fps, pix = false}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const enter = pix ? 1 : useSp(frame, fps, 0, 16, SOFT);
  const k = pix ? useSp(frame, fps, 0, 10) : 0;
  const cell = 40;
  const X0 = 200, Y0 = 640, Wd = 680, Ht = 600;
  const inGlass = (x: number, y: number) => y > 760 && y < 1080 && Math.abs(x - 540) < 52 + (1080 - y) * 0.08;
  const inHand = (x: number, y: number) => Math.hypot((x - 650) / 90, (y - 900) / 60) < 1;
  const cells: React.ReactNode[] = [];
  if (pix) {
    for (let y = Y0; y < Y0 + Ht; y += cell) for (let x = X0; x < X0 + Wd; x += cell) {
      const cx = x + cell / 2, cy = y + cell / 2;
      const v = inGlass(cx, cy) ? 0.55 : inHand(cx, cy) ? 0.85 : 0.12 + 0.06 * Math.sin(cx * 0.05 + cy * 0.07);
      const isAcc = inGlass(cx, cy) && cy > 900;
      cells.push(<rect key={`${x}-${y}`} x={x + 2} y={y + 2} width={cell - 4} height={cell - 4} rx={4} fill={isAcc ? b.accent : b.onSoot} opacity={(isAcc ? 0.7 : v) * k} />);
    }
  }
  return (
    <AbsoluteFill>
      {!pix && <Headline lines={['Through', 'its eyes:']} mode="dark" frame={frame + 10} fps={fps} size={104} />}
      <Stage>
        <g opacity={enter}>
          {[[X0, Y0, 1, 1], [X0 + Wd, Y0, -1, 1], [X0, Y0 + Ht, 1, -1], [X0 + Wd, Y0 + Ht, -1, -1]].map(([x, y, dx, dy], i) => <path key={i} d={`M ${x} ${y + 60 * dy} V ${y} H ${x + 60 * dx}`} fill="none" stroke={b.accent} strokeWidth={6} />)}
          <circle cx={X0 + 40} cy={Y0 + 40} r={10} fill={b.accent} opacity={0.5 + 0.5 * Math.sin(frame * 0.3)} />
          <g opacity={1 - k}>
            <Glass x={540} y={920} dark />
            <Hand x={620} y={916} s={0.95} dark />
          </g>
          {cells}
        </g>
        {pix && <text x={540} y={Y0 - 40} textAnchor="middle" fontFamily={b.font} fontSize={30} fontWeight={600} fill={p.text3} opacity={k}>{'R 241 · G 241 · B 237 …'}</text>}
      </Stage>
      {pix && <Sfx name="lib/glitch" at={0} volume={0.5} />}
    </AbsoluteFill>
  );
};

const Recognize: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const aHand = trig(scene, 'hand', fps);
  const aGlass = trig(scene, 'glass', fps);
  const aSpace = trig(scene, 'space', fps);
  const box = (x: number, y: number, w: number, h: number, at: number, conf: string) => {
    const s = useSp(frame, fps, at - 1, 12);
    return (
      <g opacity={s}>
        <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={b.accent} strokeWidth={5} strokeDasharray={`${(w + h) * 2 * s} 2000`} />
        <rect x={x} y={y - 40} width={110} height={36} rx={8} fill={b.accent} />
        <text x={x + 55} y={y - 14} textAnchor="middle" fontFamily={b.font} fontSize={22} fontWeight={700} fill={b.onSoot}>{conf}</text>
      </g>
    );
  };
  const axes = useSp(frame, fps, aSpace - 2, 16);
  const t = clamp01((frame - aSpace) / 30);
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Headline lines={['Find it.', 'Track it.']} mode="dark" frame={frame + 10} fps={fps} size={104} />
      <Stage>
        <g transform={`translate(0 ${-140 * t})`}>
          <Glass x={480} y={980} dark />
          <Hand x={560} y={976} s={0.95} dark />
          {box(560, 900, 220, 170, aHand, '0.97')}
          {box(410, 880, 140, 200, aGlass, '0.94')}
        </g>
        <g opacity={axes} transform="translate(250 1180)">
          <line x1={0} y1={0} x2={120} y2={0} stroke={b.accent} strokeWidth={5} />
          <line x1={0} y1={0} x2={0} y2={-120} stroke={p.text2} strokeWidth={5} />
          <line x1={0} y1={0} x2={-70} y2={60} stroke={p.text3} strokeWidth={5} />
          <text x={130} y={8} fontFamily={b.font} fontSize={26} fill={b.accent}>x</text>
          <text x={-10} y={-130} fontFamily={b.font} fontSize={26} fill={p.text2}>y</text>
          <text x={-96} y={80} fontFamily={b.font} fontSize={26} fill={p.text3}>z</text>
        </g>
        <path d="M 480 980 L 480 840" stroke={b.accent} strokeWidth={4} strokeDasharray="8 10" opacity={axes} />
      </Stage>
      <Sfx name="tick" at={aHand} volume={0.45} />
      <Sfx name="tick" at={aGlass} volume={0.45} />
      <Sfx name="lib/woosh" at={aSpace} volume={0.35} />
    </AbsoluteFill>
  );
};

const Patterns: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const at = trig(scene, 'thousands', fps);
  const cols = 6, rows = 5;
  const merge = useSp(frame, fps, at + 22, 20, SOFT);
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Headline lines={['Watch.', 'Repeat. Learn.']} mode="dark" frame={frame + 10} fps={fps} size={100} />
      <Stage>
        {Array.from({length: rows * cols}).map((_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const k = clamp01((frame - at + 10 - i * 1.2) / 6);
          const x = 160 + c * 130, y = 620 + r * 120;
          const tx = interpolate(merge, [0, 1], [x, 480]), ty = interpolate(merge, [0, 1], [y, 840]);
          return (
            <g key={i} opacity={k * (1 - merge * 0.85)} transform={`translate(${tx} ${ty})`}>
              <rect width={110} height={96} rx={10} fill={p.surface} stroke={p.lineStrong} strokeWidth={2} />
              <path d={`M 20 ${80 - (i % 3) * 4} Q 55 ${20 + (i % 4) * 6} 90 ${30 + (i % 5) * 4}`} fill="none" stroke={b.accent} strokeWidth={4} />
            </g>
          );
        })}
        <path d="M 300 1180 Q 540 700 780 820" fill="none" stroke={b.accent} strokeWidth={14} strokeLinecap="round" strokeDasharray="800" strokeDashoffset={800 * (1 - merge)} />
      </Stage>
      <Sfx name="lib/arp-down" at={at} volume={0.35} />
      <Sfx name="lib/coin" at={at + 26} volume={0.45} />
    </AbsoluteFill>
  );
};

const Tricky: React.FC<SceneProps> = ({scene}) => <TurnLine label={scene.label} lines={['Seeing', '≠ doing.']} />;

const Copy: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const at = trig(scene, 'copy', fps);
  const h = useSp(frame, fps, 2, 16, SOFT);
  const r = useSp(frame, fps, 8, 16, SOFT);
  const neq = useSp(frame, fps, at, 12);
  return (
    <AbsoluteFill>
      <Headline lines={['Not a', 'mirror.']} mode="light" frame={frame + 10} fps={fps} size={120} />
      <Stage>
        <HumanArm x={140} y={1100} s={1.1} o={h} />
        <RobotArm x={720} y={1100} s={0.95} o={r} />
        <text x={540} y={960} textAnchor="middle" fontFamily={b.font} fontSize={140} fontWeight={800} fill={b.accent} opacity={neq} transform={`translate(0 ${interpolate(neq, [0, 1], [20, 0])})`}>≠</text>
      </Stage>
      <Sfx name="lib/snap" at={at} volume={0.5} />
    </AbsoluteFill>
  );
};

const Body: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const aArms = trig(scene, 'arms', fps);
  const aJoints = trig(scene, 'joints', fps);
  const aForce = trig(scene, 'force', fps);
  const arm = useSp(frame, fps, Math.min(aArms, 10), 16, SOFT);
  const wig = clamp01((frame - aJoints) / 40);
  const hl = frame >= aJoints && frame < aForce ? 1 : 0;
  const g = useSp(frame, fps, aForce - 2, 14);
  return (
    <AbsoluteFill>
      <Headline lines={['New body,', 'new math.']} mode="light" frame={frame + 10} fps={fps} size={112} />
      <Stage>
        <RobotArm x={360} y={1150} s={1.05} o={arm} a1={-60 + 12 * Math.sin(wig * 6)} a2={50 - 18 * Math.sin(wig * 5)} a3={40 + 20 * Math.sin(wig * 7)} hl={hl} />
        <Gauge x={800} y={820} r={110} value={0.08 + 0.42 * g} o={g} />
      </Stage>
      <Sfx name="tick" at={aJoints} volume={0.45} />
      <Sfx name="lib/pop" at={aForce} volume={0.45} />
    </AbsoluteFill>
  );
};

/** Poca fuerza: el vaso resbala. Mucha (continúa): se rompe. */
const Force: React.FC<SceneProps & {much?: boolean}> = ({scene, fps, much = false}) => {
  const frame = useCurrentFrame();
  const at = much ? trig(scene, 'breaks', fps) : trig(scene, 'slips', fps);
  const k = useSp(frame, fps, at - 2, 14);
  const v = much ? interpolate(useSp(frame, fps, 0, 14), [0, 1], [0.2, 0.92]) : 0.2;
  const slip = much ? 0 : clamp01((frame - at) / 14);
  return (
    <AbsoluteFill>
      <Headline lines={much ? ['Overkill.'] : ['Too soft.']} mode="light" frame={frame + 8} fps={fps} size={128} accentLine={0} />
      <Stage>
        <Gauge x={540} y={760} r={130} value={v} />
        <Gripper x={540} y={1010} s={0.95} open={much ? 0 : 0.2} />
        <Glass x={540} y={1040 + 160 * slip * slip} o={1 - slip * 0.3} tilt={slip * 14} crack={much ? k : 0} />
      </Stage>
      <Sfx name={much ? 'lib/ice-crack' : 'lib/woosh'} at={at} volume={0.55} />
    </AbsoluteFill>
  );
};

const Feedback: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const aPr = trig(scene, 'practice', fps);
  const aAdj = trig(scene, 'adjust', fps);
  const aFb = trig(scene, 'feedback', fps);
  const tries = [aPr, aAdj, aFb];
  const vals = [0.15, 0.85, 0.5];
  const cur = frame < aAdj ? 0 : frame < aFb ? 1 : 2;
  const loop = (frame * 4) % 360;
  return (
    <AbsoluteFill>
      <SceneLabel text={scene.label} />
      <Headline lines={['Try. Feel.', 'Fix.']} mode="dark" frame={frame + 10} fps={fps} size={112} />
      <Stage>
        <circle cx={540} cy={900} r={250} fill="none" stroke={p.lineStrong} strokeWidth={4} strokeDasharray="14 14" transform={`rotate(${loop} 540 900)`} />
        <path d="M 790 900 l -18 -26 M 790 900 l 22 -22" stroke={b.accent} strokeWidth={6} strokeLinecap="round" transform={`rotate(${loop} 540 900)`} />
        <Gauge x={540} y={940} r={150} value={vals[cur]} dark />
        {tries.map((a, i) => {
          const s = useSp(frame, fps, a + 8, 12);
          const x = 380 + i * 160;
          return i < 2 ? <Cross key={i} x={x} y={1110} r={30} s={s} /> : <Check key={i} x={x} y={1110} r={34} s={s} />;
        })}
      </Stage>
      {tries.map((a, i) => <Sfx key={i} name={i < 2 ? 'tick' : 'lib/coin'} at={a + 8} volume={0.45} />)}
    </AbsoluteFill>
  );
};

const Research: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const at = trigAfter(scene, 'nvidia', fps, 4);
  const pill = useSp(frame, fps, at, 14);
  const s = useSp(frame, fps, 2, 16, SOFT);
  const bob = Math.sin(frame * 0.12) * 8;
  return (
    <AbsoluteFill>
      <Stage>
        <circle cx={540} cy={1000} r={210} fill={b.accent} opacity={0.1 * s} />
        <g opacity={s} transform={`translate(0 ${bob})`}>
          <Gripper x={540} y={960} s={1} />
          <Glass x={540} y={990} dark />
        </g>
      </Stage>
      <Pill text="NVIDIA Research" x={540} y={620} s={pill} mode="dark" accent size={60} />
      <Sfx name="lib/twinkle" at={at} volume={0.4} />
    </AbsoluteFill>
  );
};

const SeeDo: React.FC<SceneProps> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const aSee = trig(scene, 'see', fps);
  const aDo = trig(scene, 'physically', fps);
  const eye = useSp(frame, fps, 2, 14);
  const ar = clamp01((frame - aSee) / 14);
  const hand = useSp(frame, fps, aDo - 2, 16, SOFT);
  return (
    <AbsoluteFill>
      <Headline lines={['Vision', '→ action.']} mode="light" frame={frame + 10} fps={fps} size={120} />
      <Stage>
        <g transform="translate(250 900)" opacity={eye}>
          <path d="M -110 0 Q 0 -90 110 0 Q 0 90 -110 0 Z" fill={b.paper} stroke={p.text} strokeWidth={8} strokeLinejoin="round" />
          <circle r={38} fill={b.accent} />
          <circle r={14} fill={p.text} />
        </g>
        <path d={`M 390 900 H ${390 + 220 * ar}`} stroke={b.accent} strokeWidth={10} strokeLinecap="round" />
        <path d={`M ${590 * 1} 900 l -24 -20 M 590 900 l -24 20`} stroke={b.accent} strokeWidth={10} strokeLinecap="round" opacity={ar >= 1 ? 1 : 0} />
        <g opacity={hand} transform={`translate(0 ${interpolate(hand, [0, 1], [40, 0])})`}>
          <Gripper x={820} y={900} s={0.8} />
          <Glass x={820} y={924} s={0.8} />
        </g>
      </Stage>
      <Sfx name="lib/woosh" at={aSee} volume={0.35} />
      <Sfx name="lib/coin" at={aDo} volume={0.45} />
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
  scenes: {
    hook: Hook, nvidia: Nvidia, glass: (p) => <GlassPick {...p} />, instant: (p) => <GlassPick {...p} arc />,
    sees: (p) => <RobotView {...p} />, pixels: (p) => <RobotView {...p} pix />, recognize: Recognize, patterns: Patterns,
    turn: Tricky, copy: Copy, body: Body, little: (p) => <Force {...p} />, much: (p) => <Force {...p} much />,
    feedback: Feedback, research: Research, seedo: SeeDo, close: Follow,
  },
  bass: ['sees', 'tricky', 'turn'],
  continues: ['instant', 'pixels', 'much'],
  levels: [{id: 'sees', base: 0.3}, {id: 'tricky', base: 0.36}, {id: 'feedback', base: 0.4}],
  riserAt: 'tricky',
});
export const RobotWatch = k.Comp;
export const robotWatchTimeline = k.timeline;
export const ROBOT_WATCH = k.meta;
void theme;
