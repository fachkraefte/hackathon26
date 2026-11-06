import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { analyseDaten } from "@/lib/analyse";
import { AnalyseAnsicht } from "./analyse-ansicht";

export const dynamic = "force-dynamic";
// KI-Zuordnung neuer Meldungen kann dauern – nicht an der Standard-Zeitgrenze scheitern.
export const maxDuration = 90;

export async function generateMetadata() {
  const t = await getTranslations("Analyse");
  return { title: t("seitentitel") };
}

export default async function AnalyseSeite(props: PageProps<"/[locale]/analyse/[code]">) {
  const { code } = await props.params;
  const daten = await analyseDaten(code);
  if (!daten) notFound();
  // Lösungen gehören auf die eigene Seite; hier nicht mitschicken.
  const { loesungen: _ohne, ...nurProbleme } = daten;
  void _ohne;
  return (
    <main className="seite">
      <AnalyseAnsicht daten={nurProbleme} />
    </main>
  );
}
