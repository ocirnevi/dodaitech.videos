# El oficio del video vertical corto para explainers de tecnología (2026)

Niveles de evidencia: **[OFICIAL]** plataforma · **[MEDIDO]** terceros con muestra (casi siempre vendedores) · **[OPINIÓN]** consenso de practicantes. YouTube no publica umbrales de retención.

## 1. Especificaciones técnicas por plataforma

- **Lienzo**: 1080×1920, H.264 + AAC 48 kHz, `moov` al inicio, 30 fps (60 solo con movimiento rápido), 8–12 Mbps.
- **Duración máxima**: Shorts hasta 3 min (desde oct-2024) [OFICIAL]; Reels 3–180 s; TikTok 10 min. **Recomendada** [MEDIDO, OpusClip]: 21–34 s tiene la mayor finalización (62 % vs 48 % en >60 s). Regla: un concepto 25–45 s; dos capas o demo 45–75 s.
- **Zonas seguras** (px sobre 1080×1920; nadie publica márgenes orgánicos, las guías son de anuncios):

| Plataforma | Arriba | Abajo | Derecha | Izquierda | Fuente |
|---|---|---|---|---|---|
| Shorts (anuncios) | 288 | 672 | 192 | 48 | Google Ads [OFICIAL] |
| Shorts (orgánico, est.) | 120–180 | 300–400 | 96–200 | 48–60 | terceros |
| Reels (anuncios) | 269 (14 %) | 672 (35 %) | 65 | 65 | Meta |
| TikTok | 240 / 108–130 orgánico | 660 / 320–484 orgánico | columna 180 desde y≈840 | 120 / 60 | terceros |

**Caja universal**: todo texto crítico entre **y = 290 y 1250** y **x = 120 y 880**. Nada esencial bajo y ≈ 1500.
- **Audio**: YouTube normaliza a −14 LUFS solo hacia abajo; exportar −14 LUFS / −1 dBTP. Voz 6–10 dB sobre música.
- **Subtítulos**: quemados para el estilo karaoke + pista nativa corregida para accesibilidad/búsqueda; desactivar auto-captions del reproductor donde dupliquen.
- **Loop**: Shorts y Reels repiten automáticamente. Las *engaged views* excluyen loops [OFICIAL]. En Reels el promedio de visualización puede superar la duración.

