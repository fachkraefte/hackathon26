// Persönliche Codes: einer pro Person, nie mit Namen verknüpft. Der Bereich wird beim ersten Öffnen gewählt.
// Eine Person = ein Beitrag (Sitzung = Code), auch über mehrere Tage.
import { createSupabaseServerClient, supabaseKonfiguriert } from "./supabase/server";

export type Zugang = { code: string; betriebId: string; bereich: string | null };

const ZEICHEN = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const g = globalThis as typeof globalThis & { __rokioZugaenge?: Map<string, Zugang> };
const imServer = () => (g.__rokioZugaenge ??= new Map());
const db = () => createSupabaseServerClient();

function neuerCode() {
  const z = crypto.getRandomValues(new Uint32Array(8));
  return Array.from(z, (n) => ZEICHEN[n % ZEICHEN.length]).join("");
}

export async function erzeugeZugaenge(betriebId: string, anzahl: number): Promise<string[]> {
  const codes = Array.from({ length: Math.min(Math.max(anzahl, 1), 500) }, neuerCode);
  if (!supabaseKonfiguriert()) {
    for (const code of codes) imServer().set(code, { code, betriebId, bereich: null });
    return codes;
  }
  const { error } = await db().from("zugaenge").insert(codes.map((code) => ({ code, bestandsaufnahme_id: betriebId })));
  if (error) throw new Error(`Zugänge anlegen: ${error.message}`);
  return codes;
}

export async function holeZugang(code: string): Promise<Zugang | null> {
  const c = code.trim().toUpperCase();
  if (!supabaseKonfiguriert()) return imServer().get(c) ?? null;
  const { data, error } = await db().from("zugaenge").select("*").eq("code", c).maybeSingle();
  if (error) throw new Error(`Zugang lesen: ${error.message}`);
  return data ? { code: data.code, betriebId: data.bestandsaufnahme_id, bereich: data.bereich } : null;
}

export async function holeZugaenge(betriebId: string): Promise<string[]> {
  if (!supabaseKonfiguriert()) return [...imServer().values()].filter((z) => z.betriebId === betriebId).map((z) => z.code);
  const { data, error } = await db().from("zugaenge").select("code").eq("bestandsaufnahme_id", betriebId);
  if (error) throw new Error(`Zugänge lesen: ${error.message}`);
  return data.map((z) => z.code);
}

export async function setzeBereichFuer(code: string, bereich: string) {
  if (!supabaseKonfiguriert()) {
    const z = imServer().get(code);
    if (z) imServer().set(code, { ...z, bereich });
    return;
  }
  const { error } = await db().from("zugaenge").update({ bereich }).eq("code", code);
  if (error) throw new Error(`Bereich speichern: ${error.message}`);
}
