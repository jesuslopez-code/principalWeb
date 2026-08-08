# principalWeb — jesuslopezweb.com

Web personal de Jesús López: presenta su perfil como desarrollador full-stack, sus proyectos y un
formulario de contacto. Stack: Next.js 15 (App Router) + React 18 + TypeScript + Tailwind +
shadcn/ui. **Ya está en producción en Vercel**, sirviendo el dominio `jesuslopezweb.com`.

## Contexto técnico

Reglas de arquitectura a tener presentes antes de tocar código:

- **Next.js completo sobre Vercel.** Es el despliegue actual, no una migración pendiente. No es un
  export estático: Server Components, rutas dinámicas, route handlers, server actions, revalidación
  e imágenes optimizadas están todos disponibles hoy. Si una solución necesita servidor, se usa.
- **App Router** en `src/app/`. Por defecto los componentes son **Server Components**: se marca
  `"use client"` solo cuando hay estado o eventos (hoy `header.tsx` y `contact-form.tsx`). No añadir
  `"use client"` "por si acaso": encarece el bundle y penaliza el SEO.
- **El sitio crece a varias rutas.** Hoy solo existe `/`, pero están previstas `/proyectos`,
  `/proyectos/[slug]` y `/blog`. Al añadir una ruta, crear su carpeta en `src/app/<ruta>/page.tsx`
  con su propio `export const metadata`, y mantener la navegación del header coherente. La estructura
  multi-ruta es lo esperado, no una excepción.
- **Contenido compartido entre rutas.** Los datos que hoy son constantes locales de `page.tsx`
  (proyectos, skills) pasarán a `src/lib/` o a contenido MDX cuando los consuman varias rutas. Al
  tocar uno de esos bloques, valorar si ya toca extraerlo en vez de duplicarlo.
- **Estilos:** Tailwind con tokens HSL como variables CSS en `src/app/globals.css`. Los colores se
  usan **siempre** por su token semántico (`bg-background`, `text-primary`, `border-border`), nunca
  con colores literales de Tailwind (`bg-zinc-900`) ni hex sueltos. Un token nuevo se define en
  `globals.css` y se mapea en `tailwind.config.ts`.
- **Tema:** `<html className="dark">` está fijo en el layout. La paleta clara ya está definida en
  `:root` de `globals.css` pero no se usa; el conmutador claro/oscuro está en el backlog.
- **Componentes UI:** shadcn/ui en `src/components/ui/` (estilo default, baseColor neutral). No
  reescribirlos a mano salvo necesidad justificada; para añadir uno nuevo, usar el CLI de shadcn.
  Iconos: `lucide-react`.
- **Imágenes:** siempre `next/image`. Cualquier host externo debe estar declarado en
  `remotePatterns` de `next.config.ts`, o el build falla. Las imágenes se declaran hoy en
  `src/lib/placeholder-images.json` y se consumen tipadas desde `placeholder-images.ts` buscando por
  `id`; un `id` nuevo va primero al JSON.
- **Formulario de contacto:** valida con `zod` + `react-hook-form` y envía por `fetch` a un servicio
  externo de formularios. El feedback al usuario va por `useToast`, nunca con `alert`/`confirm`.
- **Idioma:** todo el texto visible está en español, incluidos los mensajes de validación y de error.

## Deuda técnica conocida (estado de partida)

Anotado aquí porque condiciona cualquier cambio; se resuelve en las fases de
`plan-implementacion.md`:

- `next.config.ts` desactiva la red de seguridad del build: `typescript.ignoreBuildErrors` y
  `eslint.ignoreDuringBuilds` están en `true`. Un error de tipos **no rompe el build**, así que
  ejecutar `npm run typecheck` aparte es obligatorio antes de dar algo por bueno.
- El repo viene de una plantilla de Firebase Studio y está a medio desacoplar de Firebase.
- El SEO es mínimo: solo `title` y `description` en el layout.

## Usar los agentes adecuados

Delega el trabajo en el subagente que corresponda al área tocada, en vez de hacerlo todo en el hilo
principal:

