import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

/** Entrada de escena: opacidad + escala en 8 frames. La salida la cubre el flash del corte. */
export const SceneIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: theme.spring.snappy, durationInFrames: 12});
  const opacity = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity, transform: `scale(${interpolate(s, [0, 1], [1.04, 1])})`}}>{children}</AbsoluteFill>;
};
