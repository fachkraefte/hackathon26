// Feed (Klo-Test): Karten, Gesten, Resonanz.
// Jede Geste schreibt in die vorhandenen Felder: eine Feed-Sitzung ist ein Beitrag, jede bestätigte Karte ein Punkt
// mit Übergabe (von → an), Häufigkeit aus der Geste (kenn ich = mehrmals im Monat, ständig = mehrmals pro Woche) und Minuten = Median der echten Schätzungen im Handlungsfeld.
import { z } from "zod";
import { demoBeitraege, demoGesamtbild, DEMO_ID } from "./daten";
import { holeGesamtbild } from "./gesamtbild";
import { fragJson, kiVerfuegbar } from "./ki/json";
import { fadenZahlen } from "./rechnen";
import { holeBeitraege, istFeedBeitrag, loescheBeitrag, speichereBeitrag } from "./speicher";
import { createSupabaseServerClient, supabaseKonfiguriert } from "./supabase/server";
import { Beitrag, type Bestandsaufnahme, type Haeufigkeit } from "./typen";

export const Richtung = z.enum(["kenn", "staendig", "nicht"]);
export type Richtung = z.infer<typeof Richtung>;

export type Karte = {
  id: string;
  fadenId: string | null;
  text: string;
  bereich: string;
  von: string | null;
  an: string | null;
  typ: "aussage" | "meme";
};

export type FeedKarte =
  | (Karte & { art: "aussage"; kurzname: string | null })
  | { art: "wirkung"; id: string; fadenId: string; loesung: string; satz: string; kurzname: string; stimmen: number; von: string; an: string };

export type Resonanz = { kennen: number; gesamt: number; bereiche: string[]; sichtbar: boolean };

/** Ab so vielen Stimmen zeigt ROKIO Zahlen (Hausordnung Punkt 1). */
export const SCHWELLE = 3;
const MAX_KARTEN = 10;

// ---------- Speicher ----------
const g = globalThis as typeof globalThis & { __rokioFeed?: { karten: Karte[]; reaktionen: ReaktionZeile[] } };
type ReaktionZeile = { sitzung: string; karteId: string; code: string; bereich: string; richtung: Richtung };
const imServer = () => (g.__rokioFeed ??= { karten: demoKarten(), reaktionen: [] });
const db = () => createSupabaseServerClient();

export async function holeKarten(code: string): Promise<Karte[]> {
  if (!supabaseKonfiguriert()) return imServer().karten;
  const { data, error } = await db().from("karten").select("*").eq("bestandsaufnahme_id", code).eq("frei", true);
  if (error) throw new Error(`Karten lesen: ${error.message}`);
  return data.map((k) => ({
    id: k.id,
    fadenId: k.faden_id,
    text: k.text,
    bereich: k.bereich,
    von: k.von,
    an: k.an,
    typ: k.typ === "meme" ? "meme" : "aussage",
  }));
}

export async function speichereKarte(code: string, k: Karte) {
  if (!supabaseKonfiguriert()) {
    imServer().karten.push(k);
    return;
  }
  const { error } = await db().from("karten").insert({
    id: k.id,
    bestandsaufnahme_id: code,
    faden_id: k.fadenId,
    text: k.text,
    bereich: k.bereich,
    von: k.von,
    an: k.an,
    typ: k.typ,
  });
  if (error) throw new Error(`Karte speichern: ${error.message}`);
}

async function holeReaktionen(code: string): Promise<ReaktionZeile[]> {
  if (!supabaseKonfiguriert()) return imServer().reaktionen.filter((r) => r.code === code);
  const { data, error } = await db().from("reaktionen").select("*").eq("bestandsaufnahme_id", code);
  if (error) throw new Error(`Reaktionen lesen: ${error.message}`);
  return data.map((r) => ({
    sitzung: r.sitzung,
    karteId: r.karte_id,
    code: r.bestandsaufnahme_id,
    bereich: r.bereich,
    richtung: Richtung.catch("kenn").parse(r.richtung),
  }));
}

