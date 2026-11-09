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
 * "Lemon unlocks plant iron" — guion de Enrico (9 nov). Fábrica para Hello Nutrition AI (inglés) y Mi Nutriólogo (español).
 * Protagonista visual: la ficha periódica "Fe" (el hierro) y la rodaja de limón que la desbloquea. 2D plano, iconos de línea.
 * Regla nueva (Enrico, kiwis): el texto fijo nunca repite la palabra que el karaoke muestra en ese instante → titulares parafraseados
 * ("Add citrus. Get the most from beans."), alimentos como iconos sin etiqueta, el nombre del canal entra cuando la voz ya lo dijo.
 * Tres bloques: gancho (claro) → por qué: hierro, fuentes, bloqueado (oscuro) → la llave, desbloqueado, qué comer, cierre (claro).
 */

export type LemonCopy = {
  hook: {lines: string[]; lemon: string; iron: string};
  why: {label: string};
  foods: {label: string; title: string; words: [string, string, string]};
  but: {lines: string[]; lockWord: string};
  vitc: {lines: string[]; word: string};
  absorb: {lines: string[]; word: string; iron: string};
  beans: {lines: string[]; beans: string; lemon: string};
  pair: {lines: string[]; words: [string, string, string]};
  follow: {nameLines: string[]; nameWord: string; sub: string; subWord: string};
};

export type LemonConfig = {
  script: Parameters<typeof makeShortTimeline>[0];
  narration: Parameters<typeof makeShortTimeline>[1];
  words: Record<string, Word[]>;
  beats: Parameters<typeof makeShortTimeline>[3];
  brand: Brand;
  copy: LemonCopy;
};

const CopyCtx = React.createContext<LemonCopy | null>(null);
const useCopy = () => {
  const c = React.useContext(CopyCtx);
  if (!c) throw new Error('LemonCopy no provisto');
  return c;
};

const LAYOUT = {headlineTop: 300, captionsBottom: 620};
const W = 1080;
const SN = theme.spring.snappy;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);

/* Limón: amarillo del sitio (macro grasa). Es el color del objeto, no un segundo acento de marca. */
const LEMON = {rind: '#D9A80B', flesh: '#F7D64A', pith: '#FFF6C7'};

/* ---------- Ficha periódica Fe ---------- */
const FeTile: React.FC<{x: number; y: number; size: number; dark?: boolean; label?: string; o?: number; glow?: number; dim?: number}> = ({x, y, size, dark = false, label, o = 1, glow = 0, dim = 0}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  const s = size;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {glow > 0 && <rect x={-s / 2 - 40 * glow} y={-s / 2 - 40 * glow} width={s + 80 * glow} height={s + 80 * glow} rx={s * 0.16 + 20 * glow} fill={b.accent} opacity={0.22 * glow} />}
      <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={s * 0.12} fill={p.surface} stroke={b.accent} strokeWidth={s * 0.025} opacity={1 - dim * 0.55} />
      <text x={-s / 2 + s * 0.1} y={-s / 2 + s * 0.2} fontFamily={b.font} fontSize={s * 0.12} fontWeight={600} fill={p.text3}>26</text>
      <text x={0} y={s * 0.14} textAnchor="middle" fontFamily={b.font} fontSize={s * 0.42} fontWeight={800} letterSpacing="-0.03em" fill={dim ? p.text3 : p.text}>Fe</text>
      {label && <text x={0} y={s / 2 - s * 0.1} textAnchor="middle" fontFamily={b.font} fontSize={s * 0.1} fontWeight={500} fill={p.text3}>{label}</text>}
    </g>
  );
};

