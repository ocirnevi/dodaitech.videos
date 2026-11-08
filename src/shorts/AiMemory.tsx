import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import scriptJson from '../../script/ai-memory.json';
import narration from '../data/ai-memory/narration.json';
import wordsJson from '../data/ai-memory/words.json';
import beatsJson from '../data/ai-memory/beats.json';
import {AvatarHost} from '../components/AvatarHost';
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
import {brand, palette, theme, type Mode} from '../theme';
import type {TimedShortScene} from './script';
import {makeShortTimeline} from './timeline';

/**
 * "Would you want AI to remember your entire life?" — guion de Enrico (8 nov) sobre wearables de memoria (Omi, Plaud).
 * Protagonista visual: el colgante (un disco con micrófono y un anillo que "escucha"). Primera mitad: lo que hace por ti.
 * Giro ("the catch"): el mismo anillo abarca a los demás. Cierre: la pregunta del frame 1, invertida (loop).
 */
const TL = makeShortTimeline(scriptJson, narration, wordsJson as Record<string, Word[]>, beatsJson, {gap: 7, outroFrames: 45});
export const aiMemoryTimeline = TL.build;
export const AI_MEMORY = {fps: scriptJson.fps, width: scriptJson.width, height: scriptJson.height};

const LAYOUT = {headlineTop: 300, heroCY: 860, captionsBottom: 620};
// Host HeyGen (WebM alfa 1080×1920): escala y posición del recorte; se ajustan tras ver el clip.
const HOST = (scriptJson as {host?: {enabled: boolean; clips: {hook?: string; want?: string}}}).host ?? {enabled: false, clips: {}};
const HOST_LAYOUT = {scale: 0.48, top: 600, pillsTop: 1130};
const W = 1080;
const SN = theme.spring.snappy;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);

