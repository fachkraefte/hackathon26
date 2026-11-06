// Gesamtbild stabil halten: einmal zusammenführen, danach nur noch ergänzen.
// Bestehende Fäden behalten ID, Aufgabe und Reihenfolge; neue Themen kommen als neue Fäden dazu.
// Läuft schon eine Berechnung, warten alle auf dieselbe (kein doppelter KI-Aufruf).
import { kiVerfuegbar } from "./ki/json";
import { ergaenzeBild, fuehreZusammen } from "./ki/schritte";
import {
  holeBeitraege,
  holeBestandsaufnahme,
  holeGesamtbildEintrag,
  fadenAusFeedPunkt,
  laufend as laufendeAufrufe,
  schluesselFuer,
  speichereGesamtbildEintrag,
  type GesamtbildEintrag,
} from "./speicher";
import type { Beitrag, Bestandsaufnahme } from "./typen";

export async function holeGesamtbild(id: string) {
  const bestandsaufnahme = await holeBestandsaufnahme(id);
  if (!bestandsaufnahme) return null;
  const beitraege = await holeBeitraege(id);
  const schluessel = schluesselFuer(beitraege);

  const vorhanden = await holeGesamtbildEintrag(id);
  const fehlende = vorhanden ? offenePunkte(vorhanden, beitraege) : new Set<string>();
  // Ein Ersatzbild aus dem Demo-Modus gilt nur, solange die KI nicht verfügbar ist.
  const ersatzErsetzen = vorhanden?.ausDemo && kiVerfuegbar();
  if (vorhanden && !ersatzErsetzen && fehlende.size === 0 && vorhanden.schluessel === schluessel) {
    return { ...mitFeedStimmen(vorhanden, beitraege), bestandsaufnahme, beitraege };
  }

  const laufendSchluessel = `${id}#${schluessel}`;
  let laufend = laufendeAufrufe.get(laufendSchluessel);
  if (!laufend) {
    const berechnung =
      vorhanden && !ersatzErsetzen
        ? ergaenze(bestandsaufnahme, vorhanden, beitraege, fehlende, schluessel)
        : zusammenfuehren(bestandsaufnahme, beitraege, schluessel);
    laufend = berechnung.then(
      async (eintrag) => {
        await speichereGesamtbildEintrag(id, eintrag);
        laufendeAufrufe.delete(laufendSchluessel);
        return eintrag;
      },
      (fehler: unknown) => {
        laufendeAufrufe.delete(laufendSchluessel);
        throw new Error("Gesamtbild konnte nicht erstellt werden", { cause: fehler });
      },
    );
    laufendeAufrufe.set(laufendSchluessel, laufend);
  }
  const eintrag = await laufend;
  return { ...mitFeedStimmen(eintrag, beitraege), bestandsaufnahme, beitraege };
}

/** Punkte aus Beiträgen, die noch in keinem Faden stehen. */
function offenePunkte(eintrag: GesamtbildEintrag, beitraege: Beitrag[]) {
  const imBild = new Set(eintrag.bild.faeden.flatMap((f) => f.punktIds));
  return new Set(
    beitraege.flatMap((b) => b.punkte.map((p) => p.id)).filter((pid) => !imBild.has(pid) && !fadenAusFeedPunkt(pid)),
  );
}

/** Feed-Stimmen ohne KI ihrem Handlungsfeld zuordnen (die Karte kennt es schon). */
function mitFeedStimmen(eintrag: GesamtbildEintrag, beitraege: Beitrag[]): GesamtbildEintrag {
  const zuFaden = new Map<string, string[]>();
  for (const pid of beitraege.flatMap((b) => b.punkte.map((p) => p.id))) {
    const fid = fadenAusFeedPunkt(pid);
    if (fid) zuFaden.set(fid, [...(zuFaden.get(fid) ?? []), pid]);
  }
  if (zuFaden.size === 0) return eintrag;
  const faeden = eintrag.bild.faeden.map((f) => {
    const neu = (zuFaden.get(f.id) ?? []).filter((pid) => !f.punktIds.includes(pid));
    return neu.length ? { ...f, punktIds: [...f.punktIds, ...neu] } : f;
  });
  return { ...eintrag, bild: { ...eintrag.bild, faeden } };
}

async function zusammenfuehren(
  b: Bestandsaufnahme,
  beitraege: Beitrag[],
  schluessel: string,
): Promise<GesamtbildEintrag> {
  const ergebnis = await fuehreZusammen(b, beitraege);
  return { schluessel, bild: ergebnis.daten, ausDemo: ergebnis.ausDemo, loesungen: {} };
}

async function ergaenze(
  b: Bestandsaufnahme,
  vorhanden: GesamtbildEintrag,
  beitraege: Beitrag[],
  fehlende: Set<string>,
  schluessel: string,
): Promise<GesamtbildEintrag> {
  const bild = await ergaenzeBild(b, vorhanden.bild, beitraege, fehlende);
  // KI nicht erreichbar: bisheriges Bild behalten, neue Punkte werden beim nächsten Abruf erneut versucht.
  return { schluessel, bild: bild ?? vorhanden.bild, ausDemo: vorhanden.ausDemo, loesungen: vorhanden.loesungen };
}

/** Nach einem neuen Beitrag: Bild ergänzen (bestehende Fäden bleiben stabil). */
export async function nimmBeitragAuf(id: string) {
  return holeGesamtbild(id);
}
