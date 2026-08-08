# jesuslopezweb.com

Web personal y portfolio de Jesús López, desarrollador web full-stack. Presenta su perfil, sus
proyectos y un formulario de contacto.

En producción: [jesuslopezweb.com](https://jesuslopezweb.com)

## Stack

- **Next.js 15** con App Router y **React 18**
- **TypeScript**
- **Tailwind CSS** con tokens de color como variables CSS
- **shadcn/ui** sobre Radix, iconos de **lucide-react**
- **react-hook-form** + **zod** para el formulario de contacto
- Desplegada en **Vercel**

## Puesta en marcha

```bash
npm install
npm run dev
```

La aplicación queda en **http://localhost:9002** (puerto personalizado, no el 3000 por defecto).

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Servidor de desarrollo en el puerto 9002 |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint mediante `next lint` |
| `npm run typecheck` | Comprobación de tipos con `tsc --noEmit` |

**`npm run typecheck` no es opcional.** `next.config.ts` tiene desactivadas las comprobaciones de
tipos y de lint durante el build, así que un `npm run build` correcto no garantiza que los tipos lo
estén.

## Estructura

```
src/
  app/          Rutas de App Router, layout y estilos globales
  components/   Componentes compartidos
    ui/         Primitivas de shadcn/ui
  hooks/        Hooks propios (toast, detección de móvil)
  lib/          Utilidades y datos (imágenes)
public/images/  Imágenes del sitio
```

El contenido de la página principal (proyectos, habilidades) vive como constantes en
`src/app/page.tsx`. Las imágenes se declaran en `src/lib/placeholder-images.json` y se consumen
tipadas desde `placeholder-images.ts`.

## Despliegue

Cada cambio en la rama principal se despliega automáticamente en Vercel.

## Documentación interna

Este repositorio usa un sistema de agentes para el desarrollo asistido:

- `CLAUDE.md` — arquitectura, convenciones y reparto de trabajo entre agentes.
- `plan-implementacion.md` y `tareas.md` — plan por fases y su estado.
- `modulos.md` — inventario de apartados del sitio.
- `fixes.md` — registro de correcciones.
- `.claude/docs/<Modulo>/NotasAgentes.md` — particularidades de cada apartado.
