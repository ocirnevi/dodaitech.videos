# HeyGen y avatares para Shorts educativos programáticos

Investigación 7 nov 2026. **[OFICIAL]** = páginas de HeyGen/fal/sync/Tavus; **[3ros]** = blogs.

## 1. HeyGen MCP y API

> **Actualización 8 nov 2026 (sesión en la nube).** El conector oficial "HeyGen" de claude.ai (OAuth, plan web) sí acepta nuestro audio: `create_asset_upload` → PUT → `complete_asset_upload`, y `create_video_from_avatar` con `audio_asset_id`, `aspect_ratio 9:16`, `resolution 1080p` (Creator) y `output_format webm` (alfa). Un photo avatar de 3 s costó 2 créditos del plan (4 por hook + cierre). Receta aplicada en `src/components/AvatarHost.tsx` (ai-memory). La nota de abajo sobre el MCP "solo texto" era del paquete `heygen-mcp` de PyPI, no del conector.

- **MCP oficial** `heygen-com/heygen-mcp` (MIT, "early development"; [PyPI heygen-mcp](https://pypi.org/project/heygen-mcp/) v0.0.3, abr-2025; [Glama](https://glama.ai/mcp/servers/heygen-com/heygen-mcp)). Tools: `get_remaining_credits`, `get_voices`, `get_avatar_groups`, `get_avatars_in_avatar_group`, `generate_avatar_video` (avatar + **texto** + voz), `get_avatar_video_status`. **Limitación**: solo acepta texto (TTS de HeyGen); no sube nuestro MP3 de ElevenLabs ni pide 9:16/WebM. Sirve para explorar avatares; el pipeline real va por REST desde un script.
- Instalación en Claude Code (requiere `uv`): `claude mcp add --env HEYGEN_API_KEY=TU_KEY --transport stdio --scope user heygen -- uvx heygen-mcp`
- **API sin créditos gratis desde feb-2026**: pay-as-you-go, los créditos del plan web no sirven para la API ([HeyGen API plans](https://intercom.help/heygen/en/articles/10060327-new-heygen-api-plans)).
- **REST v3 acepta nuestro audio** y sincroniza labios: `POST /v3/videos` con `type: "avatar"`, `avatar_id`, `audio_url` o `audio_asset_id` (subido con `POST /v3/assets`), `aspect_ratio: "9:16"`, `resolution: "1080p"`, `engine` (`avatar_iv` default, `avatar_v`), `motion_prompt`, `background`, `output_format: mp4|webm`, `callback_url` ([Audio to Video](https://developers.heygen.com/audio-to-video.md), [Upload Asset](https://developers.heygen.com/reference/upload-asset.md)).

## 2. Tipos de avatar

| Tipo | Input | Consentimiento | Movimiento | 9:16 | Transparencia |
|---|---|---|---|---|---|
| **Photo Avatar / Avatar IV** | 1 foto | No | cabeza + micro-expresiones; gestos vía `motion_prompt` | Sí | WebM alfa vía API |
| **Digital Twin (Video Avatar)** | video ≥2 min, 1080p30, con tu voz | **Sí**, video de consentimiento grabado en vivo (<30 s, leyendo texto, misma sesión) | cuerpo y manos reales; Avatar V añade gestos por prompt | Sí | WebM alfa si entrenado con matting (default desde ~may-2025) |
| Interactive | streaming | — | — | — | no aplica a Shorts |

Fuentes: [Digital Twin con Avatar IV](https://help.heygen.com/en/articles/12089286-create-your-first-digital-twin-with-avatariv), [Photo-to-Video](https://help.heygen.com/en/articles/12623520-how-to-create-an-avatar-using-the-avatar-iv-photo-to-video), [Models](https://developers.heygen.com/models), [consent](https://help.heygen.com/en/articles/12092609-recording-your-consent-video).

**Transparencia**: no hay green screen nativo pero sí **WebM con canal alfa** (`output_format: "webm"`, sin `background`, avatar entrenado con matting) ([Transparent background videos](https://developers.heygen.com/transparent-background-videos.md)). En Remotion: `<OffthreadVideo src="avatar.webm" transparent />`. El **Avatar Hub** es la pantalla unificada para los tres caminos; solo los Digital Twins exigen consentimiento.

## 3. Precios 2026

Web: Free (1 min, marca de agua), Creator $29/mes (600 créditos), Pro $49, Business $149 ([pricing](https://www.heygen.com/pricing)). Avatar IV: 16 cr/min (foto) o 31 cr/min (video look).
API pay-as-you-go: Avatar IV Photo 46 cr/min, IV Digital Twin 97, Avatar V 144 (≈ $0.05/crédito; HeyGen resume "~$4 por minuto de Avatar IV 1080p"). **Para un Short con 3 s de hook + 3 s de outro: ≈ $0.25–0.70.** ([Avatar IV guide](https://help.heygen.com/en/articles/11269603-heygen-avatar-iv-complete-guide))

## 4. Alternativas

| Modelo | Input | Precio | Fondo |
|---|---|---|---|
| **sync. lipsync-2** ([fal](https://fal.ai/models/fal-ai/sync-lipsync/v2)) | video + audio | $0.05/s | el del video. Mejor opción si **tú grabas** un clip 9:16 y re-sincronizas labios al audio de ElevenLabs |
| **Kling LipSync** ([fal](https://fal.ai/models/fal-ai/kling-video/lipsync/audio-to-video)) | video 2–10 s + audio | $0.014 por 5 s | del video. Muy barato; justo para hook/outro |
| OmniHuman 1.5 | foto + audio | $0.16/s | fijo (croma) |
| MiniMax H3 Max Lip Sync | foto + audio | $0.05–0.16/s | fijo |
| LatentSync (open source) | video + audio | $0.20/request | del video; calidad inferior |
| Tavus ([pricing](https://www.tavus.io/pricing)) | replica + audio | $0.80–1/min | **alfa nativo** |
| Captions Mirage | foto + audio | $0.15/s | fijo |

Solo HeyGen (WebM alfa) y Tavus dan transparencia nativa.

## 5. ¿Conviene una cara en un Short educativo?

- Avatar fotorrealista ≈ humano en retención y confianza **cuando no se nota**, pero la confianza cae si se revela a mitad; el "uncanny penalty" real es de **disclosure**: declarar "avatar IA" en etiqueta y descripción ([simpleshow/USF](https://simpleshow.com/blog/can-ai-avatars-replace-the-human-touch-in-videos/), [Hardman](https://drphilippahardman.substack.com/p/future-of-learning-or-a-dystopian?open=false)).
- Eye-tracking (Sondermann 2022/2024): la cara del instructor **roba atención a los gráficos** y baja el recuerdo factual si está presente todo el tiempo.
- Plataforma: desde jun-2026 canales faceless sufren desmonetización bajo "inauthentic content"; YouTube niega una señal "cara humana" ([TNW](https://thenextweb.com/news/youtube-ai-slop-crackdown-faceless-creators-collateral-damage)). Voz IA 55 % vs avatar 12.6 % y en declive en 756k videos ([Revid](https://www.revid.ai/blog/the-anatomy-of-a-viral-short-2026)).

**Recomendación**: no avatar a pantalla completa ni PiP permanente. Sí un **host recurrente y breve**: hook 1–3 s a cámara + outro 2–3 s, mismo avatar siempre. Pipeline: recortar el audio de ElevenLabs a esos tramos → `POST /v3/assets` → `POST /v3/videos` 9:16 1080p WebM → Remotion compone el WebM alfa sobre los gráficos; cachear por hash del texto. Mejor relación realismo/costo: grabar 2–5 min y crear un **Digital Twin** (consentimiento en vivo); plan B barato: grabar 10 clips reales 9:16 de hook y re-sincronizar con sync lipsync-2 o Kling por centavos. Declarar IA. Medir con 10 Shorts con/sin hook de avatar antes de escalar.

No verificado: README del repo en GitHub (404), páginas de fal para Hedra/InfiniteTalk, tabla API de D-ID, docs públicas de "Avatar Hub".

## 7. Receta anterior (8 nov 2026, descartada después): look "home studio" + mitad y mitad

- **Look** (photo avatar generado por prompt a partir de su foto, grupo `f9cf7896951d4c5ca24ca40572828a23`, look `4da97a64ac28f83e7174eb3e4502b64a`), creado con `create_prompt_avatar` + `avatarId` de la foto original, `aspectRatio 9:16`. Prompt guardado en `script/ai-memory.json → host.heygen.look_prompt`:
  > The same man from the reference photo, exact same face, short dark hair and light stubble, wearing a dark navy fleece quarter-zip. He is sitting casually in a cozy home studio talking to camera like a YouTuber: medium shot from the chest up, centered, natural relaxed posture, slight friendly smile. Background softly out of focus: a warm wooden shelf with a few books and a small plant, a warm desk lamp glow on the left, neutral beige wall. Soft natural window light from the right, realistic skin, no heavy retouching, shot on a mirrorless camera 35mm, vertical 9:16 framing, photorealistic.
- **Clip**: `create_video_from_avatar` con ese look, `audio_asset_id` del clip de Alex, `engine avatar_v`, `9:16`, `1080p`, `mp4` (el fondo del look se queda). ≈ 3 créditos por clip de 3 s. `motion_prompt`/`more_blinking` no aplican sin Digital Twin.
- **Composición**: `src/components/HostSplit.tsx`, formato reel: gráficos arriba (0–960), avatar abajo (960–1920, `focusY 0.32`), línea naranja en el corte, subtítulos sobre la línea, etiqueta "AI avatar". Solo hook y cierre.
- Descartados: tarjeta con WebM alfa (se veía recortado, "no natural"), foto original con Avatar IV/V (muy cerca, fondo liso). Otros looks generados y guardados por si acaso: escritorio con micrófono, sofá y ventana, estudio oscuro (ids en el script).

### Aprendido en las pruebas P1–P5 (8 nov)
- La "sonrisa falsa" viene del **look** (la imagen base), no del motor: pedir en el prompt "calm neutral resting face, lips closed, no smile" produce un punto de partida natural.
- Con photo avatars, `motion_prompt` y `expressiveness` **sí** funcionan en `avatar_iv`; en `avatar_v` se rechazan si el grupo no tiene Digital Twin (también `more_blinking`).
- Variar encuadre/fondo cuesta ~1 crédito por look (imagen) y ~3 por clip de 3 s. Prompts completos y ajustes de cada prueba en `script/ai-memory.json → host.heygen.tests_8nov`.

## 8. Receta vigente (8 nov 2026, tarde): P2 "escritorio neutro" + Avatar IV con movimiento

Elegida por Enrico entre cinco pruebas (P1–P5). Prompt completo, ids y ajustes en `script/ai-memory.json → host.heygen.chosen`.

- **Foto base**: segundo retrato (fondo oscuro, luz naranja), asset `4a8fe4153db540b6a525ea9d30ee8d99`, grupo `d058fd46feb6439c24a9fa9c6291ae87`.
- **Look** (`create_prompt_avatar`, 9:16, look `329327dec229991ace01dff9237155b2`):
  > The same man from the reference photo, exact same face, nose, eyes and hairstyle, short dark hair, light stubble, wearing a plain charcoal gray crew-neck sweater. Expression: calm, neutral resting face with lips closed, no smile, relaxed, direct eye contact with the lens. Tech YouTuber desk, vertical 9:16, photorealistic: he sits at a dark wooden desk slightly turned toward the camera, framed from the chest up to the top of the desk with generous headroom, camera about 1.8 meters away at eye level, 35mm lens. A podcast microphone on a boom arm enters from the right edge, the edge of a monitor glows softly on the left. Background out of focus: charcoal wall, floating shelf with a few books and a small plant, a warm orange LED strip under the shelf, a warm desk lamp. Soft key light from the front-left, warm rim light from behind. Realistic skin texture, no retouching, natural color grading.
- **Clip** (`create_video_from_avatar`): `audio_asset_id` del clip de Alex, `engine avatar_iv`, `expressiveness high`, `motion_prompt` ("Talks with natural hand gestures like explaining something to a friend, leans slightly toward the camera, nods once, natural blinking."), `9:16`, `1080p`, `mp4`. ≈ 3 créditos por 3 s.
- **Composición**: `HostSplit` (gráficos arriba, Enrico abajo), solo hook y cierre.