async function speichereReaktion(r: ReaktionZeile) {
  if (!supabaseKonfiguriert()) {
    const s = imServer();
    s.reaktionen = [...s.reaktionen.filter((x) => !(x.sitzung === r.sitzung && x.karteId === r.karteId)), r];
    return;
  }
  const { error } = await db().from("reaktionen").upsert({
    sitzung: r.sitzung,
    karte_id: r.karteId,
    bestandsaufnahme_id: r.code,
    bereich: r.bereich,
    richtung: r.richtung,
  });
  if (error) throw new Error(`Reaktion speichern: ${error.message}`);
}

/** Startkarten der Demo: die Sichtweisen aus dem Gesamtbild – schon anonym und in der Sprache des Betriebs. */
export function demoKarten(): Karte[] {
  return demoGesamtbild.faeden.flatMap((f) =>
    f.sichtweisen.map((s, i) => {
      // Übergabe der Karte: die des passenden Demo-Punkts aus diesem Bereich.
      const punkt = demoBeitraege
        .filter((b) => b.bereich === s.bereich)
        .flatMap((b) => b.punkte)
        .find((p) => f.punktIds.includes(p.id));
      return {
        id: `${DEMO_ID}-${f.id}-${i + 1}`,
        fadenId: f.id,
        text: s.aussage,
        bereich: s.bereich,
        von: punkt?.von ?? null,
        an: punkt?.an ?? null,
        typ: "aussage" as const,
      };
    }),
  );
}

export async function ladeDemoKarten() {
  if (!supabaseKonfiguriert()) {
    g.__rokioFeed = undefined;
    return;
  }
  const { error } = await db()
    .from("karten")
    .insert(demoKarten().map((k) => ({ id: k.id, bestandsaufnahme_id: DEMO_ID, faden_id: k.fadenId, text: k.text, bereich: k.bereich, von: k.von, an: k.an, typ: k.typ })));
  if (error) throw new Error(`Demo-Karten: ${error.message}`);
}

/** Noch keine Beiträge (neuer Betrieb) oder KI gerade nicht erreichbar: Feed läuft trotzdem. */
async function holeGesamtbildSicher(code: string) {
  try {
    const bestandsaufnahme = await holeBeitraegeAnzahl(code);
    if (bestandsaufnahme === 0) return null;
    return await holeGesamtbild(code);
  } catch (e) {
    console.error("Gesamtbild für den Feed:", e);
    return null;
  }
}

async function holeBeitraegeAnzahl(code: string) {
  return (await holeBeitraege(code)).length;
}

