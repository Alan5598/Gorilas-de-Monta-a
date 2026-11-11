import { Inter, Anton, Playfair_Display } from "next/font/google";
import SmoothScroll from "../components/SmoothScroll";
import Nav from "../components/Nav";
import Booking from "../components/Booking";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--f-body" });
const display = Anton({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--f-display" });
const logo = Playfair_Display({ subsets: ["latin"], style: ["italic"], variable: "--f-logo" });

export const metadata = {
  title: "Gorilas de Montaña",
  description: "Travel to meet the mountain gorillas of Rwanda and explore the volcanoes they call home.",
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} ${logo.variable}`}>
        <SmoothScroll />
        <Nav />
        <Booking />
        {children}
      </body>
    </html>
  );
}
