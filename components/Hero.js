"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { go } from "../lib/go";

export default function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    let frame = null;
    const f = () => {
      frame = null;
      if (!ref.current) return;
      ref.current.style.setProperty("--p", Math.min(1, scrollY / innerHeight));
    };
    const on = () => { if (frame === null) frame = requestAnimationFrame(f); };
    addEventListener("scroll", on, { passive: true });
    return () => {
      removeEventListener("scroll", on);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section id="home" className="hero" ref={ref}>
      {/* one stage keeps photo, title and cutout aligned on every screen */}
      <div className="hstage">
        <Image className="hbg" src="/images/hero-bg.jpg" alt="" fill priority sizes="100vw" />
        <div className="title-layer">
          <h1 className="hero-title disp" aria-label="Gorilas de Montaña"><span>Gorilas</span> <span>de Montaña</span></h1>
        </div>
        <Image className="hfg" src="/images/hero-fg.webp" alt="A snow-covered mountain lit by the last light of the day" fill priority sizes="100vw" />
      </div>
      <div className="hero-copy">
        <p>Walk the volcano slopes of Rwanda and spend an hour with a mountain gorilla family.</p>
        <a href="#trips" className="btn" onClick={(e) => go(e, "#trips")}>See the trips</a>
      </div>
    </section>
  );
}