// ---------- Feed zusammenstellen ----------
/** Bis zu 10 Karten für eine Person: erst Übergaben, die ihren Bereich berühren, dann der eigene Bereich, dann der Rest. */
export async function stelleFeedZusammen(code: string, bereich: string, beantwortet: string[]): Promise<FeedKarte[]> {
  const [karten, ergebnis] = await Promise.all([holeKarten(code), holeGesamtbildSicher(code)]);
  const kurzname = new Map((ergebnis?.bild.faeden ?? []).map((f) => [f.id, f.kurzname]));
  const schon = new Set(beantwortet);
  const rang = (k: Karte) => {
    const beruehrt = k.von === bereich || k.an === bereich;
    if (k.bereich !== bereich && beruehrt) return 0;
    if (k.bereich === bereich) return 1;
    return 2;
  };
  // Je Handlungsfeld zuerst eine Karte, damit der Feed abwechslungsreich bleibt.
  const offen = karten.filter((k) => !schon.has(k.id)).sort((a, b) => rang(a) - rang(b) || zufall(a.id) - zufall(b.id));
  const gesehen = new Set<string>();
  const erste = offen.filter((k) => (gesehen.has(k.fadenId ?? k.id) ? false : (gesehen.add(k.fadenId ?? k.id), true)));
  const reihe: FeedKarte[] = [...erste, ...offen.filter((k) => !erste.includes(k))]
    .slice(0, MAX_KARTEN)
    .map((k) => ({ ...k, art: "aussage" as const, kurzname: k.fadenId ? (kurzname.get(k.fadenId) ?? null) : null }));

  // „Was daraus wurde“: Lösungen, die die Leitung testet – an dritter Stelle.
  if (!ergebnis) return reihe;
  const wirkung = Object.entries(ergebnis.loesungen)
    .filter(([fid, e]) => e.testet && !schon.has(`wirkung-${fid}`))
    .map(([fid, e]): FeedKarte => {
      const f = ergebnis.bild.faeden.find((x) => x.id === fid);
      const k = karten.find((x) => x.fadenId === fid);
      return {
        art: "wirkung",
        id: `wirkung-${fid}`,
        fadenId: fid,
        loesung: e.loesung.name,
        satz: e.loesung.satz,
        kurzname: f?.kurzname ?? "",
        stimmen: f ? fadenZahlen(f, ergebnis.beitraege, ergebnis.bestandsaufnahme).personen : 0,
        von: k?.von ?? k?.bereich ?? "",
        an: k?.an ?? k?.bereich ?? "",
      };
    });
  if (wirkung.length) reihe.splice(Math.min(2, reihe.length), 0, ...wirkung.slice(0, 1));
  return reihe.slice(0, MAX_KARTEN);
}

/** Stabile Pseudo-Zufallsreihenfolge je Karte (gleiche Karten, gleiche Reihenfolge – kein Speichern nötig). */
function zufall(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h;
}

// ---------- Geste verarbeiten ----------
// Bewusst vorsichtig: ein Daumen soll die Stunden nicht aufblähen. Genauer wird es, wenn jemand selbst erzählt.
const HAEUFIGKEIT: Record<Exclude<Richtung, "nicht">, Haeufigkeit> = { kenn: "mehrmalsImMonat", staendig: "mehrmalsProWoche" };
const BREMST: Record<Exclude<Richtung, "nicht">, number> = { kenn: 3, staendig: 4 };

export async function verarbeiteGeste(
  b: Bestandsaufnahme,
  eingabe: { sitzung: string; bereich: string; karteId: string; richtung: Richtung },
): Promise<Resonanz> {
  const code = b.id;
  const karten = await holeKarten(code);
  const karte = karten.find((k) => k.id === eingabe.karteId);
  if (!karte) throw new Error("Karte unbekannt.");
  await speichereReaktion({ sitzung: eingabe.sitzung, karteId: karte.id, code, bereich: eingabe.bereich, richtung: eingabe.richtung });

  // Den Beitrag dieser Sitzung aus allen ihren Reaktionen neu aufbauen (eine Person = ein Beitrag).
  const [reaktionen, vorher] = await Promise.all([holeReaktionen(code), holeGesamtbildSicher(code)]);
  const echte = (vorher?.beitraege ?? []).filter((x) => !istFeedBeitrag(x.id));
  const median = (fadenId: string | null) => {
    const f = vorher?.bild.faeden.find((x) => x.id === fadenId);
    const werte = echte
      .flatMap((x) => x.punkte)
      .filter((p) => f?.punktIds.includes(p.id) && !p.id.startsWith("feed-") && p.minuten > 0)
      .map((p) => p.minuten)
      .sort((x, y) => x - y);
    return werte.length ? werte[Math.floor(werte.length / 2)] : 15;
  };
  const beitragId = `feed-${eingabe.sitzung}`;
  const kurz = new Map((vorher?.bild.faeden ?? []).map((f) => [f.id, f.kurzname]));
  const punkte = reaktionen
    .filter((r) => r.sitzung === eingabe.sitzung && r.richtung !== "nicht")
    .flatMap((r) => {
      const k = karten.find((x) => x.id === r.karteId);
      if (!k || r.richtung === "nicht") return [];
      // Startkarte ohne Handlungsfeld: Punkt bleibt „offen“, die KI ordnet ihn wie eine Erzählung zu.
      const name = (k.fadenId && kurz.get(k.fadenId)) || k.text.slice(0, 60);
      return [{
        id: `${beitragId}~${k.fadenId ?? ""}~${k.id}`,
        zeitfresser: name,
        titel: name,
        aussage: k.text,
        haeufigkeit: HAEUFIGKEIT[r.richtung],
        minuten: median(k.fadenId),
        beteiligt: [],
        bremst: BREMST[r.richtung],
        von: k.von ?? k.bereich,
        an: k.an ?? k.bereich,
      }];
    })
    .slice(0, 12);
  if (punkte.length) {
    await speichereBeitrag(
      Beitrag.parse({
        id: beitragId,
        bestandsaufnahmeId: code,
        bereich: eingabe.bereich,
        istLeitung: eingabe.bereich === "Leitung",
        rolleZeigen: false,
        punkte,
        mitsprache: null,
        fiktiv: false,
      }),
    );
  } else {
    await loescheBeitrag(code, beitragId);
  }
  return resonanzFuer(code, karte, reaktionen);
}

