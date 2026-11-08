# dodaitech.videos — reglas de trabajo para Claude

Videos cortos de tecnología (Shorts/Reels/TikTok, 9:16, 30–60 s, en inglés) producidos con código:
Claude Code escribe guion y escenas, Remotion + Three.js renderizan, ElevenLabs (vía fal.ai) narra.
Enrico escribe en español; los videos y los guiones salen en inglés salvo que diga lo contrario.

## Cómo trabajamos (compuertas de aprobación)

Nada caro ni largo se hace sin que Enrico haya aprobado el artefacto de la compuerta anterior.
Cada compuerta produce UN artefacto revisable en menos de 5 minutos; los comentarios se dan por número
(`#4` panel del storyboard, `L3` línea del guion, `t12` segundo del animatic; `OK` cierra la compuerta).
Detalle y razones en `docs/WORKFLOW.md` y `docs/05-flujo-de-estudios.md`.

| # | Compuerta | Artefacto que entrego | Decide |
|---|---|---|---|
| 0 | Packaging | 3 títulos + texto del frame 1 (4–7 palabras) + el "momento de 5 segundos" + armature en una frase | la promesa |
| 1 | Guion | `script/<slug>.json` + tabla `t · voz · visual · dato/beat · fuente` (≤120 palabras) | qué se dice y cuánto dura |
| 2 | Storyboard | `out/<slug>/storyboard-vN.png`: hoja numerada de frames reales con voz scratch (`scripts/storyboard.mjs`) | composición, metáforas, timing |
| 3 | Animatic | `out/<slug>/animatic-vN.mp4` a 540p con voz scratch, música y SFX | ritmo, cortes, sonido |
| 4 | Voz final | ElevenLabs vía fal; digo caracteres y costo antes y espero "sí" | — |
| 5 | Render final | MP4 1080×1920, −14 LUFS / −1 dBTP, + 3 frames extraídos del MP4 | publicar o volver a 2 |
| 6 | Publicación | `videos/<slug>/publish.md`: título, descripción con fuentes, hashtags, frame de portada, registro de hipótesis de hook | — |

No saltar compuertas. Cambio de guion después de 2 reabre 1 (y digo cuántos paneles toca). Cambios de
texto, color o timing de un panel no requieren voz nueva; cambios de narración sí. Versiones inmutables
(`-v1`, `-v2`); costos de fal y HeyGen anotados en `videos/<slug>/costs.md` (copia en `out/<slug>/`).

## Reglas (aprendidas, no relitigar)

- **Dinero.** Nunca llamar a fal.ai (voz, imagen, video, música) sin decir qué se genera y el costo estimado
  y recibir un sí. La llave vive en el `.env` de Mia Studio y se pasa con `node --env-file=…`; nunca se imprime ni se copia a este repo.
- **Marca.** La gente no conoce dodaitech: el logo NO va en cada escena ni como marca de agua. Solo un outro corto
  (1.5–2 s) con wordmark + dodaitech.com. La identidad se nota por color (naranja `#fb5618` como único acento),
  tipografía (Bricolage Grotesque) y tono. Tokens en `src/theme.ts`, origen `../dodaitech/src/index.css`.
- **Cara / avatar.** Si se usa HeyGen, solo como host breve (hook 1–3 s y outro) en WebM con alfa, declarado como IA;
  nunca a pantalla completa ni PiP permanente. Ver `docs/06-heygen-y-avatares.md`.
- **Formato por defecto.** 1080×1920, 30 fps, ≤ 45 s para un concepto (60–75 s solo con dos capas o demo).
  Zona segura: texto crítico entre y 290–1250 y x 120–880; nada esencial bajo y 1500. Subtítulos karaoke
  1–3 palabras, 60–75 px, bold, centro ≈ y 1100–1250, visibles desde el frame 1.
- **Guion.** Packaging antes del guion; armature en una frase; inicio = opuesto del final; hook triple en 0–2 s
  (frase de contraste + imagen + texto en el frame 1); A→Z en 2–6 s; re-hook a ~15–20 s; hourglass antes del payoff;
  cierre en loop; sin "dale like"; ≤120 palabras a 150–175 wpm; but/therefore, nunca "and then". Ver `docs/00-PLAYBOOK.md`.
- **Ritmo.** Cambio visual cada 1.5–3 s; ningún tramo de 5 s sin corte, zoom, texto o SFX; nada estático >5 s.
  Cada dato hablado cae en el frame exacto de su palabra (`beats[]` + `triggerFrame`). Un solo protagonista por frame.
- **"Se siente largo" no es la duración (Enrico, 8 nov, ai-agents 59 s).** Videos de 1:30 pueden sentirse bien; lo que cansa es la lista plana
  de escenas del mismo peso con cortes uniformes y giro tardío. Estructura en 3 bloques con energía creciente, variar duración de planos,
  giro ≤ 15 s, fusionar escenas gemelas. Por defecto GAP 3 frames y ajuste a beat ≤4 frames (`timeline.ts`). Registro de feedback por video en `videos/FEEDBACK.md`.
- **Simple y refinado antes que complejo (Enrico, 7 nov).** 2D vectorial plano, bien resuelto, por encima de 3D ambicioso que luego
  se ve de juguete. El 3D solo si una forma simple (una pieza, una cámara) lo justifica; nunca props 3D pequeños "de adorno".
  Un solo protagonista visual por escena; iconos de línea mínimos (dos colores) en vez de modelos.
  La metáfora debe reconocerse en un frame cualquiera (un iceberg se ve entero, no un trozo). Marcas como nombres tipografiados en pills;
  logos reales solo desde press kits oficiales y sin modificar (OpenAI y NVIDIA son estrictos; ver `docs/04`).
