"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { go } from "../lib/go";
import { openBooking } from "../lib/book";
import Arrow from "./Arrow";

const LINKS = [["Home", "#home"], ["About us", "#about"], ["Destinations", "#destinations"], ["Trips", "#trips"], ["Gallery", "/gallery"], ["FAQ", "#faq"]];

export default function Nav() {
  const pathname = usePathname();
  const [sc, setSc] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSc(scrollY > 40);
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  const hrefFor = (href) => href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
  const nav = (e, href) => {
    setOpen(false);
    if (href.startsWith("#")) go(e, href);
  };
  const book = () => { setOpen(false); openBooking(); };
  return (
    <>
      <header className={`nav${sc ? " sc" : ""}`}>
        <Link href={hrefFor("#home")} className="logo" onClick={(e) => nav(e, "#home")}>Gorilas de Montaña</Link>
        <nav className="links" aria-label="Main">
          {LINKS.map(([t, h]) => <Link key={h} href={hrefFor(h)} onClick={(e) => nav(e, h)}>{t}</Link>)}
        </nav>
        <button className="btn" onClick={book}>Book a trip <Arrow /></button>
        <button className={`burger${open ? " on" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /></button>
      </header>
      <div className={`panel${open ? " on" : ""}`}>
        {LINKS.map(([t, h]) => <Link key={h} href={hrefFor(h)} onClick={(e) => nav(e, h)}>{t}</Link>)}
        <button className="btn" onClick={book}>Book a trip <Arrow /></button>
      </div>
    </>
  );
}
