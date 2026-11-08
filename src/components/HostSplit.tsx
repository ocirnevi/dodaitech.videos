import {OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {type Mode, theme, useBrand, usePalette} from '../theme';

/**
 * Host "mitad y mitad" (formato reel): gráficos en la mitad superior y el clip del avatar (HeyGen, MP4 con su propio fondo)
 * en la mitad inferior, con un corte duro en y = split. Solo en hook y cierre (docs/06). El clip llega en 9:16 (1080×1920) con
 * encuadre de medio cuerpo; `focusY` (0–1) elige qué franja vertical del clip se ve (≈0.32 deja cara y hombros).
 * Entra deslizando desde abajo (2 propiedades) y sale rápido; lleva etiqueta "AI avatar".
 */
export const HostSplit: React.FC<{src: string; mode: Mode; split?: number; focusY?: number; durationInFrames: number; enterLead?: number; label?: string}> = ({src, mode, split = 960, focusY = 0.32, durationInFrames, enterLead = 0, label = 'AI avatar'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = useBrand();
  const p = usePalette(mode);
  const s = spring({frame: frame + enterLead, fps, config: theme.spring.snappy, durationInFrames: 16});
  const out = interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const h = 1920 - split;
  return (
    <div style={{position: 'absolute', left: 0, top: split, width: 1080, height: h, overflow: 'hidden', opacity: out, transform: `translateY(${interpolate(s, [0, 1], [h * 0.35, 0])}px)`, background: p.bg}}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: 1080, height: 1920, position: 'absolute', left: 0, top: -focusY * (1920 - h), objectFit: 'cover'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: brand.accent, opacity: 0.9}} />
      <div style={{position: 'absolute', left: 28, top: 28, ...theme.label, fontSize: 22, color: brand.onSoot, background: 'rgba(21,19,17,0.55)', borderRadius: 999, padding: '6px 14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(6px)'}}>
        <span style={{width: 8, height: 8, borderRadius: 999, background: brand.accent, display: 'inline-block'}} />
        {label}
      </div>
    </div>
  );
};
