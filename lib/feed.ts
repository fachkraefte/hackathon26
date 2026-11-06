// Feed (Klo-Test): Karten, Gesten, Resonanz.
// Jede Geste schreibt in die vorhandenen Felder: eine Feed-Sitzung ist ein Beitrag, jede bestätigte Karte ein Punkt
// mit Übergabe (von → an) und der typischen Schätzung im Handlungsfeld (ständig = eine Häufigkeitsstufe höher) und Minuten = Median der echten Schätzungen im Handlungsfeld.
import { z } from "zod";
import demoKartenJson from "@/daten/demo/heidekamp/karten.json";
import demoKartenEnJson from "@/daten/demo/heidekamp-en/karten.json";
import { DEMOS, type Demo } from "./daten";
import { holeGesamtbildSchnell } from "./gesamtbild";
import { fragJson, kiVerfuegbar } from "./ki/json";
import { mitSprache, sprachAnweisung } from "./ki/prompts";
import { fadenZahlen, stundenProWoche } from "./rechnen";
import { holeBeitraege, istFeedBeitrag, loescheBeitrag, personVon, speichereBeitrag } from "./speicher";
import { createSupabaseServerClient, supabaseKonfiguriert } from "./supabase/server";
import { Beitrag, haeufigkeiten, type Bestandsaufnahme, type Haeufigkeit } from "./typen";

export const Richtung = z.enum(["kenn", "staendig", "nicht"]);
export type Richtung = z.infer<typeof Richtung>;

export type Karte = {
  id: string;
  fadenId: string | null;
  text: string; // ein konkretes Problem, für alle Bereiche verständlich
  kontext: string | null; // eine Zeile: Situation oder Folge
  bereich: string;
  von: string | null;
  an: string | null;
  typ: "aussage" | "meme" | "lob";
  bild: string | null; // Hintergrundbild (Demo-Karten, Memes); eigene Meldungen ohne Bild
};

export type FeedKarte =
  | (Karte & { art: "aussage"; kurzname: string | null })
  | (Karte & { art: "meme"; kurzname: string | null })
  | { art: "wirkung"; id: string; fadenId: string; loesung: string; satz: string; kurzname: string; stimmen: number; von: string; an: string };

export type Resonanz = { kennen: number; gesamt: number; bereiche: string[]; sichtbar: boolean };

/** Ab so vielen Stimmen zeigt ROKIO Zahlen (Hausordnung Punkt 1). */
export const SCHWELLE = 3;
const MAX_KARTEN = 5; // nicht überfordern: 5 Karten, dann ein klares Ende

// ---------- Speicher ----------
const g = globalThis as typeof globalThis & { __rokioFeed?: { karten: Karte[]; reaktionen: ReaktionZeile[] } };
type ReaktionZeile = { sitzung: string; karteId: string; code: string; bereich: string; richtung: Richtung };
const imServer = () => (g.__rokioFeed ??= { karten: DEMOS.flatMap((d) => demoKarten(d)), reaktionen: [] });
const db = () => createSupabaseServerClient();

const holeAlleKarten = (code: string) => holeKarten(code);

