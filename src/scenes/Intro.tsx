import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TimedScene, triggerFrame} from '../script';
import {brand, palette, theme} from '../theme';
import {Background} from '../components/Background';
import {Captions} from '../components/Captions';
import {LayerStack, layerCenterY} from '../components/LayerStack';
import {Post} from '../components/Post';
import {PunchIn} from '../components/PunchIn';
import {Sfx} from '../components/Sfx';
import {Wordmark} from '../components/Wordmark';

const LEVELS = [
  {n: '03', name: 'NVIDIA', where: 'United States'},
  {n: '02', name: 'TSMC', where: 'Taiwan'},
  {n: '01', name: 'ASML', where: 'Netherlands'},
];
const SIZE = 640;
const STACK_LEFT = 1000;
const STACK_TOP = 190;
const SPREAD = 0.75;

export const Intro: React.FC<{scene: TimedScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = palette(scene.mode);
  const chipAt = triggerFrame(scene, 'chip?');
  const threeAt = triggerFrame(scene, 'Three');
  const beats = LEVELS.map((_, i) => threeAt + i * 7);

  // Hero del sitio: las palabras suben desde abajo con stagger; el logo llega explotado y se asienta.
  const words = scene.title.split(' ');
  const settle = spring({frame: frame - 6, fps, config: theme.spring.settle});
  const explode = spring({frame: frame - threeAt, fps, config: theme.spring.soft, durationInFrames: 30});
  const spread = interpolate(settle, [0, 1], [1, 0]) + explode * SPREAD;
  const chipGlow = interpolate(frame, [chipAt, chipAt + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const breathe = 1 + 0.006 * Math.sin(frame * 0.1);

  return (
    <AbsoluteFill>
      <Background mode={scene.mode} />
      <PunchIn beats={[0, chipAt, ...beats]} amount={0.03} origin="50% 45%">
        {/* título a la izquierda */}
        <div style={{position: 'absolute', left: 96, top: 300, width: 900}}>
          <div style={{...theme.display, fontSize: 150, color: p.text, display: 'flex', flexWrap: 'wrap', columnGap: '0.22em'}}>
            {words.map((w, i) => {
              const s = spring({frame: frame - 2 - i * 2, fps, config: theme.spring.soft, durationInFrames: 24});
              const isChip = w.startsWith('chip');
              return (
                <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
                  <span
                    style={{
                      display: 'inline-block',
                      transform: `translateY(${interpolate(s, [0, 1], [105, 0])}%)`,
                      opacity: interpolate(s, [0, 1], [0.1, 1]),
                      color: isChip && chipGlow > 0 ? brand.accent : p.text,
                    }}
                  >
                    {w}
                  </span>
                </span>
              );
            })}
          </div>
          <div style={{marginTop: 28, fontSize: 36, color: p.text2, maxWidth: 760, opacity: interpolate(frame, [14, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            Three companies, three countries, one supply chain.
          </div>
        </div>

        {/* el logo en capas, a la derecha */}
        <div style={{position: 'absolute', left: STACK_LEFT, top: STACK_TOP, transform: `scale(${breathe})`}}>
          <LayerStack size={SIZE} spreads={[spread, spread, spread]} />
          {LEVELS.map((l, i) => {
            const s = spring({frame: frame - beats[i], fps, config: theme.spring.snappy, durationInFrames: 16});
            const y = layerCenterY(SIZE, i, explode * SPREAD) - 34;
            return (
              <div key={l.n} style={{position: 'absolute', left: SIZE - 40, top: y, display: 'flex', alignItems: 'center', gap: 16, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-24, 0])}px)`}}>
                <span style={{width: 56, height: 2, background: brand.accent, flexShrink: 0}} />
                <div style={{whiteSpace: 'nowrap'}}>
                  <div style={{...theme.label, fontSize: 20, color: brand.accentDeep}}>LEVEL {l.n}</div>
                  <div style={{...theme.display, fontSize: 44, color: p.text}}>{l.name}</div>
                  <div style={{fontSize: 22, color: p.text3}}>{l.where}</div>
                </div>
              </div>
            );
          })}
        </div>
      </PunchIn>
      <Wordmark mode={scene.mode} style={{position: 'absolute', left: 96, top: 88}} />
      <Post mode={scene.mode} />
      <Captions words={scene.words} mode={scene.mode} />
      <Sfx name="bass" at={0} lead={0} volume={0.8} />
      <Sfx name="shimmer" at={6} lead={0} volume={0.45} />
      <Sfx name="whoosh" at={threeAt} volume={0.6} />
      <Sfx name="tick" at={chipAt} volume={0.5} />
      {beats.map((b) => (
        <Sfx key={b} name="pop" at={b} volume={0.5} />
      ))}
    </AbsoluteFill>
  );
};
