import {OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, type Mode, palette, theme} from '../theme';

/**
 * Host breve con avatar (HeyGen, WebM con alfa), según docs/06: solo hook 1–3 s y cierre, nunca a pantalla completa
 * ni PiP permanente, siempre con la etiqueta "AI avatar".
 * El clip llega en 9:16 (1080×1920) con la persona recortada entre `personTop` y `personBottom` (la foto original
 * termina en una línea recta a la altura de los hombros), así que se presenta dentro de una tarjeta redondeada cuyo
 * borde inferior coincide con ese corte. Entra con spring (2 propiedades) y sale rápido.
 */
export const AvatarHost: React.FC<{src: string; mode: Mode; scale?: number; top?: number; durationInFrames: number; label?: string; personTop?: number; personBottom?: number; enterLead?: number}> = ({src, mode, scale = 0.46, top = 600, durationInFrames, label = 'AI avatar', personTop = 440, personBottom = 1511, enterLead = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = palette(mode);
  // enterLead > 0 adelanta la entrada: en el hook el host ya se ve en el frame 1 (regla del hook triple)
  const s = spring({frame: frame + enterLead, fps, config: theme.spring.soft, durationInFrames: 18});
  const out = interpolate(frame, [durationInFrames - 6, durationInFrames - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pad = 36;
  const vw = 1080 * scale;
  const vh = 1920 * scale;
  const cardW = vw;
  const cardH = pad + (personBottom - personTop) * scale;
  const videoTop = pad - personTop * scale;
  return (
    <div style={{position: 'absolute', left: (1080 - cardW) / 2, top, width: cardW, height: cardH, opacity: s * out, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.96, 1])})`, transformOrigin: '50% 100%'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 44, overflow: 'hidden', background: p.surface, border: `3px solid ${p.lineStrong}`, boxShadow: mode === 'light' ? '0 30px 80px rgba(27,25,23,0.14)' : '0 30px 80px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(60% 50% at 50% 35%, ${brand.accent}22 0%, transparent 70%)`}} />
        <OffthreadVideo src={staticFile(src)} transparent muted style={{position: 'absolute', left: 0, top: videoTop, width: vw, height: vh}} />
      </div>
      <div style={{position: 'absolute', left: 22, bottom: 22, ...theme.label, fontSize: 22, color: p.text2, background: mode === 'light' ? 'rgba(251,251,249,0.9)' : 'rgba(21,19,17,0.75)', border: `1px solid ${p.lineStrong}`, borderRadius: 999, padding: '6px 14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8}}>
        <span style={{width: 8, height: 8, borderRadius: 999, background: brand.accent, display: 'inline-block'}} />
        {label}
      </div>
    </div>
  );
};
