// Gesamtbild zwischenspeichern: neu zusammenführen nur, wenn sich die Beiträge geändert haben.
// Läuft schon eine Zusammenführung, warten alle auf dieselbe (kein doppelter KI-Aufruf).
import { fuehreZusammen } from "./ki/schritte";
import { holeBeitraege, holeBestandsaufnahme, speicher } from "./speicher";
import type { Beitrag } from "./typen";

function schluesselFuer(beitraege: Beitrag[]) {
  return beitraege
    .flatMap((b) => b.punkte.map((p) => `${b.id}:${p.id}:${p.titel}:${p.aussage}`))
    .sort()
    .join("|");
}

export async function holeGesamtbild(id: string) {
  const bestandsaufnahme = holeBestandsaufnahme(id);
  if (!bestandsaufnahme) return null;
  const beitraege = holeBeitraege(id);
  const schluessel = schluesselFuer(beitraege);

  const vorhanden = speicher.gesamtbilder.get(id);
  if (vorhanden?.schluessel === schluessel) return { ...vorhanden, bestandsaufnahme, beitraege };

  const laufendSchluessel = `${id}#${schluessel}`;
  let laufend = speicher.laufend.get(laufendSchluessel);
  if (!laufend) {
    laufend = fuehreZusammen(bestandsaufnahme, beitraege).then((ergebnis) => {
      const eintrag = { schluessel, bild: ergebnis.daten, ausDemo: ergebnis.ausDemo };
      speicher.gesamtbilder.set(id, eintrag);
      speicher.laufend.delete(laufendSchluessel);
      return eintrag;
    }, (fehler: unknown) => {
      speicher.laufend.delete(laufendSchluessel);
      throw new Error("Gesamtbild konnte nicht erstellt werden", { cause: fehler });
    });
    speicher.laufend.set(laufendSchluessel, laufend);
  }
  const eintrag = await laufend;
  return { ...eintrag, bestandsaufnahme, beitraege };
}
