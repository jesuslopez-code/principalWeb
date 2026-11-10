import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  index: string;
  label: string;
  children: ReactNode;
}

export function SectionHeading({ id, index, label, children }: SectionHeadingProps) {
  return (
    <div>
      <p aria-hidden="true" className="font-mono text-sm text-primary">
        {"//"} {index} — {label}
      </p>
      <h2
        id={id}
        className="mt-3 font-display text-4xl tracking-tight sm:text-5xl md:text-6xl"
      >
        {children}
      </h2>
    </div>
  );
}
