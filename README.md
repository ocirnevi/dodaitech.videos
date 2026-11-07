# dodaitech.videos

Prueba de concepto: **videos explicativos de tecnología generados con código**, usando
Claude Code como "cerebro" (investiga, escribe el guion, programa las escenas y renderiza)
y Remotion + Three.js como motor de render.

Primer video: **"What's behind a chip?"** — los tres niveles de la cadena
(ASML → TSMC → NVIDIA), ~75 s, 1920×1080 @ 30 fps, narrado en inglés con la voz
"Alex - Upbeat, Energetic and Clear" de ElevenLabs vía fal.ai. La versión en español del guion
queda en `script/chip-supply-chain.es.json`.

## Identidad dodaitech

Tokens tomados de `src/index.css` del sitio (repo `dodaitech`) y centralizados en `src/theme.ts`:
papel piedra `#f1f1ed` + tinta cálida `#1b1917` para intro y cierre, banda soot `#151311` para los
tres niveles, **un solo acento naranja `#fb5618`** (contadores, palabra activa, haz EUV, núcleos de la GPU),
Bricolage Grotesque (variable, `public/fonts/`) con la utilidad `.display` del sitio (peso 600,
tracking −0.035em) y la etiqueta técnica con `wdth 80`. El logo de tres capas (`public/brand/layer-*.png`)
llega explotado y se asienta como en el Hero del sitio; en "Three levels" se vuelve a abrir y cada capa
recibe su etiqueta (ASML abajo, TSMC en medio, NVIDIA arriba). En el cierre cada capa cae cuando se
nombra su nivel, la base se apaga en "if one fails" y termina con el wordmark y dodaitech.com.

## Pipeline (v2, ritmo rápido)

```
script/chip-supply-chain.json   ← guion: escenas, narración, BEATS (dato + palabra que lo dispara), color por nivel
          │
          ▼  npm run tts        macOS `say` → public/narration/*.wav + src/narration.json (duración real)
          │  node scripts/tts-fal.mjs --yes   (alternativa: ElevenLabs vía fal.ai, misma cuenta que Mia Studio)
          ▼  npm run align      faster-whisper local (medium, es) → timestamps por palabra alineados al guion → src/words.json
          │
          ▼  npm run sfx        kit de SFX sintetizado (whoosh, pop, tick, bajo, riser, shimmer) → public/sfx/
          ▼
src/Video.tsx                   ← una <Sequence> por escena + cortes (riser → flash → bajo) + cama musical
src/scenes/*.tsx                ← 5 capas: fondo → 3D/assets → gráficos → grade → grano + viñeta; subtítulos encima
src/components/                 ← Captions (karaoke por palabra), Beats (contadores/callouts), PunchIn, Post, Sfx
src/three/*.tsx                 ← EuvMachine, Wafer (capas por frame), GpuDie (onda por frame), Stack
          │
          ▼  npm run render     Remotion → Chrome → ffmpeg (crf 17)
out/chip-supply-chain.mp4
```

### Lo que hace que se sienta rápido y entretenido (y de dónde sale)

| Técnica | Cómo está implementada | Fuente |
|---|---|---|
| Hook en los primeros 15 frames | Título entra con golpe (scale 1.25→1 + blur) y bajo en el frame 0 | skill motion-graphics, Johnny Harris cold open |
| Un visual por frase, "landing on the word" | `beats[]` en el guion: cada dato aparece en el frame exacto de su palabra (`triggerFrame`) | open-edits (Fireship-style), TTS-first |
| Contadores en cada número hablado | `kind: counter`, spring + `tabular-nums` | open-edits "odometer", motion-graphics §9 |
| Punch-in de cámara en cada beat | `PunchIn`: scale +4.5% que decae en 14 frames | Fireship (zoom en la palabra acentuada) |
| Cortes duros con flash + riser + bajo | `Flash` 3+5 frames, SFX 2–3 frames antes de la imagen | motion-graphics (sound design) |
| Subtítulos karaoke 2–4 palabras | `@remotion/captions` + whisper local; palabra activa en acento | Remotion TikTok template |
| Nada lineal, entradas de 2–3 propiedades, salidas más rápidas | springs `snappy`, `SceneIn`, `BeatCard` exit 7 frames | motion-graphics reglas 1–4 |
| Grade + grano + viñeta | `Post.tsx` | motion-graphics regla 5 |
| Música baja y SFX sintetizados | cama a 0.11, kit WAV generado por código | motion-graphics (SFX sin assets) |

