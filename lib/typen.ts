// Datenformate für ROKIO v3 (KONZEPT_V3.md) als zod-Schemas.
// Jedes Schema prüft Daten zur Laufzeit (KI-Ausgaben, Formulareingaben, Demo-Daten)
// und liefert über z.infer gleichzeitig den TypeScript-Typ.
import { z } from "zod";

// ---------- Grundbegriffe ----------
export const branchen = [
  "produktionHandwerk",
  "gastronomie",
  "gesundheitPflege",
  "logistik",
  "facilityManagement",
] as const;
export const Branche = z.enum(branchen);
export type Branche = z.infer<typeof Branche>;

export const loesungsarten = ["prozess", "software", "kiAssistenz", "robotikHardware", "keineTechnik"] as const;
export const Loesungsart = z.enum(loesungsarten);
export type Loesungsart = z.infer<typeof Loesungsart>;

export const Reifegrad = z.enum(["imEinsatz", "pilot", "forschung"]);
export type Reifegrad = z.infer<typeof Reifegrad>;

export const Herkunft = z.enum(["rokiGeprueft", "nichtGeprueft"]);
export type Herkunft = z.infer<typeof Herkunft>;

/** Häufigkeit als Stufe eines Schiebereglers; der Faktor steht in lib/rechnen.ts. */
export const haeufigkeiten = [
  "monatlich",
  "mehrmalsImMonat",
  "woechentlich",
  "mehrmalsProWoche",
  "taeglich",
  "mehrmalsTaeglich",
] as const;
export const Haeufigkeit = z.enum(haeufigkeiten);
export type Haeufigkeit = z.infer<typeof Haeufigkeit>;

/** Minuten pro Vorfall, Stufen des Schiebereglers. */
export const minutenStufen = [5, 10, 15, 30, 45, 60, 90, 120, 180, 240] as const;

// ---------- ① Anlegen (Leitung) ----------
/** Bereich mit grober Stundensatz-Spanne (Arbeitgeberkosten pro Stunde, keine Einzellöhne). */
export const Bereich = z.object({
  name: z.string().min(1).max(40),
  satzVon: z.number().positive(),
  satzBis: z.number().positive(),
});
export type Bereich = z.infer<typeof Bereich>;

/** Was die KI beim Anlegen einmal vorbereitet; die Leitung kann es korrigieren. */
export const Profil = z.object({
  kurz: z.string(), // Kurzbeschreibung des Betriebs, 1–2 Sätze
  extern: z.array(z.string()).max(4), // externe Beteiligte, z. B. Kunde, Gäste, Angehörige
  chips: z.record(z.string(), z.array(z.string()).max(8)), // Aufgaben-Chips je Bereich
  rueckfragen: z.record(z.string(), z.array(z.string()).max(6)), // Vorrat an Rückfragen je Bereich
});
export type Profil = z.infer<typeof Profil>;

export const Bestandsaufnahme = z.object({
  id: z.string(), // zugleich der Code, den die Beschäftigten eingeben
  betrieb: z.object({
    name: z.string(),
    branche: Branche,
    mitarbeitende: z.number().int().positive(),
    leistungen: z.string(),
    website: z.string().nullable(),
    fiktiv: z.boolean(),
  }),
  anrede: z.enum(["du", "sie"]),
  ziel: z.string().min(5), // ein Satz der Leitung: was besser werden soll
  deadline: z.string(), // „wann und wo“ der Ergebnisbesprechung
  bereiche: z.array(Bereich).min(1),
  arbeitswochen: z.number().int().positive(), // für die Umrechnung auf ein Jahr
  mindestanzahl: z.number().int().positive(),
  profil: Profil.nullable(),
});
export type Bestandsaufnahme = z.infer<typeof Bestandsaufnahme>;

// ---------- ② Erzählen (jede Person) ----------
/** Ein Problem aus Sicht einer Person – neutral formuliert, mit ihrer eigenen Zeit. */
export const Punkt = z.object({
  id: z.string(),
  zeitfresser: z.string(), // gewählter Chip oder eigene Angabe
  titel: z.string(), // kurz, neutral, ohne Namen
  aussage: z.string(), // gekürzte, neutralisierte Schilderung
  haeufigkeit: Haeufigkeit,
  minuten: z.number().int().nonnegative(), // eigene Zeit pro Vorfall
  beteiligt: z.array(z.string()), // Bereiche oder Rollen, nie Namen
  folge: z.string().optional(),
  bremst: z.number().int().min(1).max(5), // „Wie sehr bremst dich das?“ 1 = kaum, 5 = sehr stark
  von: z.string().nullable(), // Übergabe: von welchem Bereich/Externen kommt das Problem (null = eigener Bereich)
  an: z.string().nullable(), // an welchen Bereich geht es weiter (null = eigener Bereich)
});
export type Punkt = z.infer<typeof Punkt>;

