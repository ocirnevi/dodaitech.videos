import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../../theme';

const PINK = '#ff3cac';
const YELLOW = '#ffe14a';

export const clashes = (headline: string, spoken: string) => {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2);
  const page = new Set(norm(spoken));
  return norm(headline).some((w) => page.has(w));
};

export const GlowWord: React.FC<{text: string; spoken: string}> = ({text, spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (clashes(text, spoken)) return null;
  const s = spring({frame, fps, config: {damping: 12, stiffness: 180, mass: 0.7}, durationInFrames: 12});
  const size = text.length <= 3 ? 220 : text.length > 12 ? 92 : text.length > 8 ? 118 : 142;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 300, textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.18, 1])})`}}>
      <div style={{fontFamily: theme.font, fontWeight: 800, fontSize: size, letterSpacing: '-0.045em', lineHeight: 0.92, color: '#fff', textShadow: `0 0 18px ${PINK}, 0 0 48px ${PINK}, 0 0 6px #fff`}}>{text}</div>
    </div>
  );
};

export const PinkPill: React.FC<{text: string; spoken: string; top?: number}> = ({text, spoken, top = 220}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (clashes(text, spoken)) return null;
  const s = spring({frame: frame - 2, fps, config: theme.spring.snappy, durationInFrames: 12});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [-16, 0])}px) scale(${interpolate(s, [0, 1], [0.86, 1])})`}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: '#0c0b0e', color: '#fff', borderRadius: 999, padding: '16px 28px 16px 22px', fontFamily: theme.font, fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.08)'}}>
        <span style={{width: 14, height: 14, borderRadius: 99, background: PINK, boxShadow: `0 0 12px ${PINK}`}} />
        {text}
      </div>
    </div>
  );
};

export const FlashHit: React.FC<{glitch?: boolean}> = ({glitch}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, 7], [0.75, 0.35, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#fff', opacity: o * 0.55}} />
      {glitch && frame < 6
        ? [0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: `${8 + i * 18}%`, height: '7%', background: i % 2 ? 'rgba(255,40,190,0.45)' : 'rgba(80,255,255,0.28)', transform: `translateX(${(i % 2 ? 1 : -1) * (22 - frame * 4)}px)`}} />
          ))
        : null}
    </AbsoluteFill>
  );
};

const enter = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 170, mass: 0.7}, durationInFrames: 14});

export const PaperDoc: React.FC<{spoken: string}> = ({spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = enter(frame, fps, 0);
  const stamp = enter(frame, fps, 14);
  const shake = frame > 14 && frame < 26 ? Math.sin(frame * 2.4) * (26 - frame) * 1.3 : 0;
  const hide = clashes('APPROVED', spoken);
  return (
    <AbsoluteFill style={{background: '#07070a', transform: `translateX(${shake}px)`}}>
      <div style={{position: 'absolute', left: 150, top: 340, width: 780, height: 760, background: '#f7f4ee', borderRadius: 8, opacity: card, transform: `rotate(${interpolate(card, [0, 1], [8, -2])}deg) scale(${interpolate(card, [0, 1], [0.8, 1])})`, boxShadow: '0 30px 80px rgba(0,0,0,0.45)', padding: '56px 52px'}}>
        <div style={{fontFamily: theme.font, fontWeight: 800, fontSize: 42, letterSpacing: '0.08em', color: '#1b1917'}}>MECHANIC</div>
        {[1, 0.92, 0.8, 0.88, 0.6, 0.84, 0.5].map((w, i) => (
          <div key={i} style={{marginTop: 28, height: 18, width: `${w * 100}%`, background: '#c8c4bc', borderRadius: 4}} />
        ))}
        <div style={{position: 'absolute', left: 48, bottom: 48, width: 84, height: 84, borderRadius: 18, background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.font, fontWeight: 800, fontSize: 48, color: '#1b1917'}}>R</div>
        <div style={{position: 'absolute', right: 54, top: 250, opacity: stamp, transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [1.65, 1])})`}}>
          <div style={{border: '8px solid #1f9d4d', color: '#1f9d4d', borderRadius: 14, padding: '8px 16px', fontFamily: theme.font, fontWeight: 800, fontSize: 48, letterSpacing: '0.12em'}}>{hide ? '✓' : 'APPROVED'}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center', gap: 18}}>
      {Array.from({length: 5}).map((_, i) => {
        const s = enter(frame, fps, i * 3);
        return <div key={i} style={{fontSize: 92, color: '#fff', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`, textShadow: '0 0 18px #fff'}}>★</div>;
      })}
    </div>
  );
};

export const CrimeBox: React.FC<{spoken: string}> = ({spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 4);
  if (clashes('CRIME', spoken)) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.3, 1])})`}}>
      <div style={{border: '8px solid #ff2a2a', color: '#ff2a2a', fontFamily: theme.font, fontWeight: 800, fontSize: 120, letterSpacing: '0.12em', padding: '8px 36px', boxShadow: '0 0 30px rgba(255,40,40,0.65)', background: 'rgba(0,0,0,0.35)'}}>CRIME</div>
    </div>
  );
};

export const FamilyIcons: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const people = [64, 52, 40, 36];
  return (
    <svg width={1080} height={420} style={{position: 'absolute', left: 0, top: 430}}>
      {people.map((h, i) => {
        const s = enter(frame, fps, 4 + i * 3);
        const x = 140 + i * 120;
        return (
          <g key={i} opacity={s} transform={`translate(${x} 200) scale(${interpolate(s, [0, 1], [0.6, 1])})`}>
            <circle cy={-h - 28} r={h * 0.34} fill="#fff" stroke="#1b1917" strokeWidth={4} />
            <rect x={-h * 0.36} y={-h + 4} width={h * 0.72} height={h} rx={h * 0.28} fill="#fff" stroke="#1b1917" strokeWidth={4} />
          </g>
        );
      })}
    </svg>
  );
};

