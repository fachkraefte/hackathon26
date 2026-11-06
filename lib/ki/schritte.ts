// Die KI-Schritte (KONZEPT_V3 §8). Jede Ausgabe wird geprüft und im Code nachbearbeitet.
// Fällt die KI aus (kein Schlüssel, Fehler, Zeitüberschreitung), greift der Demo-Modus.
import { z } from "zod";
import { bereichsLabel } from "../anonym";
import { demoGesamtbild, loesungsmuster } from "../daten";
import { Faden, Gesamtbild, Loesung, Loesungsart, Profil, Reifegrad, Verstaendnis, type Beitrag, type Bestandsaufnahme } from "../typen";
import { fragJson, kiVerfuegbar } from "./json";
import {
  loesungPrompt,
  neuerFadenPrompt,
  verstehePrompt,
  vorbereitenPrompt,
  zuordnenPrompt,
  zusammenfuehrenPrompt,
  type PunktFuerKi,
  mitSprache,
} from "./prompts";

export type MitQuelle<T> = { daten: T; ausDemo: boolean; fehler?: string };

function fehlerText(fehler: unknown) {
  return fehler instanceof Error ? fehler.message : String(fehler);
}

// ---------- ① Vorbereiten (beim Anlegen) ----------
/** Ersatz ohne KI: allgemeine Chips je Bereich, damit die Befragung trotzdem startet. */
function profilErsatz(b: Bestandsaufnahme): Profil {
  const chips = Object.fromEntries(
    b.bereiche.map((x) => [x.name, ["Informationen bekommen", "Material und Werkzeug", "Absprachen", "Dokumentation"]]),
  );
  const rueckfragen = Object.fromEntries(
    b.bereiche.map((x) => [x.name, ["Von wem fehlt dir dann eine Information?", "Woran merkst du, dass es hakt?"]]),
  );
  return { kurz: b.betrieb.leistungen, extern: [], chips, rueckfragen };
}

export async function bereiteVor(b: Bestandsaufnahme, websiteText: string | null): Promise<MitQuelle<Profil>> {
  if (!kiVerfuegbar()) return { daten: profilErsatz(b), ausDemo: true };
  try {
    const profil = await fragJson(Profil, mitSprache(b, vorbereitenPrompt(b, websiteText)), { reasoningEffort: "low", timeoutMs: 30_000 });
    // Jeder Bereich braucht Chips und Rückfragen, auch wenn die KI einen ausgelassen hat.
    const ersatz = profilErsatz(b);
    for (const { name } of b.bereiche) {
      if (!profil.chips[name]?.length) profil.chips[name] = ersatz.chips[name];
      if (!profil.rueckfragen[name]?.length) profil.rueckfragen[name] = ersatz.rueckfragen[name];
    }
    return { daten: profil, ausDemo: false };
  } catch (fehler) {
    console.error("Vorbereiten fehlgeschlagen:", fehler);
    return { daten: profilErsatz(b), ausDemo: true, fehler: fehlerText(fehler) };
  }
}

// ---------- ② ----------
export async function versteheGeschichte(
  b: Bestandsaufnahme,
  eingabe: { bereich: string; aufgabe: string; geschichte: string; rueckfrageErlaubt: boolean },
): Promise<MitQuelle<Verstaendnis>> {
  const ersatz: Verstaendnis = {
    spiegelung: "",
    titel: eingabe.aufgabe,
    aussage: eingabe.geschichte.slice(0, 280),
    haeufigkeit: null,
    minuten: null,
    beteiligt: [],
    folge: null,
    von: null,
    an: null,
    rueckfrage: null,
  };
  if (!kiVerfuegbar()) return { daten: ersatz, ausDemo: true };
  try {
    const daten = await fragJson(Verstaendnis, mitSprache(b, verstehePrompt(b, eingabe)), { reasoningEffort: "low" });
    // Übergabe nur mit bekannten Zielen; sonst leer lassen, die Person wählt selbst.
    const ziele = new Set([...b.bereiche.map((x) => x.name), ...(b.profil?.extern ?? [])]);
    const pruefe = (x: string | null) => (x && ziele.has(x) && x !== eingabe.bereich ? x : null);
    return {
      daten: {
        ...daten,
        von: pruefe(daten.von),
        an: pruefe(daten.an),
        rueckfrage: eingabe.rueckfrageErlaubt ? daten.rueckfrage : null,
      },
      ausDemo: false,
    };
  } catch (fehler) {
    console.error("Verstehen fehlgeschlagen:", fehler);
    return { daten: ersatz, ausDemo: true, fehler: fehlerText(fehler) };
  }
}

// ---------- ③ ----------
/** Prüft das Gesamtbild: nur echte Punkt-IDs, jeder Punkt einmal, leere Fäden fallen weg. */
function bereinige(bild: Gesamtbild, beitraege: Beitrag[]): Gesamtbild {
  const gueltig = new Set(beitraege.flatMap((x) => x.punkte.map((p) => p.id)));
  const vergeben = new Set<string>();
  const faeden: Faden[] = bild.faeden
    .map((f) => {
      const punktIds = f.punktIds.filter((id) => gueltig.has(id) && !vergeben.has(id));
      punktIds.forEach((id) => vergeben.add(id));
      return { ...f, punktIds };
    })
    .filter((f) => f.punktIds.length > 0);
  return { ...bild, faeden };
}

