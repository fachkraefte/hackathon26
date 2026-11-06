"use server";

// Server Actions des Feeds. Öffentliche Endpunkte – jede Eingabe wird mit zod geprüft.
// Gespeichert werden keine Uhrzeiten, keine Geräteinfos, kein Audio (Hausordnung).
import { z } from "zod";
import { sendeBeitrag } from "./aktionen";
import { analyseDaten } from "./analyse";
import {
  holeLob,
  lobAusMeldung,
  resonanzFuer,
  Richtung,
  speichereKarte,
  stelleFeedZusammen,
  verarbeiteGeste,
  zerlegeMeldung,
} from "./feed";
import { holeGesamtbild } from "./gesamtbild";
import { holeBestandsaufnahme, holeGesamtbildEintrag, speichereLoesungen } from "./speicher";
import { betriebZuLeitungsCode, erzeugeZugaenge, holeZugang, setzeBereichFuer } from "./zugang";
import { Haeufigkeit } from "./typen";

const Code = z.string().trim().toUpperCase().min(3).max(12);

const Sitzung = z.string().regex(/^[a-z0-9]{6,16}$/i);
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

/** Halten und erzählen: Die KI zerlegt die Meldung in einzelne Probleme. Gespeichert wird erst nach Freigabe. */
export async function erzaehle(eingabe: { code: string; bereich: string; geschichte: string }) {
  const b = await betrieb(eingabe.code);
  const bereich = BereichName.parse(eingabe.bereich);
  const geschichte = z.string().trim().min(3).max(2000).parse(eingabe.geschichte);
  const zerlegt = await zerlegeMeldung(b, bereich, geschichte);
  if (zerlegt) return zerlegt;
  // KI nicht erreichbar: die Meldung selbst als ein Problem.
  return {
    spiegelung: "",
    probleme: [{ text: geschichte.slice(0, 160), kontext: "", titel: "Meldung", von: null, an: null, haeufigkeit: null, minuten: null }],
  };
}

const Freigabe = z.object({
  code: z.string(),
  bereich: BereichName,
  sitzung: z.string().max(40).optional(),
  probleme: z
    .array(
      z.object({
        text: z.string().trim().min(3).max(200),
        kontext: z.string().max(200),
        titel: z.string().max(80),
        haeufigkeit: Haeufigkeit,
        minuten: z.number().int().min(1).max(480),
        von: z.string().max(60).nullable(),
        an: z.string().max(60).nullable(),
      }),
    )
    .min(1)
    .max(3),
});

/** Freigeben: jedes Problem zählt als Stimme und wird eine Karte für die anderen Bereiche. */
export async function gibFrei(eingabe: z.input<typeof Freigabe>) {
  const d = Freigabe.parse(eingabe);
  const b = await betrieb(d.code);
  const person = d.sitzung && /^[A-Z0-9]{6,12}$/.test(d.sitzung) ? d.sitzung : null;
  const antwort = await sendeBeitrag({
    id: person ? `feed-${person}-m${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}` : undefined,
    code: b.id,
    bereich: d.bereich,
    punkte: d.probleme.map((p) => ({
      zeitfresser: p.titel,
      titel: p.titel,
      aussage: `${p.text} ${p.kontext}`.trim(),
      haeufigkeit: p.haeufigkeit,
      minuten: p.minuten,
      beteiligt: [],
      bremst: 3,
      von: p.von,
      an: p.an,
    })),
    mitsprache: null,
  });
  const bild = await holeGesamtbild(b.id);
  const ergebnisse = [];
  for (const [i, p] of d.probleme.entries()) {
    const pid = antwort.punktIds[i];
    const faden = bild?.bild.faeden.find((f) => f.punktIds.includes(pid)) ?? null;
    const karte = {
      id: `${b.id}-m-${crypto.randomUUID().slice(0, 8)}`,
      fadenId: faden?.id ?? null,
      text: p.text,
      kontext: p.kontext || null,
      bild: null,
      bereich: d.bereich,
      von: p.von,
      an: p.an,
      typ: "aussage" as const,
    };
    await speichereKarte(b.id, karte);
    ergebnisse.push({ text: p.text, kurzname: faden?.kurzname ?? null, resonanz: await resonanzFuer(b.id, karte) });
  }
  const empfaenger = [...new Set(d.probleme.flatMap((p) => [p.von, p.an]).filter((x): x is string => Boolean(x) && x !== d.bereich))];
  return { ergebnisse, empfaenger };
}

