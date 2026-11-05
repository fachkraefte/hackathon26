# Technik

**Stand:** 05.11.2026 · Version 2
Gehört zu [`PROJEKT.md`](PROJEKT.md). Bei Widersprüchen gilt `PROJEKT.md`. Für Stack, Stil und Arbeitsweise im Code gilt zusätzlich [`AGENTS.md`](AGENTS.md). Alles hier ist ein **Vorschlag für den Hackathon** und darf vom Team angepasst werden – Änderungen bitte hier eintragen.

---

## 1. Überblick

```
Handy/Browser ──► Next.js auf Vercel (Seiten + API-Routen) ──► Modell-Schnittstelle ──► Cloud-Modell (Demo)
                          │                                            └─────────► lokales Modell (später)
                          ├──► Wissensauszug (wissen/roki-wissensauszug.json)
                          ├──► Supabase (EU-Region): Bestandsaufnahmen, Antworten, Ergebnisse
                          └──► Testdaten und Demo-Ergebnisse (daten/demo/*.json im Repo)
```

- **Next.js** mit App Router und TypeScript (Grundgerüst steht im Repo, Regeln in `AGENTS.md`)
- **Alle KI-Aufrufe laufen auf dem Server** (API-Routen bzw. Server Actions). Der API-Schlüssel kommt nie in den Browser.
- **Eine Modell-Schnittstelle** im Code: `lib/ki/model.ts`. Heute steckt dahinter OpenAI (per `fetch`, ohne Anbieter-SDK), später ein lokales Modell. Der Rest der App merkt den Wechsel nicht. Der Schlüssel heißt `OPENAI_API_KEY`, der Modellname `OPENAI_MODEL` (Standard `gpt-6.1-sol`). Beides nur auf dem Server. Ein Aufruf wartet höchstens 20 Sekunden.
- **Jede KI-Ausgabe ist JSON nach festem Format** (Abschnitt 4) und wird geprüft, bevor sie gespeichert wird (Vorschlag: `zod`).

---

## 2. Seiten, Sprache, Gestaltung

Alle Seiten liegen unter `app/[locale]/` und haben ein Sprachpräfix. Deutsch ist Standard (`/de/…`), Englisch folgt später (`/en/…`). Links und Weiterleitungen immer über `@/i18n/navigation`.

| Pfad (Beispiel Deutsch) | Wer | Inhalt |
|---|---|---|
| `/de` | alle | kurze Erklärung, Start |
| `/de/anlegen` | Leitung | Branche, Größe, Bereiche, Anrede, Einladungslinks |
| `/de/abfrage/[linkId]` | Beschäftigte | Einzelabfrage als Gespräch, danach Selbsteinschätzung |
| `/de/karte/[antwortId]` | die Person selbst | Aufgabenkarte prüfen, korrigieren, bestätigen; danach Einordnung |
| `/de/ergebnis/[bestandsaufnahmeId]` | alle Beteiligten | Gesamtbild, Profildiagramm, Fahrplan |
| `/de/besprechung/[bestandsaufnahmeId]` | alle Beteiligten | Besprechungsvorlage, Eingabe von Zielwerten und Beschlüssen |

**Texte:** Alle festen Texte der Oberfläche stehen in `messages/de.json` (zuerst) und mit gleichen Schlüsseln in `messages/en.json`. Die KI antwortet im Hackathon auf Deutsch; später richtet sich die Sprache der Prompts nach der gewählten Sprache.

**Gestaltung:** Handy zuerst. Vorerst nach `DESIGN.md`: Schrift Rubik (über `next/font`); Navy `#15263E`, Türkis `#2FB9CB`, Orange `#F08119` sparsam, Hintergrund `#F6F8FA`; Text auf farbigen Buttons in Navy, nicht Weiß. Werte als CSS-Variablen in `app/globals.css`, einfaches CSS bzw. CSS-Module, kein Tailwind und keine Komponentenbibliothek (siehe `AGENTS.md`).

---

## 3. KI-Schritte

