"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { go } from "../lib/go";
import { openBooking } from "../lib/book";
import Arrow from "./Arrow";

const LINKS = [["Home", "#home"], ["About us", "#about"], ["Destinations", "#destinations"], ["Trips", "#trips"], ["Gallery", "/gallery"], ["FAQ", "#faq"]];

export default function Footer() {
  const pathname = usePathname();
  const hrefFor = (href) => href.startsWith("#") && pathname !== "/" ? `/${href}` : href;

  return (
    <footer id="contact" className="footer">
      <div className="f-cta">
        <h2 className="disp">Ready to meet<br />the gorillas?</h2>
        <button className="btn" onClick={() => openBooking()}>Book a trip <Arrow /></button>
      </div>
      <div className="f-cols">
        <div><h4>Explore</h4>{LINKS.map(([t, h]) => <Link key={h} href={hrefFor(h)} onClick={h.startsWith("#") ? (e) => go(e, h) : undefined}>{t}</Link>)}</div>
        <div><h4>Contact</h4><a href="mailto:hello@example.com">hello@example.com</a><span>Rwanda</span></div>
      </div>
      <div className="mega disp" aria-hidden="true">Gorilas de Montaña</div>
      <div className="f-bottom">
        <span>©2026 Gorilas de Montaña. All rights reserved</span>
        <Link href={hrefFor("#home")} onClick={(e) => go(e, "#home")}>Back to top</Link>
      </div>
    </footer>
  );
}
