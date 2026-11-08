import type {Beat, Word} from '../script';
import type {ShortScene, TimedShortScene} from './script';

type ScriptJson = {id: string; title: string; fps: number; width: number; height: number; music: string; frame1Text: string; voice: string; scenes: unknown[]};
type Narration = Record<string, {src: string; durationInSeconds: number}>;
type BeatsJson = {beats: number[]; downbeats?: number[]};

/**
 * Línea de tiempo de un short a partir de sus datos (guion, narración, palabras, beats de la música).
 * Misma lógica que script.ts (que está pegado a ai-iceberg): cada escena arranca en max(fin de la voz anterior + GAP, targetStart),
 * ajustado al beat de música más cercano (≤ 8 frames). Devuelve escenas con `from`, `durationInFrames`, `words`.
 */
export const makeShortTimeline = (script: ScriptJson, narration: Narration, words: Record<string, Word[]>, beats: BeatsJson, opts: {gap?: number; outroFrames?: number} = {}) => {
  const FPS = script.fps;
  const GAP = opts.gap ?? 8;
  const OUTRO_FRAMES = opts.outroFrames ?? 45;
  const beatFramesList = beats.beats.map((s) => Math.round(s * FPS));
  const snapToBeat = (frame: number, minFrame: number) => {
    const candidates = beatFramesList.filter((b) => b >= minFrame && Math.abs(b - frame) <= 8);
    if (!candidates.length) return Math.max(frame, minFrame);
    return candidates.reduce((best, b) => (Math.abs(b - frame) < Math.abs(best - frame) ? b : best));
  };
  const build = (): {scenes: TimedShortScene[]; totalFrames: number; outroFrom: number} => {
    const out: TimedShortScene[] = [];
    let prevEnd = 0;
    for (const sc of script.scenes as ShortScene[]) {
      const n = narration[sc.id];
      if (!n) throw new Error(`Falta narración de ${sc.id}: python3 scripts/tts-espeak.py script/${script.id}.json`);
      const audioFrames = Math.ceil(n.durationInSeconds * FPS);
      const target = Math.round(sc.targetStart * FPS);
      const from = out.length === 0 ? 0 : snapToBeat(Math.max(prevEnd, target), prevEnd);
      out.push({...sc, from, audioFrames, audioSrc: n.src, words: words[sc.id] ?? [], durationInFrames: 0});
      prevEnd = from + audioFrames + GAP;
    }
    for (let i = 0; i < out.length; i++) {
      const next = i + 1 < out.length ? out[i + 1].from : prevEnd;
      out[i].durationInFrames = next - out[i].from;
    }
    return {scenes: out, totalFrames: prevEnd + OUTRO_FRAMES, outroFrom: prevEnd};
  };
  const speakingFn = (scenes: TimedShortScene[]) => {
    const spans: [number, number][] = [];
    for (const s of scenes) for (const w of s.words) spans.push([s.from + w.start * FPS - 6, s.from + w.end * FPS + 8]);
    return (frame: number) => spans.some(([a, b]) => frame >= a && frame <= b);
  };
  return {FPS, GAP, OUTRO_FRAMES, build, speakingFn, snapToBeat, beatFramesList};
};
export type {Beat};
