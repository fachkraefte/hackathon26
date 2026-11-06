// Speicherung der Laufzeitdaten.
// Mit SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY: Supabase (Tabellen aus supabase/migrations/).
// Ohne: Speicher im Server (nur lokal/Demo; auf Vercel nicht zwischen Instanzen geteilt).
// Gelesene Zeilen werden mit zod geprüft, bevor die App sie nutzt.
import { z } from "zod";
import { demoBeitraege, demoBestandsaufnahme, demoGesamtbild, demoLoesungen, DEMO_ID } from "./daten";
import { createSupabaseServerClient, supabaseKonfiguriert, type Json } from "./supabase/server";
import { Beitrag, Bereich, Bestandsaufnahme, Gesamtbild, LoesungEintrag, Profil, Punkt } from "./typen";

export type GesamtbildEintrag = {
  schluessel: string;
  bild: Gesamtbild;
  ausDemo: boolean;
  /** Lösung je Faden-ID (KONZEPT_V3 §6), im Hintergrund berechnet. */
  loesungen: Record<string, LoesungEintrag>;
};

/** Fingerabdruck der Beiträge: ändert er sich, muss das Gesamtbild neu entstehen. */
/** Beiträge aus dem Feed: ID „feed-<sitzung>“, Punkt-ID „feed-<sitzung>~<fadenId>“. */
export const istFeedBeitrag = (id: string) => id.startsWith("feed-");
export const fadenAusFeedPunkt = (punktId: string) => (punktId.startsWith("feed-") ? punktId.split("~")[1] ?? null : null);

export function schluesselFuer(beitraege: Beitrag[]) {
  // Feed-Stimmen hängen fest an ihrem Handlungsfeld (lib/feed.ts) und lösen kein neues Zusammenführen aus.
  return beitraege
    .filter((b) => !istFeedBeitrag(b.id))
    .flatMap((b) => b.punkte.map((p) => `${b.id}:${p.id}:${p.titel}:${p.aussage}`))
    .sort()
    .join("|");
}

/** Laufende Zusammenführungen – bewusst nur im Speicher dieser Server-Instanz. */
const g = globalThis as typeof globalThis & {
  __rowaiLaufend?: Map<string, Promise<GesamtbildEintrag>>;
  __rowaiSpeicher?: SpeicherImServer;
  __rowaiDemoGeladen?: Promise<void>;
};
export const laufend: Map<string, Promise<GesamtbildEintrag>> = (g.__rowaiLaufend ??= new Map());

function fehler(wo: string, e: { message: string } | null) {
  if (e) throw new Error(`Supabase (${wo}): ${e.message}`, { cause: e });
}

// ---------------------------------------------------------------------------
// Speicher im Server (Rückfall ohne Supabase)
// ---------------------------------------------------------------------------
type SpeicherImServer = {
  bestandsaufnahmen: Map<string, Bestandsaufnahme>;
  beitraege: Map<string, Beitrag[]>;
  gesamtbilder: Map<string, GesamtbildEintrag>;
};

function startdaten(): SpeicherImServer {
  return {
    bestandsaufnahmen: new Map([[DEMO_ID, structuredClone(demoBestandsaufnahme)]]),
    beitraege: new Map([[DEMO_ID, structuredClone(demoBeitraege)]]),
    gesamtbilder: new Map([[DEMO_ID, demoEintrag()]]),
  };
}

function demoEintrag(): GesamtbildEintrag {
  return {
    schluessel: schluesselFuer(demoBeitraege),
    bild: structuredClone(demoGesamtbild),
    ausDemo: false,
    loesungen: structuredClone(demoLoesungen),
  };
}

const imServer = () => (g.__rowaiSpeicher ??= startdaten());

// ---------------------------------------------------------------------------
// Supabase: Zeilen ↔ Datenformate
// ---------------------------------------------------------------------------
const db = () => createSupabaseServerClient();

// Spalten aus v2 (stundensatz, zeitfresser, frage …) füllt v3 weiter, damit die alte Version lesbar bleibt.
const BestandsaufnahmeZeile = z.object({
  id: z.string(),
  betrieb_name: z.string(),
  branche: z.string(),
  mitarbeitende: z.number(),
  leistungen: z.string(),
  website: z.string().nullable(),
  fiktiv: z.boolean(),
  anrede: z.string(),
  frage: z.string(),
  stundensatz: z.coerce.number(),
  arbeitswochen: z.number(),
  bereiche: z.array(z.string()),
  bereich_saetze: z.array(Bereich).nullable(),
  mindestanzahl: z.number(),
  besprechung_am: z.string().nullable(),
  deadline: z.string().nullable(),
  profil: Profil.nullable(),
});

