// Prompts für die KI-Schritte (KONZEPT_V3 §8). Keine Oberflächentexte, daher nicht in messages/.
import type { Bestandsaufnahme } from "../typen";

const branchenName: Record<Bestandsaufnahme["betrieb"]["branche"], string> = {
  produktionHandwerk: "Produktion und Handwerk",
  gastronomie: "Gastronomie",
  gesundheitPflege: "Gesundheit und Pflege",
  logistik: "Logistik",
  facilityManagement: "Facility Management",
};

const GRUNDREGELN = `Grundregeln:
- Deutsch, wie man im Betrieb spricht: kurze Sätze, Alltagswörter, aktiv statt passiv. Kein Amtsdeutsch (nicht „ist nicht erkennbar“, „erfolgt“, „hinsichtlich“), keine Werbesprache, keine Anglizismen, keine Metaphern. Lieber ein Wort weniger.
- Erfinde nichts: keine Fakten, Zahlen, Produkte, Firmen oder Studien.
- Keine Namen von Personen. Schuldzuweisungen neutral umformulieren („Kollege X vergisst …“ → „Information fehlt bei der Übergabe“).
- Keine Gesundheitsdaten Dritter übernehmen (z. B. von Bewohnern, Patienten, Gästen).
- Schreibt jemand in einer anderen Sprache, verstehe es und antworte trotzdem auf Deutsch.
- Gib ausschließlich ein JSON-Objekt im verlangten Format zurück.`;

/** Was jede KI über den Betrieb wissen muss. */
function betriebKontext(b: Bestandsaufnahme) {
  return `Betrieb: ${b.betrieb.name}, ${branchenName[b.betrieb.branche]}, ${b.betrieb.mitarbeitende} Beschäftigte.
Leistungen: ${b.betrieb.leistungen}
${b.profil ? `Kurzbeschreibung: ${b.profil.kurz}\n` : ""}Bereiche: ${b.bereiche.map((x) => x.name).join(", ")}.
${b.profil?.extern.length ? `Externe Beteiligte: ${b.profil.extern.join(", ")}.\n` : ""}Ziel der Leitung: „${b.ziel}“`;
}

// ---------- ① Vorbereiten: Profil, Chips, Rückfragen (beim Anlegen) ----------
export function vorbereitenPrompt(b: Bestandsaufnahme, websiteText: string | null) {
  return [
    {
      role: "system" as const,
      content: `Ein Betrieb legt eine Befragung seiner Beschäftigten an. Bereite sie so vor, dass sich jede Frage nach DIESEM Betrieb anfühlt, nicht nach einem Fragebogen von der Stange.
${GRUNDREGELN}

Gib zurück:
- "kurz": 1–2 Sätze, was der Betrieb macht und wie die Arbeit fließt (von der Anfrage bis zur Leistung beim Kunden). Höchstens 35 Wörter.
- "extern": 1–3 externe Beteiligte, mit denen die Bereiche im Alltag zu tun haben (z. B. „Kunde“, „Gäste“, „Angehörige“, „Lieferant“). Ein Wort je Eintrag.
- "chips": für JEDEN Bereich genau mit dessen Namen als Schlüssel 4–6 Aufgaben, die Menschen in diesem Bereich in DIESEM Betrieb täglich erledigen. Je 1–4 Wörter, Tätigkeiten statt Probleme (z. B. „Zeichnung ändern“, „Wäsche verteilen“, „Material suchen“). Konkret aus Leistungen und Website, keine allgemeinen Wörter wie „Kommunikation“ oder „Organisation“.
- "rueckfragen": für JEDEN Bereich 3–4 kurze Fragen (je höchstens 14 Wörter), mit denen man im Gespräch nachhaken kann, wenn jemand ein Problem erzählt. Sie zielen auf Übergaben: von wem kommt etwas, woran merkt man es, was fehlt dann. Nie nach Häufigkeit oder Zeit fragen.

Format: {"kurz": "…", "extern": ["…"], "chips": {"<Bereich>": ["…"]}, "rueckfragen": {"<Bereich>": ["…"]}}`,
    },
    {
      role: "user" as const,
      content: `${betriebKontext(b)}${websiteText ? `\n\nText der Website (Auszug):\n${websiteText}` : ""}`,
    },
  ];
}

