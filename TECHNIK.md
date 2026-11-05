# Technik

**Stand:** 05.11.2026 · Version 3 (Workflow v2)
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

| Pfad (Deutsch) | Wer | Inhalt |
|---|---|---|
| `/de` | alle | Einstieg: die drei Momente, Demo zurücksetzen |
| `/de/start` | Leitung | ① Starten: Frage, Ziel, Bereiche, Stundensatz → Einladung |
| `/de/mitmachen/[id]` | jede Person | ② Erzählen: Chips, Erzählung mit Spiegelung, Regler, „So habe ich dich verstanden“, „Du bist nicht allein“ |
| `/de/ergebnis/[id]` | alle | ③ Verstehen: Problemfäden, Kosten, Ansätze, erster Schritt, Präsentationsmodus |

Texte der Oberfläche stehen in `messages/de.json`, `messages/en.json` hat dieselben Schlüssel (Übersetzung folgt). Die Oberfläche duzt (Demo-Betrieb hat „Du“ gewählt); eine Sie-Variante fehlt noch. Einsprechen nutzt die Spracherkennung des Browsers (`app/[locale]/_komponenten/eingabe.tsx`), ohne neue Abhängigkeit; der Text ist vor dem Absenden korrigierbar. Gestaltung nach `DESIGN.md`.

---

## 3. KI-Schritte

Alle Aufrufe auf dem Server über `lib/ki/model.ts`, Prompts in `lib/ki/prompts.ts`, Schritte in `lib/ki/schritte.ts`. Jede Ausgabe wird mit zod geprüft; bei Formatfehler einmal mit der Fehlermeldung neu gefragt (`lib/ki/json.ts`), danach Demo-Modus.

| Schritt | Eingabe | Ausgabe | Hinweise |
|---|---|---|---|
| **① Zeitfresser** | Betrieb, Frage und Ziel der Leitung | 8 Chips à 2–4 Wörter | Situationen, keine Technik |
| **② Verstehen** | Bereich, gewählter Zeitfresser, Erzählung | `Verstaendnis`: Spiegelung (1 Satz), Titel, neutrale Aussage, herausgehörte Häufigkeit und Minuten (oder null), Beteiligte, Folge, höchstens eine Rückfrage mit Chips | Rückfrage nur, wenn unklar ist, was passiert oder wer beteiligt ist; nie nach Häufigkeit/Zeit; höchstens 1 je Thema, 2 je Gespräch |
| **③ Zusammenführen** | alle bestätigten Punkte (Bereiche bereits anonymisiert), „Was läuft gut“, Wissensauszug | `Gesamtbild`: 2–4 Fäden mit Punkt-IDs, Sichtweisen, Unterschied, Ansätzen, erstem Schritt; Stärken; offene Fragen | Code bereinigt: nur echte Punkt-IDs, jeder Punkt in höchstens einem Faden, „von ROKI geprüft“ nur mit gültiger `wissenId`, Ablauf-Ansatz zuerst. Zahlen rechnet `lib/rechnen.ts`. Ergebnis wird zwischengespeichert und nur bei neuen Beiträgen neu erzeugt (`lib/gesamtbild.ts`). |

**Gemeinsame Regeln für alle Prompts:** einfache, ruhige Sprache · nichts erfinden · keine Namen, Schuldzuweisungen neutral · keine Gesundheitsdaten Dritter · keine Einsparungen oder ROI · nur JSON.

---

## 4. Datenformate

Maßgeblich ist `lib/typen.ts` (zod-Schemas, daraus die TypeScript-Typen). Kurzfassung:

