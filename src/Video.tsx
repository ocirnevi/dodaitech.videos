import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {buildTimeline, MUSIC, TimedScene} from './script';
import {brand, theme} from './theme';
import {Sfx} from './components/Sfx';
import {Intro} from './scenes/Intro';
import {Asml} from './scenes/Asml';
import {Tsmc} from './scenes/Tsmc';
import {Nvidia} from './scenes/Nvidia';
import {Outro} from './scenes/Outro';

const SceneSwitch: React.FC<{scene: TimedScene}> = ({scene}) => {
  switch (scene.kind) {
    case 'intro':
      return <Intro scene={scene} />;
    case 'asml':
      return <Asml scene={scene} />;
    case 'tsmc':
      return <Tsmc scene={scene} />;
    case 'nvidia':
      return <Nvidia scene={scene} />;
    case 'outro':
      return <Outro scene={scene} />;
  }
};

/** Flash de corte: sube en 4 frames hasta el corte, cae en 6. Riser antes, bajo en el corte. */
const CUT_PRE = 3;
const CUT_POST = 5;
const Flash: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, CUT_PRE, CUT_PRE + CUT_POST], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o * 0.6, background: `radial-gradient(ellipse at 60% 50%, #ffffff 0%, ${accent}cc 45%, ${accent}55 100%)`}} />
  );
};

const Music: React.FC<{total: number}> = ({total}) => {
  const {fps} = useVideoConfig();
  return (
    <Audio
      src={staticFile(MUSIC)}
      volume={(f) => interpolate(f, [0, fps, total - 2 * fps, total], [0, 0.11, 0.11, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
  );
};

export const ChipSupplyChain: React.FC = () => {
  const {scenes, totalFrames} = buildTimeline();
  return (
    <AbsoluteFill style={{backgroundColor: brand.soot, fontFamily: theme.font}}>
      <Music total={totalFrames} />
      {scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} name={scene.id}>
          <Audio src={staticFile(scene.audioSrc)} />
          <SceneSwitch scene={scene} />
        </Sequence>
      ))}
      {/* cortes entre escenas: riser → flash → bajo */}
      {scenes.slice(1).map((scene) => (
        <Sequence key={`cut-${scene.id}`} from={scene.from - CUT_PRE} durationInFrames={CUT_PRE + CUT_POST + 30} name={`cut:${scene.id}`}>
          <Flash accent={brand.accent} />
          <Sfx name="whoosh" at={0} lead={0} volume={0.7} />
          <Sfx name="bass" at={CUT_PRE} lead={0} volume={0.8} />
        </Sequence>
      ))}
      {scenes.slice(1).map((scene) => (
        <Sequence key={`riser-${scene.id}`} from={scene.from - 18} durationInFrames={20} name={`riser:${scene.id}`}>
          <Audio src={staticFile('sfx/riser.wav')} volume={0.45} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
