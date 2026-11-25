"use client";
import { FAQ } from "../lib/data";
import { useI18n } from "./I18n";

export function Why() {
  const { t } = useI18n();
  const stats = [["6", "stat.1"], [t("stat.2n"), "stat.2"], ["10+", "stat.3"]];
  return (
    <section id="why" className="sec why">
      <h2 className="disp">{t("why.title")}</h2>
      <div className="feats">
        {[1, 2, 3, 4].map((n) => <div key={n}><h3>{t(`feat.${n}.t`)}</h3><p>{t(`feat.${n}.d`)}</p></div>)}
      </div>
      <div className="stats">
        {stats.map(([num, key]) => <div key={key}><b>{num}</b><span>{t(key)}</span></div>)}
      </div>
    </section>
  );
}

export function Process() {
  const { t } = useI18n();
  return (
    <section id="how" className="sec proc">
      <h2 className="disp">{t("proc.title")}</h2>
      <ol className="steps">
        {[1, 2, 3].map((n) => <li key={n}><span className="disp">{n}</span><h3>{t(`step.${n}.t`)}</h3><p>{t(`step.${n}.d`)}</p></li>)}
      </ol>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section id="faq" className="sec faq">
      <h2 className="disp">{t("faq.title")}</h2>
      <div className="qs">
        {FAQ.map(([q, a], i) => (
          <details key={q}><summary>{t(`faq.${i + 1}.q`, q)}</summary><p>{t(`faq.${i + 1}.a`, a)}</p></details>
        ))}
      </div>
    </section>
  );
}
