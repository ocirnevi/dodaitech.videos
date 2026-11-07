import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, theme} from '../theme';

/**
 * v3: el iceberg completo siempre a la vista. Silueta clásica (hielo blanco), seis cortes horizontales bajo el agua,
 * la capa activa se enciende en naranja y la marca de la capa aparece como etiqueta grande. Cámara quieta.
 * Coordenadas en px del lienzo 1080×1920. Línea de agua en WATER_Y.
 */
export const WATER_Y = 820;
const BOTTOM_Y = 1780;
const CX = 620;
const SCALE_X = 0.74;
const LAYER_H = (BOTTOM_Y - WATER_Y) / 6; // ≈176
// perfil del iceberg: medio-ancho en función de la profundidad (0 = agua, 1 = fondo)
const halfAt = (t: number) => {
  const pts: [number, number][] = [[0, 230 * SCALE_X], [0.12, 330 * SCALE_X], [0.3, 400 * SCALE_X], [0.5, 410 * SCALE_X], [0.7, 340 * SCALE_X], [0.88, 220 * SCALE_X], [1, 60 * SCALE_X]];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, h0] = pts[i - 1];
      const [t1, h1] = pts[i];
      return h0 + ((t - t0) / (t1 - t0)) * (h1 - h0);
    }
  }
  return 60 * SCALE_X;
};
const jag = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 18; // irregularidad determinista
export const layerY = (layer: number) => WATER_Y + (layer - 0.5) * LAYER_H;

const slicePoints = (i: number) => {
  // polígono del corte i (0..5) con bordes laterales ligeramente irregulares
  const t0 = i / 6;
  const t1 = (i + 1) / 6;
  const y0 = WATER_Y + i * LAYER_H;
  const y1 = y0 + LAYER_H;
  const hl0 = halfAt(t0) + jag(i * 2);
  const hr0 = halfAt(t0) + jag(i * 2 + 1);
  const hl1 = halfAt(t1) + jag(i * 2 + 2);
  const hr1 = halfAt(t1) + jag(i * 2 + 3);
  const cx = CX;
  return {left: [[cx - hl0, y0], [cx, y0], [cx, y1], [cx - hl1, y1]] as [number, number][], right: [[cx, y0], [cx + hr0, y0], [cx + hr1, y1], [cx, y1]] as [number, number][], all: [[cx - hl0, y0], [cx + hr0, y0], [cx + hr1, y1], [cx - hl1, y1]] as [number, number][]};
};
const P = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ');

