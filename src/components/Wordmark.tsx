import {Img, staticFile} from 'remotion';
import {Mode, palette, theme} from '../theme';

/** Marca pequeña, como el Wordmark del sitio: logo + "dodaitech". */
export const Wordmark: React.FC<{mode: Mode; opacity?: number; size?: number; style?: React.CSSProperties}> = ({mode, opacity = 0.75, size = 30, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.4, opacity, ...style}}>
    <Img src={staticFile('brand/logo.png')} style={{width: size, height: size}} />
    <span style={{fontSize: size * 0.8, fontWeight: 600, letterSpacing: '-0.02em', color: palette(mode).text, fontFamily: theme.font}}>dodaitech</span>
  </div>
);
