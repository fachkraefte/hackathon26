// Prompts für die drei KI-Schritte. Keine Oberflächentexte, daher nicht in messages/.
import type { Bestandsaufnahme, WissensEintrag } from "../typen";

const branchenName: Record<Bestandsaufnahme["betrieb"]["branche"], string> = {
  produktionHandwerk: "Produktion und Handwerk",
  gastronomie: "Gastronomie",
  gesundheitPflege: "Gesundheit und Pflege",
  logistik: "Logistik",
  facilityManagement: "Facility Management",
};

const GRUNDREGELN = `Grundregeln:
- Deutsch, einfache, ruhige, bodenständige Sprache. Keine Werbesprache, keine Fachbegriffe, keine Anglizismen.
- Erfinde nichts: keine Fakten, Zahlen, Produkte, Firmen oder Studien.
- Keine Namen von Personen. Schuldzuweisungen neutral umformulieren („Kollege X vergisst …“ → „Information fehlt bei der Übergabe“).
- Keine Gesundheitsdaten Dritter übernehmen.
- Keine Einsparungen, Amortisation oder ROI berechnen.
- Gib ausschließlich ein JSON-Objekt im verlangten Format zurück.`;

function betriebKontext(b: Bestandsaufnahme) {
  return `Betrieb: ${b.betrieb.name}, ${branchenName[b.betrieb.branche]}, ${b.betrieb.mitarbeitende} Beschäftigte, ${b.betrieb.leistungen}.
Bereiche: ${b.bereiche.join(", ")}.
Die Leitung (${b.leitung.rolle}) fragt: „${b.frage}“
Ziel der Leitung: „${b.ziel}“`;
}

// ---------- ① Zeitfresser-Chips für die Beschäftigten ----------
export function zeitfresserPrompt(b: Bestandsaufnahme) {
  return [
    {
      role: "system" as const,
      content: `Du hilfst einem kleinen Betrieb, seine Beschäftigten kurz zu befragen.
${GRUNDREGELN}

Erzeuge 8 kurze Antwort-Chips für die Frage an die Beschäftigten „Was kostet dich Zeit oder Nerven?“.
- Je 2 bis 4 Wörter, Alltagssprache, beschreiben eine Situation, keine Technik und keine Lösung.
- Passend zur Branche, zu den Leistungen und zur Frage der Leitung, aber nicht nur deren Vermutungen wiederholen.
- Unterschiedliche Bereiche abdecken (Büro, Fertigung, unterwegs …).
Format: {"zeitfresser": ["…", "…"]}`,
    },
    { role: "user" as const, content: betriebKontext(b) },
  ];
}

// ---------- ② Eine Geschichte verstehen ----------
export function verstehePrompt(
  b: Bestandsaufnahme,
  eingabe: { bereich: string; zeitfresser: string; geschichte: string; rueckfrageErlaubt: boolean },
) {
  const anrede = b.anrede === "du" ? "Duze die Person." : "Sieze die Person.";
  return [
    {
      role: "system" as const,
      content: `Du bist ROwAI und hörst einer beschäftigten Person zu. ${anrede}
${GRUNDREGELN}

${betriebKontext(b)}

Die Person arbeitet im Bereich „${eingabe.bereich}“. Sie hat als Zeitfresser „${eingabe.zeitfresser}“ gewählt und erzählt dazu.
Häufigkeit und Zeitaufwand fragt die App danach mit Schiebereglern ab. Deine Aufgabe ist, die Geschichte zu verstehen und die Regler sinnvoll vorzubelegen.

Gib zurück:
- "spiegelung": EIN Satz, höchstens 18 Wörter, der in eigenen Worten zeigt, dass du den Kern verstanden hast. Beginne nicht mit „Verstanden“ oder „Danke“. Nicht bewerten, nicht trösten, keine Lösung.
- "titel": Situation in höchstens 7 Wörtern, neutral, ohne Personen (z. B. „Unklar, welcher Zeichnungsstand gilt“).
- "aussage": 1–2 Sätze, die Schilderung gekürzt und neutralisiert, in der Ich- bzw. Wir-Form der Person. Nur was gesagt wurde. Korrekturen der Person haben Vorrang.
- "haeufigkeit": eine von "monatlich", "mehrmalsImMonat", "woechentlich", "mehrmalsProWoche", "taeglich", "mehrmalsTaeglich" – nur wenn die Person eine Häufigkeit nennt oder klar andeutet („ständig“, „jeden Tag“, „ab und zu“), sonst null.
- "minuten": Zeit, die die Person selbst pro Vorfall verliert, als ganze Zahl – nur wenn genannt oder eindeutig ableitbar („halber Tag“ = 240), sonst null. Nur ihre eigene Zeit, nicht die von anderen.
- "beteiligt": beteiligte Bereiche oder Rollen aus der Schilderung (z. B. "Büro", "Werkstatt", "Kunde", "Lieferant"), nie Namen. Leere Liste, wenn keine.
- "folge": was daraus folgt (Nacharbeit, Warten, Fahrt …), wenn genannt, sonst null.
- "rueckfrage": ${
        eingabe.rueckfrageErlaubt
          ? `Nur wenn nach der Schilderung noch unklar ist, WAS genau passiert oder WER beteiligt ist. Nie nach Häufigkeit oder Zeit fragen. Nie etwas fragen, das schon gesagt wurde. Höchstens 14 Wörter, eine einzige Frage, mit 2–4 kurzen Antwort-Chips. Wenn die Schilderung reicht: null. Im Zweifel null.`
          : `immer null.`
      }

Format: {"spiegelung": "…", "titel": "…", "aussage": "…", "haeufigkeit": null, "minuten": null, "beteiligt": [], "folge": null, "rueckfrage": null}
oder mit Rückfrage: "rueckfrage": {"frage": "…", "chips": ["…", "…"]}`,
    },
    { role: "user" as const, content: eingabe.geschichte },
  ];
}