export const Beitrag = z.object({
  id: z.string(),
  bestandsaufnahmeId: z.string(),
  bereich: z.string(),
  istLeitung: z.boolean(),
  rolleZeigen: z.boolean(), // Zustimmung, mit Bereich genannt zu werden, auch wenn die Gruppe klein ist
  punkte: z.array(Punkt).min(1).max(3),
  mitsprache: z.number().int().min(1).max(5).nullable(), // „Meine Vorschläge kommen an, und es passiert etwas.“
  gutLaeuft: z.string().optional(),
  fiktiv: z.boolean(),
});
export type Beitrag = z.infer<typeof Beitrag>;

/** Antwort der KI auf eine Geschichte: Spiegelung, herausgehörte Werte, ggf. eine Rückfrage. */
export const Verstaendnis = z.object({
  spiegelung: z.string(),
  titel: z.string(),
  aussage: z.string(),
  haeufigkeit: Haeufigkeit.nullable(),
  minuten: z.number().int().nonnegative().nullable(),
  beteiligt: z.array(z.string()),
  folge: z.string().nullable(),
  von: z.string().nullable(), // Vorschlag für die Übergabe (Bereich oder Externe), Person kann korrigieren
  an: z.string().nullable(),
  rueckfrage: z
    .object({ frage: z.string(), chips: z.array(z.string()).max(4) })
    .nullable(),
});
export type Verstaendnis = z.infer<typeof Verstaendnis>;

// ---------- ③ Analyse (alle) ----------
export const Faden = z.object({
  id: z.string(), // bleibt stabil, solange die Bestandsaufnahme läuft
  kurzname: z.string(), // 1–3 Wörter für Übergabe-Karte und Profil, z. B. „Zeichnungsstand“
  aufgabe: z.string(), // gemeinsame Aufgabe, positiv formuliert
  problem: z.string(), // was passiert, wo, mit welchen Folgen
  punktIds: z.array(z.string()).min(1), // welche Punkte dazugehören – Stunden rechnet der Code
  sichtweisen: z.array(z.object({ bereich: z.string(), aussage: z.string() })).min(1),
  unterschied: z.string().nullable(), // wo die Sichtweisen auseinandergehen
});
export type Faden = z.infer<typeof Faden>;

export const Gesamtbild = z.object({
  // Erste Zusammenführung bildet 2–4 Fäden; neue Themen kommen später als eigene Fäden dazu.
  faeden: z.array(Faden).min(1).max(6),
  staerken: z.array(z.string()),
});
export type Gesamtbild = z.infer<typeof Gesamtbild>;

// ---------- ④ Lösungen ----------
export const Loesung = z.object({
  name: z.string(), // z. B. „Änderungs-Agent“
  satz: z.string(), // ein Satz, was sich ändert
  schritte: z.array(z.string()).length(3), // So läuft es – konkret in diesem Betrieb
  braucht: z.array(z.string()).min(1).max(5), // Daten, Geräte, Absprachen
  kniff: z.string(), // Der KI-Kniff
  zeitFrei: z.string(), // Wofür die Zeit frei wird
  art: Loesungsart,
  reife: Reifegrad,
  herkunft: Herkunft,
  wissenId: z.string().nullable(),
  testlauf: z.string(),
  bauplanPrompt: z.string(),
});
export type Loesung = z.infer<typeof Loesung>;

/** Lösung je Faden; der Fingerabdruck zeigt, für welchen Stand des Fadens sie berechnet wurde. */
export const LoesungEintrag = z.object({ fingerabdruck: z.string(), loesung: Loesung });
export type LoesungEintrag = z.infer<typeof LoesungEintrag>;

// ---------- Wissensauszug ----------
export const WissensEintrag = z.object({
  id: z.string(),
  loesung: z.string(),
  art: Loesungsart,
  branchen: z.array(Branche),
  typischeAufgaben: z.array(z.string()),
  reifegrad: Reifegrad,
  grenzen: z.array(z.string()),
  quelle: z.object({ datei: z.string(), abschnitt: z.string() }),
});
export type WissensEintrag = z.infer<typeof WissensEintrag>;
