import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fbf3e6", color: "#1f2370", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#2b34c4" }}>SOFTWARE ENGINEER · MOGLIX</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 132, fontWeight: 900, lineHeight: 0.9, letterSpacing: -6 }}>
          <span>{profile.firstName}</span>
          <span style={{ color: "#c4262f" }}>{profile.lastName}</span>
        </div>
        <div style={{ fontSize: 28, color: "#474c86" }}>Automation · Backends · APIs · Infrastructure</div>
      </div>
    ),
    size,
  );
}