export const Speedo: React.FC<{t: number}> = ({t}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 2);
  const speed = Math.min(1, Math.max(0, (t - 27.6) / 2.4));
  const ang = -210 + speed * 240;
  return (
    <svg width={520} height={420} style={{position: 'absolute', left: 280, top: 250, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`}}>
      <path d="M40 300 A 220 220 0 1 1 480 300" fill="none" stroke="#2a2a2a" strokeWidth={28} strokeLinecap="round" />
      <path d="M40 300 A 220 220 0 1 1 480 300" fill="none" stroke="#ff2a2a" strokeWidth={28} strokeLinecap="round" strokeDasharray="760" strokeDashoffset={760 * (1 - speed)} />
      <g transform={`translate(260 300) rotate(${ang})`}>
        <rect x={-6} y={-180} width={12} height={180} rx={6} fill="#fff" />
      </g>
      <circle cx={260} cy={300} r={16} fill="#fff" />
      <text x={260} y={250} textAnchor="middle" fill="#fff" fontFamily="Bricolage Grotesque, sans-serif" fontSize={42} fontWeight={800}>{Math.round(speed * 120)}</text>
    </svg>
  );
};

export const TrafficLight: React.FC<{t: number}> = ({t}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 2);
  const green = t > 18.7;
  return (
    <div style={{position: 'absolute', left: 86, top: 480, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [-30, 0])}px)`}}>
      <div style={{width: 110, background: '#111', borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 14}}>
        <Lamp on={!green} color="#ff3030" />
        <Lamp on={false} color="#ffe14a" />
        <Lamp on={green} color="#3dff7a" />
      </div>
    </div>
  );
};
const Lamp: React.FC<{on: boolean; color: string}> = ({on, color}) => <div style={{width: 78, height: 78, borderRadius: 99, background: on ? color : '#2a2a2a', boxShadow: on ? `0 0 24px ${color}` : 'none'}} />;