| Schritt | Eingabe | Ausgabe | Hinweise |
|---|---|---|---|
| **1a Gespräch** | Branche, Bereich, Anrede, Leitfragen, bisheriger Verlauf | nächste Frage (Text) | höchstens 2 Nachfragen je Leitfrage; keine Technik vorschlagen; Gesprächsende nach Leitfrage 7 |
| **1b Aufgabenkarte** | kompletter Gesprächsverlauf + Selbsteinschätzung | `Aufgabenkarte` | Namen und Schuldzuweisungen neutralisieren; Gesundheitsdaten Dritter weglassen; nur übernehmen, was gesagt wurde |
| **2 Einordnung** | bestätigte `Aufgabenkarte` + Wissensauszug + Entscheidungsmatrix | `Einordnung` | „von ROKI geprüft“ nur mit `wissenId` aus dem Auszug; „keine Technik nötig“ ist erlaubt; die Entscheidungsmatrix aus der Branchen-Problemanalyse dient als Begründung, nicht als Beleg |
| **3 Gesamtbild** | alle bestätigten Aufgabenkarten + Einordnungen | `Gesamtbild` | erst ab Mindestanzahl je Gruppe; Profilwerte werden **im Code** berechnet, nicht von der KI |
| **4 Fahrplan** | `Gesamtbild` + Einordnungen | `Fahrplan` | jede Maßnahme verweist auf ein Thema; erster Schritt muss konkret sein |
| **5 Besprechung** | alle Daten | Seite | **keine KI nötig** – Vorlage wird im Code aus den Daten gebaut |

**Gemeinsame Regeln für alle Prompts:**
- Antworte auf Deutsch, in einfacher, ruhiger Sprache, nach `ROKI_SPRACHE_UND_TONALITAET.md`.
- Erfinde keine Fakten, Zahlen, Produkte, Firmen oder Studien.
- Zahlen zu Zeitaufwand nur aus den Angaben der Beschäftigten.
- Keine Einsparungen, Amortisationszeiten oder ROI berechnen.
- Bei Unsicherheit: weglassen oder als offene Frage formulieren.
- Gib ausschließlich JSON im vorgegebenen Format zurück (außer Schritt 1a).

**Wenn die Prüfung einer KI-Ausgabe fehlschlägt:** einmal mit der Fehlermeldung erneut anfragen. Schlägt es wieder fehl: Fehler anzeigen und im Demo-Modus das gespeicherte Ergebnis nehmen.

---

## 4. Datenformate

Fachliche Feldnamen auf Deutsch in camelCase (wie in der ROKI-Plattform), ohne Umlaute. Technische Bezeichner im Code dürfen englisch sein.

