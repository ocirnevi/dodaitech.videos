import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import scriptJson from '../../script/ai-overnight.json';
import narration from '../data/ai-overnight/narration.json';
import wordsJson from '../data/ai-overnight/words.json';
import beatsJson from '../data/ai-overnight/beats.json';
import {Background} from '../components/Background';
import {ByScene} from '../components/ByScene';
import {Captions} from '../components/Captions';
import {Cut} from '../components/Cut';
import {HostSplit} from '../components/HostSplit';
import {MusicBed} from '../components/MusicBed';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';
import {triggerFrameIn, type Word} from '../script';
import {theme, useBrand, usePalette, type Mode} from '../theme';
import {Headline, Pill} from './AiMemory';
import type {TimedShortScene} from './script';
import {makeShortTimeline} from './timeline';

/**
 * dodaitech · "AI that works while you sleep" — guion de Enrico (9 nov). Armature: los agentes ya no responden, actúan, y en horario.
 * Tres bloques: noche (oscuro: el agente trabaja solo en el navegador, el correo, la investigación, las diapositivas) →
 * giro "the best part" (claro: se programa) → amanece con todo listo (payoff) → herramientas → "getting things done".
 * Inicio = opuesto del final: luna y portátil trabajando solo ↔ sol y tareas terminadas.
 * Reglas aplicadas: ningún texto fijo repite la palabra del karaoke (titulares parafraseados, marcas entran tras decirse),
 * voz apretada con tighten-narration, GAP 2. Host P2 opcional mitad y mitad en hook y cierre (script.host).
 */
const TL = makeShortTimeline(scriptJson, narration, wordsJson as Record<string, Word[]>, beatsJson, {gap: 2, outroFrames: 45, snapTolerance: 4});
export const aiOvernightTimeline = TL.build;
export const AI_OVERNIGHT = {fps: scriptJson.fps, width: scriptJson.width, height: scriptJson.height};

const LAYOUT = {headlineTop: 300, captionsBottom: 620};
const W = 1080;
const SN = theme.spring.snappy;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);
type Host = {enabled: boolean; layout?: string; split?: number; focusY?: number; clips: {hook?: string; follow?: string}};
const HOST = (scriptJson as {host?: Host}).host ?? {enabled: false, clips: {}};
const SPLIT_Y = HOST.split ?? 960;
const hostClip = (id: 'hook' | 'follow') => (HOST.enabled && HOST.layout === 'split' ? HOST.clips[id] : undefined);
const captionsBottomFor = (id: string) => ((id === 'hook' || id === 'follow') && hostClip(id as 'hook' | 'follow') ? 1920 - SPLIT_Y - 60 : LAYOUT.captionsBottom);

/** Posición del cursor del agente: va de un punto al siguiente con un spring que arranca 8 frames antes de cada palabra. */
const pathPos = (frame: number, fps: number, keys: {at: number; x: number; y: number}[]) => {
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const k = spring({frame: frame - (keys[i].at - 8), fps, config: SN, durationInFrames: 10});
    x = interpolate(k, [0, 1], [x, keys[i].x]);
    y = interpolate(k, [0, 1], [y, keys[i].y]);
  }
  return {x, y};
};

