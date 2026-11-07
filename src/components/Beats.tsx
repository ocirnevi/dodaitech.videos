import {Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, Word, triggerFrameIn} from '../script';

type BeatScene = {id: string; mode: 'light' | 'dark'; beats: Beat[]; words: Word[]; audioFrames: number};
export type BeatsLayout = {left?: number; top?: number; width?: number; numberSize?: number; calloutSize?: number; labelSize?: number};
import {brand, palette, theme} from '../theme';
import {Sfx} from './Sfx';

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

const BeatCard: React.FC<{beat: Beat; scene: BeatScene; durationInFrames: number; layout: Required<BeatsLayout>}> = ({beat, scene, durationInFrames, layout}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = palette(scene.mode);
  const enter = spring({frame, fps, config: theme.spring.snappy, durationInFrames: 14});
  const exit = interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: theme.ease.inOut});
  const opacity = enter * (1 - exit);
  const y = interpolate(enter, [0, 1], [34, 0]) - exit * 20;
  const scale = interpolate(enter, [0, 1], [0.94, 1]) * (1 + 0.005 * Math.sin(frame * 0.18));
  const box: React.CSSProperties = {position: 'absolute', left: layout.left, top: layout.top, width: layout.width, opacity, transform: `translateY(${y}px) scale(${scale})`, transformOrigin: 'left top'};

  if (beat.kind === 'counter') {
    const v = interpolate(spring({frame, fps, config: theme.spring.counter}), [0, 1], [0, beat.value]);
    return (
      <div style={box}>
        <div style={{...theme.display, fontSize: layout.numberSize, fontWeight: 700, color: brand.accent, fontVariantNumeric: 'tabular-nums', lineHeight: 0.92}}>
          {beat.prefix ?? ''}
          {fmt(v)}
          <span style={{fontSize: layout.numberSize * 0.45}}>{beat.suffix ?? ''}</span>
        </div>
        <div style={{fontSize: layout.labelSize, fontWeight: 500, color: p.text2, marginTop: 14}}>{beat.label}</div>
      </div>
    );
  }
  return (
    <div style={{...box, top: layout.top + 20, width: Math.min(layout.width, 720), padding: '20px 30px', borderRadius: 16, background: p.surface, borderLeft: `6px solid ${brand.accent}`, boxShadow: scene.mode === 'light' ? '0 12px 32px rgba(27,25,23,0.08)' : 'none'}}>
      <div style={{...theme.display, fontSize: layout.calloutSize, fontWeight: 600, color: p.text}}>{beat.text}</div>
    </div>
  );
};

export const beatFrames = (scene: BeatScene, fps = 30) => scene.beats.map((b) => triggerFrameIn(scene.words, b.trigger, fps, scene.id));
const DEFAULT_LAYOUT: Required<BeatsLayout> = {left: 96, top: 430, width: 780, numberSize: 176, calloutSize: 48, labelSize: 34};

/** Un beat a la vez: entra con la palabra, sale 8 frames después de que entra el siguiente. */
export const Beats: React.FC<{scene: BeatScene; layout?: BeatsLayout; endAt?: number}> = ({scene, layout, endAt}) => {
  const L = {...DEFAULT_LAYOUT, ...layout};
  const frames = beatFrames(scene);
  return (
    <>
      {scene.beats.map((beat, i) => {
        const from = frames[i];
        const next = frames[i + 1] ?? endAt ?? scene.audioFrames + 6;
        const dur = Math.max(20, next - from + 8);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`beat:${beat.trigger}`} layout="none">
            <BeatCard beat={beat} scene={scene} durationInFrames={dur} layout={L} />
            <Sfx name={beat.kind === 'counter' ? 'lib/pop' : 'lib/snap'} at={0} volume={0.5} lead={1} />
          </Sequence>
        );
      })}
    </>
  );
};
