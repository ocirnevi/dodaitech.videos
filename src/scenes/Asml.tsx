import {AbsoluteFill} from 'remotion';
import {TimedScene} from '../script';
import {Background} from '../components/Background';
import {Captions} from '../components/Captions';
import {Chapter} from '../components/Chapter';
import {Beats, beatFrames} from '../components/Beats';
import {Post} from '../components/Post';
import {Wordmark} from '../components/Wordmark';
import {PunchIn} from '../components/PunchIn';
import {SceneIn} from '../components/SceneIn';
import {Scene3D} from '../three/Scene3D';
import {EuvMachine} from '../three/EuvMachine';

export const Asml: React.FC<{scene: TimedScene}> = ({scene}) => (
  <AbsoluteFill>
    <SceneIn>
      <Background mode={scene.mode} />
      <PunchIn beats={beatFrames(scene)}>
        <Scene3D camera={{position: [3.5, 2.2, 9.5], fov: 40}}>
          <group position={[3.4, 0.4, 0]} scale={0.82}>
            <EuvMachine accent={scene.accent} />
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
