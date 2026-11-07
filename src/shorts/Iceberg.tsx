import {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {brand} from '../theme';

/** Geometría del iceberg low-poly: 1 punta sobre el agua + 6 capas bajo el agua (frustums de 7 lados). */
export const LAYER_H = 2.4;
const RADII = [
  [0.25, 1.5], // punta (arriba del agua): radio superior, inferior
  [1.5, 2.5],
  [2.5, 3.1],
  [3.1, 3.3],
  [3.3, 2.9],
  [2.9, 2.1],
  [2.1, 0.9],
];
export const layerCenterY = (layer: number) => (layer === 0 ? LAYER_H * 0.45 : -(layer - 0.5) * LAYER_H);

// pseudo-aleatorio determinista para las irregularidades
const rnd = (i: number) => ((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;

export const CameraRig: React.FC<{y: number; z: number; lookY: number; x?: number}> = ({y, z, lookY, x = 0}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(x, y, z);
  camera.lookAt(0, lookY, 0);
  return null;
};

export const Iceberg: React.FC<{activeLayer: number; visited: number; pulse?: number}> = ({activeLayer, visited, pulse = 0}) => {
  const frame = useCurrentFrame();
  const geos = useMemo(
    () =>
      RADII.map(([rt, rb], i) => {
        const g = new THREE.CylinderGeometry(rt, rb, i === 0 ? LAYER_H * 0.9 : LAYER_H * 0.96, 7, 1);
        // desplaza vértices para romper la regularidad (determinista)
        const pos = g.attributes.position as THREE.BufferAttribute;
        for (let k = 0; k < pos.count; k++) {
          const s = 1 + (rnd(i * 97 + k) - 0.5) * 0.16;
          pos.setX(k, pos.getX(k) * s);
          pos.setZ(k, pos.getZ(k) * (1 + (rnd(i * 31 + k + 7) - 0.5) * 0.16));
        }
        g.computeVertexNormals();
        return g;
      }),
    [],
  );
  const breathe = 1 + 0.004 * Math.sin(frame * 0.07);
  return (
    <group rotation={[0, frame * 0.0025, 0]} scale={breathe}>
      {geos.map((g, i) => {
        const isTip = i === 0;
        const active = i === activeLayer;
        const seen = i < activeLayer && i > 0;
        const color = isTip ? '#ffffff' : active ? brand.accent : seen ? '#4a2a1c' : brand.soot3;
        const emissive = active ? brand.accent : seen ? brand.accentDeep : '#000000';
        const glow = active ? 0.55 + 0.45 * pulse : seen ? 0.12 : 0;
        return (
          <mesh key={i} geometry={g} position={[0, layerCenterY(i), 0]} rotation={[0, i * 0.37, 0]}>
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={glow} flatShading metalness={isTip ? 0 : 0.2} roughness={isTip ? 0.95 : 0.85} />
          </mesh>
        );
      })}
      {/* luz de la capa activa */}
      {activeLayer > 0 ? <pointLight position={[0, layerCenterY(activeLayer), 3.2]} intensity={14 + 10 * pulse} color={brand.accent} distance={9} /> : null}
    </group>
  );
};

/** Superficie del agua: desde arriba es un piso oscuro translúcido; desde abajo, un techo. */
export const Water: React.FC<{opacity?: number}> = ({opacity = 0.82}) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[60, 48]} />
      <meshStandardMaterial color={brand.soot2} transparent opacity={opacity} side={THREE.DoubleSide} roughness={0.2} metalness={0.4} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[1.45, 1.62, 48]} />
      <meshStandardMaterial color={brand.accent} emissive={brand.accent} emissiveIntensity={0.8} transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  </group>
);

/** Cámara: desciende capa por capa con easing al cambiar de escena y una deriva lenta constante. */
export const cameraFor = (depth: number, zoom: number) => {
  const focusY = depth === 0 ? layerCenterY(0) : layerCenterY(depth);
  const z = depth === 0 ? interpolate(zoom, [0, 1], [9, 19]) : 16;
  const y = depth === 0 ? interpolate(zoom, [0, 1], [focusY + 1.6, focusY + 0.9]) : focusY + 3.0;
  const lookY = depth === 0 ? interpolate(zoom, [0, 1], [focusY - 0.2, focusY - 4.2]) : focusY + 2.4;
  return {y, z, lookY};
};
