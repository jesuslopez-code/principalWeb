import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/projects";

export function Panel({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-5 md:p-6">
      <h2 className="mb-4 flex items-baseline gap-3 font-display text-3xl leading-tight">
        <span aria-hidden="true" className="font-mono text-xs text-primary">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function SpecSheet({ project }: { project: Project }) {
  return (
    <aside
      aria-labelledby="spec-title"
      className="self-start rounded-lg border border-border bg-card font-mono text-[13px] lg:sticky lg:top-20 lg:order-2"
    >
      <h2 id="spec-title" className="border-b border-border px-4 py-3.5 text-xs font-normal text-muted-foreground">
        {"//"} ficha técnica
      </h2>
      <dl className="px-4 py-2">
        {project.spec.map((item) => (
          <div key={item.key} className="flex justify-between gap-3 border-b border-border py-2 last:border-0">
            <dt className="text-muted-foreground">{item.key}</dt>
            <dd className="text-right">{item.value}</dd>
          </div>
        ))}
        {project.privateSource && (
          <div className="flex justify-between gap-3 py-2">
            <dt className="text-muted-foreground">código</dt>
            <dd className="inline-flex items-center gap-1.5 text-right">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              privado
            </dd>
          </div>
        )}
      </dl>
      {project.links.length > 0 && (
        <div className="grid gap-2 border-t border-border p-4">
          {project.links.map((link) => (
            <Button key={link.href} asChild variant={link.primary ? "default" : "outline"} className="font-mono text-[13px]">
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} <span aria-hidden="true">&nbsp;↗</span>
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </Button>
          ))}
        </div>
      )}
    </aside>
  );
}

const labelClass = "mb-0.5 block font-mono text-[11px] text-muted-foreground md:hidden";

export function DecisionsPanel({ n, project }: { n: string; project: Project }) {
  return (
    <Panel n={n} title="Decisiones">
      <table className="w-full border-collapse text-sm md:text-[15px]">
        <thead className="max-md:sr-only">
          <tr className="text-left font-mono text-[11px] font-normal text-muted-foreground">
            <th scope="col" className="border-b border-border px-2.5 py-2 font-normal">
              decisión
            </th>
            <th scope="col" className="border-b border-border px-2.5 py-2 font-normal">
              descartado
            </th>
            <th scope="col" className="border-b border-border px-2.5 py-2 font-normal">
              por qué
            </th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {project.decisions.map((row) => (
            <tr key={row.decision} className="max-md:block max-md:border-b max-md:border-border max-md:py-3">
              <td className="font-medium max-md:block max-md:py-1 md:border-b md:border-border md:px-2.5 md:py-3 md:align-top">
                <span className={labelClass}>decisión</span>
                {row.decision}
              </td>
              <td className="text-muted-foreground max-md:block max-md:py-1 md:border-b md:border-border md:px-2.5 md:py-3 md:align-top">
                <span className={labelClass}>descartado</span>
                <span className="line-through decoration-muted-foreground/50">{row.discarded}</span>
              </td>
              <td className="text-foreground/85 max-md:block max-md:py-1 md:border-b md:border-border md:px-2.5 md:py-3 md:align-top">
                <span className={labelClass}>por qué</span>
                {row.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function MetricsList({ project }: { project: Project }) {
  return (
    <ul className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      {project.metrics.map((metric) => (
        <li key={metric.label} className="rounded-md border border-border bg-card p-4">
          <b className="block font-display text-4xl font-normal leading-none text-primary">{metric.value}</b>
          <span className="font-mono text-xs text-muted-foreground">{metric.label}</span>
        </li>
      ))}
    </ul>
  );
}
