import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { holeZugang } from "@/lib/zugang";
import { PersoenlicheApp } from "./app";

export const dynamic = "force-dynamic";

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
  return (
    <PersoenlicheApp
      code={z.code}
      betriebId={b.id}
      betrieb={b.betrieb.name}
      anrede={b.anrede}
      bereiche={b.bereiche.map((x) => x.name)}
      bereich={z.bereich}
    />
  );
}