export const MissionCard: React.FC<{spoken: string}> = ({spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0);
  const hide = clashes('NOT SCRIPTED', spoken);
  return (
    <AbsoluteFill style={{background: '#07060a'}}>
      <div style={{position: 'absolute', left: 160, top: 520, width: 760, height: 460, borderRadius: 28, background: '#14121a', border: '2px solid rgba(255,255,255,0.08)', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.86, 1])})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', left: 36, top: 28, color: '#9a958e', fontFamily: theme.font, fontWeight: 700, letterSpacing: '0.14em', fontSize: 28}}>MISSION</div>
        {!hide ? <div style={{color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: 72, letterSpacing: '-0.04em'}}>NOT SCRIPTED</div> : null}
        <div style={{position: 'absolute', inset: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.95}}>
          <div style={{width: 420, height: 18, background: '#ff2a2a', transform: 'rotate(18deg)', boxShadow: '0 0 18px #ff2a2a'}} />
          <div style={{position: 'absolute', width: 420, height: 18, background: '#ff2a2a', transform: 'rotate(-18deg)', boxShadow: '0 0 18px #ff2a2a'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EdgeCover: React.FC<{spoken: string}> = ({spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0);
  const hide = clashes('EDGE', spoken);
  return (
    <AbsoluteFill style={{background: '#07060c'}}>
      <div style={{position: 'absolute', left: 220, top: 250, width: 640, height: 820, borderRadius: 18, background: '#121018', boxShadow: `0 0 0 3px ${PINK}, 0 0 40px ${PINK}`, opacity: s, transform: `rotate(${interpolate(s, [0, 1], [6, -2])}deg) scale(${interpolate(s, [0, 1], [0.9, 1])})`, overflow: 'hidden'}}>
        <div style={{height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: hide ? 0 : 92, letterSpacing: '-0.04em'}}>{hide ? '' : 'EDGE'}</div>
        <div style={{margin: '0 28px', height: 460, overflow: 'hidden', borderRadius: 8}}>
          <OffthreadVideo muted src={staticFile('footage/gta-director/trailer1.mp4')} startFrom={12 * 30} style={{width: '160%', height: '100%', objectFit: 'cover', marginLeft: '-30%'}} />
        </div>
        <div style={{margin: '28px 36px 0', height: 16, background: '#3a3644', width: '70%'}} />
        <div style={{margin: '16px 36px 0', height: 16, background: '#3a3644', width: '48%'}} />
      </div>
    </AbsoluteFill>
  );
};

const FLORIDA = 'M70 250 L300 210 L390 270 L370 350 L520 400 L650 500 L720 660 L780 860 L700 1040 L600 1200 L520 1340 L430 1460 L360 1380 L400 1220 L340 1060 L300 900 L250 740 L190 580 L120 440 Z';

export const LeonidaMap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [0, 40], [2600, 0], {extrapolateRight: 'clamp'});
  const pins = [
    {x: 430, y: 390},
    {x: 690, y: 700},
    {x: 640, y: 980},
    {x: 500, y: 1280},
  ];
  const pulse = 0.45 + 0.55 * Math.sin(frame / 4);
  return (
    <AbsoluteFill style={{background: '#07060f'}}>
      <svg width={1080} height={1700} viewBox="0 0 1080 1600" style={{marginTop: 40}}>
        <path d={FLORIDA} fill="rgba(255,60,172,0.08)" stroke={PINK} strokeWidth={16} strokeLinejoin="round" strokeDasharray={2600} strokeDashoffset={draw} style={{filter: 'drop-shadow(0 0 12px #ff3cac)'}} />
        {pins.map((p, i) => {
          const s = enter(frame, fps, 16 + i * 4);
          return (
            <g key={i} opacity={s}>
              <circle cx={p.x} cy={p.y - 18} r={12} fill="#fff" />
              <path d={`M ${p.x} ${p.y} l -10 -22 h 20 z`} fill="#fff" />
            </g>
          );
        })}
        <circle cx={690} cy={860} r={16 + pulse * 22} fill="none" stroke="#fff" strokeWidth={4} />
        <circle cx={690} cy={860} r={8} fill="#fff" />
      </svg>
    </AbsoluteFill>
  );
};