/* ---------- Piezas (2D plano, línea en dos colores) ---------- */
const Cursor: React.FC<{x: number; y: number; s?: number; press?: number}> = ({x, y, s = 1, press = 0}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 - press * 0.15)})`}>
      {press > 0 && <circle r={34 + 30 * press} fill={b.accent} opacity={0.35 * (1 - press)} />}
      <path d="M0,0 L0,52 L13,40 L22,62 L32,58 L23,37 L40,37 Z" fill={b.accent} stroke={b.onSoot} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
};
const Check: React.FC<{x: number; y: number; r?: number; s?: number}> = ({x, y, r = 26, s = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp01(s)}>
      <circle r={r} fill={b.accent} />
      <path d={`M ${-r * 0.42} ${r * 0.02} L ${-r * 0.1} ${r * 0.34} L ${r * 0.45} ${-r * 0.3}`} fill="none" stroke={b.onSoot} strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
const Moon: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <mask id="moonmask"><rect x={-r * 2} y={-r * 2} width={r * 4} height={r * 4} fill="white" /><circle cx={r * 0.45} cy={-r * 0.25} r={r * 0.85} fill="black" /></mask>
      <circle r={r} fill={b.onSoot} mask="url(#moonmask)" />
    </g>
  );
};
const Stars: React.FC<{frame: number; o?: number}> = ({frame, o = 1}) => {
  const b = useBrand();
  const pts = [[160, 520], [300, 610], [880, 700], [960, 520], [220, 760], [700, 520], [420, 520]];
  return (
    <g opacity={o}>
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 2)} fill={b.onSoot} opacity={0.35 + 0.35 * Math.abs(Math.sin(frame * 0.08 + i))} />)}
    </g>
  );
};
const Laptop: React.FC<{x: number; y: number; w: number; children?: React.ReactNode; dark?: boolean}> = ({x, y, w, children, dark = true}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  const h = w * 0.62;
  return (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
      <rect x={0} y={0} width={w} height={h} rx={22} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} />
      <g transform="translate(20 20)">{children}</g>
      <path d={`M ${-w * 0.08} ${h + 6} H ${w * 1.08} L ${w * 1.02} ${h + 30} H ${-w * 0.02} Z`} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} strokeLinejoin="round" />
      <rect x={w * 0.42} y={h + 6} width={w * 0.16} height={8} rx={4} fill={b.accent} opacity={0.6} />
    </g>
  );
};
const MailIcon: React.FC<{x: number; y: number; s?: number; o?: number; dark?: boolean}> = ({x, y, s = 1, o = 1, dark = true}) => {
  const p = usePalette(dark ? 'dark' : 'light');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="none" stroke={p.text} strokeWidth={6} strokeLinejoin="round">
      <rect x={-56} y={-40} width={112} height={80} rx={12} fill={p.surface} />
      <path d="M -52 -34 L 0 8 L 52 -34" />
    </g>
  );
};
const CalIcon: React.FC<{x: number; y: number; s?: number; o?: number; dark?: boolean}> = ({x, y, s = 1, o = 1, dark = true}) => {
  const b = useBrand();
  const p = usePalette(dark ? 'dark' : 'light');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} strokeLinejoin="round">
      <rect x={-52} y={-46} width={104} height={96} rx={12} fill={p.surface} stroke={p.text} strokeWidth={6} />
      <rect x={-52} y={-46} width={104} height={26} rx={10} fill={b.accent} />
      <path d="M -26 -58 V -36 M 26 -58 V -36" stroke={p.text} strokeWidth={6} strokeLinecap="round" />
      {[[-26, 4], [0, 4], [26, 4], [-26, 28], [0, 28]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6} fill={p.text3} />)}
    </g>
  );
};
const AgentNode: React.FC<{x: number; y: number; r?: number; o?: number; frame: number}> = ({x, y, r = 30, o = 1, frame}) => {
  const b = useBrand();
  const pulse = (Math.sin(frame * 0.15) + 1) / 2;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={r + 14 + pulse * 10} fill={b.accent} opacity={0.14} />
      <circle r={r} fill={b.accent} />
      <circle r={r * 0.32} fill={b.onSoot} />
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const host = hostClip('hook');
  const ats = [trig(scene, 'work', fps), trig(scene, 'while', fps), trig(scene, 'sleeping', fps)].map((a, i) => Math.min(a, 20 + i * 18));
  const lap = useSp(frame, fps, 4, 18, theme.spring.soft);
  const moon = useSp(frame, fps, 0, 22, theme.spring.soft);
  const cx = 540;
  const cy = host ? 700 : 930;
  const w = host ? 420 : 560;
  const rowsY = [40, 110, 180];
  const cur = pathPos(frame, fps, [{at: 0, x: w - 80, y: 250}, ...ats.map((a, i) => ({at: a, x: w - 100, y: rowsY[i] + 30}))]);
  return (
    <AbsoluteFill>
      <Headline lines={['Your to-do list,', 'done by morning.']} mode="dark" frame={frame + 14} fps={fps} size={host ? 84 : 96} top={host ? 230 : LAYOUT.headlineTop} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <Stars frame={frame} o={moon * 0.9} />
        <Moon x={870} y={host ? 520 : 600} r={56} o={moon} />
        <g opacity={lap} transform={`translate(0 ${interpolate(lap, [0, 1], [60, 0])})`}>
          <Laptop x={cx} y={cy} w={w}>
            {rowsY.map((ry, i) => {
              const done = useSp(frame, fps, ats[i], 12);
              return (
                <g key={i}>
                  <rect x={10} y={ry} width={w - 80} height={52} rx={12} fill={p.bg2} />
                  <rect x={70} y={ry + 20} width={(w - 220) * (1 - 0.25 * i)} height={12} rx={6} fill={p.text3} opacity={1 - done * 0.5} />
                  <circle cx={38} cy={ry + 26} r={16} fill="none" stroke={p.text3} strokeWidth={4} />
                  <Check x={38} y={ry + 26} r={18} s={done} />
                </g>
              );
            })}
            <Cursor x={cur.x} y={cur.y} s={0.8} />
          </Laptop>
        </g>
        <text x={930} y={(host ? 520 : 600) - 70} fontFamily={b.font} fontSize={34} fontWeight={700} fill={p.text3} opacity={moon * (0.5 + 0.5 * Math.sin(frame * 0.1))}>z z</text>
      </svg>
      {host ? <HostSplit src={host} mode="dark" split={SPLIT_Y} focusY={HOST.focusY ?? 0.18} durationInFrames={scene.durationInFrames} enterLead={10} /> : null}
      {ats.map((a, i) => <Sfx key={i} name="lib/pop" at={a} volume={0.45} />)}
    </AbsoluteFill>
  );
};

const Now: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const at = trig(scene, 'now', fps);
  const on = useSp(frame, fps, at - 1, 12);
  const enter = useSp(frame, fps, 0, 12);
  return (
    <AbsoluteFill>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 880) scale(${interpolate(enter, [0, 1], [0.8, 1])})`} opacity={enter}>
          {on > 0.5 && <rect x={-230 - 30 * on} y={-120 - 30 * on} width={460 + 60 * on} height={240 + 60 * on} rx={150} fill={b.accent} opacity={0.12} />}
          <rect x={-230} y={-120} width={460} height={240} rx={120} fill={interpolate(on, [0, 1], [0, 1]) > 0.5 ? b.accent : p.surface} stroke={p.lineStrong} strokeWidth={4} />
          <circle cx={interpolate(on, [0, 1], [-110, 110])} cy={0} r={96} fill={b.onSoot} />
        </g>
      </svg>
      <Sfx name="lib/glassy-snap" at={at} volume={0.55} />
    </AbsoluteFill>
  );
};

