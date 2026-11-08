import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, Track, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import scriptJson from '../../script/ai-agents.json';
import narration from '../data/ai-agents/narration.json';
import wordsJson from '../data/ai-agents/words.json';
import beatsJson from '../data/ai-agents/beats.json';
import {Background} from '../components/Background';
import {ByScene} from '../components/ByScene';
import {Captions} from '../components/Captions';
import {Chapter} from '../components/Chapter';
import {Cut} from '../components/Cut';
import {HostSplit} from '../components/HostSplit';
import {MusicBed} from '../components/MusicBed';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';
import {triggerFrameIn, type Word} from '../script';
import {brand, palette, theme, type Mode} from '../theme';
import {Headline, Pill} from './AiMemory';
import type {TimedShortScene} from './script';
import {makeShortTimeline} from './timeline';

/**
 * "Don't let AI replace you. Make it work for you." — guion de Enrico (8 nov). Armature: una persona + un equipo de agentes.
 * Protagonista visual: la persona (icono de línea) y los agentes (nodos naranja). Primera mitad: lo que una persona puede
 * construir con IA (tarjetas). Giro: los agentes trabajan solos. Payoff: una persona rodeada de agentes. Cierre: "Why not you?".
 * Host (HeyGen P2) mitad y mitad en hook y cierre.
 */
// v2 (feedback "se siente largo"): menos aire entre escenas (3 frames) y el corte solo se mueve ≤4 frames para caer en beat.
const TL = makeShortTimeline(scriptJson, narration, wordsJson as Record<string, Word[]>, beatsJson, {gap: 3, outroFrames: 45, snapTolerance: 4});
export const aiAgentsTimeline = TL.build;
export const AI_AGENTS = {fps: scriptJson.fps, width: scriptJson.width, height: scriptJson.height};

const LAYOUT = {headlineTop: 300, captionsBottom: 620};
const W = 1080;
const SN = theme.spring.snappy;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const useSp = (frame: number, fps: number, delay = 0, dur = 14, config: {damping: number; stiffness: number; mass?: number} = SN) => spring({frame: frame - delay, fps, config, durationInFrames: dur});
const trig = (s: TimedShortScene, word: string, fps: number) => triggerFrameIn(s.words, word, fps, s.id);
const HOST = (scriptJson as {host?: {enabled: boolean; layout?: string; split?: number; focusY?: number; clips: {hook?: string; why?: string}}}).host ?? {enabled: false, clips: {}};
const HOST_SPLIT = HOST.enabled && HOST.layout === 'split';
const SPLIT_Y = HOST.split ?? 960;
const HOST_FOCUS_Y = HOST.focusY ?? 0.18;
const captionsBottomFor = (id: string) => (HOST_SPLIT && ((id === 'hook' && HOST.clips.hook) || (id === 'why' && HOST.clips.why)) ? 1920 - SPLIT_Y - 60 : LAYOUT.captionsBottom);

/* ---------- Iconos de línea (dos colores) ---------- */
const Person: React.FC<{x: number; y: number; s?: number; color: string; fill?: string; o?: number}> = ({x, y, s = 1, color, fill = 'none', o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} stroke={color} strokeWidth={6} fill={fill} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={0} cy={-34} r={22} />
    <path d="M -42 46 a 42 36 0 0 1 84 0" />
  </g>
);
const AgentNode: React.FC<{x: number; y: number; r?: number; o?: number; pulse?: number}> = ({x, y, r = 26, o = 1, pulse = 0}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <circle r={r + 14 + pulse * 10} fill={brand.accent} opacity={0.12} />
    <circle r={r} fill={brand.accent} />
    <circle r={r * 0.3} fill={brand.onSoot} />
  </g>
);
const Bulb: React.FC<{x: number; y: number; s?: number; color: string; glow: number}> = ({x, y, s = 1, color, glow}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinecap="round" strokeLinejoin="round">
    <circle r={150} fill={brand.accent} opacity={0.18 * glow} />
    <path d="M -60 -20 a 60 60 0 1 1 120 0 c 0 30 -20 42 -28 62 l 0 18 l -64 0 l 0 -18 c -8 -20 -28 -32 -28 -62 z" fill={glow > 0.5 ? brand.accent : 'none'} stroke={glow > 0.5 ? brand.accent : color} strokeWidth={7} />
    <path d="M -24 78 l 48 0 M -18 96 l 36 0" stroke={color} strokeWidth={7} />
  </g>
);

