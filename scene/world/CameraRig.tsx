"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { signals, target } from "../store";
import { PLACES, STREET_ENDS, streetSpot } from "./places";

const SYSTEMS = PLACES.findIndex((p) => p.id === "systems");
const ease = (t: number) => t * t * (3 - 2 * t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The world stays put; the camera travels. Scroll position (target.form, written by GSAP) picks
 * a point between two places; the camera eases there, lifting a little mid-flight like a drone.
 * On wide screens the view is shifted so the place sits beside the text panel, not under it.
 */
export default function CameraRig({ reduced, onLight }: { reduced: boolean; onLight: (x: number) => void }) {
  const { camera, size } = useThree();
  const form = useRef(target.form);
  const street = useRef(0);
  const scratch = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3() });
  const lookNow = useRef(new THREE.Vector3(0, 1.5, 0));
  const panel = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  // Width of the text panel on the left; the scene is framed in what remains.
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector<HTMLElement>(".panel");
      panel.current = window.innerWidth >= 1024 && el ? el.getBoundingClientRect().width : 0;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useFrame((_, dt) => {
    const { pos, look } = scratch.current;
    const k = reduced ? 1 : 1 - Math.exp(-3 * Math.min(dt, 0.1));
    form.current += (target.form - form.current) * k;
    const f = THREE.MathUtils.clamp(form.current, 0, PLACES.length - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(i0 + 1, PLACES.length - 1);
    const t = ease(f - i0);
    const A = PLACES[i0];
    const B = PLACES[i1];
    const lift = Math.sin(t * Math.PI) * 2.2;
    pos.set(A.x + A.cam[0] + (B.x + B.cam[0] - A.x - A.cam[0]) * t, A.cam[1] + (B.cam[1] - A.cam[1]) * t, A.cam[2] + (B.cam[2] - A.cam[2]) * t);
    look.set(A.x + A.look[0] + (B.x + B.look[0] - A.x - A.look[0]) * t, A.look[1] + (B.look[1] - A.look[1]) * t, A.look[2] + (B.look[2] - A.look[2]) * t);
    // Places are framed for a wide view; when the visible area is narrower (beside the panel, or a
    // phone band) the camera backs off along its line of sight so the whole place still fits.
    const aspect = (size.width - panel.current) / size.height;
    pos.sub(look).multiplyScalar(THREE.MathUtils.clamp(Math.sqrt(1.7 / aspect), 1, 1.45)).add(look);
    pos.y += lift;

    // On the Systems street the camera walks sideways with the list, or straight to the kiosk of the
    // system being pointed at. The walk fades out as the camera flies on to the next place.
    const [a, b] = STREET_ENDS;
    const want = signals.system ? THREE.MathUtils.clamp(streetSpot(signals.system), a, b) : a + (b - a) * target.street;
    street.current += (want - street.current) * k;
    const onStreet = Math.max(0, 1 - Math.abs(f - SYSTEMS));
    const walk = street.current * onStreet;
    pos.x += walk;
    look.x += walk;

    // A gentle parallax from the mouse, so the diorama feels physical.
    pointer.current.x += (signals.pointer.x - pointer.current.x) * 0.05;
    pointer.current.y += (signals.pointer.y - pointer.current.y) * 0.05;
    if (!reduced) {
      pos.x += pointer.current.x * 0.6;
      pos.y -= pointer.current.y * 0.35;
    }

    // Entrance: start high above the whole town and swoop down to the square.
    const intro = 1 - easeOutCubic(signals.intro);
    pos.y += intro * 16;
    pos.z += intro * 10;
    pos.x += intro * 14;

    camera.position.copy(pos);
    lookNow.current.lerp(look, reduced ? 1 : 0.2);
    camera.lookAt(lookNow.current);

    const cam = camera as THREE.PerspectiveCamera;
    const shift = panel.current / 2;
    if (shift > 0) cam.setViewOffset(size.width, size.height, -shift, 0, size.width, size.height);
    else if (cam.view) cam.clearViewOffset();

    onLight(look.x);
  });
  return null;
}
