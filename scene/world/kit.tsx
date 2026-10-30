"use client";

import { RoundedBox, Text, useTexture } from "@react-three/drei";
import { useMemo, type ReactNode } from "react";
import * as THREE from "three";

/**
 * The world's building kit. Every place is assembled from these parts so the whole town shares
 * one material language: matte paper and kraft board, flat ink colours, tape, painted signs.
 */

export const INK = {
  paper: "#fbf3e6",
  board: "#f3e6cf",
  kraft: "#d9a066",
  kraftDark: "#b97f45",
  navy: "#1f2370",
  blue: "#2b34c4",
  red: "#c4262f",
  orange: "#d9661f",
  green: "#1f8a5c",
  violet: "#6b3fc0",
  tape: "#ffd84a",
  grey: "#8a8fb0",
} as const;

export const FONT_DISPLAY = "/fonts/archivo-black.ttf";
export const FONT_MONO = "/fonts/space-mono-bold.ttf";

type V3 = [number, number, number];

/** A rounded block in a flat matte colour. The workhorse of the whole world. */
export function Block({ size, position, rotation, color, radius = 0.06, children, castShadow = true }: { size: V3; position?: V3; rotation?: V3; color: string; radius?: number; children?: ReactNode; castShadow?: boolean }) {
  return (
    <RoundedBox args={size} radius={Math.min(radius, ...size.map((s) => s / 2 - 0.001))} smoothness={3} position={position} rotation={rotation} castShadow={castShadow} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.92} metalness={0} />
      {children}
    </RoundedBox>
  );
}

/** A strip of highlighter tape, slightly crooked. */
export function Tape({ position, rotation = [0, 0, 0], length = 1.2, width = 0.22 }: { position: V3; rotation?: V3; length?: number; width?: number }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={false}>
      <boxGeometry args={[length, width, 0.012]} />
      <meshStandardMaterial color={INK.tape} roughness={0.55} transparent opacity={0.92} />
    </mesh>
  );
}

/** Painted text. Display face for names, mono for labels. */
export function Sign({ children, position, rotation, size = 0.4, color = INK.navy, mono = false, anchorX = "center", maxWidth }: { children: string; position: V3; rotation?: V3; size?: number; color?: string; mono?: boolean; anchorX?: "left" | "center" | "right"; maxWidth?: number }) {
  return (
    <Text position={position} rotation={rotation} fontSize={size} color={color} font={mono ? FONT_MONO : FONT_DISPLAY} anchorX={anchorX} anchorY="middle" maxWidth={maxWidth} letterSpacing={mono ? 0.04 : -0.02} textAlign="center">
      {children}
    </Text>
  );
}

/** A picture (screenshot, logo, portrait) mounted flat on a surface. */
export function Picture({ src, width, height, position, rotation, glow = 0 }: { src: string; width: number; height: number; position: V3; rotation?: V3; glow?: number }) {
  const map = useTexture(src, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={map} roughness={0.6} emissive="#ffffff" emissiveMap={map} emissiveIntensity={0.35 + glow} toneMapped={false} />
    </mesh>
  );
}

/** Lollipop tree: a ball of colour on a stick. Dresses every place in the same way. */
export function Tree({ position, color = INK.green, scale = 1 }: { position: V3; color?: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.9, 8]} />
        <meshStandardMaterial color={INK.kraftDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

/** The low card platform every place stands on, with a kraft edge. */
export function Platform({ size, position = [0, 0, 0], color = INK.board }: { size: [number, number]; position?: V3; color?: string }) {
  return (
    <group position={position}>
      <Block size={[size[0], 0.22, size[1]]} position={[0, 0.11, 0]} color={color} radius={0.08} />
      <Block size={[size[0] + 0.12, 0.08, size[1] + 0.12]} position={[0, 0.04, 0]} color={INK.kraft} radius={0.04} castShadow={false} />
    </group>
  );
}

/** Graph paper under the whole town: a grid drawn once into a canvas texture. */
export function PaperGround() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = INK.paper;
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(43,52,196,0.16)";
    g.lineWidth = 2;
    for (let i = 0; i <= 256; i += 64) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 256);
      g.moveTo(0, i);
      g.lineTo(256, i);
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(80, 30);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[50, 0, 0]} receiveShadow>
      <planeGeometry args={[320, 120]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}
