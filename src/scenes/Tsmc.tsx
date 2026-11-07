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
import {Wafer} from '../three/Wafer';

export const Tsmc: React.FC<{scene: TimedScene}> = ({scene}) => {
  // Las capas se apilan desde "mil pasos" hasta "Al final".
  const layersFrom = triggerFrame(scene, 'thousand');
  const layersTo = triggerFrame(scene, 'end,');
  return (
    <AbsoluteFill>
      <SceneIn>
        <Background mode={scene.mode} />
        <PunchIn beats={beatFrames(scene)}>
          <Scene3D camera={{position: [3.2, 3.4, 8.5], fov: 42}}>
            <group position={[2.7, 0.5, 0]} scale={0.9}>
              <Wafer accent={scene.accent} layersFrom={layersFrom} layersTo={layersTo} />
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
