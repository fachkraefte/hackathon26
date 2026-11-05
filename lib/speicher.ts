// Laufzeitdaten im Speicher des Servers (Demo, TECHNIK.md §6).
// Später ersetzt Supabase diese Datei; die Funktionen bleiben gleich.
// globalThis überlebt das Neuladen im Dev-Server.
import { demoBeitraege, demoBestandsaufnahme } from "./daten";
import type { Beitrag, Beschluss, Bestandsaufnahme, Gesamtbild } from "./typen";

type GesamtbildEintrag = { schluessel: string; bild: Gesamtbild; ausDemo: boolean };

type Speicher = {
  bestandsaufnahmen: Map<string, Bestandsaufnahme>;
  beitraege: Map<string, Beitrag[]>;
  gesamtbilder: Map<string, GesamtbildEintrag>;
  laufend: Map<string, Promise<GesamtbildEintrag>>;
  beschluesse: Map<string, Beschluss[]>;
};

const g = globalThis as typeof globalThis & { __rowaiSpeicher?: Speicher };

function neuerSpeicher(): Speicher {
  return {
    bestandsaufnahmen: new Map([[demoBestandsaufnahme.id, structuredClone(demoBestandsaufnahme)]]),
    beitraege: new Map([[demoBestandsaufnahme.id, structuredClone(demoBeitraege)]]),
    gesamtbilder: new Map(),
    laufend: new Map(),
    beschluesse: new Map(),
  };
}

export const speicher: Speicher = (g.__rowaiSpeicher ??= neuerSpeicher());

/** Setzt die Demo auf den Ausgangszustand zurück (vor jedem Pitch-Durchlauf). */
export function demoZuruecksetzen() {
  const neu = neuerSpeicher();
  speicher.bestandsaufnahmen = neu.bestandsaufnahmen;
  speicher.beitraege = neu.beitraege;
  speicher.gesamtbilder = neu.gesamtbilder;
  speicher.laufend = neu.laufend;
  speicher.beschluesse = neu.beschluesse;
}

export function holeBestandsaufnahme(id: string) {
  return speicher.bestandsaufnahmen.get(id) ?? null;
}

export function holeBeitraege(id: string) {
  return speicher.beitraege.get(id) ?? [];
}

export function speichereBeitrag(beitrag: Beitrag) {
  const liste = holeBeitraege(beitrag.bestandsaufnahmeId).filter((b) => b.id !== beitrag.id);
  speicher.beitraege.set(beitrag.bestandsaufnahmeId, [...liste, beitrag]);
}

export function aktualisiereBestandsaufnahme(b: Bestandsaufnahme) {
  speicher.bestandsaufnahmen.set(b.id, b);
}

export function holeBeschluesse(id: string) {
  return speicher.beschluesse.get(id) ?? [];
}

export function speichereBeschluss(id: string, beschluss: Beschluss) {
  const liste = holeBeschluesse(id).filter((b) => b.fadenId !== beschluss.fadenId);
  speicher.beschluesse.set(id, [...liste, beschluss]);
}
