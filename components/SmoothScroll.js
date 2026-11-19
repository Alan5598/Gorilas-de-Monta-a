"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const l = new Lenis({
      duration: reducedMotion ? 0 : 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
    });
    window.__lenis = l;
    let id;
    const raf = (t) => {
      l.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      l.destroy();
      if (window.__lenis === l) delete window.__lenis;
    };
  }, []);
  return null;
}
