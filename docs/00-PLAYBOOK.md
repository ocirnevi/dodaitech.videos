# Playbook dodaitech.videos: cómo hacemos Shorts de tecnología que la gente termina

Destilado de seis investigaciones (7 nov 2026). Cada regla tiene su fuente en los documentos numerados.
Esto es lo que aplico por defecto; lo que diga Enrico en un video concreto manda.

| Doc | Qué contiene |
|---|---|
| [01-libros-y-metodos](01-libros-y-metodos.md) | 10 libros con sus principios aplicados, métodos de MrBeast/Galloway/Kurzgesagt/Vox/Abram/Fireship, fórmula de guion de 45 s, 5 hooks, 12 errores |
| [02-oficio-short-form](02-oficio-short-form.md) | Specs y zonas seguras 2026, ritmo y pattern interrupts con parámetros, subtítulos, hooks, loops, métricas, checklist de 20 puntos |
| [03-sonido](03-sonido.md) | Librerías de SFX y música con licencias y APIs, música por IA, kit de 15 SFX con timing, mezcla (ffmpeg loudnorm, ducking), beat sync |
| [04-herramientas-visuales](04-herramientas-visuales.md) | Paquetes de Remotion, skills de agentes, assets con licencia, modelos de fal con precios, receta del iceberg, 13 técnicas eye-catching |
| [05-flujo-de-estudios](05-flujo-de-estudios.md) | Cómo aprueban estudios y creadores, pipelines IA con humano en el loop, compuertas y comentarios por panel |
| [06-heygen-y-avatares](06-heygen-y-avatares.md) | HeyGen MCP/API, tipos de avatar, precios, alternativas en fal, cuándo conviene una cara |
| [WORKFLOW](WORKFLOW.md) | Nuestras compuertas de aprobación y convenciones |

## Las 25 reglas que aplico

**Antes de escribir**
1. Packaging primero: título (la pregunta), texto del frame 1 y "momento de 5 segundos" antes del guion (MrBeast, Abdaal, Galloway, Dicks).
2. Armature en una frase; todo dato que no la demuestre se borra (McDonald, Kurzgesagt).
3. Inicio = opuesto del final (Dicks). Guion en 3 columnas: audio / visual / fuente (Abram).
4. Test de la servilleta: si no hace falta dibujarlo, no es video (Abram, Posner/Vox).

**Guion (45 s, ≤120 palabras)**
5. 0–2 s: hook triple (frase de contraste + imagen inesperada + texto visible en el frame 1, 4–7 palabras). Sin logo, sin "hola", sin hype vacío.
6. 2–6 s: confirmar la promesa y plantear A→Z ("en 40 s bajamos seis pisos").
7. Una metáfora visual + un número concreto por capa; conectores but/therefore, nunca "and then".
8. Re-hook planificado a ~15–20 s (giro o dato que recontextualiza).
9. Hourglass: 2–3 s de freno antes del payoff; el payoff cumple exactamente lo prometido.
10. Cierre que empalma con el inicio (loop) o abre el siguiente Short. Sin "dale like"; CTA tejido o en descripción.
11. Concreto y específico: nombres, lugares, cifras con fuente. Cero jerga sin imagen que la sustituya.

**Formato y ritmo**
12. 1080×1920, 30 fps, ≤45 s un concepto. Texto crítico entre y 290–1250 y x 120–880; nada esencial bajo y 1500.
13. Cambio visual cada 1.5–3 s; ningún tramo de 5 s sin corte, zoom, texto o SFX; nada estático >5 s; ningún elemento >8 s.
14. Pattern interrupts con parámetros (push-in 100→115 % en 4 frames, zoom-out reveal 150→100 % en 10, text slam 6–8 frames, flash 3 frames, inversión para "superficie vs fondo"), cada 3–5 s, intervalos variados, siempre al servicio del argumento.
15. Narración 150–175 wpm; sin pausas >0.5 s; densidad cortando palabras, no hablando más rápido.
16. Un solo elemento protagonista por frame; un solo acento de color (naranja dodaitech).
17. Nada lineal: springs y curvas con clamp; entradas de 2–3 propiedades con stagger; salidas más rápidas; 5 capas (fondo → assets → gráficos → grade → grano + viñeta).

**Subtítulos**
18. Karaoke quemado: 1–3 palabras por página, 60–75 px, bold 600–700, bloque ≤900 px, centro ≈ y 1100–1250, palabra activa en acento; primer subtítulo visible en el frame 1. Pista nativa corregida además.

**Sonido (50 % de la calidad percibida)**
19. Hits y clicks 0–1 frame antes del visual; whooshes y risers alineados por su pico o final al corte.
20. Música 120 BPM a 30 fps (15 frames por beat); cortes en frases de 2/4 beats; música 18–25 dB bajo la voz con ducking.
21. Master a −14 LUFS / −1 dBTP con loudnorm en dos pasadas; medir con ebur128.
22. SFX de Sonniss GDC (local, sin atribución) y Freesound CC0 vía API; música generada con ElevenLabs Music ($0.15/min) a BPM y duración exactas.

**Marca y cara**
23. Logo solo en un outro de 1.5–2 s. Identidad por color, tipografía y tono.
24. Avatar (HeyGen) solo como host breve: hook 1–3 s y outro, WebM con alfa, declarado como IA. Nunca a pantalla completa ni PiP permanente.

**Proceso**
25. Compuertas: packaging → guion → storyboard (hoja numerada) → animatic → voz final (costo dicho antes) → render (frames extraídos del MP4) → kit de publicación. Comentarios por `#N`/`LN`/`tNN`. Medir a 48 h: stayed-to-watch, APV y forma de la curva.
