# Short · "Protein breakfast keeps you full" — Hello Nutrition AI — compuertas 0 y 1

**Estado:** v1 final (`out/hn-protein/final-v1.mp4`, 25.1 s, 1080×1920, −14 LUFS), 10 nov 2026.
Guion de Enrico palabra por palabra (7 escenas, 74 palabras). Voz Matilda (fal), apretada con `scripts/tighten-narration.py`, GAP 2.
Sin host. Puesta en escena compartida: `src/shorts/Protein.tsx` (`makeProtein`), textos en `copy` de `src/shorts/HnProtein.tsx`.
Reglas aplicadas: ningún texto fijo repite la palabra del karaoke; sin aire muerto; 3 bloques (claro → oscuro → claro).

## Compuerta 0 · Packaging

**Armature:** *Protein at breakfast keeps you full longer: it triggers fullness hormones and digests slower than carbs, so add eggs, Greek yogurt or cottage cheese to your toast or cereal.*

**Momento de 5 segundos:** dos barras lado a lado: la del pan se vacía en un segundo y la del huevo casi no se mueve.

**Inicio = opuesto del final:** abre con un desayuno y cierra a la hora de la comida, todavía sin hambre.

**Texto del frame 1:** **"A breakfast that lasts."**

## Compuerta 1 · Guion · visual

Protagonista visual: **el medidor de saciedad** (tubo verde que se vacía con las horas).

| escena | voz | visual |
|---|---|---|
| hook | Did you know that adding protein to your breakfast can help you feel full longer? | Claro. Titular parafraseado; un huevo cae junto al pan y el medidor de saciedad se llena. |
| why | Here's why. | Oscuro: el medidor grande, solo (sin titular: lo dice el karaoke). |
| hormones | Protein helps your body release hormones that signal fullness to your brain. | Del plato con huevo suben puntos verdes hasta el cerebro, que se ilumina; titular tipo mensaje ("Message: I'm good" / "Mensaje: suficiente"). |
| digest | And it takes longer to digest than carbohydrates alone. | Dos barras: la del pan (gris) se vacía rápido y la del huevo (verde) apenas baja. Titular "Slow burn." / "A fuego lento." |
| swap | So instead of having just toast or cereal for breakfast, try adding eggs, Greek yogurt, or cottage cheese. | Pan y cereal en gris; un "+" y entran huevo, yogur y cottage en su palabra (iconos sin etiqueta). |
| satisfied | You may feel more satisfied and less hungry before lunch. | Gráfica 8 AM → 12 PM: la línea gris cae, la verde se mantiene hasta la comida. |
| follow | Follow Hello Nutrition AI for more nutrition tips! | Logo; el nombre del canal entra cuando la voz ya lo dijo. |

**Fuentes (`sources[]`):**
- Leidy H.J. et al. Am J Clin Nutr 2013;97(4):677-688 (desayuno alto en proteína: menos hambre antes de la comida, más PYY).
- Batterham R.L. et al. Cell Metab 2006;4(3):223-233 (PYY y saciedad por proteína).
- Westerterp-Plantenga M.S. et al. Annu Rev Nutr 2009;29:21-41 (la proteína es el macronutriente más saciante).
- **Referencias puestas por Claude de memoria; verificar antes de publicar.** El video no da cifras.