/** El agente maneja el navegador: barra de direcciones, botón, formulario, enviar, check. */
const Browse: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const aSite = trig(scene, 'websites', fps);
  const aBtn = trig(scene, 'buttons', fps);
  const aForm = trig(scene, 'forms', fps);
  const aDone = trig(scene, 'tasks', fps);
  const win = useSp(frame, fps, 0, 16, theme.spring.soft);
  const typed = clamp01((frame - aSite) / 12);
  const url = 'app.store.com/checkout';
  const press = (at: number) => clamp01((frame - at) / 8) * (frame >= at ? 1 : 0) * (frame - at < 8 ? 1 : 0);
  const fill1 = clamp01((frame - aForm) / 10);
  const fill2 = clamp01((frame - aForm - 6) / 10);
  const done = useSp(frame, fps, aDone, 14);
  const cur = pathPos(frame, fps, [{at: 0, x: 560, y: 1180}, {at: aSite, x: 330, y: 600}, {at: aBtn, x: 380, y: 780}, {at: aForm, x: 560, y: 900}, {at: aForm + 10, x: 560, y: 985}, {at: aDone - 6, x: 760, y: 1090}]);
  const pressing = Math.max(press(aSite), press(aBtn), press(aDone - 6));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, top: LAYOUT.headlineTop - 50, ...theme.label, fontSize: 28, color: b.accent, opacity: useSp(frame, fps, 2, 12)}}>{scene.label}</div>
      <Headline lines={['Hands off', 'the mouse.']} mode="dark" frame={frame + 10} fps={fps} size={96} accentLine={-1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g opacity={win} transform={`translate(0 ${interpolate(win, [0, 1], [50, 0])})`}>
          <rect x={140} y={540} width={800} height={640} rx={26} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} />
          {[0, 1, 2].map((i) => <circle key={i} cx={180 + i * 30} cy={575} r={8} fill={p.text3} />)}
          <rect x={290} y={556} width={620} height={44} rx={22} fill={p.bg2} />
          <text x={314} y={586} fontFamily={b.font} fontSize={24} fontWeight={500} fill={p.text2}>{url.slice(0, Math.round(url.length * typed))}</text>
          <rect x={200} y={740} width={250} height={76} rx={16} fill={frame >= aBtn ? b.accent : p.bg2} stroke={p.lineStrong} strokeWidth={3} />
          <rect x={240} y={772} width={170} height={12} rx={6} fill={frame >= aBtn ? b.onSoot : p.text3} />
          {[[880, fill1], [965, fill2]].map(([y, f], i) => (
            <g key={i}>
              <rect x={200} y={y as number} width={680} height={58} rx={12} fill={p.bg2} stroke={p.lineStrong} strokeWidth={2} />
              <rect x={226} y={(y as number) + 23} width={(i ? 300 : 420) * (f as number)} height={12} rx={6} fill={p.text} />
            </g>
          ))}
          <rect x={660} y={1060} width={220} height={70} rx={35} fill={frame >= aDone - 6 ? b.accent : p.bg2} stroke={p.lineStrong} strokeWidth={3} />
          <Check x={910} y={560} r={38} s={done} />
        </g>
        <Cursor x={cur.x} y={cur.y} press={pressing} />
      </svg>
      {[aSite, aBtn, aForm, aDone - 6].map((a, i) => <Sfx key={i} name={i === 2 ? 'tick' : 'lib/snap'} at={a} volume={0.45} />)}
      <Sfx name="lib/coin" at={aDone} volume={0.5} />
    </AbsoluteFill>
  );
};

