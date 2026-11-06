// Übergabe-Karte aus Daten (KONZEPT_V3 §5): Knoten = Bereiche + Externe, Kanten = Stimmen mit von/an.
// Reine Funktion ohne KI – die Karte zeigt genau das, was die Beschäftigten angegeben haben.
import { stundenProWoche } from "./rechnen";
import type { Beitrag, Bestandsaufnahme, Gesamtbild } from "./typen";

export type KartenKnoten = { name: string; extern: boolean; x: number; y: number };
export type KartenKante = {
  von: string;
  an: string; // gleich „von“ = Schleife (Problem innerhalb eines Bereichs)
  stimmen: number;
  stundenWoche: number;
  fadenIds: string[]; // nach Zahl der Stimmen sortiert
  kurznamen: string[];
  titel: string[]; // neutrale Kurztitel der Stimmen, für den Klick auf die Linie
};
export type Karte = { breite: number; hoehe: number; knoten: KartenKnoten[]; kanten: KartenKante[] };

const BREITE = 640;
const HOEHE = 520;

export function baueKarte(b: Bestandsaufnahme, beitraege: Beitrag[], bild: Gesamtbild): Karte {
  const fadenVon = new Map<string, { id: string; kurzname: string }>();
  for (const f of bild.faeden) for (const pid of f.punktIds) fadenVon.set(pid, { id: f.id, kurzname: f.kurzname });

  const bereiche = b.bereiche.map((x) => x.name);
  const extern = b.profil?.extern ?? [];
  const bekannt = new Set([...bereiche, ...extern]);

  // Kanten sammeln
  const sammel = new Map<string, KartenKante & { fadenZaehler: Map<string, number> }>();
  for (const beitrag of beitraege) {
    for (const p of beitrag.punkte) {
      const faden = fadenVon.get(p.id);
      if (!faden) continue; // noch keinem Handlungsfeld zugeordnet
      const von = p.von && bekannt.has(p.von) ? p.von : beitrag.bereich;
      const an = p.an && bekannt.has(p.an) ? p.an : beitrag.bereich;
      const schluessel = `${von}→${an}`;
      const k: KartenKante & { fadenZaehler: Map<string, number> } =
        sammel.get(schluessel) ??
        { von, an, stimmen: 0, stundenWoche: 0, fadenIds: [], kurznamen: [], titel: [], fadenZaehler: new Map() };
      k.stimmen += 1;
      k.stundenWoche += stundenProWoche(p);
      k.titel.push(p.titel);
      k.fadenZaehler.set(faden.id, (k.fadenZaehler.get(faden.id) ?? 0) + 1);
      sammel.set(schluessel, k);
    }
  }
  const kurzname = new Map(bild.faeden.map((f) => [f.id, f.kurzname]));
  const kanten: KartenKante[] = [...sammel.values()].map(({ fadenZaehler, ...k }) => {
    const ids = [...fadenZaehler.entries()].sort((a, z) => z[1] - a[1]).map(([id]) => id);
    return { ...k, fadenIds: ids, kurznamen: ids.map((id) => kurzname.get(id) ?? id) };
  });

  // Knoten: alle Bereiche, Externe nur, wenn sie in einer Kante vorkommen.
  const genutzt = new Set(kanten.flatMap((k) => [k.von, k.an]));
  const namen = ordne([...extern.filter((e) => genutzt.has(e)), ...bereiche], kanten);
  const knoten = namen.map((name, i) => {
    // Kreis im Uhrzeigersinn ab links: benachbarte Glieder der Kette liegen nebeneinander.
    const winkel = Math.PI + (i / namen.length) * 2 * Math.PI;
    return {
      name,
      extern: !bereiche.includes(name),
      x: Math.round(BREITE / 2 + Math.cos(winkel) * (BREITE / 2 - 80)),
      y: Math.round(HOEHE / 2 + Math.sin(winkel) * (HOEHE / 2 - 75)),
    };
  });
  return { breite: BREITE, hoehe: HOEHE, knoten, kanten: kanten.sort((a, z) => a.stimmen - z.stimmen) };
}

/**
 * Reihenfolge auf dem Kreis: Start beim ersten Externen (sonst beim ersten Bereich), dann jeweils
 * der Knoten, der am stärksten mit dem zuletzt gesetzten verbunden ist. So entstehen kurze Linien
 * entlang der tatsächlichen Arbeitskette statt kreuz und quer.
 */
function ordne(namen: string[], kanten: KartenKante[]): string[] {
  const gewicht = (a: string, z: string) =>
    kanten.filter((k) => (k.von === a && k.an === z) || (k.von === z && k.an === a)).reduce((s, k) => s + k.stimmen, 0);
  const rest = [...namen];
  const folge = [rest.shift()!];
  while (rest.length) {
    const letzter = folge[folge.length - 1];
    const beste = rest.reduce((b, n) => (gewicht(letzter, n) > gewicht(letzter, b) ? n : b), rest[0]);
    folge.push(beste);
    rest.splice(rest.indexOf(beste), 1);
  }
  return folge;
}
