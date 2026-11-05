// Zahlen rechnet der Code, nicht die KI. Grundlage sind nur die Angaben der Beschäftigten.
// Regel gegen Doppelzählung: Jede Person gibt nur ihre eigene Zeit an.
import type { Beitrag, Bestandsaufnahme, Faden, Haeufigkeit, Punkt } from "./typen";

/** Vorfälle pro Woche je Stufe. Die Werte stehen sichtbar an den Reglern. */
export const proWoche: Record<Haeufigkeit, number> = {
  monatlich: 0.25,
  mehrmalsImMonat: 0.5,
  woechentlich: 1,
  mehrmalsProWoche: 3,
  taeglich: 5,
  mehrmalsTaeglich: 10,
};

export function stundenProWoche(punkt: Pick<Punkt, "haeufigkeit" | "minuten">): number {
  return (proWoche[punkt.haeufigkeit] * punkt.minuten) / 60;
}

export function euroProJahr(stundenWoche: number, b: Pick<Bestandsaufnahme, "stundensatz" | "arbeitswochen">) {
  return stundenWoche * b.stundensatz * b.arbeitswochen;
}

export type FadenZahlen = { stundenWoche: number; euroJahr: number; personen: number; bereiche: number };

export function fadenZahlen(
  faden: Faden,
  beitraege: Beitrag[],
  b: Pick<Bestandsaufnahme, "stundensatz" | "arbeitswochen">,
): FadenZahlen {
  const ids = new Set(faden.punktIds);
  let stunden = 0;
  const personen = new Set<string>();
  for (const beitrag of beitraege) {
    for (const punkt of beitrag.punkte) {
      if (!ids.has(punkt.id)) continue;
      stunden += stundenProWoche(punkt);
      personen.add(beitrag.id);
    }
  }
  return {
    stundenWoche: stunden,
    euroJahr: euroProJahr(stunden, b),
    personen: personen.size,
    bereiche: faden.sichtweisen.length,
  };
}

export function rundeEuro(euro: number) {
  if (euro >= 10_000) return Math.round(euro / 500) * 500;
  if (euro >= 1_000) return Math.round(euro / 100) * 100;
  return Math.round(euro / 10) * 10;
}

export function formatEuro(euro: number) {
  return `${rundeEuro(euro).toLocaleString("de-DE")} €`;
}

export function formatStunden(stunden: number) {
  return (Math.round(stunden * 10) / 10).toLocaleString("de-DE");
}