### Skills de Claude Code para esto

No pude instalarlos desde esta sesión (el sandbox bloquea escribir en `.claude/`). Instálalos tú con:

```bash
npx skills add remotion-dev/skills
```

```bash
git clone --depth 1 https://github.com/haidrrrry/claude-remotion-skill /tmp/crs && mkdir -p .claude/skills && cp -R /tmp/crs/remotion-motion-graphics .claude/skills/
```

- **remotion-dev/skills** (oficial, 6.5k★): corrección de API, `/remotion-captions`, `/remotion-render`, `/remotion-docs`. No opina de estilo; evita renders rotos.
- **haidrrrry/claude-remotion-skill** (872★, MIT, solo markdown): las 10 reglas de motion design que apliqué aquí + bucle render → extraer frames → mirar → corregir. Es el que más ataca "se ve lento y estático".
- **kevinbadi/open-edits**: pipeline Python/PIL estilo Fireship. No lo instales (whisper solo inglés, scraping de logos), pero sus números son la referencia: corte cada ~2.2 s (1.5 s en shorts), gráfico que cae sobre la palabra (máx. 0.1 s antes), contador en cada número.
- **Barty-Bart/motion-graphics** (1.1k★): solo vale la pena el skill `sound-effects` (cue list, cortes al beat, mezcla a −16 LUFS). Descarga assets de Mixkit en tiempo de ejecución.

## Comandos

```bash
npm install
npm run tts        # narración con voz del sistema (borradores)
npm run align      # timestamps por palabra con faster-whisper local
npm run sfx        # regenera el kit de SFX
npm run studio     # preview interactivo
npm run render     # MP4 final en out/
node scripts/tts-fal.mjs            # DRY RUN: costo de narrar con ElevenLabs vía fal
node --env-file=../../path/a/.env scripts/tts-fal.mjs --yes   # genera con Alex (voz en script JSON); luego: SKIP_SYNTH=1 npm run tts && npm run align
node scripts/tts-fal.mjs --yes --probe "Hello"              # prueba de 1 frase (< 1 centavo)
node scripts/tts-fal.mjs --yes --only intro                  # regenera una sola escena
```

> Nota: el `chrome-headless-shell` que descarga Remotion falla en esta máquina
> (`icudtl.dat not found in bundle`); `remotion.config.ts` apunta al Chrome del sistema.

## Cómo se están haciendo estos videos (investigación, nov 2026)

Resumen de lo que encontré; fuentes al final.

**1. Remotion + Claude Code es ya el stack estándar para "video con código".**
Remotion publica un skill oficial (`npx skills add remotion-dev/skills`) que le enseña a Claude
la API y las reglas (frames, `<Sequence>`, nada de animaciones no deterministas). Hay toolkits
comunitarios encima (Claude-Code-Video-Toolkit, awesome-claude-video-skills) con temas,
transiciones, brand profiles y comandos tipo `/explainer`. El flujo típico: Claude investiga →
escribe guion de 5 escenas → genera componentes React → abre Remotion Studio → renderiza.

**2. Dos capas de producción que se combinan.**
- *Render por código* (Remotion, Three.js, Manim): diagramas, títulos, datos, 3D esquemático,
  subtítulos. Barato, repetible, editable.
- *Footage generado por IA* (Veo 3, Kling, Seedance, LTX): planos "cinematográficos" (una fab,
  un centro de datos, una máquina EUV). Se usa como B-roll; para consistencia se generan primero
  imágenes de referencia por plano (estilo fijo) y luego se animan. Kling ~0.03 USD/s; Veo 3 es
  el de más calidad y con audio.
- Ensamble: Remotion/FFmpeg ponen el B-roll de fondo y la capa de código encima.

**3. La voz va primero y define el timing ("TTS-first").**
Los pipelines serios generan la voz, obtienen timestamps por palabra (ElevenLabs los da nativo;
Whisper si el TTS no) y a partir de eso alinean subtítulos y animaciones. Normalización final
de loudness a −16 LUFS.

**4. Lo difícil no es el modelo, es la orquestación.** Continuidad narrativa entre escenas,
ritmo de la voz, recuperar cuando una escena falla, QA automático. Ahí es donde Claude Code
aporta: un agente que recorre guion → assets → código → render → revisión.

## Sobre la voz

