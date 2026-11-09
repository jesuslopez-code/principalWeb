# principalWeb — Orquestador Codex

Antes de trabajar, lee `CLAUDE.md`: contiene la arquitectura, agentes, límites operativos,
convenciones y estado técnico de este proyecto, y forma parte de estas instrucciones para Codex.
Las referencias a agentes `pweb-*` se ejecutan mediante subagentes Codex equivalentes por área.
Ante una diferencia futura entre este fichero y `CLAUDE.md`, detén la parte afectada y unifica la
regla antes de continuar.

## Colaboración con Claude y SDD

- Fuentes compartidas: `plan-implementacion.md` para la dirección, `tareas.md` para fases y estado,
  `modulos.md` para backlog, `fixes.md` para correcciones y el código real para la implementación.
- Antes de implementar, marca la tarea `[~]` y registra responsable IA, agente/área y modelo.
- Una tarea tiene un único propietario. Si cruza SEO y frontend, divídela por áreas y ficheros.
- Al pausar o cerrar, deja un relevo en `tareas.md` con cambios/ficheros, comprobaciones, decisiones
  y pendientes. El siguiente asistente revisa primero ese relevo y el diff.
- Para cambios con riesgo, prefiere revisión cruzada: Claude revisa lo implementado por Codex o
  Codex revisa lo implementado por Claude.
- Al cerrar una fase, detente para que Jesús pruebe y valide antes de avanzar.
- Al cerrar una fase, pon su `Estado: hecho` en `tareas.md` (y en `plan-implementacion.md`) en cuanto
  todas sus casillas estén `[x]`, y mueve los fixes `✅` de `fixes.md` a `fixes-archivo.md` sin cambiar
  su texto (ver «Cierre de fase y archivo de fixes» en `CLAUDE.md`).
- `CLAUDE.md` cita `/fase <n>` y `/modulo`: son comandos de Claude (`.claude/commands/`) y Codex no
  los tiene. Haz lo equivalente leyendo la fase en `tareas.md` o el módulo en `modulos.md` y
  ajustándote a su alcance y criterios de aceptación.

## Modelos recomendados

- Inventario, formato o tareas mecánicas: Codex Luna / Claude Haiku.
- Implementación habitual de Next.js, SEO y documentación: Codex Terra / Claude Sonnet.
- Diagnóstico difícil, cambio transversal o revisión profunda: Codex Sol / Claude Sonnet u Opus.
- Arquitectura crítica, seguridad o migración difícil de revertir: Codex Astra / Claude Opus.

Registra en `tareas.md` el modelo elegido y la razón si se eleva a Sol/Astra u Opus. El hilo
principal orquesta y no edita código de producto directamente; delega en el agente `pweb-*` del área.
