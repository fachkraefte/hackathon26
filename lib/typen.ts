// Datenformate aus TECHNIK.md, Abschnitt 4, als zod-Schemas.
// Jedes Schema prüft Daten zur Laufzeit (KI-Ausgaben, Demo-Daten) und liefert
// über z.infer gleichzeitig den TypeScript-Typ.
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

// Reihenfolge ist fest: so stehen die Werte auch in den Demo-Daten.
export const dimensionen = [
  "informationUebergaben",
  "dokumentationVerwaltung",
  "planungKoordination",
  "koerperlicheBelastung",
  "wissenEinarbeitung",
  "digitaleWerkzeuge",
] as const;
export const Dimension = z.enum(dimensionen);
export type Dimension = z.infer<typeof Dimension>;

export const Wert = z.literal([1, 2, 3, 4, 5]); // 1 = klappt schlecht, 5 = klappt gut
export type Wert = z.infer<typeof Wert>;

export const loesungsarten = [
  "prozess",
  "software",
  "kiAssistenz",
  "robotikHardware",
  "keineTechnik",
] as const;
export const Loesungsart = z.enum(loesungsarten);
export type Loesungsart = z.infer<typeof Loesungsart>;

export const Reifegrad = z.enum(["imEinsatz", "pilot", "forschung"]);
export type Reifegrad = z.infer<typeof Reifegrad>;

export const Herkunft = z.enum(["rokiGeprueft", "nichtGeprueft"]);
export type Herkunft = z.infer<typeof Herkunft>;

export const Aufwand = z.enum(["gering", "mittel", "hoch"]);
export type Aufwand = z.infer<typeof Aufwand>;

export const zeitraeume = ["kurz", "mittel", "lang"] as const;
export const Zeitraum = z.enum(zeitraeume);
export type Zeitraum = z.infer<typeof Zeitraum>;

export const haeufigkeiten = [
  "mehrmalsTaeglich",
  "taeglich",
  "woechentlich",
  "monatlich",
  "selten",
] as const;
export const Haeufigkeit = z.enum(haeufigkeiten);
export type Haeufigkeit = z.infer<typeof Haeufigkeit>;

export const belastungsarten = [
  "zeit",
  "koerperlich",
  "nerven",
  "fehleranfaellig",
  "wartezeit",
] as const;
export const Belastungsart = z.enum(belastungsarten);
export type Belastungsart = z.infer<typeof Belastungsart>;

export const WerHilft = z.enum(["intern", "rokiWissen", "rokiBeratung", "rokiNetzwerk"]);
export type WerHilft = z.infer<typeof WerHilft>;

// "von ROKI geprüft" nur mit Verweis auf den Wissensauszug.
function wissenIdBeiGeprueft(wert: { herkunft: Herkunft; wissenId?: string }) {
  return wert.herkunft !== "rokiGeprueft" || Boolean(wert.wissenId);
}
const wissenIdFehlt = {
  message: "herkunft = rokiGeprueft braucht eine wissenId aus dem Wissensauszug",
  path: ["wissenId"],
};

// ---------- Anlegen ----------
export const Betrieb = z.object({
  id: z.string(),
  name: z.string(),
  branche: Branche,
  mitarbeitende: z.number().int().positive(),
  ort: z.string(),
  leistungen: z.string().optional(), // Produkte und Dienstleistungen (Ergänzung, siehe PR)
  fiktiv: z.boolean(),
});
export type Betrieb = z.infer<typeof Betrieb>;

export const Bereich = z.object({
  id: z.string(),
  name: z.string(),
  linkId: z.string(),
  erwarteteAntworten: z.number().int().positive(),
});
export type Bereich = z.infer<typeof Bereich>;

export const Bestandsaufnahme = z.object({
  id: z.string(),
  betriebId: z.string(),
  bereiche: z.array(Bereich),
  anrede: z.enum(["sie", "du"]),
  mindestanzahl: z.number().int().positive(),
  status: z.enum(["offen", "abgeschlossen"]),
});
export type Bestandsaufnahme = z.infer<typeof Bestandsaufnahme>;

// ---------- Schritt 1 ----------
export const Uebergabe = z.object({
  von: z.string(), // Bereich oder Rolle, nie ein Name
  an: z.string(),
  problem: z.string(),
});
export type Uebergabe = z.infer<typeof Uebergabe>;

export const Aufgabe = z.object({
  id: z.string(),
  titel: z.string(),
  beschreibung: z.string(),
  haeufigkeit: Haeufigkeit,
  stundenProWoche: z.number().nonnegative().optional(),
  belastung: z.array(Belastungsart),
  uebergabe: Uebergabe.optional(),
  aussage: z.string(),
});
export type Aufgabe = z.infer<typeof Aufgabe>;

export const Aufgabenkarte = z.object({
  antwortId: z.string(),
  rollen: z.array(z.string()), // Ergänzung: gewählte Rollen aus dem Katalog
  aufgaben: z.array(Aufgabe),
  wasGutLaeuft: z.array(z.string()),
  kommunikation: Uebergabe.optional(), // Ergänzung: wo hakt die Kommunikation
  zeitfresser: z.string().optional(), // Ergänzung
  workLife: z.string().optional(), // Ergänzung: was stört Freizeit und Erholung
  wunsch: z.string().optional(),
  bestaetigt: z.boolean(),
  korrigiert: z.boolean(),
});
export type Aufgabenkarte = z.infer<typeof Aufgabenkarte>;

