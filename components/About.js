"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const WORDS = ("Sometimes you will never know the value of a moment until it becomes a memory. " +
  "Come walk with us beneath the volcanoes, where every step is slow, every silence is shared, " +
  "and every gorilla family is a story worth protecting.").split(" ");

let d = "M0 90 V40";
for (let i = 1; i <= 60; i++) d += ` L${(i * 26.7).toFixed(0)} ${(10 + (Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) * 45).toFixed(0)}`;
d += " V90Z";

export default function About() {
  const root = useRef(null);
  useEffect(() => {
    const el = root.current, ws = el.querySelectorAll(".w"), ts = el.querySelectorAll("[data-s]");
    let t = false;
    const f = () => {
      t = false;
      const r = el.getBoundingClientRect();
      ts.forEach((x) => (x.style.transform = `translateY(${-r.top * x.dataset.s}px)`));
      const p = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (r.height * 0.7)));
      const n = Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle("on", i < n));
    };
    const on = () => { if (!t) { t = true; requestAnimationFrame(f); } };
    f(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);
  return (
    <section id="about" className="about" ref={root}>
      <div className="tile t1" data-s="-0.12"><Image src="/images/about-1.jpg" alt="Travellers hiking toward the volcanoes" fill sizes="30vw" /></div>
      <div className="tile t2" data-s="0.1"><Image src="/images/about-2.jpg" alt="A guide leading a small group on the trail" fill sizes="30vw" /></div>
      <div className="tile t3" data-s="-0.2"><Image src="/images/about-3.jpg" alt="A traveller watching the forest in silence" fill sizes="20vw" /></div>
      <h2 className="sr">About us</h2>
      <p className="about-text">
        {WORDS.map((w, i) => <span key={i} className="w">{w} </span>)}
      </p>
      <svg className="torn" viewBox="0 0 1600 90" preserveAspectRatio="none" aria-hidden="true"><path d={d} fill="var(--paper)" /></svg>
    </section>
  );
}
