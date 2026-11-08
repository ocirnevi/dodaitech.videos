import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Mode, useBrand} from '../theme';

/** Capas superiores: grade naranja muy sutil → grano → viñeta. */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Post: React.FC<{mode: Mode}> = ({mode}) => {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const dark = mode === 'dark';
  return (
    <>
      <AbsoluteFill style={{pointerEvents: 'none', backgroundColor: brand.accent, mixBlendMode: 'soft-light', opacity: dark ? 0.12 : 0.015}} />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: dark
            ? 'linear-gradient(180deg, rgba(0,0,0,0.14), transparent 26%, transparent 74%, rgba(0,0,0,0.3))'
            : 'linear-gradient(180deg, rgba(27,25,23,0.04), transparent 25%, transparent 75%, rgba(27,25,23,0.08))',
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          backgroundImage: NOISE,
          backgroundSize: '220px',
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: dark ? 0.07 : 0.05,
          mixBlendMode: dark ? 'overlay' : 'multiply',
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: dark
            ? 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.32) 100%)'
            : 'radial-gradient(ellipse at center, transparent 60%, rgba(27,25,23,0.12) 100%)',
        }}
      />
    </>
  );
};
