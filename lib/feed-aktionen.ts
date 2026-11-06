"use server";

// Server Actions des Feeds. Öffentliche Endpunkte – jede Eingabe wird mit zod geprüft.
// Gespeichert werden keine Uhrzeiten, keine Geräteinfos, kein Audio (Hausordnung).
import { z } from "zod";
import { sendeBeitrag } from "./aktionen";
import { analyseDaten } from "./analyse";
import {
  karteAusGeschichte,
  resonanzFuer,
  Richtung,
  speichereKarte,
  stelleFeedZusammen,
  verarbeiteGeste,
} from "./feed";
import { holeGesamtbild } from "./gesamtbild";
import { versteheGeschichte } from "./ki/schritte";
import { holeBestandsaufnahme, holeGesamtbildEintrag, speichereLoesungen } from "./speicher";
import { Haeufigkeit } from "./typen";

const Code = z.string().trim().toUpperCase().min(3).max(12);
const Sitzung = z.string().regex(/^[a-z0-9]{6,16}$/);
const BereichName = z.string().min(1).max(40);

async function betrieb(code: string) {
  const b = await holeBestandsaufnahme(Code.parse(code));
  if (!b) throw new Error("Diesen Code gibt es nicht.");
  return b;
}

export async function ladeFeed(code: string, bereich: string, beantwortet: string[]) {
  const b = await betrieb(code);
  return stelleFeedZusammen(b.id, BereichName.parse(bereich), z.array(z.string().max(60)).max(500).parse(beantwortet));
}

export async function geste(eingabe: { code: string; sitzung: string; bereich: string; karteId: string; richtung: Richtung }) {
  const b = await betrieb(eingabe.code);
  return verarbeiteGeste(b, {
    sitzung: Sitzung.parse(eingabe.sitzung),
    bereich: BereichName.parse(eingabe.bereich),
    karteId: z.string().max(60).parse(eingabe.karteId),
    richtung: Richtung.parse(eingabe.richtung),
  });
}

/** Halten und erzählen: Spiegelung und anonyme Karte parallel. Nichts wird gespeichert, bevor die Person freigibt. */
export async function erzaehle(eingabe: { code: string; bereich: string; geschichte: string }) {
  const b = await betrieb(eingabe.code);
  const bereich = BereichName.parse(eingabe.bereich);
  const geschichte = z.string().trim().min(3).max(2000).parse(eingabe.geschichte);
  const [verstanden, karte] = await Promise.all([
    versteheGeschichte(b, { bereich, aufgabe: "Meldung aus dem Feed", geschichte, rueckfrageErlaubt: false }),
    karteAusGeschichte(b, bereich, geschichte),
  ]);
  const v = verstanden.daten;
  return {
    spiegelung: v.spiegelung || v.aussage,
    karte: karte ?? v.aussage,
    titel: v.titel,
    aussage: v.aussage,
    haeufigkeit: v.haeufigkeit,
    minuten: v.minuten,
    von: v.von,
    an: v.an,
  };
}

const Freigabe = z.object({
  code: z.string(),
  bereich: BereichName,
  karte: z.string().trim().min(3).max(160),
  titel: z.string().max(120),
  aussage: z.string().max(600),
  haeufigkeit: Haeufigkeit,
  minuten: z.number().int().min(1).max(480),
  von: z.string().max(60).nullable(),
  an: z.string().max(60).nullable(),
});

/** Freigeben: Meldung zählt als Stimme, die Karte geht an die anderen Bereiche. */
export async function gibFrei(eingabe: z.input<typeof Freigabe>) {
  const d = Freigabe.parse(eingabe);
  const b = await betrieb(d.code);
  const antwort = await sendeBeitrag({
    code: b.id,
    bereich: d.bereich,
    punkte: [{
      zeitfresser: d.titel,
      titel: d.titel,
      aussage: d.aussage,
      haeufigkeit: d.haeufigkeit,
      minuten: d.minuten,
      beteiligt: [],
      bremst: 3,
      von: d.von,
      an: d.an,
    }],
    mitsprache: null,
  });
  const bild = await holeGesamtbild(b.id);
  const faden = bild?.bild.faeden.find((f) => f.kurzname === antwort.faeden[0]?.kurzname) ?? null;
  const karte = {
    id: `${b.id}-m-${crypto.randomUUID().slice(0, 8)}`,
    fadenId: faden?.id ?? null,
    text: d.karte,
    bereich: d.bereich,
    von: d.von,
    an: d.an,
    typ: "aussage" as const,
  };
  await speichereKarte(b.id, karte);
  const resonanz = await resonanzFuer(b.id, karte);
  const empfaenger = [...new Set([d.von, d.an].filter((x): x is string => Boolean(x) && x !== d.bereich))];
  return { resonanz, kurzname: faden?.kurzname ?? null, empfaenger, karteId: karte.id };
}

/** Beamer-Ansicht: Graph und Zahlen, die live mitwachsen. Nur Zusammengeführtes. */
export async function liveDaten(code: string) {
  const d = await analyseDaten(Code.parse(code));
  if (!d) return null;
  return {
    betrieb: d.betrieb,
    karte: d.karte,
    stunden: d.summe.stunden,
    euro: d.summe.euro,
    stimmen: d.teilgenommen,
    faeden: d.faeden.slice(0, 4).map((f) => ({ kurzname: f.kurzname, personen: f.personen, stunden: f.stunden })),
  };
}

/** Leitung: „Testen wir“ – erzeugt im Feed die Karte „Was daraus wurde“. */
export async function setzeTest(code: string, fadenId: string, testet: boolean) {
  const b = await betrieb(code);
  const e = await holeGesamtbildEintrag(b.id);
  const eintrag = e?.loesungen[fadenId];
  if (!e || !eintrag) throw new Error("Lösung unbekannt.");
  await speichereLoesungen(b.id, { ...e.loesungen, [fadenId]: { ...eintrag, testet } });
  return testet;
}
