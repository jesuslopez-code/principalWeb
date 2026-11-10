import Image from "next/image";
import { Lock } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BaseEstelarDemo } from "@/components/base-estelar-demo";
import { SectionHeading } from "@/components/section-heading";

type ProjectVisual =
  | { kind: "images"; ids: string[] }
  | { kind: "demo"; id: "base-estelar" }
  | { kind: "flow"; steps: string[] };

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  details: { key: string; value: string }[];
  visual?: ProjectVisual;
  repoLink?: string;
  privateSource?: boolean;
  inProduction?: boolean;
  liveUrl?: string;
  downloadUrl?: string;
}

const projects: Project[] = [
  {
    id: "base-estelar",
    title: "Base Estelar",
    description:
      "App de escritorio para Windows que muestra en una oficina 3D a los agentes de Claude Code trabajando en tus proyectos: cada agente se mueve a su sala cuando el orquestador lo llama y enseña si está trabajando, esperando una respuesta o libre. Desde el panel se siguen las fases, se aprueban diseños y maquetas y se responden los permisos de los agentes. Se actualiza sola y va por la versión 1.7.0.",
    technologies: ["Electron", "React", "Three.js", "Node.js", "WebSockets", "Vite", "Vitest"],
    details: [
      { key: "escritorio", value: "Electron" },
      { key: "3d", value: "Three.js" },
      { key: "tiempo real", value: "WebSockets + chokidar" },
      { key: "terminal", value: "node-pty + xterm" },
      { key: "updates", value: "electron-updater" },
    ],
    visual: { kind: "demo", id: "base-estelar" },
    privateSource: true,
    downloadUrl: "https://github.com/jesuslopez-code/base-estelar-versiones/releases/latest",
  },
  {
    id: "kit-multiagente",
    title: "Kit multiagente",
    description:
      "Kit para montar un sistema multiagente en Claude Code en cualquier proyecto: un agente iniciador reconoce la arquitectura (o entrevista al usuario) y genera el orquestador, los subagentes por área, los comandos y un motor de trabajo por fases y módulos. Con él está construida esta web. Base Estelar es su panel visual.",
    technologies: ["Claude Code", "Subagentes", "PowerShell", "Markdown"],
    details: [
      { key: "iniciador", value: "reconoce la arquitectura o entrevista al usuario" },
      { key: "orquestador", value: "reparte el trabajo entre agentes" },
      { key: "subagentes", value: "uno por área del proyecto" },
      { key: "motor", value: "fases y módulos" },
    ],
    visual: { kind: "flow", steps: ["iniciador", "orquestador", "subagentes por área"] },
    privateSource: true,
  },
  {
    id: "iglesia-barbate",
    title: "Iglesia El Camino",
    description:
      "Sitio web de una iglesia evangélica en Barbate, en producción. Angular 21 con componentes standalone, Bootstrap 5 y despliegue continuo mediante GitHub Actions.",
    technologies: ["Angular 21", "TypeScript", "Bootstrap 5", "GitHub Actions"],
    details: [
      { key: "front", value: "Angular 21 standalone" },
      { key: "ui", value: "Bootstrap 5" },
      { key: "ci/cd", value: "GitHub Actions" },
    ],
    visual: { kind: "images", ids: ["iglesia-el-camino"] },
    repoLink: "https://github.com/jesuslopez-code/iglesia-barbate",
    inProduction: true,
    liveUrl: "https://icelcamino.com/",
  },
  {
    id: "prueba-tecnica-back",
    title: "API de Productos y Clientes",
    description:
      "API REST con arquitectura en capas, donde los controladores dependen de servicios y estos de repositorios a través de interfaces. Entity Framework Core con migraciones, AutoMapper y Docker.",
    technologies: [".NET 8", "C#", "EF Core", "SQL Server", "Docker"],
    details: [
      { key: "capas", value: "controladores → servicios → repositorios" },
      { key: "datos", value: "EF Core + migraciones + SQL Server" },
      { key: "mapeo", value: "AutoMapper" },
      { key: "entorno", value: "Docker" },
    ],
    visual: { kind: "flow", steps: ["Controller", "Service", "Repository", "SQL Server"] },
    repoLink: "https://github.com/jesuslopez-code/pruebaTecnicaBack",
  },
];

