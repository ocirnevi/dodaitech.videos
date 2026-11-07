import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const LAYERS = 12;

/** Oblea con matriz de dies y, encima, una pila de capas que se va construyendo. */
export const Wafer: React.FC<{accent: string; layersFrom: number; layersTo: number}> = ({accent, layersFrom, layersTo}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rotY = frame * 0.005;
  const dies: [number, number][] = [];
  const step = 0.42;
  for (let x = -2.4; x <= 2.4; x += step) {
    for (let z = -2.4; z <= 2.4; z += step) {
      if (Math.hypot(x, z) < 2.25) dies.push([x, z]);
    }
  }
  const start = layersFrom;
  const per = Math.max(2, (layersTo - layersFrom) / LAYERS);

  return (
    <group rotation={[0.12, rotY, 0]} position={[0, -1.1, 0]}>
      <mesh>
        <cylinderGeometry args={[2.5, 2.5, 0.08, 96]} />
        <meshStandardMaterial color="#4a4642" metalness={0.9} roughness={0.25} />
      </mesh>
      {dies.map(([x, z], i) => {
        const glow = interpolate(frame, [i * 0.4, i * 0.4 + 20], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
        return (
          <mesh key={i} position={[x, 0.06, z]}>
            <boxGeometry args={[0.34, 0.03, 0.34]} />
            <meshStandardMaterial color="#201d1a" emissive={accent} emissiveIntensity={glow * 0.45} metalness={0.4} roughness={0.6} />
          </mesh>
        );
      })}
      {/* pila de capas sobre la oblea */}
      <group position={[0, 0.9, 0]}>
        {Array.from({length: LAYERS}).map((_, i) => {
          const s = spring({frame: frame - (start + i * per), fps, config: {damping: 16, stiffness: 140}});
          const y = i * 0.13 + interpolate(s, [0, 1], [1.2, 0]);
          const even = i % 2 === 0;
          return (
            <mesh key={i} position={[0, y, 0]} scale={[s, 1, s]}>
              <boxGeometry args={[1.6, 0.07, 1.6]} />
              <meshStandardMaterial
                color={even ? '#2a2622' : accent}
                emissive={even ? '#000000' : accent}
                emissiveIntensity={even ? 0 : 0.5}
                metalness={0.5}
                roughness={0.4}
                transparent
                opacity={0.95}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

