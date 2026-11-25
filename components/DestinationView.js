"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEST } from "../lib/data";
import { openBooking } from "../lib/book";
import Arrow from "./Arrow";
import { useI18n } from "./I18n";

const remote = (src) => src.startsWith("http");

export default function DestinationView({ id }) {
  const { t } = useI18n();
  const i = DEST.findIndex((d) => d.id === id);
  const d = DEST[i];
  const next = DEST[(i + 1) % DEST.length];
  const [active, setActive] = useState(null);
  const open = active !== null;
  const name = t(`d.${d.id}.n`, d.n);
  const count = d.gallery.length;

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const key = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % count);
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + count) % count);
    };
    addEventListener("keydown", key);
    return () => { removeEventListener("keydown", key); window.__lenis?.start(); };
  }, [open, count]);

  return (
    <article className="dp">
      <header className="dp-hero">
        <Image src={d.img} alt="" fill priority sizes="100vw" unoptimized={remote(d.img)} />
        <div className="dp-title">
          <span>{d.place}</span>
          <h1>{name}</h1>
        </div>
      </header>

      <div className="dp-wrap">
        <Link className="dp-back" href="/#destinations">← {t("dp.back")}</Link>
        <p className="destination-intro">{d.intro}</p>

        <section aria-label={t("dp.facts")}>
          <dl className="dp-facts">
            {d.facts.map(([k, v]) => <div key={k}><dt>{t(`fact.${k}`)}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>

        <section className="dp-sec">
          <h2>{t("d.exp")}</h2>
          <div className="destination-experiences">
            {d.experiences.map((e) => (
              <article className="destination-experience" key={e.title}>
                <h4>{e.title}</h4>
                <p>{e.description}</p>
              </article>
            ))}
          </div>
          {d.note && <p className="destination-note">{d.note}</p>}
        </section>

        <section className="dp-sec">
          <h2>{t("dp.gallery")}</h2>
          <div className="gallery-grid">
            {d.gallery.map((src, n) => (
              <button className="gallery-item" key={src} type="button" onClick={() => setActive(n)} aria-label={`${name} ${n + 1}`}>
                <Image src={src} alt={`${name} ${n + 1}`} fill sizes="(max-width: 700px) 50vw, 25vw" unoptimized={remote(src)} />
                <span className="gallery-zoom" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        <div className="destination-sources">
          <h4>{t("d.further")}</h4>
          {d.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>)}
        </div>

        <div className="dp-actions">
          <button className="btn dark" onClick={() => openBooking(d.place)}>{t("d.plan")} <Arrow /></button>
        </div>

        <Link className="dp-next" href={`/destinations/${next.id}`}>
          <small>{t("dp.next")}</small>
          <b>{t(`d.${next.id}.n`, next.n)}</b>
        </Link>
      </div>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={name} onClick={(e) => e.target === e.currentTarget && setActive(null)}>
          <div className="lightbox-top">
            <span>{String(active + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {String(count).padStart(2, "0")}</span>
            <button type="button" className="lightbox-close" onClick={() => setActive(null)} aria-label="Close">×</button>
          </div>
          <button type="button" className="lightbox-arrow lightbox-prev" onClick={() => setActive((a) => (a - 1 + count) % count)} aria-label="Previous">←</button>
          <div className="lightbox-image">
            <Image src={d.gallery[active]} alt={`${name} ${active + 1}`} fill sizes="90vw" priority unoptimized={remote(d.gallery[active])} />
          </div>
          <button type="button" className="lightbox-arrow lightbox-next" onClick={() => setActive((a) => (a + 1) % count)} aria-label="Next">→</button>
          <p className="lightbox-caption">{name}</p>
        </div>
      )}
    </article>
  );
}
