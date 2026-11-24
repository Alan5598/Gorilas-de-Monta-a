"use client";
import { useEffect, useState } from "react";
import { PLACES } from "../lib/data";
import { GorillaIcon, AlertIcon, CloseIcon } from "./Icons";
import Arrow from "./Arrow";

const TRIP_PLACES = PLACES.filter((place) => place !== "Not sure yet");

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [sentName, setSentName] = useState("");
  const [mode, setMode] = useState("full");
  const [selectedPlaces, setSelectedPlaces] = useState(TRIP_PLACES);
  const [min, setMin] = useState("");

  useEffect(() => {
    const handleOpen = (event) => {
      const place = event.detail;
      const isPlace = TRIP_PLACES.includes(place);
      setMode(isPlace ? "custom" : "full");
      setSelectedPlaces(isPlace ? [place] : TRIP_PLACES);
      setStatus("idle");
      setSentName("");
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
    return () => {
      window.__lenis?.start();
      removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedPlaces.length) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const locations = mode === "full" ? TRIP_PLACES : selectedPlaces;
    const name = data.get("name");
    const userEmail = data.get("email");
    const travelDate = data.get("date");
    const groupSize = data.get("groupSize");
    const message = data.get("message") || "Not provided";
    const packageLabel =
      mode === "full" ? "Full Rwanda Discovery Package" : "Customized Trip";

    const payload = {
      name,
      email: userEmail,
      travelDate,
      groupSize,
      message: message || "Not provided",
      locations: locations.join(", "),
      packageLabel,
    };

    setStatus("sending");
    setSentName(name);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const togglePlace = (place) => {
    setSelectedPlaces((current) =>
      current.includes(place)
        ? current.filter((item) => item !== place)
        : [...current, place]
    );
  };

  return (
    <div
      className="bk"
      data-lenis-prevent
      onClick={(event) => event.target === event.currentTarget && setOpen(false)}
    >
      <div className="bk-card" role="dialog" aria-modal="true" aria-label="Book a trip">
        <button className="bk-x" onClick={() => setOpen(false)} aria-label="Close">
          <CloseIcon size={18} />
        </button>

        {/* ── SUCCESS STATE ─────────────────────────────────────────── */}
        {status === "done" && (
          <div className="bk-done">
            <div className="bk-done-icon success" aria-hidden="true">
              <GorillaIcon size={46} />
            </div>
            <h2 className="disp">Thank you, {sentName}!</h2>
            <p>
              Your trip request has been sent to our team. We&apos;ll be in touch
              within <strong>24–48 hours</strong>.
            </p>
            <button className="btn dark" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        )}

        {/* ── ERROR STATE ───────────────────────────────────────────── */}
        {status === "error" && (
          <div className="bk-done">
            <div className="bk-done-icon error" aria-hidden="true">
              <AlertIcon size={42} />
            </div>
            <h2 className="disp">Something went wrong</h2>
            <p>
              We couldn&apos;t send your message. Please email us directly at{" "}
              <a href="mailto:gorilasdemontana@gmail.com">
                gorilasdemontana@gmail.com
              </a>{" "}
              or try again.
            </p>
            <button className="btn dark" onClick={() => setStatus("idle")}>
              Try again
            </button>
          </div>
        )}

        {/* ── FORM ─────────────────────────────────────────────────── */}
        {(status === "idle" || status === "sending") && (
          <form onSubmit={submit}>
            <h2 className="disp">Book a trip</h2>
            <p className="bk-sub">
              Choose the complete package or tailor the destinations to your trip.
            </p>

            <label>
              Full name
              <input name="name" required autoComplete="name" autoFocus />
            </label>

            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>

            <fieldset className="bk-packages">
              <legend>Choose your package</legend>
              <label className="bk-choice">
                <input
                  type="radio"
                  name="package"
                  value="full"
                  checked={mode === "full"}
                  onChange={() => {
                    setMode("full");
                    setSelectedPlaces(TRIP_PLACES);
                  }}
                />
                <span>
                  <b>Full Rwanda discovery package</b>
                  <small>Include every available destination and experience.</small>
                </span>
              </label>
              <label className="bk-choice">
                <input
                  type="radio"
                  name="package"
                  value="custom"
                  checked={mode === "custom"}
                  onChange={() => setMode("custom")}
                />
                <span>
                  <b>Customize my trip</b>
                  <small>Select the locations you would like to visit.</small>
                </span>
              </label>
            </fieldset>

            <fieldset className="bk-locations" disabled={mode === "full"}>
              <legend>
                Trip locations <span>({selectedPlaces.length} selected)</span>
              </legend>
              {TRIP_PLACES.map((place) => (
                <label className="bk-location" key={place}>
                  <input
                    type="checkbox"
                    checked={selectedPlaces.includes(place)}
                    onChange={() => togglePlace(place)}
                  />
                  <span>{place}</span>
                </label>
              ))}
            </fieldset>

            <div className="bk-two">
              <label>
                Travel date
                <input name="date" type="date" min={min} required />
              </label>
              <label>
                Group size
                <input name="groupSize" type="number" min="1" defaultValue="2" required />
              </label>
            </div>

            <label>
              Message
              <textarea
                name="message"
                rows="3"
                placeholder="Interests, accessibility needs, or anything else we should know"
              />
            </label>

            <button
              className="btn dark"
              type="submit"
              disabled={
                status === "sending" ||
                (mode === "custom" && !selectedPlaces.length)
              }
            >
              {status === "sending" ? (
                "Sending…"
              ) : (
                <>
                  Send request <Arrow />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

