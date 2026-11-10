export type ProjectVisual =
  | { kind: "demo" }
  | { kind: "image"; id: string }
  | { kind: "flow" };

export interface ProjectLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface ProjectDecision {
  decision: string;
  discarded: string;
  reason: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface FlowStep {
  label: string;
  note?: string;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface Project {
  slug: string;
  code?: string;
  title: string;
  type: string;
  year: string;
  role: string;
  status: string;
  version?: string;
  statusLive?: boolean;
  summary: string;
  lead: string;
  /** Descripción para buscadores y redes (unos 150 caracteres); solo en proyectos con ficha. */
  metaDescription?: string;
  /** Tipo schema.org del JSON-LD de la ficha. */
  schemaType?: "SoftwareApplication" | "WebSite" | "CreativeWork";
  stack: string[];
  spec: KeyValue[];
  cardDetails: KeyValue[];
  visual?: ProjectVisual;
  flow?: FlowStep[];
  links: ProjectLink[];
  privateSource?: boolean;
  decisions: ProjectDecision[];
  metrics: ProjectMetric[];
  hasCaseStudy: boolean;
}

export const projects: Project[] = [
  {
    slug: "base-estelar",
    code: "EXP-01",
    title: "Base Estelar",
    type: "escritorio",
    year: "2026",
    role: "diseño y desarrollo",
    status: "v1.7.0",
    version: "1.7.0",
    summary:
      "Oficina 3D para ver a los agentes de Claude Code trabajando y gestionar fases, maquetas y permisos.",
    lead:
      "App de escritorio que reúne en un solo sitio todo el trabajo con agentes de Claude Code: una oficina 3D donde se ve qué hace cada agente y un panel desde el que seguir las fases, aprobar maquetas y responder permisos.",
    metaDescription:
      "Base Estelar: app de escritorio con una oficina 3D para ver a los agentes de Claude Code trabajando y gestionar fases, maquetas y permisos.",
    schemaType: "SoftwareApplication",
    stack: ["Electron", "React", "Three.js", "Node.js", "WebSockets", "Vite", "Vitest"],
    spec: [
      { key: "tipo", value: "escritorio · Windows" },
      { key: "rol", value: "diseño y desarrollo" },
      { key: "año", value: "2026" },
      { key: "versión", value: "1.7.0" },
      { key: "3d", value: "Three.js" },
      { key: "tiempo real", value: "WebSockets + chokidar" },
      { key: "terminal", value: "node-pty + xterm" },
      { key: "updates", value: "electron-updater" },
    ],
    cardDetails: [
      { key: "stack", value: "Electron · Three.js · WebSockets" },
      { key: "código", value: "privado" },
    ],
    visual: { kind: "demo" },
    flow: [
      { label: "Claude Code", note: "agentes" },
      { label: "chokidar", note: "vigila ficheros" },
      { label: "WebSockets", note: "estado en vivo" },
      { label: "Three.js + React", note: "oficina y panel" },
    ],
    links: [
      {
        label: "Descargar para Windows",
        href: "https://github.com/jesuslopez-code/base-estelar-versiones/releases/latest",
        primary: true,
      },
    ],
    privateSource: true,
    decisions: [
      {
        decision: "Electron",
        discarded: "web en el navegador",
        reason: "necesita leer ficheros y abrir terminales reales en local",
      },
      {
        decision: "Vigilar ficheros (chokidar) + WebSockets",
        discarded: "consultar cada X segundos",
        reason: "el estado llega al instante sin cargar la máquina",
      },
      {
        decision: "node-pty + xterm",
        discarded: "terminal externa",
        reason: "las terminales viven dentro de la app, todo en un mismo sitio",
      },
      {
        decision: "electron-updater",
        discarded: "instalador manual",
        reason: "cada versión llega sola, sin reinstalar",
      },
    ],
    metrics: [
      { value: "1.7.0", label: "versión actual" },
      { value: "2026", label: "año de desarrollo" },
    ],
    hasCaseStudy: true,
  },
  {
    slug: "kit-multiagente",
    code: "EXP-02",
    title: "Kit multiagente",
    type: "herramientas IA",
    year: "2026",
    role: "diseño y desarrollo",
    status: "en uso",
    summary:
      "Genera el sistema multiagente de cualquier proyecto. Esta web está construida con él.",
    lead:
      "Un kit que monta en cualquier proyecto un equipo de agentes de Claude Code, cada uno especializado en un área, y un motor de trabajo por fases para dirigirlos.",
    metaDescription:
      "Kit multiagente: monta en cualquier proyecto un equipo de agentes de Claude Code, uno por área, y un motor de trabajo por fases para dirigirlos.",
    schemaType: "CreativeWork",
    stack: ["Claude Code", "Subagentes", "PowerShell", "Markdown"],
    spec: [
      { key: "tipo", value: "herramienta para Claude Code" },
      { key: "rol", value: "diseño y desarrollo" },
      { key: "año", value: "2026" },
      { key: "iniciador", value: "reconoce la arquitectura o entrevista al usuario" },
      { key: "orquestador", value: "reparte el trabajo" },
      { key: "subagentes", value: "uno por área" },
      { key: "motor", value: "fases y módulos" },
    ],
    cardDetails: [
      { key: "stack", value: "Claude Code · PowerShell" },
      { key: "código", value: "privado" },
    ],
    visual: { kind: "flow" },
    flow: [
      { label: "iniciador" },
      { label: "orquestador" },
      { label: "subagentes por área" },
    ],
    links: [],
    privateSource: true,
    decisions: [
      {
        decision: "Estado en ficheros del repositorio",
        discarded: "memoria de la conversación",
        reason: "cualquiera puede retomar el trabajo, también otra IA como Codex",
      },
      {
        decision: "Un agente por área",
        discarded: "un único agente generalista",
        reason: "cada uno con sus reglas y menos contexto mezclado",
      },
      {
        decision: "Revisor obligatorio antes de cerrar",
        discarded: "dar por bueno lo implementado",
        reason: "los fallos se detectan antes de llegar a producción",
      },
      {
        decision: "Parar al terminar cada fase",
        discarded: "ejecutar el plan de seguido",
        reason: "el humano valida antes de seguir",
      },
      {
        decision: "Modelo según el riesgo de la tarea",
        discarded: "usar siempre el más potente",
        reason: "coste ajustado sin perder calidad donde importa",
      },
    ],
    metrics: [
      { value: "8", label: "fases" },
      { value: "6", label: "pull requests" },
    ],
    hasCaseStudy: true,
  },
  {
    slug: "iglesia-el-camino",
    code: "EXP-03",
    title: "Iglesia El Camino",
    type: "web",
    year: "2025–2026",
    role: "diseño, desarrollo y mantenimiento",
    status: "en producción",
    statusLive: true,
    summary: "Web de una iglesia evangélica en Barbate, en producción con despliegue continuo.",
    lead: "Sitio web de una iglesia evangélica en Barbate (Cádiz), en producción en icelcamino.com.",
    metaDescription:
      "Iglesia El Camino: web de una iglesia evangélica en Barbate (Cádiz), hecha con Angular y en producción desde noviembre de 2025 con despliegue continuo.",
    schemaType: "WebSite",
    stack: ["Angular 21", "TypeScript", "Bootstrap 5", "EmailJS", "GitHub Actions"],
    spec: [
      { key: "tipo", value: "sitio web" },
      { key: "rol", value: "diseño, desarrollo y mantenimiento" },
      { key: "año", value: "2025–2026" },
      { key: "front", value: "Angular 21 standalone" },
      { key: "ui", value: "Bootstrap 5 + SCSS" },
      { key: "correo", value: "EmailJS" },
      { key: "ci/cd", value: "GitHub Actions → FTP (Hostinger)" },
      { key: "estado", value: "en producción" },
    ],
    cardDetails: [
      { key: "stack", value: "Angular 21 · Bootstrap 5" },
      { key: "ci/cd", value: "GitHub Actions" },
    ],
    visual: { kind: "image", id: "iglesia-el-camino" },
    flow: [
      { label: "push a GitHub" },
      { label: "GitHub Actions", note: "build" },
      { label: "FTP" },
      { label: "Hostinger" },
    ],
    links: [
      { label: "ver web en vivo", href: "https://icelcamino.com/", primary: true },
      { label: "código", href: "https://github.com/jesuslopez-code/iglesia-barbate" },
    ],
    decisions: [
      {
        decision: "Sitio estático + EmailJS",
        discarded: "backend propio para el formulario",
        reason: "sin coste recurrente ni servidor que mantener o atacar",
      },
      {
        decision: "Componentes standalone",
        discarded: "NgModules",
        reason: "el estándar desde Angular 17, menos código repetido",
      },
      {
        decision: "GitHub Actions → FTP a Hostinger",
        discarded: "subir los ficheros a mano",
        reason: "el alojamiento que ya tenían no admite Git; publicar es hacer push",
      },
      {
        decision: "Separar pages/ y components/",
        discarded: "todo en una carpeta",
        reason: "se sabe dónde tocar sin abrir todo el árbol",
      },
    ],
    metrics: [
      { value: "nov 2025", label: "en producción desde" },
      { value: "0", label: "servidores propios" },
    ],
    hasCaseStudy: true,
  },
  {
    slug: "prueba-tecnica-back",
    title: "API de Productos y Clientes",
    type: "API",
    year: "",
    role: "",
    status: "",
    summary: "",
    lead: "",
    stack: [".NET 8", "C#", "EF Core", "SQL Server", "Docker"],
    spec: [],
    cardDetails: [],
    links: [
      { label: "ver código en GitHub", href: "https://github.com/jesuslopez-code/pruebaTecnicaBack" },
    ],
    decisions: [],
    metrics: [],
    hasCaseStudy: false,
  },
];

export function getProjects(): Project[] {
  return projects;
}

export function getCaseStudies(): Project[] {
  return projects.filter((project) => project.hasCaseStudy);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getCaseStudies().find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const studies = getCaseStudies();
  const index = studies.findIndex((project) => project.slug === slug);
  if (index === -1 || studies.length < 2) return undefined;
  return studies[(index + 1) % studies.length];
}

export function getSideProjects(): Project[] {
  return projects.filter((project) => !project.hasCaseStudy);
}
