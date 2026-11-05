// Profilwerte: Durchschnitt der Selbsteinschätzungen, im Code berechnet (nicht von der KI).
import { dimensionen, type Bestandsaufnahme, type Profilwert, type Testantwort } from "./typen";

function runde(wert: number) {
  return Math.round(wert * 10) / 10;
}

function durchschnitt(antworten: Testantwort[], index: number) {
  const summe = antworten.reduce((acc, antwort) => acc + antwort.werte[index], 0);
  return runde(summe / antworten.length);
}

/**
 * Gesamtwerte über alle Antworten plus Werte je Bereich.
 * Bereiche unter der Mindestanzahl bekommen keinen eigenen Wert (Schutz der Einzelnen);
 * die Leitung ist ausgenommen, ihre Antworten sind nie anonym.
 */
export function berechneProfil(
  antworten: Testantwort[],
  bestandsaufnahme: Bestandsaufnahme,
): Profilwert[] {
  if (antworten.length === 0) return [];
  const werte: Profilwert[] = [];

  dimensionen.forEach((dimension, index) => {
    werte.push({ dimension, bereich: "gesamt", ist: durchschnitt(antworten, index), anzahl: antworten.length });

    for (const bereich of bestandsaufnahme.bereiche) {
      const imBereich = antworten.filter((a) => a.bereichId === bereich.id);
      const istLeitung = imBereich.some((a) => a.istLeitung);
      if (imBereich.length === 0) continue;
      if (imBereich.length < bestandsaufnahme.mindestanzahl && !istLeitung) continue;
      werte.push({ dimension, bereich: bereich.id, ist: durchschnitt(imBereich, index), anzahl: imBereich.length });
    }
  });

  return werte;
}
