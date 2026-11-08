import {useCurrentFrame} from 'remotion';

/**
 * Renderiza algo según la escena activa en el frame actual (fondo, grade…), sin que el componente raíz
 * tenga que suscribirse a useCurrentFrame() (regla del skill remotion-markup: el frame en el componente más pequeño).
 */
export function ByScene<S extends {from: number}>({scenes, until, children}: {scenes: S[]; until?: number; children: (scene: S) => React.ReactNode}) {
  const frame = useCurrentFrame();
  if (until !== undefined && frame >= until) return null;
  let cur = scenes[0];
  for (const s of scenes) if (frame >= s.from) cur = s;
  return <>{children(cur)}</>;
}