const Inbox: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const aMail = trig(scene, 'email', fps);
  const aCal = trig(scene, 'calendar', fps);
  const aImp = trig(scene, 'important', fps);
  const aRep = trig(scene, 'replies', fps);
  const aSch = trig(scene, 'schedule', fps);
  const m = useSp(frame, fps, aMail - 2, 14);
  const c = useSp(frame, fps, aCal - 2, 14);
  const imp = useSp(frame, fps, aImp - 1, 12);
  const rep = useSp(frame, fps, aRep - 1, 14);
  const sch = useSp(frame, fps, aSch - 1, 18, theme.spring.soft);
  const panels = useSp(frame, fps, aImp - 10, 16, theme.spring.soft);
  const blocks = [[0, 30, 100], [1, 160, 70], [2, 260, 120]];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, top: LAYOUT.headlineTop - 50, ...theme.label, fontSize: 28, color: b.accent, opacity: useSp(frame, fps, 2, 12)}}>{scene.label}</div>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <line x1={330} y1={460} x2={540} y2={540} stroke={b.accent} strokeWidth={4} strokeDasharray="10 10" opacity={m} />
        <line x1={750} y1={460} x2={540} y2={540} stroke={b.accent} strokeWidth={4} strokeDasharray="10 10" opacity={c} />
        <MailIcon x={330} y={440} s={m} o={m} />
        <CalIcon x={750} y={440} s={c} o={c} />
        <AgentNode x={540} y={560} frame={frame} o={Math.max(m, c)} />
        <g opacity={panels} transform={`translate(0 ${interpolate(panels, [0, 1], [40, 0])})`}>
          <rect x={120} y={680} width={500} height={500} rx={22} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => {
            const hl = i === 1 ? imp : 0;
            return (
              <g key={i}>
                <rect x={140} y={705 + i * 112} width={460} height={92} rx={14} fill={hl > 0.5 ? b.accent : p.bg2} opacity={hl > 0.5 ? 0.9 : 1} />
                <circle cx={180} cy={751 + i * 112} r={18} fill={hl > 0.5 ? b.onSoot : p.text3} />
                <rect x={214} y={736 + i * 112} width={250 - i * 30} height={12} rx={6} fill={hl > 0.5 ? b.onSoot : p.text2} />
                <rect x={214} y={758 + i * 112} width={180 - i * 20} height={10} rx={5} fill={hl > 0.5 ? b.onSoot : p.text3} opacity={0.7} />
                {i === 1 && <text x={560} y={763 + i * 112} textAnchor="middle" fontSize={34} opacity={imp}>★</text>}
              </g>
            );
          })}
          <g opacity={rep} transform={`translate(${interpolate(rep, [0, 1], [-30, 0])} 0)`}>
            <path d="M 300 905 h 280 a 16 16 0 0 1 16 16 v 56 a 16 16 0 0 1 -16 16 h -230 l -30 22 v -22 h -20 a 16 16 0 0 1 -16 -16 v -56 a 16 16 0 0 1 16 -16 z" fill={b.onSoot} />
            <rect x={320} y={930} width={200} height={10} rx={5} fill={b.soot} opacity={0.6} />
            <rect x={320} y={952} width={140} height={10} rx={5} fill={b.soot} opacity={0.4} />
          </g>
          <rect x={650} y={680} width={310} height={500} rx={22} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={670} y1={730 + i * 95} x2={940} y2={730 + i * 95} stroke={p.line} strokeWidth={2} />)}
          {blocks.map(([i, y0, h]) => {
            const messy = [[40, 700], [-30, 860], [20, 960]][i];
            const tidy = [730, 840, 935][i];
            const x = interpolate(sch, [0, 1], [690 + messy[0], 690]);
            const y = interpolate(sch, [0, 1], [messy[1], tidy]);
            void y0;
            return <rect key={i} x={x} y={y} width={230} height={(h as number) * 0.8} rx={12} fill={b.accent} opacity={0.35 + 0.55 * sch} />;
          })}
        </g>
      </svg>
      <Sfx name="lib/pop" at={aMail} volume={0.45} />
      <Sfx name="lib/pop" at={aCal} volume={0.45} />
      <Sfx name="tick" at={aImp} volume={0.5} />
      <Sfx name="lib/woosh" at={aRep - 2} volume={0.35} />
      <Sfx name="lib/coin" at={aSch} volume={0.45} />
    </AbsoluteFill>
  );
};

