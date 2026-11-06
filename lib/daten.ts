// Lädt Wissensauszug und Demo-Daten und prüft sie mit zod.
// Ungültige Daten brechen sofort mit einer lesbaren Meldung ab.
import { z } from "zod";
import beitraegeJson from "@/daten/demo/heidekamp/beitraege.json";
import bestandsaufnahmeJson from "@/daten/demo/heidekamp/bestandsaufnahme.json";
import gesamtbildJson from "@/daten/demo/heidekamp/gesamtbild.json";
import loesungenJson from "@/daten/demo/heidekamp/loesungen.json";
import beitraegeEnJson from "@/daten/demo/heidekamp-en/beitraege.json";
import bestandsaufnahmeEnJson from "@/daten/demo/heidekamp-en/bestandsaufnahme.json";
import gesamtbildEnJson from "@/daten/demo/heidekamp-en/gesamtbild.json";
import loesungenEnJson from "@/daten/demo/heidekamp-en/loesungen.json";
import musterJson from "@/wissen/loesungsmuster.json";
import wissenJson from "@/wissen/roki-wissensauszug.json";
import { Beitrag, Bestandsaufnahme, Gesamtbild, LoesungEintrag, LoesungsMuster, WissensEintrag } from "./typen";

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

export const loesungsmuster = pruefe(z.array(LoesungsMuster), musterJson, "wissen/loesungsmuster.json");
// Jedes Muster mit wissenId muss auf einen echten Eintrag im Wissensauszug zeigen.
for (const m of loesungsmuster) {
  if (m.wissenId && !wissensauszug.some((w) => w.id === m.wissenId)) {
    throw new Error(`Lösungsmuster ${m.id} verweist auf unbekannten Wissenseintrag ${m.wissenId}`);
  }
}

export const demoBestandsaufnahme = pruefe(
  Bestandsaufnahme,
  bestandsaufnahmeJson,
  "daten/demo/heidekamp/bestandsaufnahme.json",
);

export const demoBeitraege = pruefe(z.array(Beitrag), beitraegeJson, "daten/demo/heidekamp/beitraege.json");

/** Von der KI erzeugt und von einem Menschen geprüft (TECHNIK.md §7). */
export const demoGesamtbild = pruefe(Gesamtbild, gesamtbildJson, "daten/demo/heidekamp/gesamtbild.json");

/** Lösungen je Faden, von der KI erzeugt und von einem Menschen geprüft. */
export const demoLoesungen = pruefe(
  z.record(z.string(), LoesungEintrag),
  loesungenJson,
  "daten/demo/heidekamp/loesungen.json",
);

export const DEMO_ID = demoBestandsaufnahme.id;

/** Englische Demo (gleicher fiktiver Betrieb, übersetzt) – für den englischen Pitch und /en. */
const demoEn = {
  bestandsaufnahme: pruefe(Bestandsaufnahme, bestandsaufnahmeEnJson, "daten/demo/heidekamp-en/bestandsaufnahme.json"),
  beitraege: pruefe(z.array(Beitrag), beitraegeEnJson, "daten/demo/heidekamp-en/beitraege.json"),
  gesamtbild: pruefe(Gesamtbild, gesamtbildEnJson, "daten/demo/heidekamp-en/gesamtbild.json"),
  loesungen: pruefe(z.record(z.string(), LoesungEintrag), loesungenEnJson, "daten/demo/heidekamp-en/loesungen.json"),
};
export const DEMO_ID_EN = demoEn.bestandsaufnahme.id;

export type Demo = typeof demoEn & { sprache: "de" | "en" };
export const DEMOS: Demo[] = [
  { bestandsaufnahme: demoBestandsaufnahme, beitraege: demoBeitraege, gesamtbild: demoGesamtbild, loesungen: demoLoesungen, sprache: "de" },
  { ...demoEn, sprache: "en" },
];
export const demoFuer = (id: string) => DEMOS.find((d) => d.bestandsaufnahme.id === id);
/** Demo-Projekt passend zur Oberflächensprache. */
export const demoIdFuer = (locale: string) => (locale === "en" ? DEMO_ID_EN : DEMO_ID);

export function wissenZu(id: string | null | undefined): WissensEintrag | undefined {
  return id ? wissensauszug.find((eintrag) => eintrag.id === id) : undefined;
}