Lo que ya tienes en Mia Studio sirve tal cual: **ElevenLabs a través de fal.ai** (`fal-ai/elevenlabs/tts/*`,
una sola `FAL_KEY`). fal acepta nombres de las ~20 voces premade ("Brian") o el **id** de una voz de la librería
pública; "Alex" por nombre falla (`Voice not found`), su id es `yl2ZDV1MzN4HbQJbMihG` y va en `script/*.json`
(`voice`). La respuesta trae timestamps por carácter (formato ElevenLabs) que se guardan en
`public/narration/<escena>.fal-timestamps.json`; para los subtítulos seguimos usando whisper local alineado al guion.

| Opción | Calidad es-MX | Timestamps | Costo (este video, 1,155 chars) | Uso |
|---|---|---|---|---|
| macOS `say` (Paulina) | aceptable, robótica | whisper local | 0 | borradores (lo que usa la PoC) |
| **fal → ElevenLabs multilingual-v2** | muy buena, 29 idiomas, `speed` 0.7–1.2 | `timestamps: true` (y whisper local de respaldo) | ≈ $0.12 | **producción** |
| fal → ElevenLabs turbo-v2.5 | buena, misma API | sí | ≈ $0.06 | volumen |
| fal → ElevenLabs eleven-v3 | la más expresiva; sin `speed` | sí | ≈ $0.12 | narración dramática |
| Kokoro / F5-TTS local | media / variable en español | whisper | 0 | si no quieres API |

Recomendación: multilingual-v2 con una voz **nativa en español** de la librería de ElevenLabs (busca una es-MX
masculina o femenina de narración, copia su id y pásalo con `--voice <id>`). La pronunciación de "NVIDIA",
"ASML", "EUV" mejora si en el guion escribes "ene-vidia", "a-ese-eme-ele", "e-u-ve" solo para el TTS.

Los timestamps por palabra ya los resuelve gratis **faster-whisper** (el mismo que usa el `autocut` de Mia,
Python 3.12 de pyenv), alineados al texto del guion para que los subtítulos no hereden errores de transcripción.

## Qué sigue

1. Narración con ElevenLabs vía fal (`node scripts/tts-fal.mjs --yes`) con una voz nativa es-MX.
2. B-roll generado (fal: imagen de referencia por plano → Kling/Veo) detrás del 3D en cada nivel.
3. Pase de sonido con el skill `sound-effects` de Barty-Bart (cortes al beat, −16 LUFS).
4. Versión vertical 1080×1920 del mismo guion (misma data, otro layout) para Shorts/Reels.
5. Un comando `/video <tema>` que encadene investigación → guion con beats → TTS → align → render → revisión de frames.

## Fuentes

- https://blog.openreplay.com/making-videos-claude-code-remotion/
- https://github.com/wilwaldon/Claude-Code-Video-Toolkit
- https://github.com/zhuyansen/awesome-claude-video-skills
- https://jonathansblog.co.uk/the-remotion-claude-code-skill-generate-videos-programmatically-with-ai
- https://www.dplooy.com/blog/claude-code-video-with-remotion-best-motion-guide-2026
- https://www.sabrina.dev/p/claude-remotion-unlocks-unlimited
- https://vanja.io/ai-explainer-videos/
- https://starlog.is/articles/ai-dev-tools/prajwal-y-video-explainer/
- https://humzakt.github.io/blog/ai-video-generation-pipeline-architecture.html
- https://pexo.ai/blog/programmatic-vs-ai-generated-video-with-claude-code-remotion-hyperframes-and-pexo-compared-6108
- https://www.remotion.dev/docs/three
- https://www.remotion.dev/docs/use-video-texture
- https://www.stackscale.com/blog/asml-the-european-company-making-ai-chips-possible/
- https://liveinthefuture.org/stories/asml-euv-bottleneck-ai-chip-ceiling.html
- https://fffinstill.com/blog/ai-semiconductor-supply-chain
- https://github.com/haidrrrry/claude-remotion-skill
- https://github.com/remotion-dev/skills
- https://github.com/kevinbadi/open-edits
- https://github.com/Barty-Bart/motion-graphics
- https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2
- https://blog.editorduel.com/blog/johnny-harris-detective-story-formula-explainer-videos
- https://www.creatoros.ca/blog/fireship-style-video-editing-with-ai/
- https://remotion.dev/templates/tiktok
- https://www.theaireport.ai/partner-columns/nvidias-supply-chain--part-1
