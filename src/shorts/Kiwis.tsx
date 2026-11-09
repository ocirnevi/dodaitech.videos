import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Beats} from '../components/Beats';
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
 * "Two kiwis a day" — guion de Enrico (8 nov). Fábrica: la misma puesta en escena sirve a Hello Nutrition AI (inglés)
 * y a Mi Nutriólogo (español); cambian la marca (contexto), el guion/voz y los textos en pantalla (`copy`).
 * Protagonista visual: la rodaja de kiwi (2D plana). Sin host.
 * Estructura en 3 bloques (feedback ai-agents): gancho + dato (claro) → por qué (oscuro, la rodaja se explica) → qué hacer (claro, cierre con marca).
 */

/** Textos en pantalla y palabras gatillo (las gatillo deben estar en la narración de la escena). */
export type KiwisCopy = {
  hook: {lines: string[]; two: string; poop: string; accentLine?: number};
  yep: {two: string};
  research: {rows: [string, string][]; cite: string};
  why: {lines: string[]};
  contain: {items: [string, string][]; breakWord: string; note: string};
  together: {lines: string[]; together: string; digestion: string};
  best: {line: string};
  noneed: {lines: string[]; rows: [string, string][]};
  try: {lines: string[]; two: string; daily: string; pill: string};
  small: {first: string; big: string; bigWord: string};
  follow: {nameLines: string[]; sub: string; subWord: string; tipsWord: string};
};

type ScriptJson = Parameters<typeof makeShortTimeline>[0];
export type KiwisConfig = {
  script: ScriptJson;
  narration: Parameters<typeof makeShortTimeline>[1];
  words: Record<string, Word[]>;
  beats: Parameters<typeof makeShortTimeline>[3];
  brand: Brand;
  copy: KiwisCopy;
};

const CopyCtx = React.createContext<KiwisCopy | null>(null);
const useCopy = () => {
  const c = React.useContext(CopyCtx);
  if (!c) throw new Error('KiwisCopy no provisto');
  return c;
};

const LAYOUT = {headlineTop: 300, captionsBottom: 620};
const W = 1080;
const SN = theme.spring.snappy;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);

/* ---------- Rodaja de kiwi (2D plana): piel, pulpa verde, corazón pálido, anillo de semillas ---------- */
const KiwiSlice: React.FC<{x: number; y: number; r: number; o?: number; rot?: number; dark?: boolean}> = ({x, y, r, o = 1, rot = 0, dark = false}) => {
  const b = useBrand();
  const seeds = Array.from({length: 18}, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const rr = r * 0.5;
    return <ellipse key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} rx={r * 0.045} ry={r * 0.09} transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * rr} ${Math.sin(a) * rr})`} fill={b.ink} />;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <circle r={r} fill="#8A6A44" />
      <circle r={r * 0.93} fill={b.accent} />
      <circle r={r * 0.58} fill={b.accentLight} opacity={0.55} />
      <circle r={r * 0.3} fill={dark ? '#EAF7EE' : '#F2FBF4'} />
      {seeds}
    </g>
  );
};

/* ---------- Escenas ---------- */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().hook;
  const atTwo = trig(scene, c.two, fps);
  const atPoop = trig(scene, c.poop, fps);
  const k1 = useSp(frame, fps, Math.min(atTwo, 10), 18, theme.spring.soft);
  const k2 = useSp(frame, fps, Math.min(atTwo, 10) + 5, 18, theme.spring.soft);
  const wob = Math.sin(frame * 0.12) * 3;
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 14} fps={fps} size={100} accentLine={c.accentLine ?? 1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(0 ${interpolate(k1, [0, 1], [120, 0])})`}>
          <KiwiSlice x={360} y={860} r={190} o={k1} rot={-12 + wob} />
        </g>
        <g transform={`translate(0 ${interpolate(k2, [0, 1], [140, 0])})`}>
          <KiwiSlice x={700} y={920} r={190} o={k2} rot={14 - wob} />
        </g>
      </svg>
      <Sfx name="lib/pop" at={Math.min(atTwo, 10)} volume={0.5} />
      <Sfx name="lib/pop" at={Math.min(atTwo, 10) + 5} volume={0.45} />
      <Sfx name="lib/coin" at={atPoop} volume={0.4} />
    </AbsoluteFill>
  );
};