/* ---------- Titular de dos líneas (línea 2 en naranja) ---------- */
const Headline: React.FC<{lines: string[]; mode: Mode; frame: number; fps: number; size?: number; top?: number; accentLine?: number; delay?: number}> = ({lines, mode, frame, fps, size = 104, top = LAYOUT.headlineTop, accentLine = 1, delay = 0}) => {
  const p = palette(mode);
  return (
    <div style={{position: 'absolute', left: 96, right: 96, top}}>
      {lines.map((l, i) => {
        const s = spring({frame: frame - delay - i * 3, fps, config: theme.spring.soft, durationInFrames: 22});
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
            <div style={{...theme.display, fontSize: size, color: i === accentLine ? brand.accent : p.text, transform: `translateY(${interpolate(s, [0, 1], [105, 0])}%)`, opacity: interpolate(s, [0, 1], [0.1, 1])}}>{l}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- El colgante: disco + mic + anillos que escuchan ---------- */
const Pendant: React.FC<{cx: number; cy: number; r?: number; mode: Mode; listen?: number; frame: number; enter?: number; cord?: boolean; ringScale?: number}> = ({cx, cy, r = 92, mode, listen = 0, frame, enter = 1, cord = true, ringScale = 1}) => {
  const p = palette(mode);
  const rings = [0, 1, 2].map((i) => {
    const t = ((frame / 30 + i * 0.5) % 1.5) / 1.5;
    return {rr: r + 10 + t * r * 1.6 * ringScale, o: (1 - t) * 0.55 * listen};
  });
  return (
    <g transform={`translate(${cx} ${cy}) scale(${interpolate(enter, [0, 1], [0.6, 1])})`} opacity={enter}>
      {cord ? <path d={`M ${-r * 0.5} ${-r * 0.86} Q 0 ${-r * 3.2} ${r * 0.5} ${-r * 0.86}`} fill="none" stroke={p.text3} strokeWidth={6} strokeLinecap="round" opacity={0.6} /> : null}
      {rings.map((rg, i) => (
        <circle key={i} r={rg.rr} fill="none" stroke={brand.accent} strokeWidth={4} opacity={rg.o} />
      ))}
      <circle r={r} fill={p.surface} stroke={p.lineStrong} strokeWidth={4} />
      <circle r={r} fill="none" stroke={brand.accent} strokeWidth={6} opacity={0.35 + 0.65 * listen} />
      <circle r={r * 0.17} fill={brand.accent} />
      <circle r={r * 0.17} fill={brand.accent} opacity={0.5 * listen * (0.5 + 0.5 * Math.sin(frame * 0.5))} transform={`scale(${1.6})`} />
    </g>
  );
};

/* ---------- Pill tipográfica (marca sin logo) ---------- */
const Pill: React.FC<{text: string; x: number; y: number; s: number; mode: Mode; accent?: boolean; size?: number}> = ({text, x, y, s, mode, accent = false, size = 44}) => {
  const p = palette(mode);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.7, 1])})`, opacity: s, padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: 999, background: accent ? brand.accent : p.surface, color: accent ? brand.onSoot : p.text, border: `2px solid ${accent ? brand.accent : p.lineStrong}`, fontSize: size, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap', boxShadow: mode === 'light' ? '0 14px 36px rgba(27,25,23,0.10)' : '0 14px 36px rgba(0,0,0,0.4)'}}>
      {text}
    </div>
  );
};

/* ================= Escenas ================= */

/** Hook: burbujas de conversación que se acumulan. */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const bubbles = [
    {w: 380, side: 0, t: 'see you at 6?'}, {w: 300, side: 1, t: 'deadline is Friday'}, {w: 440, side: 0, t: 'what was that book?'}, {w: 260, side: 1, t: 'call mom'},
    {w: 400, side: 0, t: 'the idea about…'}, {w: 330, side: 1, t: 'her name was…'}, {w: 420, side: 0, t: 'invoice before noon'}, {w: 280, side: 1, t: 'one more thing'},
  ];
  void scene;
  const host = HOST.clips.hook;
  if (HOST.enabled && host) {
    return (
      <AbsoluteFill>
        <Headline lines={['What if you remembered', 'every conversation?']} mode="light" frame={frame + 14} fps={fps} size={82} />
        <AvatarHost src={host} mode="light" scale={HOST_LAYOUT.scale} top={HOST_LAYOUT.top} durationInFrames={scene.durationInFrames} enterLead={12} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Headline lines={['What if you remembered', 'every conversation?']} mode="light" frame={frame + 14} fps={fps} size={82} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 600, height: 560, overflow: 'hidden', maskImage: 'linear-gradient(180deg, transparent, black 12%, black 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent, black 12%, black 100%)'}}>
        {bubbles.map((b, i) => {
          const s = useSp(frame, fps, 2 + i * 7, 16);
          const y = 560 - 72 - i * 66 + interpolate(s, [0, 1], [70, 0]);
          return (
            <div key={i} style={{position: 'absolute', top: y, [b.side ? 'right' : 'left']: 0, width: b.w, padding: '14px 24px', borderRadius: 22, borderBottomLeftRadius: b.side ? 22 : 6, borderBottomRightRadius: b.side ? 6 : 22, background: b.side ? brand.accent : p.surface, color: b.side ? brand.onSoot : p.text, border: `1px solid ${p.line}`, fontSize: 30, fontWeight: 500, opacity: s * interpolate(i, [0, 7], [0.55, 1]), transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, transformOrigin: b.side ? 'right bottom' : 'left bottom'}}>
              {b.t}
            </div>
          );
        })}
      </div>
      {bubbles.map((_, i) => (
        <Sfx key={i} name="lib/pop" at={2 + i * 7} volume={0.18} />
      ))}
    </AbsoluteFill>
  );
};

/** "Not with your brain. With AI." */
const Brain: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const atBrain = trig(scene, 'brain', fps);
  const atAI = trig(scene, 'AI', fps);
  const strike = useSp(frame, fps, atBrain + 2, 12);
  const ai = useSp(frame, fps, atAI - 1, 14);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 560, display: 'flex', flexDirection: 'column', gap: 40}}>
        <div style={{position: 'relative', alignSelf: 'flex-start'}}>
          <div style={{...theme.display, fontSize: 150, color: p.text, opacity: 1 - strike * 0.6}}>your brain</div>
          <div style={{position: 'absolute', left: -10, top: '52%', height: 12, width: `${strike * 104}%`, background: brand.accent, borderRadius: 6}} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: ai, transform: `translateX(${interpolate(ai, [0, 1], [-40, 0])}px)`}}>
          <div style={{...theme.display, fontSize: 150, color: brand.accent}}>AI</div>
          <div style={{width: 80, height: 80, borderRadius: 999, background: brand.accent, opacity: 0.15 + 0.1 * Math.sin(frame * 0.4)}} />
        </div>
      </div>
      <Sfx name="lib/snap" at={atBrain + 2} volume={0.5} />
      <Sfx name="lib/coin" at={atAI} volume={0.5} />
    </AbsoluteFill>
  );
};

/** Meet: aparece el colgante. */
const Meet: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const enter = useSp(frame, fps, 4, 22, theme.spring.settle);
  const atWear = trig(scene, 'wearables', fps);
  const listen = clamp01((frame - atWear) / 10);
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title={scene.title} mode="dark" top={LAYOUT.headlineTop} titleSize={96} width={860} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <Pendant cx={540} cy={LAYOUT.heroCY} r={120} mode="dark" listen={listen} frame={frame} enter={enter} />
      </svg>
      <Sfx name="lib/glassy-snap" at={6} volume={0.5} />
      <Sfx name="lib/ping-down" at={atWear} volume={0.4} />
    </AbsoluteFill>
  );
};

/** Devices: silueta y el colgante salta a camisa, muñeca, cuello; pills Omi · Plaud. */
const Devices: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atOmi = trig(scene, 'Omi', fps);
  const atPlaud = trig(scene, 'Plaud', fps);
  const atShirt = trig(scene, 'shirt', fps);
  const atWrist = trig(scene, 'wrist', fps);
  const atNeck = trig(scene, 'neck', fps);
  const cx = 540, headY = 640;
  const spots = {shirt: [540, 920], wrist: [810, 1120], neck: [540, 790]} as const;
  const kShirt = useSp(frame, fps, atShirt - 1, 12);
  const kWrist = useSp(frame, fps, atWrist - 1, 12);
  const kNeck = useSp(frame, fps, atNeck - 1, 12);
  let pos: [number, number] = [540, 560];
  pos = [interpolate(kShirt, [0, 1], [pos[0], spots.shirt[0]]), interpolate(kShirt, [0, 1], [pos[1], spots.shirt[1]])];
  pos = [interpolate(kWrist, [0, 1], [pos[0], spots.wrist[0]]), interpolate(kWrist, [0, 1], [pos[1], spots.wrist[1]])];
  pos = [interpolate(kNeck, [0, 1], [pos[0], spots.neck[0]]), interpolate(kNeck, [0, 1], [pos[1], spots.neck[1]])];
  const body = useSp(frame, fps, 2, 18);
  return (
    <AbsoluteFill>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g stroke={p.text2} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={body} strokeDasharray={1400} strokeDashoffset={1400 * (1 - body)}>
          <circle cx={cx} cy={headY} r={70} />
          <path d={`M ${cx - 60} ${headY + 110} Q ${cx - 250} ${headY + 160} ${cx - 270} ${headY + 420} L ${cx - 270} ${headY + 560}`} />
          <path d={`M ${cx + 60} ${headY + 110} Q ${cx + 250} ${headY + 160} ${cx + 270} ${headY + 420} L ${cx + 270} ${headY + 560}`} />
          <path d={`M ${cx - 60} ${headY + 110} L ${cx + 60} ${headY + 110}`} />
          <circle cx={spots.wrist[0]} cy={spots.wrist[1]} r={36} opacity={kWrist} />
        </g>
        <Pendant cx={pos[0]} cy={pos[1]} r={46} mode="dark" listen={0.6} frame={frame} cord={false} ringScale={0.8} />
      </svg>
      <Pill text="Omi" x={330} y={430} s={useSp(frame, fps, atOmi - 1, 14)} mode="dark" size={56} />
      <Pill text="Plaud" x={700} y={430} s={useSp(frame, fps, atPlaud - 1, 14)} mode="dark" size={56} />
      {[['shirt', atShirt, spots.shirt], ['wrist', atWrist, spots.wrist], ['neck', atNeck, spots.neck]].map(([t, at, sp]) => {
        const k = useSp(frame, fps, (at as number) + 2, 12);
        const [x, y] = sp as readonly [number, number];
        return <div key={t as string} style={{position: 'absolute', left: x + 70, top: y - 22, ...theme.label, fontSize: 30, color: brand.accent, opacity: k, transform: `translateX(${interpolate(k, [0, 1], [-10, 0])}px)`}}>{t as string}</div>;
      })}
      <Sfx name="lib/pop" at={atOmi} volume={0.5} />
      <Sfx name="lib/pop" at={atPlaud} volume={0.5} />
      <Sfx name="lib/snap" at={atShirt} volume={0.4} />
      <Sfx name="lib/snap" at={atWrist} volume={0.4} />
      <Sfx name="lib/snap" at={atNeck} volume={0.4} />
    </AbsoluteFill>
  );
};

/** How: capítulo breve. */
const How: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  void fps;
  const p = palette('dark');
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 700}}>
        <div style={{...theme.label, fontSize: 28, color: brand.accent}}>— how it works</div>
        <div style={{...theme.display, fontSize: 132, color: p.text, marginTop: 14}}>{scene.title}</div>
        <div style={{display: 'flex', gap: 18, marginTop: 40}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 26, height: 26, borderRadius: 999, background: brand.accent, opacity: frame > 4 + i * 6 ? 1 : 0.2}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Pipeline: onda → texto → tarjetas, cada paso en su palabra. */
const Pipeline: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atRecord = trig(scene, 'record', fps);
  const atText = trig(scene, 'text', fps);
  const atOrganize = trig(scene, 'organize', fps);
  const k1 = useSp(frame, fps, atRecord - 1, 16);
  const k2 = useSp(frame, fps, atText - 1, 16);
  const k3 = useSp(frame, fps, atOrganize - 1, 16);
  const rows = [
    {y: 520, k: k1, label: 'record'},
    {y: 800, k: k2, label: 'speech → text'},
    {y: 1080, k: k3, label: 'organize'},
  ];
  const step = (i: number): React.CSSProperties => ({position: 'absolute', left: 96, right: 96, top: rows[i].y, height: 200, display: 'flex', alignItems: 'center', gap: 36, opacity: rows[i].k, transform: `translateY(${interpolate(rows[i].k, [0, 1], [30, 0])}px)`});
  const Num: React.FC<{i: number}> = ({i}) => <div style={{...theme.label, fontSize: 28, color: brand.accent, width: 200, flexShrink: 0}}>{`0${i + 1} · ${rows[i].label}`}</div>;
  const widths = [0.5, 0.86, 0.7, 0.94, 0.6];
  return (
    <AbsoluteFill>
      <div style={step(0)}>
        <Num i={0} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 140}}>
          {Array.from({length: 26}, (_, i) => {
            const h = 20 + 100 * Math.abs(Math.sin(i * 0.9 + frame * 0.25)) * k1;
            return <div key={i} style={{width: 12, height: h, borderRadius: 6, background: i % 4 === 0 ? brand.accent : p.text2}} />;
          })}
        </div>
      </div>
      <div style={step(1)}>
        <Num i={1} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, flex: 1}}>
          {widths.map((w, i) => {
            const t = clamp01((frame - atText - i * 3) / 12);
            return <div key={i} style={{height: 18, width: `${w * 100 * t}%`, borderRadius: 9, background: i === 1 ? brand.accent : p.text2, opacity: 0.9}} />;
          })}
        </div>
      </div>
      <div style={step(2)}>
        <Num i={2} />
        <div style={{display: 'flex', gap: 18, flex: 1}}>
          {['to-do', 'ideas', 'people'].map((c, i) => {
            const s = useSp(frame, fps, atOrganize + i * 4, 14);
            return (
              <div key={c} style={{flex: 1, height: 150, borderRadius: 18, background: p.surface, borderTop: `6px solid ${brand.accent}`, padding: '16px 18px', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`}}>
                <div style={{fontSize: 28, fontWeight: 700, color: p.text}}>{c}</div>
                <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
                  {[0.8, 0.55, 0.7].map((w, j) => <div key={j} style={{height: 10, width: `${w * 100}%`, borderRadius: 5, background: p.text3}} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Sfx name="lib/snap" at={atRecord} volume={0.45} />
      <Sfx name="lib/snap" at={atText} volume={0.45} />
      <Sfx name="lib/pop" at={atOrganize} volume={0.5} />
    </AbsoluteFill>
  );
};

