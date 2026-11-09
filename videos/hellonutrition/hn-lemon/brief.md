# Short · "Lemon unlocks plant iron" — Hello Nutrition AI — compuertas 0 y 1

**Estado:** v2 final (`out/hn-lemon/final-v2.mp4`, 1080×1920, −14 LUFS), 9 nov 2026. v1 → v2: silencios recortados y voz a tempo 1.08 (`scripts/tighten-narration.py`), GAP 2 frames; sin voz nueva.
Guion de Enrico palabra por palabra (9 escenas, 78 palabras, 27.8 s de voz). Voz Matilda (ElevenLabs multilingual-v2 vía fal MCP).
Sin host. Puesta en escena compartida entre los dos canales: `src/shorts/Lemon.tsx` (`makeLemon`), textos en `copy` de `src/shorts/HnLemon.tsx`.
**Regla nueva aplicada (feedback kiwis):** ningún texto fijo repite la palabra que el karaoke muestra en ese instante: titulares parafraseados, alimentos como iconos sin etiqueta, el nombre del canal entra cuando la voz ya lo dijo.

## Compuerta 0 · Packaging

**Armature:** *Plant iron is hard to absorb, but vitamin C unlocks it: a squeeze of lemon (or peppers and tomatoes) with beans and lentils means more iron for your body.*

**Momento de 5 segundos:** el candado sobre la ficha "Fe" se abre cuando entra la rodaja de limón con su "C".

**Inicio = opuesto del final:** abre con una fruta que no parece tener que ver con el hierro y cierra con qué poner en el plato.

**Títulos:**
- A. *Lemon unlocks plant iron*
- B. *The lemon trick for more iron*
- C. *Your beans are missing one thing*

**Texto del frame 1:** **"Add citrus. Get the most from beans."**

## Compuerta 1 · Guion · visual

Protagonista visual: **la ficha periódica "Fe"** (hierro) y la rodaja de limón (amarillo del sitio `#F1C40F`, color del objeto, no segundo acento).

| escena | voz | visual |
|---|---|---|
| hook | Did you know that squeezing lemon on your food can help your body absorb more iron? | Claro. Titular parafraseado ("Add citrus. Get the most from beans."); la rodaja de limón cae sobre la ficha Fe y la hace brillar en "iron". |
| why | Here's why. | Oscuro: ficha periódica "26 · Fe · iron" grande, sola (sin titular: el karaoke ya dice "Here's why"). |
| foods | Foods like beans, lentils, and spinach contain iron. | Tres iconos de línea sin etiqueta (frijol, lentejas, hoja) con insignia Fe; cada uno entra en su palabra. |
| but | But your body has a harder time absorbing iron from plants. | La ficha Fe se apaga y le cae un candado en "harder"; titular "Locked." |
| vitc | That's where vitamin C comes in! | Giro, claro: rodaja de limón grande con insignia "C"; titular "The key: a lemon." |
| absorb | It helps your body absorb more of that iron. | El candado se abre y sale volando en "absorb"; chips Fe suben en "iron"; titular "Unlocked." |
| beans | So next time you eat beans, add some lemon. | Tazón de frijoles; el limón entra y exprime tres gotas en "lemon"; titular "Try it tonight:". |
| pair | Or pair your lentils with bell peppers or tomatoes. | Lentejas + pimiento + jitomate, con "C" en los dos últimos; titular "No lemon? Try:". |
| follow | Follow Hello Nutrition AI for more nutrition tips! | Logo; el nombre del canal entra en "more" (cuando la voz ya lo dijo); sub "simple · science-backed". |

**Fuentes (`sources[]`):**
- Hallberg L. et al. *The role of vitamin C in iron absorption.* Int J Vitam Nutr Res Suppl 1989;30:103-108.
- Teucher B. et al. *Enhancers of iron absorption: ascorbic acid and other organic acids.* Int J Vitam Nutr Res 2004;74(6):403-419.
- Hurrell R., Egli I. *Iron bioavailability and dietary reference values.* Am J Clin Nutr 2010;91(5):1461S-1467S.
- **Las referencias las puso Claude de memoria; verificar antes de publicar.** El video no da cifras, solo "más hierro".

## Qué revisar
- El titular del hook no dice "limón" ni "hierro" a propósito (regla de no repetir con el karaoke); la ficha "Fe" y la rodaja lo dicen en imagen. Si prefieres la palabra, se cambia solo el texto.
- Limón en amarillo: única excepción al acento verde único, porque un limón verde se lee como lima.
