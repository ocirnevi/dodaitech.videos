# HeyGen y avatares para Shorts educativos programáticos

Investigación 7 nov 2026. **[OFICIAL]** = páginas de HeyGen/fal/sync/Tavus; **[3ros]** = blogs.

## 1. HeyGen MCP y API

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