export async function holeKarten(code: string): Promise<Karte[]> {
  if (!supabaseKonfiguriert()) return imServer().karten;
  const { data, error } = await db().from("karten").select("*").eq("bestandsaufnahme_id", code).eq("frei", true);
  if (error) throw new Error(`Karten lesen: ${error.message}`);
  return data.map((k) => ({
    id: k.id,
    fadenId: k.faden_id,
    text: k.text,
    kontext: k.kontext,
    bereich: k.bereich,
    von: k.von,
    an: k.an,
    typ: k.typ === "meme" ? "meme" : k.typ === "lob" ? "lob" : "aussage",
    bild: k.bild,
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
    kontext: k.kontext,
    bereich: k.bereich,
    von: k.von,
    an: k.an,
    typ: k.typ,
    bild: k.bild,
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

/** Startkarten einer Demo: die Sichtweisen aus dem Gesamtbild – schon anonym und in der Sprache des Betriebs. */
export function demoKarten(demo: Demo = DEMOS[0]): Karte[] {
  const id = demo.bestandsaufnahme.id;
  const json = (demo.sprache === "en" ? demoKartenEnJson : demoKartenJson) as unknown as Record<string, { text: string; kontext: string; bild?: string }[]> & {
    memes: { fadenId: string; text: string; bild: string }[];
  };
  const karten = demo.gesamtbild.faeden.flatMap((f): Karte[] =>
    f.sichtweisen.map((s, i) => {
      // Übergabe der Karte: die des passenden Demo-Punkts aus diesem Bereich.
      const punkt = demo.beitraege
        .filter((b) => b.bereich === s.bereich)
        .flatMap((b) => b.punkte)
        .find((p) => f.punktIds.includes(p.id));
      const neu = json[f.id]?.[i];
      return {
        id: `${id}-${f.id}-${i + 1}`,
        fadenId: f.id,
        text: neu?.text ?? s.aussage,
        kontext: neu?.kontext ?? null,
        bereich: s.bereich,
        von: punkt?.von ?? null,
        an: punkt?.an ?? null,
        typ: "aussage" as const,
        bild: neu?.bild ?? null,
      };
    }),
  );
  // Memes: eigene Bilder, Witz über Zustände – nie über Personen oder Bereiche.
  const memes = json.memes.map((m, i): Karte => ({
    id: `${id}-meme-${i + 1}`,
    fadenId: m.fadenId,
    text: m.text,
    kontext: null,
    bereich: demo.gesamtbild.faeden.find((f) => f.id === m.fadenId)?.sichtweisen[0]?.bereich ?? demo.bestandsaufnahme.bereiche[0].name,
    von: null,
    an: null,
    typ: "meme",
    bild: m.bild,
  }));
  return [...karten, ...memes];
}

export async function ladeDemoKarten() {
  if (!supabaseKonfiguriert()) {
    g.__rokioFeed = undefined;
    return;
  }
  for (const demo of DEMOS) {
    const { error } = await db()
      .from("karten")
      .insert(demoKarten(demo).map((k) => ({ id: k.id, bestandsaufnahme_id: demo.bestandsaufnahme.id, faden_id: k.fadenId, text: k.text, kontext: k.kontext, bereich: k.bereich, von: k.von, an: k.an, typ: k.typ, bild: k.bild })));
    if (error) throw new Error(`Demo-Karten: ${error.message}`);
  }
}

/** Noch keine Beiträge (neuer Betrieb) oder KI gerade nicht erreichbar: Feed läuft trotzdem. */
async function holeGesamtbildSicher(code: string) {
  try {
    const anzahl = await holeBeitraegeAnzahl(code);
    if (anzahl === 0) return null;
    // Schnell: gespeichertes Bild + Feed-Stimmen. Die KI-Zuordnung neuer Meldungen läuft beim Melden und im Befund.
    return await holeGesamtbildSchnell(code);
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
export async function stelleFeedZusammen(code: string, bereich: string, beantwortet: string[], max = MAX_KARTEN): Promise<FeedKarte[]> {
  const [alle, ergebnis] = await Promise.all([holeKarten(code), holeGesamtbildSicher(code)]);
  const karten = alle.filter((k) => k.typ === "aussage");
  const memes = alle.filter((k) => k.typ === "meme" && !beantwortet.includes(k.id));
  const kurzname = new Map((ergebnis?.bild.faeden ?? []).map((f) => [f.id, f.kurzname]));
  const schon = new Set(beantwortet);
  const rang = (k: Karte) => {
    const beruehrt = k.von === bereich || k.an === bereich;
    if (k.bereich !== bereich && beruehrt) return 0;
    if (k.bereich === bereich) return 1;
    return 2;
  };
  // Je Handlungsfeld zuerst eine Karte, damit der Feed abwechslungsreich bleibt.
  const offen = karten
    .filter((k) => !schon.has(k.id))
    .sort((a, b) => rang(a) - rang(b) || Number(Boolean(b.bild)) - Number(Boolean(a.bild)) || zufall(a.id) - zufall(b.id));
  const gesehen = new Set<string>();
  const erste = offen.filter((k) => (gesehen.has(k.fadenId ?? k.id) ? false : (gesehen.add(k.fadenId ?? k.id), true)));
  const reihe: FeedKarte[] = [...erste, ...offen.filter((k) => !erste.includes(k))]
    .slice(0, max)
    .map((k) => ({ ...k, art: "aussage" as const, kurzname: k.fadenId ? (kurzname.get(k.fadenId) ?? null) : null }));
  // 1–2 Memes pro Runde: an dritter und fünfter Stelle, für ein bisschen Unterhaltung.
  const memeKarten = [...memes].sort((a, b) => zufall(a.id + bereich) - zufall(b.id + bereich));
  for (const [i, m] of memeKarten.slice(0, 2).entries()) {
    reihe.splice(Math.min(2 + i * 2, reihe.length), 0, { ...m, art: "meme", kurzname: m.fadenId ? (kurzname.get(m.fadenId) ?? null) : null });
  }

  // „Was daraus wurde“: Lösungen, die die Leitung testet – an dritter Stelle.
  if (!ergebnis) return reihe;
  const wirkung = Object.entries(ergebnis.loesungen)
    .filter(([fid, e]) => e.testet && !schon.has(`wirkung-${fid}`))
    .map(([fid, e]): FeedKarte => {
      const f = ergebnis.bild.faeden.find((x) => x.id === fid);
      // Die stärkste Übergabe des Handlungsfelds: das häufigste von → an unter seinen Karten.
      const paare = karten
        .filter((x) => x.fadenId === fid)
        .map((x) => ({ von: x.von ?? x.bereich, an: x.an ?? x.bereich }))
        .filter((x) => x.von !== x.an);
      const zaehle = (x: { von: string; an: string }) => paare.filter((y) => y.von === x.von && y.an === x.an).length;
      const k = [...paare].sort((x, y) => zaehle(y) - zaehle(x))[0];
      return {
        art: "wirkung",
        id: `wirkung-${fid}`,
        fadenId: fid,
        loesung: e.loesung.name,
        satz: e.loesung.satz,
        kurzname: f?.kurzname ?? "",
        stimmen: f ? fadenZahlen(f, ergebnis.beitraege, ergebnis.bestandsaufnahme).personen : 0,
        von: k?.von ?? "",
        an: k?.an ?? "",
      };
    });
  if (wirkung.length) reihe.splice(Math.min(1, reihe.length), 0, ...wirkung.slice(0, 1));
  return reihe.slice(0, max);
}

/** Stabile Pseudo-Zufallsreihenfolge je Karte (gleiche Karten, gleiche Reihenfolge – kein Speichern nötig). */
function zufall(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h;
}

// ---------- Geste verarbeiten ----------
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
  // Wert einer Bestätigung: die typische Schätzung (Häufigkeit UND Minuten) im Handlungsfeld – bevorzugt aus dem
  // eigenen Bereich, sonst der untere Median nach Stunden. „Ständig“ = eine Häufigkeitsstufe höher. So ergibt ein Daumen
  // nie mehr Zeit, als Kolleginnen und Kollegen selbst geschätzt haben. Ohne Zeitangabe im Feld (z. B. Belastung): 0.
  const typisch = (fadenId: string | null): { haeufigkeit: Haeufigkeit; minuten: number } => {
    const f = vorher?.bild.faeden.find((x) => x.id === fadenId);
    if (!f) return { haeufigkeit: "mehrmalsImMonat", minuten: 15 }; // Startkarte ohne Handlungsfeld: vorsichtig
    const schaetzungen = echte.flatMap((x) =>
      x.punkte
        .filter((p) => f.punktIds.includes(p.id) && !p.id.startsWith("feed-") && p.minuten > 0)
        .map((p) => ({ bereich: x.bereich, haeufigkeit: p.haeufigkeit, minuten: p.minuten, h: stundenProWoche(p) })),
    );
    const eigene = schaetzungen.filter((s) => s.bereich === eingabe.bereich);
    const liste = (eigene.length ? eigene : schaetzungen).sort((a, b) => a.h - b.h);
    const m = liste[Math.floor((liste.length - 1) / 2)];
    return m ? { haeufigkeit: m.haeufigkeit, minuten: m.minuten } : { haeufigkeit: "mehrmalsImMonat", minuten: 0 };
  };
  const hoeher = (h: Haeufigkeit): Haeufigkeit => haeufigkeiten[Math.min(haeufigkeiten.indexOf(h) + 1, haeufigkeiten.length - 1)];
  const beitragId = `feed-${eingabe.sitzung}`;
  const kurz = new Map((vorher?.bild.faeden ?? []).map((f) => [f.id, f.kurzname]));
  // Pro Person und Handlungsfeld genau eine Stimme (Karte und Meme zum selben Problem zählen nicht doppelt);
  // es gilt die stärkere Geste. Startkarten ohne Handlungsfeld zählen einzeln.
  const eigene = reaktionen.filter((r) => r.sitzung === eingabe.sitzung && r.richtung !== "nicht");
  const jeFeld = new Map<string, ReaktionZeile>();
  for (const r of eigene) {
    const k = karten.find((x) => x.id === r.karteId);
    const schluessel = k?.fadenId ?? r.karteId;
    const bisher = jeFeld.get(schluessel);
    if (!bisher || (bisher.richtung === "kenn" && r.richtung === "staendig")) jeFeld.set(schluessel, r);
  }
  const punkte = [...jeFeld.values()]
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
        haeufigkeit: r.richtung === "staendig" ? hoeher(typisch(k.fadenId).haeufigkeit) : typisch(k.fadenId).haeufigkeit,
        minuten: typisch(k.fadenId).minuten,
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
  // Wer „kenn ich nicht“ gesagt und an anderer Stelle bestätigt hat, zählt nur als Bestätigung.
  for (const x of dabei) nein.delete(personVon(x.id).replace(/^feed-/, ""));
  const kennen = new Set(dabei.map((x) => personVon(x.id))).size;
  return {
    kennen,
    gesamt: kennen + nein.size,
    bereiche: [...new Set(dabei.map((x) => x.bereich))],
    sichtbar: kennen >= SCHWELLE,
  };
}

// ---------- Einer erzählt: Meldung → einzelne Probleme → anonyme Karten ----------
/** Gilt für alle Karten: konkret, für andere Bereiche verständlich, ein Problem pro Karte. */
export const KARTEN_REGELN =
  "Regeln für jede Karte:\n" +
  "- text: EIN konkretes Problem als sachlicher Satz, höchstens 14 Wörter. So formuliert, dass auch Beschäftigte aus anderen Bereichen verstehen, was passiert – nicht nur die Person, die es erlebt hat. " +
  "Also: was fehlt oder schiefgeht, an welcher Stelle im Ablauf. Nicht: ein Gefühl oder eine Beschwerde ohne Sache.\n" +
  "- kontext: eine kurze Zeile mit Situation oder Folge (z. B. „Folge: zurückfahren, der halbe Vormittag ist weg.“), höchstens 12 Wörter.\n" +
  "- Abstrahiere nur so weit, dass es für alle zugänglich wird – das eigentliche Problem muss erhalten bleiben.\n" +
  "- Keine Namen, keine Uhrzeiten, keine Details, an denen man eine Person erkennt, keine Schuld an Personen, keine Metaphern.\n";

const Probleme = z.object({
  probleme: z
    .array(
      z.object({
        text: z.string().min(3).max(200),
        kontext: z.string().max(200).catch(""),
        titel: z.string().max(80).catch("Meldung"),
        // Tolerant: Unklare Angaben werden null, dann fragt die App mit Chips nach – die Meldung geht nie verloren.
        haeufigkeit: z.enum(["monatlich", "mehrmalsImMonat", "woechentlich", "mehrmalsProWoche", "taeglich", "mehrmalsTaeglich"]).nullable().catch(null),
        minuten: z.number().int().min(1).max(480).nullable().catch(null),
        von: z.string().nullable().catch(null),
        an: z.string().nullable().catch(null),
      }),
    )
    .min(1)
    .max(3),
  spiegelung: z.string().max(400).catch(""),
});
export type Problem = z.infer<typeof Probleme>["probleme"][number];

/** Zerlegt eine Meldung in einzelne Probleme (z. B. „Lager leer“ und „Laufwege“ getrennt) – je Problem eine Karte. */
export async function zerlegeMeldung(b: Bestandsaufnahme, bereich: string, geschichte: string) {
  if (!kiVerfuegbar()) return null;
  const ziele = [...b.bereiche.map((x) => x.name), ...(b.profil?.extern ?? [])];
  try {
    const d = await fragJson(
      Probleme,
      mitSprache(b, [
        {
          role: "system",
          content:
            `Du hörst einer beschäftigten Person aus dem Bereich ${bereich} von ${b.betrieb.name} (${b.betrieb.branche}) zu.\n` +
            "Zerlege die Meldung in ihre EINZELNEN Probleme (1 bis 3). Zwei verschiedene Ursachen sind zwei Probleme – fasse sie NIE zu einem allgemeinen Zeitfresser zusammen. " +
            "Signalwörter wie „außerdem“, „und dann noch“, „dazu kommt“ trennen fast immer zwei Probleme. " +
            "Beispiel Wäscherei: „Im Lager ist keine Wäsche, sie muss erst nachgeholt werden, und beim Wechsel laufe ich unnötig hin und her“ sind ZWEI Probleme: Lagerbestand und Laufwege.\n" +
            KARTEN_REGELN +
            `- von/an: woher kommt das, was fehlt, und wohin geht es weiter. Nur diese Namen: ${ziele.join(", ")}. null = im eigenen Bereich.\n` +
            "- titel: 2–4 Wörter.\n" +
            "- haeufigkeit: genau einer dieser Werte oder null: monatlich, mehrmalsImMonat, woechentlich, mehrmalsProWoche, taeglich, mehrmalsTaeglich. „oft“ oder „ständig“ ohne klare Angabe = null.\n" +
            "- minuten (eigene Zeit pro Vorfall, ganze Zahl) nur, wenn die Person sie nennt oder sie eindeutig ist, sonst null.\n" +
            "- spiegelung: ein Satz an die Person, der zeigt, dass du sie verstanden hast (du-Form, sachlich).\n" +
            (b.sprache === "en"
              ? "Answer in English, even if the report is in another language. Answer as JSON following the schema."
              : "Antworte auf Deutsch, auch wenn die Meldung in einer anderen Sprache ist. Antwort als JSON nach dem Schema.") +
            sprachAnweisung(b),
        },
        { role: "user", content: geschichte },
      ]),
      { reasoningEffort: "low" },
    );
    const gueltig = (x: string | null) => (x && ziele.includes(x) && x !== bereich ? x : null);
    return {
      spiegelung: d.spiegelung,
      probleme: d.probleme.map((p) => ({ ...p, text: p.text.replace(/^[„"]|[“"]$/g, ""), von: gueltig(p.von), an: gueltig(p.an) })),
    };
  } catch (e) {
    console.error("Meldung zerlegen:", e);
    return null;
  }
}

// ---------- Startkarten für einen neuen Betrieb ----------
const StartKarten = z.object({
  karten: z
    .array(z.object({ text: z.string().min(3).max(140), kontext: z.string().max(120), bereich: z.string(), von: z.string().nullable(), an: z.string().nullable() }))
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
    mitSprache(b, [
      {
        role: "system",
        content:
          "Du schreibst Startkarten für einen Feed, in dem Beschäftigte Aussagen über ihren Arbeitsalltag bestätigen (kenn ich) oder verwerfen (nicht bei uns).\n" +
          "Jede Karte beschreibt einen typischen Zeitverlust an einer Übergabe zwischen zwei Bereichen oder innerhalb eines Bereichs – als Zustand, nie als Vorwurf an Personen.\n" +
          KARTEN_REGELN +
          `Bereiche (nur diese Namen verwenden): ${namen.join(", ")}. Externe: ${(b.profil?.extern ?? []).join(", ") || "keine"}.\n` +
          "von/an: woher kommt das, was fehlt, und wohin geht es weiter – Bereich oder Externer aus der Liste; null = innerhalb des eigenen Bereichs.\n" +
          "Schreibe 2 Karten je Bereich, höchstens 12, verteilt auf verschiedene Übergaben.\n" +
          'Antwort als JSON: {"karten": [{"text": "…", "kontext": "…", "bereich": "…", "von": "…"|null, "an": "…"|null}]}' +
          sprachAnweisung(b),
      },
      {
        role: "user",
        content:
          `Betrieb: ${b.betrieb.name}, ${b.betrieb.branche}, ${b.betrieb.mitarbeitende} Beschäftigte.\nLeistungen: ${b.betrieb.leistungen}\n` +
          `Ziel der Leitung: ${b.ziel}\nAufgaben je Bereich:\n${aufgaben}` +
          (websiteText ? `\nAuszug Website:\n${websiteText.slice(0, 1500)}` : ""),
      },
    ]),
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
      kontext: k.kontext || null,
      bild: null,
      bereich: k.bereich,
      von: gueltig(k.von),
      an: gueltig(k.an),
      typ: "aussage",
    });
  }
}

// ---------- Was gut läuft: positive Meldungen ----------
const LobText = z.object({ text: z.string().min(3).max(140) });

/** Positive Meldung → ein anonymer Satz „Was gut läuft“ (Typ lob). Zählt nicht als Problem. */
export async function lobAusMeldung(b: Bestandsaufnahme, bereich: string, geschichte: string): Promise<string> {
  if (!kiVerfuegbar()) return geschichte.slice(0, 140);
  try {
    const { text } = await fragJson(
      LobText,
      mitSprache(b, [
        {
          role: "system",
          content:
            `Eine beschäftigte Person aus dem Bereich ${bereich} von ${b.betrieb.name} nennt etwas, das gut läuft.\n` +
            "Mach daraus EINEN sachlichen Satz, höchstens 14 Wörter, der für alle Bereiche verständlich ist: was läuft gut, wo. " +
            "Keine Namen, keine Details, an denen man Personen erkennt, keine Metaphern. " +
            (b.sprache === "en" ? "In English." : "Auf Deutsch.") +
            sprachAnweisung(b) +
            "\n" +
            'Antwort als JSON: {"text": "…"}',
        },
        { role: "user", content: geschichte },
      ]),
      { reasoningEffort: "low" },
    );
    return text.replace(/^[„"]|[“"]$/g, "");
  } catch {
    return geschichte.slice(0, 140);
  }
}

export async function holeLob(code: string): Promise<string[]> {
  return (await holeAlleKarten(code)).filter((k) => k.typ === "lob").map((k) => k.text);
}
