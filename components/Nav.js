"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { go } from "../lib/go";
import { openBooking } from "../lib/book";
import Arrow from "./Arrow";
import LanguagePicker from "./LanguagePicker";
import { useI18n } from "./I18n";
import { DEST, TRIP_PLAN } from "../lib/data";

const LINKS = [
  ["nav.home", "#home"],
  ["nav.about", "#about"],
  ["nav.destinations", "#destinations", "destinations"],
  ["nav.trips", "#trips", "trips"],
  ["nav.gallery", "/gallery"],
  ["nav.faq", "#faq"],
];

const Chevron = ({ up }) => (
  <svg className={`mega-chev${up ? " up" : ""}`} viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const bar = useRef(null);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const [mobileSub, setMobileSub] = useState(null);
  const [hover, setHover] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // lets the mega menu and hero sit exactly below the navbar
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    const onResize = () => { set(); setIsDesktop(window.innerWidth > 980); };
    set();
    onResize();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => { setMega(null); setOpen(false); setMobileSub(null); }, [pathname]);

  useEffect(() => {
    if (!mega) return;
    const key = (e) => e.key === "Escape" && setMega(null);
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [mega]);

  const hrefFor = (href) => (href.startsWith("#") && pathname !== "/" ? `/${href}` : href);
  const nav = (e, href) => { setOpen(false); setMega(null); setMobileSub(null); if (href.startsWith("#")) go(e, href); };
  const book = () => { setOpen(false); setMega(null); setMobileSub(null); openBooking(); };
  const toggleMega = (type) => { setOpen(false); setHover(0); setMobileSub(null); setMega(mega === type ? null : type); };
  const toggleMobileSub = (type) => { setMobileSub(mobileSub === type ? null : type); };
  const shown = DEST[hover] || DEST[0];
  const shownTrip = TRIP_PLAN[hover] || TRIP_PLAN[0];

  return (
    <>
      <header className="nav sc" ref={bar}>
        <Link href={hrefFor("#home")} className="logo" aria-label="Gorilas de Montaña" onClick={(e) => { setOpen(false); setMega(null); setMobileSub(null); nav(e, "#home"); }}>
          <img className="logo-image" src="/images/Logo-white.png" alt="Gorilas de Montaña" width="auto" height="auto" />
        </Link>

        <nav className="links" aria-label="Main">
          {LINKS.map(([key, href, type]) => (
            <Link
              key={href}
              href={hrefFor(href)}
              aria-haspopup={type ? "true" : undefined}
              aria-expanded={type ? mega === type : undefined}
              onClick={(e) => {
                if (type) { e.preventDefault(); toggleMega(type); }
                else nav(e, href);
              }}
            >
              {t(key)}{type && <Chevron up={mega === type} />}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <LanguagePicker />
          <button className="btn nav-book" onClick={book}>{t("nav.book")} <Arrow /></button>
        </div>

        <button className={`burger${open ? " on" : ""}`} aria-label={t("nav.menu")} aria-expanded={open} onClick={() => { setMega(null); setMobileSub(null); setOpen(!open); }}>
          <i /><i />
        </button>
      </header>

      {mega === "destinations" && isDesktop && (
        <div className="vr-back" onClick={() => setMega(null)}>
          <div className="vr-panel" onClick={(e) => e.stopPropagation()}>
            <div className="vr-rail">
              <h3>{t("nav.destinations")}</h3>
              <p>{t("mega.blurb")}</p>
              <Link href={hrefFor("#destinations")} onClick={(e) => nav(e, "#destinations")}>{t("mega.all")}</Link>
            </div>
            <ul className="vr-list">
              {DEST.map((d, i) => (
                <li key={d.id}>
                  <Link
                    href={`/destinations/${d.id}`}
                    className={i === hover ? "on" : ""}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onClick={() => setMega(null)}
                  >
                    {t(`d.${d.id}.n`, d.n)}
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="vr-prev">
              <div className="vr-copy" key={shown.id}>
                <h3>{t(`d.${shown.id}.n`, shown.n)}</h3>
              </div>
              <div className="vr-img">
                {DEST.map((d, i) => (
                  <Image key={d.id} className={i === hover ? "show" : ""} src={d.img} alt="" fill sizes="45vw" unoptimized={d.img.startsWith("http")} />
                ))}
              </div>
              <p className="vr-copy" key={`${shown.id}-p`}>{t(`d.${shown.id}.tag`, shown.tag)}</p>
              <Link className="btn dark vr-go" href={`/destinations/${shown.id}`} onClick={() => setMega(null)}>{t("dest.explore")} <Arrow /></Link>
            </div>
          </div>
        </div>
      )}

      {mega === "trips" && isDesktop && (
        <div className="vr-back" onClick={() => setMega(null)}>
          <div className="vr-panel" onClick={(e) => e.stopPropagation()}>
            <div className="vr-rail">
              <h3>{t("nav.trips")}</h3>
              <p>{t("mega.blurb")}</p>
              <Link href={hrefFor("#trips")} onClick={(e) => nav(e, "#trips")}>{t("mega.all")}</Link>
            </div>
            <ul className="vr-list">
              {TRIP_PLAN.map((d, i) => (
                <li key={d.day}>
                  <Link
                    href={`/trips/${d.day.toLowerCase().replace(" ", "-")}`}
                    className={i === hover ? "on" : ""}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onClick={() => setMega(null)}
                  >
                    {t(`t.${i}.title`, d.title)}
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="vr-prev">
              <div className="vr-copy" key={shown.id}>
                <h3>{shown.title}</h3>
              </div>
              <div className="vr-img">
                {TRIP_PLAN.map((d, i) => (
                  <Image key={i} className={i === hover ? "show" : ""} src={d.image} alt="" fill sizes="45vw" unoptimized={d.image.startsWith("http")} />
                ))}
              </div>
              <p className="vr-copy" key={`${shown.id}-p`}>{shown.summary}</p>
              <Link className="btn dark vr-go" href="#trips" onClick={() => setMega(null)}>{t("dest.explore")} <Arrow /></Link>
            </div>
          </div>
        </div>
      )}

      <div className={`panel${open ? " on" : ""}`}>
        {LINKS.map(([key, href, type]) => (
          <div key={href} className="panel-item">
            <button
              className={`panel-link${type ? " has-sub" : ""}${mobileSub === type ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (type) { toggleMobileSub(type); }
                else { nav(e, href); setOpen(false); }
              }}
            >
              {t(key)}{type && <span className="panel-chev">▾</span>}
            </button>
            {type && mobileSub === type && (
              <ul className="panel-sub">
                {type === "destinations"
                  ? DEST.map((d) => (
                      <li key={d.id}>
                        <Link href={`/destinations/${d.id}`} onClick={(e) => { e.stopPropagation(); nav(e, `#/${d.id}`); setOpen(false); setMobileSub(null); }}>
                          {t(`d.${d.id}.n`, d.n)}
                        </Link>
                      </li>
                    ))
                  : TRIP_PLAN.map((d) => (
                      <li key={d.day}>
                        <Link href={`/trips/${d.day.toLowerCase().replace(" ", "-")}`} onClick={(e) => { e.stopPropagation(); nav(e, `/trips/${d.day.toLowerCase().replace(" ", "-")}`); setOpen(false); setMobileSub(null); }}>
                          {d.title}
                        </Link>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        ))}
        <button className="btn" onClick={book}>{t("nav.book")} <Arrow /></button>
      </div>
    </>
  );
}