/** Query: una pregunta que se escribe en la caja de "tu memoria". */
const Query: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const text = scene.title;
  const n = Math.floor(interpolate(frame, [4, Math.max(10, scene.audioFrames - 8)], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const enter = useSp(frame, fps, 0, 14);
  const caret = Math.floor(frame / 8) % 2 === 0;
  const isCoffee = scene.id === 'coffee';
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 720, opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`}}>
        <div style={{...theme.label, fontSize: 28, color: brand.ink3, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 16, height: 16, borderRadius: 999, background: brand.accent, display: 'inline-block'}} /> ask your memory
        </div>
        <div style={{minHeight: 190, padding: '32px 36px', borderRadius: 28, background: brand.paper, border: `2px solid ${p.lineStrong}`, boxShadow: '0 24px 60px rgba(27,25,23,0.10)', ...theme.display, fontSize: 72, color: p.text, lineHeight: 1.05}}>
          {text.slice(0, n)}
          <span style={{display: 'inline-block', width: 8, height: '0.9em', background: brand.accent, marginLeft: 6, verticalAlign: '-0.1em', opacity: caret ? 1 : 0}} />
        </div>
      </div>
      {isCoffee ? (
        <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
          <g transform="translate(860 560)" stroke={brand.accent} strokeWidth={7} fill="none" strokeLinecap="round" opacity={useSp(frame, fps, 6, 14)}>
            <path d="M -70 0 H 60 V 70 a 65 65 0 0 1 -130 0 Z" />
            <path d="M 60 15 h 30 a 28 28 0 0 1 0 56 h -30" />
            <path d={`M -40 -30 q 10 -20 0 -40`} opacity={0.5 + 0.5 * Math.sin(frame * 0.3)} />
            <path d={`M -5 -30 q 10 -20 0 -40`} opacity={0.5 + 0.5 * Math.sin(frame * 0.3 + 1)} />
          </g>
        </svg>
      ) : null}
      {Array.from({length: 6}, (_, i) => <Sfx key={i} name="lib/glassy-snap" at={6 + i * 5} volume={0.18} />)}
    </AbsoluteFill>
  );
};

/** Ask: notas interminables que pasan → una sola caja de búsqueda. */
const Ask: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const atNotes = trig(scene, 'notes', fps);
  const atAsk = trig(scene, 'ask', fps);
  const sw = clamp01((frame - atAsk + 2) / 6);
  const box = useSp(frame, fps, atAsk - 1, 14);
  const notesOpacity = 1 - sw;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 540, height: 640, overflow: 'hidden', opacity: notesOpacity, maskImage: 'linear-gradient(180deg, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(180deg, transparent, black 10%, black 90%, transparent)'}}>
        <div style={{transform: `translateY(${-(frame * interpolate(frame, [0, atNotes], [10, 30], {extrapolateRight: 'clamp'})) % 1400}px)`}}>
          {Array.from({length: 40}, (_, i) => (
            <div key={i} style={{height: 120, marginBottom: 20, borderRadius: 16, background: p.surface, border: `1px solid ${p.line}`, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{height: 14, width: `${30 + ((i * 37) % 50)}%`, borderRadius: 7, background: p.text2}} />
              <div style={{height: 10, width: `${50 + ((i * 53) % 45)}%`, borderRadius: 5, background: p.text3, opacity: 0.6}} />
              <div style={{height: 10, width: `${20 + ((i * 29) % 60)}%`, borderRadius: 5, background: p.text3, opacity: 0.6}} />
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 96, right: 96, top: 800, opacity: box, transform: `scale(${interpolate(box, [0, 1], [0.92, 1])})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '30px 36px', borderRadius: 999, background: brand.paper, border: `3px solid ${brand.accent}`, boxShadow: '0 24px 60px rgba(251,86,24,0.18)'}}>
          <svg width={64} height={64} viewBox="-50 -50 100 100">
            <circle r={40} fill={brand.canvas} stroke={brand.accent} strokeWidth={6} />
            <circle r={8} fill={brand.accent} />
          </svg>
          <div style={{...theme.display, fontSize: 60, color: p.text}}>Ask your memory…</div>
        </div>
      </div>
      <Sfx name="lib/woosh" at={atAsk} volume={0.5} />
      <Sfx name="lib/coin" at={atAsk + 2} volume={0.45} />
    </AbsoluteFill>
  );
};

