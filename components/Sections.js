import { FAQ } from "../lib/data";

const STATS = [["4", "national parks to explore"], ["1 hr", "with each gorilla family"], ["8", "visitors per gorilla group"]];
const FEATS = [
  ["Local guides", "Guides who grew up near the parks and know the trails, the wildlife and the stories behind them."],
  ["Small groups", "Quiet trips with few people, so gorilla visits stay calm for the animals and for you."],
  ["Conservation first", "We follow park rules on distance, group size and time, and send part of every booking back to conservation."],
  ["Planned for you", "Permits, transport and stays arranged in one plan, with a real person to call when something changes."],
];
const STEPS = [
  ["Tell us where", "Pick a destination and dates in the booking form, or just tell us what you would like to see."],
  ["We plan it", "We arrange guides, permits, stays and transport, then send you a clear plan to approve."],
  ["You travel", "Meet your guide, walk with a small group, and enjoy the trip without the logistics."],
];

export function Why() {
  return (
    <section id="why" className="sec why">
      <h2 className="disp">Why travel with us</h2>
      <div className="feats">
        {FEATS.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}
      </div>
      <div className="stats">
        {STATS.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="how" className="sec proc">
      <h2 className="disp">How it works</h2>
      <ol className="steps">
        {STEPS.map(([t, d], i) => <li key={t}><span className="disp">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
      </ol>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="sec faq">
      <h2 className="disp">Good to know</h2>
      <div className="qs">
        {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
    </section>
  );
}
