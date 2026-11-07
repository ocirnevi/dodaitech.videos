import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../theme';

/**
 * Iceberg plano (SVG), estilo "plano técnico" del sitio: punta de papel sobre el agua y seis estratos bajo el agua.
 * Coordenadas del mundo en px: el agua está en y = 0; cada estrato mide H px de alto. La "cámara" es un translateY.
 */
export const H = 300; // alto de cada estrato
const TIP_H = 330;
// medio-ancho de cada estrato en su borde superior e inferior (px), de arriba hacia abajo
const HALF: [number, number][] = [
  [200, 300],
  [300, 370],
  [370, 400],
  [400, 350],
  [350, 250],
  [250, 110],
];
export const stratumCenterY = (layer: number) => (layer === 0 ? -TIP_H * 0.45 : (layer - 0.5) * H);

const poly = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ');

/** Un estrato = banda con dos facetas (izquierda clara, derecha oscura) + arista superior. */
const Stratum: React.FC<{i: number; state: 'active' | 'seen' | 'idle'; pulse: number}> = ({i, state, pulse}) => {
  const [ht, hb] = HALF[i];
  const y0 = i * H;
  const y1 = y0 + H;
  const kink = 0.46 + 0.08 * ((i * 7) % 3) / 2; // dónde cae la arista vertical, varía por capa
  const xm0 = -ht + 2 * ht * kink;
  const xm1 = -hb + 2 * hb * (kink + 0.05);
  const base = state === 'active' ? brand.accent : state === 'seen' ? '#5a2a14' : brand.soot3;
  const light = state === 'active' ? '#ff7a3d' : state === 'seen' ? '#6d331a' : '#352e29';
  const dark = state === 'active' ? '#d9470f' : state === 'seen' ? '#4a2110' : '#231e1a';
  const glow = state === 'active' ? 0.35 + 0.4 * pulse : 0;
  return (
    <g>
      {glow > 0 ? <polygon points={poly([[-ht - 18, y0 - 6], [ht + 18, y0 - 6], [hb + 18, y1 + 6], [-hb - 18, y1 + 6]])} fill={brand.accent} opacity={glow * 0.25} /> : null}
      <polygon points={poly([[-ht, y0], [xm0, y0], [xm1, y1], [-hb, y1]])} fill={light} />
      <polygon points={poly([[xm0, y0], [ht, y0], [hb, y1], [xm1, y1]])} fill={dark} />
      <polygon points={poly([[-ht, y0], [ht, y0], [hb, y1], [-hb, y1]])} fill={base} opacity={0.0} />
      <line x1={-ht} y1={y0} x2={ht} y2={y0} stroke={state === 'idle' ? 'rgba(241,241,237,0.10)' : 'rgba(255,255,255,0.35)'} strokeWidth={3} />
    </g>
  );
};

export const IcebergFlat: React.FC<{activeLayer: number; pulse?: number; waterOpacity?: number}> = ({activeLayer, pulse = 0, waterOpacity = 0.55}) => {
  const frame = useCurrentFrame();
  const [t0] = HALF[0];
  // punta: dos facetas + brillo
  const tip: [number, number][] = [[0, -TIP_H], [t0, 0], [-t0, 0]];
  const tipKink: [number, number][] = [[0, -TIP_H], [t0, 0], [-t0 * 0.25, 0]];
  const wave = Math.sin(frame * 0.08) * 3;
  return (
    <g>
      {/* cuerpo bajo el agua */}
      {HALF.map((_, i) => (
        <Stratum key={i} i={i} state={i + 1 === activeLayer ? 'active' : i + 1 < activeLayer ? 'seen' : 'idle'} pulse={pulse} />
      ))}
      {/* agua: velo sobre el cuerpo, con línea de flotación */}
      <rect x={-3000} y={0} width={6000} height={H * 6 + 400} fill={brand.soot2} opacity={waterOpacity} />
      <rect x={-3000} y={wave} width={6000} height={4} fill={brand.accent} opacity={0.9} />
      <rect x={-3000} y={wave + 4} width={6000} height={26} fill={brand.accent} opacity={0.12} />
      {/* punta */}
      <polygon points={poly(tip)} fill="#ffffff" />
      <polygon points={poly(tipKink)} fill={brand.canvas2} />
      <polygon points={poly([[0, -TIP_H], [t0, 0], [t0 * 0.3, 0]])} fill="#dcdcd6" opacity={0.7} />
    </g>
  );
};

