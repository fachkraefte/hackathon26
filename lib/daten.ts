// Lädt Demo-Daten, Wissensauszug und Fragenkatalog und prüft sie mit zod.
// Ungültige Daten brechen sofort mit einer lesbaren Meldung ab.
import { z } from "zod";
import katalogJson from "@/daten/abfrage/katalog.json";
import antwortenJson from "@/daten/demo/metallbau-heidekamp/antworten.json";
import betriebJson from "@/daten/demo/metallbau-heidekamp/betrieb.json";
import fahrplanJson from "@/daten/demo/metallbau-heidekamp/fahrplan.json";
import gesamtbildJson from "@/daten/demo/metallbau-heidekamp/gesamtbild.json";
import wissenJson from "@/wissen/roki-wissensauszug.json";
import { berechneProfil } from "./profil";
import {
  Bestandsaufnahme,
  Betrieb,
  Fahrplan,
  GesamtbildOhneProfil,
  Katalog,
  Testantwort,
  WissensEintrag,
  type Gesamtbild,
} from "./typen";

function pruefe<T>(schema: z.ZodType<T>, daten: unknown, quelle: string): T {
  const ergebnis = schema.safeParse(daten);
  if (!ergebnis.success) {
    throw new Error(`${quelle} hat das falsche Format:\n${z.prettifyError(ergebnis.error)}`, {
      cause: ergebnis.error,
    });
  }
  return ergebnis.data;
}

export const wissensauszug = pruefe(
  z.array(WissensEintrag),
  wissenJson,
  "wissen/roki-wissensauszug.json",
);

export const katalog = pruefe(Katalog, katalogJson, "daten/abfrage/katalog.json");

const heidekamp = {
  ...pruefe(
    z.object({ betrieb: Betrieb, bestandsaufnahme: Bestandsaufnahme }),
    betriebJson,
    "daten/demo/metallbau-heidekamp/betrieb.json",
  ),
  antworten: pruefe(
    z.array(Testantwort),
    antwortenJson,
    "daten/demo/metallbau-heidekamp/antworten.json",
  ),
  gesamtbildOhneProfil: pruefe(
    GesamtbildOhneProfil,
    gesamtbildJson,
    "daten/demo/metallbau-heidekamp/gesamtbild.json",
  ),
  fahrplan: pruefe(Fahrplan, fahrplanJson, "daten/demo/metallbau-heidekamp/fahrplan.json"),
};

// Verweise auf den Wissensauszug müssen existieren.
const wissenIds = new Set(wissensauszug.map((eintrag) => eintrag.id));
for (const verweis of [
  ...heidekamp.fahrplan.massnahmen.map((m) => m.wissenId),
  ...katalog.aufgaben.flatMap((a) => a.vorschlaege.map((v) => v.wissenId)),
]) {
  if (verweis && !wissenIds.has(verweis)) {
    throw new Error(`wissenId "${verweis}" fehlt in wissen/roki-wissensauszug.json`);
  }
}

export type Demo = {
  betrieb: Betrieb;
  bestandsaufnahme: Bestandsaufnahme;
  antworten: Testantwort[];
  gesamtbild: Gesamtbild;
  fahrplan: Fahrplan;
};

export function ladeDemo(bestandsaufnahmeId: string): Demo | null {
  if (bestandsaufnahmeId !== heidekamp.bestandsaufnahme.id) return null;
  return {
    betrieb: heidekamp.betrieb,
    bestandsaufnahme: heidekamp.bestandsaufnahme,
    antworten: heidekamp.antworten,
    fahrplan: heidekamp.fahrplan,
    gesamtbild: {
      ...heidekamp.gesamtbildOhneProfil,
      profil: berechneProfil(heidekamp.antworten, heidekamp.bestandsaufnahme),
    },
  };
}

export function findeBereichPerLink(linkId: string) {
  const bereich = heidekamp.bestandsaufnahme.bereiche.find((b) => b.linkId === linkId);
  if (!bereich) return null;
  return { bereich, betrieb: heidekamp.betrieb, bestandsaufnahme: heidekamp.bestandsaufnahme };
}

export function wissenZu(id: string | undefined): WissensEintrag | undefined {
  return id ? wissensauszug.find((eintrag) => eintrag.id === id) : undefined;
}

export const DEMO_ID = heidekamp.bestandsaufnahme.id;
