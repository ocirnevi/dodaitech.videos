# Feedback de Enrico · Mi Nutriólogo

## mn-kiwis v3 (9 nov 2026) — "está excelente"
- **Palabras repetidas en la misma pantalla.** A veces la misma palabra aparece arriba (titular o pill) y abajo (subtítulo karaoke) al mismo tiempo,
  p. ej. "kiwis" en el titular mientras el karaoke dice "dos kiwis", o la pill "actinidina" cuando el karaoke muestra "llamada actinidina".
  No se corrige en este video; **cuidarlo desde el siguiente**: el texto fijo de la escena (titular, pill, contador) debe decir algo distinto
  a lo que el karaoke va a mostrar en ese instante, o aparecer antes/después de que el karaoke pase por esa palabra. Regla en `CLAUDE.md` (Ritmo).

## mn-lemon v1 → v2 (9 nov 2026)
- **"Que se sientan rápidos pero se entiendan."** Los clips traían ≈ 0.5–0.7 s de silencio al final de cada escena (≈ 5–7 s muertos por video). Desde ahora: `scripts/tighten-narration.py` tras cada voz (recorte de silencios + tempo 1.08) y GAP de 2 frames. Aplicado también a los kiwis (mn-kiwis v4).
