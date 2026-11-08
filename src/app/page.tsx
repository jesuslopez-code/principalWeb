import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SITE_AVAILABLE, SITE_DESCRIPTION, SITE_LINKS, SITE_NAME, SITE_TITLE } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProjectsSection } from "@/components/projects-section";
import { SectionHeading } from "@/components/section-heading";

const profilePicture = PlaceHolderImages.find(
  (img) => img.id === "profile-picture"
);

// openGraph se redeclara entero: Next sustituye el objeto del layout, no lo fusiona.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const skillLayers = [
  {
    layer: "front",
    fullName: "Front-End",
    summary:
      "Construyo interfaces de usuario dinámicas, escalables y responsives, centradas en ofrecer una experiencia de usuario excepcional.",
    technologies: ["HTML5", "CSS3", "JavaScript", "TypeScript", "Angular", "React"],
  },
  {
    layer: "back",
    fullName: "Back-End",
    summary:
      "Diseño y desarrollo de APIs RESTful seguras y eficientes que forman el núcleo de la lógica de negocio de cualquier aplicación.",
    technologies: [".NET", "C#", "ASP.NET Core", "Entity Framework", "Node.js"],
  },
  {
    layer: "datos",
    fullName: "Bases de datos",
    summary:
      "Gestiono la capa de acceso a datos de forma segura y optimizada, conectando la lógica de negocio con bases de datos relacionales.",
    technologies: ["SQL Server", "MySQL"],
  },
  {
    layer: "herramientas",
    fullName: "Herramientas",
    summary: "Uso de herramientas para control de versiones y gestión de proyectos.",
    technologies: ["Git", "GitHub"],
  },
];

// Pares clave/valor de la ficha de Sobre mí: solo datos ya publicados en la web. Ampliable.
const profileFacts: { key: string; value: string; available?: boolean }[] = [
  { key: "rol", value: "Full-Stack" },
  { key: "stack", value: ".NET · C# · Angular · SQL Server" },
  {
    key: "estado",
    value: SITE_AVAILABLE ? "disponible" : "no disponible",
    available: SITE_AVAILABLE,
  },
];