/** „7 von 11 kennen das“: Personen im Handlungsfeld gegen alle, die die Karten dazu beantwortet haben. */
export async function resonanzFuer(code: string, karte: Karte, reaktionen?: ReaktionZeile[]): Promise<Resonanz> {
  const [ergebnis, alle, karten] = await Promise.all([holeGesamtbildSicher(code), reaktionen ?? holeReaktionen(code), holeKarten(code)]);
  const f =
    ergebnis?.bild.faeden.find((x) => x.id === karte.fadenId) ??
    ergebnis?.bild.faeden.find((x) => x.punktIds.some((pid) => pid.endsWith(`~${karte.id}`)));
  if (!ergebnis || !f) return { kennen: 0, gesamt: 0, bereiche: [], sichtbar: false };
  const fadenKarten = new Set(karten.filter((k) => k.fadenId === f.id || k.id === karte.id).map((k) => k.id));
  const nein = new Set(alle.filter((r) => r.richtung === "nicht" && fadenKarten.has(r.karteId)).map((r) => r.sitzung));
  const ids = new Set(f.punktIds);
  const dabei = ergebnis.beitraege.filter((x) => x.punkte.some((p) => ids.has(p.id)));
  // Wer „nicht bei uns“ gesagt und an anderer Stelle bestätigt hat, zählt nur als Bestätigung.
  for (const x of dabei) nein.delete(x.id.replace(/^feed-/, ""));
  const kennen = dabei.length;
  return {
    kennen,
    gesamt: kennen + nein.size,
    bereiche: [...new Set(dabei.map((x) => x.bereich))],
    sichtbar: kennen >= SCHWELLE,
  };
}

// ---------- Einer erzählt: Meldung → anonyme Karte ----------
const KarteText = z.object({ text: z.string().min(3).max(140) });

export async function karteAusGeschichte(b: Bestandsaufnahme, bereich: string, geschichte: string): Promise<string | null> {
  if (!kiVerfuegbar()) return null;
  try {
    const { text } = await fragJson(
      KarteText,
      [
        {
          role: "system",
          content:
            `Du machst aus einer Meldung eine Karte, die andere Beschäftigte von ${b.betrieb.name} (${b.betrieb.branche}) bestätigen können.\n` +
            "Regeln: ein Satz in Ich- oder Wir-Form, höchstens 14 Wörter, Alltagssprache des Betriebs, keine Metaphern.\n" +
            "Keine Namen, keine Uhrzeiten, keine Daten, keine Details, an denen man eine Person erkennt. Keine Schuldzuweisung an Personen.\n" +
            "Beschreibe den Zustand, den andere wiedererkennen. Antworte auf Deutsch, auch wenn die Meldung in einer anderen Sprache ist.\n" +
            'Antwort als JSON: {"text": "…"}',
        },
        { role: "user", content: `Bereich: ${bereich}\nMeldung: ${geschichte}` },
      ],
      { reasoningEffort: "low" },
    );
    return text.replace(/^[„"]|[“"]$/g, "");
  } catch {
    return null;
  }
}

