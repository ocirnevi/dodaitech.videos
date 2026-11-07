import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import peaks from '../data/sfx-peaks.json';

export type SfxName = keyof typeof peaks | string;

/**
 * Un efecto de sonido cuyo TRANSIENTE cae en el frame `at` (docs/03-sonido.md: se alinea el pico, no el inicio del archivo).
 * `lead` adelanta el pico N frames más (0–1 para hits). `align=false` reproduce desde `at` sin compensar.
 */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number; lead?: number; align?: boolean}> = ({name, at, volume = 0.6, lead = 1, align = true}) => {
  const {fps} = useVideoConfig();
  const info = (peaks as Record<string, {peak: number; duration: number}>)[name];
  const peakFrames = align && info ? Math.round(info.peak * fps) : 0;
  const from = at - peakFrames - lead;
  const dur = info ? Math.ceil(info.duration * fps) + 2 : 40;
  // Remotion no permite from negativo con audio recortado: recortamos el inicio del archivo si hace falta
  const trim = from < 0 ? -from : 0;
  return (
    <Sequence from={Math.max(0, from)} durationInFrames={dur} name={`sfx:${name}`} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} trimBefore={trim} />
    </Sequence>
  );
};