export const DecisionTree: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = interpolate(frame, [4, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const nodes = [
    {x: 540, y: 340, t: 'YOU', d: 0},
    {x: 250, y: 620, t: 'FORK', d: 6},
    {x: 540, y: 660, t: 'AMBUSH', d: 8},
    {x: 830, y: 620, t: 'CASH', d: 10},
    {x: 180, y: 900, t: 'HEAT', d: 14},
    {x: 360, y: 920, t: 'LOSS', d: 16},
  ];
  return (
    <AbsoluteFill style={{background: '#08070d'}}>
      <svg width={1080} height={1920}>
        <line x1={540} y1={380} x2={250} y2={580} stroke={PINK} strokeWidth={6} strokeDasharray={400} strokeDashoffset={400 * (1 - grow)} />
        <line x1={540} y1={380} x2={540} y2={610} stroke={PINK} strokeWidth={6} strokeDasharray={300} strokeDashoffset={300 * (1 - grow)} />
        <line x1={540} y1={380} x2={830} y2={580} stroke={PINK} strokeWidth={6} strokeDasharray={400} strokeDashoffset={400 * (1 - grow)} />
        <line x1={250} y1={660} x2={180} y2={860} stroke="#fff" strokeWidth={4} opacity={grow} />
        <line x1={250} y1={660} x2={360} y2={880} stroke="#fff" strokeWidth={4} opacity={grow} />
      </svg>
      {nodes.map((n) => {
        const s = enter(frame, fps, n.d);
        return (
          <div key={n.t} style={{position: 'absolute', left: n.x, top: n.y, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.7, 1])})`, opacity: s, background: '#111', color: '#fff', border: `2px solid ${PINK}`, borderRadius: 999, padding: '14px 26px', fontFamily: theme.font, fontWeight: 800, fontSize: 36, letterSpacing: '0.06em'}}>{n.t}</div>
        );
      })}
    </AbsoluteFill>
  );
};

export const WalletBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0);
  const fly = interpolate(frame, [10, 28], [0, -80], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#120818,#07060c)'}}>
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 220, opacity: s, transform: `translateY(${fly}px)`}}>
        <g transform="translate(540 420)">
          <rect x={-300} y={-200} width={600} height={420} rx={36} fill="#f4e6c4" />
          <path d="M-300 10 H300" stroke="#1b1917" strokeWidth={18} />
          <rect x={-300} y={10} width={600} height={210} rx={0} fill="#e4d2a4" />
          <rect x={-300} y={180} width={600} height={40} rx={18} fill="#f4e6c4" />
          <rect x={150} y={-160} width={110} height={78} rx={12} fill="#ff3cac" />
          <circle cx={-170} cy={110} r={26} fill="#1f9d4d" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 980, textAlign: 'center', color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: 72, letterSpacing: '0.08em', opacity: s}}>LIFTED</div>
    </AbsoluteFill>
  );
};

export const HeroBeat: React.FC<{spoken: string}> = ({spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 2);
  const hide = clashes('HERO', spoken);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.12, 1])})`}}>
      <div style={{background: 'rgba(0,0,0,0.72)', borderRadius: 28, padding: '16px 36px 8px'}}>
      <svg width={240} height={180}>
        <circle cx={78} cy={32} r={26} fill="#fff" />
        <rect x={48} y={62} width={60} height={88} rx={18} fill="#ff2a2a" />
        <rect x={100} y={88} width={90} height={16} rx={5} fill="#fff" />
        <circle cx={196} cy={96} r={9} fill="#fff" />
      </svg>
      </div>
      {hide ? null : <div style={{color: '#ff2a2a', fontFamily: theme.font, fontWeight: 800, fontSize: 120, letterSpacing: '-0.04em', textShadow: '0 0 24px #ff2a2a'}}>HERO</div>}
    </div>
  );
};

export const Reticle: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 9) * 30;
  const y = Math.cos(frame / 11) * 24;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, transform: `translate(${x}px, ${y}px)`}}>
      <circle cx={540} cy={820} r={120} fill="none" stroke="#ff2a2a" strokeWidth={6} />
      <circle cx={540} cy={820} r={6} fill="#ff2a2a" />
      <line x1={540} y1={660} x2={540} y2={740} stroke="#ff2a2a" strokeWidth={6} />
      <line x1={540} y1={900} x2={540} y2={980} stroke="#ff2a2a" strokeWidth={6} />
      <line x1={380} y1={820} x2={460} y2={820} stroke="#ff2a2a" strokeWidth={6} />
      <line x1={620} y1={820} x2={700} y2={820} stroke="#ff2a2a" strokeWidth={6} />
    </svg>
  );
};

export const Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opts = ['Race', 'Ignore', 'Your way?'];
  return (
    <div style={{position: 'absolute', left: 120, right: 120, top: 460}}>
      {opts.map((o, i) => {
        const s = enter(frame, fps, i * 4);
        return (
          <div key={o} style={{marginBottom: 22, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`, background: 'rgba(8,8,12,0.82)', border: '2px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: '26px 32px', color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: 64, letterSpacing: '-0.03em', display: 'flex', justifyContent: 'space-between'}}>
            <span>{o}</span>
            <span style={{color: PINK}}>{i === 0 ? '●' : '○'}</span>
          </div>
        );
      })}
    </div>
  );
};

export const NelsonCard: React.FC<{spoken: string}> = ({spoken}) => <PinkPill text="ROB NELSON" spoken={spoken} top={980} />;
