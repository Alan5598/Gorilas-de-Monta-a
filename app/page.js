import Hero from "../components/Hero";
import About from "../components/About";
import Destinations from "../components/Destinations";
import Trips from "../components/Trips";
import Gallery from "../components/Gallery";
import { Why, Process, Faq } from "../components/Sections";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Destinations />
      <Trips />
      <Gallery preview />
      <Why />
      <Process />
      <Faq />
      <Footer />
    </main>
  );
}