/* ---------- Rodaja de limón (media rodaja, plana) ---------- */
const LemonWedge: React.FC<{x: number; y: number; r: number; rot?: number; o?: number}> = ({x, y, r, rot = 0, o = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`} fill={LEMON.rind} />
    <path d={`M ${-r * 0.86} 0 A ${r * 0.86} ${r * 0.86} 0 0 1 ${r * 0.86} 0 Z`} fill={LEMON.pith} />
    <path d={`M ${-r * 0.74} 0 A ${r * 0.74} ${r * 0.74} 0 0 1 ${r * 0.74} 0 Z`} fill={LEMON.flesh} />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = Math.PI + (Math.PI * (i + 0.5)) / 5;
      return <line key={i} x1={0} y1={0} x2={Math.cos(a) * r * 0.74} y2={Math.sin(a) * r * 0.74} stroke={LEMON.pith} strokeWidth={r * 0.05} />;
    })}
    <line x1={-r * 0.86} y1={0} x2={r * 0.86} y2={0} stroke={LEMON.pith} strokeWidth={r * 0.06} />
  </g>
);

const Drop: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0,-14 C6,-4 10,2 10,7 A10,10 0 0 1 -10,7 C-10,2 -6,-4 0,-14 Z" fill={LEMON.flesh} stroke={LEMON.rind} strokeWidth={1.5} opacity={o} />
);

const Lock: React.FC<{x: number; y: number; s: number; open?: number; o?: number; color: string}> = ({x, y, s, open = 0, o = 1, color}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d={`M -18 -6 V -18 A 18 18 0 0 1 18 -18 V -6`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" transform={`translate(${open * 8} ${-open * 14}) rotate(${-open * 25} 18 -6)`} />
    <rect x={-28} y={-6} width={56} height={44} rx={9} fill={color} />
  </g>
);

/* ---------- Iconos de alimentos (línea, dos colores) ---------- */
type IconProps = {x: number; y: number; s?: number; dark?: boolean; o?: number};
const useIconColors = (dark: boolean) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  return {stroke: dark ? b.onSoot : b.ink2, fill: dark ? b.soot3 : b.paper, soft: dark ? 'rgba(46,204,112,0.22)' : b.accentSoft, accent: b.accent, text: p.text};
};
const Bean: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIconColors(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M-42,-8 C-46,-40 6,-54 30,-30 C54,-4 50,36 18,46 C-16,56 -48,30 -42,-8 Z" fill={c.soft} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-20,-6 C-8,-24 14,-26 24,-14" fill="none" stroke={c.stroke} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};
const Lentils: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIconColors(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {[[-30, 14], [30, 14], [0, -22]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={30} ry={22} fill={c.soft} stroke={c.stroke} strokeWidth={6} />)}
      {[[-30, 14], [30, 14], [0, -22]].map(([cx, cy], i) => <circle key={`d${i}`} cx={cx} cy={cy} r={6} fill={c.stroke} />)}
    </g>
  );
};
const Leaf: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIconColors(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M0,-58 C40,-42 52,12 0,58 C-52,12 -40,-42 0,-58 Z" fill={c.soft} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M0,-40 V48" stroke={c.stroke} strokeWidth={5} strokeLinecap="round" />
      <path d="M0,-6 C12,-14 20,-16 28,-14 M0,16 C-12,8 -20,6 -28,8" fill="none" stroke={c.stroke} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
const Bowl: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIconColors(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M-90,0 A90,90 0 0 0 90,0 Z" fill={c.fill} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={90} ry={16} fill={c.fill} stroke={c.stroke} strokeWidth={6} />
      {[[-40, -4, -20], [0, -10, 15], [40, -4, -10]].map(([bx, by, rot], i) => (
        <path key={i} transform={`translate(${bx} ${by}) rotate(${rot}) scale(0.42)`} d="M-42,-8 C-46,-40 6,-54 30,-30 C54,-4 50,36 18,46 C-16,56 -48,30 -42,-8 Z" fill={c.soft} stroke={c.stroke} strokeWidth={10} />
      ))}
      <path d="M-50,60 H50" stroke={c.stroke} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};
const Pepper: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIconColors(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M-40,-30 C-56,10 -46,52 -16,54 L16,54 C46,52 56,10 40,-30 C26,-44 -26,-44 -40,-30 Z" fill={c.soft} stroke={c.stroke} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-14,-34 V54 M14,-34 V54" stroke={c.stroke} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <path d="M0,-38 C4,-50 10,-56 18,-58" fill="none" stroke={c.stroke} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};
const Tomato: React.FC<IconProps> = ({x, y, s = 1, dark = false, o = 1}) => {
  const c = useIconColors(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle cx={0} cy={6} r={50} fill={c.soft} stroke={c.stroke} strokeWidth={6} />
      <path d="M0,-44 L10,-30 L28,-36 L18,-20 L34,-10 L14,-12 L8,2 L0,-12 L-8,2 L-14,-12 L-34,-10 L-18,-20 L-28,-36 L-10,-30 Z" fill={c.accent} stroke={c.stroke} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};
const CBadge: React.FC<{x: number; y: number; s: number; o?: number}> = ({x, y, s, o = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle r={30} fill={b.accent} />
      <text y={12} textAnchor="middle" fontFamily={b.font} fontSize={34} fontWeight={800} fill={b.onSoot}>C</text>
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().hook;
  const atLemon = Math.min(trig(scene, c.lemon, fps), 40);
  const atIron = trig(scene, c.iron, fps);
  const tile = useSp(frame, fps, 6, 18, theme.spring.soft);
  const lemon = useSp(frame, fps, atLemon, 18, theme.spring.soft);
  const squeeze = useSp(frame, fps, atLemon + 10, 12);
  const glow = useSp(frame, fps, atIron - 1, 16);
  const dropT = (i: number) => clamp01((frame - atLemon - 12 - i * 4) / 14);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 14} fps={fps} size={92} accentLine={2} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(560 980) scale(${interpolate(tile, [0, 1], [0.7, 1])}) translate(-560 -980)`}>
          <FeTile x={560} y={980} size={300} o={tile} glow={glow} />
        </g>
        <g transform={`translate(${interpolate(lemon, [0, 1], [-200, 0])} ${interpolate(lemon, [0, 1], [-120, 0])})`}>
          <LemonWedge x={330} y={790} r={110} rot={interpolate(squeeze, [0, 1], [-18, 8])} o={lemon} />
        </g>
        {[0, 1, 2].map((i) => {
          const t = dropT(i);
          return t > 0 && t < 1 ? <Drop key={i} x={400 + i * 18} y={interpolate(t, [0, 1], [820, 900])} s={2.2} o={1 - t * 0.6} /> : null;
        })}
      </svg>
      <Sfx name="lib/woosh" at={atLemon} volume={0.4} />
      <Sfx name="lib/pop" at={atLemon + 12} volume={0.45} />
      <Sfx name="lib/coin" at={atIron} volume={0.45} />
    </AbsoluteFill>
  );
};

