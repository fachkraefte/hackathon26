import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Tabelle<Row, Pflicht extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Pflicht> & Partial<Omit<Row, Pflicht>>;
  Update: Partial<Row>;
  Relationships: [];
};

type BestandsaufnahmeRow = {
  id: string;
  betrieb_name: string;
  branche: string;
  mitarbeitende: number;
  leistungen: string;
  fiktiv: boolean;
  leitung_vorname: string;
  leitung_rolle: string;
  anrede: string;
  frage: string;
  ziel: string;
  stundensatz: number;
  arbeitswochen: number;
  bereiche: string[];
  mindestanzahl: number;
  zeitfresser: string[];
  besprechung_am: string | null;
  website: string | null;
  profil: Json | null;
  bereich_saetze: Json | null;
  deadline: string | null;
  erstellt_am: string;
  geaendert_am: string;
};

type BeitragRow = {
  id: string;
  bestandsaufnahme_id: string;
  bereich: string;
  ist_leitung: boolean;
  rolle_zeigen: boolean;
  punkte: Json;
  bremst: number;
  mitsprache: number | null;
  gut_laeuft: string | null;
  fiktiv: boolean;
  erstellt_am: string;
};

type GesamtbildRow = {
  bestandsaufnahme_id: string;
  schluessel: string;
  bild: Json;
  aus_demo: boolean;
  loesungen: Json;
  erstellt_am: string;
};

type BeschlussRow = {
  bestandsaufnahme_id: string;
  faden_id: string;
  aufgabe: string;
  verantwortlich: string;
  bis: string;
  erstellt_am: string;
};

type KarteRow = {
  id: string;
  bestandsaufnahme_id: string;
  faden_id: string | null;
  text: string;
  bereich: string;
  von: string | null;
  an: string | null;
  typ: string;
  frei: boolean;
};

type ReaktionRow = {
  sitzung: string;
  karte_id: string;
  bestandsaufnahme_id: string;
  bereich: string;
  richtung: string;
};

/** Tabellen aus supabase/migrations/ (v2 + v3, von Hand gepflegt). */
export type Database = {
  public: {
    Tables: {
      bestandsaufnahmen: Tabelle<
        BestandsaufnahmeRow,
        | "id" | "betrieb_name" | "branche" | "mitarbeitende" | "leitung_vorname" | "leitung_rolle"
        | "frage" | "stundensatz" | "bereiche"
      >;
      beitraege: Tabelle<BeitragRow, "id" | "bestandsaufnahme_id" | "bereich" | "punkte" | "bremst">;
      gesamtbilder: Tabelle<GesamtbildRow, "bestandsaufnahme_id" | "schluessel" | "bild">;
      beschluesse: Tabelle<BeschlussRow, "bestandsaufnahme_id" | "faden_id" | "aufgabe" | "verantwortlich" | "bis">;
      karten: Tabelle<KarteRow, "id" | "bestandsaufnahme_id" | "text" | "bereich">;
      reaktionen: Tabelle<ReaktionRow, "sitzung" | "karte_id" | "bestandsaufnahme_id" | "bereich" | "richtung">;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

/** Ist Supabase konfiguriert? Ohne die beiden Werte nutzt die App den Speicher im Server (Demo). */
export function supabaseKonfiguriert() {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local. See .env.example.`,
    );
  }
  return value;
}

/**
 * Server-only Supabase client. Import this from Server Components, Server
 * Actions, and Route Handlers. The service role key bypasses row level
 * security and must never be sent to the browser.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
