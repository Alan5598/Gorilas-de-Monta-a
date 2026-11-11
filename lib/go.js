export function go(e, hash) {
  const target = document.querySelector(hash);
  if (!target) return;

  e.preventDefault();
  const l = window.__lenis;
  if (l) l.scrollTo(hash, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else target.scrollIntoView({ behavior: "smooth" });
}
