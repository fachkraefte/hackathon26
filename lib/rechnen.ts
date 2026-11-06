// Zahlen rechnet der Code, nicht die KI. Grundlage sind nur die Angaben der Beschäftigten.
// Regel gegen Doppelzählung: Jede Person gibt nur ihre eigene Zeit an.
import { personVon } from "./feed-regeln";
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

/** Mitte der Stundensatz-Spanne eines Bereichs; unbekannter Bereich → Mittel aller Bereiche. */
export function satzFuer(b: Pick<Bestandsaufnahme, "bereiche">, bereich: string) {
  const mitte = (x: { satzVon: number; satzBis: number }) => (x.satzVon + x.satzBis) / 2;
  const treffer = b.bereiche.find((x) => x.name === bereich);
  if (treffer) return mitte(treffer);
  return b.bereiche.reduce((a, x) => a + mitte(x), 0) / b.bereiche.length;
}

/** € pro Jahr für die Zeit einer Person: ihr Bereich bestimmt den Stundensatz. */
export function euroProJahr(stundenWoche: number, satz: number, b: Pick<Bestandsaufnahme, "arbeitswochen">) {
  return stundenWoche * satz * b.arbeitswochen;
}

export type FadenZahlen = {
  stundenWoche: number;
  euroJahr: number;
  personen: number;
  bereiche: number;
  bremst: number | null; // Ø „Wie sehr bremst dich das?“ – Wert fürs Profil
};

export function fadenZahlen(
  faden: Faden,
  beitraege: Beitrag[],
  b: Pick<Bestandsaufnahme, "bereiche" | "arbeitswochen">,
): FadenZahlen {
  const ids = new Set(faden.punktIds);
  let stunden = 0;
  let euro = 0;
  const bremsWerte: number[] = [];
  const personen = new Set<string>();
  const bereiche = new Set<string>();
  for (const beitrag of beitraege) {
    for (const punkt of beitrag.punkte) {
      if (!ids.has(punkt.id)) continue;
      const h = stundenProWoche(punkt);
      stunden += h;
      euro += euroProJahr(h, satzFuer(b, beitrag.bereich), b);
      bremsWerte.push(punkt.bremst);
      personen.add(personVon(beitrag.id));
      bereiche.add(beitrag.bereich);
    }
  }
  return {
    stundenWoche: stunden,
    euroJahr: euro,
    personen: personen.size,
    bereiche: bereiche.size,
    bremst: bremsWerte.length ? bremsWerte.reduce((a, x) => a + x, 0) / bremsWerte.length : null,
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
