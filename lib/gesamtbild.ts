// Gesamtbild zwischenspeichern: neu zusammenführen nur, wenn sich die Beiträge geändert haben.
// Läuft schon eine Zusammenführung, warten alle auf dieselbe (kein doppelter KI-Aufruf).
import { kiVerfuegbar } from "./ki/json";
import { fuehreZusammen, ordneZu } from "./ki/schritte";
import { bereichsLabel } from "./anonym";
import { holeBeitraege, holeBestandsaufnahme, schluesselFuer, speicher } from "./speicher";
import type { Beitrag } from "./typen";

export async function holeGesamtbild(id: string) {
  const bestandsaufnahme = holeBestandsaufnahme(id);
  if (!bestandsaufnahme) return null;
  const beitraege = holeBeitraege(id);
  const schluessel = schluesselFuer(beitraege);

  const vorhanden = speicher.gesamtbilder.get(id);
  // Ein Ersatzbild aus dem Demo-Modus gilt nur, solange die KI nicht verfügbar ist.
  const nochGueltig = vorhanden?.schluessel === schluessel && !(vorhanden.ausDemo && kiVerfuegbar());
  if (vorhanden && nochGueltig) return { ...vorhanden, bestandsaufnahme, beitraege };

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

/**
 * Nach einem neuen Beitrag: zuerst schnell an bestehende Fäden hängen.
 * Nur wenn das nicht geht (neues Thema), wird alles neu zusammengeführt.
 */
export async function nimmBeitragAuf(id: string, beitrag: Beitrag) {
  const bestandsaufnahme = holeBestandsaufnahme(id);
  const vorhanden = speicher.gesamtbilder.get(id);
  if (bestandsaufnahme && vorhanden && !vorhanden.ausDemo) {
    const beitraege = holeBeitraege(id);
    const label = bereichsLabel(beitrag, beitraege, bestandsaufnahme);
    const bild = await ordneZu(vorhanden.bild, beitrag, label);
    if (bild) {
      speicher.gesamtbilder.set(id, { schluessel: schluesselFuer(beitraege), bild, ausDemo: false });
    }
  }
  return holeGesamtbild(id);
}
