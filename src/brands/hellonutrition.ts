import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import type {Brand} from '../theme';

// Fuente del sitio (Onest Variable, 100–900), servida desde public/fonts/onest (copiada de dev.hellonutrition.ai/assets, 8 nov 2026).
loadFont({family: 'Onest', url: staticFile('fonts/onest/onest-latin-wght-normal-Dun_Rd-l.woff2'), weight: '100 900'});
loadFont({family: 'Onest', url: staticFile('fonts/onest/onest-latin-ext-wght-normal-QAhDxQuo.woff2'), weight: '100 900'});

/**
 * Hello Nutrition.AI — tokens tomados de dev.hellonutrition.ai (index.css, variables HSL tipo shadcn, 8 nov 2026):
 * fondo 240 10% 96.1% (#F4F4F6), tinta 240 15% 5.1% (#0B0B0F), gris de marca 240 2% 44.1% (#6E6E73), borde 240 11% 90.8% (#E5E5EA);
 * oscuro: fondo #0B0B0F, tarjeta 240 8% 12% (#1C1C21), borde 240 7% 18.6% (#2C2C33), texto 240 11% 96.5% (#F5F5F7).
 * La identidad del sitio es monocroma (logo negro, texto negro sobre gris claro) y los colores van por macro:
 * proteína 145 63% 49% (#2ECC70), carbs 204 70% 53.1% (#3498DB), grasa 48 89% 50.2% (#F1C40F), calorías 6 78% 57.1% (#E74D3C), éxito 104 39% 59% (#83BF6E).
 * Para video usamos UN acento: el verde proteína (#2ECC70), que además es el color del kiwi. Fuente: Onest.
 */
export const hellonutrition: Brand = {
  canvas: '#F4F4F6',
  canvas2: '#E9E9EC',
  paper: '#FFFFFF',
  ink: '#0B0B0F',
  ink2: '#3A3A41',
  ink3: '#6E6E73',
  line: 'rgba(11,11,15,0.10)',
  lineStrong: 'rgba(11,11,15,0.20)',
  accent: '#2ECC70',
  accentDeep: '#1FA85A',
  accentHover: '#27B964',
  accentSoft: '#DDF5E6',
  accentLight: '#5DDB92',
  soot: '#0B0B0F',
  soot2: '#141418',
  soot3: '#1C1C21',
  onSoot: '#F5F5F7',
  onSoot2: 'rgba(245,245,247,0.72)',
  onSoot3: 'rgba(245,245,247,0.50)',
  lineSoot: 'rgba(245,245,247,0.12)',
  lineStrongSoot: 'rgba(245,245,247,0.22)',
  name: 'Hello Nutrition.AI',
  site: 'hellonutrition.ai',
  logo: 'brand/hellonutrition/logo.svg',
  font: '"Onest", "Inter", system-ui, sans-serif',
};

/** Colores por macro del sitio, por si una escena los necesita (no son el acento). */
export const macros = {protein: '#2ECC70', carbs: '#3498DB', fat: '#F1C40F', calories: '#E74D3C', success: '#83BF6E'} as const;
