# Caja de herramientas visual para Shorts explicativos (Remotion + Three.js + fal.ai)

Investigación nov 2026 (~30 fuentes: docs de Remotion, páginas de modelos de fal.ai, repos, páginas de licencia).

## 1. Ecosistema Remotion para motion graphics

Regla: `remotion` y todos los `@remotion/*` en la misma versión (`npx remotion add <pkg>`). Remotion es source-available: empresas de >3 personas necesitan licencia.

| Paquete | Qué habilita | Úsalo para |
|---|---|---|
| **@remotion/transitions** ([docs](https://www.remotion.dev/docs/transitions/presentations)) | `<TransitionSeries>` + `fade`, `slide`, `wipe`, `flip`, `clockWipe`, `iris`, `none`; nuevas HTML-in-canvas: `zoomBlur`, `dreamyZoom`, `filmBurn`, `linearBlur`, `bookFlip`, `zoomInOut`, `dissolve`, `ripple`, `crosswarp`, `crossZoom`, `swap`. Timings `linearTiming`/`springTiming`. | Cambios de escena de 8–15 frames; `clockWipe`/`iris` para revelar un dato; `zoomBlur` para punch de energía. |
| **@remotion/motion-blur** ([Trail](https://www.remotion.dev/docs/motion-blur/trail), [guía](https://www.remotion.dev/docs/motion-blur-guide)) | `<Trail>`, `<CameraMotionBlur shutterAngle=180 samples=5–10>`, `<HtmlInCanvasMotionBlur>`. No llamar `useCurrentFrame()` en el componente que envuelve el blur ([error típico](https://www.remotion.dev/docs/motion-blur/common-mistake)). | Suavizar slides rápidos y punch-ins; estelas en contadores. |
| **@remotion/lottie** ([docs](https://www.remotion.dev/docs/lottie/lottie)) | `<Lottie animationData playbackRate loop>`. Fuente: LottieFiles, Lottie Simple License: uso comercial sin atribución, prohibido redistribuir sueltos ([help](https://help.lottiefiles.com/hc/en-us/articles/900002438343-Can-I-use-a-free-animation-on-Lottiefiles-for-commercial-business-use)). | Micro-ilustraciones e iconos animados. |
| **@remotion/shapes** | `Rect`, `Circle`, `Ellipse`, `Triangle`, `Star`, `Polygon`, `Pie`, `Heart`, `Arrow`, `Callout`, `Spark`. | Pills de highlight, flechas, `Pie` como progreso. |
| **@remotion/paths** ([docs](https://remotion.dev/docs/paths/)) | `evolvePath()`, `interpolatePath()` (morph), `warpPath()`, `getPointAtLength`, `scalePath`… | Dibujar diagramas "a mano", morph icono→icono, mover algo por una curva. |
| **@remotion/animated-emoji** ([docs](https://www.remotion.dev/docs/animated-emoji)) | Noto Animated Emoji (CC BY 4.0, acreditar a Google/Noto). | Reacciones en hooks (🔥 💸 🤯). |
| **@remotion/noise** | `noise2D/3D/4D` deterministas. MIT. | Wobble orgánico, camera shake reproducible, fondos. |
| **@remotion/effects** ([docs](https://www.remotion.dev/docs/effects), [light leak](https://remotion.dev/docs/effects/light-leak)) | Efectos encadenados sobre `Solid`/`HtmlInCanvas`/`Video`: Blur & Shadow, Reveal, Transform, Distort, Stylize, Generate (`lensBlur`, `curves`, `levels`, `pageTurn`, `sphere`…), `lightLeak()`. WebGL2 + `gl: 'angle'`. | Grading y reveals sin shaders propios; transición cálida entre bloques. |
| **@remotion/three** ([docs](https://www.remotion.dev/docs/three)) | `<ThreeCanvas>`, `<ThreeWebGPUCanvas>`, `useOffthreadVideoTexture`. `<Sequence layout="none">`, `gl:'angle'` también en `renderMedia()`. | Vistas explosionadas de un chip, cámara orbital sobre modelos CC0. |
| **@remotion/skia** | Proof of technology, docs 404 hoy. | Evitar en producción. |
| **@remotion/layout-utils** ([docs](https://www.remotion.dev/docs/layout-utils)) | `fitText()`, `fitTextOnNLines()`, `measureText()`, `fillTextBox()`. Fuente cargada antes; solo navegador. | Titulares que llenan exactamente el ancho; sin cortes de palabra en 9:16. |
| **@remotion/animation-utils** ([docs](https://www.remotion.dev/docs/animation-utils)) | `makeTransform()`, `interpolateStyles()`. | Keyframes CSS multi-propiedad en una línea. |
| **@remotion/captions** ([docs](https://remotion.dev/docs/captions/create-tiktok-style-captions)) | `parseSrt`, `createTikTokStyleCaptions({combineTokensWithinMilliseconds})`. | Karaoke captions (ya en uso). |
| **Remotion Elements** ([galería](https://www.remotion.dev/elements)) | 42 bloques: Number Counter, Word Highlight / Moving Pill / Popping Word Captions, Speed Lines, Slide to Split Screen, PiP Transition, Text Marker / Circle Marker / Strike Through, **Social Safe Zones**, Liquid Contours, Spinning Globe, A-to-B Map Flyover, Subscribe Nudge. | Punto de partida copiable para el 80 % de recursos de un Short. |

Packs comunitarios: [remotion-animated](https://github.com/stefanwittwer/remotion-animated) (declarativo, MIT), [remotion-bits](https://github.com/av/remotion-bits) (text reveals, charts, MCP server), [remotion-animate-text](https://github.com/pskd73/remotion-animate-text) (inmaduro), kinetic typography de snapcn ([skills.sh](https://www.skills.sh/shadcn-labs/snapcn/remotion-kinetic-typography)).

## 2. Skills open-source para agentes

| Skill | Qué añade | Riesgos / notas |
|---|---|---|
| [remotion-dev/skills](https://www.remotion.dev/skills) (oficial) | 13 skills: best-practices, create, markup, studio, render, maps, captions, saas, interactivity, docs, license, upgrade, multimedia. | Base obligatoria. `npx skills add remotion-dev/skills`. |
| [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) (872★, MIT) | 10 reglas de motion, 17 patrones, `theme.ts`, bucle render→frames→inspección. | Un mantenedor; complementa al oficial. Ya aplicado en este repo. |
| [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) (1.1k★) | `motion-broll`, `object-separation`, `explainer-high-energy` (12–20 s, kinetic type a beat), `explainer-default`, `explainer-engaging`, `sound-effects`. SFX CC0. | El más cercano al formato "Short explicativo con energía". Descarga modelos/assets en runtime. |
| [kevinbadi/open-edits](https://github.com/kevinbadi/open-edits) (MIT) | Recetas estilo Fireship, `reverse-engineer` de referencias. Python, no Remotion. | Descarga logos/GIFs/footage de terceros. Referencia de recetas, no pipeline. |
| [AgriciDaniel/claude-shorts](https://github.com/AgriciDaniel/claude-shorts) (314★) | Recorta long-form en shorts con captions Remotion. | GPU NVIDIA. No es para explainers desde cero. |
| [digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit) (2.4k★, MIT) | Workspace guion → ElevenLabs → Remotion; `/video`. | Pipeline autónomo; ejecutar aislado. |
| [jincheng2026/jc-remotion-skills](https://github.com/jincheng2026/jc-remotion-skills) | `gotchas-index` (34 errores→fix), QA agent que lee frames, ~19 beats, render incremental. | **CC BY-NC**; instalador `curl \| bash`. |
| [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) | Destacados: [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) (50 skills MG), [kinetic-typography-skills](https://github.com/iart-ai/kinetic-typography-skills), [explainer-video-skills](https://github.com/iart-ai/explainer-video-skills) (guion, storyboard, render), [bang-motion](https://github.com/bangtutorial/bang-motion), [apple-motion](https://github.com/IskakovDamir/apple-motion), [agent-storyboard](https://github.com/Yuuhann1999/agent-storyboard) (workbench de storyboard), [claude-youtube-editor](https://github.com/hassancs91/claude-youtube-editor) (thumbnail), [viral-video-remake-skill](https://github.com/beatra-ai/viral-video-remake-skill) (descompone hooks), [launch-video-kit](https://github.com/timscheuerai/launch-video-kit). | Un SKILL.md es un prompt que hace que el agente ejecute shell: leerlo entero antes de instalar. |

## 3. Assets gratuitos con licencia clara

- **Iconos**: [Lucide](https://lucide.dev/license) ISC, Phosphor MIT, [Tabler](https://github.com/tabler/tabler-icons) MIT (sin crédito en pantalla; `THIRD_PARTY_NOTICES.md`). [Simple Icons](https://github.com/simple-icons/simple-icons): CC0 solo el trazado, la marca no; uso nominativo, sin alterar colores. [NVIDIA](https://www.nvidia.com/en-eu/about-nvidia/legal-info/logo-brand-usage) prohíbe su marca sin aprobación.
- **3D**: [Kenney](https://kenney.nl) CC0; [Poly Pizza](https://poly.pizza) mezcla CC0/CC-BY; [Sketchfab](https://sketchfab.com/blogs/community/refine-downloadable-model-searches-with-new-license-filters) filtrar licencia; [Poly Haven](https://www.polyhaven.com/license) CC0 para HDRIs (iluminación Three.js).
- **Stock con API**: [Pexels](https://www.pexels.com/license/) gratis/comercial/sin atribución, API sin copia masiva; [Pixabay](https://pixabay.com/service/license-summary/) Content License (ya no CC0); [Unsplash API](https://help.unsplash.com/api-guidelines/unsplash-api-guidelines) exige hotlink + crédito + ping de descarga.
- **Imagen tech**: [NASA](https://nasa.gov/nasa-brand-center/images-and-media) libre salvo insignia; [Wikimedia Commons · Integrated circuit dies](https://commons.wikimedia.org/wiki/Category:Integrated_circuit_dies) 2,000 archivos, die shots de Fritzchens Fritz en CC0 (licencia por archivo). **ASML media library solo editorial**; **TSMC gallery no modificable**; NVIDIA sin licencia de imágenes. Para Shorts monetizados: 3D propio, CC0 o Commons.
- **Fuentes**: Google Fonts OFL; [Fontshare](https://www.indiantypefoundry.com/news/introducing-fontshare) ITF Free Font License (comercial sí, self-hosting restringido).

## 4. Generación con IA vía fal.ai

**Stills consistentes**: FLUX1.1 [pro] $0.04/MP con `seed` ([fal](https://fal.ai/models/fal-ai/flux-pro/v1.1)); FLUX Kontext [pro]/[max] $0.04/$0.08 edición con referencia + seed ([fal](https://fal.ai/models/fal-ai/flux-pro/kontext)); Nano Banana Pro $0.15 (4K $0.30), hasta 14 referencias, 9:16 nativo, mejor texto, sin seed ([fal](https://fal.ai/models/fal-ai/nano-banana-pro)); Ideogram v3 $0.03–0.09 tipografía ([fal](https://fal.ai/models/fal-ai/ideogram/v3)).

**Image-to-video**: Kling 2.5 Turbo Pro $0.35/5 s (+$0.07/s), `tail_image_url` para loops ([fal](https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video)); Veo 3.1 $0.20/s sin audio, $0.40/s con audio ([fal](https://fal.ai/models/fal-ai/veo3.1/image-to-video)); Wan 2.5 $0.05–0.15/s según resolución, mejor precio/calidad ([fal](https://fal.ai/models/fal-ai/wan-25-preview/image-to-video)); MiniMax Hailuo 02 Standard $0.045/s 768p, máx 6 s, el más barato para loops ([fal](https://fal.ai/models/fal-ai/minimax/hailuo-02/standard/image-to-video)); Seedance 1.0 Pro ≈$0.62–0.74/5 s 1080p ([fal](https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/image-to-video)).

**Limpieza**: [Bria RMBG 2.0](https://fal.ai/models/fal-ai/bria/background/remove) $0.018/imagen (PNG con alfa → capas); upscale SeedVR2 $0.001/MP.

**Receta: serie "corte transversal de iceberg" 9:16**
1. Hoja de estilo (Nano Banana Pro): `Editorial flat-vector illustration, cross-section of an iceberg, waterline at 35% height, 3 labeled horizontal strata, thick outlines, limited palette {…}, soft grain, no text, centered with 15% top/bottom safe margin`. Negativo: `photorealistic, 3D render, blurry, extra text`.
2. Variantes: misma hoja como referencia, cambiar solo la cláusula de contenido; o FLUX Kontext con `seed` fijo y ediciones mínimas ($0.04).
3. Texto nunca dentro de la imagen: etiquetas con `fitText` + `@remotion/shapes`.
4. Capas: Bria RMBG para separar iceberg/fondo/agua → parallax y x-ray en Remotion.
5. Movimiento: un plano hero con Kling (dolly-in lento, cámara baja bajo el agua, `tail_image_url` = misma imagen para loop); el resto con `spring()`.
6. Costo típico por Short: ≈ **$0.85** (1 hoja + 6 variantes + 1 clip + 6 recortes).

## 5. Técnicas "eye-catching" y cómo hacerlas en Remotion

| Técnica | Cuándo | Implementación |
|---|---|---|
| Kinetic typography | Hook y datos clave; ≤6–8 palabras por pantalla, hold ≥0.8–1.2 s, +0.3 s con cifras; evitar 15 % superior/inferior ([guía](https://fluxnote.io/guides/faceless-shorts-text-overlay-tips-2026)) | `fitText` + spring por palabra con stagger 2–3 frames; Elements *Popping Word Captions*. |
| Contador / odómetro | Precios, nm, % | `interpolate` + `Intl.NumberFormat`, `tabular-nums`, `<Trail>` para peso. Ya en `Beats.tsx`. |
| Highlight pill | La palabra que importa | `scaleX` desde 0 detrás del texto; `interpolateStyles` pill→subrayado. |
| Subrayado / marcador | Énfasis "a mano" | `evolvePath()` sobre path irregular; Elements *Text Marker*. |
| Máscaras y wipes | Problema → solución | `clockWipe`/`iris`; `clipPath: inset()/circle()` interpolado. |
| Parallax por capas | Ilustraciones generadas | 3–5 PNG con alfa, `translateY = scroll * depth`, `noise2D` para deriva. |
| Split "lo que ves / lo que no" | Comparativas, iceberg | Elements *Slide to Split Screen*; dos `AbsoluteFill` con `clipPath` y línea divisoria animada. |
| Exploded view | Hardware | `@remotion/three`: desplazar meshes por su normal con spring. |
| X-ray / cutaway | Interior | Dos capas + `clipPath: circle()` siguiendo un path; `@remotion/effects` Reveal. |
| Speed ramp | B-roll IA | `<OffthreadVideo playbackRate>` por tramos + `CameraMotionBlur`. |
| Camera shake / punch-in | Acento en beat | `scale 1→1.08` en 3 frames + spring; shake = `noise2D`. Ya en `PunchIn.tsx`. |
| Flash de inversión | Giro ("pero…") | 2–3 frames `filter: invert(1)`; 1–2 por Short. |
| Grano y grade | Cohesión | `@remotion/effects` o noise overlay 6–10 %; `lightLeak()` en cortes. Ya en `Post.tsx`. |

Principio transversal: nada lineal, todo con stagger, un solo protagonista moviéndose a la vez, y bucle render → frames → inspección antes de entregar.