function HeroSection() {
  return (
    <section className="hero-bg relative w-full overflow-hidden py-20 md:py-32 lg:py-40">
      <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p
            className="hero-reveal font-mono text-sm text-primary md:text-base"
            style={{ "--delay": "0s" } as CSSProperties}
          >
            &gt; dotnet run --project full-stack
            <span
              aria-hidden="true"
              className="cursor-blink ml-1 inline-block h-[1.1em] w-2 translate-y-[0.2em] bg-primary"
            />
          </p>
          <h1
            className="hero-reveal-rise mt-6 font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ "--delay": "0.08s" } as CSSProperties}
          >
            Jesús <span className="italic text-primary">López</span>
          </h1>
          <p
            className="hero-reveal mt-5 font-mono text-sm uppercase tracking-widest text-muted-foreground md:text-base"
            style={{ "--delay": "0.16s" } as CSSProperties}
          >
            Desarrollador Web Full-Stack
          </p>
          <p
            className="hero-reveal mt-6 max-w-xl text-base text-foreground/80 md:text-lg"
            style={{ "--delay": "0.24s" } as CSSProperties}
          >
            Transformo ideas en código y soluciones digitales robustas. Construyo aplicaciones web eficientes y escalables, del Back-End con .NET al Front-End con Angular.
          </p>
          <div
            className="hero-reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={{ "--delay": "0.32s" } as CSSProperties}
          >
            <Button asChild size="lg">
              <Link href="#projects">
                Ver mis proyectos
                <MoveRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Link
              href="#contact"
              className="text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Contactar
            </Link>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a
                href={SITE_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={SITE_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="hero-reveal overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-primary/5"
          style={{ "--delay": "0.4s" } as CSSProperties}
        >
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">Developer.cs</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground/90 sm:text-sm">
            <code>
              <span className="text-primary">public record</span> Developer({"\n"}
              {"    "}
              <span className="text-primary">string</span> Nombre = <span className="text-code-string">&quot;Jesús López&quot;</span>,{"\n"}
              {"    "}
              <span className="text-primary">string</span>[] Stack = [{"\n"}
              {"        "}
              <span className="text-code-string">&quot;.NET 8&quot;</span>, <span className="text-code-string">&quot;C#&quot;</span>, <span className="text-code-string">&quot;Angular&quot;</span>,{"\n"}
              {"        "}
              <span className="text-code-string">&quot;SQL Server&quot;</span>, <span className="text-code-string">&quot;Docker&quot;</span>{"\n"}
              {"    "}],{"\n"}
              {"    "}
              <span className="text-primary">bool</span> Disponible = <span className="text-primary">{String(SITE_AVAILABLE)}</span>{"\n"}
              );{"\n"}
              <span className="text-muted-foreground">{"// Listo para el siguiente reto."}</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <div className="w-44 lg:w-56">
            {profilePicture && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
                <Image
                  src={profilePicture.imageUrl}
                  alt="Retrato de Jesús López"
                  fill
                  sizes="(min-width: 1024px) 224px, 176px"
                  className="object-cover grayscale"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-primary/30 mix-blend-multiply"
                />
              </div>
            )}
          </div>
          <div className="space-y-6">
            <SectionHeading id="about-title" index="01" label="sobre mí">
              Hola, soy Jesús
            </SectionHeading>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-lg border border-border bg-card p-4 font-mono text-sm">
              {profileFacts.map((fact) => (
                <div key={fact.key} className="contents">
                  <dt className="text-muted-foreground">{fact.key}</dt>
                  <dd className="text-foreground">
                    {fact.available && (
                      <span aria-hidden="true" className="mr-2 text-primary">
                        ●
                      </span>
                    )}
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-lg text-foreground/80">
              Soy un desarrollador web con un objetivo claro: crear y mantener aplicaciones web de alto rendimiento. Mi rol como Desarrollador Full-Stack me permite tener una visión completa del producto, garantizando que cada pieza, desde la base de datos hasta la interfaz de usuario, funcione en perfecta armonía.
            </p>
            <p className="text-lg text-foreground/80">
              Me considero un aprendiz constante, siempre buscando nuevos retos que me permitan evolucionar y aplicar las mejores prácticas en cada proyecto. Disfruto colaborando en equipos donde puedo aportar mi experiencia y aprender de los demás para construir soluciones tecnológicas que realmente aporten valor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading id="skills-title" index="03" label="habilidades">
          Habilidades y tecnologías
        </SectionHeading>
        <dl className="mt-12 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card font-mono text-sm">
          {skillLayers.map((item) => (
            <div key={item.layer} className="grid gap-2 p-4 md:grid-cols-[10rem_1fr] md:gap-6 md:p-5">
              <dt className="text-primary">
                <span aria-hidden="true">&gt; {item.layer}</span>
                <span className="sr-only">{item.fullName}</span>
              </dt>
              <dd className="space-y-1">
                <p className="text-foreground">{item.technologies.join(" · ")}</p>
                <p className="font-body text-muted-foreground">{item.summary}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}


function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="w-full py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading id="contact-title" index="04" label="contacto">
              ¿Hablamos?
            </SectionHeading>
            {SITE_AVAILABLE && (
              <p className="font-mono text-sm text-foreground">
                <span aria-hidden="true" className="mr-2 text-primary">
                  ●
                </span>
                disponible
              </p>
            )}
            <p className="text-lg text-foreground/80">
              Estoy buscando activamente nuevos desafíos y oportunidades para aportar mi experiencia. Si tienes un proyecto en mente, una vacante en tu equipo o simplemente quieres conectar, no dudes en contactarme.
            </p>
            <CopyEmail email={SITE_LINKS.email} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm">
              <a
                href={SITE_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href={SITE_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Envíame un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