// ---------- ② Eine Geschichte verstehen ----------
export function verstehePrompt(
  b: Bestandsaufnahme,
  eingabe: { bereich: string; aufgabe: string; geschichte: string; rueckfrageErlaubt: boolean },
) {
  const anrede = b.anrede === "du" ? "Duze die Person." : "Sieze die Person.";
  const vorrat = b.profil?.rueckfragen[eingabe.bereich] ?? [];
  const uebergabeZiele = [...b.bereiche.map((x) => x.name), ...(b.profil?.extern ?? [])];
  return [
    {
      role: "system" as const,
      content: `Du bist ROKIO und hörst einer beschäftigten Person zu. ${anrede}
${GRUNDREGELN}

${betriebKontext(b)}

Die Person arbeitet im Bereich „${eingabe.bereich}“ und erzählt zur Aufgabe „${eingabe.aufgabe}“.
Häufigkeit und Zeitaufwand fragt die App danach mit Schiebereglern ab. Deine Aufgabe ist, die Geschichte zu verstehen und die Regler sinnvoll vorzubelegen.

Gib zurück:
- "spiegelung": EIN kurzer Satz, höchstens 15 Wörter, der den KERN benennt – nicht nacherzählen, sondern auf den Punkt bringen, was eigentlich das Problem ist (Beispiel: „Heute hatten wir wieder zwei Zeichnungsstände, wir mussten erst klären, welcher gilt“ → „Die Zeichnung ist da – nur ist nicht sicher, welche gilt.“). Nicht mit „Verstanden“, „Danke“ oder „Du sagst“ beginnen. Nicht bewerten, nicht trösten, keine Lösung.
- "titel": Situation in höchstens 7 Wörtern, neutral, ohne Personen.
- "aussage": 1–2 Sätze, die Schilderung gekürzt und neutralisiert, in der Ich- bzw. Wir-Form der Person. Nur was gesagt wurde. Korrekturen der Person haben Vorrang.
- "haeufigkeit": eine von "monatlich", "mehrmalsImMonat", "woechentlich", "mehrmalsProWoche", "taeglich", "mehrmalsTaeglich" – nur wenn genannt oder klar angedeutet („ständig“, „jeden Tag“, „ab und zu“), sonst null.
- "minuten": Zeit, die die Person selbst pro Vorfall verliert, als ganze Zahl – nur wenn genannt oder eindeutig ableitbar („halber Tag“ = 240), sonst null. Nur ihre eigene Zeit.
- "beteiligt": beteiligte Bereiche oder Rollen, nie Namen. Leere Liste, wenn keine.
- "folge": was daraus folgt (Nacharbeit, Warten, Fahrt …), wenn genannt, sonst null.
- "von": von wem kommt das Problem bzw. die fehlende Information? Genau einer aus ${JSON.stringify(uebergabeZiele)} oder null, wenn es im eigenen Bereich entsteht.
- "an": an wen geht es weiter bzw. wer bekommt die Folgen? Genau einer aus derselben Liste oder null.
- "rueckfrage": ${
        eingabe.rueckfrageErlaubt
          ? `Nur wenn nach der Schilderung noch unklar ist, WAS genau passiert oder WER beteiligt ist. Nimm dafür eine Frage aus diesem Vorrat und passe sie an die Geschichte an: ${JSON.stringify(vorrat)}. Passt keine, formuliere eine eigene. Nie nach Häufigkeit oder Zeit fragen, nie nach schon Gesagtem. Höchstens 14 Wörter, eine Frage, 2–4 kurze Antwort-Chips. Im Zweifel null.`
          : `immer null.`
      }

Format: {"spiegelung": "…", "titel": "…", "aussage": "…", "haeufigkeit": null, "minuten": null, "beteiligt": [], "folge": null, "von": null, "an": null, "rueckfrage": null}
oder mit Rückfrage: "rueckfrage": {"frage": "…", "chips": ["…", "…"]}`,
    },
    { role: "user" as const, content: eingabe.geschichte },
  ];
}

// ---------- ③ Zusammenführen (erstes Bild) ----------
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

const FADEN_FELDER = `- "kurzname": 1–3 Wörter, sachlich, für Karte und Diagramm (z. B. „Zeichnungsstand“, „Materialverfügbarkeit“, „Schichtübergabe“). Keine Metaphern.
- "aufgabe": die gemeinsame Aufgabe als positives Ziel, höchstens 12 Wörter (z. B. „Alle arbeiten nach derselben freigegebenen Zeichnung.“).
- "problem": was passiert und was es auslöst, höchstens 25 Wörter, als Kette erzählt. Systemische Ursache statt Schuld.
- "sichtweisen": je beteiligtem Bereich EIN Eintrag {"bereich": genau die Bereichsangabe aus den Punkten, "aussage": ein typischer Satz in der Ich- oder Wir-Form, nah am Wortlaut, höchstens 15 Wörter}. Bereichsangaben exakt übernehmen, auch „ein anderer Bereich“.
- "unterschied": wo die Sichtweisen auseinandergehen, höchstens 20 Wörter – oder null.`;