/** All day: una línea de tiempo del día que se llena de conversaciones. */
const DayLine: React.FC<{fill: number; y: number; labels: string[]; mode: Mode; frame: number; dense?: boolean}> = ({fill, y, labels, mode, frame, dense = false}) => {
  const p = palette(mode);
  const x0 = 96, x1 = W - 96;
  const segs = dense ? 60 : 22;
  return (
    <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={p.lineStrong} strokeWidth={4} />
      {labels.map((l, i) => {
        const x = x0 + ((x1 - x0) * i) / (labels.length - 1);
        return (
          <g key={i}>
            <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={p.text3} strokeWidth={3} />
            <text x={x} y={y + 56} textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'} fill={p.text3} fontFamily={theme.font} fontSize={26} fontWeight={500} letterSpacing="0.04em">{l}</text>
          </g>
        );
      })}
      {Array.from({length: segs}, (_, i) => {
        const a = x0 + ((x1 - x0) * i) / segs;
        const w = ((x1 - x0) / segs) * (0.45 + 0.5 * Math.abs(Math.sin(i * 1.7)));
        const on = fill * segs > i;
        const h = 30 + 50 * Math.abs(Math.sin(i * 2.3 + frame * 0.1));
        return <rect key={i} x={a} y={y - h / 2 - 50} width={Math.max(6, w - 6)} height={h} rx={5} fill={brand.accent} opacity={on ? 0.9 : 0} />;
      })}
    </svg>
  );
};

