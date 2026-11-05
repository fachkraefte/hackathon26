// Die drei KI-Schritte. Jede Ausgabe wird geprüft und im Code nachbearbeitet.
// Fällt die KI aus (kein Schlüssel, Fehler, Zeitüberschreitung), greift der Demo-Modus.
import { z } from "zod";
import { bereichsLabel } from "../anonym";
import { demoGesamtbild, wissensauszug } from "../daten";
import { Gesamtbild, Verstaendnis, type Beitrag, type Bestandsaufnahme, type Faden } from "../typen";
import { fragJson, kiVerfuegbar } from "./json";
import { verstehePrompt, zeitfresserPrompt, zuordnenPrompt, zusammenfuehrenPrompt, type PunktFuerKi } from "./prompts";

export type MitQuelle<T> = { daten: T; ausDemo: boolean; fehler?: string };

function fehlerText(fehler: unknown) {
  return fehler instanceof Error ? fehler.message : String(fehler);
}

// ---------- ① ----------
export async function schlageZeitfresserVor(b: Bestandsaufnahme): Promise<MitQuelle<string[]>> {
  if (!kiVerfuegbar()) return { daten: b.zeitfresser, ausDemo: true };
  try {
    const { zeitfresser } = await fragJson(
      z.object({ zeitfresser: z.array(z.string().min(2).max(40)).min(4).max(10) }),
      zeitfresserPrompt(b),
      { reasoningEffort: "low" },
    );
    return { daten: zeitfresser, ausDemo: false };
  } catch (fehler) {
    console.error("Zeitfresser-Vorschläge fehlgeschlagen:", fehler);
    return { daten: b.zeitfresser, ausDemo: true, fehler: fehlerText(fehler) };
  }
}

// ---------- ② ----------
export async function versteheGeschichte(
  b: Bestandsaufnahme,
  eingabe: { bereich: string; zeitfresser: string; geschichte: string; rueckfrageErlaubt: boolean },
): Promise<MitQuelle<Verstaendnis>> {
  const ersatz: Verstaendnis = {
    spiegelung: "",
    titel: eingabe.zeitfresser,
    aussage: eingabe.geschichte.slice(0, 280),
    haeufigkeit: null,
    minuten: null,
    beteiligt: [],
    folge: null,
    rueckfrage: null,
  };
  if (!kiVerfuegbar()) return { daten: ersatz, ausDemo: true };
  try {
    const daten = await fragJson(Verstaendnis, verstehePrompt(b, eingabe), { reasoningEffort: "low" });
    return { daten: eingabe.rueckfrageErlaubt ? daten : { ...daten, rueckfrage: null }, ausDemo: false };
  } catch (fehler) {
    console.error("Verstehen fehlgeschlagen:", fehler);
    return { daten: ersatz, ausDemo: true, fehler: fehlerText(fehler) };
  }
}

// ---------- ③ ----------
/** Prüft und bereinigt das Gesamtbild: nur echte Punkt-IDs, jeder Punkt einmal, Herkunft nur mit Beleg, Prozess zuerst. */
function bereinige(bild: Gesamtbild, beitraege: Beitrag[]): Gesamtbild {
  const gueltig = new Set(beitraege.flatMap((x) => x.punkte.map((p) => p.id)));
  const vergeben = new Set<string>();
  const wissenIds = new Set(wissensauszug.map((w) => w.id));
  const rang = { prozess: 0, keineTechnik: 0, software: 1, kiAssistenz: 2, robotikHardware: 3 } as const;

  const faeden: Faden[] = bild.faeden
    .map((f) => {
      const punktIds = f.punktIds.filter((id) => gueltig.has(id) && !vergeben.has(id));
      punktIds.forEach((id) => vergeben.add(id));
      const ansaetze = f.ansaetze
        .map((a) =>
          a.herkunft === "rokiGeprueft" && (!a.wissenId || !wissenIds.has(a.wissenId))
            ? { ...a, herkunft: "nichtGeprueft" as const, wissenId: null }
            : a.herkunft === "nichtGeprueft"
              ? { ...a, wissenId: null }
              : a,
        )
        .sort((x, y) => rang[x.art] - rang[y.art]);
      return { ...f, punktIds, ansaetze };
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

export async function fuehreZusammen(
  b: Bestandsaufnahme,
  beitraege: Beitrag[],
): Promise<MitQuelle<Gesamtbild>> {
  if (!kiVerfuegbar()) return { daten: bereinige(demoBild(beitraege), beitraege), ausDemo: true };

  const punkte: PunktFuerKi[] = beitraege.flatMap((beitrag) =>
    beitrag.punkte.map((p) => ({
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
  const gutLaeuft = beitraege.flatMap((x) => (x.gutLaeuft ? [x.gutLaeuft] : []));

  try {
    const bild = await fragJson(Gesamtbild, zusammenfuehrenPrompt(b, punkte, gutLaeuft, wissensauszug), {
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
  zuordnung: z.array(z.object({ punktId: z.string(), fadenId: z.string().nullable(), stimme: z.string() })),
});

/**
 * Hängt die Punkte eines neuen Beitrags an bestehende Fäden (schnell, ein kurzer KI-Aufruf).
 * Gibt null zurück, wenn ein Punkt nirgends passt – dann muss neu zusammengeführt werden.
 */
export async function ordneZu(
  bild: Gesamtbild,
  beitrag: Beitrag,
  bereich: string,
): Promise<Gesamtbild | null> {
  if (!kiVerfuegbar()) return null;
  try {
    const { zuordnung } = await fragJson(
      Zuordnung,
      zuordnenPrompt(
        bild.faeden.map((f) => ({ id: f.id, aufgabe: f.aufgabe, problem: f.problem })),
        beitrag.punkte.map((p) => ({ id: p.id, titel: p.titel, aussage: p.aussage, beteiligt: p.beteiligt })),
      ),
      { reasoningEffort: "low" },
    );
    const fadenIds = new Set(bild.faeden.map((f) => f.id));
    const passend = zuordnung.filter((z) => z.fadenId && fadenIds.has(z.fadenId));
    if (passend.length < beitrag.punkte.length) return null;

    const faeden = bild.faeden.map((f) => {
      const meine = passend.filter((z) => z.fadenId === f.id);
      if (meine.length === 0) return f;
      const hatBereich = f.sichtweisen.some((s) => s.bereich === bereich);
      return {
        ...f,
        punktIds: [...f.punktIds, ...meine.map((z) => z.punktId)],
        // Neue Stimme vorne, damit der eigene Beitrag sichtbar ist; bestehende Stimme des Bereichs ersetzen.
        sichtweisen: [
          { bereich, aussage: meine[0].stimme },
          ...f.sichtweisen.filter((s) => (hatBereich ? s.bereich !== bereich : true)),
        ],
      };
    });
    return { ...bild, faeden };
  } catch (fehler) {
    console.error("Zuordnen fehlgeschlagen:", fehler);
    return null;
  }
}
