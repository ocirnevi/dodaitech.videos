import type {Brand} from '../theme';
import {hellonutrition} from './hellonutrition';

/**
 * Mi Nutriólogo — canal en español, hermano de Hello Nutrition AI (Enrico, 9 nov 2026): misma identidad
 * (colores, Onest, logo manzana-corazón); solo cambian el nombre y el sitio. El logo es una copia en public/brand/minutriologo/.
 */
export const minutriologo: Brand = {
  ...hellonutrition,
  name: 'Mi Nutriólogo',
  site: 'minutriologo.ai',
  logo: 'brand/minutriologo/logo.svg',
};
