// Lösungen je Handlungsfeld (KONZEPT_V3 §6): nur für neue oder geänderte Fäden erzeugen, parallel.
// Wird nach jedem Beitrag im Hintergrund angestoßen (after) und von der Lösungsseite als Rückfall.
import { holeGesamtbild } from "./gesamtbild";
import { erzeugeLoesung } from "./ki/schritte";
import { holeGesamtbildEintrag, speichereLoesungen } from "./speicher";
import type { Faden, LoesungEintrag } from "./typen";

/** Eine Lösung gilt, solange Faden-ID und gemeinsame Aufgabe gleich bleiben – neue Stimmen ändern sie nicht. */
export function fingerabdruck(f: Pick<Faden, "id" | "aufgabe">) {
  return `${f.id}:${f.aufgabe}`;
}

const g = globalThis as typeof globalThis & { __rokioLoesungen?: Map<string, Promise<Record<string, LoesungEintrag>>> };
const laufend = (g.__rokioLoesungen ??= new Map());

export async function ergaenzeLoesungen(code: string): Promise<Record<string, LoesungEintrag>> {
  const ergebnis = await holeGesamtbild(code);
  if (!ergebnis) return {};
  const fehlend = ergebnis.bild.faeden.filter((f) => ergebnis.loesungen[f.id]?.fingerabdruck !== fingerabdruck(f));
  if (fehlend.length === 0) return ergebnis.loesungen;

  const schluessel = `${code}#${fehlend.map(fingerabdruck).join("|")}`;
  let auftrag = laufend.get(schluessel);
  if (!auftrag) {
    auftrag = (async () => {
      const neu = await Promise.all(
        fehlend.map(async (f) => [f, await erzeugeLoesung(ergebnis.bestandsaufnahme, f, ergebnis.beitraege)] as const),
      );
      // Frisch lesen und zusammenführen, damit parallel entstandene Lösungen erhalten bleiben.
      const aktuell = (await holeGesamtbildEintrag(code))?.loesungen ?? ergebnis.loesungen;
      const alle = { ...aktuell };
      for (const [f, loesung] of neu) if (loesung) alle[f.id] = { fingerabdruck: fingerabdruck(f), loesung };
      await speichereLoesungen(code, alle);
      return alle;
    })().finally(() => laufend.delete(schluessel));
    laufend.set(schluessel, auftrag);
  }
  return auftrag;
}
