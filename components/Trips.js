"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { TRIPS, MORE } from "../lib/data";
import { openBooking } from "../lib/book";

const EASE = "cubic-bezier(.7,0,.2,1)";
const N = TRIPS.length;

export default function Trips() {
  const sec = useRef(null), row = useRef(null), ov = useRef(null), ct = useRef(null), rect = useRef(null);
  const [open, setOpen] = useState(null);
  const [lit, setLit] = useState(0);

  // pinned: each scroll step zooms one card in, then out while the next zooms in
  useEffect(() => {
    let t = false;
    const f = () => {
      t = false;
      const r = sec.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      const x = p * (N - 1);
      const kids = [...row.current.children];
      const step = kids[1].offsetLeft - kids[0].offsetLeft;
      const mob = innerWidth < 700;
      const S = Math.max(0.6, Math.min((innerHeight * 0.74) / kids[0].offsetHeight, (innerWidth * (mob ? 0.84 : 0.4)) / kids[0].offsetWidth) - 1);
      row.current.style.transform = `translateX(${-(x - (N - 1) / 2) * step}px)`;
      kids.forEach((c, i) => {
        const b = Math.max(0, 1 - Math.abs(x - i)), e = b * b * (3 - 2 * b);
        c.style.transform = `scale(${1 + S * e})`;
        c.style.zIndex = Math.round(e * 10);
        c.style.setProperty("--a", e.toFixed(3));
      });
    };
    const on = () => { if (!t) { t = true; requestAnimationFrame(f); } };
    f(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  const clip = (r) => `inset(${r.top}px ${document.documentElement.clientWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 6px)`;

  useLayoutEffect(() => {
    if (open === null) return;
    window.__lenis?.stop();
    ov.current.animate([{ clipPath: clip(rect.current) }, { clipPath: "inset(0px round 0px)" }], { duration: 850, easing: EASE, fill: "both" });
    ct.current.animate([{ opacity: 0, transform: "translateY(50px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 350, easing: EASE, fill: "both" });
    setLit(0);
    return () => window.__lenis?.start();
  }, [open]);

  // closing mirrors the opening: content fades, then the page shrinks back into its card
  const close = () => {
    if (!ov.current) return;
    ct.current.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(40px)" }], { duration: 350, easing: EASE, fill: "both" });
    const a = ov.current.animate([{ clipPath: "inset(0px round 0px)" }, { clipPath: clip(rect.current) }], { duration: 750, delay: 150, easing: EASE, fill: "both" });
    a.onfinish = () => setOpen(null);
  };

  useEffect(() => {
    const k = (e) => e.key === "Escape" && open !== null && close();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  });

  const onScroll = (e) => {
    const el = e.currentTarget.querySelector(".d-text").getBoundingClientRect();
    setLit(Math.min(1, Math.max(0, (innerHeight * 0.85 - el.top) / (el.height + innerHeight * 0.2))));
  };

  const trip = open !== null ? TRIPS[open] : null;
  const words = trip ? (trip.t + MORE).split(" ") : [];

  return (
    <section id="trips" className="trips" ref={sec} style={{ height: `${100 + (N - 1) * 85}vh` }}>
      <div className="stage">
        <div className="t-head"><h2 className="disp">Choose your trip</h2><p> </p></div>
        <div className="rowwrap">
          <div className="row" ref={row}>
            {TRIPS.map((t, i) => (
              <button key={t.n} className="card" aria-label={`Open ${t.n}`}
                onClick={(e) => { rect.current = e.currentTarget.getBoundingClientRect(); setOpen(i); }}>
                <Image src={t.img} alt="" fill sizes="45vw" unoptimized />
                <span className="cap"><b className="disp">{t.n}</b><small>{t.f[0][1]} · {t.f[1][1]}</small></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {trip && (
        <div className="detail" ref={ov} data-lenis-prevent role="dialog" aria-modal="true" aria-label={trip.n} onScroll={onScroll}>
          <button className="x" onClick={close} aria-label="Close trip">✕</button>
          <div ref={ct}>
            <div className="banner"><Image src={trip.img} alt={trip.n} fill sizes="100vw" priority unoptimized /></div>
            <div className="d-body">
              <span className="d-label">About</span>
              <div>
                <h3 className="disp">{trip.n}</h3>
                <p className="d-text">{words.map((w, i) => <span key={i} className={i < Math.round(lit * words.length) ? "on" : ""}>{w} </span>)}</p>
                <div className="facts">{trip.f.map(([a, b]) => <div key={a}>{a}<b>{b}</b></div>)}</div>
                <button className="btn dark" onClick={() => openBooking()}>Book this trip</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