export const IcebergV3: React.FC<{
  activeLayer: number; // 0 = ninguna (hook), 1..6
  reveal: number; // 0 = solo se ve la punta (agua opaca), 1 = cuerpo visible
  pulse?: number;
  light: boolean;
  labels?: boolean; // números 01..06 en los cortes
}> = ({activeLayer, reveal, pulse = 0, light, labels = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cx = CX;
  const tipH = 250;
  const tipHalf = 230 * SCALE_X;
  // punta: tres facetas
  const tipL: [number, number][] = [[cx - tipHalf, WATER_Y], [cx - 30, WATER_Y - tipH], [cx + 10, WATER_Y]];
  const tipR: [number, number][] = [[cx - 30, WATER_Y - tipH], [cx + tipHalf, WATER_Y], [cx + 10, WATER_Y]];
  const tipShade: [number, number][] = [[cx - 30, WATER_Y - tipH], [cx + 120, WATER_Y - tipH * 0.45], [cx + tipHalf, WATER_Y], [cx + 10, WATER_Y]];
  const waterVeil = interpolate(reveal, [0, 1], [0.97, 0.62]);
  const wave = Math.sin(frame * 0.07) * 2;
  const iceL = light ? '#ffffff' : '#e9e9e4';
  const iceR = light ? '#d9d9d3' : '#c7c7c0';
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={brand.accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={brand.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* cuerpo de hielo bajo el agua */}
        {Array.from({length: 6}).map((_, i) => {
          const s = slicePoints(i);
          const n = i + 1;
          const state = n === activeLayer ? 'active' : n < activeLayer ? 'seen' : 'idle';
          const fillL = state === 'active' ? '#ff7a3d' : state === 'seen' ? '#f3c9b5' : iceL;
          const fillR = state === 'active' ? brand.accent : state === 'seen' ? '#e2ad92' : iceR;
          const pop = spring({frame: frame - (reveal >= 1 ? 0 : 0), fps, config: theme.spring.snappy});
          void pop;
          return (
            <g key={i}>
              {state === 'active' ? <ellipse cx={cx} cy={layerY(n)} rx={halfAt((i + 0.5) / 6) + 160} ry={LAYER_H * 0.9} fill="url(#glow)" opacity={0.6 + 0.4 * pulse} /> : null}
              <polygon points={P(s.left)} fill={fillL} />
              <polygon points={P(s.right)} fill={fillR} />
              <line x1={s.all[0][0]} y1={s.all[0][1]} x2={s.all[1][0]} y2={s.all[1][1]} stroke={brand.soot} strokeOpacity={0.35} strokeWidth={3} />
            </g>
          );
        })}
        {/* agua: velo oscuro sobre el cuerpo (se aclara al revelar) */}
        <rect x={0} y={WATER_Y + wave} width={1080} height={1920 - WATER_Y} fill={brand.soot} opacity={waterVeil} />
        {/* la capa activa vuelve a dibujarse por encima del velo para que arda en naranja */}
        {activeLayer >= 1 && activeLayer <= 6 ? (() => {
          const s = slicePoints(activeLayer - 1);
          return (
            <g>
              <polygon points={P(s.left)} fill="#ff7a3d" />
              <polygon points={P(s.right)} fill={brand.accent} />
            </g>
          );
        })() : null}
        {/* números de capa */}
        {labels && reveal > 0.5
          ? Array.from({length: 6}).map((_, i) => {
              const n = i + 1;
              const x = cx + halfAt((i + 0.5) / 6) + 46;
              const active = n === activeLayer;
              const a = interpolate(reveal, [0.5, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <text key={i} x={x} y={layerY(n) + 12} fontFamily={theme.font} fontWeight={600} fontSize={30} fill={active ? brand.accent : 'rgba(241,241,237,0.45)'} opacity={a} style={{letterSpacing: '0.04em'}}>
                  {String(n).padStart(2, '0')}
                </text>
              );
            })
          : null}
        {/* línea de flotación */}
        <rect x={0} y={WATER_Y - 2 + wave} width={1080} height={4} fill={brand.accent} opacity={0.95} />
        {/* punta */}
        <polygon points={P(tipL)} fill="#ffffff" />
        <polygon points={P(tipR)} fill="#e4e4de" />
        <polygon points={P(tipShade)} fill="#d2d2cb" opacity={0.8} />
      </svg>
    </AbsoluteFill>
  );
};

/** Etiqueta(s) de marca de la capa activa, grandes y centradas sobre la capa. */
export const BrandTags: React.FC<{names: string[]; layer: number; from: number}> = ({names, layer, from}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const y = layerY(layer);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - 40, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', padding: '0 60px'}}>
      {names.map((n, i) => {
        const s = spring({frame: frame - from - 8 - i * 6, fps, config: theme.spring.snappy, durationInFrames: 16});
        return (
          <div
            key={n}
            style={{
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [18, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
              padding: '14px 30px',
              borderRadius: 999,
              background: brand.soot,
              color: '#ffffff',
              fontFamily: theme.font,
              fontWeight: 700,
              fontSize: 46,
              letterSpacing: '-0.02em',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

/** Opacidad del "reveal" del cuerpo: 0 hasta la palabra "Six", 1 después (con easing). */
export const revealAt = (frame: number, sixAt: number) => interpolate(frame, [sixAt - 4, sixAt + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
