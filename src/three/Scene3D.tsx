import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';

/** Lienzo 3D estándar: mismas luces y cámara para todas las escenas. */
export const Scene3D: React.FC<{
  children: React.ReactNode;
  camera?: {position: [number, number, number]; fov?: number};
  style?: React.CSSProperties;
}> = ({children, camera = {position: [0, 2.5, 9], fov: 42}, style}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{position: 'absolute', inset: 0, ...style}}
      camera={{position: camera.position, fov: camera.fov ?? 42, near: 0.1, far: 100}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.7} color="#fff4ea" />
      {children}
    </ThreeCanvas>
  );
};