const Why: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().why;
  const s = useSp(frame, fps, 2, 18, theme.spring.soft);
  void scene;
  return (
    <AbsoluteFill>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 900) scale(${interpolate(s, [0, 1], [0.6, 1])}) rotate(${interpolate(s, [0, 1], [-12, 0])}) translate(-540 -900)`}>
          <FeTile x={540} y={900} size={440} dark label={c.label} o={s} />
        </g>
      </svg>
      <Sfx name="lib/glassy-snap" at={4} volume={0.5} />
    </AbsoluteFill>
  );
};

/** Tres fuentes vegetales: iconos sin etiqueta (la etiqueta la pone el karaoke). */
const Foods: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().foods;
  const b = useBrand();
  const ats = c.words.map((w) => trig(scene, w, fps));
  const sps = ats.map((at) => useSp(frame, fps, at - 1, 16, theme.spring.soft));
  const xs = [250, 540, 830];
  return (
    <AbsoluteFill>
      <Chapter label={c.label} title={c.title} mode="dark" top={LAYOUT.headlineTop} titleSize={96} width={880} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {sps.map((s, i) => {
          const y = 960 + interpolate(s, [0, 1], [60, 0]);
          const Icon = [Bean, Lentils, Leaf][i];
          return (
            <g key={i}>
              <circle cx={xs[i]} cy={960} r={118} fill={b.soot3} stroke={b.lineStrongSoot} strokeWidth={2} opacity={s} />
              <Icon x={xs[i]} y={y} s={1.15} dark o={s} />
              <g transform={`translate(${xs[i] + 78} ${960 - 84}) scale(${s})`}>
                <circle r={30} fill={b.accent} />
                <text y={9} textAnchor="middle" fontFamily={b.font} fontSize={26} fontWeight={800} fill={b.onSoot}>Fe</text>
              </g>
            </g>
          );
        })}
      </svg>
      {ats.map((at, i) => <Sfx key={i} name="lib/pop" at={at} volume={0.5} />)}
    </AbsoluteFill>
  );
};

const But: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().but;
  const b = useBrand();
  const atLock = trig(scene, c.lockWord, fps);
  const lock = useSp(frame, fps, atLock - 1, 14);
  const dim = useSp(frame, fps, atLock, 20, theme.spring.soft);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="dark" frame={frame - atLock + 4} fps={fps} size={132} accentLine={-1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <FeTile x={540} y={960} size={360} dark dim={dim} />
        <g transform={`translate(0 ${interpolate(lock, [0, 1], [-60, 0])})`}>
          <Lock x={540} y={960} s={2.4 * lock} color={b.onSoot} o={lock} />
        </g>
      </svg>
      <Sfx name="lib/snap" at={atLock} volume={0.55} />
    </AbsoluteFill>
  );
};

const VitC: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().vitc;
  const b = useBrand();
  const at = Math.min(trig(scene, c.word, fps), 30);
  const s = useSp(frame, fps, at - 1, 18, theme.spring.soft);
  const badge = useSp(frame, fps, at + 8, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, top: LAYOUT.headlineTop - 50, ...theme.label, fontSize: 28, color: b.accent, opacity: useSp(frame, fps, 2, 12)}}>{scene.label}</div>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={104} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 1000) scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${interpolate(s, [0, 1], [-30, 0])}) translate(-540 -1000)`}>
          <LemonWedge x={540} y={1020} r={210} o={s} />
        </g>
        <CBadge x={740} y={820} s={1.6 * badge} o={badge} />
      </svg>
      <Sfx name="lib/woosh" at={at - 2} volume={0.4} />
      <Sfx name="lib/coin" at={at + 8} volume={0.5} />
    </AbsoluteFill>
  );
};

