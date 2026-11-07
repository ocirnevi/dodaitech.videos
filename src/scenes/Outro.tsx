import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TimedScene, triggerFrame} from '../script';
import {brand, palette, theme} from '../theme';
import {Background} from '../components/Background';
import {Captions} from '../components/Captions';
import {LayerStack} from '../components/LayerStack';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {SceneIn} from '../components/SceneIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';

// índice de capa del logo: 0 arriba (NVIDIA), 1 medio (TSMC), 2 abajo (ASML)
const LEVELS = [
  {layer: 2, label: 'ASML · machines', trigger: 'Dutch'},
  {layer: 1, label: 'TSMC · manufacturing', trigger: 'Taiwanese'},
  {layer: 0, label: 'NVIDIA · design', trigger: 'American'},
];
const SIZE = 620;

export const Outro: React.FC<{scene: TimedScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = palette(scene.mode);
  const ats = LEVELS.map((l) => triggerFrame(scene, l.trigger));
  const failAt = triggerFrame(scene, 'fails');
  const feelsAt = triggerFrame(scene, 'feels');
  const t = spring({frame, fps, config: theme.spring.snappy, durationInFrames: 16});

  // Cada capa llega (explotada → asentada) cuando se nombra su nivel.
  const settleOf = (i: number) => 1 - spring({frame: frame - ats[i], fps, config: theme.spring.settle});
  const spreads: [number, number, number] = [settleOf(2), settleOf(1), settleOf(0)];
  const opacities: [number, number, number] = [0, 1, 2].map((li) => {
    const idx = LEVELS.findIndex((l) => l.layer === li);
    return interpolate(frame, [ats[idx] - 2, ats[idx] + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }) as [number, number, number];
  // "if one fails": la base se apaga y todo tiembla; "feels it": vuelve.
  const fail = interpolate(frame, [failAt, failAt + 3, feelsAt + 10], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const shake = fail > 0 ? Math.sin(frame * 2.9) * 9 * fail : 0;
  const filters: [string, string, string] = ['', '', `grayscale(${fail}) brightness(${1 - 0.35 * fail})`];
  const endAt = scene.audioFrames - 10;
  const end = interpolate(frame, [endAt, endAt + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <SceneIn>
        <Background mode={scene.mode} />
        <PunchIn beats={[...ats, failAt]} origin="50% 50%">
          <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
            <div style={{position: 'absolute', left: 96, top: 150, width: 820}}>
              <div style={{...theme.display, fontSize: 112, color: p.text, opacity: t, transform: `translateY(${interpolate(t, [0, 1], [30, 0])}px)`}}>{scene.title}</div>
              <div style={{marginTop: 54, display: 'flex', flexDirection: 'column-reverse', gap: 22}}>
                {LEVELS.map((l, i) => {
                  const s = spring({frame: frame - ats[i], fps, config: theme.spring.snappy, durationInFrames: 14});
                  const dim = i === 0 ? fail : 0;
                  return (
                    <div key={l.label} style={{opacity: s * (1 - dim * 0.6), transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`, display: 'flex', alignItems: 'center', gap: 18, fontSize: 40, fontWeight: 600, color: p.text, letterSpacing: '-0.02em'}}>
                      <span style={{width: 16, height: 16, borderRadius: 4, background: dim > 0.5 ? p.text3 : brand.accent}} />
                      {l.label}
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop: 56, opacity: end, transform: `translateY(${interpolate(end, [0, 1], [10, 0])}px)`}}>
                <Wordmark mode={scene.mode} opacity={1} size={44} />
                <div style={{...theme.label, marginTop: 10, fontSize: 22, color: p.text3}}>dodaitech.com</div>
              </div>
            </div>
            <div style={{position: 'absolute', left: 1120, top: 200}}>
              <LayerStack size={SIZE} spreads={spreads} opacities={opacities} filters={filters} />
            </div>
          </AbsoluteFill>
        </PunchIn>
        <Post mode={scene.mode} />
      </SceneIn>
      <Captions words={scene.words} mode={scene.mode} />
      {ats.map((a) => (
        <Sfx key={a} name="pop" at={a} volume={0.5} />
      ))}
      <Sfx name="bass" at={failAt} volume={0.9} />
      <Sfx name="shimmer" at={endAt} lead={0} volume={0.4} />
    </AbsoluteFill>
  );
};