- `Bestandsaufnahme`: Betrieb, Leitung, Anrede, Frage, Ziel, Stundensatz, Arbeitswochen, Bereiche, Mindestanzahl, Zeitfresser-Chips, Besprechungstermin
- `Beitrag`: Bereich, istLeitung, Zustimmung zur Nennung des Bereichs, 1–3 `Punkt`e, Stimmungswert „bremst“ (1–5), „Was läuft gut“
- `Punkt`: Zeitfresser, Titel, neutrale Aussage, Häufigkeit (Reglerstufe), Minuten pro Mal (eigene Zeit), Beteiligte, Folge
- `Verstaendnis`: KI-Antwort auf eine Erzählung (siehe Schritt ②)
- `Gesamtbild`: `Faden`[] (Aufgabe, Problem, Punkt-IDs, Sichtweisen, Unterschied, `Ansatz`[], erster Schritt), Stärken, offene Fragen
- `Beschluss`: Faden, verantwortliche Rolle, Datum
- `WissensEintrag`: wie bisher (Abschnitt 5)

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

- Ohne `OPENAI_API_KEY`, bei Fehler oder Zeitüberschreitung (20 Sekunden) greift er automatisch und wird in der Oberfläche angezeigt.
- ① nutzt die gespeicherten Zeitfresser-Chips, ② übernimmt die Erzählung ohne Spiegelung, ③ zeigt `daten/demo/heidekamp/gesamtbild.json` und hängt neue Punkte an den Faden mit demselben Zeitfresser.
- Startdaten: `daten/demo/heidekamp/bestandsaufnahme.json` und `beitraege.json` (acht fiktive Beiträge). Laufzeitdaten liegen bis zur Supabase-Anbindung im Speicher des Servers (`lib/speicher.ts`); „Demo zurücksetzen“ auf der Startseite stellt den Ausgangszustand her.
- Das gespeicherte Gesamtbild vor dem Pitch von einem Menschen lesen lassen.

---

## 8. Datenschutz in der Demo

- An die Cloud-API und an Supabase gehen **nur fiktive Testdaten**. Keine echten Antworten von echten Beschäftigten.
- API-Schlüssel nur in `.env.local` und in den Vercel-Einstellungen, nie im Repo und nie mit `NEXT_PUBLIC_`. Die Namen stehen in `.env.example`: `OPENAI_API_KEY` und `OPENAI_MODEL`.
- Ziel für echten Einsatz: lokales Modell. Rechtliche Fragen (Datenschutz, Mitbestimmung) sind im Hackathon nicht geprüft.

---

## 9. Ordnerstruktur

```
app/[locale]/           Seiten: start, mitmachen/[id], ergebnis/[id]
app/[locale]/_komponenten/  Eingabe mit Sprache, Regler, Kennzeichnungen
messages/               Texte der Oberfläche (de.json zuerst, en.json mit gleichen Schlüsseln)
lib/ki/                 Modell-Schnittstelle, Prompts, KI-Schritte, JSON-Prüfung
lib/aktionen.ts         Server Actions (Eingaben mit zod geprüft)
lib/gesamtbild.ts       Zusammenführen mit Zwischenspeicher
lib/rechnen.ts          Stunden und €
lib/anonym.ts           Bereichsnamen schützen
lib/speicher.ts         Laufzeitdaten (Demo), später Supabase
lib/supabase/           Zugriff auf die Datenbank (nur Server)
lib/typen.ts            Datenformate (zod)
wissen/                 roki-wissensauszug.json
daten/demo/heidekamp/   Startdaten und gespeichertes Gesamtbild
```

---

## 10. Neue Abhängigkeiten

Laut `AGENTS.md` nur, wenn der vorhandene Stack es nicht kann – mit Begründung im Pull Request. Absehbar nötig:

| Paket | Wofür |
|---|---|
| Supabase-Client (`@supabase/supabase-js`) | Speicherung (entschieden) |
| — | KI-Aufrufe laufen per `fetch` an OpenAI (`lib/ki/model.ts`). Kein Anbieter-SDK, damit später ein lokales Modell dieselbe Schnittstelle nutzen kann. |
| `zod` | Prüfung der KI-Ausgaben und Eingaben gegen die Datenformate (eingebaut) |

---

## 11. Hinweis zum Typcheck

`npm run typecheck` meldet auf einem frischen Checkout „Cannot find name 'LayoutProps'“, solange Next.js seine Routentypen noch nicht erzeugt hat. Einmal `npm run dev` starten oder `npx next typegen` ausführen, dann läuft der Typcheck durch.
