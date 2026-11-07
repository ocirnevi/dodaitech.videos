import {Img, staticFile} from 'remotion';

/**
 * El logo de dodaitech en tres capas (brand/layer-1..3.png), como LayerStack.tsx del sitio.
 * spread por capa: 0 = apilado como el logo, 1 = vista explotada. dir: arriba -1, medio 0, abajo +1.
 */
const LAYERS = [
  {src: 'brand/layer-1.png', dir: -1},
  {src: 'brand/layer-2.png', dir: 0},
  {src: 'brand/layer-3.png', dir: 1},
] as const;

export const LayerStack: React.FC<{
  size: number;
  spreads: [number, number, number];
  opacities?: [number, number, number];
  filters?: [string, string, string];
  travel?: number;
  style?: React.CSSProperties;
}> = ({size, spreads, opacities = [1, 1, 1], filters = ['', '', ''], travel = 0.26, style}) => (
  <div style={{position: 'relative', width: size, height: size, ...style}}>
    {LAYERS.map((l, i) => (
      <Img
        key={l.src}
        src={staticFile(l.src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 3 - i,
          opacity: opacities[i],
          transform: `translateY(${l.dir * spreads[i] * travel * 100}%)`,
          filter: `drop-shadow(0 28px 36px rgba(27,25,23,0.28)) ${filters[i]}`,
        }}
      />
    ))}
  </div>
);

/** Centro vertical (px, relativo a la caja) de cada capa para alinear etiquetas. */
export const layerCenterY = (size: number, i: number, spread: number, travel = 0.26) => size * 0.5 + [-1, 0, 1][i] * spread * travel * size + [-0.17, 0, 0.17][i] * size;
