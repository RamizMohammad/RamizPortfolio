import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #05070d 0%, #0d1530 60%, #1a1240 100%)", color: "#eef3ff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#3be8ff" }}>SOFTWARE ENGINEER · MOGLIX</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 132, fontWeight: 900, lineHeight: 0.9, letterSpacing: -6 }}>
          <span>{profile.firstName}</span>
          <span style={{ color: "#a08bff" }}>{profile.lastName}</span>
        </div>
        <div style={{ fontSize: 28, color: "#a3adc4" }}>Automation · Backends · APIs · Infrastructure</div>
      </div>
    ),
    size,
  );
}
