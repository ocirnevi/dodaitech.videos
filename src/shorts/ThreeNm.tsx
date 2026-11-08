import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import scriptJson from '../../script/three-nm.json';
import narration from '../data/three-nm/narration.json';
import wordsJson from '../data/three-nm/words.json';
import beatsJson from '../data/three-nm/beats.json';
import {Background} from '../components/Background';
import {ByScene} from '../components/ByScene';
import {MusicBed} from '../components/MusicBed';
import {Captions} from '../components/Captions';
import {Chapter} from '../components/Chapter';
import {Cut} from '../components/Cut';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';
import {triggerFrameIn, type Word} from '../script';
import {brand, palette, theme} from '../theme';
import type {TimedShortScene} from './script';
import {makeShortTimeline} from './timeline';

/**
 * Short de prueba (≈10 s): "Nothing in a 3 nm chip is 3 nm".
 * Un solo protagonista visual: la etiqueta "3 nm". En el hook es enorme (la marca); en el giro se vuelve una muesca
 * diminuta al lado de las medidas reales (23 nm, 45 nm); en el cierre vuelve a ser la etiqueta, ahora con ™ (loop al frame 1).
 */
const TL = makeShortTimeline(scriptJson, narration, wordsJson as Record<string, Word[]>, beatsJson, {gap: 6, outroFrames: 42});
export const threeNmTimeline = TL.build;
export const THREE_NM = {fps: scriptJson.fps, width: scriptJson.width, height: scriptJson.height};

// Zona segura: texto crítico entre y 290–1250. Titular arriba, protagonista al centro, subtítulos centrados ≈ y 1150.
const LAYOUT = {headlineTop: 300, heroTop: 640, captionsBottom: 620};

/* ---------- Protagonista: la etiqueta "3 nm" ---------- */
const NodePill: React.FC<{frame: number; fps: number; mode: 'light' | 'dark'; tm?: number; sub?: string; subOpacity?: number}> = ({frame, fps, mode, tm = 0, sub, subOpacity = 1}) => {
  const p = palette(mode);
  const s = spring({frame, fps, config: theme.spring.settle, durationInFrames: 26});
  const scale = interpolate(s, [0, 1], [0.72, 1]);
  const rot = interpolate(s, [0, 1], [-6, 0]);
  const y = interpolate(s, [0, 1], [60, 0]);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: LAYOUT.heroTop, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
      <div style={{position: 'relative', opacity: s, transform: `translateY(${y}px) rotate(${rot}deg) scale(${scale})`, transformOrigin: '50% 60%'}}>
        <div
          style={{
            ...theme.display,
            fontSize: 250,
            fontWeight: 700,
            color: p.text,
            padding: '26px 84px 44px',
            borderRadius: 56,
            background: p.surface,
            border: `3px solid ${p.lineStrong}`,
            boxShadow: mode === 'light' ? '0 30px 80px rgba(27,25,23,0.14)' : '0 30px 80px rgba(0,0,0,0.5)',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          3<span style={{color: brand.accent, marginLeft: 22}}>nm</span>
        </div>
        {tm > 0 ? (
          <div style={{position: 'absolute', right: -34, top: -30, width: 112, height: 112, borderRadius: 999, background: brand.accent, color: brand.onSoot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, fontWeight: 800, opacity: tm, transform: `scale(${interpolate(tm, [0, 1], [0.4, 1])}) rotate(${interpolate(tm, [0, 1], [-30, 12])}deg)`, boxShadow: '0 16px 40px rgba(251,86,24,0.4)'}}>
            ™
          </div>
        ) : null}
      </div>
      {sub ? <div style={{...theme.label, fontSize: 30, color: p.text3, opacity: s * subOpacity, transform: `translateY(${interpolate(s, [0, 1], [10, 0])}px)`}}>{sub}</div> : null}
    </div>
  );
};

/* ---------- Hook: texto del frame 1 + la etiqueta ---------- */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const lines: [string, boolean][] = [['Nothing here is', false], ['3 nanometers.', true]];
  void scene;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: LAYOUT.headlineTop}}>
        {lines.map(([l, accent], i) => {
          const s = spring({frame: frame + 16 - i * 3, fps, config: theme.spring.soft, durationInFrames: 22});
          return (
            <div key={l} style={{overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em'}}>
              <div style={{...theme.display, fontSize: 112, color: accent ? brand.accent : p.text, transform: `translateY(${interpolate(s, [0, 1], [105, 0])}%)`, opacity: interpolate(s, [0, 1], [0.1, 1])}}>{l}</div>
            </div>
          );
        })}
      </div>
      <NodePill frame={frame - 4} fps={fps} mode="light" sub="the label on your phone's chip" />
      <Sfx name="lib/glassy-snap" at={12} volume={0.55} />
    </AbsoluteFill>
  );
};

