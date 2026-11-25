"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { go } from "../lib/go";
import { openBooking } from "../lib/book";
import Arrow from "./Arrow";
import { useI18n } from "./I18n";

const LINKS = [["nav.home", "#home"], ["nav.about", "#about"], ["nav.destinations", "#destinations"], ["nav.trips", "#trips"], ["nav.gallery", "/gallery"], ["nav.faq", "#faq"]];

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  const hrefFor = (href) => (href.startsWith("#") && pathname !== "/" ? `/${href}` : href);

  return (
    <footer id="contact" className="footer">
      <div className="f-cta">
        <h2 className="disp">{t("f.ready1")}<br />{t("f.ready2")}</h2>
        <button className="btn" onClick={() => openBooking()}>{t("nav.book")} <Arrow /></button>
      </div>
      <div className="f-cols">
        <div>
          <h4>{t("f.explore")}</h4>
          {LINKS.map(([key, h]) => <Link key={h} href={hrefFor(h)} onClick={h.startsWith("#") ? (e) => go(e, h) : undefined}>{t(key)}</Link>)}
        </div>
        <div>
          <h4>{t("f.contact")}</h4>
          <a href="mailto:gorilasdemontana@gmail.com">gorilasdemontana@gmail.com</a>
          <span>Rwanda</span>
        </div>
      </div>
      <div className="mega disp" aria-hidden="true">Gorilas de Montaña</div>
      <div className="f-bottom">
        <span>{t("f.rights")}</span>
        <Link href={hrefFor("#home")} onClick={(e) => go(e, "#home")}>{t("f.top")}</Link>
      </div>
    </footer>
  );
}
