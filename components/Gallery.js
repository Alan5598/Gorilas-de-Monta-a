"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_IMAGES } from "../lib/gallery";

const PREVIEW_COUNT = 6;

export default function Gallery({ preview = false }) {
  const [active, setActive] = useState(null);
  const images = preview ? GALLERY_IMAGES.slice(0, PREVIEW_COUNT) : GALLERY_IMAGES;
  const lightboxOpen = active !== null;

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % GALLERY_IMAGES.length);
      if (event.key === "ArrowLeft") setActive((index) => (index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    };
    addEventListener("keydown", onKeyDown);

    return () => {
      removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [lightboxOpen]);

  const changeImage = (direction) => {
    setActive((index) => (index + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  return (
    <section className={`gallery-section${preview ? " gallery-preview" : " gallery-page"}`}>
      <div className="gallery-shell">
        <div className="gallery-heading">
          <div>
            <p className="gallery-eyebrow">{preview ? "A look around Rwanda" : "The album"}</p>
            <h1 className="disp">{preview ? "Moments worth keeping" : "Rwanda, in moments"}</h1>
            <p className="gallery-intro">
              {preview
                ? "A few glimpses of the trails, wildlife and quiet places waiting to be discovered."
                : "Explore the landscapes, trails and places that make every journey through Rwanda memorable."}
            </p>
          </div>
          {preview ? (
            <Link className="btn dark" href="/gallery">View full album <span aria-hidden="true">↗</span></Link>
          ) : (
            <Link className="gallery-back" href="/">← Back to the journey</Link>
          )}
        </div>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <button
              className="gallery-item"
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View ${image.title}`}
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 50vw, 25vw" unoptimized />
              <span className="gallery-caption">{image.title}</span>
              <span className="gallery-zoom" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}>
          <div className="lightbox-top">
            <span>{String(active + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {String(GALLERY_IMAGES.length).padStart(2, "0")}</span>
            <button type="button" className="lightbox-close" onClick={() => setActive(null)} aria-label="Close image viewer">×</button>
          </div>
          <button type="button" className="lightbox-arrow lightbox-prev" onClick={() => changeImage(-1)} aria-label="Previous image">←</button>
          <div className="lightbox-image">
            <Image src={GALLERY_IMAGES[active].src} alt={GALLERY_IMAGES[active].alt} fill sizes="90vw" priority unoptimized />
          </div>
          <button type="button" className="lightbox-arrow lightbox-next" onClick={() => changeImage(1)} aria-label="Next image">→</button>
          <p className="lightbox-caption">{GALLERY_IMAGES[active].title}</p>
        </div>
      )}
    </section>
  );
}
