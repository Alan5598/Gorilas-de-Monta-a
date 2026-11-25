"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { go } from "../lib/go";
import { useI18n } from "./I18n";

const SLIDES = [
  { src: "/images/Kalisimbi.jpg", alt: "Mount Karisimbi above the clouds" },
  { src: "/images/baby-gorila.jpg", alt: "A baby mountain gorilla" },
  { src: "/images/nyungwe.jpg", alt: "Nyungwe rainforest" },
  { src: "/images/elephant.jpg", alt: "An elephant in Akagera National Park" },
  { src: "/images/volcano.jpg", alt: "A volcano in the Virunga mountains" },
];
const DELAY = 5000;

let tornPath = "M0 90 V40";
for (let i = 1; i <= 60; i++) tornPath += ` L${(i * 26.7).toFixed(0)} ${(10 + (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 45).toFixed(0)}`;
tornPath += " V90Z";

export default function Hero() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const title = useRef(null);

  // advance every 5 seconds; picking a slide by hand restarts the timer
  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DELAY);
    return () => clearTimeout(id);
  }, [index]);

  useEffect(() => {
    const hero = title.current?.closest(".hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = null;
    const update = () => {
      frame = null;
      if (!title.current) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
      title.current.style.setProperty("--title-scroll-offset", `${-progress * Math.min(window.innerHeight * 0.14, 110)}px`);
    };
    const onScroll = () => { if (frame === null) frame = requestAnimationFrame(update); };
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
      <div className="hstage" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <Image key={s.src} className={`hslide${i === index ? " on" : ""}`} src={s.src} alt="" fill priority={i === 0} quality={80} sizes="100vw" />
        ))}
      </div>
      <div className="hero-shade" />

      <div className="hero-content">
        <h1 ref={title} className="hero-title" aria-label="Gorilas de Montaña">
          <svg viewBox="0 0 900 220" role="presentation" aria-hidden="true">
            <text x="50%" y="80%" textAnchor="middle" textLength="780" lengthAdjust="spacingAndGlyphs">GORILAS DE MONTAÑA</text>
          </svg>
        </h1>
        <p>{t("hero.tag")}</p>
        <a href="#trips" className="btn" onClick={(e) => go(e, "#trips")}>{t("hero.cta")}</a>
      </div>

      <div className="hero-dots" role="tablist" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button key={s.src} type="button" role="tab" aria-selected={i === index} aria-label={s.alt}
            className={`hero-dot${i === index ? " on" : ""}`} onClick={() => setIndex(i)}>
            <i />
          </button>
        ))}
      </div>

      <svg className="hero-torn" viewBox="0 0 1600 90" preserveAspectRatio="none" aria-hidden="true">
        <path d={tornPath} fill="#46563b" />
      </svg>
    </section>
  );
}
