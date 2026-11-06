// Alles, was Analyse- und Lösungsseite zeigen, aus dem gespeicherten Bild berechnet – im Code, ohne KI.
// Der Browser bekommt nur Zusammengeführtes, keine Einzelbeiträge (PROJEKT.md §5 „Wer sieht was“).
import { holeLob } from "./feed";
import { holeGesamtbild } from "./gesamtbild";
import { baueKarte } from "./karte";
import { fadenZahlen } from "./rechnen";
import { personenAnzahl } from "./speicher";

export async function analyseDaten(code: string) {
  const ergebnis = await holeGesamtbild(code.toUpperCase());
  if (!ergebnis) return null;
  const { bestandsaufnahme: b, beitraege, bild } = ergebnis;

  const faeden = bild.faeden
    .map((f) => {
      const z = fadenZahlen(f, beitraege, b);
      return {
        id: f.id,
        kurzname: f.kurzname,
        aufgabe: f.aufgabe,
        problem: f.problem,
        sichtweisen: f.sichtweisen,
        unterschied: f.unterschied,
        stunden: z.stundenWoche,
        euro: z.euroJahr,
        personen: z.personen,
        bereiche: z.bereiche,
        bremst: z.bremst,
      };
    })
    .sort((a, z) => z.euro - a.euro || (z.bremst ?? 0) - (a.bremst ?? 0));

  const punkte = beitraege.flatMap((x) => x.punkte);
  const mitsprache = beitraege.flatMap((x) => (x.mitsprache ? [x.mitsprache] : []));

  return {
    code: b.id,
    betrieb: b.betrieb.name,
    deadline: b.deadline,
    teilgenommen: personenAnzahl(beitraege),
    mitarbeitende: b.betrieb.mitarbeitende,
    summe: {
      stunden: faeden.reduce((s, f) => s + f.stunden, 0),
      euro: faeden.reduce((s, f) => s + f.euro, 0),
      schaetzungen: punkte.filter((p) => p.minuten > 0).length,
    },
    mitsprache: mitsprache.length ? mitsprache.reduce((s, x) => s + x, 0) / mitsprache.length : null,
    faeden,
    staerken: bild.staerken,
    // Positive Meldungen aus „Was gut läuft“ (Melden-Knopf), anonym und ohne Zuordnung.
    lob: await holeLob(b.id).catch(() => [] as string[]),
    karte: baueKarte(b, beitraege, bild),
    loesungen: ergebnis.loesungen,
    ausDemo: ergebnis.ausDemo,
  };
}

export type AnalyseDaten = NonNullable<Awaited<ReturnType<typeof analyseDaten>>>;