- **`pweb-frontend-dev`** — código de producto: rutas y páginas, secciones, componentes,
  contenidos, formulario, estilos Tailwind y tokens, responsive, primitivas shadcn. Para trabajo de
  **dirección de arte** (paleta, tipografías, concepto de layout, elemento firma) usa la skill
  global **`frontend-design`** antes de codificar; su salida se traduce a tokens HSL en
  `globals.css` y `tailwind.config.ts`, nunca a colores literales.
- **`pweb-seo`** — metadatos de App Router, OpenGraph y canonical, `robots.ts` y `sitemap.ts`,
  JSON-LD, HTML semántico, accesibilidad y rendimiento (Core Web Vitals, `next/font`, `next/image`).
- **`pweb-reviewer`** — revisar cambios antes de commit/merge: corrección, imports huérfanos,
  enlaces rotos, regresiones de SEO y convenciones.
- **`pweb-tester`** — probar lo implementado: `typecheck`, `lint`, `build` y verificación en
  navegador.
- **`pweb-docs`** — documentar (manual de usuario y doc técnica). Solo bajo demanda; no toca código.

**Frontera entre `pweb-frontend-dev` y `pweb-seo`** (ambos tocan `src/app/layout.tsx` y los
`page.tsx`): el **contenido y el comportamiento** son de `pweb-frontend-dev`; los **metadatos, las
cabeceras, el rendimiento y la semántica del HTML** son de `pweb-seo`. En la práctica: los
`export const metadata`/`generateMetadata`, el `<head>`, la carga de fuentes, `robots.ts`,
`sitemap.ts` y el JSON-LD los toca `pweb-seo`; el `<body>`, los componentes que se renderizan dentro
y sus estilos los toca `pweb-frontend-dev`. Si un cambio cruza la frontera (por ejemplo, convertir un
`<div>` de sección en `<section>` con encabezado jerárquico), repartir: `pweb-seo` define qué
estructura semántica hace falta y `pweb-frontend-dev` la aplica en el componente.

Tras implementar algo, pásalo por `pweb-reviewer` y, si aplica, por `pweb-tester`.

## Cómo se avanza el proyecto (motor de trabajo)

El trabajo se dirige desde ficheros de la **raíz** del repo:

- **Por fases** — `plan-implementacion.md` (visión y orden) y `tareas.md` (fases con estado). Se
  ejecutan con **`/fase <n|nombre>`**. **Al terminar cada fase se para** para que Jesús pruebe y
  valide antes de seguir.
- **Por módulos** — `modulos.md` (inventario con estado). Cada módulo se trabaja con
  **`/modulo <nombre>`**.
- **`fixes.md`** — log de correcciones encontradas al probar.

## Grafo de conocimiento — graphify

Este proyecto usa **graphify**: un grafo de conocimiento del codebase persistente en `graphify-out/`.
Sirve para responder "¿cómo funciona X?", "¿qué usa Y?", "¿por dónde pasa Z?" **gastando menos
tokens** que grep más la lectura de muchos ficheros.

- **Antes de una búsqueda amplia** (ubicar código, entender la arquitectura o las relaciones entre
  partes), **consulta el grafo primero:** `graphify query "<pregunta>"` (contexto amplio),
  `graphify path "A" "B"` (relación entre dos conceptos), `graphify explain "X"` (explica un nodo).
- **El grafo orienta; el código manda:** lo que vayas a modificar, verifícalo en el fichero real.
- **Generar/actualizar:** si no existe `graphify-out/`, créalo una vez con `/graphify`. Cuando el
  código cambie bastante, refréscalo con `/graphify --update` (incremental).
- `graphify-out/` está **ignorado en git** por ser salida regenerable.

Aviso de proporción: `src/` son unos 20 ficheros y cabe entero en contexto. Para un cambio puntual
en un fichero que ya sabes cuál es, ir directo al fichero sigue siendo lo más barato; el grafo gana
cuando no sabes dónde vive algo o cómo se conecta.

## Particularidades por apartado/módulo

