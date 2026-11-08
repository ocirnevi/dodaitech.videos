import {Audio} from '@remotion/media';
import {interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Word} from '../script';

type SceneSpans = {from: number; words: Word[]}[];

/**
 * Cama musical con ducking bajo la voz (docs/03-sonido.md: 18–25 dB bajo la narración).
 * Vive en su propio componente para que solo él se suscriba a useCurrentFrame() (regla del skill remotion-markup).
 * `levels` permite subir la cama tras un giro (p. ej. 0.28 → 0.34 en "the catch").
 */
export const MusicBed: React.FC<{src: string; scenes: SceneSpans; totalFrames: number; base?: number; levels?: {from: number; base: number}[]; duck?: number; fadeInFrames?: number; fadeOutFrames?: number}> = ({src, scenes, totalFrames, base = 0.3, levels = [], duck = 0.45, fadeInFrames, fadeOutFrames = 24}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fadeIn = fadeInFrames ?? fps;
  const spans: [number, number][] = [];
  for (const s of scenes) for (const w of s.words) spans.push([s.from + w.start * fps - 6, s.from + w.end * fps + 8]);
  const speaking = spans.some(([a, b]) => frame >= a && frame <= b);
  let level = base;
  for (const l of levels) if (frame >= l.from) level = l.base;
  const volume =
    interpolate(frame, [0, fadeIn], [level * 0.75, level], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
    (speaking ? duck : 1) *
    interpolate(frame, [totalFrames - fadeOutFrames - 2, totalFrames - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Audio name="music" src={staticFile(src)} volume={volume} />;
};