/** Beamer-Ansicht: Graph und Zahlen, die live mitwachsen. Nur Zusammengeführtes. */
export async function liveDaten(code: string) {
  const d = await analyseDaten(Code.parse(code), { schnell: true });
  if (!d) return null;
  return {
    betrieb: d.betrieb,
    karte: d.karte,
    stunden: d.summe.stunden,
    euro: d.summe.euro,
    stimmen: d.teilgenommen,
    faeden: d.faeden.slice(0, 4).map((f) => ({ kurzname: f.kurzname, personen: f.personen, stunden: f.stunden })),
    // Überblick in der App: alle gemeldeten Probleme, verständlich – ohne Lösungen.
    alle: [...d.faeden]
      .filter((f) => f.personen > 0)
      .sort((a, b) => b.personen - a.personen || b.stunden - a.stunden)
      .map((f) => {
        const k = d.karte.kanten.filter((x) => x.fadenIds.includes(f.id)).sort((a, b) => b.stimmen - a.stimmen)[0];
        return {
          kurzname: f.kurzname,
          problem: f.problem,
          personen: f.personen,
          uebergabe: k ? (k.von === k.an ? k.von : `${k.von} → ${k.an}`) : null,
        };
      }),
    gut: [...d.lob, ...d.staerken],
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

// ---------- Persönlicher Zugang ----------
/**
 * Code eingeben – ein Feld für alle:
 * Leitungs-Code → Dashboard der Leitung. Team-Code (Betriebscode) → anonyme App; das Gerät bekommt eine eigene
 * Sitzung (nie mit Namen), die es sich merkt, damit eine Person ein Beitrag bleibt. Sitzungs-Code → direkt in die App.
 */
export async function oeffne(
  code: string,
  gemerkt?: string | null,
): Promise<{ pfad: string; team?: string; sitzung?: string } | { fehler: "unbekannt" }> {
  const c = Code.parse(code);
  if (await betriebZuLeitungsCode(c)) return { pfad: `/leitung/${c}` };
  const z = await holeZugang(c);
  if (z) return { pfad: `/ich/${z.code}` };
  const b = await holeBestandsaufnahme(c);
  if (!b) return { fehler: "unbekannt" };
  if (gemerkt) {
    const alt = await holeZugang(gemerkt).catch(() => null);
    if (alt && alt.betriebId === b.id) return { pfad: `/ich/${alt.code}`, team: b.id, sitzung: alt.code };
  }
  const [neu] = await erzeugeZugaenge(b.id, 1);
  return { pfad: `/ich/${neu}`, team: b.id, sitzung: neu };
}

export async function waehleBereich(code: string, bereich: string) {
  const z = await holeZugang(Code.parse(code));
  if (!z) throw new Error("Code unbekannt.");
  const b = await betrieb(z.betriebId);
  if (!b.bereiche.some((x) => x.name === bereich)) throw new Error("Bereich unbekannt.");
  await setzeBereichFuer(z.code, bereich);
}

// ---------- Was gut läuft ----------
/** Positive Meldung: Die KI macht einen anonymen Satz daraus. Gespeichert wird erst nach Freigabe. */
export async function erzaehleGut(eingabe: { code: string; bereich: string; geschichte: string }) {
  const b = await betrieb(eingabe.code);
  const bereich = BereichName.parse(eingabe.bereich);
  const geschichte = z.string().trim().min(3).max(2000).parse(eingabe.geschichte);
  return { text: await lobAusMeldung(b, bereich, geschichte) };
}

export async function gibLobFrei(eingabe: { code: string; bereich: string; text: string }) {
  const b = await betrieb(eingabe.code);
  await speichereKarte(b.id, {
    id: `${b.id}-l-${crypto.randomUUID().slice(0, 8)}`,
    fadenId: null,
    text: z.string().trim().min(3).max(160).parse(eingabe.text),
    kontext: null,
    bild: null,
    bereich: BereichName.parse(eingabe.bereich),
    von: null,
    an: null,
    typ: "lob",
  });
  return { anzahl: (await holeLob(b.id)).length };
}
