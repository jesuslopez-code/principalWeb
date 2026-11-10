# Correcciones archivadas

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
- **Archivada:** 2026-11-09

## FIX-002 — Enlaces muertos en la sección Projects

- **Estado:** ✅ ARREGLADA (commit `cfebd1b`)
- **Dónde:** `src/app/page.tsx`, constante `projects`.
- **Problema:** las dos tarjetas enlazan a `/web1` y `/web2`, demos estáticas que se borraron de
  `public/`. El botón "Ver Proyecto en Vivo" lleva a un 404.
- **Causa:** misma limpieza sin commitear.
- **Solución:** por decisión de Jesús, las tarjetas se sustituyeron por dos proyectos reales que
  enlazan a sus repositorios de GitHub (`iglesia-barbate` y `pruebaTecnicaBack`).
- **Verificación:** no queda ninguna referencia a `/web1`, `/web2` ni `project-*` en `src/`.
- **Archivada:** 2026-11-09

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
- **Archivada:** 2026-11-09

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
- **Archivada:** 2026-11-09

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
- **Archivada:** 2026-11-09

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
- **Archivada:** 2026-11-09

## FIX-008 — Tinte lila sobre la foto del hero

- **Estado:** ✅ ARREGLADA (2026-11-09)
- **Dónde:** `src/app/page.tsx` (retrato de la sección «Sobre mí», `AboutSection`).
- **Problema:** Jesús no quiere el velo de color del acento sobre su foto: la capa
  `bg-primary/30 mix-blend-multiply` la tiñe de lila.
- **Propuesta:** quitar la capa de tinte y mantener el `grayscale` (asumido por el orquestador; Jesús solo
  pidió quitar el lila).
- **Arreglo:** eliminado el `<div>` de tinte (`aria-hidden`, `bg-primary/30 mix-blend-multiply`) que iba
  encima del `<Image>` en `AboutSection`. `Image` con `grayscale`, contenedor y resto intactos.
- **Archivada:** 2026-11-09

## FIX-009 — Texto de error ilegible en tema oscuro (`text-destructive`)

- **Estado:** ✅ ARREGLADA (2026-11-09)
- **Dónde:** `src/app/globals.css`, bloque `.dark` (`--destructive`); se ve en los mensajes de zod
  (`FormMessage`/`FormLabel` de `form.tsx`) y en la tarjeta de error de `contact-form.tsx`.
- **Problema:** `--destructive: 0 62.8% 30.6%` da 1,6–1,9:1 sobre las superficies oscuras; falla AA.
  Lighthouse no lo detectaba porque esos estados no se pintan en la carga. Detectado por `pweb-seo` en
  la auditoría de la Fase 7; ya existía antes.
- **Propuesta:** `--destructive: 0 84% 68%` (6,4:1 sobre background) y `--destructive-foreground:
  232 30% 8%` (6,3:1 sobre ese rojo). Los `Button`/`Toast` destructive en oscuro pasan a rojo claro con
  texto oscuro.
- **Arreglo:** en el bloque `.dark` de `globals.css`, `--destructive: 0 84% 68%` y
  `--destructive-foreground: 232 30% 8%`. `:root` sin tocar. Además, el botón de cierre del `Toast`
  destructive (`toast.tsx`, primitiva shadcn retocada con justificación) pasa de colores literales
  (`red-300`/`red-50`/`red-400`/`red-600`) a tokens: `text-destructive-foreground/70`,
  `hover:text-destructive-foreground`, `ring-destructive-foreground` y `ring-offset-destructive`.
- **Verificación:** revisados los usos de `destructive`: `form.tsx` (texto sobre fondo), tarjeta de error
  de `contact-form.tsx` (`text-destructive` sobre `bg-destructive/10`), `Button`/`Badge`/`Toast` destructive
  (texto oscuro sobre rojo claro) y `ToastAction` (hover con el par nuevo) quedan legibles. El botón de
  cierre usaba colores literales pensados para el rojo oscuro antiguo (poco contraste sobre el rojo claro
  nuevo); con los tokens es texto oscuro sobre rojo claro en oscuro y texto claro sobre rojo oscuro en
  claro, coherente con el resto de variantes. `npm run typecheck` y `npm run lint` pasados (solo el aviso
  abierto de `actionTypes`).
- **Archivada:** 2026-11-09

## FIX-010 — Destello de tema claro al cargar en oscuro con red lenta

- **Estado:** ✅ ARREGLADA (2026-11-09)
- **Dónde:** `src/app/layout.tsx` / `ThemeProvider` (`next-themes`); el script de tema queda dentro de
  `<body>` (justo tras `<body>`, byte ~3660 de 105 KB) y `:root` (claro) es el valor por defecto del CSS.
- **Problema:** con la caché desactivada y red limitada (latencia 150-300 ms, 1,6 Mbps o 200 KB/s) un
  visitante con SO oscuro (o elección «oscuro») ve un fotograma de fondo claro (`rgb(246,245,251)`)
  antes del oscuro. Medido con `Page.startScreencast`: secuencia en blanco/gris -> claro -> oscuro en las 4/4
  pasadas con red limitada en «dark»; sin destello con red sin limitar ni con solo CPU 4x. Incumple el
  criterio «sin destello del tema contrario al cargar». En claro no se ve (el defecto ya es claro).
- **Propuesta (para `pweb-seo`/`pweb-frontend-dev`):** que el fondo correcto exista antes de que el script
  corra: p. ej. `@media (prefers-color-scheme: dark)` en `globals.css` que fije las variables oscuras en
  `:root:not(.light)`, o mover el script de tema a `<head>`. Revalidar con el mismo método.
- **Arreglo (2026-11-09):** script inline `themeInitScript` en `<head>` de `layout.tsx` que replica
  next-themes (clave `theme`, clase en `<html>`, `colorScheme`, defecto «sistema») y corre antes del
  `<body>`. Revisado por `pweb-reviewer`: correcto, sin bloqueos (typecheck, lint y build ok; en el HTML
  servido el script queda en `<head>` antes de `<body>`).
- **Revalidación (2026-11-09, `pweb-tester`, build de producción :3100, Chrome 156 + puppeteer-core):** mismo
  método que la detección (caché desactivada, latencia 150/200/250/300 ms, 200 KB/s, `Page.startScreencast`, 4
  pasadas por caso, clasificando los píxeles de cada fotograma). SO oscuro + elección «oscuro» guardada:
  **0 fotogramas con el fondo claro de la web (246,244,251) en 4/4 pasadas** con `intro-vista` guardada (sin
  telón), 0/4 en primera visita (con telón) y 0/4 a 375 px. SO claro + elección «claro»: 0 fotogramas oscuros
  (sin telón 4 pasadas, primera visita 4 pasadas). Antes del arreglo: claro en 4/4. Único fotograma ajeno: el del
  documento previo a la navegación (fondo del navegador `#121212` o blanco de `about:blank`, 0-17 ms), fuera del
  control del sitio. Evidencia: `C:\Users\1992j\qa-fase8\shots\b-*.png`; script `C:\Users\1992j\qa-fase8\b.mjs`.
- **Archivada:** 2026-11-09
