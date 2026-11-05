"use server";

// Server Actions: öffentliche Endpunkte, deshalb wird jede Eingabe mit zod geprüft.
import { z } from "zod";
import { bereichsLabel } from "./anonym";
import { nimmBeitragAuf } from "./gesamtbild";
import { schlageZeitfresserVor, versteheGeschichte } from "./ki/schritte";
import { euroProJahr, fadenZahlen, stundenProWoche } from "./rechnen";
import {
  aktualisiereBestandsaufnahme,
  demoZuruecksetzen,
  holeBestandsaufnahme,
  speichereBeitrag,
  speichereBeschluss,
} from "./speicher";
import { Beitrag, Beschluss, Punkt } from "./typen";

async function bestandsaufnahmeOderFehler(id: string) {
  const b = await holeBestandsaufnahme(id);
  if (!b) throw new Error(`Bestandsaufnahme ${id} gibt es nicht.`);
  return b;
}

// ---------- ① Starten ----------
const StartEingabe = z.object({
  id: z.string(),
  frage: z.string().trim().min(10).max(800),
  ziel: z.string().trim().max(400),
  stundensatz: z.number().min(10).max(200),
  bereiche: z.array(z.string().trim().min(1).max(40)).min(1).max(10),
  anrede: z.enum(["du", "sie"]),
});

export async function starteBestandsaufnahme(eingabe: z.input<typeof StartEingabe>) {
  const daten = StartEingabe.parse(eingabe);
  const alt = await bestandsaufnahmeOderFehler(daten.id);
  const neu = { ...alt, ...daten };
  const vorschlag = await schlageZeitfresserVor(neu);
  await aktualisiereBestandsaufnahme({ ...neu, zeitfresser: vorschlag.daten });
  return { zeitfresser: vorschlag.daten, ausDemo: vorschlag.ausDemo };
}

// ---------- ② Erzählen ----------
const VerstehenEingabe = z.object({
  id: z.string(),
  bereich: z.string().max(40),
  zeitfresser: z.string().max(80),
  geschichte: z.string().trim().min(3).max(2000),
  rueckfrageErlaubt: z.boolean(),
});

export async function verstehe(eingabe: z.input<typeof VerstehenEingabe>) {
  const daten = VerstehenEingabe.parse(eingabe);
  const b = await bestandsaufnahmeOderFehler(daten.id);
  return versteheGeschichte(b, daten);
}

const BeitragEingabe = Beitrag.omit({ id: true, fiktiv: true }).extend({
  punkte: z.array(Punkt).min(1).max(3),
});

export async function sendeBeitrag(eingabe: z.input<typeof BeitragEingabe>) {
  const daten = BeitragEingabe.parse(eingabe);
  const b = await bestandsaufnahmeOderFehler(daten.bestandsaufnahmeId);
  const id = `live-${crypto.randomUUID().slice(0, 8)}`;
  const beitrag: Beitrag = {
    ...daten,
    id,
    fiktiv: false,
    punkte: daten.punkte.map((p, i) => ({ ...p, id: `${id}-${i + 1}` })),
  };
  await speichereBeitrag(beitrag);

  const ergebnis = await nimmBeitragAuf(b.id, beitrag);
  if (!ergebnis) throw new Error("Gesamtbild nicht verfügbar.");
  const meineIds = new Set(beitrag.punkte.map((p) => p.id));
  const meinLabel = bereichsLabel(beitrag, ergebnis.beitraege, b);
  const meineStunden = beitrag.punkte.reduce((s, p) => s + stundenProWoche(p), 0);

  const faeden = ergebnis.bild.faeden
    .filter((f) => f.punktIds.some((id) => meineIds.has(id)))
    .map((f) => {
      const zahlen = fadenZahlen(f, ergebnis.beitraege, ergebnis.bestandsaufnahme);
      return {
        aufgabe: f.aufgabe,
        andere: Math.max(zahlen.personen - 1, 0),
        bereiche: [...new Set(f.sichtweisen.map((s) => s.bereich).filter((x) => x !== meinLabel))],
        euroJahr: zahlen.euroJahr,
      };
    });

  return {
    faeden,
    meineStundenWoche: meineStunden,
    meineEuroJahr: euroProJahr(meineStunden, b),
    ausDemo: ergebnis.ausDemo,
  };
}

// ---------- ③ Verstehen ----------
export async function beschliesse(id: string, eingabe: z.input<typeof Beschluss>) {
  await bestandsaufnahmeOderFehler(id);
  await speichereBeschluss(id, Beschluss.parse(eingabe));
}

export async function setzeDemoZurueck() {
  await demoZuruecksetzen();
}