const Absorb: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().absorb;
  const b = useBrand();
  const atOpen = trig(scene, c.word, fps);
  const atIron = trig(scene, c.iron, fps);
  const open = useSp(frame, fps, atOpen, 14);
  const gone = clamp01((frame - atOpen - 8) / 10);
  const glow = useSp(frame, fps, atIron - 1, 16);
  const chips = [0, 1, 2].map((i) => useSp(frame, fps, atIron + i * 3, 18, theme.spring.soft));
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame - atOpen + 6} fps={fps} size={132} accentLine={0} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <LemonWedge x={220} y={760} r={110} rot={-14} />
        <CBadge x={300} y={680} s={1.1} />
        <FeTile x={560} y={1000} size={320} glow={glow} />
        <g transform={`translate(${gone * 90} ${-gone * 140}) rotate(${gone * 30} 560 1000)`}>
          <Lock x={560} y={1000} s={2.2} open={open} o={1 - gone} color={b.ink} />
        </g>
        {chips.map((s, i) => (
          <g key={i} transform={`translate(${760 + i * 70} ${interpolate(s, [0, 1], [1000, 760 - i * 40])})`} opacity={s * (1 - 0.15 * i)}>
            <circle r={28} fill={b.accent} />
            <text y={9} textAnchor="middle" fontFamily={b.font} fontSize={24} fontWeight={800} fill={b.onSoot}>Fe</text>
          </g>
        ))}
      </svg>
      <Sfx name="lib/glassy-snap" at={atOpen} volume={0.5} />
      <Sfx name="lib/coin" at={atIron} volume={0.5} />
    </AbsoluteFill>
  );
};

