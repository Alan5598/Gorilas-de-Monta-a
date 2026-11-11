"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const l = new Lenis({ duration: 1.35, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = l;
    let id;
    const raf = (t) => { l.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); delete window.__lenis; };
  }, []);
  return null;
}