/* ---------- Escenas ---------- */
const Hook: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const host = HOST.clips.hook;
  if (HOST_SPLIT && host) {
    return (
      <AbsoluteFill>
        <Headline lines={["Don't let AI replace you.", 'Make it work for you.'] } mode="light" frame={frame + 14} fps={fps} size={74} top={230} />
        <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
          <Person x={420} y={700} s={1.3} color={p.text} />
          {[0, 1, 2].map((i) => {
            const s = useSp(frame, fps, 14 + i * 5, 14);
            return <AgentNode key={i} x={560 + i * 86} y={700 + (i === 1 ? -40 : 20)} r={22} o={s} />;
          })}
        </svg>
        <HostSplit src={host} mode="light" split={SPLIT_Y} focusY={HOST_FOCUS_Y} durationInFrames={scene.durationInFrames} enterLead={10} />
        <Sfx name="lib/pop" at={14} volume={0.4} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Headline lines={["Don't let AI replace you.", 'Make it work for you.']} mode="light" frame={frame + 14} fps={fps} size={90} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <Person x={440} y={880} s={1.8} color={p.text} />
        {[0, 1, 2].map((i) => <AgentNode key={i} x={640 + i * 100} y={880 + (i === 1 ? -50 : 30)} r={26} o={useSp(frame, fps, 14 + i * 5, 14)} />)}
      </svg>
    </AbsoluteFill>
  );
};

const Idea: React.FC<{scene: TimedShortScene; fps: number; lit?: boolean}> = ({scene, fps, lit = false}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const atTeam = lit ? 0 : trig(scene, 'team', fps);
  const atBudget = lit ? 0 : trig(scene, 'budget', fps);
  const atAnymore = lit ? trig(scene, 'anymore', fps) : 9999;
  const glow = lit ? clamp01((frame - atAnymore + 2) / 10) : 0;
  const gone = lit ? useSp(frame, fps, 4, 14) : 0;
  const bulbIn = useSp(frame, fps, lit ? 0 : 2, 18, theme.spring.soft);
  return (
    <AbsoluteFill>
      <Headline lines={lit ? ['That might not', 'stop you anymore.'] : ['A business idea.', 'No team. No budget.']} mode="light" frame={frame + 12} fps={fps} size={96} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g opacity={bulbIn} transform={`translate(0 ${interpolate(bulbIn, [0, 1], [30, 0])})`}>
          <Bulb x={540} y={820} s={1.4} color={p.text} glow={glow} />
        </g>
      </svg>
      {([['no team', 300, 1060, atTeam], ['no budget', 760, 1060, atBudget]] as [string, number, number, number][]).map(([t, x, y, at]) => {
        const s = lit ? 1 - gone : useSp(frame, fps, at - 1, 14);
        const strike = lit ? 1 : clamp01((frame - at - 6) / 6);
        return (
          <div key={t} style={{position: 'absolute', left: 0, top: lit ? gone * 60 : 0, width: W, height: 1920, pointerEvents: 'none'}}>
            <Pill text={t} x={x} y={y} s={s} mode="light" size={48} />
            <div style={{position: 'absolute', left: x, top: y, width: 300 * strike, height: 7, background: brand.accent, borderRadius: 4, transform: 'translate(-50%, -50%) rotate(-8deg)', opacity: s}} />
          </div>
        );
      })}
      {!lit ? <><Sfx name="lib/pop" at={atTeam} volume={0.5} /><Sfx name="lib/pop" at={atBudget} volume={0.5} /></> : <><Sfx name="lib/woosh" at={4} volume={0.4} /><Sfx name="lib/coin" at={atAnymore} volume={0.5} /></>}
    </AbsoluteFill>
  );
};

