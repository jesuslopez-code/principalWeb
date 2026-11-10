import Image from "next/image";
import Link from "next/link";
import { BaseEstelarDemo } from "@/components/base-estelar-demo";
import { ProjectFlow } from "@/components/project-flow";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Project } from "@/lib/projects";

const focusClass =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ProjectStatus({ project }: { project: Project }) {
  return (
    <span className={project.statusLive ? "text-primary" : undefined}>
      {project.statusLive && <span aria-hidden="true">● </span>}
      {project.status}
    </span>
  );
}

function CardVisual({ project }: { project: Project }) {
  const href = `/proyectos/${project.slug}`;
  const visual = project.visual;
  if (!visual) return null;

  // La demo es interactiva (botones propios): no puede ir dentro de un enlace.
  if (visual.kind === "demo") return <BaseEstelarDemo compact />;

  if (visual.kind === "image") {
    const image = PlaceHolderImages.find((img) => img.id === visual.id);
    if (!image) return null;
    return (
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10]">
        <Image
          src={image.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      className="flex min-h-[10rem] items-center bg-secondary p-5 sm:aspect-[16/10]"
    >
      <div className="w-full">{project.flow && <ProjectFlow steps={project.flow} compact />}</div>
    </Link>
  );
}

interface ProjectCardProps {
  project: Project;
  headingLevel?: "h2" | "h3";
}

export function ProjectCard({ project, headingLevel = "h2" }: ProjectCardProps) {
  const Heading = headingLevel;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 focus-within:border-primary hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
      <div className="border-b border-border bg-secondary">
        <CardVisual project={project} />
      </div>
      <Link href={`/proyectos/${project.slug}`} className={`flex flex-1 flex-col gap-3 p-5 ${focusClass}`}>
        <span className="flex justify-between gap-3 font-mono text-[11px] text-muted-foreground">
          <span>
            {project.code} · {project.type}
          </span>
          <ProjectStatus project={project} />
        </span>
        <Heading className="font-display text-3xl leading-tight tracking-tight">{project.title}</Heading>
        <p className="text-foreground/80">{project.summary}</p>
        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-0.5 border-t border-border pt-3 font-mono text-xs">
          {project.cardDetails.map((detail) => (
            <div key={detail.key} className="contents">
              <dt className="text-muted-foreground">{detail.key}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
        <span className="font-mono text-sm text-primary">
          abrir expediente <span aria-hidden="true">→</span>
          <span className="sr-only"> de {project.title}</span>
        </span>
      </Link>
    </article>
  );
}

export function SideProjectRow({ project }: { project: Project }) {
  const link = project.links[0];
  if (!link) return null;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-border p-5 font-mono text-sm transition-colors hover:border-primary ${focusClass}`}
    >
      <span>
        <span className="font-medium">{project.title}</span>
        <span className="text-muted-foreground"> · {project.stack.join(" · ")}</span>
      </span>
      <span className="text-primary">
        {link.label} <span aria-hidden="true">↗</span>
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </span>
    </a>
  );
}
