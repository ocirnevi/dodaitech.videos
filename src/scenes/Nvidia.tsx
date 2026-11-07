import {AbsoluteFill} from 'remotion';
import {TimedScene, triggerFrame} from '../script';
import {Background} from '../components/Background';
import {Captions} from '../components/Captions';
import {Chapter} from '../components/Chapter';
import {Beats, beatFrames} from '../components/Beats';
import {Post} from '../components/Post';
import {Wordmark} from '../components/Wordmark';
import {PunchIn} from '../components/PunchIn';
import {SceneIn} from '../components/SceneIn';
import {Scene3D} from '../three/Scene3D';
import {GpuDie} from '../three/GpuDie';

export const Nvidia: React.FC<{scene: TimedScene}> = ({scene}) => {
  // Los núcleos se encienden en onda desde "arquitectura" hasta "manda".
  const waveFrom = triggerFrame(scene, 'architecture');
  const waveTo = triggerFrame(scene, 'sends');
  return (
    <AbsoluteFill>
      <SceneIn>
        <Background mode={scene.mode} />
        <PunchIn beats={beatFrames(scene)}>
          <Scene3D camera={{position: [2.5, 4, 9], fov: 42}}>
            <group position={[2.9, 0.9, 0]} scale={0.78}>
              <GpuDie accent={scene.accent} waveFrom={waveFrom} waveTo={waveTo} />
            </group>
          </Scene3D>
          <Chapter label={scene.label} title={scene.title} subtitle={scene.subtitle} mode={scene.mode} />
          <Beats scene={scene} />
        </PunchIn>
        <Post mode={scene.mode} />
        <Wordmark mode={scene.mode} style={{position: 'absolute', right: 96, bottom: 96}} opacity={0.6} />
      </SceneIn>
      <Captions words={scene.words} mode={scene.mode} />
    </AbsoluteFill>
  );
};
