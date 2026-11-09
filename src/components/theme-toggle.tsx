"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Tema claro", text: "Claro", icon: Sun },
  { value: "dark", label: "Tema oscuro", text: "Oscuro", icon: Moon },
  { value: "system", label: "Tema del sistema", text: "Sistema", icon: Monitor },
] as const;

export function ThemeToggle({ showLabels = false }: { showLabels?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // El tema real solo se conoce en el cliente: hasta montar no se marca ninguna opción.
  useEffect(() => setMounted(true), []);

  return (
    <div
      role="group"
      aria-label="Tema de color"
      className="inline-flex items-center rounded-md border border-border bg-background p-0.5"
    >
      {options.map(({ value, label, text, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-2 rounded-sm px-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {showLabels && <span>{text}</span>}
          </button>
        );
      })}
    </div>
  );
}
