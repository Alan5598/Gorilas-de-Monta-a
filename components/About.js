"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n } from "./I18n";

const ABOUT_IMAGES = [
  { src: "/images/about-1.png", alt: "Gorilas de Montaña company story" },
  { src: "/images/about-2.png", alt: "The story behind the Gorilas de Montaña name" },
  { src: "/images/about-3.png", alt: "Mountain gorilla trekking in the mist" },
  { src: "/images/about-4.png", alt: "Wildlife journeys beyond the mountains" },
  { src: "/images/About-5.png", alt: "The Gorilas de Montaña adventure trail and contact details" },
];

let tornPath = "M0 90 V40";
for (let i = 1; i <= 60; i++) tornPath += ` L${(i * 26.7).toFixed(0)} ${(10 + (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 45).toFixed(0)}`;
tornPath += " V90Z";

export default function About() {
  const { t } = useI18n();
  const gallery = useRef(null);

  useEffect(() => {
    const images = gallery.current?.querySelectorAll(".about-image");
    if (!images?.length) return;
    if (!("IntersectionObserver" in window)) {
      images.forEach((image) => image.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });

    images.forEach((image) => observer.observe(image));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about">
      <h2 className="sr">{t("nav.about")}</h2>
      <div className="about-gallery" ref={gallery}>
        {ABOUT_IMAGES.map((image) => (
          <figure className="about-image" key={image.src}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 90vw, 30vw" />
          </figure>
        ))}
      </div>
      <svg className="torn" viewBox="0 0 1600 90" preserveAspectRatio="none" aria-hidden="true">
        <path d={tornPath} fill="var(--paper)" />
      </svg>
    </section>
  );
}
