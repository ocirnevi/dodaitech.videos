import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/** Estado continuo de la persecución, en segundos absolutos de la voz. */
export const raceState = (t: number) => {
  const smooth = (a: number, b: number) => {
    if (t <= a) return 0;
    if (t >= b) return 1;
    const x = (t - a) / (b - a);
    return x * x * (3 - 2 * x);
  };
  const along = smooth(11.55, 13.35);
  const glow = smooth(12.9, 14.2);
  const win = smooth(15.35, 16.55);
  const box = smooth(25.05, 26.7);
  const floor = smooth(27.9, 29.3);
  const pass = smooth(31.15, 33.15);
  const lean = smooth(33.35, 34.7);
  const speed = 0.28 + along * 0.12 + floor * 0.42 + pass * 0.18;
  return {along, glow, win, box, floor, pass, lean, speed};
};

export type RaceView = 'top' | 'side' | 'wheels' | 'window' | 'front' | 'pass' | 'lean';

const BUILDINGS = [
  {x: 0, w: 150, h: 640},
  {x: 150, w: 110, h: 480},
  {x: 260, w: 90, h: 720},
  {x: 780, w: 120, h: 560},
  {x: 900, w: 180, h: 760},
];

const Wheel: React.FC<{cx: number; cy: number; r: number; spin: number}> = ({cx, cy, r, spin}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${spin})`}>
    <circle r={r} fill="#141414" />
    <circle r={r * 0.55} fill="#3a3a3a" />
    <circle r={r * 0.18} fill="#c8c8c8" />
    {[0, 45, 90, 135].map((d) => (
      <rect key={d} x={-r * 0.08} y={-r * 0.5} width={r * 0.16} height={r} rx={2} fill="#6a6a6a" transform={`rotate(${d})`} />
    ))}
  </g>
);

const Wagon: React.FC<{spin: number}> = ({spin}) => (
  <g>
    <rect x={-150} y={-36} width={300} height={70} rx={16} fill="#f4e6c4" />
    <rect x={-78} y={-96} width={150} height={66} rx={12} fill="#fbf6ea" />
    <rect x={-64} y={-86} width={58} height={40} rx={5} fill="#8fd0e6" />
    <rect x={4} y={-86} width={54} height={40} rx={5} fill="#6fbfd8" />
    <rect x={118} y={-22} width={22} height={16} rx={3} fill="#fff3c4" />
    <rect x={-168} y={-8} width={18} height={28} rx={3} fill="#d7d0c2" />
    <rect x={-20} y={-118} width={70} height={10} rx={3} fill="#c9bfa8" />
    <Wheel cx={-80} cy={40} r={32} spin={spin} />
    <Wheel cx={90} cy={40} r={32} spin={spin} />
  </g>
);

const Suv: React.FC<{spin: number; win: number; lean: number; glow: number}> = ({spin, win, lean, glow}) => (
  <g>
    <ellipse cx={10} cy={52} rx={120} ry={18} fill="#c026ff" opacity={0.35 + glow * 0.55} />
    <rect x={-130} y={28} width={270} height={14} rx={7} fill="#d946ef" opacity={0.45 + glow * 0.5} />
    <rect x={-150} y={-48} width={310} height={86} rx={14} fill="#16161a" />
    <rect x={-40} y={-118} width={160} height={76} rx={12} fill="#1c1c22" />
    <rect x={-22} y={-106} width={70} height={46} rx={4} fill="#24182e" />
    <rect x={54} y={-106} width={58} height={46} rx={4} fill="#24182e" />
    {/* ventana que baja */}
    <rect x={54} y={-106 + 46 * win} width={58} height={46 * (1 - win)} rx={3} fill="#3a2a4a" />
    <circle cx={-90} cy={-8} r={10} fill="#f0c8a4" opacity={0.2 + win * 0.8} />
    <circle cx={78} cy={-8} r={11} fill="#f0c8a4" opacity={0.15 + win * 0.85} />
    <rect x={150} y={-28} width={18} height={14} rx={2} fill="#fff" opacity={0.8} />
    <Wheel cx={-90} cy={46} r={36} spin={spin} />
    <Wheel cx={100} cy={46} r={36} spin={spin} />
    {/* copiloto asomado */}
    <g opacity={lean} transform={`translate(78 ${-20 - lean * 10}) rotate(${-26 * lean})`}>
      <rect x={-16} y={-8} width={30} height={46} rx={10} fill="#7c5cff" />
      <circle cx={0} cy={-24} r={16} fill="#f0c8a4" />
      <rect x={10} y={-8} width={48} height={12} rx={6} fill="#f0c8a4" transform={`rotate(${-30 * lean} 10 0)`} />
    </g>
  </g>
);

const City: React.FC<{t: number; speed: number}> = ({t, speed}) => {
  const drift = (t * 40 * (0.4 + speed)) % 80;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #140818 0%, #2a1248 42%, #120816 70%)'}}>
      {BUILDINGS.map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b.x, bottom: 760, width: b.w, height: b.h, background: i % 2 ? '#1a1030' : '#22143a', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.04)'}}>
          {Array.from({length: 12}).map((_, r) => (
            <div key={r} style={{display: 'flex', gap: 8, padding: '10px 10px 0'}}>
              <div style={{width: 18, height: 14, background: (r + i) % 3 === 0 ? '#ffd56a' : '#3a2a55', opacity: 0.9}} />
              <div style={{width: 18, height: 14, background: (r + i) % 4 === 0 ? '#7cf' : '#3a2a55'}} />
            </div>
          ))}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 980, height: 940, background: '#12141a'}} />
      {Array.from({length: 14}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 524, top: 1020 + i * 90 - drift, width: 32, height: 46, background: '#f4e6c4', opacity: 0.85, borderRadius: 4}} />
      ))}
      <div style={{position: 'absolute', left: 70, right: 70, top: 1004, height: 8, background: '#3a3d48'}} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 1560, height: 8, background: '#3a3d48'}} />
    </AbsoluteFill>
  );
};

const TopRoad: React.FC<{t: number; speed: number}> = ({t, speed}) => {
  const drift = (t * 220 * (0.5 + speed)) % 120;
  return (
    <AbsoluteFill style={{background: '#100814'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 1080, background: '#1a1d24'}} />
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 18, background: '#f4e6c4'}} />
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 18, background: '#f4e6c4'}} />
      {Array.from({length: 18}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 524, top: i * 120 - drift, width: 28, height: 64, background: '#efe6c8', borderRadius: 4}} />
      ))}
    </AbsoluteFill>
  );
};

export const Race: React.FC<{view: RaceView; t: number}> = ({view, t}) => {
  const frame = useCurrentFrame();
  const st = raceState(t);
  const spin = t * 520 * (0.6 + st.speed);
  const shake = st.box * Math.sin(frame * 1.6) * 8 + st.floor * Math.sin(frame * 2.1) * 5;
  const suvX = interpolate(st.along, [0, 1], [430, 0]) + st.pass * 210 - st.box * 70;
  const wagonX = -st.pass * 160 - st.box * 36;
  const pushY = st.box * 10;

  if (view === 'top') {
    const wy = 820 + st.pass * 80;
    const sy = 1120 - st.along * 260 - st.pass * 420;
    const sx = 680 - st.box * 140;
    const wx = 400 - st.box * 40;
    return (
      <AbsoluteFill style={{transform: `translate(${shake}px, 0)`}}>
        <TopRoad t={t} speed={st.speed} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${wx} ${wy})`}>
            <rect x={-70} y={-130} width={140} height={260} rx={28} fill="#f4e6c4" />
            <rect x={-46} y={-70} width={92} height={90} rx={12} fill="#8fd0e6" />
          </g>
          <g transform={`translate(${sx} ${sy})`}>
            <rect x={-90} y={-20} width={180} height={40} rx={12} fill="#e879f9" opacity={0.9} />
            <rect x={-84} y={-150} width={168} height={300} rx={32} fill="#141418" />
            <rect x={-48} y={-70} width={96} height={80} rx={10} fill="#2a2038" />
          </g>
          {st.lean > 0.2 ? <circle cx={sx + 16} cy={sy - 170} r={22} fill="#f0c8a4" /> : null}
        </svg>
      </AbsoluteFill>
    );
  }

  if (view === 'wheels') {
    return (
      <AbsoluteFill style={{background: '#0c0614', transform: `translate(${shake}px, 0)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, bottom: 0, background: '#14161c'}} />
        <div style={{position: 'absolute', left: -80, top: 760, width: 900, height: 120, background: '#e879f9', filter: 'blur(30px)', opacity: 0.9, borderRadius: 60}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <Wheel cx={340} cy={1080} r={300} spin={spin} />
          <Wheel cx={820} cy={1240} r={210} spin={spin * 0.8} />
        </svg>
        <div style={{position: 'absolute', left: -80, top: 200, width: 180, height: 1500, background: 'linear-gradient(90deg, transparent, rgba(255,60,200,0.35), transparent)', transform: 'rotate(12deg)', filter: 'blur(8px)'}} />
      </AbsoluteFill>
    );
  }

  if (view === 'window') {
    const drop = st.win;
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#1a0c28,#07060c)'}}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          <rect x={70} y={280} width={940} height={1100} rx={36} fill="#141418" />
          <rect x={140} y={390} width={800} height={760} rx={16} fill="#1c1230" />
          <rect x={140} y={390 + 760 * drop} width={800} height={760 * (1 - drop)} fill="#0e0a16" />
          <g opacity={0.25 + drop}>
            <circle cx={400} cy={860} r={90} fill="#f0c8a4" />
            <rect x={320} y={950} width={160} height={200} rx={36} fill="#5b4bff" />
            <circle cx={700} cy={840} r={84} fill="#e7b898" />
            <rect x={626} y={930} width={150} height={190} rx={34} fill="#ff4ad8" />
          </g>
          <rect x={60} y={1380} width={960} height={42} rx={10} fill="#d946ef" opacity={0.85} />
        </svg>
      </AbsoluteFill>
    );
  }

  if (view === 'front') {
    const near = 1 + st.box * 0.18;
    return (
      <AbsoluteFill style={{transform: `translate(${shake}px, ${pushY}px)`}}>
        <City t={t} speed={st.speed} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(260 1180) scale(1.55)`}>
            <rect x={-90} y={-70} width={180} height={120} rx={16} fill="#f4e6c4" />
            <rect x={-70} y={-120} width={140} height={58} rx={10} fill="#fbf6ea" />
            <rect x={-78} y={-20} width={28} height={18} rx={4} fill="#fff6c8" />
            <rect x={50} y={-20} width={28} height={18} rx={4} fill="#fff6c8" />
            <circle cx={-50} cy={54} r={24} fill="#141414" />
            <circle cx={50} cy={54} r={24} fill="#141414" />
          </g>
          <g transform={`translate(730 1100) scale(${1.7 * near})`}>
            <ellipse cx={0} cy={70} rx={80} ry={16} fill="#e879f9" opacity={0.8} />
            <rect x={-84} y={-78} width={168} height={140} rx={16} fill="#141418" />
            <rect x={-60} y={-130} width={120} height={60} rx={10} fill="#1c1c22" />
            <rect x={-70} y={-16} width={26} height={16} rx={3} fill="#fff" />
            <rect x={44} y={-16} width={26} height={16} rx={3} fill="#fff" />
            <circle cx={-48} cy={68} r={26} fill="#111" />
            <circle cx={48} cy={68} r={26} fill="#111" />
          </g>
        </svg>
      </AbsoluteFill>
    );
  }

  const camX = view === 'lean' ? -120 : view === 'pass' ? -40 : 80;
  const camY = view === 'lean' ? 40 : 0;
  const zoom = view === 'lean' ? 1.35 : view === 'pass' ? 1.05 : 1.15;
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, 0)`}}>
      <City t={t} speed={st.speed} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${540 + camX} ${1040 + camY}) scale(${zoom})`}>
          <g transform={`translate(${wagonX} 40) scale(1.25)`}>
            <Wagon spin={spin} />
          </g>
          <g transform={`translate(${suvX + 20} -10) scale(1.35)`}>
            <Suv spin={spin} win={st.win} lean={view === 'lean' ? Math.max(st.lean, 0.85) : st.lean} glow={st.glow} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
