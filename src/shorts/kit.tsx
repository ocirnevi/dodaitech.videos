import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
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
import {BrandProvider, theme, useBrand, usePalette, type Brand, type Mode} from '../theme';
import type {TimedShortScene} from './script';
import {makeShortTimeline} from './timeline';

/**
 * Kit común de los Shorts (10 nov 2026): helpers de animación, piezas genéricas y `makeShort`, el "casco" que arma
 * fondo, música por bloques, voz, subtítulos karaoke, cortes con SFX, host mitad y mitad opcional y outro.
 * Cada video solo define sus escenas (`scenes: {kind: Componente}`) y sus textos (`copy`).
 * Reglas ya incluidas: GAP 2 frames, ajuste a beat ≤ 4, subtítulos 64 px, y `trigAfter` para que un texto fijo entre
 * DESPUÉS de que el karaoke pasó por su palabra (regla de no repetir).
 */
export const W = 1080;
export const LAYOUT = {headlineTop: 300, captionsBottom: 620};
export const SN = theme.spring.snappy;
export const SOFT = theme.spring.soft;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
export const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);
const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%]/g, '');
/** Frame en que el karaoke ya dejó atrás la palabra (fin de la palabra + lag). */
export const trigAfter = (s: TimedShortScene, word: string, fps: number, lag = 10) => {
  const w = s.words.find((x) => norm(x.word).includes(norm(word)));
  if (!w) {
    console.warn(`[kit] palabra "${word}" no encontrada en ${s.id}`);
    return 0;
  }
  return Math.round(w.end * fps) + lag;
};
export type SceneProps = {scene: TimedShortScene; fps: number};

/* ---------- Contextos: textos por idioma y host ---------- */
const CopyCtx = React.createContext<unknown>(null);
export function useCopy<T>(): T {
  return React.useContext(CopyCtx) as T;
}
const HostCtx = React.createContext(false);
/** true si esta escena lleva host mitad y mitad: la escena debe usar solo la mitad superior. */
export const useHost = () => React.useContext(HostCtx);

