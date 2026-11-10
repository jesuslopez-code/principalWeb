import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BaseEstelarDemo } from "@/components/base-estelar-demo";
import { DecisionsPanel, MetricsList, Panel, SpecSheet } from "@/components/case-study";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProjectFlow } from "@/components/project-flow";
import { projectContent } from "@/content/proyectos";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { JsonLd } from "@/components/json-ld";
import { getCaseStudies, getNextProject, getProjectBySlug, type Project } from "@/lib/projects";
import { projectJsonLd, projectMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return projectMetadata(project);
}

function ProjectVisual({ project }: { project: Project }) {
  const visual = project.visual;
  if (visual?.kind === "demo") return <BaseEstelarDemo />;
  if (visual?.kind === "image") {
    const image = PlaceHolderImages.find((img) => img.id === visual.id);
    if (!image) return null;
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border">
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          priority
          sizes="(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    );
  }
  return null;
}

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const Content = projectContent[slug];
  if (!Content) notFound();
  const next = getNextProject(slug);

  const components = {
    Panel,
    // El margen del párrafo anterior (mb-3) suma con este: 24 px en total, igual que el padding del panel.
    Diagram: () => (project.flow ? <div className="mt-3"><ProjectFlow steps={project.flow} /></div> : null),
    Decisions: ({ n }: { n: string }) => <DecisionsPanel n={n} project={project} />,
    Metrics: () => <MetricsList project={project} />,
  };

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <JsonLd data={projectJsonLd(project)} />
      <Header />
      <main id="contenido" className="flex-1">
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-10 md:px-6">
            <nav aria-label="Migas de pan" className="font-mono text-xs text-muted-foreground">
              <ol className="flex flex-wrap gap-x-1">
                <li>
                  <Link href="/proyectos" className="hover:text-primary">
                    proyectos
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li aria-current="page">{project.code}</li>
              </ol>
            </nav>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-foreground/85">{project.lead}</p>
            <ul className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
              {project.stack.map((tech) => (
                <li key={tech} className="rounded-md border border-border bg-card px-2.5 py-1 text-primary">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto grid gap-8 px-4 py-10 md:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <SpecSheet project={project} />
          <div className="grid min-w-0 gap-5">
            <ProjectVisual project={project} />
            <Content components={components} />
          </div>
        </div>
        <nav aria-label="Otros casos" className="container mx-auto grid gap-3 px-4 pb-20 md:px-6 md:grid-cols-2">
          <Link
            href="/proyectos"
            className="rounded-lg border border-border p-5 transition-colors hover:border-primary"
          >
            <small className="font-mono text-xs text-muted-foreground">
              <span aria-hidden="true">← </span>volver
            </small>
            <b className="block font-display text-3xl font-normal">Todos los casos</b>
          </Link>
          {next && (
            <Link
              href={`/proyectos/${next.slug}`}
              className="rounded-lg border border-border p-5 transition-colors hover:border-primary md:text-right"
            >
              <small className="font-mono text-xs text-muted-foreground">
                siguiente<span aria-hidden="true"> →</span>
              </small>
              <b className="block font-display text-3xl font-normal">{next.title}</b>
            </Link>
          )}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