/** Tarjeta de herramienta: número, título y una ilustración de línea que entra con la voz. */
const ToolCard: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const enter = useSp(frame, fps, 0, 16);
  const prog = clamp01((frame - 8) / 26);
  const atGrok = scene.id === 'video' ? trig(scene, 'Grok', fps) : 9999;
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title={scene.title} mode="light" top={LAYOUT.headlineTop} titleSize={96} width={880} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 600, height: 520, borderRadius: 32, background: brand.paper, border: `2px solid ${p.lineStrong}`, boxShadow: '0 24px 60px rgba(27,25,23,0.10)', opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`}}>
        <svg width={888} height={520} viewBox="0 0 888 520" style={{position: 'absolute', inset: 0}}>
          {scene.id === 'research' ? (
            <g>
              {[0.45, 0.7, 0.55, 0.9, 0.65].map((h, i) => {
                const k = clamp01((prog - i * 0.12) / 0.5);
                return <rect key={i} x={140 + i * 130} y={400 - 300 * h * k} width={70} height={300 * h * k} rx={10} fill={i === 3 ? brand.accent : p.text2} />;
              })}
              <line x1={110} y1={400} x2={780} y2={400} stroke={p.lineStrong} strokeWidth={4} />
            </g>
          ) : scene.id === 'build' ? (
            <g fill="none" stroke={p.text} strokeWidth={6} strokeLinecap="round" strokeDasharray={2000} strokeDashoffset={2000 * (1 - prog)}>
              <rect x={90} y={90} width={480} height={340} rx={20} />
              <line x1={90} y1={150} x2={570} y2={150} />
              <circle cx={130} cy={120} r={8} fill={brand.accent} stroke="none" />
              <rect x={620} y={70} width={180} height={380} rx={28} stroke={brand.accent} />
              <line x1={680} y1={100} x2={740} y2={100} stroke={brand.accent} />
            </g>
          ) : (
            <g>
              <rect x={150} y={80} width={588} height={360} rx={26} fill="none" stroke={p.text} strokeWidth={6} strokeDasharray={1900} strokeDashoffset={1900 * (1 - prog)} />
              <path d="M 400 190 L 520 260 L 400 330 Z" fill={brand.accent} opacity={clamp01((prog - 0.6) / 0.3)} />
            </g>
          )}
        </svg>
      </div>
      {scene.id === 'video' ? <Pill text="Grok Imagine" x={540} y={1060} s={useSp(frame, fps, atGrok - 1, 14)} mode="light" accent size={46} /> : null}
      <Sfx name="lib/snap" at={2} volume={0.45} />
      {scene.id === 'video' ? <Sfx name="lib/pop" at={atGrok} volume={0.5} /> : null}
    </AbsoluteFill>
  );
};

const Launch: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const items: [string, string][] = [['ads', 'Ads'], ['content', 'Content'], ['brand', 'Your brand']];
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title={scene.title} mode="light" top={LAYOUT.headlineTop} titleSize={96} width={880} />
      <div style={{position: 'absolute', left: 96, right: 96, top: 640, display: 'flex', flexDirection: 'column', gap: 22}}>
        {items.map(([w, label], i) => {
          const at = trig(scene, w, fps);
          const s = useSp(frame, fps, at - 1, 14);
          const accent = i === 2;
          return (
            <div key={w} style={{height: 140, borderRadius: 24, background: accent ? brand.accent : brand.paper, border: `2px solid ${accent ? brand.accent : p.lineStrong}`, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 24, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`}}>
              <div style={{width: 18, height: 18, borderRadius: 999, background: accent ? brand.onSoot : brand.accent}} />
              <div style={{...theme.display, fontSize: 64, color: accent ? brand.onSoot : p.text}}>{label}</div>
            </div>
          );
        })}
      </div>
      {items.map(([w]) => <Sfx key={w} name="lib/pop" at={trig(scene, w, fps)} volume={0.5} />)}
    </AbsoluteFill>
  );
};

