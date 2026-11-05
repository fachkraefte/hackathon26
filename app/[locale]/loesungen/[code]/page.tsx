import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { analyseDaten } from "@/lib/analyse";
import { ergaenzeLoesungen } from "@/lib/loesungen";
import { LoesungenAnsicht } from "./loesungen-ansicht";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

export async function generateMetadata() {
  const t = await getTranslations("Loesungen");
  return { title: t("seitentitel") };
}

export default async function LoesungenSeite(props: PageProps<"/[locale]/loesungen/[code]">) {
  const { code } = await props.params;
  // Fehlen Lösungen (neues Handlungsfeld), jetzt erzeugen – sonst liegen sie schon bereit.
  await ergaenzeLoesungen(code.toUpperCase());
  const daten = await analyseDaten(code);
  if (!daten) notFound();
  const loesungen = Object.fromEntries(Object.entries(daten.loesungen).map(([id, e]) => [id, e.loesung]));
  return (
    <main className="seite">
      <LoesungenAnsicht daten={daten} loesungen={loesungen} />
    </main>
  );
}
