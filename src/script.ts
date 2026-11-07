import scriptJson from '../script/chip-supply-chain.json';
import narration from './data/chip-supply-chain/narration.json';
import wordsJson from './data/chip-supply-chain/words.json';

export type SceneKind = 'intro' | 'asml' | 'tsmc' | 'nvidia' | 'outro';

export type Beat =
  | {trigger: string; kind: 'counter'; value: number; prefix?: string; suffix?: string; label: string}
  | {trigger: string; kind: 'callout'; text: string};

export type Scene = {
  id: string;
  kind: SceneKind;
  mode: 'light' | 'dark';
  label: string;
  accent: string;
  title: string;
  subtitle?: string;
  narration: string;
  beats: Beat[];
};

export type Word = {word: string; start: number; end: number};

export type TimedScene = Scene & {
  audioSrc: string;
  audioFrames: number;
  from: number;
  durationInFrames: number;
  words: Word[];
};

export const FPS = scriptJson.fps;
export const WIDTH = scriptJson.width;
export const HEIGHT = scriptJson.height;
export const MUSIC = scriptJson.music;

/** Aire después de que termina la voz, antes del corte. Corto: el ritmo manda. */
const TAIL_FRAMES = 14;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

/** Frame (relativo a la escena) en que se pronuncia la primera palabra que contiene `trigger`. */
export const triggerFrameIn = (words: Word[], trigger: string, fps: number, sceneId = '?'): number => {
  const t = normalize(trigger);
  const w = words.find((x) => normalize(x.word).includes(t));
  if (!w) {
    console.warn(`[script] trigger "${trigger}" no encontrado en escena ${sceneId}`);
    return 0;
  }
  return Math.round(w.start * fps);
};
export const triggerFrame = (scene: TimedScene, trigger: string): number => triggerFrameIn(scene.words, trigger, FPS, scene.id);

export const buildTimeline = (): {scenes: TimedScene[]; totalFrames: number} => {
  let cursor = 0;
  const scenes = (scriptJson.scenes as Scene[]).map((scene) => {
    const n = (narration as Record<string, {src: string; durationInSeconds: number}>)[scene.id];
    if (!n) throw new Error(`Falta narración para la escena "${scene.id}". Corre npm run tts.`);
    const words = (wordsJson as Record<string, Word[]>)[scene.id] ?? [];
    const audioFrames = Math.ceil(n.durationInSeconds * FPS);
    const durationInFrames = audioFrames + TAIL_FRAMES;
    const timed: TimedScene = {...scene, audioSrc: n.src, audioFrames, from: cursor, durationInFrames, words};
    cursor += durationInFrames;
    return timed;
  });
  return {scenes, totalFrames: cursor};
};

export const scriptMeta = {id: scriptJson.id, title: scriptJson.title};