const Research: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const aCmp = trig(scene, 'compare', fps);
  const aSheet = trig(scene, 'spreadsheet', fps);
  const cards = useSp(frame, fps, 2, 16, theme.spring.soft);
  const arrows = clamp01((frame - aCmp) / 12);
  const sheet = useSp(frame, fps, aSheet - 6, 14);
  const cols = 4;
  const rows = 4;
  return (
    <AbsoluteFill>
      <Headline lines={['A vs B,', 'in rows.']} mode="dark" frame={frame + 10} fps={fps} size={100} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {[['A', 270], ['B', 810]].map(([l, x], i) => (
          <g key={i} opacity={cards} transform={`translate(${x} ${interpolate(cards, [0, 1], [700, 660])})`}>
            <rect x={-130} y={-90} width={260} height={180} rx={18} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
            <rect x={-130} y={-90} width={260} height={34} rx={16} fill={p.bg2} />
            <text x={0} y={42} textAnchor="middle" fontFamily={b.font} fontSize={72} fontWeight={800} fill={p.text}>{l}</text>
          </g>
        ))}
        {[270, 810].map((x, i) => <path key={i} d={`M ${x} 760 Q ${x} 820 ${540 + (x - 540) * 0.5} 860`} fill="none" stroke={b.accent} strokeWidth={5} strokeDasharray="200" strokeDashoffset={200 * (1 - arrows)} strokeLinecap="round" />)}
        <g opacity={sheet} transform={`translate(0 ${interpolate(sheet, [0, 1], [40, 0])})`}>
          <rect x={180} y={880} width={720} height={320} rx={18} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
          {Array.from({length: rows}).map((_, r) => Array.from({length: cols}).map((__, c) => {
            const k = clamp01((frame - aSheet - (r * cols + c) * 2) / 6);
            const cw = 720 / cols;
            const ch = 320 / rows;
            return (
              <g key={`${r}-${c}`}>
                <rect x={180 + c * cw + 8} y={880 + r * ch + 8} width={cw - 16} height={ch - 16} rx={8} fill={r === 0 ? b.accent : p.bg2} opacity={r === 0 ? 0.9 * k : 1} />
                {r > 0 && <rect x={180 + c * cw + 24} y={880 + r * ch + ch / 2 - 6} width={(cw - 48) * k * (0.5 + 0.5 * (((r + c) * 37) % 10) / 10)} height={12} rx={6} fill={p.text2} />}
              </g>
            );
          }))}
        </g>
      </svg>
      <Sfx name="lib/woosh" at={aCmp} volume={0.35} />
      <Sfx name="lib/coin" at={aSheet} volume={0.45} />
    </AbsoluteFill>
  );
};

