# Correcciones (fixes) — principalWeb

Log de fallos encontrados al **probar** el sitio. Registrar en el momento; no depender de la
memoria. Los dos primeros están anotados desde el arranque porque ya se sabe que existen: son el
resultado de la limpieza a medias y se resuelven en la Fase 1.

**Estado:** ✅ ARREGLADA · 🔧 EN CURSO · ⏳ PENDIENTE.

## FIX-001 — El build falla: import de Firebase que ya no existe

- **Estado:** ✅ ARREGLADA (Fase 1)
- **Dónde:** `src/app/layout.tsx`, línea 4.
- **Problema:** el layout importaba `FirebaseClientProvider` desde `@/firebase/client-provider`, pero
  la carpeta `src/firebase/` se borró en la limpieza. La aplicación no compilaba. `ignoreBuildErrors`
  no lo enmascaraba porque es un fallo de resolución de módulo, no de tipos.
- **Causa:** el desacople de Firebase borró los ficheros pero no retiró sus usos.
- **Solución:** retirado el import y el envoltorio `<FirebaseClientProvider>`, dejando `{children}` y
  `<Toaster />` directamente en el `<body>`. Retirada también la dependencia `firebase` de
  `package.json`.
- **Verificación:** `npm run typecheck` en verde y `npm run build` completo. Comprobado que
  `<Toaster />` sigue montado, del que depende el feedback del formulario de contacto.

## FIX-002 — Enlaces muertos en la sección Projects

- **Estado:** ⏳ PENDIENTE
- **Dónde:** `src/app/page.tsx`, constante `projects`.
- **Problema:** las dos tarjetas enlazan a `/web1` y `/web2`, demos estáticas que se borraron de
  `public/`. El botón "Ver Proyecto en Vivo" lleva a un 404.
- **Causa:** misma limpieza sin commitear.
- **Solución:** pendiente. **Bloqueada por decisión de Jesús:** se retiran las tarjetas, pero qué
  queda en la sección es una pregunta abierta que no decide un agente.
- **Verificación:** pendiente.

## FIX-003 — `label.tsx` borrado por error rompía el formulario de contacto

- **Estado:** ✅ ARREGLADA (Fase 1)
- **Dónde:** `src/components/ui/label.tsx` (ausente), usado por `src/components/ui/form.tsx:16`.
- **Problema:** la limpieza de primitivas shadcn no usadas se llevó también `label.tsx`, que **sí se
  usa**: `form.tsx` lo importa para `FormLabel`, y de ahí depende todo el formulario de contacto.
  `tsc` lo delataba con `TS2307: Cannot find module '@/components/ui/label'`.
- **Causa:** al inventariar las primitivas no usadas se miró qué importaba `page.tsx`, pero no las
  dependencias entre primitivas: `label` no lo usa ninguna página directamente, sino `form`.
- **Solución:** restaurado desde HEAD con `git checkout HEAD -- src/components/ui/label.tsx`. Su
  dependencia `@radix-ui/react-label` seguía en `package.json`, lo que confirma que el borrado fue un
  descuido y no una decisión.
- **Verificación:** `npm run typecheck` en verde tras restaurarlo.

## FIX-004 — `npm run build` no funcionaba en Windows

- **Estado:** ✅ ARREGLADA (Fase 1)
- **Dónde:** `package.json`, script `build`.
- **Problema:** el script era `NODE_ENV=production next build`. Esa forma de fijar variables de
  entorno es de shell Unix; npm lanza los scripts por `cmd` en Windows, que responde `"NODE_ENV" no
  se reconoce como un comando interno o externo`. En Vercel (Linux) funcionaba, así que el fallo solo
  se veía en local.
- **Causa:** script heredado de la plantilla original, pensado para un entorno Unix.
- **Solución:** simplificado a `next build`. El prefijo era redundante: `next build` ya fuerza
  `NODE_ENV=production` por sí mismo, así que quitarlo no cambia el resultado y arregla el script en
  los dos sistemas.
- **Verificación:** `npm run build` completo en Windows.