/* ---------- Giro: las medidas reales dibujadas a escala; "3 nm" es una muesca ---------- */
const PX_PER_NM = 13; // 23 nm → 299 px, 45 nm → 585 px, 3 nm → 39 px
const X = 140;
/** Fila de cota: número (baseline `y`), línea de cota 28 px debajo, etiqueta 70 px debajo. */
const Dim: React.FC<{y: number; nm: number; label: string; progress: number; count: number; mode: 'light' | 'dark'}> = ({y, nm, label, progress, count, mode}) => {
  const p = palette(mode);
  const w = nm * PX_PER_NM;
  const shown = w * progress;
  const ly = y + 28;
  const o = Math.min(1, progress * 2);
  return (
    <g opacity={progress > 0 ? 1 : 0}>
      <text x={X} y={y} fill={p.text} fontFamily={theme.font} fontWeight={700} fontSize={88} letterSpacing="-0.03em" opacity={o}>
        {Math.round(count)}
        <tspan fill={brand.accent} fontSize={52} fontWeight={600} dx={10}>nm</tspan>
      </text>
      <line x1={X} y1={ly} x2={X + shown} y2={ly} stroke={brand.accent} strokeWidth={5} strokeLinecap="round" />
      <line x1={X} y1={ly - 16} x2={X} y2={ly + 16} stroke={brand.accent} strokeWidth={5} strokeLinecap="round" />
      <line x1={X + shown} y1={ly - 16} x2={X + shown} y2={ly + 16} stroke={brand.accent} strokeWidth={5} strokeLinecap="round" opacity={progress} />
      <text x={X} y={ly + 46} fill={p.text2} fontFamily={theme.font} fontWeight={500} fontSize={28} letterSpacing="0.04em" opacity={o}>
        {label}
      </text>
    </g>
  );
};

const Reveal: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const at23 = triggerFrameIn(scene.words, '23', fps, scene.id);
  const at45 = triggerFrameIn(scene.words, '45', fps, scene.id);
  const grow = (from: number) => spring({frame: frame - from, fps, config: theme.spring.snappy, durationInFrames: 18});
  const counter = (from: number, v: number) => interpolate(spring({frame: frame - from, fps, config: theme.spring.counter}), [0, 1], [0, v]);
  const tick = spring({frame: frame - 6, fps, config: theme.spring.snappy, durationInFrames: 14});
  const g23 = grow(at23 - 1);
  const g45 = grow(at45 - 1);
  // barras (cables / compuertas) que suben desde su base, una tras otra
  const bars = (pitchNm: number, count: number, top: number, h: number, w: number, from: number) =>
    Array.from({length: count}, (_, i) => {
      const bs = spring({frame: frame - from - i * 3, fps, config: theme.spring.snappy, durationInFrames: 14});
      return <rect key={i} x={X + i * pitchNm * PX_PER_NM - w / 2} y={top + h * (1 - bs)} width={w} height={h * bs} rx={Math.min(16, w / 3)} fill={i < 2 ? p.text : p.text3} />;
    });
  const tickW = 3 * PX_PER_NM;
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title="So what is 3 nm?" mode="dark" top={LAYOUT.headlineTop} titleSize={92} width={860} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}} viewBox="0 0 1080 1920">
        {/* la muesca de 3 nm, a la misma escala (y 530–600) */}
        <g opacity={tick} transform={`translate(0 ${interpolate(tick, [0, 1], [18, 0])})`}>
          <line x1={X} y1={540} x2={X + tickW * tick} y2={540} stroke={brand.accent} strokeWidth={4} strokeLinecap="round" />
          <line x1={X} y1={526} x2={X} y2={554} stroke={brand.accent} strokeWidth={4} strokeLinecap="round" />
          <line x1={X + tickW} y1={526} x2={X + tickW} y2={554} stroke={brand.accent} strokeWidth={4} strokeLinecap="round" />
          <text x={X + tickW + 22} y={556} fill={p.text} fontFamily={theme.font} fontWeight={700} fontSize={44} letterSpacing="-0.03em">
            3<tspan fill={brand.accent} fontSize={28} fontWeight={600} dx={6}>nm</tspan>
          </text>
          <text x={X + tickW + 130} y={556} fill={p.text2} fontFamily={theme.font} fontWeight={500} fontSize={28} letterSpacing="0.04em">
            at this scale
          </text>
        </g>
        {/* 23 nm: separación entre los cables más finos (y 650–912) */}
        <Dim y={720} nm={23} label="distance between the thinnest wires" progress={g23} count={counter(at23 - 1, 23)} mode="dark" />
        {bars(23, 3, 812, 100, 46, at23 - 1)}
        {/* 45 nm: separación entre compuertas (y 940–1202) */}
        <Dim y={1010} nm={45} label="distance between gates" progress={g45} count={counter(at45 - 1, 45)} mode="dark" />
        {bars(45, 2, 1102, 100, 92, at45 - 1)}
      </svg>
      <Sfx name="lib/snap" at={6} volume={0.45} />
      <Sfx name="lib/pop" at={at23} volume={0.55} />
      <Sfx name="lib/pop" at={at45} volume={0.55} />
    </AbsoluteFill>
  );
};

