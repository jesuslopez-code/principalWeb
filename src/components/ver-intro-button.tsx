"use client";

import { INTRO_TELON_EVENT } from "@/lib/intro-telon-script";

// Con prefers-reduced-motion el telón nunca se muestra, así que el botón se oculta por CSS.
export function VerIntroButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(INTRO_TELON_EVENT))}
      className="rounded-sm font-mono text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hidden"
    >
      ▶ ver intro
    </button>
  );
}
