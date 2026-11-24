"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { go } from "../lib/go";

let tornPath = "M0 90 V40";
for (let i = 1; i <= 60; i++) tornPath += ` L${(i * 26.7).toFixed(0)} ${(10 + (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 45).toFixed(0)}`;
tornPath += " V90Z";

export default function Hero() {
  const title = useRef(null);

  useEffect(() => {
    const hero = title.current?.closest(".hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = null;
    const update = () => {
      frame = null;
      if (!title.current) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      const offset = -progress * Math.min(window.innerHeight * 0.14, 110);
      title.current.style.setProperty("--title-scroll-offset", `${offset}px`);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hstage">
        <Image className="hbg" src="/images/Kalisimbi.jpg" alt="" fill priority quality={90} sizes="100vw" />
        <div className="title-layer">
          <h1 ref={title} className="hero-title" aria-label="Gorilas de Montaña">
            <svg viewBox="0 0 1200 220" role="presentation" aria-hidden="true">
              <text
                x="50%"
                y="80%"
                textAnchor="middle"
                textLength="780"
                lengthAdjust="spacingAndGlyphs"
              >
                GORILAS DE MONTAÑA
              </text>
            </svg>
          </h1>
        </div>
      </div>
      <div className="hero-copy">
        <p>Walk the volcano slopes of Rwanda and spend an hour with a mountain gorilla family.</p>
        <a href="#trips" className="btn" onClick={(e) => go(e, "#trips")}>See the trips</a>
      </div>
      <svg className="hero-torn" viewBox="0 0 1600 90" preserveAspectRatio="none" aria-hidden="true">
        <path d={tornPath} fill="#46563b" />
      </svg>
    </section>
  );
}
