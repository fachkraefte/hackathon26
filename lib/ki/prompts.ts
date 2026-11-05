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
- Deutsch, wie man in einem Handwerksbetrieb spricht: kurze Sätze, Alltagswörter, aktiv statt passiv. Kein Amtsdeutsch (nicht „ist nicht erkennbar“, „erfolgt“, „hinsichtlich“), keine Werbesprache, keine Fachbegriffe, keine Anglizismen. Lieber ein Wort weniger.
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
- "spiegelung": EIN kurzer Satz, höchstens 15 Wörter, der den KERN benennt – nicht nacherzählen, sondern auf den Punkt bringen, was eigentlich das Problem ist (Beispiel: Erzählung „Heute hatten wir wieder zwei Zeichnungsstände, wir mussten erst klären, welcher gilt“ → „Die Zeichnung ist da – nur ist nicht sicher, welche gilt.“). Nicht mit „Verstanden“, „Danke“ oder „Du sagst“ beginnen. Nicht bewerten, nicht trösten, keine Lösung.
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

Je Faden (strikte Längen – lieber kürzer):
- "id": "f1", "f2", …
- "aufgabe": die gemeinsame Aufgabe als positives Ziel, höchstens 12 Wörter (z. B. „Alle wissen sicher, welche Zeichnung gilt.“).
- "problem": was passiert und was es auslöst, höchstens 25 Wörter, als Kette erzählt (z. B. „Änderungen laufen über Telefon und Zuruf. Die Werkstatt klärt erst, was gilt – manchmal wird nach altem Stand gebaut und auf der Baustelle nachgearbeitet.“).
- "punktIds": ids der Punkte, die zu diesem Faden gehören. Jeder Punkt höchstens in einem Faden. Punkte, die nirgends passen, weglassen.
- "sichtweisen": je beteiligtem Bereich EIN Eintrag {"bereich": genau die Bereichsangabe aus den Punkten, "aussage": ein typischer Satz aus diesem Bereich in der Ich- oder Wir-Form, so wie die Person es gesagt hat, höchstens 15 Wörter}. Die Stimmen sollen nach den Menschen klingen, nicht nach einem Bericht. Bereichsangaben exakt übernehmen, auch „ein anderer Bereich“.
- "unterschied": wo die Sichtweisen auseinandergehen oder sich ergänzen, höchstens 20 Wörter – oder null.
- "ansaetze": 2–3 Ansätze. ZUERST ein organisatorischer Ansatz (art "prozess") oder "keineTechnik". Danach höchstens zwei technische (art "software", "kiAssistenz" oder "robotikHardware"), nur wenn sie wirklich zur Aufgabe passen. Je Ansatz: "text" (was konkret, höchstens 18 Wörter), "warum" (höchstens 14 Wörter, Bezug auf das, was die Leute gesagt haben), "wasFehlt" (die wichtigste offene Frage, höchstens 12 Wörter), "herkunft" und "wissenId". "herkunft": "rokiGeprueft" NUR wenn der Ansatz einem Eintrag des ROKI-Wissensauszugs entspricht – dann dessen "wissenId". Sonst "nichtGeprueft" und "wissenId": null. Keine Firmen, Produkte oder Anbieter nennen. Das Ziel der Leitung beachten.
- "ersterSchritt": ein kleiner, konkreter Prüfauftrag für 2–6 Wochen mit beteiligten Rollen (keine Namen), höchstens 22 Wörter.

Außerdem:
- "staerken": 1–3 kurze Sätze (je höchstens 10 Wörter), was gut läuft, aus den Angaben.
- "offeneFragen": 2–3 Fragen, je höchstens 14 Wörter, die für eine Entscheidung noch offen sind.

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

// ---------- ③b Neue Punkte bestehenden Fäden zuordnen (schnell) ----------
export function zuordnenPrompt(
  faeden: { id: string; aufgabe: string; problem: string }[],
  punkte: Pick<PunktFuerKi, "id" | "titel" | "aussage" | "beteiligt">[],
) {
  return [
    {
      role: "system" as const,
      content: `Ordne jeden neuen Punkt dem Faden zu, dessen Problem dieselbe Ursache hat. Passt keiner wirklich, gib null an – nicht raten.
Gib zusätzlich je Punkt "stimme": die Aussage als einen Satz in der Ich- oder Wir-Form, höchstens 15 Wörter, nah am Wortlaut, ohne Namen.
Antworte als JSON-Objekt: {"zuordnung": [{"punktId": "…", "fadenId": "f1" oder null, "stimme": "…"}]}

Fäden:
${JSON.stringify(faeden)}`,
    },
    { role: "user" as const, content: JSON.stringify({ punkte }) },
  ];
}
