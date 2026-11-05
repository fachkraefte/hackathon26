// Gesamtbild zwischenspeichern: neu zusammenführen nur, wenn sich die Beiträge geändert haben.
// Läuft schon eine Zusammenführung, warten alle auf dieselbe (kein doppelter KI-Aufruf).
import { kiVerfuegbar } from "./ki/json";
import { fuehreZusammen, ordneZu } from "./ki/schritte";
import { bereichsLabel } from "./anonym";
import {
  holeBeitraege,
  holeBestandsaufnahme,
  holeGesamtbildEintrag,
  laufend as laufendeAufrufe,
  schluesselFuer,
  speichereGesamtbildEintrag,
  type GesamtbildEintrag,
} from "./speicher";
import type { Beitrag } from "./typen";

export async function holeGesamtbild(id: string) {
  const bestandsaufnahme = await holeBestandsaufnahme(id);
  if (!bestandsaufnahme) return null;
  const beitraege = await holeBeitraege(id);
  const schluessel = schluesselFuer(beitraege);

  const vorhanden = await holeGesamtbildEintrag(id);
  // Ein Ersatzbild aus dem Demo-Modus gilt nur, solange die KI nicht verfügbar ist.
  const nochGueltig = vorhanden?.schluessel === schluessel && !(vorhanden.ausDemo && kiVerfuegbar());
  if (vorhanden && nochGueltig) return { ...vorhanden, bestandsaufnahme, beitraege };

  const laufendSchluessel = `${id}#${schluessel}`;
  let laufend = laufendeAufrufe.get(laufendSchluessel);
  if (!laufend) {
    laufend = fuehreZusammen(bestandsaufnahme, beitraege).then(async (ergebnis) => {
      const eintrag: GesamtbildEintrag = { schluessel, bild: ergebnis.daten, ausDemo: ergebnis.ausDemo };
      await speichereGesamtbildEintrag(id, eintrag);
      laufendeAufrufe.delete(laufendSchluessel);
      return eintrag;
    }, (fehler: unknown) => {
      laufendeAufrufe.delete(laufendSchluessel);
      throw new Error("Gesamtbild konnte nicht erstellt werden", { cause: fehler });
    });
    laufendeAufrufe.set(laufendSchluessel, laufend);
  }
  const eintrag = await laufend;
  return { ...eintrag, bestandsaufnahme, beitraege };
}

/**
 * Nach einem neuen Beitrag: zuerst schnell an bestehende Fäden hängen.
 * Nur wenn das nicht geht (neues Thema), wird alles neu zusammengeführt.
 */
export async function nimmBeitragAuf(id: string, beitrag: Beitrag) {
  const bestandsaufnahme = await holeBestandsaufnahme(id);
  const vorhanden = await holeGesamtbildEintrag(id);
  if (bestandsaufnahme && vorhanden && !vorhanden.ausDemo) {
    const beitraege = await holeBeitraege(id);
    const label = bereichsLabel(beitrag, beitraege, bestandsaufnahme);
    const bild = await ordneZu(vorhanden.bild, beitrag, label);
    if (bild) {
      await speichereGesamtbildEintrag(id, { schluessel: schluesselFuer(beitraege), bild, ausDemo: false });
    }
  }
  return holeGesamtbild(id);
}
