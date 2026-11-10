# Short · "Desayuno con proteína: más saciedad" — Mi Nutriólogo — compuertas 0 y 1

**Estado:** v1 final (`out/mn-protein/final-v1.mp4`, 29.7 s, 1080×1920, −14 LUFS), 10 nov 2026.
Guion de Enrico palabra por palabra, traducido y adaptado al español (7 escenas, 87 palabras). Voz Matilda (fal), apretada con `scripts/tighten-narration.py`, GAP 2.
Sin host. Puesta en escena compartida: `src/shorts/Protein.tsx` (`makeProtein`), textos en `copy` de `src/shorts/MnProtein.tsx`.
Reglas aplicadas: ningún texto fijo repite la palabra del karaoke; sin aire muerto; 3 bloques (claro → oscuro → claro).

## Compuerta 0 · Packaging

**Armature:** *La proteína en el desayuno te mantiene lleno más tiempo: activa hormonas de saciedad y se digiere más lento que los carbohidratos; agrega huevo, yogur griego o queso cottage a tu pan o cereal.*

**Momento de 5 segundos:** dos barras lado a lado: la del pan se vacía en un segundo y la del huevo casi no se mueve.

**Inicio = opuesto del final:** abre con un desayuno y cierra a la hora de la comida, todavía sin hambre.

**Texto del frame 1:** **"Un desayuno que rinde."**

## Compuerta 1 · Guion · visual

Protagonista visual: **el medidor de saciedad** (tubo verde que se vacía con las horas).

| escena | voz | visual |
|---|---|---|
| hook | ¿Sabías que agregar proteína a tu desayuno puede ayudarte a sentirte lleno por más tiempo? | Claro. Titular parafraseado; un huevo cae junto al pan y el medidor de saciedad se llena. |
| why | Te explico por qué. | Oscuro: el medidor grande, solo (sin titular: lo dice el karaoke). |
| hormones | La proteína ayuda a tu cuerpo a liberar hormonas que le avisan a tu cerebro que ya estás lleno. | Del plato con huevo suben puntos verdes hasta el cerebro, que se ilumina; titular tipo mensaje ("Message: I'm good" / "Mensaje: suficiente"). |
| digest | Y tarda más en digerirse que los carbohidratos solos. | Dos barras: la del pan (gris) se vacía rápido y la del huevo (verde) apenas baja. Titular "Slow burn." / "A fuego lento." |
| swap | Así que, en lugar de desayunar solo pan tostado o cereal, prueba agregar huevos, yogur griego o queso cottage. | Pan y cereal en gris; un "+" y entran huevo, yogur y cottage en su palabra (iconos sin etiqueta). |
| satisfied | Podrías sentirte más satisfecho y con menos hambre antes de la comida. | Gráfica 8 AM → 12 PM: la línea gris cae, la verde se mantiene hasta la comida. |
| follow | ¡Sigue a Mi Nutriólogo para más consejos de nutrición! | Logo; el nombre del canal entra cuando la voz ya lo dijo. |

**Fuentes (`sources[]`):**
- Leidy H.J. et al. Am J Clin Nutr 2013;97(4):677-688 (desayuno alto en proteína: menos hambre antes de la comida, más PYY).
- Batterham R.L. et al. Cell Metab 2006;4(3):223-233 (PYY y saciedad por proteína).
- Westerterp-Plantenga M.S. et al. Annu Rev Nutr 2009;29:21-41 (la proteína es el macronutriente más saciante).
- **Referencias puestas por Claude de memoria; verificar antes de publicar.** El video no da cifras.
