# Cómo aprueban antes del paso caro los estudios y creadores (y qué copiamos)

Investigación nov 2026. **[verificado]** = fuente enlazada; **[recomendación]** = síntesis propia.

## 1. Pipeline clásico de estudio [verificado]

Siete pasos ([Boords](https://boords.com/blog/the-seven-steps-of-animation-production)): brief → diseño (style frames) → storyboard → animatic → producción → feedback/sign-off → render final. Kurzgesagt ([kurzgesagt.org](https://kurzgesagt.org/youtube/)): investigación con *sourcesheet* por video, guion (~12 borradores), bocetos donde eligen metáforas visuales por escena, locución que fija el timing de animación, música/SFX compuestas. Vox opera con una persona responsable "from pitch to publication" ([Nieman Lab](https://www.niemanlab.org/?p=124626)).

Compuertas: guion firmado antes de avanzar (cambiar VO después del animatic afecta timing y costo); **style frames** = imágenes fijas del look final, 2–3 direcciones ([Vivamedia](https://vivamedia.ca/blog/frame-by-frame-heres-what-to-know-about-working-with-style-frames)); storyboard 10–20 cuadros para 60–90 s; **animatic** = película cruda con timing real, o **boardomatic** = VO sobre los cuadros; aprobaciones parciales a mitad y al final ([Headgear](https://headgearanimation.com/head-gear-caivan-reel)); 2 rondas por etapa ([Video Explainers](https://videoexplainers.com/our-process)). Giant Ant: compuertas irreversibles, "client problems are almost always process problems" ([Motion Hatch](https://motionhatch.transistor.fm/episodes/98-how-giant-ant-became-a-leading-motion-design-studio-w-jay-grandin)). BUCK: style frames + boards contra la música, animación por secciones ([Animation Magazine](https://animationmagazine.net/2021/06/whats-new-at-buck-one-on-one-with-content-lead-jay-brooker)).

Por qué el animatic con voz scratch es la aprobación clave: contiene todas las decisiones caras con costo casi nulo; saltárselo cuesta rehacer producción por un error de guion ([Design Cadets](https://medium.com/design-cadets/build-the-process-trust-the-process-b0e3d33c0d5c)).

## 2. Creadores solo o equipos pequeños [verificado]

- **MrBeast** (memo filtrado): conocer título y miniatura antes de producir; el primer minuto es lo más importante; *critical components* nunca al azar; métricas CTR/AVD/AVP contra los 9 videos anteriores ([memo](https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/), [Tubefilter](https://www.tubefilter.com/2024/09/17/mrbeast-internal-production-guide-leaked-key-points/)).
- **Ali Abdaal**: packaging (título, miniatura, hook) antes del guion; Kanban en Notion; canales de revisión de guion y miniatura ([Every](https://every.to/superorganizers/the-double-life-of-productivitys-3842641)).
- **Paddy Galloway**: "YouTube is a click and watch platform"; idea + packaging antes de hacer nada ([entrevista](https://medium.com/@ammarsheikhs/meet-the-godfather-of-youtube-strategy-paddy-galloway-interview-fcfc652bec2c)).
- Herramientas: [Milanote](https://milanote.com/templates/storyboards/video-storyboard) (columnas por escena, link sin registro); [Frame.io](https://frame.io/features/review-and-approval) (comentarios frame-accurate ligados a versión).

Patrón: **packaging primero**, guion segundo, feedback asíncrono sobre un artefacto único.

## 3. Pipelines de video con IA y aprobación humana [verificado]

Skills de Remotion producen stills y preview pero sin flujo de revisión ([docs](https://www.remotion.dev/docs/ai/skills)); [json-render](https://skillselion.com/skills/vercel-labs/json-render/remotion) usa un TimelineSpec JSON inspeccionable; [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen) hace plan → HTML → lint → preview → render determinista; **invideo** documenta la compuerta más explícita: key frames como stills compuestos en un storyboard vertical, "sign-off happens here, before any video credits are used", y solo se regeneran los paneles marcados ([invideo](https://invideo.io/faq/how-do-you-get-creative-director-approval-on-ai-video/)); [Descript](https://www.descript.com/tools/video-storyboard-generator) revisa guion → estilo → escenas.

Artefactos de aprobación comunes: guion/storyboard JSON, **grid PNG con todos los paneles**, MP4 en baja, stills por frame.

## 4. Recomendación para "creador que revisa en chat + agente" [recomendación]

| # | Compuerta | Artefacto | Decide | Tiempo |
|---|---|---|---|---|
| G0 | Packaging | 3 títulos + 1 frase de hook + idea de portada | Idea y promesa | 1–2 min |
| G1 | Guion con timing | tabla `#escena / VO / visual / dur` + total | Qué se dice y cuánto dura | 3–5 min |
| G2 | Contact sheet | **un PNG** con stills reales, número grande, VO abreviada, `t=` | Composición, orden, metáforas, estilo | 2–4 min |
| G3 | Animatic | MP4 480–540p con TTS scratch, música, overlay de nº y timecode | Ritmo, transiciones | duración + 1 min |
| G4 | Final | MP4 1080p + contact sheet final | Pulido, audio real | duración |

Cada compuerta se cierra (Giant Ant). Cambios de guion tras G2 = volver a G1, avisando el costo ("reabre 6 paneles").

**Comentarios por frame sin Frame.io**: espacio de nombres estable. `P04` = panel 4, `P04@00:12` = momento dentro, `P04..P06` = rango. El creador responde:
```
P03: texto más grande, fondo más oscuro
P04: cambia metáfora, usa engranajes no flechas
OK: P01 P02 P05 P06
```
El agente lo convierte en `feedback.vN.json` ({panel, timecode, note, status}) junto al artefacto.

**Versionado**: un directorio por video; fuente de verdad única (`script/<slug>.json`); artefactos inmutables `storyboard-v3.png`, `animatic-v2.mp4`, `final-v1.mp4`; `CHANGELOG` de una línea por versión; tag git por aprobación.

**"Cambia solo el panel 4" sin re-renderizar todo**: stills cacheados por hash de escena (la hoja se recompone en segundos); animatic por clips por escena + `ffmpeg concat` sin re-encode; si cambia la duración de un panel, avisar que desplaza timecodes y, con VO real, reabre G1 para ese tramo.

**Rutina de revisión < 5 min**: siempre el mismo bloque: artefacto, qué cambió (lista `Pxx`), 1–3 preguntas cerradas, "responde `OK` o `Pxx: nota`".