/* ---------- Cierre: la etiqueta vuelve, ahora con ™ (loop al frame 1) ---------- */
const Close: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const atName = triggerFrameIn(scene.words, 'name', fps, scene.id);
  const atSize = triggerFrameIn(scene.words, 'size', fps, scene.id);
  const tm = spring({frame: frame - atName + 1, fps, config: theme.spring.snappy, durationInFrames: 14});
  const l1 = spring({frame: frame - atName, fps, config: theme.spring.snappy, durationInFrames: 14});
  const l2 = spring({frame: frame - atSize, fps, config: theme.spring.snappy, durationInFrames: 14});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: LAYOUT.headlineTop, display: 'flex', gap: 28, alignItems: 'baseline', flexWrap: 'wrap'}}>
        <div style={{...theme.display, fontSize: 112, color: p.text, opacity: l1, transform: `translateY(${interpolate(l1, [0, 1], [30, 0])}px)`}}>A name.</div>
        <div style={{...theme.display, fontSize: 112, color: brand.accent, opacity: l2, transform: `translateY(${interpolate(l2, [0, 1], [30, 0])}px)`}}>Not a size.</div>
      </div>
      <NodePill frame={frame + 6} fps={fps} mode="light" tm={tm} sub="marketing node name since ~1997" subOpacity={l2} />
      <Sfx name="lib/coin" at={atName} volume={0.5} />
      <Sfx name="lib/snap" at={atSize} volume={0.4} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: theme.spring.soft, durationInFrames: 18});
  return (
    <AbsoluteFill style={{background: brand.canvas, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'}), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Wordmark mode="light" opacity={1} size={64} />
        <div style={{...theme.label, fontSize: 26, color: brand.ink3}}>dodaitech.com</div>
      </div>
      <Sfx name="lib/twinkle" at={2} lead={0} volume={0.45} />
    </AbsoluteFill>
  );
};

export const ThreeNm: React.FC = () => {
  const {fps} = useVideoConfig();
  const {scenes, outroFrom, totalFrames} = TL.build();
  const reveal = scenes.find((s) => s.id === 'reveal')!;
  const close = scenes.find((s) => s.id === 'close')!;
  const punchBeats = [
    reveal.from, close.from,
    reveal.from + triggerFrameIn(reveal.words, '23', fps, reveal.id),
    reveal.from + triggerFrameIn(reveal.words, '45', fps, reveal.id),
    close.from + triggerFrameIn(close.words, 'name', fps, close.id),
  ];
  return (
    <AbsoluteFill style={{background: brand.soot, fontFamily: theme.font}}>
      <MusicBed src={scriptJson.music} scenes={scenes} totalFrames={totalFrames} base={0.3} fadeInFrames={fps} fadeOutFrames={22} />
      <ByScene scenes={scenes} until={outroFrom}>{(s) => <Background mode={s.mode} />}</ByScene>
      <PunchIn beats={punchBeats} amount={0.03} origin="50% 55%">
        <Track name="scenes">
          {scenes.map((s) => (
            <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.durationInFrames}>
              <Audio name={`voice:${s.id}`} src={staticFile(s.audioSrc)} />
              {s.kind === 'hook' ? <Hook scene={s} fps={fps} /> : null}
              {s.kind === 'layer' ? <Reveal scene={s} fps={fps} /> : null}
              {s.kind === 'close' ? <Close scene={s} fps={fps} /> : null}
            </Sequence>
          ))}
        </Track>
      </PunchIn>
      <ByScene scenes={scenes} until={outroFrom}>{(s) => <Post mode={s.mode} />}</ByScene>
      <Track name="captions">
        {scenes.map((s) => (
          <Sequence key={`cap-${s.id}`} name={`captions:${s.id}`} from={s.from} durationInFrames={s.durationInFrames} layout="none">
            <Captions words={s.words} mode={s.mode} bottom={LAYOUT.captionsBottom} fontSize={64} combineMs={700} maxWidth={880} />
          </Sequence>
        ))}
      </Track>
      {scenes.slice(1).map((s) => (
        <Cut key={`cut-${s.id}`} at={s.from} strength={s.kind === 'close' ? 0.7 : 0.5} />
      ))}
      <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.55} />
      <Sequence name="outro" from={outroFrom} durationInFrames={TL.OUTRO_FRAMES}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
