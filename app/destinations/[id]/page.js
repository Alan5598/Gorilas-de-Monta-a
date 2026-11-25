import { notFound } from "next/navigation";
import { DEST } from "../../../lib/data";
import DestinationView from "../../../components/DestinationView";
import Footer from "../../../components/Footer";

export function generateStaticParams() {
  return DEST.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = DEST.find((x) => x.id === id);
  return d ? { title: `${d.n} | Gorilas de Montaña`, description: d.tag } : {};
}

export default async function DestinationPage({ params }) {
  const { id } = await params;
  if (!DEST.some((d) => d.id === id)) notFound();
  return (
    <main>
      <DestinationView id={id} />
      <Footer />
    </main>
  );
}
