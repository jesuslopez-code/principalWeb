import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Mismo dibujo que icon.svg; hex de --background y --primary del tema oscuro (violeta .NET).
const BACKGROUND = "#0e0f16";
const PRIMARY = "#9e77f8";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BACKGROUND,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 64 64">
          <polyline
            points="15,19 31,32 15,45"
            fill="none"
            stroke={PRIMARY}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="35" y="41" width="17" height="8" rx="2" fill={PRIMARY} />
        </svg>
      </div>
    ),
    size,
  );
}
