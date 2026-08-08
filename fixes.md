# Correcciones (fixes) — principalWeb

Log de fallos encontrados al **probar** el sitio. Registrar en el momento; no depender de la
memoria. Los dos primeros están anotados desde el arranque porque ya se sabe que existen: son el
resultado de la limpieza a medias y se resuelven en la Fase 1.

**Estado:** ✅ ARREGLADA · 🔧 EN CURSO · ⏳ PENDIENTE.

## FIX-001 — El build falla: import de Firebase que ya no existe

- **Estado:** ⏳ PENDIENTE
- **Dónde:** `src/app/layout.tsx`, línea 4.
- **Problema:** el layout importa `FirebaseClientProvider` desde `@/firebase/client-provider`, pero
  la carpeta `src/firebase/` se borró en la limpieza. La aplicación no compila. `ignoreBuildErrors`
  no lo enmascara porque es un fallo de resolución de módulo, no de tipos.
- **Causa:** el desacople de Firebase borró los ficheros pero no retiró sus usos.
- **Solución:** pendiente (Fase 1, `pweb-frontend-dev`).
- **Verificación:** pendiente.

## FIX-002 — Enlaces muertos en la sección Projects

- **Estado:** ⏳ PENDIENTE
- **Dónde:** `src/app/page.tsx`, constante `projects`.
- **Problema:** las dos tarjetas enlazan a `/web1` y `/web2`, demos estáticas que se borraron de
  `public/`. El botón "Ver Proyecto en Vivo" lleva a un 404.
- **Causa:** misma limpieza sin commitear.
- **Solución:** pendiente (Fase 1). Se retiran las tarjetas; qué queda en la sección es una pregunta
  abierta para Jesús.
- **Verificación:** pendiente.