const Network: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atAgents = trig(scene, 'agents', fps);
  const nodes = [[-280, -200], [300, -160], [-320, 160], [320, 200], [0, -330], [0, 320]];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: LAYOUT.headlineTop}}>
        <div style={{...theme.label, fontSize: 28, color: brand.accent}}>— and now</div>
        <div style={{...theme.display, fontSize: 132, color: p.text, marginTop: 12}}>AI agents.</div>
      </div>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {nodes.map(([dx, dy], i) => {
          const s = useSp(frame, fps, atAgents + i * 4, 16);
          return (
            <g key={i}>
              <line x1={540} y1={1000} x2={540 + dx * s} y2={1000 + dy * s} stroke={brand.accent} strokeWidth={4} opacity={0.6 * s} strokeDasharray="10 12" />
              <AgentNode x={540 + dx} y={1000 + dy} r={28} o={s} />
            </g>
          );
        })}
        <Person x={540} y={1000} s={1.8} color={p.text} />
      </svg>
      {nodes.map((_, i) => <Sfx key={i} name="lib/glassy-snap" at={atAgents + i * 4} volume={0.3} />)}
    </AbsoluteFill>
  );
};

const Agent: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const isGrok = scene.id === 'grokbot';
  const name = isGrok ? 'Grok Bot' : 'OpenAI Dots';
  const atName = trig(scene, isGrok ? 'Grok' : 'OpenAI', fps);
  const atKey = trig(scene, isGrok ? 'cloud' : 'away', fps);
  const fill = interpolate(frame, [atName, scene.audioFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.out});
  return (
    <AbsoluteFill>
      <Chapter label={scene.label} title={scene.title} mode="dark" top={LAYOUT.headlineTop} titleSize={104} width={880} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <g fill="none" stroke={p.text2} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={useSp(frame, fps, 4, 16)}>
          {isGrok ? (
            <>
              <path d="M 380 760 a 70 70 0 0 1 130 -40 a 90 90 0 0 1 170 40 a 60 60 0 0 1 -10 118 l -250 0 a 60 60 0 0 1 -40 -118 z" />
              <rect x={420} y={900} width={240} height={150} rx={14} />
              <line x1={500} y1={1090} x2={580} y2={1090} />
            </>
          ) : (
            <>
              <path d="M 600 740 a 120 120 0 1 0 60 220 a 95 95 0 0 1 -60 -220 z" />
              <circle cx={760} cy={760} r={6} fill={p.text2} />
              <circle cx={720} cy={860} r={5} fill={p.text2} />
            </>
          )}
        </g>
        <rect x={160} y={1140} width={760} height={18} rx={9} fill={p.surface} />
        <rect x={160} y={1140} width={760 * fill} height={18} rx={9} fill={brand.accent} />
        <text x={160} y={1200} fill={p.text3} fontFamily={theme.font} fontSize={28} fontWeight={500} letterSpacing="0.04em">{isGrok ? 'working on its own cloud computer' : 'still working while you are away'}</text>
      </svg>
      <Pill text={name} x={540} y={620} s={useSp(frame, fps, atName - 1, 14)} mode="dark" accent size={56} />
      <Sfx name="lib/pop" at={atName} volume={0.5} />
      <Sfx name="lib/ping-down" at={atKey} volume={0.4} />
    </AbsoluteFill>
  );
};