const Deck: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const at = trig(scene, 'create', fps);
  const stack = useSp(frame, fps, 2, 14);
  const fan = useSp(frame, fps, at - 1, 18, theme.spring.soft);
  return (
    <AbsoluteFill>
      <Headline lines={['Slides:', 'handled.']} mode="dark" frame={frame + 10} fps={fps} size={110} accentLine={1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2].map((i) => {
          const rot = interpolate(fan, [0, 1], [0, (i - 1) * 9]);
          const dx = interpolate(fan, [0, 1], [0, (i - 1) * 150]);
          const dy = interpolate(fan, [0, 1], [i * -10, Math.abs(i - 1) * 40]);
          return (
            <g key={i} opacity={stack} transform={`translate(${540 + dx} ${940 + dy}) rotate(${rot})`}>
              <rect x={-230} y={-140} width={460} height={280} rx={18} fill={p.surface} stroke={p.lineStrong} strokeWidth={3} />
              <rect x={-200} y={-110} width={220} height={22} rx={8} fill={i === 1 ? b.accent : p.text2} opacity={fan > 0.3 ? 1 : 0.4} />
              {[0, 1, 2, 3].map((k) => <rect key={k} x={-190 + k * 70} y={100 - (30 + ((k + i) % 3) * 40) * fan} width={46} height={(30 + ((k + i) % 3) * 40) * fan} rx={6} fill={i === 1 ? b.accent : p.text3} />)}
              <rect x={110} y={-60} width={90} height={10} rx={5} fill={p.text3} opacity={fan} />
              <rect x={110} y={-36} width={70} height={10} rx={5} fill={p.text3} opacity={fan} />
            </g>
          );
        })}
      </svg>
      <Sfx name="lib/woosh" at={at - 2} volume={0.4} />
      <Sfx name="lib/pop" at={at + 4} volume={0.45} />
    </AbsoluteFill>
  );
};

const Best: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const s = useSp(frame, fps, 1, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 640, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`, transformOrigin: 'left center'}}>
        <div style={{...theme.label, fontSize: 28, color: b.accent}}>{scene.label}</div>
        <div style={{...theme.display, fontSize: 168, color: p.text, marginTop: 12, lineHeight: 0.95}}>Plot<br />twist.</div>
      </div>
    </AbsoluteFill>
  );
};

const Schedule: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const at = trig(scene, 'automatically', fps);
  const clock = useSp(frame, fps, 0, 16, theme.spring.soft);
  const spin = frame * 9;
  const labels = ['2 AM', '4 AM', '6 AM'];
  return (
    <AbsoluteFill>
      <Headline lines={['Set it once.']} mode="light" frame={frame + 10} fps={fps} size={112} accentLine={0} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 760) scale(${interpolate(clock, [0, 1], [0.7, 1])})`} opacity={clock}>
          <circle r={150} fill={b.paper} stroke={p.text} strokeWidth={8} />
          {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-128} x2={0} y2={i % 3 === 0 ? -108 : -118} stroke={p.text3} strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-70} stroke={p.text} strokeWidth={10} strokeLinecap="round" transform={`rotate(${spin / 12})`} />
          <line x1={0} y1={0} x2={0} y2={-110} stroke={b.accent} strokeWidth={6} strokeLinecap="round" transform={`rotate(${spin})`} />
          <circle r={10} fill={p.text} />
          <path d="M 120 -150 a 190 190 0 0 1 60 110" fill="none" stroke={b.accent} strokeWidth={8} strokeLinecap="round" />
          <path d="M 168 -52 l 14 14 l 12 -20" fill="none" stroke={b.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <line x1={170} y1={1060} x2={910} y2={1060} stroke={p.lineStrong} strokeWidth={4} />
        {labels.map((l, i) => {
          const x = 260 + i * 280;
          const k = useSp(frame, fps, at + i * 6, 12);
          return (
            <g key={l}>
              <rect x={x - 100} y={990} width={200} height={70} rx={35} fill={k > 0.5 ? b.accent : b.paper} stroke={p.lineStrong} strokeWidth={3} transform={`translate(0 ${-10 * k})`} />
              <text x={x} y={1037 - 10 * k} textAnchor="middle" fontFamily={b.font} fontSize={30} fontWeight={700} fill={k > 0.5 ? b.onSoot : p.text2}>{l}</text>
            </g>
          );
        })}
      </svg>
      {labels.map((l, i) => <Sfx key={l} name="tick" at={at + i * 6} volume={0.45} />)}
    </AbsoluteFill>
  );
};

