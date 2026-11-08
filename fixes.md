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

- **Estado:** ✅ ARREGLADA (commit `cfebd1b`)
- **Dónde:** `src/app/page.tsx`, constante `projects`.
- **Problema:** las dos tarjetas enlazan a `/web1` y `/web2`, demos estáticas que se borraron de
  `public/`. El botón "Ver Proyecto en Vivo" lleva a un 404.
- **Causa:** misma limpieza sin commitear.
- **Solución:** por decisión de Jesús, las tarjetas se sustituyeron por dos proyectos reales que
  enlazan a sus repositorios de GitHub (`iglesia-barbate` y `pruebaTecnicaBack`).
- **Verificación:** no queda ninguna referencia a `/web1`, `/web2` ni `project-*` en `src/`.

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

## FIX-005 — `sizes` de las capturas de Base Estelar infravaloran el ancho real a 1440 px

- **Estado:** ✅ CERRADO sin aplicar (2026-11-08): ya no aplica. Las capturas de Base Estelar se sustituyeron por la animación y se borraron sus imágenes; `ProjectImages` sigue sirviendo solo la de Iglesia El Camino, que sale nítida.
- **Dónde:** `src/components/projects-section.tsx`, `ProjectImages` (atributo `sizes`).
- **Problema:** a 1440 px la captura principal se muestra a ~713 px CSS y la secundaria a ~349 px, pero
  `sizes` declara 560 px y 280 px. Next sirve el `w=640` (principal) y `w=384` (secundaria), así que el
  navegador las estira un ~11 % y salen algo blandas. La de Iglesia El Camino (1076 px, `w=1080`) sale
  nítida. El fichero fuente es de 1154 px, así que hay margen.
- **Propuesta (no aplicada):** `(min-width: 1024px) 720px` para la principal y `(min-width: 1024px) 360px`
  para la secundaria.
- **Verificación:** a 1440 px, `currentSrc` de la principal debe pedir `w>=750`.

## FIX-006 — Estado inicial de la animación de Base Estelar: post-its apilados en la esquina del plano

- **Estado:** ✅ RESUELTO (2026-11-08)
- **Dónde:** `src/lib/base-estelar-animacion.ts` / `src/components/base-estelar-demo.tsx`.
- **Problema:** en una captura tomada justo al entrar la sección en pantalla (antes de que el bucle avance), el
  plano 2D mostraba los post-its de las tareas apilados y minúsculos en la esquina superior izquierda de la
  sala Frontend, con la pizarra vacía y la terminal solo con la bienvenida. A partir de ~1 s se ve normal. No
  se repite en los ciclos siguientes. Solo afecta al primer frame al llegar a la sección.
- **Propuesta (no aplicada):** no pintar los post-its hasta su primer movimiento, u ocultar el plano hasta
  el primer `iniciar()` (`visibility`/opacidad).
- **Verificación:** captura a los 0-300 ms tras entrar la sección en viewport.
- **Causa y arreglo:** los post-its se creaban sin `transform` y solo se colocaban en el primer `reiniciar()` del ciclo, que ocurre tras `iniciar()`; mientras tanto estaban en (0,0). Ahora `crearAnimacion` llama a `reiniciar()` al construirse, así que el primer pintado ya los muestra en su sitio y la `transition` no se dispara (el `transform` inline nace con el elemento).

## FIX-007 — Rendimiento móvil Lighthouse bajo en esta máquina (TBT 580-1350 ms), no atribuible a la demo

- **Estado:** ℹ️ INFORMATIVO (no es fallo de la tarea)
- **Medición 2026-11-08 (build de producción, móvil, 3 pasadas cada una):** con demo Rend. 67/77/81, A11y
  100, BP 100, SEO 100, LCP 3.3/1.1/1.1 s, CLS 0.001/0.001/0 . Línea base en la misma máquina sustituyendo la
  demo por las dos capturas antiguas (copia temporal fuera del repo): Rend. 72/78/85, LCP 3.3/1.0/0.9 s,
  CLS 0.001. Diferencia ~4-5 puntos, dentro del ruido; la mediana de hoy es inferior a la histórica (90-98) también
  sin la demo. La primera pasada de cada serie sale peor (LCP 3,3 s, arranque en frío).
