// Schutz der Einzelnen: Ein Bereich wird nur genannt, wenn er die Mindestanzahl erreicht,
// die Person zugestimmt hat oder es die Leitung ist (deren Antworten sind nie anonym).
// Wird VOR jedem KI-Aufruf angewendet, damit kleine Bereiche das Modell gar nicht erreichen.
import type { Beitrag, Bestandsaufnahme } from "./typen";

export const ANDERER_BEREICH = "ein anderer Bereich";

export function bereichsLabel(beitrag: Beitrag, alle: Beitrag[], b: Pick<Bestandsaufnahme, "mindestanzahl">) {
  if (beitrag.istLeitung || beitrag.rolleZeigen) return beitrag.bereich;
  const anzahl = alle.filter((x) => x.bereich === beitrag.bereich).length;
  return anzahl >= b.mindestanzahl ? beitrag.bereich : ANDERER_BEREICH;
}