/** Payoff: amanece y todo está listo (opuesto del hook). */
const Wake: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const ats = [trig(scene, 'summarized', fps), trig(scene, 'analyzed', fps), trig(scene, 'ready', fps)];
  const sun = useSp(frame, fps, 0, 30, theme.spring.soft);
  const xs = [150, 430, 710];
  return (
    <AbsoluteFill>
      <Headline lines={['7:00 AM']} mode="light" frame={frame + 10} fps={fps} size={132} accentLine={0} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <defs><clipPath id="horizon"><rect x={0} y={0} width={W} height={800} /></clipPath></defs>
        <g clipPath="url(#horizon)">
          <g transform={`translate(540 ${interpolate(sun, [0, 1], [920, 790])})`}>
            {Array.from({length: 9}).map((_, i) => <line key={i} x1={0} y1={-150} x2={0} y2={-190} stroke={b.accent} strokeWidth={8} strokeLinecap="round" opacity={0.7} transform={`rotate(${-80 + i * 20})`} />)}
            <circle r={120} fill={b.accent} />
          </g>
        </g>
        <line x1={120} y1={800} x2={960} y2={800} stroke={p.lineStrong} strokeWidth={4} />
        {xs.map((x, i) => {
          const k = useSp(frame, fps, ats[i] - 4, 14, theme.spring.soft);
          const done = useSp(frame, fps, ats[i] + 4, 12);
          return (
            <g key={i} opacity={k} transform={`translate(${x} ${interpolate(k, [0, 1], [900, 860])})`}>
              <rect x={0} y={0} width={220} height={270} rx={20} fill={b.paper} stroke={p.lineStrong} strokeWidth={3} />
              {i === 0 && <><MailIcon x={110} y={80} s={0.7} dark={false} />{[0, 1, 2].map((r) => <rect key={r} x={40} y={150 + r * 28} width={140 - r * 30} height={12} rx={6} fill={p.text3} />)}</>}
              {i === 1 && [0, 1, 2, 3].map((r) => <rect key={r} x={34 + r * 42} y={220 - [60, 110, 80, 150][r] * done} width={30} height={[60, 110, 80, 150][r] * done} rx={6} fill={r === 3 ? b.accent : p.text3} />)}
              {i === 2 && <><path d="M 60 40 h 70 l 30 30 v 110 h -100 z" fill="none" stroke={p.text} strokeWidth={6} strokeLinejoin="round" />{[0, 1, 2].map((r) => <rect key={r} x={76} y={100 + r * 24} width={68} height={10} rx={5} fill={p.text3} />)}</>}
              <Check x={200} y={20} r={26} s={done} />
            </g>
          );
        })}
      </svg>
      <Sfx name="lib/twinkle" at={4} volume={0.35} />
      {ats.map((a, i) => <Sfx key={i} name="lib/coin" at={a + 4} volume={0.4} />)}
    </AbsoluteFill>
  );
};

/** Las marcas entran justo después de que la voz las nombra (regla de no repetir con el karaoke). */
const Tools: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const a1 = trig(scene, 'and', fps);
  const a2 = trig(scene, 'are', fps);
  const s1 = useSp(frame, fps, a1, 14);
  const s2 = useSp(frame, fps, a2, 14);
  return (
    <AbsoluteFill>
      <Headline lines={['Already', 'here.']} mode="light" frame={frame + 10} fps={fps} size={120} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <AgentNode x={540} y={890} r={40} frame={frame} />
        <line x1={540} y1={850} x2={540} y2={740} stroke={b.accent} strokeWidth={4} strokeDasharray="10 10" opacity={s1} />
        <line x1={540} y1={930} x2={540} y2={1010} stroke={b.accent} strokeWidth={4} strokeDasharray="10 10" opacity={s2} />
      </svg>
      <Pill text="ChatGPT Work" x={540} y={700} s={s1} mode="light" size={60} />
      <Pill text="Claude Cowork" x={540} y={1060} s={s2} mode="light" accent size={60} />
      <Sfx name="lib/pop" at={a1} volume={0.5} />
      <Sfx name="lib/pop" at={a2} volume={0.5} />
    </AbsoluteFill>
  );
};

