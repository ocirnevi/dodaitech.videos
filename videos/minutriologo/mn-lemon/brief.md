# Short · "El limón libera el hierro vegetal" — Mi Nutriólogo — compuertas 0 y 1

**Estado:** v2 final (`out/mn-lemon/final-v2.mp4`, 1080×1920, −14 LUFS), 9 nov 2026. v1 → v2: silencios recortados y voz a tempo 1.08 (`scripts/tighten-narration.py`), GAP 2 frames; sin voz nueva.
Guion de Enrico palabra por palabra, traducido y adaptado al español (9 escenas, 88 palabras, 33.4 s de voz). Voz Matilda (ElevenLabs multilingual-v2 vía fal MCP).
Sin host. Puesta en escena compartida entre los dos canales: `src/shorts/Lemon.tsx` (`makeLemon`), textos en `copy` de `src/shorts/MnLemon.tsx`.
**Regla nueva aplicada (feedback kiwis):** ningún texto fijo repite la palabra que el karaoke muestra en ese instante: titulares parafraseados, alimentos como iconos sin etiqueta, el nombre del canal entra cuando la voz ya lo dijo.

## Compuerta 0 · Packaging

**Armature:** *El hierro vegetal se absorbe mal, pero la vitamina C lo libera: un chorrito de limón (o pimientos y jitomate) con frijoles y lentejas significa más hierro para tu cuerpo.*

**Momento de 5 segundos:** el candado sobre la ficha "Fe" se abre cuando entra la rodaja de limón con su "C".

**Inicio = opuesto del final:** abre con una fruta que no parece tener que ver con el hierro y cierra con qué poner en el plato.

**Títulos:**
- A. *El limón libera el hierro vegetal*
- B. *El truco del limón para absorber más hierro*
- C. *A tus frijoles les falta una cosa*

**Texto del frame 1:** **"Agrega cítrico. Aprovecha mejor tus frijoles."**

## Compuerta 1 · Guion · visual

Protagonista visual: **la ficha periódica "Fe"** (hierro) y la rodaja de limón (amarillo del sitio `#F1C40F`, color del objeto, no segundo acento).

| escena | voz | visual |
|---|---|---|
| hook | ¿Sabías que exprimir limón sobre tu comida puede ayudar a tu cuerpo a absorber más hierro? | Claro. Titular parafraseado ("Agrega cítrico. Aprovecha mejor tus frijoles."); limón sobre la ficha Fe, brillo en "hierro". |
| why | Te explico por qué. | Oscuro: ficha periódica "26 · Fe · iron" grande, sola (sin titular: el karaoke ya dice "Here's why"). |
| foods | Alimentos como los frijoles, las lentejas y las espinacas contienen hierro. | Tres iconos de línea sin etiqueta (frijol, lentejas, hoja) con insignia Fe; cada uno entra en su palabra. |
| but | Pero a tu cuerpo le cuesta más absorber el hierro de las plantas. | Candado en "cuesta"; titular "Bloqueado." |
| vitc | ¡Ahí es donde entra la vitamina C! | Giro, claro: rodaja de limón grande con insignia "C"; titular "The key: a lemon." |
| absorb | Ayuda a tu cuerpo a absorber más de ese hierro. | Candado se abre en "absorber", chips Fe en "hierro"; titular "Desbloqueado." |
| beans | Así que la próxima vez que comas frijoles, agrégales limón. | Tazón de frijoles; el limón entra y exprime tres gotas en "lemon"; titular "Try it tonight:". |
| pair | O acompaña tus lentejas con pimientos o jitomate. | Lentejas + pimiento + jitomate, con "C" en los dos últimos; titular "No lemon? Try:". |
| follow | ¡Sigue a Mi Nutriólogo para más consejos de nutrición! | Logo; "Mi Nutriólogo" entra en "más"; sub "simple y con ciencia". |

**Fuentes (`sources[]`):**
- Hallberg L. et al. *The role of vitamin C in iron absorption.* Int J Vitam Nutr Res Suppl 1989;30:103-108.
- Teucher B. et al. *Enhancers of iron absorption: ascorbic acid and other organic acids.* Int J Vitam Nutr Res 2004;74(6):403-419.
- Hurrell R., Egli I. *Iron bioavailability and dietary reference values.* Am J Clin Nutr 2010;91(5):1461S-1467S.
- **Las referencias las puso Claude de memoria; verificar antes de publicar.** El video no da cifras, solo "más hierro".

## Qué revisar
- El titular del hook no dice "limón" ni "hierro" a propósito (regla de no repetir con el karaoke); la ficha "Fe" y la rodaja lo dicen en imagen. Si prefieres la palabra, se cambia solo el texto.
- Limón en amarillo: única excepción al acento verde único, porque un limón verde se lee como lima.
