import {interpolate, useCurrentFrame} from 'remotion';

const N = 12;

/** Die de GPU: matriz de núcleos que se enciende en onda, con stacks de memoria alrededor. */
export const GpuDie: React.FC<{accent: string; waveFrom: number; waveTo: number}> = ({accent, waveFrom, waveTo}) => {
  const frame = useCurrentFrame();
  const rotY = frame * 0.004 + 0.6;
  const waveStart = waveFrom;
  const waveLen = Math.max(10, waveTo - waveFrom);
  const cells: [number, number][] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) cells.push([i, j]);
  const pitch = 0.27;
  const off = ((N - 1) * pitch) / 2;

  return (
    <group rotation={[0.35, rotY, 0]} position={[0, -0.8, 0]}>
      {/* sustrato */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[6.2, 0.16, 6.2]} />
        <meshStandardMaterial color="#2a2622" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* die */}
      <mesh>
        <boxGeometry args={[3.5, 0.12, 3.5]} />
        <meshStandardMaterial color="#151311" metalness={0.7} roughness={0.3} />
      </mesh>
      {cells.map(([i, j]) => {
        const d = Math.hypot(i - (N - 1) / 2, j - (N - 1) / 2) / (N / 2);
        const t0 = waveStart + d * waveLen;
        const on = interpolate(frame, [t0, t0 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const flicker = 0.85 + 0.15 * Math.sin((frame + i * 7 + j * 13) * 0.25);
        return (
          <mesh key={`${i}-${j}`} position={[i * pitch - off, 0.09, j * pitch - off]}>
            <boxGeometry args={[0.2, 0.06, 0.2]} />
            <meshStandardMaterial
              color="#201d1a"
              emissive={accent}
              emissiveIntensity={on * 1.6 * flicker}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      {/* HBM */}
      {[-2.5, 2.5].flatMap((x) =>
        [-1.1, 1.1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.1, z]}>
            <boxGeometry args={[1.1, 0.32, 1.9]} />
            <meshStandardMaterial color="#201d1a" metalness={0.6} roughness={0.35} />
          </mesh>
        )),
      )}
      <pointLight position={[0, 1.5, 0]} intensity={interpolate(frame, [waveStart, waveStart + waveLen], [0, 10], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color={accent} distance={8} />
    </group>
  );
};
