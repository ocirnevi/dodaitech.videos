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
  const s = spring({frame, fps, config: {damping: 9, stiffness: 220, mass: 0.55}, durationInFrames: 12});
  const size = text.length <= 3 ? 280 : text.length > 12 ? 128 : text.length > 8 ? 168 : 210;
  const shake = Math.sin(frame * 1.7) * interpolate(s, [0, 1], [10, 2]);
  return (
    <div style={{position: 'absolute', left: 36, right: 36, top: 150, textAlign: 'center', opacity: s, transform: `translateX(${shake}px) scale(${interpolate(s, [0, 1], [1.42, 1])})`}}>
      <div style={{fontFamily: theme.font, fontWeight: 800, fontSize: size, letterSpacing: '-0.05em', lineHeight: 0.9, color: '#fff', textShadow: `0 0 22px ${PINK}, 0 0 64px ${PINK}, 0 0 8px #fff`}}>{text}</div>
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
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: '#0c0b0e', color: '#fff', borderRadius: 999, padding: '22px 40px 22px 28px', fontFamily: theme.font, fontWeight: 800, fontSize: 56, letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.1)'}}>
        <span style={{width: 22, height: 22, borderRadius: 99, background: PINK, boxShadow: `0 0 16px ${PINK}`}} />
        {text}
      </div>
    </div>
  );
};

/** Glitch corto: 4 frames, cortes finos con fringe RGB. No deja bandas encima del plano. */
export const FlashHit: React.FC<{glitch?: boolean}> = ({glitch}) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 2, 5], [0.55, 0.15, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#fff', opacity: flash * (glitch ? 0.2 : 0.4)}} />
    </AbsoluteFill>
  );
};

export const DimPlate: React.FC<{src?: string; at?: number}> = ({src = 'footage/gta-director/trailer2.mp4', at = 30}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <OffthreadVideo muted src={staticFile(src)} startFrom={Math.round(at * 30)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,6,18,0.72) 0%, rgba(10,6,18,0.55) 42%, rgba(10,6,18,0.78) 100%)'}} />
  </AbsoluteFill>
);

const enter = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 170, mass: 0.7}, durationInFrames: 14});

