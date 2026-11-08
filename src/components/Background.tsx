import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Mode, useBrand, usePalette} from '../theme';

/** Fondo de marca: papel piedra con retícula de plano técnico (claro) o banda soot con brillo naranja (oscuro). */
export const Background: React.FC<{mode: Mode}> = ({mode}) => {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const p = usePalette(mode);
  const drift = frame * 0.12;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            mode === 'light'
              ? `radial-gradient(1100px 700px at 72% 42%, ${brand.accent}14 0%, transparent 60%), linear-gradient(180deg, ${p.bg} 0%, ${p.bg2} 100%)`
              : `radial-gradient(1200px 760px at 70% 40%, ${brand.accent}1f 0%, transparent 60%), linear-gradient(180deg, ${p.bg2} 0%, ${p.bg} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${p.line} 1px, transparent 1px), linear-gradient(90deg, ${p.line} 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
          backgroundPosition: `${drift}px ${drift * 0.6}px`,
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 88%)',
        }}
      />
    </AbsoluteFill>
  );
};