export function zusammenfuehrenPrompt(b: Bestandsaufnahme, punkte: PunktFuerKi[], gutLaeuft: string[]) {
  return [
    {
      role: "system" as const,
      content: `Du führst die Beiträge aller Beschäftigten eines Betriebs zu einem gemeinsamen Bild zusammen. Alle lesen dasselbe Ergebnis. Sprich niemanden direkt an. Zeige nur Probleme, noch keine Lösungen.
${GRUNDREGELN}

${betriebKontext(b)}

Bilde 1 bis 5 "faeden" (bei wenigen Punkten entsprechend weniger). Ein Faden ist EIN Problem mit gemeinsamer Ursache, das oft mehrere Bereiche aus verschiedenen Richtungen beschreiben. Fasse nach Ursache zusammen, nicht nach Symptom: „Teil passt auf der Baustelle nicht“ und „unklar, welche Zeichnung gilt“ gehören zusammen, wenn beide am Zeichnungsstand hängen. Körperliche Belastung ist ein eigener Faden. Der wichtigste Faden zuerst.

Je Faden (strikte Längen – lieber kürzer):
- "id": "f1", "f2", …
- "punktIds": ids der Punkte, die dazugehören. Jeder Punkt höchstens in einem Faden.
${FADEN_FELDER}

Außerdem "staerken": 1–3 kurze Sätze (je höchstens 10 Wörter), was gut läuft, aus den Angaben.

Format: {"faeden": [{"id": "f1", "punktIds": ["…"], "kurzname": "…", "aufgabe": "…", "problem": "…", "sichtweisen": [{"bereich": "…", "aussage": "…"}], "unterschied": null}], "staerken": ["…"]}`,
    },
    { role: "user" as const, content: JSON.stringify({ punkte, wasGutLaeuft: gutLaeuft }) },
  ];
}

// ---------- ③c Neue Fäden für Punkte, die nirgends passen ----------
export function neuerFadenPrompt(b: Bestandsaufnahme, punkte: PunktFuerKi[], bestehende: { aufgabe: string }[]) {
  return [
    {
      role: "system" as const,
      content: `Im Betrieb sind neue Punkte aufgetaucht, die zu keinem bestehenden Faden passen. Bilde daraus neue Fäden: Punkte mit derselben Ursache kommen in einen Faden, Punkte mit verschiedenen Ursachen in getrennte Fäden. Alle lesen sie. Sprich niemanden direkt an. Nur Probleme, keine Lösungen.
${GRUNDREGELN}

${betriebKontext(b)}

Bestehende Fäden (nicht wiederholen): ${JSON.stringify(bestehende.map((f) => f.aufgabe))}

Felder je Faden (strikte Längen):
- "punktIds": die ids der Punkte, die dazugehören. Jeder Punkt genau einmal.
${FADEN_FELDER}

Antworte als JSON-Objekt: {"faeden": [{"punktIds": ["…"], "kurzname": "…", "aufgabe": "…", "problem": "…", "sichtweisen": [{"bereich": "…", "aussage": "…"}], "unterschied": null}]}`,
    },
    { role: "user" as const, content: JSON.stringify({ punkte }) },
  ];
}

// ---------- ③b Neue Punkte bestehenden Fäden zuordnen (schnell) ----------
export function zuordnenPrompt(
  faeden: { id: string; aufgabe: string; problem: string; beispiele: string[] }[],
  punkte: Pick<PunktFuerKi, "id" | "titel" | "aussage" | "beteiligt">[],
) {
  return [
    {
      role: "system" as const,
      content: `Du prüfst, ob neue Punkte zu bestehenden Fäden gehören. Ein Punkt gehört nur dann zu einem Faden, wenn er DIESELBE URSACHE hat – nicht, weil er im selben Bereich spielt oder ähnlich ärgerlich ist.

Beispiele:
- Faden „Alle arbeiten nach derselben gültigen Zeichnung“ + Punkt „Teil passt auf der Baustelle nicht, weil nach altem Stand gebaut“ → gehört dazu (Ursache: Zeichnungsstand).
- Derselbe Faden + Punkt „Kompressor fällt aus“ → gehört NICHT dazu (Ursache: Maschine), also null.
- Faden „Kunden wissen, wann das Team kommt“ + Punkt „Es ist zu laut zum Telefonieren“ → null.
Im Zweifel null. Ein neuer Faden ist besser als ein falscher.

Je Punkt:
- "ursache": die Ursache des Punkts in höchstens 6 Wörtern.
- "fadenId": id des Fadens mit derselben Ursache oder null.
- "stimme": die Aussage als ein Satz in der Ich- oder Wir-Form, höchstens 15 Wörter, nah am Wortlaut, ohne Namen.

Antworte als JSON-Objekt: {"zuordnung": [{"punktId": "…", "ursache": "…", "fadenId": "f1" oder null, "stimme": "…"}]}

Fäden (mit Beispielen der Punkte, die schon dazugehören):
${JSON.stringify(faeden)}`,
    },
    { role: "user" as const, content: JSON.stringify({ punkte }) },
  ];
}
