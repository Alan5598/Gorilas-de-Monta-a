"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { DEST } from "../lib/data";
import { openBooking } from "../lib/book";

const EASE = "cubic-bezier(.7,0,.2,1)";

export default function Destinations() {
  const sec = useRef(null);
  const track = useRef(null);
  const overlay = useRef(null);
  const content = useRef(null);
  const origin = useRef(null);
  const [selected, setSelected] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let frame = null;
    const size = () => {
      if (!sec.current || !track.current) return;
      const max = Math.max(0, track.current.scrollWidth - innerWidth);
      sec.current.style.height = `${max + innerHeight}px`;
    };
    const update = () => {
      frame = null;
      if (!sec.current || !track.current) return;
      const bounds = sec.current.getBoundingClientRect();
      const max = Math.max(0, track.current.scrollWidth - innerWidth);
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      track.current.style.transform = `translateX(${-progress * max}px)`;
      track.current.querySelectorAll(".d-card").forEach((card) => {
        const cardBounds = card.getBoundingClientRect();
        const offset = (cardBounds.left + cardBounds.width / 2 - innerWidth / 2) / innerWidth;
        const image = card.querySelector(".d-img");
        if (image) image.style.transform = `translateX(${offset * -14}%) scale(1.3)`;
      });
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const onResize = () => { size(); onScroll(); };
    const onDestinationOpen = (event) => {
      const index = DEST.findIndex((destination) => destination.id === event.detail?.destinationId);
      if (index < 0) return;
      origin.current = event.detail?.origin || null;
      setSelectedDay(event.detail?.day || null);
      setSelected(index);
    };

    size();
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("load", onResize);
    addEventListener("destination-open", onDestinationOpen);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("load", onResize);
      removeEventListener("destination-open", onDestinationOpen);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    if (selected === null || !overlay.current || !content.current) return;
    window.__lenis?.stop();
    if (origin.current) {
      overlay.current.animate(
        [{ clipPath: clip(origin.current) }, { clipPath: "inset(0px round 0px)" }],
        { duration: 850, easing: EASE, fill: "both" }
      );
    }
    content.current.animate(
      [{ opacity: 0, transform: "translateY(50px)" }, { opacity: 1, transform: "none" }],
      { duration: 700, delay: origin.current ? 350 : 0, easing: EASE, fill: "both" }
    );
    return () => window.__lenis?.start();
  }, [selected]);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const clip = (rect) =>
    `inset(${rect.top}px ${document.documentElement.clientWidth - rect.right}px ${innerHeight - rect.bottom}px ${rect.left}px round 6px)`;

  const open = (index, rect) => {
    origin.current = rect;
    setSelectedDay(null);
    setSelected(index);
  };

  const close = () => {
    if (!overlay.current || !origin.current) {
      setSelected(null);
      setSelectedDay(null);
      origin.current = null;
      return;
    }
    content.current.animate(
      [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(40px)" }],
      { duration: 350, easing: EASE, fill: "both" }
    );
    const animation = overlay.current.animate(
      [{ clipPath: "inset(0px round 0px)" }, { clipPath: clip(origin.current) }],
      { duration: 750, delay: 150, easing: EASE, fill: "both" }
    );
    animation.onfinish = () => {
      setSelected(null);
      setSelectedDay(null);
      origin.current = null;
    };
  };

  const destination = selected === null ? null : DEST[selected];

  return (
    <section id="destinations" className="dests" ref={sec}>
      <div className="dstage">
        <div className="d-head">
          <h2 className="disp">Our top destinations</h2>
          <p>Five places that show Rwanda’s wildlife, landscapes and history. Keep scrolling to travel through them.</p>
        </div>
        <div className="dtrack" ref={track}>
          {DEST.map((item, index) => (
            <button
              className="d-card"
              key={item.id}
              type="button"
              aria-label={`Learn more about ${item.n}`}
              onClick={(event) => open(index, event.currentTarget.getBoundingClientRect())}
            >
              <span className="d-frame">
                <span className="d-img">
                  <Image src={item.img} alt="" fill sizes="40vw" unoptimized />
                </span>
              </span>
              <span className="d-info">
                <span className="d-title disp">{item.n}</span>
                <span className="d-summary">{item.tag}</span>
                <span className="link" aria-hidden="true">Learn more <span>↗</span></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {destination && (
        <div
          className="detail destination-detail"
          ref={overlay}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={destination.n}
          onClick={(event) => event.target === event.currentTarget && close()}
        >
          <button className="x" onClick={close} aria-label="Close destination details">✕</button>
          <div ref={content}>
            <div className="banner destination-banner">
              <Image src={destination.img} alt={destination.n} fill sizes="100vw" priority unoptimized />
              <div className="destination-banner-title">
                <span>{destination.id.replace("-", " ")}</span>
                <h2 className="disp">{destination.n}</h2>
              </div>
            </div>
            <div className="d-body destination-body">
              <span className="d-label">Discover</span>
              <div>
                <h3 className="disp destination-subhead">About {destination.n}</h3>
                <p className="destination-intro">{destination.intro}</p>
                <h3 className="disp destination-subhead">What to experience</h3>
                <div className="destination-experiences">
                  {destination.experiences.map((experience) => (
                    <article className="destination-experience" key={experience.title}>
                      <h4>{experience.title}</h4>
                      <p>{experience.description}</p>
                    </article>
                  ))}
                </div>
                {selectedDay && (
                  <div className="destination-day">
                    <p className="gallery-eyebrow">From your itinerary · {selectedDay.day}</p>
                    <h3 className="disp">{selectedDay.title}</h3>
                    <ul className="destination-activities">
                      {selectedDay.activities.map((activity) => <li key={activity}>{activity}</li>)}
                    </ul>
                    <div className="facts">
                      <div>Overnight<b>{selectedDay.overnight}</b></div>
                      <div>Meal plan<b>{selectedDay.board}</b></div>
                    </div>
                  </div>
                )}
                {destination.note && <p className="destination-note">{destination.note}</p>}
                <div className="destination-sources">
                  <h4>Further information</h4>
                  {destination.sources.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>
                  ))}
                </div>
                <button className="btn dark" onClick={() => openBooking(destination.place)}>Plan this visit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