Este `CLAUDE.md` y los agentes contienen solo directrices que afectan a **todo el proyecto**. Cada
apartado con particularidades propias tiene un fichero **`.claude/docs/<Modulo>/NotasAgentes.md`**
(hoy: `Landing`, `Contacto`, `SEO`). Al trabajar en un módulo, tanto el hilo principal como el
agente correspondiente **deben consultar** ese fichero.

**Jerarquía (no contradecir hacia arriba):** global personal › `CLAUDE.md` › agentes `pweb-*` ›
`NotasAgentes.md` de módulo. Un nivel inferior NO puede contradecir a uno superior. Si para una
tarea hiciera falta algo no cubierto por ningún nivel, o algo que contradice una directriz superior,
**preguntar antes de actuar**.

**Enrutado del conocimiento nuevo:** lo transversal a todo el proyecto → este `CLAUDE.md` o el
agente correspondiente; lo específico de un módulo → su `NotasAgentes.md`.

## Operaciones que hace SOLO el usuario

- **Commits, merges y push.** Los agentes dejan los cambios en el working tree; Jesús decide qué se
  commitea. Nadie hace commit sin pedirlo explícitamente.
- **Despliegue en Vercel** y cualquier cambio en el dominio o el DNS de `jesuslopezweb.com`.
- **Borrar ficheros del repo en masa.** Hay una limpieza en curso sin commitear (ver más abajo): un
  agente que quiera eliminar ficheros **avisa y no los borra**.
- **Credenciales del servicio de formularios** (el endpoint de contacto). No rotarlas ni cambiarlas
  desde un agente.

## Estado del repositorio (importante al empezar)

La rama de trabajo es `limpieza-y-seo`. Hay una limpieza grande **sin commitear** en el working
tree: se han borrado Firebase (`src/firebase/`, `firestore.rules`, `apphosting.yaml`), las
primitivas shadcn no usadas, las demos estáticas `public/web1` y `public/web2`, y la config de
Firebase Studio. Consecuencias a tener presentes:

- `src/app/layout.tsx` **todavía importa** `@/firebase/client-provider`, que ya no existe: el build
  está roto hasta que se arregle (Fase 1).
- Las tarjetas de la sección Projects apuntan a `/web1` y `/web2`, que ya no existen.

Antes de diagnosticar cualquier error, comprobar si viene de esta limpieza a medias.

## Definición de "terminado"

- Implementado por el agente del área que toca (repartir si cruza áreas).
- Revisado con `pweb-reviewer`.
- `npm run typecheck` en verde (recordar: el build no falla por errores de tipos).
- Si aplica, probado. **Antes de lanzar `pweb-tester`, preguntar a Jesús** si prefiere probarlo él.
- Ante un fallo reportado tras un cambio, verificar primero que el servidor de desarrollo recargó y
  está sirviendo el código nuevo, antes de diagnosticar el síntoma.

## Registrar correcciones del usuario

Cuando Jesús corrija algo, registrarlo en el momento:
- Si el trabajo lo hizo un **agente** `pweb-*`, ese agente lo anota en su propio `.md` (sección
  *Auto-actualización*).
- Si la corrección se da **en el hilo principal**, guardarla en memoria (`feedback_*` con **Why** y
  **How to apply**) y, si es una convención del proyecto, añadirla a este `CLAUDE.md`.

## Convenciones de código propias del proyecto

- Ficheros en `kebab-case`, componentes exportados en `PascalCase`.
- Imports por alias `@/` (mapeado a `src/`), nunca rutas relativas largas del tipo `../../`.
- Componentes compartidos entre rutas en `src/components/`; los específicos de una ruta pueden vivir
  junto a su `page.tsx`. Las secciones de la home son hoy funciones locales de `src/app/page.tsx`:
  extraerlas cuando se reutilicen o crezcan, no por gusto.
- Enlaces internos y anclas con `next/link`; `<a>` solo para destinos externos, siempre con
  `target="_blank"` y `rel="noopener noreferrer"`.
- Nada de `alert`, `confirm` ni `prompt`: el feedback va por `useToast`.