const linkClass =
  "inline-flex items-center gap-2 text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ProjectImages({ ids }: { ids: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ids.map((imageId, imageIndex) => {
        const image = PlaceHolderImages.find((img) => img.id === imageId);
        if (!image) return null;
        const isMain = imageIndex === 0;
        const isAlone = ids.length === 1;
        return (
          <div
            key={imageId}
            className={`relative aspect-[16/10] overflow-hidden rounded-lg border border-border ${
              isAlone ? "sm:col-span-3" : isMain ? "sm:col-span-2" : "hidden sm:block"
            }`}
          >
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              sizes={
                isAlone
                  ? "(min-width: 1280px) 1080px, (min-width: 1024px) 840px, 100vw"
                  : isMain
                  ? "(min-width: 1024px) 560px, (min-width: 640px) 45vw, 100vw"
                  : "(min-width: 1024px) 280px, 25vw"
              }
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

// Decorativo: la misma información va como texto en el detalle técnico.
function ProjectFlow({ steps }: { steps: string[] }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-stretch gap-2 rounded-lg border border-border bg-card p-4 font-mono text-xs sm:flex-row sm:items-center sm:text-sm"
    >
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center gap-2 sm:flex-row">
          {i > 0 && (
            <>
              <span className="text-primary sm:hidden">↓</span>
              <span className="hidden text-primary sm:inline">→</span>
            </>
          )}
          <span className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-center text-foreground sm:w-auto">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="w-full py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading id="projects-title" index="02" label="proyectos">
          Proyectos
        </SectionHeading>
        <p className="mt-4 max-w-2xl text-foreground/80 md:text-lg">
          Proyectos reales: una herramienta que uso a diario para trabajar con agentes de IA, una web en producción y código abierto para ver cómo están construidos por dentro.
        </p>
        <ol className="mt-12 border-t border-border">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="group grid gap-4 border-b border-border border-l-2 border-l-transparent py-8 pl-4 transition-colors hover:border-l-primary hover:bg-background/40 md:grid-cols-[6rem_1fr] md:gap-8 md:pl-6"
            >
              <span
                aria-hidden="true"
                className="font-display text-5xl leading-none text-muted-foreground transition-colors group-hover:text-primary md:text-7xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="font-display text-3xl tracking-tight md:text-4xl">
                    {project.title}
                  </h3>
                  {project.inProduction && (
                    <span className="font-mono text-xs text-primary">
                      <span aria-hidden="true">● </span>en producción
                    </span>
                  )}
                </div>
                <p className="max-w-3xl text-foreground/80">{project.description}</p>
                <p className="font-mono text-sm text-primary">
                  {project.technologies.join(" · ")}
                </p>
                {project.visual?.kind === "images" && <ProjectImages ids={project.visual.ids} />}
                {project.visual?.kind === "demo" && <BaseEstelarDemo />}
                {project.visual?.kind === "flow" && <ProjectFlow steps={project.visual.steps} />}

                <details open={i === 0} className="group/details font-mono text-sm">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                    <span aria-hidden="true" className="text-primary group-open/details:hidden">+</span>
                    <span aria-hidden="true" className="hidden text-primary group-open/details:inline">−</span>
                    detalle técnico
                  </summary>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 rounded-lg border border-border bg-card p-4">
                    {project.details.map((detail) => (
                      <div key={detail.key} className="contents">
                        <dt className="text-muted-foreground">{detail.key}</dt>
                        <dd className="text-foreground">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
                  {project.downloadUrl && (
                    <a
                      href={project.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      Descargar para Windows <span aria-hidden="true">↗</span>
                      <span className="sr-only"> de {project.title}</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      ver web en vivo <span aria-hidden="true">↗</span>
                      <span className="sr-only"> de {project.title}</span>
                    </a>
                  )}
                  {project.repoLink && (
                    <a
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      código <span aria-hidden="true">↗</span>
                      <span className="sr-only"> de {project.title}</span>
                    </a>
                  )}
                  {project.privateSource && (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" aria-hidden="true" />
                      código privado
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
