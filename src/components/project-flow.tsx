import type { FlowStep } from "@/lib/projects";

interface ProjectFlowProps {
  steps: FlowStep[];
  compact?: boolean;
}

// Decorativo: el recorrido completo va también como texto para lectores de pantalla.
export function ProjectFlow({ steps, compact = false }: ProjectFlowProps) {
  const rowClass = compact ? "" : "md:flex-row md:items-center";
  const boxClass = compact ? "" : "md:flex-1";
  return (
    <>
      <p className="sr-only">
        Flujo: {steps.map((step) => (step.note ? `${step.label} (${step.note})` : step.label)).join(", después ")}.
      </p>
      <div
        aria-hidden="true"
        className={`flex flex-col items-stretch gap-2 font-mono text-xs ${rowClass}`}
      >
        {steps.map((step, i) => (
          <div key={step.label} className={`flex flex-col items-stretch gap-2 ${compact ? "" : "md:contents"}`}>
            {i > 0 && (
              <>
                <span className={`text-center text-primary ${compact ? "" : "md:hidden"}`}>↓</span>
                {!compact && <span className="hidden text-center text-primary md:block">→</span>}
              </>
            )}
            <div
              className={`rounded-md border border-border bg-muted px-3 py-2.5 text-center text-foreground ${boxClass}`}
            >
              {step.label}
              {step.note && <small className="block text-[11px] text-muted-foreground">{step.note}</small>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