/** Ersatz ohne KI: gespeichertes Bild; neue Punkte kommen in den Faden mit dem gleichen Zeitfresser. */
function demoBild(beitraege: Beitrag[]): Gesamtbild {
  const basis = structuredClone(demoGesamtbild);
  const bekannte = new Set(basis.faeden.flatMap((f) => f.punktIds));
  const zeitfresserVon = new Map(beitraege.flatMap((x) => x.punkte.map((p) => [p.id, p.zeitfresser])));
  const faeden = basis.faeden.map((f) => ({ ...f, punktIds: [...f.punktIds] }));
  for (const beitrag of beitraege) {
    for (const punkt of beitrag.punkte) {
      if (bekannte.has(punkt.id)) continue;
      const ziel =
        faeden.find((f) => f.punktIds.some((id) => zeitfresserVon.get(id) === punkt.zeitfresser)) ?? faeden[0];
      ziel.punktIds.push(punkt.id);
    }
  }
  return { ...basis, faeden };
}

/** Punkte so, wie die KI sie sieht: kleine Bereiche schon anonymisiert. */
function punkteFuerKi(b: Bestandsaufnahme, beitraege: Beitrag[], nur?: Set<string>): PunktFuerKi[] {
  return beitraege.flatMap((beitrag) =>
    beitrag.punkte
      .filter((p) => !nur || nur.has(p.id))
      .map((p) => ({
        id: p.id,
        bereich: bereichsLabel(beitrag, beitraege, b),
        istLeitung: beitrag.istLeitung,
        zeitfresser: p.zeitfresser,
        titel: p.titel,
        aussage: p.aussage,
        beteiligt: p.beteiligt,
        folge: p.folge ?? null,
      })),
  );
}

export async function fuehreZusammen(
  b: Bestandsaufnahme,
  beitraege: Beitrag[],
): Promise<MitQuelle<Gesamtbild>> {
  if (!kiVerfuegbar()) return { daten: bereinige(demoBild(beitraege), beitraege), ausDemo: true };

  const punkte = punkteFuerKi(b, beitraege);
  const gutLaeuft = beitraege.flatMap((x) => (x.gutLaeuft ? [x.gutLaeuft] : []));

  try {
    const bild = await fragJson(Gesamtbild, mitSprache(b, zusammenfuehrenPrompt(b, punkte, gutLaeuft)), {
      reasoningEffort: "medium",
      timeoutMs: 90_000,
    });
    return { daten: bereinige(bild, beitraege), ausDemo: false };
  } catch (fehler) {
    console.error("Zusammenführen fehlgeschlagen:", fehler);
    return { daten: bereinige(demoBild(beitraege), beitraege), ausDemo: true, fehler: fehlerText(fehler) };
  }
}

// ---------- ③b ----------
const Zuordnung = z.object({
  zuordnung: z.array(
    z.object({ punktId: z.string(), ursache: z.string().optional(), fadenId: z.string().nullable(), stimme: z.string() }),
  ),
});
const NeueFaeden = z.object({ faeden: z.array(Faden.omit({ id: true })).min(1) });

/** Nächste freie Faden-ID (f1, f2, …) – bestehende IDs ändern sich nie. */
function naechsteId(faeden: Faden[]) {
  const nummern = faeden.map((f) => Number(f.id.replace(/\D/g, "")) || 0);
  return `f${Math.max(0, ...nummern) + 1}`;
}

/**
 * Ergänzt ein bestehendes Bild um neue Punkte, ohne vorhandene Fäden umzubauen:
 * 1. Zuordnen zu bestehenden Fäden (schneller KI-Aufruf).
 * 2. Was nirgends passt, wird EIN neuer Faden (zweiter kurzer Aufruf).
 * So bleiben IDs, Aufgaben und Zahlen stabil, während die Analyse wächst.
 * Gibt null zurück, wenn die KI nicht erreichbar ist.
 */
