"use server";

// Server Actions: öffentliche Endpunkte, deshalb wird jede Eingabe mit zod geprüft.
import { after } from "next/server";
import { z } from "zod";
import { bereichsLabel } from "./anonym";
import { nimmBeitragAuf } from "./gesamtbild";
import { bereiteVor, versteheGeschichte } from "./ki/schritte";
import { DEMO_ID, DEMO_ID_EN } from "./daten";
import { erzeugeStartKarten, ladeDemoKarten } from "./feed";
import { DEMO_LEITUNGS_CODE, DEMO_LEITUNGS_CODE_EN, neuerLeitungsCode, setzeLeitungsCode } from "./zugang";
import { ergaenzeLoesungen } from "./loesungen";
import { euroProJahr, fadenZahlen, satzFuer, stundenProWoche } from "./rechnen";
import { aktualisiereBestandsaufnahme, demoZuruecksetzen, holeBeitraege, holeBestandsaufnahme, personenAnzahl, speichereBeitrag } from "./speicher";
import { Beitrag, Bereich, Branche, Profil, Punkt, type Bestandsaufnahme } from "./typen";
import { leseWebsite } from "./website";

async function bestandsaufnahmeOderFehler(code: string) {
  const b = await holeBestandsaufnahme(code.trim().toUpperCase());
  if (!b) throw new Error(`Code ${code} gibt es nicht.`);
  return b;
}

// Code: 6 Zeichen ohne Verwechslungsgefahr (kein 0/O, 1/I/L).
const ZEICHEN = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
async function neuerCode() {
  for (let versuch = 0; versuch < 10; versuch++) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (x) => ZEICHEN[x % ZEICHEN.length]).join("");
    if (!(await holeBestandsaufnahme(code))) return code;
  }
  throw new Error("Kein freier Code gefunden.");
}

// ---------- Zugang ----------
/** Prüft einen Code und gibt die Schreibweise zurück, unter der er gespeichert ist. */
export async function pruefeCode(code: string) {
  const sauber = z.string().trim().min(4).max(12).parse(code).toUpperCase();
  return (await holeBestandsaufnahme(sauber)) ? sauber : null;
}

// ---------- ① Anlegen ----------
const AnlegenEingabe = z.object({
  name: z.string().trim().min(2).max(80),
  branche: Branche,
  mitarbeitende: z.number().int().min(2).max(500),
  website: z.string().trim().max(200).nullable(),
  leistungen: z.string().trim().min(5).max(400),
  ziel: z.string().trim().min(5).max(300),
  anrede: z.enum(["du", "sie"]),
  deadline: z.string().trim().max(120).default(""), // optional: Ergebnisbesprechung, wenn es einen Termin gibt
  bereiche: z.array(Bereich).min(1).max(10),
  sprache: z.enum(["de", "en"]).default("de"), // Sprache der Oberfläche beim Anlegen
});

export async function legeAn(eingabe: z.input<typeof AnlegenEingabe>) {
  const d = AnlegenEingabe.parse(eingabe);
  const b: Bestandsaufnahme = {
    id: await neuerCode(),
    betrieb: {
      name: d.name,
      branche: d.branche,
      mitarbeitende: d.mitarbeitende,
      leistungen: d.leistungen,
      website: d.website || null,
      fiktiv: false,
    },
    anrede: d.anrede,
    ziel: d.ziel,
    deadline: d.deadline,
    sprache: d.sprache,
    bereiche: d.bereiche.map((x) => ({ ...x, satzBis: Math.max(x.satzVon, x.satzBis) })),
    arbeitswochen: 46,
    mindestanzahl: 3,
    profil: null,
  };
  const websiteText = await leseWebsite(b.betrieb.website);
  const vorbereitung = await bereiteVor(b, websiteText);
  await aktualisiereBestandsaufnahme({ ...b, profil: vorbereitung.daten });
  // Startkarten für den Feed im Hintergrund – bis die ersten Beschäftigten den Code eingeben, liegen sie bereit.
  const leitungCode = neuerLeitungsCode();
  await setzeLeitungsCode(b.id, leitungCode);
  after(() => erzeugeStartKarten({ ...b, profil: vorbereitung.daten }, websiteText).catch((e: unknown) => console.error("Startkarten:", e)));
  return { code: b.id, leitungCode, profil: vorbereitung.daten, websiteGelesen: websiteText !== null, ausDemo: vorbereitung.ausDemo };
}

