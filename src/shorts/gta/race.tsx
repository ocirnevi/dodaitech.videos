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

export type RaceView = 'top' | 'side' | 'wheels' | 'window' | 'front' | 'pass' | 'lean' | 'low' | 'rear' | 'impact';

const TOWERS = [
  {w: 180, h: 780, hue: 0},
  {w: 140, h: 560, hue: 1},
  {w: 220, h: 860, hue: 2},
  {w: 160, h: 640, hue: 0},
  {w: 200, h: 720, hue: 1},
  {w: 150, h: 900, hue: 2},
];

const Wheel: React.FC<{cx: number; cy: number; r: number; spin: number}> = ({cx, cy, r, spin}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${spin})`}>
    <circle r={r} fill="#101014" />
    <circle r={r * 0.62} fill="#2c2c32" />
    <circle r={r * 0.16} fill="#d0d0d4" />
    {[0, 60, 120].map((d) => (
      <rect key={d} x={-r * 0.07} y={-r * 0.55} width={r * 0.14} height={r * 1.1} rx={2} fill="#8a8a92" transform={`rotate(${d})`} />
    ))}
  </g>
);

const Head: React.FC<{cx: number; cy: number; r?: number}> = ({cx, cy, r = 16}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#f0c8a4" />
    <rect x={cx - r * 0.7} y={cy + r * 0.7} width={r * 1.4} height={r * 1.5} rx={r * 0.4} fill="#3a3550" />
  </g>
);

const Wagon: React.FC<{spin: number}> = ({spin}) => (
  <g>
    <rect x={-170} y={-40} width={340} height={78} rx={18} fill="#f4e6c4" />
    <rect x={-86} y={-108} width={168} height={74} rx={14} fill="#fbf6ea" />
    <rect x={-70} y={-96} width={64} height={44} rx={6} fill="#8fd0e6" />
    <rect x={6} y={-96} width={60} height={44} rx={6} fill="#6fbfd8" />
    <Head cx={-20} cy={-78} r={14} />
    <rect x={132} y={-24} width={26} height={18} rx={3} fill="#fff3c4" />
    <rect x={-186} y={-6} width={20} height={30} rx={4} fill="#d7d0c2" />
    <Wheel cx={-90} cy={46} r={36} spin={spin} />
    <Wheel cx={100} cy={46} r={36} spin={spin} />
  </g>
);

const Suv: React.FC<{spin: number; win: number; lean: number; glow: number}> = ({spin, win, lean, glow}) => (
  <g>
    <ellipse cx={8} cy={58} rx={150} ry={26} fill="#e879f9" opacity={0.45 + glow * 0.5} />
    <rect x={-150} y={30} width={310} height={18} rx={8} fill="#f0abfc" opacity={0.55 + glow * 0.4} />
    <rect x={-168} y={-52} width={350} height={96} rx={16} fill="#141418" />
    <rect x={-48} y={-132} width={180} height={86} rx={14} fill="#1c1c22" />
    <rect x={-28} y={-118} width={74} height={52} rx={5} fill="#24182e" />
    <rect x={56} y={-118} width={64} height={52} rx={5} fill="#24182e" />
    <rect x={56} y={-118 + 52 * win} width={64} height={52 * (1 - win)} rx={4} fill="#3a2a4a" />
    <Head cx={-96} cy={-16} r={13} />
    <g opacity={0.25 + win * 0.75}>
      <Head cx={86} cy={-18} r={14} />
    </g>
    <g opacity={Math.max(lean, win * 0.4)} transform={`translate(92 ${-36 - lean * 28}) rotate(${-32 * Math.max(lean, 0.2)})`}>
      <rect x={-18} y={0} width={36} height={52} rx={12} fill="#7c5cff" />
      <circle cx={2} cy={-16} r={18} fill="#f0c8a4" />
      <rect x={16} y={6} width={64} height={14} rx={7} fill="#f0c8a4" transform="rotate(-36 16 6)" />
    </g>
    <rect x={168} y={-30} width={22} height={16} rx={3} fill="#fff" />
    <Wheel cx={-100} cy={52} r={40} spin={spin} />
    <Wheel cx={112} cy={52} r={40} spin={spin} />
  </g>
);

const Skyline: React.FC<{t: number; speed: number; low?: boolean}> = ({t, speed, low}) => {
  const scroll = (t * 140 * (0.45 + speed)) % 420;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1a0830 0%,#3a1460 38%,#140818 68%)', overflow: 'hidden'}}>
      {Array.from({length: 8}).map((_, k) =>
        TOWERS.map((b, i) => {
          const x = ((i * 210 - scroll + k * 420) % 1680) - 300;
          return (
            <div key={`${k}-${i}`} style={{position: 'absolute', left: x, bottom: low ? 520 : 700, width: b.w, height: b.h * (low ? 0.7 : 1), background: b.hue === 0 ? '#1a1030' : b.hue === 1 ? '#24143c' : '#160c28'}}>
              {Array.from({length: 8}).map((_, r) => (
                <div key={r} style={{display: 'flex', gap: 10, padding: '12px 12px 0'}}>
                  <div style={{width: 22, height: 16, background: (r + i) % 3 === 0 ? '#ffd56a' : '#3a2a55'}} />
                  <div style={{width: 22, height: 16, background: (r + i) % 4 === 0 ? '#9cf' : '#3a2a55'}} />
                </div>
              ))}
            </div>
          );
        }),
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: low ? 980 : 860, bottom: 0, background: '#12141c'}} />
    </AbsoluteFill>
  );
};

const SpeedLines: React.FC<{speed: number}> = ({speed}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {Array.from({length: 16}).map((_, i) => {
        const w = 70 + (i % 5) * 36;
        const x = ((frame * (18 + speed * 46) + i * 130) % 1500) - 200;
        return <div key={i} style={{position: 'absolute', left: x, top: 160 + ((i * 89) % 1200), width: w, height: 5, borderRadius: 4, background: 'rgba(255,255,255,0.38)'}} />;
      })}
    </AbsoluteFill>
  );
};

const Sparks: React.FC<{hot: number}> = ({hot}) => {
  const frame = useCurrentFrame();
  if (hot < 0.2) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: 16}).map((_, i) => {
        const life = ((frame * 0.45 + i * 2.7) % 14) / 14;
        const x = 520 + Math.sin(i * 1.7) * 160;
        const y = 1040 - life * 280 - (i % 4) * 16;
        return <circle key={i} cx={x} cy={y} r={5 + (1 - life) * 7} fill={i % 2 ? '#ffe14a' : '#ff7a18'} opacity={(1 - life) * hot} />;
      })}
    </svg>
  );
};

const Smoke: React.FC<{on: number}> = ({on}) => {
  const frame = useCurrentFrame();
  if (on < 0.15) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 5}).map((_, i) => {
        const life = ((frame * 0.3 + i * 4) % 20) / 20;
        return <div key={i} style={{position: 'absolute', left: 180 + i * 40 - life * 80, top: 1080 - life * 60, width: 80 + life * 70, height: 36 + life * 20, borderRadius: 40, background: `rgba(180,180,190,${(1 - life) * 0.35 * on})`}} />;
      })}
    </AbsoluteFill>
  );
};

export const Race: React.FC<{view: RaceView; t: number}> = ({view, t}) => {
  const frame = useCurrentFrame();
  const st = raceState(t);
  const spin = t * 640 * (0.65 + st.speed);
  const push = interpolate(frame, [0, 16], [0.94, 1.08], {extrapolateRight: 'clamp'});
  const shake = (view === 'impact' ? 1 : st.box) * Math.sin(frame * 1.8) * 10 + st.floor * Math.sin(frame * 2.2) * 4;
  const hot = view === 'impact' ? 1 : Math.max(st.box, st.pass * 0.6);
  const lean = view === 'lean' ? Math.max(st.lean, 0.9) : st.lean;
  const win = view === 'window' || view === 'lean' ? Math.max(st.win, view === 'window' ? 0.35 + frame / 40 : st.win) : st.win;

  if (view === 'top' || view === 'rear') {
    const zoom = view === 'rear' ? 1.35 : 1.12 * push;
    const wy = 780 + st.pass * 90;
    const sy = 1040 - st.along * 220 - st.pass * 340;
    const sx = 690 - st.box * 160;
    const wx = 390 - st.box * 30;
    const drift = (t * 260 * (0.6 + st.speed)) % 140;
    return (
      <AbsoluteFill style={{background: '#12141c', overflow: 'hidden', transform: `translate(${shake}px,0) scale(${zoom})`}}>
        <div style={{position: 'absolute', left: 70, right: 70, top: 0, bottom: 0, background: '#1c2028'}} />
        <div style={{position: 'absolute', left: 70, top: 0, bottom: 0, width: 16, background: '#f4e6c4'}} />
        <div style={{position: 'absolute', right: 70, top: 0, bottom: 0, width: 16, background: '#f4e6c4'}} />
        {Array.from({length: 16}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 526, top: i * 130 - drift, width: 28, height: 70, background: '#efe6c8', borderRadius: 4}} />
        ))}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(${wx} ${wy})`}>
            <rect x={-150} y={-250} width={300} height={500} rx={40} fill="#f4e6c4" />
            <rect x={-90} y={-120} width={180} height={160} rx={16} fill="#8fd0e6" />
            <circle cx={0} cy={-30} r={28} fill="#f0c8a4" />
          </g>
          <g transform={`translate(${sx} ${sy})`}>
            <rect x={-180} y={-40} width={360} height={70} rx={20} fill="#e879f9" />
            <rect x={-160} y={-270} width={320} height={540} rx={44} fill="#141418" />
            <rect x={-90} y={-110} width={180} height={140} rx={16} fill="#2a2038" />
            {lean > 0.2 ? <circle cx={30} cy={-290} r={32} fill="#f0c8a4" /> : null}
          </g>
        </svg>
        <SpeedLines speed={st.speed} />
        <Sparks hot={hot} />
      </AbsoluteFill>
    );
  }

  if (view === 'wheels') {
    return (
      <AbsoluteFill style={{background: '#0c0614', overflow: 'hidden', transform: `scale(${push})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 760, background: 'linear-gradient(180deg,#140818,#1a1028)'}} />
        <div style={{position: 'absolute', left: 40, right: 40, top: 420, height: 280, borderRadius: 24, background: '#141418'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 760, bottom: 0, background: '#16181f'}} />
        <div style={{position: 'absolute', left: -40, top: 700, width: 1160, height: 150, background: '#e879f9', filter: 'blur(22px)', opacity: 0.95}} />
        <SpeedLines speed={1} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <Wheel cx={300} cy={980} r={340} spin={spin} />
          <Wheel cx={860} cy={1120} r={230} spin={spin * 0.85} />
        </svg>
      </AbsoluteFill>
    );
  }

  if (view === 'window') {
    const drop = Math.min(1, win);
    return (
      <AbsoluteFill style={{overflow: 'hidden', transform: `scale(${1.02 * push})`}}>
        <Skyline t={t} speed={st.speed} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <rect x={0} y={40} width={1080} height={1420} rx={0} fill="#121216" />
          <rect x={36} y={110} width={1008} height={1180} rx={12} fill="#1c1230" />
          <rect x={36} y={110 + 1180 * drop} width={1008} height={1180 * (1 - drop)} fill="#0c0a12" />
          <g opacity={0.35 + drop * 0.65}>
            <circle cx={360} cy={820} r={100} fill="#f0c8a4" />
            <rect x={270} y={920} width={180} height={220} rx={40} fill="#5b4bff" />
            <circle cx={720} cy={790} r={96} fill="#e7b898" />
            <rect x={630} y={890} width={180} height={230} rx={40} fill="#ff4ad8" />
            <rect x={760} y={980} width={150} height={28} rx={12} fill="#f0c8a4" transform="rotate(-20 760 980)" />
          </g>
          <rect x={0} y={1460} width={1080} height={70} fill="#e879f9" />
        </svg>
      </AbsoluteFill>
    );
  }

  if (view === 'front') {
    const near = 1 + Math.max(st.box, view === 'front' ? 0.15 : 0) * 0.2;
    return (
      <AbsoluteFill style={{overflow: 'hidden', transform: `translate(${shake}px,0) scale(${push})`}}>
        <Skyline t={t} speed={st.speed} low />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform="translate(250 1080) scale(2.15)">
            <rect x={-100} y={-80} width={200} height={140} rx={18} fill="#f4e6c4" />
            <rect x={-78} y={-140} width={156} height={70} rx={12} fill="#fbf6ea" />
            <circle cx={0} cy={-100} r={16} fill="#f0c8a4" />
            <rect x={-86} y={-16} width={32} height={20} rx={4} fill="#fff6c8" />
            <rect x={54} y={-16} width={32} height={20} rx={4} fill="#fff6c8" />
            <circle cx={-58} cy={64} r={28} fill="#111" />
            <circle cx={58} cy={64} r={28} fill="#111" />
          </g>
          <g transform={`translate(760 1000) scale(${2.35 * near})`}>
            <ellipse cx={0} cy={78} rx={100} ry={22} fill="#e879f9" opacity={0.9} />
            <rect x={-100} y={-90} width={200} height={160} rx={18} fill="#141418" />
            <rect x={-72} y={-150} width={144} height={70} rx={12} fill="#1c1c22" />
            <circle cx={0} cy={-110} r={16} fill="#f0c8a4" />
            <rect x={-82} y={-10} width={30} height={18} rx={3} fill="#fff" />
            <rect x={52} y={-10} width={30} height={18} rx={3} fill="#fff" />
            <circle cx={-56} cy={78} r={30} fill="#111" />
            <circle cx={56} cy={78} r={30} fill="#111" />
          </g>
        </svg>
        <Sparks hot={hot} />
        <div style={{position: 'absolute', left: 80, right: 80, top: 1180, height: 80, background: '#e879f9', filter: 'blur(28px)', opacity: 0.75}} />
      </AbsoluteFill>
    );
  }

  const low = view === 'low';
  const zoom = (view === 'lean' ? 1.85 : view === 'pass' ? 2.05 : view === 'impact' ? 2.2 : low ? 2.15 : 1.95) * push;
  const pan = view === 'pass' ? interpolate(frame, [0, 10], [90, -30], {extrapolateRight: 'clamp'}) : Math.sin(frame / 9) * 12;
  const suvX = interpolate(st.along, [0, 1], [150, 88]) + st.pass * 70 - (view === 'impact' ? 50 : st.box * 36);
  const wagonX = -78 - st.pass * 90 - (view === 'impact' ? 16 : st.box * 18);
  const flip = 1;
  return (
    <AbsoluteFill style={{overflow: 'hidden', transform: `translate(${shake + pan}px,0)`}}>
      <Skyline t={t} speed={st.speed} low={low} />
      <SpeedLines speed={st.speed + (view === 'pass' ? 0.4 : 0)} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${540} ${low ? 1120 : 980}) scale(${zoom * flip} ${zoom})`}>
          <g transform={`translate(${wagonX} 30)`} opacity={0.95}>
            <g transform="translate(-18 8)" opacity={0.28}>
              <Wagon spin={spin} />
            </g>
            <Wagon spin={spin} />
          </g>
          <g transform={`translate(${suvX} -20)`}>
            <g transform="translate(-22 10)" opacity={0.3}>
              <Suv spin={spin} win={win} lean={lean} glow={1} />
            </g>
            <Suv spin={spin} win={win} lean={lean} glow={Math.max(st.glow, 0.7)} />
          </g>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: low ? 1080 : 1000, height: 140, background: 'radial-gradient(ellipse at center, rgba(232,121,249,0.55), transparent 70%)', filter: 'blur(8px)'}} />
      <Sparks hot={hot} />
      <Smoke on={Math.max(st.floor, st.pass)} />
    </AbsoluteFill>
  );
};