function ausZeile(zeile: unknown): Bestandsaufnahme {
  const r = BestandsaufnahmeZeile.parse(zeile);
  return Bestandsaufnahme.parse({
    id: r.id,
    betrieb: {
      name: r.betrieb_name,
      branche: r.branche,
      mitarbeitende: r.mitarbeitende,
      leistungen: r.leistungen,
      website: r.website,
      fiktiv: r.fiktiv,
    },
    anrede: r.anrede,
    ziel: r.frage,
    deadline: r.deadline ?? r.besprechung_am ?? "",
    // Zeilen aus v2 haben nur einen Stundensatz für alle Bereiche.
    bereiche: r.bereich_saetze ?? r.bereiche.map((name) => ({ name, satzVon: r.stundensatz, satzBis: r.stundensatz })),
    arbeitswochen: r.arbeitswochen,
    mindestanzahl: r.mindestanzahl,
    profil: r.profil,
  });
}

function inZeile(b: Bestandsaufnahme) {
  const mitten = b.bereiche.map((x) => (x.satzVon + x.satzBis) / 2);
  return {
    id: b.id,
    betrieb_name: b.betrieb.name,
    branche: b.betrieb.branche,
    mitarbeitende: b.betrieb.mitarbeitende,
    leistungen: b.betrieb.leistungen,
    website: b.betrieb.website,
    fiktiv: b.betrieb.fiktiv,
    leitung_vorname: "",
    leitung_rolle: "Leitung",
    anrede: b.anrede,
    frage: b.ziel,
    ziel: b.ziel,
    stundensatz: Math.round((mitten.reduce((a, x) => a + x, 0) / mitten.length) * 100) / 100,
    arbeitswochen: b.arbeitswochen,
    bereiche: b.bereiche.map((x) => x.name),
    bereich_saetze: b.bereiche as Json,
    mindestanzahl: b.mindestanzahl,
    zeitfresser: Object.values(b.profil?.chips ?? {}).flat(),
    deadline: b.deadline,
    profil: (b.profil ?? null) as Json,
  };
}

const BeitragZeile = z.object({
  id: z.string(),
  bestandsaufnahme_id: z.string(),
  bereich: z.string(),
  ist_leitung: z.boolean(),
  rolle_zeigen: z.boolean(),
  punkte: z.array(Punkt),
  mitsprache: z.number().nullable(),
  gut_laeuft: z.string().nullable(),
  fiktiv: z.boolean(),
});

function beitragAusZeile(zeile: unknown): Beitrag {
  const r = BeitragZeile.parse(zeile);
  return Beitrag.parse({
    id: r.id,
    bestandsaufnahmeId: r.bestandsaufnahme_id,
    bereich: r.bereich,
    istLeitung: r.ist_leitung,
    rolleZeigen: r.rolle_zeigen,
    punkte: r.punkte,
    mitsprache: r.mitsprache,
    gutLaeuft: r.gut_laeuft ?? undefined,
    fiktiv: r.fiktiv,
  });
}

function beitragInZeile(b: Beitrag) {
  // Spalte „bremst“ aus v2: Mittel der Punkte, damit die Pflichtspalte gefüllt bleibt.
  const bremst = Math.round(b.punkte.reduce((a, p) => a + p.bremst, 0) / b.punkte.length);
  return {
    id: b.id,
    bestandsaufnahme_id: b.bestandsaufnahmeId,
    bereich: b.bereich,
    ist_leitung: b.istLeitung,
    rolle_zeigen: b.rolleZeigen,
    punkte: b.punkte as Json,
    bremst,
    mitsprache: b.mitsprache,
    gut_laeuft: b.gutLaeuft ?? null,
    fiktiv: b.fiktiv,
  };
}

/** Demo-Daten in Supabase (neu) anlegen: Bestandsaufnahme, Startbeiträge, geprüftes Gesamtbild. */
async function ladeDemoInSupabase() {
  const c = db();
  fehler("Demo löschen", (await c.from("bestandsaufnahmen").delete().eq("id", DEMO_ID)).error);
  fehler("Demo-Bestandsaufnahme", (await c.from("bestandsaufnahmen").insert(inZeile(demoBestandsaufnahme))).error);
  fehler("Demo-Beiträge", (await c.from("beitraege").insert(demoBeitraege.map(beitragInZeile))).error);
  const e = demoEintrag();
  fehler(
    "Demo-Gesamtbild",
    (await c.from("gesamtbilder").insert({
      bestandsaufnahme_id: DEMO_ID,
      schluessel: e.schluessel,
      bild: e.bild as Json,
      aus_demo: false,
      loesungen: e.loesungen as Json,
    })).error,
  );
}

