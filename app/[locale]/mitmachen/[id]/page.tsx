import { notFound } from "next/navigation";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { Gespraech } from "./gespraech";

export const dynamic = "force-dynamic";

export default async function MitmachenPage(props: PageProps<"/[locale]/mitmachen/[id]">) {
  const { id } = await props.params;
  const b = holeBestandsaufnahme(id);
  if (!b) notFound();

  return (
    <main className="seite seite--schmal">
      <Gespraech
        id={b.id}
        betrieb={b.betrieb.name}
        leitung={b.leitung.vorname}
        frage={b.frage}
        bereiche={b.bereiche}
        zeitfresser={b.zeitfresser}
        besprechungAm={b.besprechungAm}
      />
    </main>
  );
}
