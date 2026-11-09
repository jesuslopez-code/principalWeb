# Correcciones (fixes) — principalWeb

Log de fallos encontrados al **probar** el sitio. Registrar en el momento; no depender de la
memoria. Los dos primeros están anotados desde el arranque porque ya se sabe que existen: son el
resultado de la limpieza a medias y se resuelven en la Fase 1.

**Estado:** ✅ ARREGLADA · 🔧 EN CURSO · ⏳ PENDIENTE. Las ✅ se mueven a `fixes-archivo.md` al cerrar
cada fase o módulo.

## FIX-007 — Rendimiento móvil Lighthouse bajo en esta máquina (TBT 580-1350 ms), no atribuible a la demo

- **Estado:** ℹ️ INFORMATIVO (no es fallo de la tarea)
- **Medición 2026-11-08 (build de producción, móvil, 3 pasadas cada una):** con demo Rend. 67/77/81, A11y
  100, BP 100, SEO 100, LCP 3.3/1.1/1.1 s, CLS 0.001/0.001/0 . Línea base en la misma máquina sustituyendo la
  demo por las dos capturas antiguas (copia temporal fuera del repo): Rend. 72/78/85, LCP 3.3/1.0/0.9 s,
  CLS 0.001. Diferencia ~4-5 puntos, dentro del ruido; la mediana de hoy es inferior a la histórica (90-98) también
  sin la demo. La primera pasada de cada serie sale peor (LCP 3,3 s, arranque en frío).

## FIX-011 — Lighthouse móvil muy variable en esta máquina; el coste del telón no se puede aislar con certeza

- **Estado:** ℹ️ INFORMATIVO (no es fallo de la tarea)
- **Medición 2026-11-09 (build de producción, móvil; `benchmarkIndex` de Lighthouse entre ≈1000 y ≈2400 según la
  tanda):** a CPU ≈1000 (la mitad), 4 pares intercalados primera visita / visita repetida: oscuro 80-86 (LCP 1,2 s,
  CLS 0, TBT 540-830 ms) frente a 84-92 repetida (LCP 0,7-1,0 s, CLS 0,001, TBT 350-650 ms); claro 81-89 frente a
  84-93. La primera visita (con telón) cuesta ≈3-6 puntos y ≈0,2-0,5 s de LCP frente a la repetida (sin telón);
  A11y/BP/SEO siempre 100. A ≈2100-2400: oscuro primera visita 99 (LCP 1,1 s, CLS 0,003) en una tanda, pero 90-92 con
  LCP 3,1-3,2 s (el `<p>` del hero) en otra, también en visita repetida (arranque en frío, como FIX-007). Escritorio:
  100 siempre, LCP 0,2-0,3 s, CLS 0,001-0,004. El elemento LCP es el `<h1>` del hero (a veces el `<p>` o el `<pre>`
  del hero), nunca el telón. No comparable con las cifras de la Fase 7 sin repetir con la máquina en reposo.
