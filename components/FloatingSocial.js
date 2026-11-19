const WHATSAPP = "https://wa.me/250788230835";
const INSTAGRAM = "https://www.instagram.com/gorilas_de__montana";

export default function FloatingSocial() {
  return (
    <aside className="social-float" aria-label="Connect with us">
      <a className="social-float-link whatsapp" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6a12 12 0 0 0 5.8 1.5h.1c6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.6-8.4ZM12.1 21.8h-.1a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.5 4.5-10 10-10 2.7 0 5.1 1 7 2.9a9.9 9.9 0 0 1 2.9 7c0 5.5-4.5 9.9-9.9 9.9Zm5.5-7.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.5-.9-2-.2-.5-.5-.4-.7-.4H8.2c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.2-.3-.4-.4Z" />
        </svg>
      </a>
      <a className="social-float-link instagram" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.2-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
        </svg>
      </a>
    </aside>
  );
}
