import { ImageResponse } from "next/og";
import { getCaseStudies, getProjectBySlug } from "@/lib/projects";

export const alt = "Caso de estudio de Jesús López";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mismos hex fijos que la OG principal (ver NotasAgentes.md, «Paleta de OG e iconos»).
const BACKGROUND = "#0e0f16";
const FOREGROUND = "#e6e8f0";
const MUTED = "#989dae";
const PRIMARY = "#9e77f8";
const CODE_STRING = "#75d1bf";
const GRID = "rgba(158, 119, 248, 0.09)";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: BACKGROUND,
          backgroundImage: `linear-gradient(${GRID} 2px, transparent 2px), linear-gradient(90deg, ${GRID} 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
          color: FOREGROUND,
          borderLeft: `16px solid ${PRIMARY}`,
        }}
      >
        <div style={{ fontSize: 32, color: CODE_STRING }}>
          {`// caso de estudio · ${project?.code ?? ""}`}
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24, color: FOREGROUND }}>
          {project?.title ?? "Caso de estudio"}
        </div>
        <div style={{ fontSize: 36, marginTop: 32, color: PRIMARY }}>
          {project?.stack.slice(0, 4).join(" · ")}
        </div>
        <div style={{ fontSize: 28, marginTop: 56, color: MUTED }}>Jesús López · jesuslopezweb.com</div>
      </div>
    ),
    size,
  );
}

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}