- **Nada lineal.** Springs o curvas con clamp; entradas de 2–3 propiedades; salidas más rápidas que entradas;
  5 capas (fondo → assets → gráficos → grade → grano + viñeta). Nada animado por `useFrame()` de R3F.
- **Sonido siempre.** Hits y clicks 0–1 frame antes del visual; whooshes y risers alineados por su pico/final al
  corte; música a 120 BPM (15 frames por beat a 30 fps), cortes en frases de 2/4 beats, 18–25 dB bajo la voz con
  ducking; master −14 LUFS / −1 dBTP (loudnorm dos pasadas, ver `docs/03-sonido.md`). SFX: Sonniss GDC y Freesound CC0.
- **Verificar antes de entregar.** Renderizar, extraer frames del MP4, mirarlos, corregir, re-renderizar.
- **Voz.** Alex (ElevenLabs id `yl2ZDV1MzN4HbQJbMihG`, `multilingual-v2`, `language_code` según el guion).
  Para borradores y storyboards, macOS `say` (gratis). Timestamps por palabra: faster-whisper local alineado al guion.
- **Datos.** Toda cifra en pantalla lleva fuente en el guion (`sources[]`). Si dos fuentes no coinciden, se usa un rango o se omite.
- **Git.** No commitear sin que lo pida. No tocar `.env`.

## Mapa del repo

- `script/<slug>.json` guion: escenas, narración, `beats` (dato + palabra gatillo), `mode` (light/dark), voz, formato.
- `scripts/` `tts.sh` (say) · `tts-espeak.py` (voz scratch en Linux con tiempos por palabra) · `beats-numpy.py` (BPM sin librosa) · `tts-fal.mjs` (ElevenLabs vía fal, dry-run por defecto) · `align.py` (whisper → words.json) ·
  `music-fal.mjs` (ElevenLabs Music) · `analyze-music.py` · `sfx-index.mjs` (Sonniss) · `gen-sfx.mjs` (kit sintético) · `storyboard.mjs` (hoja de aprobación).
- `src/` `script.ts` (timeline, `triggerFrame`) · `theme.ts` (marca) · `Video.tsx` (secuencias, cortes, música) ·
  `scenes/` · `components/` (Captions, Beats, PunchIn, Post, Sfx, MusicBed, ByScene, LayerStack, Wordmark) · `three/` · `StoryboardSheet.tsx`.
- `public/` `narration/` · `sfx/` · `music/` · `brand/` · `fonts/` · `storyboard/` (paneles temporales).
- `videos/<slug>/` una carpeta por video con lo que lee Enrico: `brief.md` (compuertas 0–1 y estado), `costs.md`, `publish.md` (compuerta 6). Índice en `videos/README.md`; feedback de Enrico por video en `videos/FEEDBACK.md`.
- `docs/` `00-PLAYBOOK.md` (las 25 reglas) + 01…06 (investigación de 2026-11-07) + `WORKFLOW.md`.
- Chrome: `remotion.config.ts` usa el Chrome del sistema en macOS (el headless de Remotion falla en esta Mac); en Linux Remotion encuentra `google-chrome` solo.
- `.claude/skills/remotion-*`: skills oficiales de Remotion (remotion-dev/skills, misma versión que `remotion`). Se cargan solos al tocar
  Remotion; reglas que ya seguimos: `useCurrentFrame()` en el componente más pequeño (`MusicBed`, `ByScene`), `<Audio>` de `@remotion/media`,
  `<Track name>` para escenas y subtítulos, `fps` de `useVideoConfig()`. Actualizar con `npx skills add remotion-dev/skills -y --agent claude-code`
  cuando se suba de versión Remotion (ver skill `remotion-upgrade`).

## Comandos

```
npm run studio                                                   # preview interactivo
RATE=200 ./scripts/tts.sh script/<slug>.json                     # voz scratch (macOS say) → public/narration/<slug>/ + src/data/<slug>/narration.json
HF_HUB_OFFLINE=1 ~/.pyenv/versions/3.12.13/bin/python scripts/align.py script/<slug>.json   # palabras → src/data/<slug>/words.json
node scripts/storyboard.mjs --script script/<slug>.json --comp <Comp> --cols 6 --out out/<slug>/storyboard-vN.png
npx remotion render <Comp> out/<slug>/animatic-vN.mp4 --scale 0.5 --crf 24               # animatic 540p
node --env-file=<.env de Mia> scripts/tts-fal.mjs --script script/<slug>.json --yes     # voz final Alex (decir costo antes)
node --env-file=<.env de Mia> scripts/music-fal.mjs --yes                                # cama musical (≈$0.60 por intento)
/usr/bin/python3 scripts/analyze-music.py <wav> --bpm 120 --sections 6,14,4,14,5,3        # BPM, downbeat, energía por sección
node scripts/sfx-index.mjs index <dir> · pick <palabras> · kit                            # librería Sonniss (../dodaitech.assets)
npx remotion render <Comp> out/<slug>/final-vN.mp4 --crf 17                               # render final
```

Datos por video: `src/data/<slug>/{narration,words,beats}.json`; audio en `public/narration/<slug>/`; música en `public/music/<slug>/`.
SFX reales en `public/sfx/lib/` (Sonniss GDC 2026, picos en `src/data/sfx-peaks.json`; `<Sfx>` alinea el transiente al frame).
Shorts: `src/shorts/` (timeline pegado a `targetStart` de cada escena y a los beats de la música; `src/shorts/timeline.ts` es la fábrica reutilizable, `script.ts` la de ai-iceberg).
