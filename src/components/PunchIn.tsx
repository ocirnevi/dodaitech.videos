import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

/**
 * Punch-in de cámara: en cada frame de `beats` la imagen salta a scale 1+amount
 * y vuelve a 1 en ~14 frames. El "golpe" visual que acompaña cada dato.
 */
export const PunchIn: React.FC<{beats: number[]; amount?: number; origin?: string; children: React.ReactNode}> = ({
  beats,
  amount = 0.045,
  origin = '62% 50%',
  children,
}) => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const b of beats) {
    if (frame < b) continue;
    const v = interpolate(frame - b, [0, 14], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    k = Math.max(k, v);
  }
  return <AbsoluteFill style={{transform: `scale(${1 + amount * k})`, transformOrigin: origin}}>{children}</AbsoluteFill>;
};
