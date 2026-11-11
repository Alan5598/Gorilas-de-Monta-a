# Gorilas de Montaña (Next.js UI)

    npm install
    npm run dev

## Images
- `public/images/hero-bg.jpg` + `hero-fg.webp` are the layered hero artwork. Keep both aligned when replacing the hero photo.
- The About section keeps its local `about-1..3.jpg` images.
- Destination, trip and gallery photos use Unsplash URLs in `lib/images.js`. Update those image IDs to change the photography.
Check each photo's license and attribution requirements before publishing.

## Edit content
Destinations, trips, FAQ and the destination dropdown live in lib/data.js. The booking form is UI only:
connect `submit` in components/Booking.js to your email or booking tool.