const Yep: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const atTwo = trig(scene, useCopy().yep.two, fps);
  const bump = useSp(frame, fps, atTwo, 12);
  return (
    <AbsoluteFill>
      <Beats scene={scene} layout={{left: 96, top: 320, width: 880, numberSize: 300, labelSize: 44}} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <KiwiSlice x={380} y={1000} r={150 + 20 * bump} rot={-8} />
        <KiwiSlice x={700} y={1000} r={150 + 20 * bump} rot={10} />
      </svg>
    </AbsoluteFill>
  );
};

const Research: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const c = useCopy().research;
  const atConst = trig(scene, c.rows[0][1], fps);
  const atDisc = trig(scene, c.rows[1][1], fps);
  const rows: [string, number][] = [[c.rows[0][0], atConst], [c.rows[1][0], atDisc]];
  const cite = useSp(frame, fps, atDisc + 6, 14);
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title={scene.title} mode="light" top={LAYOUT.headlineTop} titleSize={92} width={880} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 640, display: 'flex', flexDirection: 'column', gap: 22}}>
        {rows.map(([t, at]) => {
          const s = useSp(frame, fps, at - 1, 14);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '26px 32px', borderRadius: 24, background: b.paper, border: `2px solid ${p.lineStrong}`, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`}}>
              <svg width={56} height={56} viewBox="-28 -28 56 56"><circle r={26} fill={b.accent} /><path d="M -11 1 L -3 9 L 12 -8" fill="none" stroke={b.paper} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div style={{...theme.display, fontSize: 60, color: p.text}}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 96, right: 96, top: 1010, ...theme.label, fontSize: 26, color: p.text3, opacity: cite}}>
        {c.cite}
      </div>
      <Sfx name="lib/pop" at={atConst} volume={0.5} />
      <Sfx name="lib/pop" at={atDisc} volume={0.5} />
    </AbsoluteFill>
  );
};

const Why: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const s = useSp(frame, fps, 2, 18, theme.spring.soft);
  void scene;
  return (
    <AbsoluteFill>
      <Headline lines={useCopy().why.lines} mode="dark" frame={frame + 10} fps={fps} size={132} accentLine={-1} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(540 940) scale(${interpolate(s, [0, 1], [0.6, 1])}) translate(-540 -940)`}>
          <KiwiSlice x={540} y={940} r={230} o={s} rot={interpolate(s, [0, 1], [-40, 0])} dark />
        </g>
      </svg>
      <Sfx name="lib/glassy-snap" at={4} volume={0.5} />
    </AbsoluteFill>
  );
};

/** La rodaja se explica: tres etiquetas salen de ella en su palabra. */
const Contain: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('dark');
  const c = useCopy().contain;
  const pos: [number, number, boolean][] = [[230, 700, false], [850, 700, false], [540, 560, true]];
  const items: [string, string, number, number, boolean][] = c.items.map(([w, label], i) => [w, label, pos[i][0], pos[i][1], pos[i][2]]);
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title="" mode="dark" top={260} titleSize={1} width={880} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {items.map(([w, , x, y]) => {
          const at = trig(scene, w, fps);
          const k = useSp(frame, fps, at - 1, 14);
          return <line key={w} x1={540} y1={960} x2={540 + (x - 540) * k} y2={960 + (y - 960) * k} stroke={b.accent} strokeWidth={4} strokeDasharray="10 12" opacity={0.7 * k} />;
        })}
        <KiwiSlice x={540} y={960} r={230} dark />
      </svg>
      {items.map(([w, label, x, y, accent]) => <Pill key={w} text={label} x={x} y={y} s={useSp(frame, fps, trig(scene, w, fps) - 1, 14)} mode="dark" accent={accent} size={accent ? 60 : 52} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1370, textAlign: 'center', ...theme.label, fontSize: 28, color: p.text3, opacity: useSp(frame, fps, trig(scene, c.breakWord, fps), 12)}}>
        {c.note}
      </div>
      {items.map(([w]) => <Sfx key={w} name="lib/pop" at={trig(scene, w, fps)} volume={0.5} />)}
    </AbsoluteFill>
  );
};

