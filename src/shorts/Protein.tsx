import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {ByScene} from '../components/ByScene';
import {Captions} from '../components/Captions';
import {Chapter} from '../components/Chapter';
import {Cut} from '../components/Cut';
import {MusicBed} from '../components/MusicBed';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';
import {triggerFrameIn, type Word} from '../script';
import {BrandProvider, theme, useBrand, usePalette, type Brand, type Mode} from '../theme';
import {Headline, Pill} from './AiMemory';
import type {TimedShortScene} from './script';
import {makeShortTimeline} from './timeline';

/**
 * "Protein breakfast keeps you full" — guion de Enrico (10 nov). Fábrica para Hello Nutrition AI (inglés) y Mi Nutriólogo (español).
 * Protagonista visual: el medidor de saciedad (un tubo verde que se vacía con las horas). Con proteína se vacía lento; con pan o cereal solo, rápido.
 * Reglas: el texto fijo nunca repite la palabra del karaoke (titulares parafraseados, alimentos como iconos sin etiqueta), GAP 2, voz apretada.
 * Tres bloques: gancho (claro) → por qué: señal al cerebro, digestión lenta (oscuro) → el cambio en el plato y la mañana sin hambre (claro).
 */

export type ProteinCopy = {
  hook: {lines: string[]; protein: string; full: string};
  hormones: {label: string; lines: string[]; hormones: string; brain: string};
  digest: {lines: string[]; digest: string};
  swap: {lines: string[]; toast: string; words: [string, string, string]};
  satisfied: {lines: string[]; times: [string, string]; word: string};
  follow: {nameLines: string[]; nameWord: string; sub: string; subWord: string};
};

export type ProteinConfig = {
  script: Parameters<typeof makeShortTimeline>[0];
  narration: Parameters<typeof makeShortTimeline>[1];
  words: Record<string, Word[]>;
  beats: Parameters<typeof makeShortTimeline>[3];
  brand: Brand;
  copy: ProteinCopy;
};

const CopyCtx = React.createContext<ProteinCopy | null>(null);
const useCopy = () => {
  const c = React.useContext(CopyCtx);
  if (!c) throw new Error('ProteinCopy no provisto');
  return c;
};

const LAYOUT = {headlineTop: 300, captionsBottom: 620};
const W = 1080;
const SN = theme.spring.snappy;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);