/** Iconos de línea por capa, dibujados con trazo que se completa (dash) al entrar. */
const Icon: React.FC<{kind: string; progress: number}> = ({kind, progress}) => {
  const stroke = brand.onSoot;
  const common = {fill: 'none', stroke, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeDasharray: 1200, strokeDashoffset: 1200 * (1 - progress)};
  switch (kind) {
    case 'l1': // burbuja de chat
      return <g {...common}><path d="M-90,-60 h180 a24,24 0 0 1 24,24 v70 a24,24 0 0 1 -24,24 h-100 l-50,40 v-40 h-30 a24,24 0 0 1 -24,-24 v-70 a24,24 0 0 1 24,-24 z" /><line x1={-50} y1={-20} x2={50} y2={-20} /><line x1={-50} y1={10} x2={20} y2={10} /></g>;
    case 'l2': // red de nodos
      return <g {...common}>{[[-90, -50], [0, -80], [90, -50], [-60, 50], [60, 50], [0, 0]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} />)}<path d="M-90,-50 L0,0 L90,-50 M0,-80 L0,0 M-60,50 L0,0 L60,50" /></g>;
    case 'l3': // racks
      return <g {...common}>{[-80, 0, 80].map((x) => <g key={x}><rect x={x - 32} y={-90} width={64} height={180} rx={8} /><line x1={x - 18} y1={-50} x2={x + 18} y2={-50} /><line x1={x - 18} y1={-10} x2={x + 18} y2={-10} /><line x1={x - 18} y1={30} x2={x + 18} y2={30} /></g>)}</g>;
    case 'l4': // chip con flecha bloqueada
      return <g {...common}><rect x={-120} y={-50} width={100} height={100} rx={10} /><path d="M-20,0 H70" /><path d="M50,-25 L80,0 L50,25" /><circle cx={110} cy={0} r={34} /><line x1={86} y1={-24} x2={134} y2={24} /></g>;
    case 'l5': // oblea
      return <g {...common}><circle cx={0} cy={0} r={100} /><path d="M-100,0 H100 M0,-100 V100 M-70,-70 L70,70 M-70,70 L70,-70" strokeOpacity={0.6} /><path d="M-60,-30 h40 v30 h-40 z M20,-30 h40 v30 h-40 z M-60,10 h40 v30 h-40 z M20,10 h40 v30 h-40 z" strokeWidth={5} /></g>;
    case 'l6': // haz EUV en zigzag + die
      return <g {...common}><path d="M-130,-90 L-70,-20 L-10,-90 L50,-20 L110,-90 L110,30" stroke={brand.accent} /><rect x={70} y={30} width={80} height={60} rx={6} /><path d="M86,46 h48 M86,62 h48 M86,78 h48" strokeWidth={4} /></g>;
    default:
      return null;
  }
};

/**
 * Lienzo 2D completo: iceberg + icono de la capa activa. `depth` continuo (0 punta … 6 fondo), `zoom` del hook (0→1).
 * El estrato activo se sitúa en focusScreenY; el resto se desplaza.
 */
export const IcebergScene2D: React.FC<{depth: number; zoom: number; activeLayer: number; pulse?: number; light: boolean; iconKind?: string; iconProgress?: number; focusScreenY?: number}> = ({depth, zoom, activeLayer, pulse = 0, light, iconKind, iconProgress = 1, focusScreenY = 1290}) => {
  const frame = useCurrentFrame();
  // escala: en el hook la punta está grande y se aleja; en las capas, escala 1
  const scale = depth < 0.5 ? interpolate(zoom, [0, 1], [1.9, 1.0], {easing: Easing.inOut(Easing.cubic)}) : 1;
  const focusWorldY = depth === 0 ? interpolate(zoom, [0, 1], [-TIP_H * 0.4, H * 1.6]) : (depth - 0.5) * H;
  const screenFocus = depth === 0 ? interpolate(zoom, [0, 1], [1180, 1250]) : focusScreenY;
  const breathe = 1 + 0.004 * Math.sin(frame * 0.07);
  const cx = 540;
  const iconY = (activeLayer - 0.5) * H;
  const half = activeLayer > 0 ? HALF[activeLayer - 1] : [200, 300];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${cx} ${screenFocus}) scale(${scale * breathe}) translate(0 ${-focusWorldY})`}>
          <IcebergFlat activeLayer={activeLayer} pulse={pulse} waterOpacity={light ? 0.55 : 0.88} />
          {iconKind && activeLayer > 0 ? (
            <g transform={`translate(${(half[0] + half[1]) / 2 + 190} ${iconY})`} opacity={iconProgress}>
              <Icon kind={iconKind} progress={iconProgress} />
            </g>
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Progreso de dibujo del icono: spring desde el inicio de la escena. */
export const useIconProgress = (sceneFrom: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - sceneFrom - 6, fps, config: {damping: 20, stiffness: 60}, durationInFrames: 30});
};
