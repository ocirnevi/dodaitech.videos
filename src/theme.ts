import {loadFont} from '@remotion/fonts';
import {Easing, staticFile} from 'remotion';

// Bricolage Grotesque (variable: opsz, wdth, wght), la misma fuente del sitio dodaitech.
loadFont({family: 'Bricolage Grotesque', url: staticFile('fonts/BricolageGrotesque.ttf'), weight: '200 800'});

export type Mode = 'light' | 'dark';

/** Tokens de marca dodaitech (src/index.css del sitio): papel piedra, tinta cálida, un acento naranja, banda soot. */
export const brand = {
  canvas: '#f1f1ed',
  canvas2: '#e7e7e1',
  paper: '#fbfbf9',
  ink: '#1b1917',
  ink2: '#4a4642',
  ink3: '#75706a',
  line: 'rgba(27,25,23,0.10)',
  lineStrong: 'rgba(27,25,23,0.20)',
  accent: '#fb5618',
  accentDeep: '#c93a0b',
  accentHover: '#e8470f',
  accentSoft: '#fde6dc',
  accentLight: '#fb8a3c',
  soot: '#151311',
  soot2: '#201d1a',
  soot3: '#2a2622',
  onSoot: '#f1f1ed',
  onSoot2: 'rgba(241,241,237,0.70)',
  onSoot3: 'rgba(241,241,237,0.50)',
  lineSoot: 'rgba(241,241,237,0.12)',
} as const;

/** Colores según el modo de la escena. */
export const palette = (mode: Mode) =>
  mode === 'light'
    ? {bg: brand.canvas, bg2: brand.canvas2, surface: brand.paper, text: brand.ink, text2: brand.ink2, text3: brand.ink3, line: brand.line, lineStrong: brand.lineStrong}
    : {bg: brand.soot, bg2: brand.soot2, surface: brand.soot3, text: brand.onSoot, text2: brand.onSoot2, text3: brand.onSoot3, line: brand.lineSoot, lineStrong: 'rgba(241,241,237,0.22)'};

export const theme = {
  font: '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif',
  /** titulares: como la utilidad .display del sitio */
  display: {fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 0.98, fontVariationSettings: '"wdth" 100, "opsz" 96'} as React.CSSProperties,
  /** etiquetas técnicas: eje de anchura estrecho, sin mayúsculas forzadas */
  label: {fontWeight: 500, letterSpacing: '0.04em', fontVariationSettings: '"wdth" 80, "opsz" 12'} as React.CSSProperties,
  ease: {
    out: Easing.out(Easing.cubic),
    outQuint: Easing.bezier(0.16, 1, 0.3, 1),
    snap: Easing.bezier(0.4, 0, 0.2, 1),
    inOut: Easing.inOut(Easing.cubic),
  },
  spring: {
    snappy: {damping: 18, stiffness: 160, mass: 0.8},
    soft: {damping: 22, stiffness: 90},
    settle: {damping: 18, stiffness: 60, mass: 1.2}, // el logo que se asienta (Hero.tsx)
    counter: {damping: 30, stiffness: 60},
  },
} as const;
