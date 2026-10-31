import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#100904", color: "#ffedd7", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
          <span>RAMIZ</span>
          <span style={{ color: "#dc5000" }}>SOFTWARE ENGINEER — MOGLIX</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 500, lineHeight: 0.9 }}>
          <span>MOHAMMAD</span>
          <span>RAMIZ</span>
        </div>
        <div style={{ fontSize: 26, color: "#b3a491" }}>BACKEND · AUTOMATION · INFRASTRUCTURE</div>
      </div>
    ),
    size,
  );
}
