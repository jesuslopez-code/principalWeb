import type { Metadata } from "next";
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark scroll-smooth ${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