// ---------- ③ Zusammenführen ----------
export type PunktFuerKi = {
  id: string;
  bereich: string; // bereits anonymisiert
  istLeitung: boolean;
  zeitfresser: string;
  titel: string;
  aussage: string;
  beteiligt: string[];
  folge: string | null;
};

export function zusammenfuehrenPrompt(
  b: Bestandsaufnahme,
  punkte: PunktFuerKi[],
  gutLaeuft: string[],
  wissen: WissensEintrag[],
) {
  const wissenKurz = wissen.map((w) => ({
    wissenId: w.id,
    loesung: w.loesung,
    art: w.art,
    typischeAufgaben: w.typischeAufgaben,
    grenzen: w.grenzen,
  }));

  return [
    {
      role: "system" as const,
      content: `Du führst die Beiträge aller Beschäftigten eines Betriebs zu einem gemeinsamen Bild zusammen. Alle Beteiligten – Beschäftigte und Leitung – lesen dasselbe Ergebnis. Sprich niemanden direkt an.
${GRUNDREGELN}

${betriebKontext(b)}

Bilde 2 bis 4 "faeden". Ein Faden ist EIN Problem mit gemeinsamer Ursache, das mehrere Personen oder Bereiche aus verschiedenen Richtungen beschreiben. Fasse nach Ursache zusammen, nicht nach Symptom: „Teil passt auf der Baustelle nicht“ und „unklar, welche Zeichnung gilt“ gehören zusammen, wenn beide am Zeichnungsstand hängen. Der wichtigste Faden zuerst.

Je Faden:
- "id": "f1", "f2", …
- "aufgabe": die gemeinsame Aufgabe als positives Ziel, ein Satz (z. B. „Alle erkennen den freigegebenen Zeichnungsstand eines Auftrags eindeutig.“).
- "problem": was passiert, wo, mit welchen Folgen – 1–2 Sätze, sachlich.
- "punktIds": ids der Punkte, die zu diesem Faden gehören. Jeder Punkt höchstens in einem Faden. Punkte, die nirgends passen, weglassen.
- "sichtweisen": je beteiligtem Bereich EIN Eintrag {"bereich": genau die Bereichsangabe aus den Punkten, "aussage": kurze, typische Aussage aus diesem Bereich, nah am Wortlaut, höchstens 20 Wörter}. Bereichsangaben exakt übernehmen, auch „ein anderer Bereich“.
- "unterschied": wo die Sichtweisen auseinandergehen oder sich ergänzen, ein Satz – oder null.
- "ansaetze": 2–3 Ansätze. ZUERST ein organisatorischer Ansatz (art "prozess") oder "keineTechnik". Danach höchstens zwei technische (art "software", "kiAssistenz" oder "robotikHardware"), nur wenn sie zur Aufgabe passen. Je Ansatz: "text" (was, in Alltagssprache), "warum" (warum es zu diesem Faden passen könnte), "wasFehlt" (was für eine Bewertung noch geklärt werden muss), "herkunft" und "wissenId". "herkunft": "rokiGeprueft" NUR wenn der Ansatz einem Eintrag des ROKI-Wissensauszugs entspricht – dann dessen "wissenId". Sonst "nichtGeprueft" und "wissenId": null. Keine Firmen, Produkte oder Anbieter nennen.
- "ersterSchritt": ein kleiner, konkreter Prüfauftrag für 2–6 Wochen, mit beteiligten Rollen (keine Namen), z. B. „Bei drei laufenden Aufträgen vier Wochen lang festhalten, wie Zeichnungsänderungen die Werkstatt erreichen.“

Außerdem:
- "staerken": 1–3 kurze Sätze, was gut läuft (aus den Angaben).
- "offeneFragen": 2–4 Fragen, die für eine Entscheidung noch offen sind (Kosten, Machbarkeit, fehlende Sichtweisen).

ROKI-Wissensauszug (einzige Quelle für "rokiGeprueft"):
${JSON.stringify(wissenKurz)}

Format: {"faeden": [{"id": "f1", "aufgabe": "…", "problem": "…", "punktIds": ["…"], "sichtweisen": [{"bereich": "…", "aussage": "…"}], "unterschied": null, "ansaetze": [{"art": "prozess", "text": "…", "warum": "…", "wasFehlt": "…", "herkunft": "nichtGeprueft", "wissenId": null}], "ersterSchritt": "…"}], "staerken": ["…"], "offeneFragen": ["…"]}`,
    },
    {
      role: "user" as const,
      content: JSON.stringify({ punkte, wasGutLaeuft: gutLaeuft }),
    },
  ];
}
