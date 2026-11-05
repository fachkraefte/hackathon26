import { notFound } from "next/navigation";
import { findeBereichPerLink, katalog, wissensauszug } from "@/lib/daten";
import { Schrittleiste } from "../../_komponenten/schrittleiste";
import { Abfrage } from "./abfrage";

export default async function AbfragePage(props: PageProps<"/[locale]/abfrage/[linkId]">) {
  const { linkId } = await props.params;
  const treffer = findeBereichPerLink(linkId);
  if (!treffer) notFound();

  const { betrieb, bereich, bestandsaufnahme } = treffer;
  const passt = (b: string[]) => b.length === 0 || b.includes(betrieb.branche);

  return (
    <main className="seite seite--schmal">
      <Schrittleiste aktiv={1} />
      <Abfrage
        betriebName={betrieb.name}
        bereich={bereich}
        alleBereiche={bestandsaufnahme.bereiche.map((b) => b.name)}
        kleineGruppe={bereich.erwarteteAntworten < bestandsaufnahme.mindestanzahl && bereich.id !== "leitung"}
        rollen={katalog.rollen.filter((r) => passt(r.branchen))}
        aufgaben={katalog.aufgaben.filter((a) => passt(a.branchen))}
        allgemeineFragen={katalog.allgemeineFragen}
        wissen={wissensauszug}
        demoAntwort={linkId === "heidekamp-montage"}
      />
    </main>
  );
}
