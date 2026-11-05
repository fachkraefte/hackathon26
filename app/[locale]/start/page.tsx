import { DEMO_ID } from "@/lib/daten";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { StartFormular } from "./start-formular";

export const dynamic = "force-dynamic";

export default async function StartPage() {
  const b = await holeBestandsaufnahme(DEMO_ID);
  if (!b) throw new Error("Demo-Bestandsaufnahme fehlt.");

  return (
    <main className="seite seite--schmal">
      <StartFormular
        id={b.id}
        betrieb={b.betrieb.name}
        leitung={b.leitung.vorname}
        frage={b.frage}
        ziel={b.ziel}
        stundensatz={b.stundensatz}
        bereiche={b.bereiche}
        anrede={b.anrede}
      />
    </main>
  );
}
