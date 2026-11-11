"use client";
import { useEffect, useState } from "react";
import { PLACES } from "../lib/data";

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(null);
  const [dest, setDest] = useState("");
  const [min, setMin] = useState("");

  useEffect(() => {
    const h = (e) => { setDest(e.detail || ""); setSent(null); setOpen(true); };
    addEventListener("book", h);
    setMin(new Date().toISOString().slice(0, 10));
    return () => removeEventListener("book", h);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const k = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => { window.__lenis?.start(); removeEventListener("keydown", k); };
  }, [open]);

  if (!open) return null;
  const submit = (e) => { e.preventDefault(); setSent(new FormData(e.currentTarget).get("name")); };

  return (
    <div className="bk" data-lenis-prevent onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="bk-card" role="dialog" aria-modal="true" aria-label="Book a trip">
        <button className="bk-x" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        {sent ? (
          <div className="bk-done">
            <h2 className="disp">Thank you, {sent}</h2>
            <p>Your request is ready. This is a design preview, so nothing was sent yet. Connect the form to your email or booking tool to receive requests.</p>
            <button className="btn dark" onClick={() => setOpen(false)}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="disp">Book a trip</h2>
            <p className="bk-sub">Tell us where and when. We reply with a plan.</p>
            <label>Full name<input name="name" required autoComplete="name" autoFocus /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <div className="bk-two">
              <label>Destination
                <select name="destination" required value={dest} onChange={(e) => setDest(e.target.value)}>
                  <option value="" disabled>Choose a place</option>
                  {PLACES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label>Travel date<input name="date" type="date" min={min} required /></label>
            </div>
            <label>Message<textarea name="message" rows="4" placeholder="Group size, interests, anything we should know" /></label>
            <button className="btn dark" type="submit">Send request</button>
          </form>
        )}
      </div>
    </div>
  );
}