export const PaperDoc: React.FC<{spoken?: string}> = ({spoken: _spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = enter(frame, fps, 0);
  const stamp = enter(frame, fps, 3);
  const hit = frame >= 3 && frame < 16 ? Math.sin(frame * 2.8) * (16 - frame) * 2.1 : 0;
  void _spoken;
  return (
    <AbsoluteFill style={{transform: `translate(${hit}px, ${hit * 0.35}px)`}}>
      <DimPlate src="footage/gta-director/trailer1.mp4" at={48} />
      <div style={{position: 'absolute', left: 48, right: 48, top: 90, bottom: 430, background: '#f7f4ee', borderRadius: 10, opacity: card, transform: `rotate(${interpolate(card, [0, 1], [7, -1.5])}deg) scale(${interpolate(card, [0, 1], [0.86, 1])})`, boxShadow: '0 40px 90px rgba(0,0,0,0.5)', padding: '64px 56px'}}>
        <div style={{fontFamily: theme.font, fontWeight: 800, fontSize: 64, letterSpacing: '0.12em', color: '#1b1917'}}>MECHANIC</div>
        {[1, 0.94, 0.78, 0.9, 0.66, 0.86, 0.52, 0.8].map((w, i) => (
          <div key={i} style={{marginTop: 36, height: 26, width: `${w * 100}%`, background: '#c8c4bc', borderRadius: 6}} />
        ))}
        <div style={{position: 'absolute', left: 48, bottom: 48, width: 110, height: 110, borderRadius: 22, background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.font, fontWeight: 800, fontSize: 64, color: '#1b1917'}}>R</div>
        <div style={{position: 'absolute', left: 24, right: 24, top: '34%', display: 'flex', justifyContent: 'center', opacity: stamp, transform: `rotate(-11deg) scale(${interpolate(stamp, [0, 1], [1.55, 1])})`}}>
          <div style={{border: '14px solid #178a3e', color: '#178a3e', borderRadius: 16, padding: '14px 28px', fontFamily: theme.font, fontWeight: 800, fontSize: 84, letterSpacing: '0.06em', background: 'rgba(247,244,238,0.9)', boxShadow: '0 10px 0 rgba(23,138,62,0.28)'}}>APPROVED</div>
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
        return <div key={i} style={{fontSize: 150, color: '#fff', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`, textShadow: '0 0 22px #fff'}}>★</div>;
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
      <div style={{border: '12px solid #ff2a2a', color: '#ff2a2a', fontFamily: theme.font, fontWeight: 800, fontSize: 188, letterSpacing: '0.12em', padding: '12px 48px', boxShadow: '0 0 40px rgba(255,40,40,0.7)', background: 'rgba(0,0,0,0.45)'}}>CRIME</div>
    </div>
  );
};

export const FamilyIcons: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const people = [64, 52, 40, 36];
  return (
    <svg width={1080} height={360} style={{position: 'absolute', left: 0, top: 250}}>
      {people.map((h, i) => {
        const s = enter(frame, fps, 3 + i * 2);
        const x = 150 + i * 200;
        const shirt = ['#ff4ad8', '#7c5cff', '#ffe14a', '#ffffff'][i];
        return (
          <g key={i} opacity={s} transform={`translate(${x} 210) scale(${interpolate(s, [0, 1], [0.5, 1.15])})`}>
            <circle cy={-h - 36} r={h * 0.42} fill="#fff" stroke="#1b1917" strokeWidth={6} />
            <rect x={-h * 0.46} y={-h} width={h * 0.92} height={h * 1.15} rx={h * 0.34} fill={shirt} stroke="#1b1917" strokeWidth={6} />
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
    <svg width={860} height={700} viewBox="0 0 520 420" style={{position: 'absolute', left: 110, top: 160, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`}}>
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
    <div style={{position: 'absolute', left: 48, top: 220, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [-30, 0])}px) scale(1.45)`, transformOrigin: 'top left'}}>
      <div style={{width: 110, background: '#111', borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 14}}>
        <Lamp on={!green} color="#ff3030" />
        <Lamp on={false} color="#ffe14a" />
        <Lamp on={green} color="#3dff7a" />
      </div>
    </div>
  );
};
const Lamp: React.FC<{on: boolean; color: string}> = ({on, color}) => <div style={{width: 78, height: 78, borderRadius: 99, background: on ? color : '#2a2a2a', boxShadow: on ? `0 0 24px ${color}` : 'none'}} />;

export const MissionCard: React.FC<{spoken?: string}> = ({spoken: _spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 0);
  const drift = Math.sin(frame / 16) * 6;
  void _spoken;
  return (
    <AbsoluteFill style={{transform: `translateX(${drift}px)`}}>
      <DimPlate src="footage/gta-director/trailer1.mp4" at={33} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 240, height: 980, borderRadius: 36, background: 'rgba(16,14,22,0.92)', border: '2px solid rgba(255,255,255,0.1)', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', left: 48, top: 40, color: '#b7b1a8', fontFamily: theme.font, fontWeight: 700, letterSpacing: '0.16em', fontSize: 42}}>MISSION</div>
        <div style={{color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: 108, letterSpacing: '-0.04em', textAlign: 'center', lineHeight: 0.95, zIndex: 1}}>NOT SCRIPTED</div>
        <div style={{position: 'absolute', inset: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 760, height: 28, background: '#ff2a2a', transform: 'rotate(16deg)', boxShadow: '0 0 24px #ff2a2a'}} />
          <div style={{position: 'absolute', width: 760, height: 28, background: '#ff2a2a', transform: 'rotate(-16deg)', boxShadow: '0 0 24px #ff2a2a'}} />
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
    <AbsoluteFill>
      <DimPlate src="footage/gta-director/trailer2.mp4" at={5} />
      <div style={{position: 'absolute', left: 120, top: 140, width: 840, height: 1180, borderRadius: 22, background: '#121018', boxShadow: `0 0 0 4px ${PINK}, 0 0 48px ${PINK}`, opacity: s, transform: `rotate(${interpolate(s, [0, 1], [6, -2])}deg) scale(${interpolate(s, [0, 1], [0.92, 1])})`, overflow: 'hidden'}}>
        <div style={{height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: hide ? 0 : 128, letterSpacing: '-0.04em'}}>{hide ? '' : 'EDGE'}</div>
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
  const draw = interpolate(frame, [0, 16], [1000, 0], {extrapolateRight: 'clamp'});
  const pins = [
    {x: 430, y: 390},
    {x: 690, y: 700},
    {x: 640, y: 980},
    {x: 500, y: 1280},
  ];
  const pulse = 0.45 + 0.55 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <DimPlate src="footage/gta-director/trailer1.mp4" at={12} />
      <div style={{position: 'absolute', inset: 0, zIndex: 4}}>
      <svg width={1080} height={1500} viewBox="0 0 1080 1600">
        <path d={FLORIDA} fill="rgba(255,60,172,0.5)" stroke="#ffffff" strokeWidth={26} strokeLinejoin="round" strokeDasharray={2200} strokeDashoffset={draw * 2.2} />
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
      </div>
    </AbsoluteFill>
  );
};

export const DecisionTree: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = interpolate(frame, [4, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const drift = Math.sin(frame / 18) * 8;
  const nodes = [
    {x: 540, y: 260, t: 'YOU', d: 0},
    {x: 230, y: 560, t: 'FORK', d: 6},
    {x: 540, y: 600, t: 'AMBUSH', d: 8},
    {x: 850, y: 560, t: 'CASH', d: 10},
    {x: 140, y: 900, t: 'HEAT', d: 14},
    {x: 340, y: 940, t: 'LOSS', d: 16},
  ];
  return (
    <AbsoluteFill style={{transform: `translateX(${drift}px)`}}>
      <DimPlate src="footage/gta-director/trailer1.mp4" at={30} />
      <svg width={1080} height={1920}>
        <line x1={540} y1={300} x2={230} y2={500} stroke={PINK} strokeWidth={8} strokeDasharray={400} strokeDashoffset={400 * (1 - grow)} />
        <line x1={540} y1={300} x2={540} y2={540} stroke={PINK} strokeWidth={8} strokeDasharray={300} strokeDashoffset={300 * (1 - grow)} />
        <line x1={540} y1={300} x2={850} y2={500} stroke={PINK} strokeWidth={8} strokeDasharray={400} strokeDashoffset={400 * (1 - grow)} />
        <line x1={230} y1={620} x2={140} y2={840} stroke="#fff" strokeWidth={6} opacity={grow} />
        <line x1={230} y1={620} x2={340} y2={880} stroke="#fff" strokeWidth={6} opacity={grow} />
      </svg>
      {nodes.map((n) => {
        const s = enter(frame, fps, n.d);
        return (
          <div key={n.t} style={{position: 'absolute', left: n.x, top: n.y, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.7, 1])})`, opacity: s, background: '#111', color: '#fff', border: `3px solid ${PINK}`, borderRadius: 999, padding: '20px 36px', fontFamily: theme.font, fontWeight: 800, fontSize: 52, letterSpacing: '0.06em'}}>{n.t}</div>
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
    <AbsoluteFill>
      <DimPlate src="footage/gta-director/trailer2.mp4" at={45} />
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 120, opacity: s, transform: `translateY(${fly}px) scale(1.35)`, transformOrigin: '50% 40%'}}>
        <g transform="translate(540 420)">
          <rect x={-340} y={-230} width={680} height={480} rx={40} fill="#f4e6c4" />
          <path d="M-340 20 H340" stroke="#1b1917" strokeWidth={22} />
          <rect x={-340} y={20} width={680} height={230} fill="#e4d2a4" />
          <rect x={-340} y={210} width={680} height={40} rx={18} fill="#f4e6c4" />
          <rect x={160} y={-180} width={130} height={90} rx={14} fill="#ff3cac" />
          <circle cx={-190} cy={130} r={32} fill="#1f9d4d" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center', color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: 108, letterSpacing: '0.08em', opacity: s, textShadow: '0 8px 24px #000'}}>LIFTED</div>
    </AbsoluteFill>
  );
};

