import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { stelleFeedZusammen } from "@/lib/feed";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { holeZugang } from "@/lib/zugang";
import { PersoenlicheApp } from "./app";

export const dynamic = "force-dynamic";
// KI-Zuordnung neuer Meldungen kann dauern – nicht an der Standard-Zeitgrenze scheitern.
export const maxDuration = 90;

export async function generateMetadata() {
  const t = await getTranslations("Feed");
  return { title: t("seitentitel") };
}

/** Persönlicher Bereich: Der Code öffnet ihn, der Bereich wird einmal gewählt. */
export default async function IchSeite(props: PageProps<"/[locale]/ich/[code]">) {
  const { code } = await props.params;
  const z = await holeZugang(code);
  if (!z) notFound();
  const b = await holeBestandsaufnahme(z.betriebId);
  if (!b) notFound();
  // Karten vorab je Bereich (mehr als 5, der Browser nimmt beantwortete heraus) – die erste Karte steht sofort.
  const bereiche = b.bereiche.map((x) => x.name);
  const liste = z.bereich ? [z.bereich] : bereiche;
  const vorab = Object.fromEntries(
    await Promise.all(liste.map(async (x) => [x, await stelleFeedZusammen(b.id, x, [], 12).catch(() => [])] as const)),
  );
  return (
    <PersoenlicheApp
      vorab={vorab}
      code={z.code}
      betriebId={b.id}
      betrieb={b.betrieb.name}
      anrede={b.anrede}
      bereiche={b.bereiche.map((x) => x.name)}
      bereich={z.bereich}
    />
  );
}
