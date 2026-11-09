# Short · "Two kiwis a day" — Hello Nutrition AI — compuertas 0 y 1

**Estado:** v2 final (`out/hn-kiwis/final-v2.mp4`, 1080×1920, −14 LUFS), 9 nov 2026. Primer video del canal.
v1 (43.7 s) → v2: silencios recortados y voz a tempo 1.08 (`scripts/tighten-narration.py`), GAP 2 frames; sin voz nueva (feedback "que se sientan rápidos").
Guion de Enrico palabra por palabra (11 escenas, ≈ 95 palabras, 40.5 s de voz). Voz Matilda (ElevenLabs multilingual-v2 vía fal MCP, ≈ $0.06).
Sin host. Identidad del canal desde dev.hellonutrition.ai (`src/brands/hellonutrition.ts`, `videos/hellonutrition/channel.md`).
Ritmo según el feedback de ai-agents: GAP 3 frames, ajuste a beat ≤ 4, tres bloques (gancho y dato → por qué → qué hacer), "contain"→"together" sin corte.

## Compuerta 0 · Packaging

**Armature:** *Dos kiwis verdes al día son un remedio barato y con evidencia para el estreñimiento: fibra, agua y actinidina hacen el trabajo; no hacen falta suplementos.*

**Momento de 5 segundos:** la rodaja de kiwi se "explica": de ella salen fibra, agua y actinidina, y las tres se funden en "healthy digestion".

**Inicio = opuesto del final:** abre con una pregunta rara ("poop more regularly?") y cierra con la marca y una instrucción simple.

**Títulos:**
- A. *Two kiwis a day* (el del frame 1)
- B. *The cheapest fix for constipation is a fruit*
- C. *Eat this twice a day to poop better*

**Texto del frame 1:** **"Two kiwis a day to poop regularly?"** (7 palabras)

## Compuerta 1 · Guion (el de Enrico) · visual

Protagonista visual: **la rodaja de kiwi** (2D plana: piel, pulpa verde = acento del canal, corazón pálido, semillas).

| escena | voz | visual |
|---|---|---|
| hook | Did you know that eating just two kiwis a day could help you poop more regularly? | Claro. Titular del frame 1; dos rodajas entran rebotando. |
| yep | Yep. Two kiwis! | Contador "2 · green kiwis a day"; las rodajas pulsan en "Two". |
| research | Research suggests that eating two green kiwis daily can help improve constipation and reduce digestive discomfort. | Dos filas con check: "less constipation", "less digestive discomfort"; cita Gearry 2023 abajo. |
| why | Here's why. | Oscuro: la rodaja grande, sola. |
| contain | Kiwis contain fiber, water, and a natural enzyme called actinidin that helps break down proteins. | Pills "fiber", "water", "actinidin" salen de la rodaja en su palabra. |
| together | Together, these may support healthy digestion. | Sin corte: las tres pills se funden en la rodaja; halo verde en "digestion". |
| best | And the best part? | Claro. Frase grande. |
| noneed | You don't need expensive supplements or complicated routines. | Pills tachadas en su palabra. |
| try | Just try adding two green kiwis to your daily diet. | Dos rodajas + pill "every day". |
| small | Small changes can make a big difference. | "Small changes." / "Big difference." en verde, crece en "big". |
| follow | Follow Hello Nutrition AI for more science-backed nutrition tips! | Logo + "Hello Nutrition.AI" + "science-backed nutrition tips". Outro con wordmark y hellonutrition.ai. |

**Fuentes (en el guion, `sources[]`):**
- Gearry R. et al. *Consumption of 2 Green Kiwifruits Daily Improves Constipation and Abdominal Comfort — Results of an International Multicenter RCT.* Am J Gastroenterol 2023;118(6):1058-1068.
- Chey S.W. et al. *Exploratory Comparative Effectiveness Trial of Green Kiwifruit, Psyllium, or Prunes in US Patients With Chronic Constipation.* Am J Gastroenterol 2021;116(6):1304-1312.
- Actinidina: proteasa del kiwi que ayuda a digerir proteínas (Kaur L. et al., J Agric Food Chem 2010).
- **Las referencias las puso Claude de memoria; verificar antes de publicar.**

## Qué revisar
- ¿La voz Matilda va con el canal? Alternativas: Sarah, Jessica, Lily (≈ $0.06 cada regeneración).
- ¿El verde kiwi como único acento, o prefieres el monocromo del sitio con el verde solo en el kiwi?
- Duración 43.7 s, dentro del objetivo de ≤ 45 s.