```ts
// ---------- Grundbegriffe ----------
type Branche =
  | "gesundheitPflege"
  | "gastronomie"
  | "logistik"
  | "produktionHandwerk"
  | "facilityManagement";

type Dimension =
  | "informationUebergaben"
  | "dokumentationVerwaltung"
  | "planungKoordination"
  | "koerperlicheBelastung"
  | "wissenEinarbeitung"
  | "digitaleWerkzeuge";

type Wert = 1 | 2 | 3 | 4 | 5; // 1 = klappt schlecht, 5 = klappt gut

type Loesungsart = "prozess" | "software" | "kiAssistenz" | "robotikHardware" | "keineTechnik";
type Reifegrad = "imEinsatz" | "pilot" | "forschung";
type Herkunft = "rokiGeprueft" | "nichtGeprueft";
type Aufwand = "gering" | "mittel" | "hoch";
type Zeitraum = "kurz" | "mittel" | "lang"; // bis 3 Monate | 3–12 Monate | über 12 Monate
type Haeufigkeit = "mehrmalsTaeglich" | "taeglich" | "woechentlich" | "monatlich" | "selten";
type Belastungsart = "zeit" | "koerperlich" | "nerven" | "fehleranfaellig" | "wartezeit";

// ---------- Anlegen ----------
interface Betrieb {
  id: string;
  name: string;
  branche: Branche;
  mitarbeitende: number;
  ort: string;
  fiktiv: boolean; // in der Demo immer true
}

interface Bereich {
  id: string;
  name: string; // z. B. "Werkstatt"
  linkId: string; // Einladungslink
  erwarteteAntworten: number;
}

interface Bestandsaufnahme {
  id: string;
  betriebId: string;
  bereiche: Bereich[];
  anrede: "sie" | "du";
  mindestanzahl: number; // Vorschlag: 3
  status: "offen" | "abgeschlossen";
}

// ---------- Schritt 1 ----------
interface Antwort {
  id: string;
  bestandsaufnahmeId: string;
  bereichId: string;
  istLeitung: boolean; // Antworten der Leitung sind nie anonym
  sichtbarkeitKleineGruppe?: "zusammenlegen" | "mitRolleZeigen";
  verlauf: { von: "ki" | "person"; text: string }[];
  selbsteinschaetzung: Record<Dimension, Wert>;
}

interface Uebergabe {
  von: string; // Bereich oder Rolle, nie ein Name
  an: string;
  problem: string;
}

interface Aufgabe {
  id: string;
  titel: string;
  beschreibung: string;
  haeufigkeit: Haeufigkeit;
  stundenProWoche?: number; // nur wenn die Person es angegeben hat
  belastung: Belastungsart[];
  uebergabe?: Uebergabe;
  aussage: string; // gekürzte, neutralisierte Original-Aussage
}

interface Aufgabenkarte {
  antwortId: string;
  aufgaben: Aufgabe[];
  wasGutLaeuft: string[];
  wunsch?: string; // Leitfrage 7
  bestaetigt: boolean;
  korrigiert: boolean; // hat die Person etwas geändert?
}

// ---------- Schritt 2 ----------
interface Loesungsvorschlag {
  art: Loesungsart;
  beschreibung: string;
  reifegrad?: Reifegrad; // entfällt bei "prozess" und "keineTechnik"
  herkunft: Herkunft;
  wissenId?: string; // Pflicht, wenn herkunft = "rokiGeprueft"
  aufwand: Aufwand;
  aufwandHinweis: string; // was den Aufwand bestimmt
  wasPruefen: string[];
}

interface Einordnung {
  antwortId: string;
  aufgabeId: string;
  vorschlaege: Loesungsvorschlag[];
}

// ---------- Schritt 3 ----------
interface Thema {
  id: string;
  titel: string;
  beschreibung: string;
  bereiche: string[]; // betroffene Bereiche
  anzahlNennungen: number;
  istSchnittstelle: boolean;
  aussagen: string[]; // nur aus Gruppen ≥ Mindestanzahl oder mit Zustimmung
  stundenProWoche?: number; // Summe der Angaben der Beschäftigten
  vermuteteUrsache?: string; // als Vermutung gekennzeichnet
}

interface Profilwert {
  dimension: Dimension;
  bereich: string | "gesamt";
  ist: number; // Durchschnitt, im Code berechnet
  anzahl: number;
  ziel?: Wert; // trägt das Team in der Besprechung ein
}

interface Gesamtbild {
  bestandsaufnahmeId: string;
  antwortenGesamt: number;
  themen: Thema[];
  staerken: string[];
  profil: Profilwert[];
}

// ---------- Schritt 4 ----------
interface Massnahme {
  id: string;
  zeitraum: Zeitraum;
  titel: string;
  themaId: string;
  art: Loesungsart;
  ersterSchritt: string;
  wasPruefen: string[];
  werHilft: ("intern" | "rokiWissen" | "rokiBeratung" | "rokiNetzwerk")[];
  herkunft: Herkunft;
  wissenId?: string;
}

interface Fahrplan {
  bestandsaufnahmeId: string;
  massnahmen: Massnahme[];
}

// ---------- Schritt 5 ----------
interface Beschluss {
  bestandsaufnahmeId: string;
  zielwerte: { dimension: Dimension; ziel: Wert }[];
  ersterTestlauf: string;
  verantwortlich: string; // Rolle, kein Name nötig
  nachschauenAm?: string; // Datum
}

// ---------- Wissensauszug ----------
interface WissensEintrag {
  id: string; // z. B. "cobot-01"
  loesung: string; // z. B. "Kollaborativer Roboter (Cobot)"
  art: Loesungsart;
  branchen: Branche[];
  typischeAufgaben: string[];
  reifegrad: Reifegrad;
  grenzen: string[];
  quelle: { datei: string; abschnitt: string };
}
```

---

## 5. ROKI-Wissensauszug

**Datei:** `wissen/roki-wissensauszug.json` – ein Array von `WissensEintrag`.

**Regeln:**
- Nur Inhalte aus den drei geprüften Recherchen im Repo. Nichts ergänzen.
- Aus `ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md` nur Ansätze mit **[ROKI geprüft]** übernehmen. Als Quelle die dort genannte Recherche-Datei angeben, nicht die Problemanalyse.
- Jeder Eintrag nennt Datei und Abschnitt als Quelle.
- Reifegrad und Grenzen so übernehmen, wie die Recherche sie beschreibt. Herstellerangaben nicht als Beleg für Wirkung behandeln.
- Lieber wenige richtige Einträge als viele ungenaue. Für die Demo reichen etwa 10–15 Einträge.

**Gute Startpunkte in den Recherchen:**
- `ROKI_Recherche_Robotertypen_geprueft.md`: Kurzfazit (Abschnitt 2), Abschnitt 4 „KMU“ und „Sektormatrix“, Abschnitt 5 „Praxisbeispiele“
- `ROKI_Recherche_Roboter_in_der_Pflege_2026-08-18_geprueft.md`: Kurzfazit (Abschnitt 2), Abschnitt 4, Abschnitt 5
- `ROKI_Recherche_Roboterhunde_2026-08-13_geprueft.md`: Abschnitt 4.2 und 5

**Beispiel (Inhalt aus der Robotertypen-Recherche):**

