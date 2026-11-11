export const openBooking = (dest) =>
  window.dispatchEvent(new CustomEvent("book", { detail: dest || "" }));