const Done: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const aOut = trig(scene, 'anymore', fps);
  const ats = [trig(scene, 'getting', fps), trig(scene, 'things', fps), trig(scene, 'done', fps)];
  const bubble = useSp(frame, fps, 2, 14);
  const fade = useSp(frame, fps, aOut, 12);
  const list = useSp(frame, fps, aOut + 2, 16, theme.spring.soft);
  return (
    <AbsoluteFill>
      <Headline lines={['Less talk.', 'More action.']} mode="light" frame={frame + 10} fps={fps} size={104} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g opacity={bubble * (1 - fade * 0.7)} transform={`translate(${interpolate(fade, [0, 1], [400, 270])} 880) scale(${interpolate(fade, [0, 1], [1, 0.7])})`}>
          <path d="M -120 -90 h 240 a 30 30 0 0 1 30 30 v 110 a 30 30 0 0 1 -30 30 h -150 l -50 40 v -40 h -40 a 30 30 0 0 1 -30 -30 v -110 a 30 30 0 0 1 30 -30 z" fill={b.paper} stroke={p.text} strokeWidth={6} strokeLinejoin="round" />
          <text x={0} y={34} textAnchor="middle" fontFamily={b.font} fontSize={110} fontWeight={800} fill={p.text3}>?</text>
        </g>
        <path d={`M 430 880 L ${430 + 120 * list} 880`} stroke={b.accent} strokeWidth={8} strokeLinecap="round" opacity={list} />
        <g opacity={list} transform={`translate(${interpolate(list, [0, 1], [640, 590])} 700)`}>
          <rect x={0} y={0} width={340} height={380} rx={24} fill={b.paper} stroke={p.lineStrong} strokeWidth={3} />
          {ats.map((a, i) => {
            const k = useSp(frame, fps, a - 1, 12);
            return (
              <g key={i}>
                <circle cx={60} cy={80 + i * 110} r={26} fill="none" stroke={p.text3} strokeWidth={4} />
                <Check x={60} y={80 + i * 110} r={28} s={k} />
                <rect x={110} y={72 + i * 110} width={180 - i * 30} height={16} rx={8} fill={k > 0.5 ? p.text : p.text3} />
              </g>
            );
          })}
        </g>
      </svg>
      <Sfx name="lib/woosh" at={aOut} volume={0.35} />
      {ats.map((a, i) => <Sfx key={i} name="tick" at={a} volume={0.45} />)}
    </AbsoluteFill>
  );
};

const Follow: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const host = hostClip('follow');
  const at = trig(scene, 'for', fps);
  const s = useSp(frame, fps, at - 1, 16, theme.spring.soft);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: host ? 360 : 620, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`}}>
        <Img src={staticFile(b.logo)} style={{width: host ? 150 : 200, height: host ? 150 : 200}} />
        <div style={{...theme.display, fontSize: host ? 96 : 120, color: p.text, fontFamily: b.font}}>{b.name}</div>
      </div>
      {host ? <HostSplit src={host} mode="light" split={SPLIT_Y} focusY={HOST.focusY ?? 0.18} durationInFrames={scene.durationInFrames} enterLead={6} /> : null}
      <Sfx name="lib/glassy-snap" at={at} volume={0.5} />
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
        <div style={{...theme.label, fontSize: 26, color: b.ink3}}>{b.site}</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{s: TimedShortScene; fps: number}> = ({s, fps}) => {
  switch (s.kind as string) {
    case 'hook': return <Hook scene={s} fps={fps} />;
    case 'now': return <Now scene={s} fps={fps} />;
    case 'browse': return <Browse scene={s} fps={fps} />;
    case 'inbox': return <Inbox scene={s} fps={fps} />;
    case 'research': return <Research scene={s} fps={fps} />;
    case 'deck': return <Deck scene={s} fps={fps} />;
    case 'turn': return <Best scene={s} fps={fps} />;
    case 'schedule': return <Schedule scene={s} fps={fps} />;
    case 'wake': return <Wake scene={s} fps={fps} />;
    case 'tools': return <Tools scene={s} fps={fps} />;
    case 'done': return <Done scene={s} fps={fps} />;
    case 'close': return <Follow scene={s} fps={fps} />;
    default: return null;
  }
};

const BASS_SCENES = new Set(['now', 'best', 'wake']);

export const AiOvernight: React.FC = () => {
  const {fps} = useVideoConfig();
  const b = useBrand();
  const {scenes, outroFrom, totalFrames} = TL.build();
  const browse = scenes.find((s) => s.id === 'browse')!;
  const best = scenes.find((s) => s.id === 'best')!;
  return (
    <AbsoluteFill style={{background: b.soot, fontFamily: b.font}}>
      <MusicBed src={scriptJson.music} scenes={scenes} totalFrames={totalFrames} base={0.24} levels={[{from: browse.from, base: 0.3}, {from: best.from, base: 0.38}]} fadeInFrames={fps} />
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
            <Captions words={s.words} mode={s.mode as Mode} bottom={captionsBottomFor(s.id)} fontSize={64} combineMs={700} maxWidth={880} />
          </Sequence>
        ))}
      </Track>
      {scenes.slice(1).map((s) => (
        <Cut key={`cut-${s.id}`} at={s.from} strength={BASS_SCENES.has(s.id) ? 0.55 : 0.22} bass={BASS_SCENES.has(s.id)} whoosh />
      ))}
      <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.5} />
      <Sfx name="lib/fire-whoosh" at={best.from} lead={0} volume={0.45} />
      <Sequence name="outro" from={outroFrom} durationInFrames={TL.OUTRO_FRAMES}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
