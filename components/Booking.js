"use client";
import { useEffect, useState } from "react";
import { PLACES } from "../lib/data";

const BOOKING_EMAIL = "gorilasdemontana@gmail.com";
const TRIP_PLACES = PLACES.filter((place) => place !== "Not sure yet");

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(null);
  const [mode, setMode] = useState("full");
  const [selectedPlaces, setSelectedPlaces] = useState(TRIP_PLACES);
  const [requestHref, setRequestHref] = useState("");
  const [min, setMin] = useState("");

  useEffect(() => {
    const handleOpen = (event) => {
      const place = event.detail;
      const isPlace = TRIP_PLACES.includes(place);
      setMode(isPlace ? "custom" : "full");
      setSelectedPlaces(isPlace ? [place] : TRIP_PLACES);
      setSent(null);
      setRequestHref("");
      setOpen(true);
    };
    addEventListener("book", handleOpen);
    setMin(new Date().toISOString().slice(0, 10));
    return () => removeEventListener("book", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const handleKeyDown = (event) => event.key === "Escape" && setOpen(false);
    addEventListener("keydown", handleKeyDown);
    return () => { window.__lenis?.start(); removeEventListener("keydown", handleKeyDown); };
  }, [open]);

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    if (!selectedPlaces.length) return;

    const form = new FormData(event.currentTarget);
    const locations = mode === "full" ? TRIP_PLACES : selectedPlaces;
    const subject = `Rwanda trip request from ${form.get("name")}`;
    const body = [
      `Name: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Package: ${mode === "full" ? "Full Rwanda discovery package" : "Customized trip"}`,
      `Trip locations: ${locations.join(", ")}`,
      `Travel date: ${form.get("date")}`,
      `Group size: ${form.get("groupSize")}`,
      `Message: ${form.get("message") || "Not provided"}`,
    ].join("\n");
    const href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setRequestHref(href);
    setSent(form.get("name"));
    window.location.href = href;
  };

  const togglePlace = (place) => {
    setSelectedPlaces((current) =>
      current.includes(place) ? current.filter((item) => item !== place) : [...current, place]
    );
  };

  return (
    <div className="bk" data-lenis-prevent onClick={(event) => event.target === event.currentTarget && setOpen(false)}>
      <div className="bk-card" role="dialog" aria-modal="true" aria-label="Book a trip">
        <button className="bk-x" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        {sent ? (
          <div className="bk-done">
            <h2 className="disp">Thank you, {sent}</h2>
            <p>Your trip request is prepared in an email draft to {BOOKING_EMAIL}. Review it and press Send to complete your request.</p>
            <a className="btn dark" href={requestHref}>Open email draft</a>
            <button className="bk-close-done" onClick={() => setOpen(false)}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="disp">Book a trip</h2>
            <p className="bk-sub">Choose the complete package or tailor the destinations to your trip.</p>
            <label>Full name<input name="name" required autoComplete="name" autoFocus /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <fieldset className="bk-packages">
              <legend>Choose your package</legend>
              <label className="bk-choice">
                <input type="radio" name="package" value="full" checked={mode === "full"} onChange={() => { setMode("full"); setSelectedPlaces(TRIP_PLACES); }} />
                <span><b>Full Rwanda discovery package</b><small>Include every available destination and experience.</small></span>
              </label>
              <label className="bk-choice">
                <input type="radio" name="package" value="custom" checked={mode === "custom"} onChange={() => setMode("custom")} />
                <span><b>Customize my trip</b><small>Select the locations you would like to visit.</small></span>
              </label>
            </fieldset>
            <fieldset className="bk-locations" disabled={mode === "full"}>
              <legend>Trip locations <span>({selectedPlaces.length} selected)</span></legend>
              {TRIP_PLACES.map((place) => (
                <label className="bk-location" key={place}>
                  <input type="checkbox" checked={selectedPlaces.includes(place)} onChange={() => togglePlace(place)} />
                  <span>{place}</span>
                </label>
              ))}
            </fieldset>
            <div className="bk-two">
              <label>Travel date<input name="date" type="date" min={min} required /></label>
              <label>Group size<input name="groupSize" type="number" min="1" defaultValue="2" required /></label>
            </div>
            <label>Message<textarea name="message" rows="3" placeholder="Interests, accessibility needs, or anything else we should know" /></label>
            <button className="btn dark" type="submit" disabled={mode === "custom" && !selectedPlaces.length}>Send request <span aria-hidden="true">↗</span></button>
          </form>
        )}
      </div>
    </div>
  );
}
