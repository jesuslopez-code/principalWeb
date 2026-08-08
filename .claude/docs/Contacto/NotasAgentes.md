# Notas de agentes — Contacto

Particularidades **específicas del formulario de contacto** que los agentes deben conocer al
trabajar aquí. Lo transversal a todo el proyecto está en `CLAUDE.md` y en los agentes `pweb-*`.

**Jerarquía (no contradecir hacia arriba):** global personal › `CLAUDE.md` › agentes `pweb-*` ›
este fichero. Si algo aquí parece chocar con un nivel superior, gana el superior. Si para una tarea
falta algo no cubierto, preguntar a Jesús.

## Qué es este módulo

El formulario por el que un visitante contacta con Jesús. Es la **conversión principal del sitio**:
si falla, se pierde una oportunidad laboral y nadie se entera. Trátalo con más cuidado que al resto
de la página.

Vive en `src/components/contact-form.tsx` y se renderiza dentro de `ContactSection`, en
`src/app/page.tsx`.

## Rutas y ficheros clave

- `src/components/contact-form.tsx` — el formulario completo: esquema, envío y estados.
- `src/components/ui/form.tsx`, `input.tsx`, `textarea.tsx`, `button.tsx` — primitivas usadas.
- `src/hooks/use-toast.ts` — el feedback al usuario.
- `src/app/layout.tsx` — monta el `<Toaster />` que hace visibles esos toasts.

## Patrones y comportamiento propios

- **Componente de cliente** (`"use client"`): tiene estado y manejadores de eventos.
- **Validación con zod + `zodResolver`**, esquema `formSchema` con tres campos: `name` (mínimo 2
  caracteres), `email` (formato email) y `message` (mínimo 10 caracteres). **Todos los mensajes de
  error están en español** y así deben seguir.
- **Envío a un servicio externo de formularios** por `fetch` con `POST` y `Content-Type:
  application/json`, directamente desde el navegador. No hay backend propio ni route handler
  intermedio.
- **Dos estados independientes:** `isSubmitting` (deshabilita el botón y cambia su texto a
  "Enviando...") y `submissionStatus` (`"success"` | `"error"` | `null`).
- **Doble feedback en el error**, deliberado: además del toast destructivo, el formulario se
  sustituye por un bloque de error con un botón "Volver al formulario" que restaura la vista. En el
  éxito solo hay toast y `form.reset()`.
- **Feedback siempre por `useToast`.** Nunca `alert` ni `confirm`.
- **Layout:** nombre y email en una fila de dos columnas en escritorio (`grid md:grid-cols-2`),
  mensaje a ancho completo con `min-h-[150px]`.

## Avisos / cosas a vigilar

- **No envíes formularios de prueba reales.** El endpoint entrega en la bandeja de entrada de Jesús;
  cada prueba es un correo de verdad. Para verificar, prueba la **validación** (datos inválidos) y
  el estado de envío. Si hace falta probar el envío completo, **pídeselo a Jesús primero**.
- **El endpoint del servicio está hardcodeado** en el `fetch` del componente. Cambiarlo o rotarlo es
  una operación que hace solo Jesús. Si alguna vez se mueve a variable de entorno, sería
  `NEXT_PUBLIC_*` (viaja al cliente igualmente) y no aporta seguridad, solo comodidad.
- **Dependencia de terceros sin red de seguridad:** si el servicio cae o cambia su API, el
  formulario falla en silencio para Jesús (el visitante sí ve el error, él no se entera). Es un
  riesgo conocido, anotado en `plan-implementacion.md`. Una migración a route handler o server
  action —posible, porque el despliegue es Next completo en Vercel— resolvería esto, pero **no está
  decidida**: proponerla, no ejecutarla.
- **Sin protección antispam** (ni captcha ni honeypot). Si empieza a llegar spam, es el primer sitio
  donde mirar.
- **El `<Toaster />` debe seguir montado en el layout.** Si desaparece al tocar `layout.tsx` (por
  ejemplo, al retirar el proveedor de Firebase en la Fase 1), el formulario deja de dar feedback
  visible aunque funcione. Compruébalo tras cualquier cambio en el layout.

---
_Este fichero lo amplían los agentes por auto-actualización con lo que aprenden en el módulo._