const Goal: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atGoal = trig(scene, 'goal', fps);
  const atAction = trig(scene, 'action', fps);
  const arrow = clamp01((frame - atGoal - 8) / Math.max(10, atAction - atGoal - 8));
  return (
    <AbsoluteFill>
      <Headline lines={['You give them a goal.', 'They turn it into action.']} mode="dark" frame={frame + 12} fps={fps} size={88} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <line x1={330} y1={880} x2={330 + 420 * arrow} y2={880} stroke={brand.accent} strokeWidth={8} strokeLinecap="round" />
        <path d="M 720 850 L 760 880 L 720 910" fill="none" stroke={brand.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={arrow >= 1 ? 1 : 0} />
        {[0, 1, 2].map((i) => {
          const s = useSp(frame, fps, atAction + 6 + i * 6, 12);
          return (
            <g key={i} transform={`translate(${380 + i * 160} 1080)`} opacity={s}>
              <circle r={34} fill={p.surface} stroke={brand.accent} strokeWidth={4} />
              <path d="M -14 0 L -4 10 L 16 -12" fill="none" stroke={brand.accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      <Pill text="goal" x={240} y={880} s={useSp(frame, fps, atGoal - 1, 14)} mode="dark" size={52} />
      <Pill text="action" x={870} y={880} s={useSp(frame, fps, atAction - 1, 14)} mode="dark" accent size={52} />
      <Sfx name="lib/pop" at={atGoal} volume={0.5} />
      <Sfx name="lib/coin" at={atAction} volume={0.5} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="lib/snap" at={atAction + 6 + i * 6} volume={0.3} />)}
    </AbsoluteFill>
  );
};

const Replace: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atTasks = trig(scene, 'tasks', fps);
  const atJobs = trig(scene, 'jobs', fps);
  const rows = [['data entry', atTasks], ['scheduling', atTasks + 5], ['first drafts', atTasks + 10], ['some jobs', atJobs]] as const;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: LAYOUT.headlineTop}}>
        <div style={{...theme.label, fontSize: 28, color: brand.accent}}>— of course</div>
        <div style={{...theme.display, fontSize: 96, color: p.text, marginTop: 12}}>AI will replace some tasks. And some jobs.</div>
      </div>
      <div style={{position: 'absolute', left: 96, right: 96, top: 760, display: 'flex', flexDirection: 'column', gap: 18}}>
        {rows.map(([t, at], i) => {
          const s = useSp(frame, fps, 4 + i * 4, 12);
          const strike = clamp01((frame - at) / 8);
          return (
            <div key={t} style={{position: 'relative', padding: '18px 28px', borderRadius: 16, background: p.surface, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`}}>
              <div style={{fontSize: 44, fontWeight: 600, color: i === 3 ? p.text : p.text2, opacity: 1 - strike * 0.5}}>{t}</div>
              <div style={{position: 'absolute', left: 20, top: '50%', height: 5, width: `${strike * 60}%`, background: brand.accent, borderRadius: 3 }} />
            </div>
          );
        })}
      </div>
      <Sfx name="lib/snap" at={atTasks} volume={0.4} />
      <Sfx name="lib/arp-down" at={atJobs} volume={0.4} />
    </AbsoluteFill>
  );
};

const Owners: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atGen = trig(scene, 'generation', fps);
  const cols = 5, rowsN = 3;
  return (
    <AbsoluteFill>
      <Headline lines={['A new generation', 'of business owners.']} mode="dark" frame={frame + 12} fps={fps} size={92} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: cols * rowsN}, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const lit = clamp01((frame - atGen - i * 2) / 8);
          return <Person key={i} x={200 + c * 170} y={720 + r * 190} s={1} color={lit > 0.5 ? brand.accent : p.text3} o={useSp(frame, fps, 2 + i, 12)} />;
        })}
      </svg>
      {Array.from({length: 5}, (_, i) => <Sfx key={i} name="lib/glassy-snap" at={atGen + i * 6} volume={0.25} />)}
    </AbsoluteFill>
  );
};

/** Continuación de Owners sin corte: la misma cuadrícula de 15 (ya encendida) se desvanece y queda la del centro, que crece. */
const Needed: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const atTeam = trig(scene, 'team', fps);
  const atStarted = trig(scene, 'started', fps);
  const fade = clamp01((frame - atTeam - 2) / 14);
  const solo = useSp(frame, fps, atStarted - 2, 16, theme.spring.soft);
  const cols = 5, rowsN = 3, center = 7;
  return (
    <AbsoluteFill>
      <Headline lines={['Once: an entire team.', 'Now: one person.']} mode="dark" frame={frame + 12} fps={fps} size={88} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: cols * rowsN}, (_, i) => {
          if (i === center) return null;
          const c = i % cols, r = Math.floor(i / cols);
          return <Person key={i} x={200 + c * 170} y={720 + r * 190} s={1} color={brand.accent} o={1 - fade} />;
        })}
        <Person x={540} y={910} s={1 + 1.1 * solo} color={brand.accent} />
      </svg>
      <Sfx name="lib/woosh" at={atTeam + 2} volume={0.4} />
      <Sfx name="lib/coin" at={atStarted} volume={0.5} />
    </AbsoluteFill>
  );
};

const Big: React.FC<{scene: TimedShortScene; fps: number; accentWord?: string}> = ({scene, fps, accentWord}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const s = useSp(frame, fps, 2, 16);
  const words = scene.title.split(' ');
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 96, right: 96, top: 600, ...theme.display, fontSize: 112, color: p.text, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`}}>
        {words.map((w, i) => (
          <span key={i} style={{color: accentWord && w.toLowerCase().startsWith(accentWord) ? brand.accent : p.text}}>{w}{i < words.length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Next: React.FC<{scene: TimedShortScene; fps: number; withAgents?: boolean}> = ({scene, fps, withAgents = false}) => {
  const frame = useCurrentFrame();
  const p = palette('dark');
  const atAgents = withAgents ? trig(scene, 'agents', fps) : 9999;
  const ring = withAgents ? 1 : useSp(frame, fps, 6, 20, theme.spring.soft);
  const orbit = [0, 1, 2, 3, 4, 5].map((i) => ({a: (i / 6) * Math.PI * 2 - Math.PI / 2, s: useSp(frame, fps, atAgents + i * 3, 16)}));
  return (
    <AbsoluteFill>
      <Headline lines={withAgents ? ['…and a team', 'of AI agents.'] : ['The next big company', 'might start with one person…']} mode="dark" frame={frame + 12} fps={fps} size={88} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={960} r={260 * ring} fill="none" stroke={brand.accent} strokeWidth={3} strokeDasharray="12 14" opacity={0.5} />
        {withAgents ? orbit.map(({a, s}, i) => <AgentNode key={i} x={540 + Math.cos(a) * 260} y={960 + Math.sin(a) * 260} r={30} o={s} pulse={Math.sin(frame * 0.2 + i)} />) : null}
        <Person x={540} y={960} s={2.2} color={withAgents ? brand.accent : p.text} />
      </svg>
      {withAgents ? orbit.map((_, i) => <Sfx key={i} name="lib/pop" at={atAgents + i * 3} volume={0.3} />) : <Sfx name="lib/glassy-snap" at={6} volume={0.4} />}
    </AbsoluteFill>
  );
};

const Why: React.FC<{scene: TimedShortScene; fps: number}> = ({scene, fps}) => {
  const frame = useCurrentFrame();
  const p = palette('light');
  const host = HOST.clips.why;
  const orbit = [0, 1, 2, 3, 4, 5].map((i) => ({a: (i / 6) * Math.PI * 2 - Math.PI / 2, s: useSp(frame, fps, 4 + i * 2, 14)}));
  const cy = HOST_SPLIT && host ? 690 : 960;
  const R = HOST_SPLIT && host ? 150 : 240;
  return (
    <AbsoluteFill>
      <Headline lines={['Why not you?']} mode="light" frame={frame + 12} fps={fps} size={HOST_SPLIT && host ? 112 : 132} top={HOST_SPLIT && host ? 250 : 320} accentLine={0} />
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{position: 'absolute', inset: 0}}>
        {orbit.map(({a, s}, i) => <AgentNode key={i} x={540 + Math.cos(a) * R} y={cy + Math.sin(a) * R} r={20} o={s} />)}
        <Person x={540} y={cy} s={HOST_SPLIT && host ? 1.3 : 2} color={p.text} />
      </svg>
      {HOST_SPLIT && host ? <HostSplit src={host} mode="light" split={SPLIT_Y} focusY={HOST_FOCUS_Y} durationInFrames={scene.durationInFrames} enterLead={6} /> : null}
      <Sfx name="lib/ping-down" at={trig(scene, 'you', fps)} volume={0.45} />
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
    case 'idea': return <Idea scene={s} fps={fps} />;
    case 'stop': return <Idea scene={s} fps={fps} lit />;
    case 'tool': return <ToolCard scene={s} fps={fps} />;
    case 'launch': return <Launch scene={s} fps={fps} />;
    case 'turn': return <Network scene={s} fps={fps} />;
    case 'agent': return <Agent scene={s} fps={fps} />;
    case 'goal': return <Goal scene={s} fps={fps} />;
    case 'replace': return <Replace scene={s} fps={fps} />;
    case 'owners': return <Owners scene={s} fps={fps} />;
    case 'needed': return <Needed scene={s} fps={fps} />;
    case 'big': return <Big scene={s} fps={fps} />;
    case 'big2': return <Big scene={s} fps={fps} accentWord="build" />;
    case 'next': return <Next scene={s} fps={fps} />;
    case 'agents2': return <Next scene={s} fps={fps} withAgents />;
    case 'close': return <Why scene={s} fps={fps} />;
    default: return null;
  }
};

const BASS_SCENES = new Set(['agents', 'replace', 'next', 'why']);
// escenas que continúan el plano anterior sin corte (fusión de gemelas: owners→needed, next→agents2)
const CONTINUES = new Set(['needed', 'agents2']);

export const AiAgents: React.FC = () => {
  const {fps} = useVideoConfig();
  const {scenes, outroFrom, totalFrames} = TL.build();
  const turn = scenes.find((s) => s.id === 'agents')!;
  const tools = scenes.find((s) => s.id === 'research')!;
  const payoff = scenes.find((s) => s.id === 'future')!;
  return (
    <AbsoluteFill style={{background: brand.soot, fontFamily: theme.font}}>
      {/* tres bloques con energía creciente: problema → herramientas → agentes/payoff */}
      <MusicBed src={scriptJson.music} scenes={scenes} totalFrames={totalFrames} base={0.24} levels={[{from: tools.from, base: 0.29}, {from: turn.from, base: 0.36}, {from: payoff.from, base: 0.4}]} fadeInFrames={fps} />
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
      {scenes.slice(1).filter((s) => !CONTINUES.has(s.id)).map((s) => (
        <Cut key={`cut-${s.id}`} at={s.from} strength={s.id === 'agents' ? 0.8 : BASS_SCENES.has(s.id) ? 0.5 : 0.22} bass={BASS_SCENES.has(s.id)} whoosh />
      ))}
      <Sfx name="lib/fire-whoosh" at={turn.from} lead={0} volume={0.5} />
      <Sfx name="lib/bass-drop" at={1} lead={1} volume={0.5} />
      <Sfx name="lib/glitch" at={turn.from} lead={0} volume={0.45} />
      <Sequence name="outro" from={outroFrom} durationInFrames={TL.OUTRO_FRAMES}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
