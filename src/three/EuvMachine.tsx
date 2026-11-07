import {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';

/**
 * Representación esquemática de un escáner EUV: fuente de luz, cadena de espejos
 * en zigzag y la oblea abajo. El pulso de luz recorre la cadena en bucle.
 */
const PATH: [number, number, number][] = [
  [-4.2, 3.2, 0],
  [-2.4, 1.1, 0.6],
  [-0.6, 3.0, -0.4],
  [1.2, 1.0, 0.5],
  [3.0, 2.9, -0.3],
  [2.2, -0.2, 0.2],
  [0.4, 1.6, -0.5],
  [0.4, -1.3, 0],
];

const Segment: React.FC<{a: THREE.Vector3; b: THREE.Vector3; t: number; color: string}> = ({a, b, t, color}) => {
  if (t <= 0) return null;
  const end = a.clone().lerp(b, Math.min(1, t));
  const dir = end.clone().sub(a);
  const len = dir.length();
  if (len < 0.001) return null;
  const mid = a.clone().add(end).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.045, 0.045, len, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} toneMapped={false} />
    </mesh>
  );
};

export const EuvMachine: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const points = useMemo(() => PATH.map((p) => new THREE.Vector3(...p)), []);
  const segs = points.length - 1;
  // El pulso recorre toda la cadena en 100 frames y reinicia.
  const loop = (frame % 100) / 100;
  const progress = interpolate(loop, [0, 0.8], [0, segs], {extrapolateRight: 'clamp'});
  const hit = progress >= segs - 0.05 ? 1 : 0;
  const rotY = frame * 0.004 - 0.3;

  return (
    <group rotation={[0.15, rotY, 0]} position={[0, -0.6, 0]}>
      {/* fuente */}
      <mesh position={points[0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <pointLight position={points[0]} intensity={6} color={accent} distance={6} />
      <pointLight position={[0, 4, 4]} intensity={14} color="#ffffff" distance={14} />

      {/* espejos: discos orientados hacia la bisectriz de entrada/salida */}
      {points.slice(1, -1).map((p, i) => {
        const prev = points[i];
        const next = points[i + 2];
        const inDir = p.clone().sub(prev).normalize();
        const outDir = next.clone().sub(p).normalize();
        const normal = outDir.clone().sub(inDir).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        return (
          <group key={i} position={p} quaternion={quat}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 40]} />
              <meshStandardMaterial color="#e7e7e1" metalness={0.6} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.62, 0.62, 0.12, 40]} />
              <meshStandardMaterial color="#2a2622" metalness={0.5} roughness={0.55} />
            </mesh>
          </group>
        );
      })}

      {/* haz */}
      {points.slice(0, -1).map((a, i) => (
        <Segment key={i} a={a} b={points[i + 1]} t={progress - i} color={accent} />
      ))}

      {/* oblea */}
      <group position={[0.4, -1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[1.7, 1.7, 0.06, 64]} />
          <meshStandardMaterial color="#4a4642" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={hit ? 4 : 0.4}
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};
