import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { Gespraech } from "./gespraech";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("Befragung");
  return { title: t("seitentitel") };
}

export default async function BefragungSeite(props: PageProps<"/[locale]/befragung/[code]">) {
  const { code } = await props.params;
  const b = await holeBestandsaufnahme(code.toUpperCase());
  if (!b) notFound();

  const bereiche = b.bereiche.map((x) => x.name);
  return (
    <main className="seite seite--schmal">
      <Gespraech
        code={b.id}
        betrieb={b.betrieb.name}
        anrede={b.anrede}
        ziel={b.ziel}
        deadline={b.deadline}
        bereiche={bereiche}
        extern={b.profil?.extern ?? []}
        chips={b.profil?.chips ?? {}}
      />
    </main>
  );
}