// ---------- Startkarten für einen neuen Betrieb ----------
const StartKarten = z.object({
  karten: z
    .array(z.object({ text: z.string().min(3).max(140), bereich: z.string(), von: z.string().nullable(), an: z.string().nullable() }))
    .min(3)
    .max(12),
});

/** Die KI schreibt aus Branche, Bereichen, Aufgaben und Website typische Zustände als Karten – zum Bestätigen oder Verwerfen. */
export async function erzeugeStartKarten(b: Bestandsaufnahme, websiteText: string | null) {
  if (!kiVerfuegbar()) return;
  const namen = b.bereiche.map((x) => x.name);
  const aufgaben = Object.entries(b.profil?.chips ?? {})
    .map(([bereich, chips]) => `${bereich}: ${chips.join(", ")}`)
    .join("\n");
  const { karten } = await fragJson(
    StartKarten,
    [
      {
        role: "system",
        content:
          "Du schreibst Startkarten für einen Feed, in dem Beschäftigte Aussagen über ihren Arbeitsalltag bestätigen (kenn ich) oder verwerfen (nicht bei uns).\n" +
          "Jede Karte beschreibt einen typischen Zeitverlust an einer Übergabe zwischen zwei Bereichen oder innerhalb eines Bereichs – als Zustand, nie als Vorwurf an Personen.\n" +
          "Regeln: ein Satz in Ich- oder Wir-Form aus Sicht des Bereichs, höchstens 14 Wörter, Alltagssprache der Branche, keine Metaphern, keine Namen, keine Zahlen, die du nicht kennst.\n" +
          `Bereiche (nur diese Namen verwenden): ${namen.join(", ")}. Externe: ${(b.profil?.extern ?? []).join(", ") || "keine"}.\n` +
          "von/an: woher kommt das, was fehlt, und wohin geht es weiter – Bereich oder Externer aus der Liste; null = innerhalb des eigenen Bereichs.\n" +
          "Schreibe 2 Karten je Bereich, höchstens 12, verteilt auf verschiedene Übergaben.\n" +
          'Antwort als JSON: {"karten": [{"text": "…", "bereich": "…", "von": "…"|null, "an": "…"|null}]}',
      },
      {
        role: "user",
        content:
          `Betrieb: ${b.betrieb.name}, ${b.betrieb.branche}, ${b.betrieb.mitarbeitende} Beschäftigte.\nLeistungen: ${b.betrieb.leistungen}\n` +
          `Ziel der Leitung: ${b.ziel}\nAufgaben je Bereich:\n${aufgaben}` +
          (websiteText ? `\nAuszug Website:\n${websiteText.slice(0, 1500)}` : ""),
      },
    ],
    { reasoningEffort: "low", timeoutMs: 60_000 },
  );
  const ziele = new Set([...namen, ...(b.profil?.extern ?? [])]);
  const gueltig = (x: string | null) => (x && ziele.has(x) ? x : null);
  for (const [i, k] of karten.entries()) {
    if (!namen.includes(k.bereich)) continue;
    await speichereKarte(b.id, {
      id: `${b.id}-s${i + 1}`,
      fadenId: null,
      text: k.text.replace(/^[„"]|[“"]$/g, ""),
      bereich: k.bereich,
      von: gueltig(k.von),
      an: gueltig(k.an),
      typ: "aussage",
    });
  }
}