const AllDay: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const atCapture = trig(scene, 'capture', fps);
  const atDay = trig(scene, 'day', fps);
  const fill = interpolate(frame, [atCapture, atDay + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.out});
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title={scene.title} mode="dark" top={LAYOUT.headlineTop} titleSize={96} width={860} />
      <DayLine fill={fill} y={900} labels={['7:00', '12:00', '18:00', '23:00']} mode="dark" frame={frame} />
      {Array.from({length: 8}, (_, i) => <Sfx key={i} name="lib/glassy-snap" at={atCapture + Math.round(((atDay + 6 - atCapture) * i) / 8)} volume={0.22} />)}
    </AbsoluteFill>
  );
};

/** Big: una frase enorme. */
const Big: React.FC<{scene: TimedShortScene; fps: number; mode: Mode; label?: string; size?: number}> = ({scene, fps, mode, label, size = 128}) => {
  const frame = useCurrentFrame();
  const p = palette(mode);
  const s = useSp(frame, fps, 2, 16);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 640, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`, transformOrigin: 'left center'}}>
        {label ? <div style={{...theme.label, fontSize: 28, color: brand.accent, marginBottom: 16}}>{label}</div> : null}
        <div style={{...theme.display, fontSize: size, color: p.text}}>{scene.title}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Yours: el colgante y, alrededor, los demás que no eligieron. */
const Yours: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atYours = trig(scene, 'yours', fps);
  const others = [[260, 700], [820, 700], [200, 1040], [880, 1040], [540, 1180]];
  return (
    <AbsoluteFill>
      <Headline lines={["Your conversations", "aren't just yours."]} mode="dark" frame={frame + 10} fps={fps} size={96} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {others.map(([x, y], i) => {
          const s = useSp(frame, fps, atYours + i * 3, 14);
          return (
            <g key={i} opacity={s * 0.8} transform={`translate(${x} ${y}) scale(${interpolate(s, [0, 1], [0.6, 1])})`}>
              <circle r={44} fill="none" stroke={p.text2} strokeWidth={5} />
              <circle cy={-10} r={16} fill={p.text2} />
              <path d="M -28 30 a 28 20 0 0 1 56 0" fill={p.text2} />
            </g>
          );
        })}
        <Pendant cx={540} cy={900} r={96} mode="dark" listen={1} frame={frame} ringScale={2.4} />
      </svg>
      {others.map((_, i) => <Sfx key={i} name="lib/snap" at={atYours + i * 3} volume={0.35} />)}
    </AbsoluteFill>
  );
};

/** Others: friends · coworkers · strangers caen en su palabra; el anillo los abarca. */
const Others: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const atF = trig(scene, 'friends', fps);
  const atC = trig(scene, 'coworkers', fps);
  const atS = trig(scene, 'strangers', fps);
  const kS = useSp(frame, fps, atS - 1, 16);
  return (
    <AbsoluteFill>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={880} r={interpolate(kS, [0, 1], [200, 520])} fill="none" stroke={brand.accent} strokeWidth={4} strokeDasharray="14 18" opacity={0.6} />
        <Pendant cx={540} cy={880} r={80} mode="dark" listen={1} frame={frame} ringScale={1.6} />
      </svg>
      <Pill text="friends" x={300} y={640} s={useSp(frame, fps, atF - 1, 14)} mode="dark" size={56} />
      <Pill text="coworkers" x={780} y={720} s={useSp(frame, fps, atC - 1, 14)} mode="dark" size={56} />
      <Pill text="complete strangers" x={540} y={1130} s={kS} mode="dark" accent size={60} />
      <Sfx name="lib/pop" at={atF} volume={0.5} />
      <Sfx name="lib/pop" at={atC} volume={0.5} />
      <Sfx name="lib/impact-chord" at={atS} volume={0.5} />
    </AbsoluteFill>
  );
};

/** Question: se dibuja un signo de interrogación enorme alrededor del colgante. */
const Question: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atBigger = trig(scene, 'bigger', fps);
  const atRaises = trig(scene, 'raises', fps);
  const atDevice = trig(scene, 'device', fps);
  const draw = interpolate(frame, [atDevice, atBigger + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.inOut});
  const title = useSp(frame, fps, atBigger - 1, 14);
  const L = 1200;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: LAYOUT.headlineTop, opacity: title, transform: `translateY(${interpolate(title, [0, 1], [24, 0])}px)`}}>
        <div style={{...theme.label, fontSize: 28, color: brand.accent}}>— and suddenly</div>
        <div style={{...theme.display, fontSize: 96, color: p.text, marginTop: 12}}>{scene.title}</div>
      </div>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <path d="M 400 640 a 140 140 0 1 1 200 120 q -60 40 -60 120" fill="none" stroke={brand.accent} strokeWidth={26} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        <Pendant cx={540} cy={1010} r={60} mode="dark" listen={1} frame={frame} cord={false} />
      </svg>
      <Sfx name="lib/arp-down" at={atRaises} volume={0.4} />
      <Sfx name="lib/braam" at={atBigger} volume={0.45} />
    </AbsoluteFill>
  );
};

/** Life: la línea del día se vuelve la línea de la vida. */
const Life: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const atLife = trig(scene, 'life', fps);
  const fill = interpolate(frame, [4, atLife + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  return (
    <AbsoluteFill>
      <Headline lines={['If AI could remember', 'your entire life…']} mode="dark" frame={frame + 10} fps={fps} size={96} />
      <DayLine fill={fill} y={900} labels={['age 0', '20', '40', '60', '80']} mode="dark" frame={frame} dense />
      <Sfx name="lib/fire-whoosh" at={atLife} volume={0.4} />
    </AbsoluteFill>
  );
};

/** Close: la pregunta del frame 1, al revés. */
const Close: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const atWant = trig(scene, 'want', fps);
  const k = useSp(frame, fps, atWant - 1, 14);
  return (
    <AbsoluteFill>
      <Headline lines={['Would you actually', 'want it to?']} mode="light" frame={frame + 12} fps={fps} size={110} />
      {HOST.enabled && HOST.clips.want ? (
        <AvatarHost src={HOST.clips.want} mode="light" scale={HOST_LAYOUT.scale} top={HOST_LAYOUT.top} durationInFrames={scene.durationInFrames} />
      ) : (
        <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
          <Pendant cx={540} cy={900} r={110} mode="light" listen={1 - k * 0.8} frame={frame} />
        </svg>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center', gap: 20, opacity: HOST.enabled && HOST.clips.want ? 0 : k}}>
        {['yes', 'no'].map((t) => <div key={t} style={{padding: '14px 40px', borderRadius: 999, border: `3px solid ${t === 'yes' ? brand.accent : brand.ink2}`, color: t === 'yes' ? brand.accent : brand.ink2, fontSize: 40, fontWeight: 700}}>{t}</div>)}
      </div>
      <Sfx name="lib/ping-down" at={atWant} volume={0.45} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useSp(frame, fps, 0, 18, theme.spring.soft);
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

const SceneView: React.FC<{s: TimedShortScene; fps: number}> = ({s, fps}) => {
  switch (s.kind as string) {
    case 'hook': return <Hook scene={s} fps={fps} />;
    case 'brain': return <Brain scene={s} fps={fps} />;
    case 'meet': return <Meet scene={s} fps={fps} />;
    case 'devices': return <Devices scene={s} fps={fps} />;
    case 'how': return <How scene={s} fps={fps} />;
    case 'pipeline': return <Pipeline scene={s} fps={fps} />;
    case 'query': return <Query scene={s} fps={fps} />;
    case 'ask': return <Ask scene={s} fps={fps} />;
    case 'allday': return <AllDay scene={s} fps={fps} />;
    case 'big': return <Big scene={s} fps={fps} mode="light" />;
    case 'turn': return <Big scene={s} fps={fps} mode="dark" label="— but" size={140} />;
    case 'yours': return <Yours scene={s} fps={fps} />;
    case 'others': return <Others scene={s} fps={fps} />;
    case 'question': return <Question scene={s} fps={fps} />;
    case 'life': return <Life scene={s} fps={fps} />;
    case 'close': return <Close scene={s} fps={fps} />;
    default: return null;
  }
};

const BASS_SCENES = new Set(['meet', 'catch', 'question', 'want']);

export const AiMemory: React.FC = () => {
  const {fps} = useVideoConfig();
  const {scenes, outroFrom, totalFrames} = TL.build();
  const punchBeats = scenes.slice(1).map((s) => s.from);
  const catchScene = scenes.find((s) => s.id === 'catch')!;
  return (
    <AbsoluteFill style={{background: brand.soot, fontFamily: theme.font}}>
      <MusicBed src={scriptJson.music} scenes={scenes} totalFrames={totalFrames} base={0.28} levels={[{from: catchScene.from, base: 0.34}]} fadeInFrames={fps} />
      <ByScene scenes={scenes} until={outroFrom}>{(s) => <Background mode={s.mode} />}</ByScene>
      <PunchIn beats={punchBeats} amount={0.025} origin="50% 55%">
        <Track name="scenes">
          {scenes.map((s) => (
            <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.durationInFrames}>
              <Audio name={`voice:${s.id}`} src={staticFile(s.audioSrc)} />
              <SceneView s={s} fps={fps} />
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
        <Cut key={`cut-${s.id}`} at={s.from} strength={s.id === 'catch' ? 0.8 : BASS_SCENES.has(s.id) ? 0.5 : 0.22} bass={BASS_SCENES.has(s.id)} whoosh={(s.kind as string) !== 'query'} />
      ))}
      <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.5} />
      <Sfx name="lib/glitch" at={catchScene.from} lead={0} volume={0.5} />
      <Sfx name="lib/submerge" at={catchScene.from} lead={0} volume={0.5} />
      <Sequence name="outro" from={outroFrom} durationInFrames={TL.OUTRO_FRAMES}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
