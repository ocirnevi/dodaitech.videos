# videos/ — una carpeta por canal, y dentro una por video

Aquí vive lo que Enrico lee y aprueba: `brief.md` (compuertas 0–1 y estado), `costs.md` (fal y HeyGen), `publish.md` (compuerta 6)
y, por canal, `FEEDBACK.md` (lo que Enrico sintió al ver cada video) y `channel.md` (identidad, voz, outro, tono).
El código y los datos siguen en su tubería por slug: guion en `script/<slug>.json`, composición en `src/shorts/`, datos en `src/data/<slug>/`,
audio en `public/narration/<slug>/`, clips de avatar en `public/avatar/<slug>/`, renders en `out/<slug>/` (no se versionan).
Tema visual por canal en `src/brands/` (dodaitech por defecto; hellonutrition para Hello Nutrition AI; minutriologo, idéntico salvo nombre y sitio, para Mi Nutriólogo).

## dodaitech (`videos/dodaitech/`) — tecnología, inglés, voz Alex, host Enrico (HeyGen P2) opcional

| slug | video | estado |
|---|---|---|
| `ai-iceberg` | The Hidden World Behind ChatGPT | storyboard v3 en revisión |
| `three-nm` | Nothing in a 3 nm chip is 3 nm | prueba de 10 s, voz scratch |
| `ai-memory` | Would you want AI to remember your entire life? | v5 final con voz Alex y host P2 |
| `ai-agents` | Don't let AI replace you. Make it work for you. | v2 final (feedback de ritmo aplicado) |
| `ai-overnight` | AI that works while you sleep | v1 final, voz Alex, host P2 en hook y cierre |

## hellonutrition (`videos/hellonutrition/`) — Hello Nutrition AI, nutrición con base científica, inglés, sin cara

| slug | video | estado |
|---|---|---|
| `hn-kiwis` | Two kiwis a day | v2 final (silencios recortados, tempo 1.08), voz Matilda |
| `hn-lemon` | Lemon unlocks plant iron | v2 final (silencios recortados, tempo 1.08), voz Matilda |
| `hn-protein` | Protein breakfast keeps you full | v1 final, voz Matilda |

## minutriologo (`videos/minutriologo/`) — Mi Nutriólogo, marca propia en español (misma identidad visual que Hello Nutrition AI), sin cara

| slug | video | estado |
|---|---|---|
| `mn-kiwis` | Dos kiwis al día (traducción de `hn-kiwis`) | v4 final (silencios recortados, tempo 1.08), voz Matilda |
| `mn-lemon` | El limón libera el hierro vegetal (traducción de `hn-lemon`) | v2 final (silencios recortados, tempo 1.08), voz Matilda |
| `mn-protein` | Desayuno con proteína: más saciedad (traducción de `hn-protein`) | v1 final, voz Matilda |
