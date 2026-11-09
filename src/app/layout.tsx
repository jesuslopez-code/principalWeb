import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { IntroTelon } from "@/components/intro-telon";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { introTelonScript } from "@/lib/intro-telon-script";
import {
  SITE_DESCRIPTION,
  SITE_LINKS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const fontBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

// Mismos hex que --background de :root (#f6f4fb) y de .dark (#0e0f16) (ver NotasAgentes.md). La
// media query sigue al sistema, no a la elección manual del conmutador: es una limitación del navegador.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f16" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: [
    "Jesús López",
    "desarrollador full-stack",
    "desarrollador web",
    ".NET",
    "C#",
    "Angular",
    "SQL Server",
    "portfolio",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Desarrollador Web Full-Stack",
  email: SITE_LINKS.email,
  description: SITE_DESCRIPTION,
  knowsAbout: [".NET", "C#", "ASP.NET Core", "Angular", "TypeScript", "SQL Server", "React"],
  sameAs: [SITE_LINKS.linkedin, SITE_LINKS.github],
};

// El script de next-themes se emite dentro de <body>: con red lenta el navegador puede pintar un
// fotograma con el tema por defecto (claro) antes de que llegue. Este, en <head>, corre antes de que
// exista el body. Replica su lógica (clave "theme", clase en <html>, defecto "system"); si se cambia
// allí, cambiarlo aquí.
const themeInitScript = `(function(){try{var s=localStorage.getItem("theme"),d=document.documentElement,t=s==="light"||s==="dark"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`scroll-smooth ${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: introTelonScript }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            Saltar al contenido
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
            }}
          />
          {children}
          <Toaster />
          <IntroTelon />
        </ThemeProvider>
      </body>
    </html>
  );
}