const Together: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const c = useCopy();
  const atTogether = trig(scene, c.together.together, fps);
  const atDigestion = trig(scene, c.together.digestion, fps);
  const merge = useSp(frame, fps, atTogether, 22, theme.spring.soft);
  const pulse = useSp(frame, fps, atDigestion - 1, 14);
  const starts: [number, number][] = [[230, 700], [850, 700], [540, 560]];
  return (
    <AbsoluteFill>
      <Headline lines={c.together.lines} mode="dark" frame={frame + 10} fps={fps} size={96} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={960} r={230 + 60 * pulse} fill={b.accent} opacity={0.18 * pulse} />
        <KiwiSlice x={540} y={960} r={230} dark />
      </svg>
      {starts.map(([x, y], i) => {
        const cx = 540 + (x - 540) * (1 - merge);
        const cy = 960 + (y - 960) * (1 - merge);
        return <Pill key={i} text={c.contain.items[i][1]} x={cx} y={cy} s={1 - merge * 0.9} mode="dark" size={52} />;
      })}
      <Sfx name="lib/woosh" at={atTogether} volume={0.4} />
      <Sfx name="lib/coin" at={atDigestion} volume={0.5} />
    </AbsoluteFill>
  );
};

const Best: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const s = useSp(frame, fps, 2, 16);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 640, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`, transformOrigin: 'left center'}}>
        <div style={{...theme.label, fontSize: 28, color: b.accent}}>{scene.label}</div>
        <div style={{...theme.display, fontSize: 150, color: p.text, marginTop: 12}}>{useCopy().best.line}</div>
      </div>
    </AbsoluteFill>
  );
};

const NoNeed: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const c = useCopy().noneed;
  const atSupp = trig(scene, c.rows[0][1], fps);
  const atRout = trig(scene, c.rows[1][1], fps);
  const rows: [string, number, number][] = [[c.rows[0][0], atSupp, 760], [c.rows[1][0], atRout, 960]];
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={104} />
      {rows.map(([t, at, y]) => {
        const s = useSp(frame, fps, at - 1, 14);
        const strike = clamp01((frame - at - 5) / 7);
        return (
          <div key={t} style={{position: 'absolute', left: 0, width: W, top: y, height: 0}}>
            <Pill text={t} x={540} y={0} s={s} mode="light" size={54} />
            <div style={{position: 'absolute', left: 540, top: 0, width: 560 * strike, height: 8, background: b.accent, borderRadius: 4, transform: 'translate(-50%, -50%) rotate(-6deg)', opacity: s}} />
          </div>
        );
      })}
      <Sfx name="lib/snap" at={atSupp + 5} volume={0.45} />
      <Sfx name="lib/snap" at={atRout + 5} volume={0.45} />
    </AbsoluteFill>
  );
};

const Try: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const c = useCopy().try;
  const atTwo = trig(scene, c.two, fps);
  const atDaily = trig(scene, c.daily, fps);
  const k1 = useSp(frame, fps, atTwo - 1, 16, theme.spring.soft);
  const k2 = useSp(frame, fps, atTwo + 4, 16, theme.spring.soft);
  return (
    <AbsoluteFill>
      <Headline lines={c.lines} mode="light" frame={frame + 12} fps={fps} size={108} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(0 ${interpolate(k1, [0, 1], [100, 0])})`}><KiwiSlice x={370} y={900} r={180} o={k1} rot={-10} /></g>
        <g transform={`translate(0 ${interpolate(k2, [0, 1], [100, 0])})`}><KiwiSlice x={710} y={940} r={180} o={k2} rot={12} /></g>
      </svg>
      <Pill text={c.pill} x={540} y={590} s={useSp(frame, fps, atDaily - 1, 14)} mode="light" accent size={48} />
      <Sfx name="lib/pop" at={atTwo} volume={0.5} />
      <Sfx name="lib/pop" at={atTwo + 4} volume={0.45} />
      <Sfx name="lib/coin" at={atDaily} volume={0.45} />
    </AbsoluteFill>
  );
};