Fuentes: [safe zones Shorts](https://www.socialync.io/tools/safe-zones/youtube-shorts) · [Reels](https://www.socialync.io/tools/safe-zones/instagram-reels) · [TikTok](https://www.socialync.io/tools/safe-zones/tiktok) · [reap.video](https://reap.video/blog/short-form-video-safe-zones) · [TechCrunch 3 min](https://techcrunch.com/?p=2442874) · [engaged views](https://blog.youtube/inside-youtube/engaged-views-youtube-explained/) · [OpusClip](https://www.opus.pro/blog/tiktok-length-format-retention-data) · [−14 LUFS](https://dev.to/arthurvalle1_a2586dd2b4bc/mastering-for-reels-tiktok-and-youtube-shorts-the-lufs-14-standard-2ck5)

## 2. Ritmo y edición

- **Cambio visual cada 1.5–3 s** (corte, zoom, texto nuevo, B-roll, color). FluxNote (5,000 Shorts): cambio cada 2–3 s → 82 % retención vs 58 % con ≥6 s [MEDIDO vendedor]. OpusClip: pattern interrupt cada 4 s; nada estático >5 s; ningún elemento >8 s. Dost & Huang 2026 (único experimento académico): rendimientos decrecientes al subir demasiado la frecuencia. **Auditoría de los 5 segundos**: cualquier tramo de 5 s sin corte, zoom, texto o SFX se rompe.
- **Palabras por minuto**: 140–160 explainers; 170–180 hype. Recortar pausas >0.5 s y "lenguaje puente".
- **Re-enganche**: 0–3 s decisión de swipe (30–50 % se va); quick win antes de 10–15 s (+20 % retención [vendedor]); re-hooks a **15 s y 30 s**. Una pregunta en pantalla sostiene ≈5–7 s.
- **Pattern interrupts con parámetros**: push-in 100→115 % en 4 frames en el corte · zoom-out reveal 150→100 % en 10 frames ("lo que no ves") · whip con segunda toma +15 % · flash de B-roll 3 frames · text slam de una palabra 6–8 frames a media pantalla · SFX stinger (o **silencio** súbito) · inversión de color para "superficie vs fondo" · speed ramp · glitch skip de 3 frames · L-cut audio 3–5 frames adelantado. Cada 3–5 s, intervalos variados.
- **Subtítulos karaoke**: 1–3 palabras en karaoke puro, 3–7 en frase; **60–75 px** (65 de partida), bold 600–700, sans pesada, contorno o sombra, bloque ≤900 px, **centro ≈ y 1100–1250**; una palabra activa con color o +10 % escala; evitar arcoíris; primer subtítulo visible en el frame 1.
- **Loop**: último frame casa con el primero (composición, color, movimiento) o la última frase se corta a medias y empalma con la primera; el audio también. Señal de éxito: pico >100 % en el segundo 1.

Fuentes: [Aibrify](https://aibrify.com/blog/youtube-shorts-retention-curve-playbook) · [FluxNote](https://fluxnote.io/guides/increase-audience-retention-youtube-shorts) · [Dost & Huang](https://archives.marketing-trends-congress.com/2026/pages/PDF/paper_professor_DOST_HUANG.pdf) · [tokcount micro-cortes](https://tokcount.com/blog/14-micro-cut-transitions-that-keep-completion-rates-above-60-percent) · [ClipSpeedAI](https://dev.to/kyle_clipspeedai/the-science-of-viral-moments-what-ai-found-after-analyzing-10000-short-form-clips-861) · [tamaño de captions](https://blitzcutai.com/blog/best-caption-size-youtube-shorts-2026) · [vidIQ loop](https://vidiq.com/blog/post/double-youtube-watch-time-looping-shorts/)

## 3. Ganchos visuales y textuales (0–2 s)

- Texto del hook **pre-renderizado y visible en el frame 1** (un typewriter de 3 s mata el gancho); **4–7 palabras**; alto contraste; sin logo, sin saludo, sin plano general. El frame 1 es la miniatura del feed: debe leerse sin sonido. Texto abre el loop, voz lo cierra; ambos disparan a la vez (+67 % retención a 30 s con afirmación específica en 2 s [vendedor]).
- Siete tipologías (Bytecap): resultado primero, pregunta precisa, problema→solución, teaser, afirmación sorprendente, revelación visual, promesa directa. Curiosity gap anclado a resultado concreto.
- **Metáforas para sistemas con capas ocultas**: **iceberg** (punta estática 0–2 s, cámara baja bajo el agua 2–4 s, capas etiquetadas 4–8 s; crítica: no inspira acción, cerrar con qué hacer), cebolla, pirámide, **rayos X / corte transversal** (mismo plano, inversión o wipe vertical: potente porque reutiliza la composición), vista explosionada, zoom-out reveal, **split "lo que ves / lo que no ves" arriba/abajo** (no izquierda/derecha en 9:16). Una metáfora solo gana su sitio si hace concreta una afirmación abstracta.

Fuentes: [Bytecap hooks](https://www.bytecap.io/research/best-hooks-for-youtube-shorts) · [Blitzcut hooks](https://blitzcutai.com/blog/best-youtube-shorts-hooks-2026) · [iceberg model](https://sketchplanations.com/the-iceberg-model) · [metáforas](https://blog.videoscribe.co/visual-metaphors-icons-drawings-videoscribe-complex-ideas)

## 4. Qué hacen los mejores canales en vertical

No hay desgloses publicados frame a frame; **[DOC]** declarado, **[OBS]** observable.
- **Cleo Abram**: [DOC] Shorts para ideas explicables en ≤60 s y para testear temas; filtro "¿es inherentemente visual?"; guion 3 columnas. [OBS] abre con la afirmación grande, sin saludo.
- **Fireship**: [DOC] "30 min en 100 s", humor, golpes visuales cronometrados. [OBS] voz desde el frame 0, meme o captura como primer frame, text-pops de una palabra, remate irónico.
- **Johnny Harris**: mapas en movimiento + pregunta en voz; empuja al largo.
- **Vox**: [DOC] contrató productor de vertical en 2025; periodista a cámara + gráficos.
- **Kurzgesagt**: reencuadres verticales, dato en los primeros 2 s, logo breve.
- **Hank Green**: responde preguntas, "idea errónea primero → por qué importa → 3–4 evidencias", pregunta de vuelta.
- **Quantum Fracture / Nate Gentile**: animación 2D o presentador + B-roll, CTA al largo.
Patrón común: **ninguno abre con intro o logo**; tesis antes del segundo 2; el Short como funnel o laboratorio.

Fuentes: [Cleo Abram × Colin & Samir](https://rosetta.to/u/colinandsamir/how-cleo-abram-dominated-youtube-in-under-1-year?t=0) · [Fireship entrevista](https://medium.com/illumination-curated/interview-with-jeff-delaney-from-youtubes-500k-fireship-channel-for-programmers-7d0d57eb8a1) · [Vox vertical](https://digiday.com/media/voxs-short-form-video-strategy-has-a-money-problem-but-fulfills-publishers-civic-duty/) · [Hank Green](https://www.yalescientific.org/2021/04/into-the-newsroom-teaching-through-tiktoks)

## 5. Métricas

- **Definiciones [OFICIAL]**: *Stayed to watch* (Shorts) = siguió viendo en vez de deslizar; *engaged views* excluyen loops; APV puede superar 100 %. Instagram (ago-2025): retention chart por segundo y **skip rate** (abandono en 3 s).
- **Formas de curva**: acantilado (30–50 % en 1–3 s) = hook fallido; joroba = payoff a mitad y final que pierde el replay; **meseta >70 % + pico >100 % en el segundo 1** = la deseada; caída súbita a mitad = jerga o cambio de tema; pendiente suave = ritmo lento. Alta stayed-to-watch + baja APV = el hook promete lo que el cuerpo no entrega.
- **Benchmarks (terceros)**: stayed to watch ≥70–80 % bien; retención a 3 s 80–90 % en buenos hooks; APV ≥70–80 % objetivo; completion TikTok 15 s: 50 % medio / 65 % bueno / >75 % excelente.
- **Testear hooks sin A/B** (Test & Compare no existe para Shorts [OFICIAL]): mismo cuerpo, solo cambian los 2–3 s iniciales; probar mecanismos distintos (pregunta vs resultado vs afirmación); registro por pieza; umbral mínimo (≈1,000 reproducciones en 48 h); ganador = mejora entrada y sostenimiento; prueba de sala: mostrar el frame 1 un segundo y preguntar de qué va.

Fuentes: [YouTube métricas](https://support.google.com/youtube/answer/9313698?hl=en) · [Bytecap benchmarks](https://www.bytecap.io/research/youtube-shorts-retention-benchmarks) · [IG skip rate](https://www.socialsamosa.com/news-2/instagram-retention-chart-skip-rate-new-performance-metrics-reels-9730992) · [Test & Compare](https://support.google.com/youtube/answer/13861714) · [micro-experimentos](https://kivopost.com/blog/micro-experiments-for-short-form-a-rapid-test-framework-for-tiktok-reels-and-shorts)

## 6. Checklist de 20 puntos antes de publicar

**Técnica** 1. 1080×1920, H.264/AAC, 30 fps, 8–12 Mbps. 2. −14 LUFS / −1 dBTP; voz 6–10 dB sobre música. 3. Texto dentro de x 120–880, y 290–1250. 4. Comprobado sobre overlay real de las tres plataformas. 5. Duración justificada (≤45 s un concepto).
**Hook** 6. Texto visible en el frame 1, 4–7 palabras, legible sin sonido. 7. Voz específica antes del segundo 2; sin saludo ni logo. 8. Loop anclado a resultado concreto que el cuerpo cierra. 9. Frame 1 funciona como miniatura.
**Ritmo** 10. Ningún tramo de 5 s sin cambio; media cada 2–3 s; nada >8 s. 11. Quick win antes de 10–15 s; re-hook ≈15 y ≈30 s. 12. 140–160 wpm; pausas >0.5 s fuera. 13. Cada interrupt sirve al argumento. 14. La metáfora hace concreta una afirmación y termina en cambio de perspectiva.
**Subtítulos** 15. Karaoke quemado 1–3 palabras, 60–75 px, bold, centro ≈ y 1100–1250. 16. Pista nativa corregida subida. 17. No tapan la acción.
**Cierre** 18. Final empalma con el inicio; audio loopea; probado 3 veces. 19. CTA ≤1 frase que no rompa el loop. 20. Registro: hipótesis de hook, frame 1, primeras palabras; revisión a 48 h.
