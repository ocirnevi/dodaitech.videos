import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {useBrand} from '../theme';
import {Sfx} from './Sfx';

export const CUT_PRE = 3;
export const CUT_POST = 5;

const Flash: React.FC<{color: string; strength: number}> = ({color, strength}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - 12, [0, CUT_PRE, CUT_PRE + CUT_POST], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: o * strength, background: `radial-gradient(ellipse at 50% 55%, #ffffff 0%, ${color}cc 45%, ${color}55 100%)`}} />;
};

/** Corte duro con flash: whoosh cuyo pico cae en el corte, bajo en el corte. `at` = frame global del corte. */
export const Cut: React.FC<{at: number; color?: string; strength?: number; bass?: boolean; whoosh?: boolean}> = ({at, color, strength = 0.6, bass = true, whoosh = true}) => {
  const brand = useBrand();
  const c = color ?? brand.accent;
  return (
  <Sequence from={at - CUT_PRE - 12} durationInFrames={CUT_PRE + CUT_POST + 90} name={`cut@${at}`} layout="none">
    <Flash color={c} strength={strength} />
    {whoosh ? <Sfx name="lib/woosh" at={12 + CUT_PRE} lead={0} volume={0.55} /> : null}
    {bass ? <Sfx name="lib/bass-drop" at={12 + CUT_PRE} lead={1} volume={0.6} /> : null}
  </Sequence>
  );
};
