import { ImageResponse } from "next/og";

export const alt = "Jesús López, Desarrollador Web Full-Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex equivalentes de los tokens .dark de globals.css (ImageResponse no lee variables CSS ni Tailwind).
const BACKGROUND = "#0e0f16"; // --background 232 24% 7%
const FOREGROUND = "#e6e8f0"; // --foreground 228 25% 92%
const MUTED = "#989dae"; // --muted-foreground 228 12% 64%
const PRIMARY = "#9e77f8"; // --primary 258 90% 72%
const CODE_STRING = "#75d1bf"; // --code-string 168 50% 64%
const GRID = "rgba(158, 119, 248, 0.09)"; // primary translúcido, como el hero

export default function OpengraphImage() {
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
        <div style={{ fontSize: 96, fontWeight: 700, color: FOREGROUND }}>
          Jesús López
        </div>
        <div style={{ fontSize: 48, marginTop: 24, color: PRIMARY }}>
          Desarrollador Web Full-Stack
        </div>
        <div style={{ fontSize: 32, marginTop: 40, color: MUTED }}>
          .NET · C# · Angular · SQL Server
        </div>
        <div style={{ fontSize: 28, marginTop: 40, color: CODE_STRING }}>
          &gt; dotnet run --project full-stack
        </div>
        <div style={{ fontSize: 28, marginTop: 40, color: MUTED }}>jesuslopezweb.com</div>
      </div>
    ),
    size,
  );
}