export const HeroBeat: React.FC<{spoken: string}> = ({spoken}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = enter(frame, fps, 2);
  void spoken;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.2, 1])})`}}>
      <div style={{background: 'rgba(0,0,0,0.72)', borderRadius: 36, padding: '20px 48px 10px'}}>
        <svg width={360} height={240}>
          <circle cx={120} cy={46} r={40} fill="#fff" />
          <rect x={72} y={92} width={96} height={120} rx={28} fill="#ff2a2a" />
          <rect x={156} y={128} width={140} height={22} rx={8} fill="#fff" />
          <circle cx={304} cy={140} r={14} fill="#fff" />
        </svg>
      </div>
      <div style={{color: '#ff2a2a', fontFamily: theme.font, fontWeight: 800, fontSize: 180, letterSpacing: '-0.04em', textShadow: '0 0 28px #ff2a2a'}}>HERO</div>
    </div>
  );
};

export const Reticle: React.FC = () => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 9) * 30;
  const y = Math.cos(frame / 11) * 24;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, transform: `translate(${x}px, ${y}px)`}}>
      <circle cx={540} cy={760} r={200} fill="none" stroke="#ff2a2a" strokeWidth={10} />
      <circle cx={540} cy={760} r={10} fill="#ff2a2a" />
      <line x1={540} y1={500} x2={540} y2={620} stroke="#ff2a2a" strokeWidth={10} />
      <line x1={540} y1={900} x2={540} y2={1020} stroke="#ff2a2a" strokeWidth={10} />
      <line x1={280} y1={760} x2={400} y2={760} stroke="#ff2a2a" strokeWidth={10} />
      <line x1={680} y1={760} x2={800} y2={760} stroke="#ff2a2a" strokeWidth={10} />
    </svg>
  );
};

export const Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opts = ['Race', 'Ignore', 'Your way?'];
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 280}}>
      {opts.map((o, i) => {
        const s = enter(frame, fps, i * 2);
        return (
          <div key={o} style={{marginBottom: 28, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [48, 0])}px)`, background: 'rgba(8,8,12,0.88)', border: '3px solid rgba(255,255,255,0.16)', borderRadius: 28, padding: '36px 42px', color: '#fff', fontFamily: theme.font, fontWeight: 800, fontSize: 92, letterSpacing: '-0.03em', display: 'flex', justifyContent: 'space-between'}}>
            <span>{o}</span>
            <span style={{color: PINK}}>{i === 0 ? '●' : '○'}</span>
          </div>
        );
      })}
    </div>
  );
};

export const NelsonCard: React.FC<{spoken: string}> = ({spoken}) => <PinkPill text="ROB NELSON" spoken={spoken} top={220} />;
