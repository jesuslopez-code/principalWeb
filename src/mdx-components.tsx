import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children }) => <p className="mb-3 text-foreground/85 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 text-foreground/85">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-foreground/85">{children}</ol>,
    a: ({ href = "", children }) => {
      const linkClass = "text-primary underline underline-offset-4 hover:no-underline";
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link href={href} className={linkClass}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {children}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      );
    },
    ...components,
  };
}
