"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { DEST } from "../lib/data";
import { openBooking } from "../lib/book";

export default function Destinations() {
  const sec = useRef(null), track = useRef(null);
  useEffect(() => {
    let t = false;
    const size = () => {
      // vertical scroll distance equals the sideways distance, so the motion feels 1:1
      const max = Math.max(0, track.current.scrollWidth - innerWidth);
      sec.current.style.height = `${max + innerHeight}px`;
    };
    const f = () => {
      t = false;
      const r = sec.current.getBoundingClientRect();
      const max = Math.max(0, track.current.scrollWidth - innerWidth);
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      track.current.style.transform = `translateX(${-p * max}px)`;
      track.current.querySelectorAll(".d-card").forEach((c) => {
        const b = c.getBoundingClientRect();
        const o = (b.left + b.width / 2 - innerWidth / 2) / innerWidth;
        c.querySelector(".d-img").style.transform = `translateX(${o * -14}%) scale(1.3)`;
      });
    };
    const on = () => { if (!t) { t = true; requestAnimationFrame(f); } };
    const rs = () => { size(); on(); };
    size(); f();
    addEventListener("scroll", on, { passive: true }); addEventListener("resize", rs);
    addEventListener("load", rs);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", rs); removeEventListener("load", rs); };
  }, []);

  return (
    <section id="destinations" className="dests" ref={sec}>
      <div className="dstage">
        <div className="d-head">
          <h2 className="disp">Our top destinations</h2>
          <p>Five places that show Rwanda’s wildlife, landscapes and history. Keep scrolling to travel through them.</p>
        </div>
        <div className="dtrack" ref={track}>
          {DEST.map((d) => (
            <article className="d-card" key={d.n}>
              <div className="d-frame"><div className="d-img"><Image src={d.img} alt={d.n} fill sizes="40vw" unoptimized /></div></div>
              <div className="d-info">
                <h3 className="disp">{d.n}</h3>
                <p>{d.tag}</p>
                <button className="link" onClick={() => openBooking(d.place)}>Plan a visit</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