/* ---------- Piezas genéricas ---------- */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>{children}</svg>
);
export const SceneLabel: React.FC<{text: string; top?: number}> = ({text, top = LAYOUT.headlineTop - 50}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBrand();
  if (!text) return null;
  return <div style={{position: 'absolute', left: 96, top, ...theme.label, fontSize: 28, color: b.accent, opacity: useSp(frame, fps, 2, 12)}}>{text}</div>;
};
/** Frase grande para los giros ("Plot twist."). */
export const TurnLine: React.FC<{label?: string; lines: string[]; mode?: Mode; size?: number}> = ({label = '', lines, mode = 'light', size = 168}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBrand();
  const p = usePalette(mode);
  const s = useSp(frame, fps, 1, 14);
  return (
    <div style={{position: 'absolute', left: 96, right: 96, top: 640, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`, transformOrigin: 'left center'}}>
      {label ? <div style={{...theme.label, fontSize: 28, color: b.accent}}>{label}</div> : null}
      <div style={{...theme.display, fontSize: size, color: p.text, marginTop: 12, lineHeight: 0.95}}>
        {lines.map((l, i) => <div key={i} style={{color: i === lines.length - 1 && lines.length > 1 ? b.accent : p.text}}>{l}</div>)}
      </div>
    </div>
  );
};
export const Check: React.FC<{x: number; y: number; r?: number; s?: number; color?: string}> = ({x, y, r = 26, s = 1, color}) => {
  const b = useBrand();
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`} opacity={clamp01(s)}>
      <circle r={r} fill={color ?? b.accent} />
      <path d={`M ${-r * 0.42} ${r * 0.02} L ${-r * 0.1} ${r * 0.34} L ${r * 0.45} ${-r * 0.3}`} fill="none" stroke={b.onSoot} strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
export const Cross: React.FC<{x: number; y: number; r?: number; s?: number; color?: string}> = ({x, y, r = 26, s = 1, color}) => {
  const p = usePalette('light');
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, s)})`} opacity={clamp01(s)}>
      <circle r={r} fill={color ?? p.text3} />
      <path d={`M ${-r * 0.35} ${-r * 0.35} L ${r * 0.35} ${r * 0.35} M ${r * 0.35} ${-r * 0.35} L ${-r * 0.35} ${r * 0.35}`} stroke="#fff" strokeWidth={r * 0.2} strokeLinecap="round" />
    </g>
  );
};
/** Punto de acento con halo que pulsa (nodo, satélite, señal). */
export const Dot: React.FC<{x: number; y: number; r?: number; o?: number; pulse?: boolean; color?: string}> = ({x, y, r = 14, o = 1, pulse = false, color}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const k = pulse ? (Math.sin(frame * 0.15) + 1) / 2 : 0;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {pulse && <circle r={r * 1.8 + k * r * 0.8} fill={color ?? b.accent} opacity={0.15} />}
      <circle r={r} fill={color ?? b.accent} />
    </g>
  );
};

/** Cierre de canal: logo; el nombre entra cuando la voz ya lo dijo (`nameWord`). Respeta el host mitad y mitad. */
export const FollowBrand: React.FC<SceneProps & {nameLines: string[]; nameWord: string; sub?: string; subWord?: string}> = ({scene, fps, nameLines, nameWord, sub = '', subWord}) => {
  const frame = useCurrentFrame();
  const b = useBrand();
  const p = usePalette('light');
  const host = useHost();
  const s = useSp(frame, fps, 2, 18, SOFT);
  const name = useSp(frame, fps, trig(scene, nameWord, fps) - 1, 16, SOFT);
  const subS = subWord ? useSp(frame, fps, trig(scene, subWord, fps) - 1, 14) : 0;
  const big = !host;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: host ? 330 : 540, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <Img src={staticFile(b.logo)} style={{width: big ? 210 : 150, height: big ? 210 : 150, objectFit: 'contain', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`}} />
        <div style={{...theme.display, fontFamily: b.font, fontSize: big ? 104 : 88, color: p.text, textAlign: 'center', lineHeight: 1, opacity: name, transform: `translateY(${interpolate(name, [0, 1], [24, 0])}px)`}}>
          {nameLines.map((l, i) => <React.Fragment key={l}>{i > 0 && <br />}{l}</React.Fragment>)}
        </div>
        {sub ? <div style={{...theme.label, fontSize: 30, color: b.accent, opacity: subS}}>{sub}</div> : null}
      </div>
      <Sfx name="lib/glassy-snap" at={trig(scene, nameWord, fps)} volume={0.5} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBrand();
  const s = useSp(frame, fps, 0, 18, SOFT);
  return (
    <AbsoluteFill style={{background: b.canvas, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'}), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Wordmark mode="light" opacity={1} size={64} />
        {b.site ? <div style={{...theme.label, fontSize: 26, color: b.ink3}}>{b.site}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

type ScriptJson = Parameters<typeof makeShortTimeline>[0] & {music: string; host?: {enabled: boolean; split?: number; focusY?: number; clips: Record<string, string>}};
export type ShortConfig = {
  script: ScriptJson;
  narration: Parameters<typeof makeShortTimeline>[1];
  words: Record<string, Word[]>;
  beats: Parameters<typeof makeShortTimeline>[3];
  brand: Brand;
  copy?: unknown;
  scenes: Record<string, React.FC<SceneProps>>;
  /** escenas con corte fuerte (bajo + whoosh) */
  bass?: string[];
  /** escenas que siguen el plano anterior sin corte */
  continues?: string[];
  /** música por bloques: desde la escena `id`, volumen base */
  levels?: {id: string; base: number}[];
  /** escena donde entra el riser de fuego (el giro) */
  riserAt?: string;
};

export const makeShort = (cfg: ShortConfig) => {
  const TL = makeShortTimeline(cfg.script, cfg.narration, cfg.words, cfg.beats, {gap: 2, outroFrames: 45, snapTolerance: 4});
  const host = cfg.script.host;
  const clipFor = (id: string) => (host?.enabled ? host.clips[id] : undefined);
  const split = host?.split ?? 960;
  const bass = new Set(cfg.bass ?? []);
  const continues = new Set(cfg.continues ?? []);
  const Inner: React.FC = () => {
    const {fps} = useVideoConfig();
    const b = useBrand();
    const {scenes, outroFrom, totalFrames} = TL.build();
    const levels = (cfg.levels ?? []).map((l) => ({from: scenes.find((s) => s.id === l.id)?.from ?? 0, base: l.base}));
    const riser = cfg.riserAt ? scenes.find((s) => s.id === cfg.riserAt) : undefined;
    return (
      <AbsoluteFill style={{background: b.soot, fontFamily: b.font}}>
        <MusicBed src={cfg.script.music} scenes={scenes} totalFrames={totalFrames} base={0.24} levels={levels} fadeInFrames={fps} />
        <ByScene scenes={scenes} until={outroFrom}>{(s) => <Background mode={s.mode as Mode} />}</ByScene>
        <PunchIn beats={scenes.slice(1).filter((s) => !continues.has(s.id)).map((s) => s.from)} amount={0.025} origin="50% 55%">
          <Track name="scenes">
            {scenes.map((s) => {
              const View = cfg.scenes[s.kind as string];
              const clip = clipFor(s.id);
              return (
                <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.durationInFrames}>
                  <Audio name={`voice:${s.id}`} src={staticFile(s.audioSrc)} />
                  <HostCtx.Provider value={!!clip}>
                    {View ? <View scene={s} fps={fps} /> : null}
                    {clip ? <HostSplit src={clip} mode={s.mode as Mode} split={split} focusY={host?.focusY ?? 0.18} durationInFrames={s.durationInFrames} enterLead={8} /> : null}
                  </HostCtx.Provider>
                </Sequence>
              );
            })}
          </Track>
        </PunchIn>
        <ByScene scenes={scenes} until={outroFrom}>{(s) => <Post mode={s.mode as Mode} />}</ByScene>
        <Track name="captions">
          {scenes.map((s) => (
            <Sequence key={`cap-${s.id}`} name={`captions:${s.id}`} from={s.from} durationInFrames={s.durationInFrames} layout="none">
              <Captions words={s.words} mode={s.mode as Mode} bottom={clipFor(s.id) ? 1920 - split - 60 : LAYOUT.captionsBottom} fontSize={64} combineMs={700} maxWidth={880} />
            </Sequence>
          ))}
        </Track>
        {scenes.slice(1).filter((s) => !continues.has(s.id)).map((s) => (
          <Cut key={`cut-${s.id}`} at={s.from} strength={bass.has(s.id) ? 0.55 : 0.22} bass={bass.has(s.id)} whoosh />
        ))}
        <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.5} />
        {riser ? <Sfx name="lib/fire-whoosh" at={riser.from} lead={0} volume={0.45} /> : null}
        <Sequence name="outro" from={outroFrom} durationInFrames={TL.OUTRO_FRAMES}>
          <Outro />
        </Sequence>
      </AbsoluteFill>
    );
  };
  const Comp: React.FC = () => (
    <BrandProvider value={cfg.brand}>
      <CopyCtx.Provider value={cfg.copy ?? null}>
        <Inner />
      </CopyCtx.Provider>
    </BrandProvider>
  );
  return {Comp, timeline: TL.build, meta: {fps: cfg.script.fps, width: cfg.script.width, height: cfg.script.height}};
};
