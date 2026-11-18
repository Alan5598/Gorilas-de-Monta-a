"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { TRIP_PLAN } from "../lib/data";

const N = TRIP_PLAN.length;

export default function Trips() {
  const section = useRef(null);
  const row = useRef(null);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      if (!section.current || !row.current) return;
      const bounds = section.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      const position = progress * (N - 1);
      const cards = [...row.current.children];
      if (cards.length < 2) return;
      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      const mobile = innerWidth < 700;
      const zoom = Math.max(
        0.6,
        Math.min(
          (innerHeight * 0.62) / cards[0].offsetHeight,
          (innerWidth * (mobile ? 0.84 : 0.4)) / cards[0].offsetWidth
        ) - 1
      );
      row.current.style.transform = `translateX(${-(position - (N - 1) / 2) * step}px)`;
      cards.forEach((card, index) => {
        const distance = Math.max(0, 1 - Math.abs(position - index));
        const emphasis = distance * distance * (3 - 2 * distance);
        card.style.transform = `scale(${1 + zoom * emphasis})`;
        card.style.zIndex = String(Math.round(emphasis * 10));
        card.style.setProperty("--a", emphasis.toFixed(3));
      });
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const onResize = () => onScroll();

    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const showDestination = (day, event) => {
    window.dispatchEvent(new CustomEvent("destination-open", {
      detail: {
        destinationId: day.destinationId,
        day,
        origin: event.currentTarget.getBoundingClientRect(),
      },
    }));
  };

  return (
    <section id="trips" className="trips" ref={section} style={{ height: `${100 + (N - 1) * 78}vh` }}>
      <div className="stage">
        <div className="t-head trip-plan-head">
          <p className="trip-plan-eyebrow">Kigali · Akagera · Volcanoes · Lake Kivu · Kigali</p>
          <h2 className="disp">TRIP PLAN</h2>
          <p className="trip-plan-title">6-Day Rwanda Primate, Wildlife &amp; Cultural Discovery</p>
          <p className="trip-plan-market">Mid-range to Luxury <span>·</span> Couples &amp; Small Groups</p>
          <p className="trip-plan-hint"> </p>
        </div>
        <div className="rowwrap">
          <div className="row trip-plan-row" ref={row}>
            {TRIP_PLAN.map((item) => (
              <button
                key={item.day}
                className="card day-card"
                type="button"
                aria-label={`${item.day}: ${item.title}. Explore ${item.location}`}
                onClick={(event) => showDestination(item, event)}
              >
                <Image src={item.image} alt="" fill sizes="45vw" unoptimized />
                <span className="day-number">{item.day}</span>
                <span className="cap">
                  <b className="disp">{item.title}</b>
                  <small>{item.location}</small>
                  <small className="day-discover">Explore destination ↗</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
