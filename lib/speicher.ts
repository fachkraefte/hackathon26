// Speicherung der Laufzeitdaten.
// Mit SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY: Supabase (Tabellen aus supabase/migrations/).
// Ohne: Speicher im Server (nur lokal/Demo; auf Vercel nicht zwischen Instanzen geteilt).
// Gelesene Zeilen werden mit zod geprüft, bevor die App sie nutzt.
import { z } from "zod";
import { demoBeitraege, demoBestandsaufnahme, demoGesamtbild, DEMO_ID } from "./daten";
import { createSupabaseServerClient, supabaseKonfiguriert, type Json } from "./supabase/server";
import { Beitrag, Beschluss, Bestandsaufnahme, Gesamtbild, Punkt } from "./typen";

export type GesamtbildEintrag = { schluessel: string; bild: Gesamtbild; ausDemo: boolean };

/** Fingerabdruck der Beiträge: ändert er sich, muss das Gesamtbild neu entstehen. */
export function schluesselFuer(beitraege: Beitrag[]) {
  return beitraege
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
  beschluesse: Map<string, Beschluss[]>;
};

function startdaten(): SpeicherImServer {
  return {
    bestandsaufnahmen: new Map([[DEMO_ID, structuredClone(demoBestandsaufnahme)]]),
    beitraege: new Map([[DEMO_ID, structuredClone(demoBeitraege)]]),
    gesamtbilder: new Map([[DEMO_ID, demoEintrag()]]),
    beschluesse: new Map(),
  };
}

function demoEintrag(): GesamtbildEintrag {
  return { schluessel: schluesselFuer(demoBeitraege), bild: structuredClone(demoGesamtbild), ausDemo: false };
}

const imServer = () => (g.__rowaiSpeicher ??= startdaten());

// ---------------------------------------------------------------------------
// Supabase: Zeilen ↔ Datenformate
// ---------------------------------------------------------------------------
const db = () => createSupabaseServerClient();

const BestandsaufnahmeZeile = z.object({
  id: z.string(),
  betrieb_name: z.string(),
  branche: z.string(),
  mitarbeitende: z.number(),
  leistungen: z.string(),
  fiktiv: z.boolean(),
  leitung_vorname: z.string(),
  leitung_rolle: z.string(),
  anrede: z.string(),
  frage: z.string(),
  ziel: z.string(),
  stundensatz: z.coerce.number(),
  arbeitswochen: z.number(),
  bereiche: z.array(z.string()),
  mindestanzahl: z.number(),
  zeitfresser: z.array(z.string()),
  besprechung_am: z.string().nullable(),
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
      fiktiv: r.fiktiv,
    },
    leitung: { vorname: r.leitung_vorname, rolle: r.leitung_rolle },
    anrede: r.anrede,
    frage: r.frage,
    ziel: r.ziel,
    stundensatz: r.stundensatz,
    arbeitswochen: r.arbeitswochen,
    bereiche: r.bereiche,
    mindestanzahl: r.mindestanzahl,
    zeitfresser: r.zeitfresser,
    besprechungAm: r.besprechung_am ?? undefined,
  });
}

function inZeile(b: Bestandsaufnahme) {
  return {
    id: b.id,
    betrieb_name: b.betrieb.name,
    branche: b.betrieb.branche,
    mitarbeitende: b.betrieb.mitarbeitende,
    leistungen: b.betrieb.leistungen,
    fiktiv: b.betrieb.fiktiv,
    leitung_vorname: b.leitung.vorname,
    leitung_rolle: b.leitung.rolle,
    anrede: b.anrede,
    frage: b.frage,
    ziel: b.ziel,
    stundensatz: b.stundensatz,
    arbeitswochen: b.arbeitswochen,
    bereiche: b.bereiche,
    mindestanzahl: b.mindestanzahl,
    zeitfresser: b.zeitfresser,
    besprechung_am: b.besprechungAm ?? null,
  };
}

const BeitragZeile = z.object({
  id: z.string(),
  bestandsaufnahme_id: z.string(),
  bereich: z.string(),
  ist_leitung: z.boolean(),
  rolle_zeigen: z.boolean(),
  punkte: z.array(Punkt),
  bremst: z.number(),
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
    bremst: r.bremst,
    gutLaeuft: r.gut_laeuft ?? undefined,
    fiktiv: r.fiktiv,
  });
}

function beitragInZeile(b: Beitrag) {
  return {
    id: b.id,
    bestandsaufnahme_id: b.bestandsaufnahmeId,
    bereich: b.bereich,
    ist_leitung: b.istLeitung,
    rolle_zeigen: b.rolleZeigen,
    punkte: b.punkte as Json,
    bremst: b.bremst,
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
  return { schluessel: data.schluessel, bild: bild.data, ausDemo: data.aus_demo };
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
      erstellt_am: new Date().toISOString(),
    })).error,
  );
}

export async function holeBeschluesse(id: string): Promise<Beschluss[]> {
  if (!supabaseKonfiguriert()) return imServer().beschluesse.get(id) ?? [];
  const { data, error } = await db().from("beschluesse").select("*").eq("bestandsaufnahme_id", id);
  fehler("Beschlüsse lesen", error);
  return (data ?? []).map((r) =>
    Beschluss.parse({ fadenId: r.faden_id, aufgabe: r.aufgabe, verantwortlich: r.verantwortlich, bis: r.bis }),
  );
}

export async function speichereBeschluss(id: string, b: Beschluss) {
  if (!supabaseKonfiguriert()) {
    const s = imServer();
    s.beschluesse.set(id, [...(s.beschluesse.get(id) ?? []).filter((x) => x.fadenId !== b.fadenId), b]);
    return;
  }
  fehler(
    "Beschluss speichern",
    (await db().from("beschluesse").upsert({
      bestandsaufnahme_id: id,
      faden_id: b.fadenId,
      aufgabe: b.aufgabe,
      verantwortlich: b.verantwortlich,
      bis: b.bis,
    })).error,
  );
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
