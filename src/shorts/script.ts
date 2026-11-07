import scriptJson from '../../script/ai-iceberg.json';
import narration from '../data/ai-iceberg/narration.json';
import wordsJson from '../data/ai-iceberg/words.json';
import beatsJson from '../data/ai-iceberg/beats.json';
import type {Beat, Word} from '../script';

export type ShortKind = 'hook' | 'layer' | 'turn' | 'breath' | 'payoff' | 'close';
export type ShortScene = {
  id: string;
  kind: ShortKind;
  targetStart: number;
  mode: 'light' | 'dark';
  depth: number;
  label: string;
  title: string;
  narration: string;
  beats: Beat[];
  sources?: string[];
};
export type TimedShortScene = ShortScene & {from: number; durationInFrames: number; audioFrames: number; audioSrc: string; words: Word[]};

export const SHORT = {
  id: scriptJson.id,
  title: scriptJson.title,
  fps: scriptJson.fps,
  width: scriptJson.width,
  height: scriptJson.height,
  music: scriptJson.music,
  frame1Text: scriptJson.frame1Text,
  voiceId: scriptJson.voice,
};
const FPS = SHORT.fps;
/** Aire mínimo entre el fin de la voz y el siguiente corte. */
const GAP = 8;
/** Duración del outro de marca (1.5 s). */
export const OUTRO_FRAMES = 45;

export const beatFramesList: number[] = (beatsJson.beats as number[]).map((s) => Math.round(s * FPS));
export const downbeatFrames: number[] = (beatsJson.downbeats as number[]).map((s) => Math.round(s * FPS));

/** Siguiente beat ≥ frame (si está a ≤ 8 frames); si no, el frame tal cual. Los cortes caen en el pulso. */
export const snapToBeat = (frame: number, minFrame: number) => {
  const candidates = beatFramesList.filter((b) => b >= minFrame && Math.abs(b - frame) <= 8);
  if (!candidates.length) return Math.max(frame, minFrame);
  return candidates.reduce((best, b) => (Math.abs(b - frame) < Math.abs(best - frame) ? b : best));
};

export const buildShortTimeline = (): {scenes: TimedShortScene[]; totalFrames: number; outroFrom: number} => {
  const out: TimedShortScene[] = [];
  let prevEnd = 0;
  const raw = scriptJson.scenes as ShortScene[];
  for (const sc of raw) {
    const n = (narration as Record<string, {src: string; durationInSeconds: number}>)[sc.id];
    if (!n) throw new Error(`Falta narración de ${sc.id}: npm run tts -- script/ai-iceberg.json`);
    const audioFrames = Math.ceil(n.durationInSeconds * FPS);
    const target = Math.round(sc.targetStart * FPS);
    const from = out.length === 0 ? 0 : snapToBeat(Math.max(prevEnd, target), prevEnd);
    out.push({...sc, from, audioFrames, audioSrc: n.src, words: (wordsJson as Record<string, Word[]>)[sc.id] ?? [], durationInFrames: 0});
    prevEnd = from + audioFrames + GAP;
  }
  for (let i = 0; i < out.length; i++) {
    const next = i + 1 < out.length ? out[i + 1].from : prevEnd;
    out[i].durationInFrames = next - out[i].from;
  }
  const outroFrom = prevEnd;
  return {scenes: out, totalFrames: outroFrom + OUTRO_FRAMES, outroFrom};
};

/** ¿Hay voz cerca del frame global? (para ducking de la música) */
export const makeSpeakingFn = (scenes: TimedShortScene[]) => {
  const spans: [number, number][] = [];
  for (const s of scenes) for (const w of s.words) spans.push([s.from + w.start * FPS - 6, s.from + w.end * FPS + 8]);
  return (frame: number) => spans.some(([a, b]) => frame >= a && frame <= b);
};
