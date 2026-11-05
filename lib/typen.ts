// Datenformate für Workflow v2 (KONZEPT_WORKFLOW.md) als zod-Schemas.
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

// ---------- ① Starten (Leitung) ----------
export const Bestandsaufnahme = z.object({
  id: z.string(),
  betrieb: z.object({
    name: z.string(),
    branche: Branche,
    mitarbeitende: z.number().int().positive(),
    leistungen: z.string(),
    fiktiv: z.boolean(),
  }),
  leitung: z.object({ vorname: z.string(), rolle: z.string() }),
  anrede: z.enum(["du", "sie"]),
  frage: z.string().min(5), // „Was soll besser werden?“
  ziel: z.string(), // „Was wäre in drei Monaten ein Erfolg?“
  stundensatz: z.number().positive(), // € pro Stunde, intern, von der Leitung gesetzt
  arbeitswochen: z.number().int().positive(), // für die Umrechnung auf ein Jahr
  bereiche: z.array(z.string()).min(1),
  mindestanzahl: z.number().int().positive(),
  zeitfresser: z.array(z.string()), // Chips für die Beschäftigten, von der KI vorgeschlagen
  besprechungAm: z.string().optional(),
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
});
export type Punkt = z.infer<typeof Punkt>;

export const Beitrag = z.object({
  id: z.string(),
  bestandsaufnahmeId: z.string(),
  bereich: z.string(),
  istLeitung: z.boolean(),
  rolleZeigen: z.boolean(), // Zustimmung, mit Bereich genannt zu werden, auch wenn die Gruppe klein ist
  punkte: z.array(Punkt).min(1).max(3),
  bremst: z.number().int().min(1).max(5), // 1 = kaum, 5 = sehr stark
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
  rueckfrage: z
    .object({ frage: z.string(), chips: z.array(z.string()).max(4) })
    .nullable(),
});
export type Verstaendnis = z.infer<typeof Verstaendnis>;

// ---------- ③ Verstehen (alle) ----------
export const Ansatz = z.object({
  art: Loesungsart,
  text: z.string(),
  warum: z.string(),
  wasFehlt: z.string(), // was für eine Bewertung noch geklärt werden muss
  herkunft: Herkunft,
  wissenId: z.string().nullable(),
});
export type Ansatz = z.infer<typeof Ansatz>;

export const Faden = z.object({
  id: z.string(),
  aufgabe: z.string(), // gemeinsame Aufgabe, positiv formuliert
  problem: z.string(), // was passiert, wo, mit welchen Folgen
  punktIds: z.array(z.string()).min(1), // welche Punkte dazugehören – Stunden rechnet der Code
  sichtweisen: z.array(z.object({ bereich: z.string(), aussage: z.string() })).min(1),
  unterschied: z.string().nullable(), // wo die Sichtweisen auseinandergehen
  ansaetze: z.array(Ansatz).min(1),
  ersterSchritt: z.string(),
});
export type Faden = z.infer<typeof Faden>;

export const Gesamtbild = z.object({
  // Erste Zusammenführung bildet 2–4 Fäden; neue Themen kommen später als eigene Fäden dazu.
  faeden: z.array(Faden).min(1).max(6),
  staerken: z.array(z.string()),
  offeneFragen: z.array(z.string()),
});
export type Gesamtbild = z.infer<typeof Gesamtbild>;

export const Beschluss = z.object({
  fadenId: z.string(),
  aufgabe: z.string(), // Kopie: Faden-IDs können sich beim Neu-Zusammenführen ändern
  verantwortlich: z.string(),
  bis: z.string(),
});
export type Beschluss = z.infer<typeof Beschluss>;

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
