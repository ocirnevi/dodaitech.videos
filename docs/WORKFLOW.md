# Flujo de trabajo: de idea a Short aprobado

Objetivo: que Enrico pueda ver y corregir **antes** de que se gaste tiempo de render o dinero de API,
con revisiones de menos de 5 minutos y comentarios por número.

## Las compuertas

```
0 Packaging ──► 1 Guion ──► 2 Storyboard ──► 3 Animatic ──► 4 Voz final ──► 5 Render final ──► 6 Publicación
  títulos+hook    JSON+tabla   PNG retícula     MP4 540p       fal ($)          MP4 1080p         publish.md
  (videos/<slug>)                voz scratch      voz scratch
```

Lo que los estudios y los mejores creadores hacen igual (ver `05-flujo-de-estudios.md`): **el packaging es la
primera compuerta** (MrBeast, Abdaal, Galloway), el guion la segunda, y el **animatic con voz scratch** es la
aprobación clave porque contiene todas las decisiones caras a costo casi cero. Cada compuerta se cierra (Giant Ant).

### 0. Packaging (`docs/briefs/<slug>.md`)
Tema y la única pregunta que responde · 3 títulos · texto del frame 1 (4–7 palabras, legible sin sonido) ·
el "momento de 5 segundos" (el dato por el que vale la pena llegar al final) · armature en una frase ·
formato y duración objetivo · para quién.

### 1. Guion + beats (`script/<slug>.json`)
Te lo presento como tabla: `t · lo que dice la voz · lo que se ve · dato/beat · fuente`. El JSON es la fuente de verdad:
cada escena tiene `narration`, `beats[]` (dato + palabra gatillo), `mode` y `visual` (qué pieza 3D/2D la ilustra).
Comentas por línea: "L4: cambia 'tens of billions' por el número exacto". Un cambio de narración aquí es gratis.

### 2. Storyboard (`out/<slug>/storyboard-vN.png`)
`scripts/storyboard.mjs` genera voz scratch con `say`, alinea palabras con whisper, renderiza **un frame real por beat**
y arma una hoja numerada (#1…#N) con tiempo, escena, beat y subtítulo. Es la compuerta más importante: aquí se ve
composición, tipografía, color, qué dato aparece y cuándo. Comentas "#4: el contador tapa el chip", "#7: más grande el texto".
Solo se vuelven a renderizar los paneles afectados (`--frames`), la hoja se arma de nuevo en segundos.

### 3. Animatic (`out/<slug>/animatic-vN.mp4`, 540p)
Mismo video con voz scratch, música y SFX, a media resolución (render ~1 min). Aquí se juzga ritmo, cortes,
sonido y si el hook funciona con audio. Si cambia el guion, vuelve a 1 → 2.

### 4. Voz final
ElevenLabs vía fal con Alex. Antes de llamar digo caracteres y costo; espero un sí. Después se re-alinean palabras
(los tiempos cambian respecto a la voz scratch) y se regenera el storyboard solo si algún panel se movió más de 0.5 s.

### 5. Render final
1080×1920, CRF 17, `loudnorm` a −14 LUFS en dos pasadas, pico real ≤ −1 dBTP. Entrego el MP4 y 3 frames extraídos
del archivo final (no del preview) como prueba.

### 6. Kit de publicación (`out/<slug>/publish.md`)
Título (≤ 60 caracteres, con la pregunta), descripción con fuentes, hashtags, el frame de portada, y la versión
del guion en español si se va a publicar doble.

## Convenciones

- Un slug por video (`ai-iceberg`, `chip-supply-chain`). Todo lo suyo vive en `script/<slug>.json` y `out/<slug>/`.
- Versiones: `storyboard-v1.png`, `animatic-v2.mp4`, `final-v1.mp4`. Nunca se sobreescribe una versión aprobada.
- Comentarios por número: `#N` = panel del storyboard, `LN` = línea del guion, `tNN` = segundo del animatic, `OK` cierra la compuerta. Ejemplo: `#3: texto más grande · #4: usa la oblea, no la máquina · OK #1 #2 #5`. Lo guardo como `out/<slug>/feedback-vN.json`.
- "Cambia solo el panel 4" = edito la escena/beat, renderizo solo ese frame y reconstruyo la hoja.
- Costo: cada llamada a fal queda anotada en `out/<slug>/costs.md` (qué, cuánto, fecha).

## Rutina de revisión
Siempre el mismo bloque: artefacto · qué cambió respecto a la versión anterior (lista `#N`) · 1–3 preguntas cerradas · "responde `OK` o `#N: nota`".

## Qué pasa con el logo
Solo en el outro (1.5–2 s): wordmark + dodaitech.com sobre papel piedra. En el resto del video la marca
es el color naranja único, la tipografía y el tono. Nada de wordmark fijo en esquina.