export async function ergaenzeBild(
  b: Bestandsaufnahme,
  bild: Gesamtbild,
  beitraege: Beitrag[],
  neueIds: Set<string>,
): Promise<Gesamtbild | null> {
  if (!kiVerfuegbar() || neueIds.size === 0) return neueIds.size === 0 ? bereinige(bild, beitraege) : null;
  const punkte = punkteFuerKi(b, beitraege, neueIds);
  const bereichVon = new Map(punkte.map((p) => [p.id, p.bereich]));
  const titelVon = new Map(beitraege.flatMap((x) => x.punkte.map((p) => [p.id, p.titel] as const)));

  try {
    const { zuordnung } = await fragJson(
      Zuordnung,
      zuordnenPrompt(
        bild.faeden.map((f) => ({
          id: f.id,
          aufgabe: f.aufgabe,
          problem: f.problem,
          beispiele: f.punktIds.flatMap((pid) => titelVon.get(pid) ?? []).slice(0, 4),
        })),
        punkte.map((p) => ({ id: p.id, titel: p.titel, aussage: p.aussage, beteiligt: p.beteiligt })),
      ),
      { reasoningEffort: "low" },
    );
    const fadenIds = new Set(bild.faeden.map((f) => f.id));
    const passend = zuordnung.filter((z) => neueIds.has(z.punktId) && z.fadenId && fadenIds.has(z.fadenId));
    const zugeordnet = new Set(passend.map((z) => z.punktId));

    const faeden = bild.faeden.map((f) => {
      const meine = passend.filter((z) => z.fadenId === f.id);
      if (meine.length === 0) return f;
      // Neue Stimmen vorne, damit der eigene Beitrag sichtbar ist; je Bereich eine Stimme.
      const neueStimmen = new Map<string, string>();
      for (const z of meine) {
        const bereich = bereichVon.get(z.punktId) ?? "ein anderer Bereich";
        if (!neueStimmen.has(bereich)) neueStimmen.set(bereich, z.stimme);
      }
      return {
        ...f,
        punktIds: [...f.punktIds, ...meine.map((z) => z.punktId)],
        sichtweisen: [
          ...[...neueStimmen].map(([bereich, aussage]) => ({ bereich, aussage })),
          ...f.sichtweisen.filter((s) => !neueStimmen.has(s.bereich)),
        ],
      };
    });

    const rest = punkte.filter((p) => !zugeordnet.has(p.id));
    if (rest.length > 0) {
      // Klappt das nicht, bleiben die Punkte vorerst offen und werden beim nächsten Abruf erneut versucht.
      const offen = new Set(rest.map((p) => p.id));
      for (const neu of (await neueFaeden(b, rest, faeden)) ?? []) {
        const punktIds = neu.punktIds.filter((pid) => offen.delete(pid));
        if (punktIds.length > 0) faeden.push({ ...neu, id: naechsteId(faeden), punktIds });
      }
    }
    return bereinige({ ...bild, faeden: faeden.slice(0, 6) }, beitraege);
  } catch (fehler) {
    console.error("Ergänzen fehlgeschlagen:", fehler);
    return null;
  }
}

async function neueFaeden(b: Bestandsaufnahme, punkte: PunktFuerKi[], bestehende: Faden[]) {
  try {
    const { faeden } = await fragJson(NeueFaeden, mitSprache(b, neuerFadenPrompt(b, punkte, bestehende)), {
      reasoningEffort: "low",
      timeoutMs: 30_000,
    });
    return faeden;
  } catch (fehler) {
    console.error("Neuer Faden fehlgeschlagen:", fehler);
    return null;
  }
}

// ---------- ④ Lösung je Handlungsfeld ----------
const LoesungKi = z.object({
  musterId: z.string().nullable(),
  name: z.string(),
  satz: z.string(),
  schritte: z.array(z.string()).length(3),
  braucht: z.array(z.string()).min(1).max(5),
  kniff: z.string(),
  zeitFrei: z.string(),
  art: Loesungsart,
  reife: Reifegrad,
  testlauf: z.string(),
  bauplanPrompt: z.string().min(200),
});

/**
 * Erzeugt die Lösung für einen Faden. Reife und Herkunft kommen bei einem Muster aus dem Katalog,
 * nie aus der KI – „von ROKI geprüft“ gibt es nur mit Verweis auf den Wissensauszug.
 */
export async function erzeugeLoesung(b: Bestandsaufnahme, faden: Faden, beitraege: Beitrag[]): Promise<Loesung | null> {
  if (!kiVerfuegbar()) return null;
  const ids = new Set(faden.punktIds);
  const stimmen = beitraege.flatMap((x) => x.punkte.filter((p) => ids.has(p.id)).map((p) => ({ titel: p.titel, aussage: p.aussage })));
  const katalog = loesungsmuster.map(({ id, name, passtZu, art, kern, kniff, braucht }) => ({ id, name, passtZu, art, kern, kniff, braucht }));
  try {
    const ki = await fragJson(LoesungKi, mitSprache(b, loesungPrompt(b, faden, stimmen.slice(0, 12), katalog)), {
      reasoningEffort: "medium",
      timeoutMs: 75_000,
    });
    const muster = loesungsmuster.find((m) => m.id === ki.musterId);
    const { musterId: _muster, ...rest } = ki;
    void _muster;
    return {
      ...rest,
      name: (b.sprache === "en" ? muster?.nameEn : muster?.name) ?? ki.name, // wiedererkennbar: Muster behalten ihren Namen
      art: muster?.art ?? (ki.art === "prozess" || ki.art === "keineTechnik" ? "kiAssistenz" : ki.art),
      reife: muster?.reife ?? (ki.reife === "imEinsatz" ? "pilot" : ki.reife),
      herkunft: muster?.wissenId ? "rokiGeprueft" : "nichtGeprueft",
      wissenId: muster?.wissenId ?? null,
    };
  } catch (fehler) {
    console.error(`Lösung für ${faden.id} fehlgeschlagen:`, fehler);
    return null;
  }
}
