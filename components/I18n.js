"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGS, T } from "../lib/i18n";

const KEY = "gdm-lang";
const lookup = (lang, key, fallback) => {
  const i = Math.max(0, LANGS.findIndex((l) => l.code === lang));
  const v = T[key];
  return (v && (v[i] || v[0])) || fallback || key;
};
const Ctx = createContext({ lang: "en", setLang() {}, t: (k, f) => lookup("en", k, f) });

export function I18nProvider({ children }) {
  const [lang, setL] = useState("en");

  // restore the saved choice after hydration, so server and first client render match
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (LANGS.some((l) => l.code === saved)) setL(saved);
    } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = useCallback((code) => {
    setL(code);
    try { localStorage.setItem(KEY, code); } catch {}
  }, []);
  const t = useCallback((key, fallback) => lookup(lang, key, fallback), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