// ---------- Schritt 2 ----------
export const Loesungsvorschlag = z
  .object({
    art: Loesungsart,
    beschreibung: z.string(),
    reifegrad: Reifegrad.optional(),
    herkunft: Herkunft,
    wissenId: z.string().optional(),
    aufwand: Aufwand,
    aufwandHinweis: z.string(),
    wasPruefen: z.array(z.string()),
  })
  .refine(wissenIdBeiGeprueft, wissenIdFehlt);
export type Loesungsvorschlag = z.infer<typeof Loesungsvorschlag>;

// ---------- Schritt 3 ----------
export const Thema = z.object({
  id: z.string(),
  titel: z.string(),
  beschreibung: z.string(),
  bereiche: z.array(z.string()),
  anzahlNennungen: z.number().int().nonnegative(),
  istSchnittstelle: z.boolean(),
  aussagen: z.array(z.string()),
  stundenProWoche: z.number().nonnegative().optional(),
  vermuteteUrsache: z.string().optional(),
});
export type Thema = z.infer<typeof Thema>;

export const Profilwert = z.object({
  dimension: Dimension,
  bereich: z.string(), // Bereichs-ID oder "gesamt"
  ist: z.number(),
  anzahl: z.number().int(),
  ziel: Wert.optional(),
});
export type Profilwert = z.infer<typeof Profilwert>;

export const Gesamtbild = z.object({
  bestandsaufnahmeId: z.string(),
  antwortenGesamt: z.number().int(),
  themen: z.array(Thema),
  staerken: z.array(z.string()),
  profil: z.array(Profilwert),
});
export type Gesamtbild = z.infer<typeof Gesamtbild>;

// So kommt das Gesamtbild von der KI bzw. aus den Demo-Daten:
// Das Profil rechnet der Code, nicht die KI.
export const GesamtbildOhneProfil = Gesamtbild.omit({ profil: true });

// ---------- Schritt 4 ----------
export const Massnahme = z
  .object({
    id: z.string(),
    zeitraum: Zeitraum,
    titel: z.string(),
    themaId: z.string(),
    art: Loesungsart,
    ersterSchritt: z.string(),
    wasPruefen: z.array(z.string()),
    werHilft: z.array(WerHilft),
    herkunft: Herkunft,
    wissenId: z.string().optional(),
  })
  .refine(wissenIdBeiGeprueft, wissenIdFehlt);
export type Massnahme = z.infer<typeof Massnahme>;

export const Fahrplan = z.object({
  bestandsaufnahmeId: z.string(),
  massnahmen: z.array(Massnahme),
});
export type Fahrplan = z.infer<typeof Fahrplan>;

// ---------- Schritt 5 ----------
export const Beschluss = z.object({
  bestandsaufnahmeId: z.string(),
  zielwerte: z.array(z.object({ dimension: Dimension, ziel: Wert })),
  ersterTestlauf: z.string(),
  verantwortlich: z.string(), // Rolle, kein Name nötig
  nachschauenAm: z.string().optional(),
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

// ---------- Testdaten (DEMO_BETRIEBE.md) ----------
// Werte in der Reihenfolge von `dimensionen`.
export const Testantwort = z.object({
  id: z.string(),
  bereichId: z.string(),
  istLeitung: z.boolean(),
  aussage: z.string(),
  stunden: z.array(z.object({ wofuer: z.string(), stunden: z.number().nonnegative() })),
  werte: z.tuple([Wert, Wert, Wert, Wert, Wert, Wert]),
});
export type Testantwort = z.infer<typeof Testantwort>;

// ---------- Fragenkatalog für die Einzelabfrage ----------
export const KatalogVorschlag = z
  .object({
    art: Loesungsart,
    text: z.string(),
    herkunft: Herkunft,
    wissenId: z.string().optional(),
  })
  .refine(wissenIdBeiGeprueft, wissenIdFehlt);
export type KatalogVorschlag = z.infer<typeof KatalogVorschlag>;

export const KatalogAufgabe = z.object({
  id: z.string(),
  titel: z.string(),
  frage: z.string(),
  branchen: z.array(Branche), // leer = alle Branchen
  vorschlaege: z.array(KatalogVorschlag),
});
export type KatalogAufgabe = z.infer<typeof KatalogAufgabe>;

export const Rolle = z.object({
  id: z.string(),
  name: z.string(),
  branchen: z.array(Branche), // leer = alle Branchen
  aufgaben: z.array(z.string()),
});
export type Rolle = z.infer<typeof Rolle>;

export const AllgemeineFrage = z.object({
  id: z.enum(["gutLaeuft", "kommunikation", "zeitfresser", "workLife", "wunsch"]),
  frage: z.string(),
  hinweis: z.string().optional(),
});
export type AllgemeineFrage = z.infer<typeof AllgemeineFrage>;

export const Katalog = z.object({
  stand: z.string(),
  hinweis: z.string(),
  rollen: z.array(Rolle),
  aufgaben: z.array(KatalogAufgabe),
  allgemeineFragen: z.array(AllgemeineFrage),
});
export type Katalog = z.infer<typeof Katalog>;
