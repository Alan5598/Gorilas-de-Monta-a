"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LANGS } from "../lib/i18n";
import { useI18n } from "./I18n";

export default function LanguagePicker() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    if (!open) return;
    const outside = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    const key = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", outside);
    addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", outside); removeEventListener("keydown", key); };
  }, [open]);

  return (
    <div className="lp" ref={box}>
      <button type="button" className="lp-btn" aria-haspopup="listbox" aria-expanded={open}
        aria-label={`${t("nav.lang")}: ${current.label}`} onClick={() => setOpen(!open)}>
        <Image className="lp-flag" src={`/images/${current.flag}.png`} alt="" width={22} height={22} />
        <span>{current.short}</span>
        <svg className={`lp-chev${open ? " up" : ""}`} viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </button>
      {open && (
        <ul className="lp-menu" role="listbox" aria-label={t("nav.lang")}>
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button type="button" className={l.code === lang ? "on" : ""} onClick={() => { setLang(l.code); setOpen(false); }}>
                <Image className="lp-flag" src={`/images/${l.flag}.png`} alt="" width={22} height={22} />
                <span>{l.label}</span>
                {l.code === lang && <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5l2.6 2.6L10 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