/** Die Leitung korrigiert die vorbereiteten Chips. */
export async function speichereProfil(code: string, profil: z.input<typeof Profil>) {
  const b = await bestandsaufnahmeOderFehler(code);
  await aktualisiereBestandsaufnahme({ ...b, profil: Profil.parse(profil) });
}

// ---------- ② Befragung ----------
const VerstehenEingabe = z.object({
  code: z.string(),
  bereich: z.string().max(40),
  aufgabe: z.string().max(80),
  geschichte: z.string().trim().min(3).max(2000),
  rueckfrageErlaubt: z.boolean(),
});

export async function verstehe(eingabe: z.input<typeof VerstehenEingabe>) {
  const daten = VerstehenEingabe.parse(eingabe);
  const b = await bestandsaufnahmeOderFehler(daten.code);
  return versteheGeschichte(b, daten);
}

const BeitragEingabe = z.object({
  code: z.string(),
  bereich: z.string().max(40),
  punkte: z.array(Punkt.omit({ id: true })).min(1).max(3),
  mitsprache: z.number().int().min(1).max(5).nullable(),
  gutLaeuft: z.string().trim().max(300).optional(),
  // Meldung aus der persönlichen App: zählt zur selben Person wie ihre Feed-Stimmen.
  id: z.string().regex(/^feed-[A-Z0-9]{6,12}-m[a-z0-9]{6,10}$/).optional(),
});

export async function sendeBeitrag(eingabe: z.input<typeof BeitragEingabe>) {
  const daten = BeitragEingabe.parse(eingabe);
  const b = await bestandsaufnahmeOderFehler(daten.code);
  const id = daten.id ?? `live-${crypto.randomUUID().slice(0, 8)}`;
  const beitrag: Beitrag = Beitrag.parse({
    id,
    bestandsaufnahmeId: b.id,
    bereich: daten.bereich,
    istLeitung: daten.bereich === "Leitung",
    rolleZeigen: false,
    punkte: daten.punkte.map((p, i) => ({ ...p, id: `${id}-${i + 1}` })),
    mitsprache: daten.mitsprache,
    gutLaeuft: daten.gutLaeuft || undefined,
    fiktiv: false,
  });
  await speichereBeitrag(beitrag);

  const ergebnis = await nimmBeitragAuf(b.id);
  if (!ergebnis) throw new Error("Gesamtbild nicht verfügbar.");
  // Lösungen für neue Handlungsfelder nach der Antwort im Hintergrund vorbereiten.
  after(() => ergaenzeLoesungen(b.id).then(() => undefined, (e: unknown) => console.error("Lösungen im Hintergrund:", e)));
  const meineIds = new Set(beitrag.punkte.map((p) => p.id));
  const meinLabel = bereichsLabel(beitrag, ergebnis.beitraege, b);
  const meineStunden = beitrag.punkte.reduce((s, p) => s + stundenProWoche(p), 0);

  const faeden = ergebnis.bild.faeden
    .filter((f) => f.punktIds.some((pid) => meineIds.has(pid)))
    .map((f) => {
      const zahlen = fadenZahlen(f, ergebnis.beitraege, ergebnis.bestandsaufnahme);
      return {
        kurzname: f.kurzname,
        aufgabe: f.aufgabe,
        andere: Math.max(zahlen.personen - 1, 0),
        bereiche: [...new Set(f.sichtweisen.map((s) => s.bereich).filter((x) => x !== meinLabel))],
        euroJahr: zahlen.euroJahr,
      };
    });

  return {
    beitragId: id,
    punktIds: beitrag.punkte.map((p) => p.id),
    faeden,
    meineStundenWoche: meineStunden,
    meineEuroJahr: euroProJahr(meineStunden, satzFuer(b, beitrag.bereich), b),
    teilgenommen: personenAnzahl(ergebnis.beitraege),
    mitarbeitende: b.betrieb.mitarbeitende,
    erste: personenAnzahl(ergebnis.beitraege) === 1,
    ausDemo: ergebnis.ausDemo,
  };
}

/** Für die Rückmeldung „x von y haben teilgenommen“, ohne Inhalte preiszugeben. */
export async function teilnahme(code: string) {
  const b = await bestandsaufnahmeOderFehler(code);
  return { teilgenommen: personenAnzahl(await holeBeitraege(b.id)), mitarbeitende: b.betrieb.mitarbeitende };
}

export async function setzeDemoZurueck() {
  await demoZuruecksetzen();
  await ladeDemoKarten();
  await setzeLeitungsCode(DEMO_ID, DEMO_LEITUNGS_CODE);
  await setzeLeitungsCode(DEMO_ID_EN, DEMO_LEITUNGS_CODE_EN);
}
