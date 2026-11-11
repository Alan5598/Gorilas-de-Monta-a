import Gallery from "../../components/Gallery";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Gallery | Gorilas de Montaña",
  description: "Explore photographs of Rwanda's landscapes, trails and wildlife.",
};

export default function GalleryPage() {
  return (
    <main>
      <Gallery />
      <Footer />
    </main>
  );
}