const Beans: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().beans;
  const atBeans = trig(scene, c.beans, fps);
  const atLemon = trig(scene, c.lemon, fps);
  const bowl = useSp(frame, fps, atBeans - 1, 18, theme.spring.soft);
  const lemon = useSp(frame, fps, atLemon - 1, 18, theme.spring.soft);
  const squeeze = useSp(frame, fps, atLemon + 10, 12);
  const dropT = (i: number) => clamp01((frame - atLemon - 12 - i * 4) / 14);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={104} accentLine={-1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(0 ${interpolate(bowl, [0, 1], [80, 0])})`}>
          <Bowl x={540} y={1040} s={1.5} o={bowl} />
        </g>
        <g transform={`translate(${interpolate(lemon, [0, 1], [220, 0])} ${interpolate(lemon, [0, 1], [-140, 0])})`}>
          <LemonWedge x={760} y={720} r={110} rot={interpolate(squeeze, [0, 1], [-30, -75])} o={lemon} />
        </g>
        {[0, 1, 2].map((i) => {
          const t = dropT(i);
          return t > 0 && t < 1 ? <Drop key={i} x={690 - i * 14} y={interpolate(t, [0, 1], [790, 960])} s={2.2} o={1 - t * 0.5} /> : null;
        })}
      </svg>
      <Sfx name="lib/pop" at={atBeans} volume={0.5} />
      <Sfx name="lib/woosh" at={atLemon - 2} volume={0.4} />
      <Sfx name="lib/pop" at={atLemon + 12} volume={0.4} />
    </AbsoluteFill>
  );
};

const Pair: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().pair;
  const b = useBrand();
  const p = usePalette('light');
  const ats = c.words.map((w) => trig(scene, w, fps));
  const sps = ats.map((at) => useSp(frame, fps, at - 1, 16, theme.spring.soft));
  const xs = [250, 540, 830];
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={104} accentLine={-1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {sps.map((s, i) => {
          const Icon = [Lentils, Pepper, Tomato][i];
          return (
            <g key={i}>
              <circle cx={xs[i]} cy={960} r={104} fill={b.paper} stroke={p.lineStrong} strokeWidth={2} opacity={s} />
              <Icon x={xs[i]} y={960 + interpolate(s, [0, 1], [60, 0])} s={1} o={s} />
              {i > 0 && <CBadge x={xs[i] + 70} y={960 - 74} s={s} />}
              {i > 0 && <text x={(xs[i] + xs[i - 1]) / 2} y={982} textAnchor="middle" fontFamily={b.font} fontSize={64} fontWeight={700} fill={p.text3} opacity={s}>+</text>}
            </g>
          );
        })}
      </svg>
      {ats.map((at, i) => <Sfx key={i} name="lib/pop" at={at} volume={0.5} />)}
    </AbsoluteFill>
  );
};

/** Cierre: el nombre del canal entra cuando la voz ya lo dijo (regla de no repetir). */
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
    case 'foods': return <Foods scene={s} fps={fps} />;
    case 'but': return <But scene={s} fps={fps} />;
    case 'turn': return <VitC scene={s} fps={fps} />;
    case 'absorb': return <Absorb scene={s} fps={fps} />;
    case 'beans': return <Beans scene={s} fps={fps} />;
    case 'pair': return <Pair scene={s} fps={fps} />;
    case 'close': return <Follow scene={s} fps={fps} />;
    default: return null;
  }
};

const BASS_SCENES = new Set(['why', 'vitc', 'follow']);
const CONTINUES = new Set<string>([]);

const Inner: React.FC<{build: ReturnType<typeof makeShortTimeline>['build']; music: string; outroFrames: number}> = ({build, music, outroFrames}) => {
  const {fps} = useVideoConfig();
  const b = useBrand();
  const {scenes, outroFrom, totalFrames} = build();
  const why = scenes.find((s) => s.id === 'why')!;
  const vitc = scenes.find((s) => s.id === 'vitc')!;
  return (
    <AbsoluteFill style={{background: b.soot, fontFamily: b.font}}>
      <MusicBed src={music} scenes={scenes} totalFrames={totalFrames} base={0.24} levels={[{from: why.from, base: 0.3}, {from: vitc.from, base: 0.36}]} fadeInFrames={fps} />
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

export const makeLemon = (cfg: LemonConfig) => {
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
