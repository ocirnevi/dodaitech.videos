# Canal · Hello Nutrition AI

- **Qué es:** nutrición con base científica, inglés, Shorts de 30–45 s. Sin cara (no hay host); la marca es el personaje.
- **Identidad (de dev.hellonutrition.ai, 8 nov 2026):** fondo gris claro `#F4F4F6`, tinta `#0B0B0F`, gris de marca `#6E6E73`; modo oscuro `#0B0B0F` / tarjeta `#1C1C21`.
  Un solo acento en video: verde proteína `#2ECC70` (en el sitio hay además azul carbs `#3498DB`, amarillo grasa `#F1C40F`, rojo calorías `#E74D3C`).
  Fuente **Onest** (variable, copiada del sitio a `public/fonts/onest/`). Logo: manzana-corazón negra + "Hello Nutrition.AI" (monocromo), en `public/brand/hellonutrition/`.
  Tokens en `src/brands/hellonutrition.ts`; se inyectan con `BrandProvider` (ver `src/theme.ts`), así los componentes compartidos sirven a los dos canales.
- **Voz:** Matilda (ElevenLabs premade, cálida) a 1.05, `style` 0.3. Alternativas si no gusta: Sarah, Jessica, Lily.
- **Outro:** logo + "Hello Nutrition.AI" + hellonutrition.ai, 1.5 s. El guion suele cerrar con "Follow Hello Nutrition AI for more science-backed nutrition tips!".
- **Datos:** toda afirmación de salud lleva estudio en `sources[]` del guion y en la descripción; evitar cifras que no vengan del estudio.
- **Feedback de Enrico:** `videos/hellonutrition/FEEDBACK.md`.
