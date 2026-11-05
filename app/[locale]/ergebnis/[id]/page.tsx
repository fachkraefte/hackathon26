import { notFound } from "next/navigation";
import { ANDERER_BEREICH, bereichsLabel } from "@/lib/anonym";
import { wissenZu } from "@/lib/daten";
import { holeGesamtbild } from "@/lib/gesamtbild";
import { fadenZahlen } from "@/lib/rechnen";
import { holeBeschluesse } from "@/lib/speicher";
import { Ergebnis, type ErgebnisDaten } from "./ergebnis";

export const dynamic = "force-dynamic";

export default async function ErgebnisPage(props: PageProps<"/[locale]/ergebnis/[id]">) {
  const { id } = await props.params;
  const ergebnis = await holeGesamtbild(id);
  if (!ergebnis) notFound();

  const { bestandsaufnahme: b, beitraege, bild } = ergebnis;

  // Nur Zusammengeführtes geht an den Browser – keine Einzelbeiträge (PROJEKT.md §5, „Wer sieht was“).
  const bremstJeBereich = new Map<string, number[]>();
  for (const beitrag of beitraege) {
    const label = bereichsLabel(beitrag, beitraege, b);
    bremstJeBereich.set(label, [...(bremstJeBereich.get(label) ?? []), beitrag.bremst]);
  }

  const daten: ErgebnisDaten = {
    id: b.id,
    betrieb: b.betrieb.name,
    mitarbeitende: b.betrieb.mitarbeitende,
    leitung: `${b.leitung.vorname}, ${b.leitung.rolle}`,
    frage: b.frage,
    ziel: b.ziel,
    stundensatz: b.stundensatz,
    arbeitswochen: b.arbeitswochen,
    beitraege: beitraege.length,
    ausDemo: ergebnis.ausDemo,
    faeden: bild.faeden.map((f) => {
      const zahlen = fadenZahlen(f, beitraege, b);
      return {
        ...f,
        stundenWoche: zahlen.stundenWoche,
        personen: zahlen.personen,
        ansaetze: f.ansaetze.map((a) => {
          const w = wissenZu(a.wissenId);
          return { ...a, quelle: w ? `${w.quelle.datei}, ${w.quelle.abschnitt}` : null, reifegrad: w?.reifegrad ?? null };
        }),
      };
    }),
    bremst: [...bremstJeBereich.entries()]
      .filter(([label, werte]) => label !== ANDERER_BEREICH || werte.length >= b.mindestanzahl)
      .map(([bereich, werte]) => ({
        bereich,
        mittel: werte.reduce((s, w) => s + w, 0) / werte.length,
        anzahl: werte.length,
      })),
    staerken: bild.staerken,
    offeneFragen: bild.offeneFragen,
    beschluesse: await holeBeschluesse(b.id),
  };

  return (
    <main className="seite">
      <Ergebnis daten={daten} />
    </main>
  );
}