/* ---------- Medidor de saciedad: tubo vertical, nivel 0–1 ---------- */
const Meter: React.FC<{x: number; y: number; h: number; level: number; dark?: boolean; o?: number; dim?: boolean}> = ({x, y, h, level, dark = false, o = 1, dim = false}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  const w = h * 0.36;
  const lv = clamp01(level);
  return (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`} opacity={o}>
      <rect x={0} y={0} width={w} height={h} rx={w / 2} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} />
      <clipPath id={`m-${x}-${y}`}><rect x={6} y={6} width={w - 12} height={h - 12} rx={(w - 12) / 2} /></clipPath>
      <g clipPath={`url(#m-${x}-${y})`}>
        <rect x={0} y={h - (h - 12) * lv - 6} width={w} height={h} fill={dim ? p.text3 : b.accent} />
        <rect x={0} y={h - (h - 12) * lv - 6} width={w} height={10} fill={dim ? p.text2 : b.accentLight} opacity={0.6} />
      </g>
      {[0.25, 0.5, 0.75].map((t) => <line key={t} x1={w - 18} x2={w - 6} y1={h * (1 - t)} y2={h * (1 - t)} stroke={p.text3} strokeWidth={3} />)}
    </g>
  );
};

/* ---------- Iconos de línea (dos colores) ---------- */
type IconProps = {x: number; y: number; s?: number; dark?: boolean; o?: number; dim?: boolean};
const useIc = (dark: boolean, dim = false) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  return {stroke: dim ? p.text3 : dark ? b.onSoot : b.ink2, fill: dark ? b.soot3 : b.paper, soft: dim ? (dark ? b.soot2 : b.canvas2) : dark ? 'rgba(46,204,112,0.22)' : b.accentSoft, accent: b.accent, yolk: '#F1C40F'};
};
const Egg: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIc(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M -58 6 C -62 -40 -26 -58 0 -54 C 40 -50 66 -24 58 12 C 52 44 24 58 -4 56 C -36 54 -56 36 -58 6 Z" fill={c.fill} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={2} cy={4} r={22} fill={c.yolk} stroke={c.stroke} strokeWidth={5} />
    </g>
  );
};
const Toast: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1, dim = false}) => {
  const c = useIc(dark, dim);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M -48 54 V -14 C -66 -20 -66 -56 -30 -58 H 30 C 66 -56 66 -20 48 -14 V 54 Z" fill={c.soft} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -34 40 V -6 C -48 -12 -46 -40 -22 -42 H 22 C 46 -40 48 -12 34 -6 V 40 Z" fill="none" stroke={c.stroke} strokeWidth={3} opacity={0.5} />
    </g>
  );
};
const Cereal: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1, dim = false}) => {
  const c = useIc(dark, dim);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {[[-30, -14], [-6, -22], [18, -16], [36, -8], [-42, -4], [6, -8]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={9} fill="none" stroke={c.stroke} strokeWidth={4} />)}
      <path d="M -62 -2 A 62 52 0 0 0 62 -2 Z" fill={c.soft} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -28 56 H 28" stroke={c.stroke} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};
const Yogurt: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIc(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M -50 -30 L -38 54 H 38 L 50 -30 Z" fill={c.fill} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -56 -30 H 56" stroke={c.stroke} strokeWidth={8} strokeLinecap="round" />
      <path d="M -44 -30 C -30 -60 30 -60 44 -30" fill={c.soft} stroke={c.stroke} strokeWidth={5} />
      <rect x={-30} y={4} width={60} height={22} rx={6} fill={c.accent} />
    </g>
  );
};
const Cottage: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIc(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-60} y={-20} width={120} height={70} rx={14} fill={c.fill} stroke={c.stroke} strokeWidth={6} />
      <ellipse cx={0} cy={-20} rx={60} ry={14} fill={c.soft} stroke={c.stroke} strokeWidth={6} />
      {[[-24, -26], [0, -32], [22, -24], [-8, -16], [14, -14]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={7} fill={c.fill} stroke={c.stroke} strokeWidth={3} />)}
      <rect x={-34} y={8} width={68} height={18} rx={6} fill={c.accent} />
    </g>
  );
};
const Brain: React.FC<IconProps & {glow?: number}> = ({x, y, s = 1, dark = false, o = 1, glow = 0}) => {
  const c = useIc(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {glow > 0 && <circle r={110 + 30 * glow} fill={c.accent} opacity={0.2 * glow} />}
      <path d="M -6 -66 C -40 -76 -76 -50 -70 -16 C -92 4 -78 44 -48 48 C -40 70 -10 74 -6 58 Z" fill={glow > 0.5 ? c.soft : c.fill} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 6 -66 C 40 -76 76 -50 70 -16 C 92 4 78 44 48 48 C 40 70 10 74 6 58 Z" fill={glow > 0.5 ? c.soft : c.fill} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -40 -30 C -26 -20 -30 0 -46 6 M 40 -30 C 26 -20 30 0 46 6 M -30 24 C -20 30 -14 40 -16 50 M 30 24 C 20 30 14 40 16 50" fill="none" stroke={c.stroke} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
const Plate: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIc(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={0} rx={150} ry={56} fill={c.fill} stroke={c.stroke} strokeWidth={6} />
      <ellipse cx={0} cy={-4} rx={104} ry={36} fill="none" stroke={c.stroke} strokeWidth={3} opacity={0.4} />
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().hook;
  const atP = Math.min(trig(scene, c.protein, fps), 40);
  const atF = trig(scene, c.full, fps);
  const plate = useSp(frame, fps, 4, 18, theme.spring.soft);
  const egg = useSp(frame, fps, atP, 16, theme.spring.soft);
  const fill = useSp(frame, fps, atF - 4, 26, theme.spring.soft);
  const drain = clamp01((frame - atF - 20) / 120);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 14} fps={fps} size={100} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g opacity={plate} transform={`translate(0 ${interpolate(plate, [0, 1], [50, 0])})`}>
          <Plate x={380} y={1060} s={1.1} />
          <Toast x={300} y={1000} s={1.1} />
        </g>
        <g transform={`translate(0 ${interpolate(egg, [0, 1], [-300, 0])})`}><Egg x={470} y={1010} s={1.1} o={egg} /></g>
        <Meter x={820} y={900} h={420} level={0.15 + 0.8 * fill - 0.08 * drain} o={plate} />
      </svg>
      <Sfx name="lib/pop" at={atP + 6} volume={0.5} />
      <Sfx name="lib/coin" at={atF} volume={0.45} />
    </AbsoluteFill>
  );
};

