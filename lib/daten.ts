// Lädt Wissensauszug und Demo-Daten und prüft sie mit zod.
// Ungültige Daten brechen sofort mit einer lesbaren Meldung ab.
import { z } from "zod";
import beitraegeJson from "@/daten/demo/heidekamp/beitraege.json";
import bestandsaufnahmeJson from "@/daten/demo/heidekamp/bestandsaufnahme.json";
import gesamtbildJson from "@/daten/demo/heidekamp/gesamtbild.json";
import wissenJson from "@/wissen/roki-wissensauszug.json";
import { Beitrag, Bestandsaufnahme, Gesamtbild, WissensEintrag } from "./typen";

export function pruefe<T>(schema: z.ZodType<T>, daten: unknown, quelle: string): T {
  const ergebnis = schema.safeParse(daten);
  if (!ergebnis.success) {
    throw new Error(`${quelle} hat das falsche Format:\n${z.prettifyError(ergebnis.error)}`, {
      cause: ergebnis.error,
    });
  }
  return ergebnis.data;
}

export const wissensauszug = pruefe(z.array(WissensEintrag), wissenJson, "wissen/roki-wissensauszug.json");

export const demoBestandsaufnahme = pruefe(
  Bestandsaufnahme,
  bestandsaufnahmeJson,
  "daten/demo/heidekamp/bestandsaufnahme.json",
);

export const demoBeitraege = pruefe(z.array(Beitrag), beitraegeJson, "daten/demo/heidekamp/beitraege.json");

/** Von der KI erzeugt und von einem Menschen geprüft (TECHNIK.md §7). */
export const demoGesamtbild = pruefe(Gesamtbild, gesamtbildJson, "daten/demo/heidekamp/gesamtbild.json");

export const DEMO_ID = demoBestandsaufnahme.id;

export function wissenZu(id: string | null | undefined): WissensEintrag | undefined {
  return id ? wissensauszug.find((eintrag) => eintrag.id === id) : undefined;
}