const Small: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const c = useCopy().small;
  const atBig = trig(scene, c.bigWord, fps);
  const s = useSp(frame, fps, 2, 16);
  const big = useSp(frame, fps, atBig - 1, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 620, opacity: s}}>
        <div style={{...theme.display, fontSize: 112, color: p.text}}>{c.first}</div>
        <div style={{...theme.display, fontSize: 112 + 40 * big, color: b.accent, marginTop: 14, opacity: big, transform: `translateY(${interpolate(big, [0, 1], [30, 0])}px)`}}>{c.big}</div>
      </div>
      <Sfx name="lib/coin" at={atBig} volume={0.5} />
    </AbsoluteFill>
  );
};

const Follow: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const s = useSp(frame, fps, 2, 18, theme.spring.soft);
  const c = useCopy().follow;
  const atTips = trig(scene, c.tipsWord, fps);
  const sub = useSp(frame, fps, trig(scene, c.subWord, fps) - 1, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`}}>
        <Img src={staticFile(b.logo)} style={{width: 220, height: 250}} />
        <div style={{...theme.display, fontSize: 96, color: p.text, textAlign: 'center', lineHeight: 1}}>{c.nameLines.map((l, i) => <React.Fragment key={l}>{i > 0 && <br />}{l}</React.Fragment>)}</div>
        <div style={{...theme.label, fontSize: 30, color: b.accent, opacity: sub}}>{c.sub}</div>
      </div>
      <Sfx name="lib/glassy-snap" at={2} volume={0.5} />
      <Sfx name="lib/twinkle" at={atTips} volume={0.4} />
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
    case 'yep': return <Yep scene={s} fps={fps} />;
    case 'research': return <Research scene={s} fps={fps} />;
    case 'why': return <Why scene={s} fps={fps} />;
    case 'contain': return <Contain scene={s} fps={fps} />;
    case 'together': return <Together scene={s} fps={fps} />;
    case 'turn': return <Best scene={s} fps={fps} />;
    case 'noneed': return <NoNeed scene={s} fps={fps} />;
    case 'try': return <Try scene={s} fps={fps} />;
    case 'big': return <Small scene={s} fps={fps} />;
    case 'close': return <Follow scene={s} fps={fps} />;
    default: return null;
  }
};

const BASS_SCENES = new Set(['why', 'best', 'follow']);
const CONTINUES = new Set(['together']); // sigue el plano de "contain" sin corte

const Inner: React.FC<{build: ReturnType<typeof makeShortTimeline>['build']; music: string; outroFrames: number}> = ({build, music, outroFrames}) => {
  const {fps} = useVideoConfig();
  const b = useBrand();
  const {scenes, outroFrom, totalFrames} = build();
  const why = scenes.find((s) => s.id === 'why')!;
  const best = scenes.find((s) => s.id === 'best')!;
  return (
    <AbsoluteFill style={{background: b.soot, fontFamily: b.font}}>
      <MusicBed src={music} scenes={scenes} totalFrames={totalFrames} base={0.24} levels={[{from: why.from, base: 0.3}, {from: best.from, base: 0.36}]} fadeInFrames={fps} />
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

/** Construye la composición de kiwis para un canal: devuelve el componente, la timeline y el formato. */
export const makeKiwis = (cfg: KiwisConfig) => {
  const TL = makeShortTimeline(cfg.script, cfg.narration, cfg.words, cfg.beats, {gap: 3, outroFrames: 45, snapTolerance: 4});
  const Comp: React.FC = () => (
    <BrandProvider value={cfg.brand}>
      <CopyCtx.Provider value={cfg.copy}>
        <Inner build={TL.build} music={cfg.script.music} outroFrames={TL.OUTRO_FRAMES} />
      </CopyCtx.Provider>
    </BrandProvider>
  );
  return {Comp, timeline: TL.build, meta: {fps: cfg.script.fps, width: cfg.script.width, height: cfg.script.height}};
};