const Why: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const s = useSp(frame, fps, 2, 18, theme.spring.soft);
  void scene;
  return (
    <AbsoluteFill>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 900) scale(${interpolate(s, [0, 1], [0.6, 1])}) translate(-540 -900)`}>
          <Meter x={540} y={900} h={560} level={0.9} dark o={s} />
        </g>
      </svg>
      <Sfx name="lib/glassy-snap" at={4} volume={0.5} />
    </AbsoluteFill>
  );
};

/** La señal: del plato sube al cerebro; el cerebro se ilumina. */
const Hormones: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().hormones;
  const b = useBrand();
  const atH = trig(scene, c.hormones, fps);
  const atB = trig(scene, c.brain, fps);
  const enter = useSp(frame, fps, 2, 16, theme.spring.soft);
  const glow = useSp(frame, fps, atB - 1, 16);
  const path = 'M 300 1080 C 300 900 520 940 600 820 C 660 730 700 760 760 720';
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, top: LAYOUT.headlineTop - 50, ...theme.label, fontSize: 28, color: b.accent, opacity: useSp(frame, fps, 2, 12)}}>{c.label}</div>
      <Headline lines={c.lines} mode="dark" frame={frame - atH + 4} fps={fps} size={100} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <path d={path} fill="none" stroke={b.lineStrongSoot} strokeWidth={4} strokeDasharray="10 12" opacity={enter} />
        <g opacity={enter}><Plate x={300} y={1110} s={0.8} dark /><Egg x={300} y={1080} s={0.9} dark /></g>
        <Brain x={790} y={680} s={1.15} dark o={enter} glow={glow} />
        {[0, 1, 2, 3, 4].map((i) => {
          const t = clamp01((frame - atH - i * 5) / 22);
          if (t <= 0 || t >= 1) return null;
          const pts = [[300, 1080], [380, 930], [560, 860], [680, 760], [760, 720]];
          const seg = Math.min(3, Math.floor(t * 4));
          const lt = t * 4 - seg;
          const x = interpolate(lt, [0, 1], [pts[seg][0], pts[seg + 1][0]]);
          const y = interpolate(lt, [0, 1], [pts[seg][1], pts[seg + 1][1]]);
          return <circle key={i} cx={x} cy={y} r={14} fill={b.accent} />;
        })}
      </svg>
      {[0, 1, 2].map((i) => <Sfx key={i} name="tick" at={atH + i * 5} volume={0.35} />)}
      <Sfx name="lib/coin" at={atB} volume={0.5} />
    </AbsoluteFill>
  );
};

/** Pan solo se vacía rápido; con huevo, lento. */
const Digest: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().digest;
  const b = useBrand();
  const p = usePalette('dark');
  const at = Math.min(trig(scene, c.digest, fps), 40);
  const enter = useSp(frame, fps, 2, 16, theme.spring.soft);
  const t = clamp01((frame - at) / 70);
  const rows: [React.FC<IconProps>, number, boolean][] = [[Toast, 1 - 0.85 * t, true], [Egg, 1 - 0.25 * t, false]];
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="dark" frame={frame + 10} fps={fps} size={120} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {rows.map(([Icon, lv, dim], i) => {
          const y = 760 + i * 230;
          return (
            <g key={i} opacity={enter} transform={`translate(${interpolate(enter, [0, 1], [-40, 0])} 0)`}>
              <Icon x={210} y={y} s={0.95} dark dim={dim} />
              <rect x={320} y={y - 40} width={600} height={80} rx={40} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
              <rect x={328} y={y - 32} width={584 * clamp01(lv)} height={64} rx={32} fill={dim ? p.text3 : b.accent} />
            </g>
          );
        })}
      </svg>
      <Sfx name="lib/woosh" at={at} volume={0.35} />
    </AbsoluteFill>
  );
};

/** El cambio: pan y cereal (gris) + huevo, yogur, cottage (verde) en su palabra. */
const Swap: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().swap;
  const b = useBrand();
  const p = usePalette('light');
  const atT = trig(scene, c.toast, fps);
  const ats = c.words.map((w) => trig(scene, w, fps));
  const base = useSp(frame, fps, Math.min(atT, 20) - 1, 16, theme.spring.soft);
  const sps = ats.map((a) => useSp(frame, fps, a - 1, 16, theme.spring.soft));
  const plus = useSp(frame, fps, ats[0] - 6, 12);
  const xs = [250, 540, 830];
  const Icons = [Egg, Yogurt, Cottage];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, top: LAYOUT.headlineTop - 50, ...theme.label, fontSize: 28, color: b.accent, opacity: useSp(frame, fps, 2, 12)}}>{scene.label}</div>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={100} accentLine={-1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g opacity={base}>
          <Toast x={400} y={680} s={0.9} dim />
          <Cereal x={680} y={690} s={0.9} dim />
        </g>
        <text x={540} y={860} textAnchor="middle" fontFamily={b.font} fontSize={84} fontWeight={800} fill={b.accent} opacity={plus} transform={`translate(0 ${interpolate(plus, [0, 1], [20, 0])})`}>+</text>
        {xs.map((x, i) => {
          const Icon = Icons[i];
          return (
            <g key={i}>
              <circle cx={x} cy={1010} r={110} fill={b.paper} stroke={p.lineStrong} strokeWidth={2} opacity={sps[i]} />
              <Icon x={x} y={1010 + interpolate(sps[i], [0, 1], [50, 0])} s={1.05} o={sps[i]} />
            </g>
          );
        })}
      </svg>
      {ats.map((a, i) => <Sfx key={i} name="lib/pop" at={a} volume={0.5} />)}
    </AbsoluteFill>
  );
};

/** La mañana: la línea gris (pan solo) cae; la verde (con proteína) se mantiene hasta la comida. */
const Satisfied: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().satisfied;
  const b = useBrand();
  const p = usePalette('light');
  const at = trig(scene, c.word, fps);
  const draw = clamp01((frame - 4) / 50);
  const lunch = useSp(frame, fps, at - 1, 14);
  const X0 = 170, X1 = 910, Y0 = 1140, Y1 = 660;
  const fy = (v: number) => Y0 - (Y0 - Y1) * v;
  const pts = (fn: (t: number) => number) => Array.from({length: 41}, (_, i) => i / 40).filter((t) => t <= draw).map((t) => `${X0 + (X1 - X0) * t},${fy(fn(t))}`).join(' ');
  const green = (t: number) => 0.92 - 0.22 * t * t;
  const gray = (t: number) => 0.92 - 0.8 * Math.min(1, t * 1.4);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={104} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={p.lineStrong} strokeWidth={4} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 30} stroke={p.lineStrong} strokeWidth={4} />
        <text x={X0} y={Y0 + 50} textAnchor="middle" fontFamily={b.font} fontSize={30} fontWeight={600} fill={p.text3}>{c.times[0]}</text>
        <text x={X1} y={Y0 + 50} textAnchor="middle" fontFamily={b.font} fontSize={30} fontWeight={600} fill={p.text3}>{c.times[1]}</text>
        <polyline points={pts(gray)} fill="none" stroke={p.text3} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts(green)} fill="none" stroke={b.accent} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        {draw >= 1 && <Egg x={X1 + 10} y={fy(green(1)) - 70} s={0.55} />}
        <g opacity={lunch} transform={`translate(${X1} ${Y0 - 40}) scale(${interpolate(lunch, [0, 1], [0.6, 1])})`}>
          <path d="M -18 -40 V 0 M -26 -40 V -18 M -10 -40 V -18 M -26 -18 H -10 M 18 -40 C 34 -30 34 -10 18 -4 V 0" fill="none" stroke={b.ink2} strokeWidth={5} strokeLinecap="round" />
        </g>
      </svg>
      <Sfx name="lib/woosh" at={4} volume={0.35} />
      <Sfx name="lib/coin" at={at} volume={0.45} />
    </AbsoluteFill>
  );
};

/** Cierre: el nombre del canal entra cuando la voz ya lo dijo. */
const Follow: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().follow;
  const b = useBrand();
  const p = usePalette('light');
  const s = useSp(frame, fps, 2, 18, theme.spring.soft);
  const name = useSp(frame, fps, trig(scene, c.nameWord, fps) - 1, 16, theme.spring.soft);
  const sub = useSp(frame, fps, trig(scene, c.subWord, fps) - 1, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <Img src={staticFile(b.logo)} style={{width: 220, height: 250, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`}} />
        <div style={{...theme.display, fontSize: 96, color: p.text, textAlign: 'center', lineHeight: 1, opacity: name, transform: `translateY(${interpolate(name, [0, 1], [24, 0])}px)`}}>
          {c.nameLines.map((l, i) => <React.Fragment key={l}>{i > 0 && <br />}{l}</React.Fragment>)}
        </div>
        <div style={{...theme.label, fontSize: 30, color: b.accent, opacity: sub}}>{c.sub}</div>
      </div>
      <Sfx name="lib/glassy-snap" at={2} volume={0.5} />
      <Sfx name="lib/twinkle" at={trig(scene, c.subWord, fps)} volume={0.4} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBrand();
  const s = useSp(frame, fps, 0, 18, theme.spring.soft);
  return (
    <AbsoluteFill style={{background: b.canvas, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'}), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Wordmark mode="light" opacity={1} size={64} />
        {b.site ? <div style={{...theme.label, fontSize: 26, color: b.ink3}}>{b.site}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{s: TimedShortScene; fps: number}> = ({s, fps}) => {
  switch (s.kind as string) {
    case 'hook': return <Hook scene={s} fps={fps} />;
    case 'why': return <Why scene={s} fps={fps} />;
    case 'hormones': return <Hormones scene={s} fps={fps} />;
    case 'digest': return <Digest scene={s} fps={fps} />;
    case 'swap': return <Swap scene={s} fps={fps} />;
    case 'satisfied': return <Satisfied scene={s} fps={fps} />;
    case 'close': return <Follow scene={s} fps={fps} />;
    default: return null;
  }
};

const BASS_SCENES = new Set(['why', 'swap', 'follow']);
const CONTINUES = new Set<string>([]);

const Inner: React.FC<{build: ReturnType<typeof makeShortTimeline>['build']; music: string; outroFrames: number}> = ({build, music, outroFrames}) => {
  const {fps} = useVideoConfig();
  const b = useBrand();
  const {scenes, outroFrom, totalFrames} = build();
  const why = scenes.find((s) => s.id === 'why')!;
  const swap = scenes.find((s) => s.id === 'swap')!;
  return (
    <AbsoluteFill style={{background: b.soot, fontFamily: b.font}}>
      <MusicBed src={music} scenes={scenes} totalFrames={totalFrames} base={0.24} levels={[{from: why.from, base: 0.3}, {from: swap.from, base: 0.36}]} fadeInFrames={fps} />
      <ByScene scenes={scenes} until={outroFrom}>{(s) => <Background mode={s.mode as Mode} />}</ByScene>
      <PunchIn beats={scenes.slice(1).map((s) => s.from)} amount={0.025} origin="50% 55%">
        <Track name="scenes">
          {scenes.map((s) => (
            <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.durationInFrames}>
              <Audio name={`voice:${s.id}`} src={staticFile(s.audioSrc)} />
              <SceneView s={s} fps={fps} />
            </Sequence>
          ))}
        </Track>
      </PunchIn>
      <ByScene scenes={scenes} until={outroFrom}>{(s) => <Post mode={s.mode as Mode} />}</ByScene>
      <Track name="captions">
        {scenes.map((s) => (
          <Sequence key={`cap-${s.id}`} name={`captions:${s.id}`} from={s.from} durationInFrames={s.durationInFrames} layout="none">
            <Captions words={s.words} mode={s.mode as Mode} bottom={LAYOUT.captionsBottom} fontSize={64} combineMs={700} maxWidth={880} />
          </Sequence>
        ))}
      </Track>
      {scenes.slice(1).filter((s) => !CONTINUES.has(s.id)).map((s) => (
        <Cut key={`cut-${s.id}`} at={s.from} strength={s.id === 'why' ? 0.7 : BASS_SCENES.has(s.id) ? 0.5 : 0.22} bass={BASS_SCENES.has(s.id)} whoosh />
      ))}
      <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.5} />
      <Sfx name="lib/fire-whoosh" at={why.from} lead={0} volume={0.45} />
      <Sequence name="outro" from={outroFrom} durationInFrames={outroFrames}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const makeProtein = (cfg: ProteinConfig) => {
  const TL = makeShortTimeline(cfg.script, cfg.narration, cfg.words, cfg.beats, {gap: 2, outroFrames: 45, snapTolerance: 4});
  const Comp: React.FC = () => (
    <BrandProvider value={cfg.brand}>
      <CopyCtx.Provider value={cfg.copy}>
        <Inner build={TL.build} music={cfg.script.music} outroFrames={TL.OUTRO_FRAMES} />
      </CopyCtx.Provider>
    </BrandProvider>
  );
  return {Comp, timeline: TL.build, meta: {fps: cfg.script.fps, width: cfg.script.width, height: cfg.script.height}};
};