```json
{
  "id": "cobot-01",
  "loesung": "Kollaborativer Roboter (Cobot)",
  "art": "robotikHardware",
  "branchen": ["produktionHandwerk", "logistik"],
  "typischeAufgaben": ["Schweißen", "Maschinenbeschickung", "Montage", "Pick-and-Place"],
  "reifegrad": "imEinsatz",
  "grenzen": [
    "Hardwarepreis ist nur ein Teil der Gesamtkosten; Programmierung und Integration können einen großen Teil ausmachen",
    "'Kollaborativ' heißt nicht automatisch ohne Schutzeinrichtung – die konkrete Anwendung braucht eine Risikobeurteilung",
    "Wirtschaftlichkeit hängt stärker von Gesamtprozess und Integration ab als vom Arm allein"
  ],
  "quelle": { "datei": "ROKI_Recherche_Robotertypen_geprueft.md", "abschnitt": "2 Kurzfazit; 3.3; 4 Sektormatrix" }
}
```

---

## 6. Speicherung

- **Demo:** JSON-Dateien im Repo unter `daten/demo/` (Betrieb, Bestandsaufnahme, Antworten, Aufgabenkarten) und Laufzeitdaten im Speicher bzw. in einer lokalen Datei.
- **Datenbank:** Supabase. Der Server-Client liegt in `lib/supabase/server.ts` und nutzt den Service-Role-Key. Der Schlüssel bleibt auf dem Server und bekommt nie das Präfix `NEXT_PUBLIC_`. Tabellen werden erst angelegt, wenn das Schema bestätigt ist.
- **Anforderungen für den echten Einsatz:** Hosting in der EU bzw. beim Betrieb selbst, Einzelantworten getrennt vom Gesamtbild, Löschen auf Wunsch.

---

## 7. Demo-Modus

Ziel: Die Demo läuft auch, wenn das Internet oder die API ausfällt.

- Schalter über Umgebungsvariable, z. B. `DEMO_MODUS=an`.
- Für Metallbau Heidekamp liegen **vorher erzeugte und geprüfte** Ergebnisse unter `daten/demo/metallbau-heidekamp/`: `aufgabenkarten.json`, `einordnungen.json`, `gesamtbild.json`, `fahrplan.json`.
- Live läuft nur die Abfrage des Monteurs. Fällt dabei die API aus, wird eine gespeicherte Aufgabenkarte für den Monteur geladen.
- Gesamtbild und Fahrplan werden nach der Live-Abfrage neu erzeugt; bei Fehler oder Zeitüberschreitung (Vorschlag: 20 Sekunden) wird die gespeicherte Fassung angezeigt.
- Die gespeicherten Ergebnisse vor dem Pitch von einem Menschen lesen lassen: stimmen Kennzeichnungen, keine erfundenen Fakten?

---

## 8. Datenschutz in der Demo

- An die Cloud-API und an Supabase gehen **nur fiktive Testdaten**. Keine echten Antworten von echten Beschäftigten.
- API-Schlüssel nur in `.env.local` und in den Vercel-Einstellungen, nie im Repo und nie mit `NEXT_PUBLIC_`. Die Namen stehen in `.env.example`: `OPENAI_API_KEY` und `OPENAI_MODEL`.
- Ziel für echten Einsatz: lokales Modell. Rechtliche Fragen (Datenschutz, Mitbestimmung) sind im Hackathon nicht geprüft.

---

## 9. Ordnerstruktur (Vorschlag)

```
app/[locale]/           Seiten (mit Sprachpräfix)
app/api/                API-Routen für die KI-Schritte (ohne Sprachpräfix)
messages/               Texte der Oberfläche (de.json zuerst, en.json mit gleichen Schlüsseln)
lib/ki/                 Modell-Schnittstelle, Prompts, Prüfung der Ausgaben
lib/supabase/           Zugriff auf die Datenbank (nur Server)
lib/profil.ts           Berechnung der Profilwerte
lib/typen.ts            Datenformate aus Abschnitt 4
wissen/                 roki-wissensauszug.json
daten/demo/             Testdaten und gespeicherte Ergebnisse
```

---

## 10. Neue Abhängigkeiten

Laut `AGENTS.md` nur, wenn der vorhandene Stack es nicht kann – mit Begründung im Pull Request. Absehbar nötig:

| Paket | Wofür |
|---|---|
| Supabase-Client (`@supabase/supabase-js`) | Speicherung (entschieden) |
| — | KI-Aufrufe laufen per `fetch` an OpenAI (`lib/ki/model.ts`). Kein Anbieter-SDK, damit später ein lokales Modell dieselbe Schnittstelle nutzen kann. |
| `zod` (Vorschlag) | Prüfung der KI-Ausgaben gegen die Datenformate |

---

## 11. Hinweis zum Typcheck

`npm run typecheck` meldet auf einem frischen Checkout „Cannot find name 'LayoutProps'“, solange Next.js seine Routentypen noch nicht erzeugt hat. Einmal `npm run dev` starten oder `npx next typegen` ausführen, dann läuft der Typcheck durch.