// ---------------------------------------------------------------------------
// Öffentliche Funktionen
// ---------------------------------------------------------------------------
export async function holeBestandsaufnahme(id: string): Promise<Bestandsaufnahme | null> {
  if (!supabaseKonfiguriert()) return imServer().bestandsaufnahmen.get(id) ?? null;
  // Wird die Demo gerade angelegt, erst warten – sonst sieht man halb eingefügte Beiträge.
  if (g.__rowaiDemoGeladen) await g.__rowaiDemoGeladen;
  const { data, error } = await db().from("bestandsaufnahmen").select("*").eq("id", id).maybeSingle();
  fehler("Bestandsaufnahme lesen", error);
  if (data) return ausZeile(data);
  if (id !== DEMO_ID) return null;
  // Demo beim ersten Aufruf anlegen; parallele Aufrufe warten auf denselben Vorgang.
  g.__rowaiDemoGeladen ??= ladeDemoInSupabase().finally(() => {
    g.__rowaiDemoGeladen = undefined;
  });
  await g.__rowaiDemoGeladen;
  return holeBestandsaufnahme(id);
}

export async function aktualisiereBestandsaufnahme(b: Bestandsaufnahme) {
  if (!supabaseKonfiguriert()) {
    imServer().bestandsaufnahmen.set(b.id, b);
    return;
  }
  fehler("Bestandsaufnahme speichern", (await db().from("bestandsaufnahmen").upsert(inZeile(b))).error);
}

export async function holeBeitraege(id: string): Promise<Beitrag[]> {
  if (!supabaseKonfiguriert()) return imServer().beitraege.get(id) ?? [];
  const { data, error } = await db()
    .from("beitraege")
    .select("*")
    .eq("bestandsaufnahme_id", id)
    .order("erstellt_am");
  fehler("Beiträge lesen", error);
  return (data ?? []).map(beitragAusZeile);
}

export async function speichereBeitrag(beitrag: Beitrag) {
  if (!supabaseKonfiguriert()) {
    const s = imServer();
    const liste = (s.beitraege.get(beitrag.bestandsaufnahmeId) ?? []).filter((b) => b.id !== beitrag.id);
    s.beitraege.set(beitrag.bestandsaufnahmeId, [...liste, beitrag]);
    return;
  }
  fehler("Beitrag speichern", (await db().from("beitraege").upsert(beitragInZeile(beitrag))).error);
}

export async function loescheBeitrag(bestandsaufnahmeId: string, beitragId: string) {
  if (!supabaseKonfiguriert()) {
    const s = imServer();
    s.beitraege.set(bestandsaufnahmeId, (s.beitraege.get(bestandsaufnahmeId) ?? []).filter((b) => b.id !== beitragId));
    return;
  }
  fehler("Beitrag löschen", (await db().from("beitraege").delete().eq("id", beitragId)).error);
}

export async function holeGesamtbildEintrag(id: string): Promise<GesamtbildEintrag | null> {
  if (!supabaseKonfiguriert()) return imServer().gesamtbilder.get(id) ?? null;
  const { data, error } = await db().from("gesamtbilder").select("*").eq("bestandsaufnahme_id", id).maybeSingle();
  fehler("Gesamtbild lesen", error);
  if (!data) return null;
  const bild = Gesamtbild.safeParse(data.bild);
  if (!bild.success) {
    console.error("Gespeichertes Gesamtbild hat ein altes Format, wird neu erzeugt:", z.prettifyError(bild.error));
    return null;
  }
  const loesungen = z.record(z.string(), LoesungEintrag).safeParse(data.loesungen ?? {});
  return {
    schluessel: data.schluessel,
    bild: bild.data,
    ausDemo: data.aus_demo,
    loesungen: loesungen.success ? loesungen.data : {},
  };
}

export async function speichereGesamtbildEintrag(id: string, e: GesamtbildEintrag) {
  if (!supabaseKonfiguriert()) {
    imServer().gesamtbilder.set(id, e);
    return;
  }
  fehler(
    "Gesamtbild speichern",
    (await db().from("gesamtbilder").upsert({
      bestandsaufnahme_id: id,
      schluessel: e.schluessel,
      bild: e.bild as Json,
      aus_demo: e.ausDemo,
      loesungen: e.loesungen as Json,
      erstellt_am: new Date().toISOString(),
    })).error,
  );
}

/** Nur die Lösungen schreiben – so überschreibt ein paralleles Ergänzen des Bilds sie nicht. */
export async function speichereLoesungen(id: string, loesungen: Record<string, LoesungEintrag>) {
  if (!supabaseKonfiguriert()) {
    const e = imServer().gesamtbilder.get(id);
    if (e) imServer().gesamtbilder.set(id, { ...e, loesungen });
    return;
  }
  fehler("Lösungen speichern", (await db().from("gesamtbilder").update({ loesungen: loesungen as Json }).eq("bestandsaufnahme_id", id)).error);
}

/** Setzt die Demo auf den Ausgangszustand zurück (vor jedem Pitch-Durchlauf). */
export async function demoZuruecksetzen() {
  laufend.clear();
  if (!supabaseKonfiguriert()) {
    g.__rowaiSpeicher = startdaten();
    return;
  }
  g.__rowaiDemoGeladen ??= ladeDemoInSupabase().finally(() => {
    g.__rowaiDemoGeladen = undefined;
  });
  await g.__rowaiDemoGeladen;
}
