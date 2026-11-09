# Feedback de Enrico · Hello Nutrition AI

(pendiente del primer video, hn-kiwis)

## hn-kiwis v1 / mn-kiwis v3 (9 nov 2026)
- Mismo detalle que en Mi Nutriólogo: a veces el titular o una pill repiten la palabra que el karaoke muestra abajo en ese instante ("kiwis", "actinidina"). Cuidarlo desde el siguiente video; ver `videos/minutriologo/FEEDBACK.md` y la regla en `CLAUDE.md`.

## hn-lemon v1 → v2 (9 nov 2026)
- **"Que se sientan rápidos pero se entiendan."** Los clips traían ≈ 0.5–0.7 s de silencio al final de cada escena (≈ 5–7 s muertos por video). Desde ahora: `scripts/tighten-narration.py` tras cada voz (recorte de silencios + tempo 1.08) y GAP de 2 frames. Aplicado también a los kiwis (hn-kiwis v2).
