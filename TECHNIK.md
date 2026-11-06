# Technik

**Stand:** 06.11.2026 · Version 5 (persönliche App, Befund)
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

## 2. Seiten, Sprache, Gestaltung (Workflow v3, KONZEPT_V3.md)

| Pfad (Deutsch) | Wer | Inhalt |
|---|---|---|
| `/de` | alle | Startseite im Feed-Stil: Code eingeben (führt in den Feed), Projekt anlegen, Handy mit Beispielkarte, Gesten, Live-Übergabe-Karte, Beispiele, Hausordnung, Demo zurücksetzen |
| `/de/feed/[code]` | jede Person | **Feed (Klo-Test):** Bereich antippen → bis zu 10 Vollbild-Karten. → kenn ich · ← nicht bei uns · ↑ ständig · gedrückt halten = dazu erzählen (Sprache oder ein Satz). Nach jeder Geste Resonanz („7 von 11 kennen das“, erst ab 3 Stimmen). Erzählen → KI macht eine anonyme Karte → Person gibt frei → Karte geht an die betroffenen Bereiche. Karte „Was daraus wurde“, sobald die Leitung eine Lösung testet |
| `/de/ich/[code]` | jede Person | **Persönliche App** (anonyme Sitzung je Gerät, Tabelle `zugaenge`, nie mit Namen). Bereich einmal wählen, dann Navbar: **Karten** (5 Karten mit Kontext, Fotos, 1–2 Memes; danach „Etwas melden“ oder „Für heute fertig“) · **● Melden** (Was hakt / Was gut läuft; die KI zerlegt Meldungen in einzelne Probleme) · **Überblick** (gemeldete Probleme, schnell gelesen ohne auf die KI zu warten) |
| `/de/feed/[code]` | Link/QR | **Ein Team-Code für alle.** Öffnet die anonyme App; das Gerät merkt sich seine Sitzung (localStorage), damit eine Person ein Beitrag bleibt |
| `/de/leitung/[code]` | Leitung | **Dashboard** mit privatem Leitungs-Code (`bestandsaufnahmen.leitung_code`, Demo: `LTG-HEIDE1`): Team-Code teilen (Link, WhatsApp, QR-Code, Aushang drucken), Stand, Befund, Lösungen, Fahrplan, Live-Bild |
| `/de/plan/[code]` | Leitung | **Fahrplan als PDF** (Drucken → als PDF sichern): Befund in Kürze, Was gut läuft, Vorgehen in Wochen, Lösungen im Detail, Hinweise. Alles aus den Daten berechnet |
| `/de/live/[code]` | Beamer | Jury-Modus: Übergabe-Karte, Stunden, Euro und Stimmen, alle 2 s neu geladen |
| `/de/anlegen` | Leitung | Eckdaten, Bereiche mit Stundensatz-Spanne, Deadline, Website, Anrede → KI bereitet Chips und Rückfragen vor → Code und Einladung |
| `/de/zugang` | Beschäftigte | Code eingeben (`?ziel=analyse` führt zur Analyse) |
| `/de/befragung/[code]` | jede Person | Ausführliche Befragung (bleibt erreichbar, bis der Feed trägt): Bereich → Aufgaben-Chips des Bereichs + „Etwas anderes …“ → Erzählen → Spiegelung, ≤ 1 Rückfrage → Regler (wie oft, wie lange, wie sehr bremst es) und Übergabe von/an → bestätigen → Mitsprache → Rückmeldung nach Datenlage |
| `/de/analyse/[code]` | alle mit Code | Kernzahl, Übergabe-Karte, Top 3, Mitsprache; zweiter Blick: alle Felder mit Sichtweisen, Profil, Stärken |
| `/de/loesungen/[code]` | alle mit Code | Karte mit Umschalter heute / mit Lösungen, Kacheln, Details mit Bauplan-Prompt und Knopf „Testen wir“, ein Szenario-Regler, erste Schritte |

**Wie Gesten in die vorhandenen Felder schreiben (`lib/feed.ts`):** Eine Feed-Sitzung ist ein Beitrag (`feed-<sitzung>`), jede bestätigte Karte ein Punkt mit der Übergabe der Karte. Eine Bestätigung übernimmt die **typische Schätzung** im Handlungsfeld (Häufigkeit und Minuten zusammen, Median nach Stunden, bevorzugt aus dem eigenen Bereich); „ständig“ = eine Häufigkeitsstufe höher. Ohne Zeitangabe im Feld (z. B. körperliche Belastung) zählt die Stimme ohne Stunden. Pro Person und Handlungsfeld zählt genau eine Stimme (Karte und Meme zum selben Problem nicht doppelt). Punkte von Karten mit Handlungsfeld hängt der Code ohne KI an (`mitFeedStimmen` in `lib/gesamtbild.ts`), deshalb wächst der Graph sofort. Karten ohne Handlungsfeld (Startkarten eines neuen Betriebs) ordnet die KI wie eine Erzählung zu. „Nicht bei uns“ steht nur in `reaktionen` und zählt als Gegenstimme in der Resonanz. Im Browser gemerkt werden nur Sitzungs-ID, Bereich und beantwortete Karten.

**Karten:** Typen `aussage` (Problem + Kontext, Demo-Karten teils mit KI-erzeugtem Foto in `public/karten/`), `meme` (eigenes KI-Bild + Bildunterschrift über Zustände, 1–2 pro Runde, Reaktion „Genau so“ / „Nicht lustig, weil wahr“ zählt als Stimme), `lob` („Was gut läuft“ aus dem Melden-Knopf, erscheint im Befund und im Fahrplan). Demo = die Sichtweisen aus dem geprüften Gesamtbild (schon anonym, Ich-Form). Neuer Betrieb = Startkarten, die die KI nach dem Anlegen im Hintergrund aus Branche, Bereichen, Aufgaben und Website schreibt; sie tragen sichtbar „Startkarte von ROKIO“. Neue Meldungen = KI-Karte aus der Erzählung, erst nach Freigabe durch die Person gespeichert.

Texte der Oberfläche stehen in `messages/de.json`, `messages/en.json` hat dieselben Schlüssel (Übersetzung folgt). Die Befragung gibt es in Du und Sie (ICU `select` auf `anrede`). Einsprechen nutzt die Spracherkennung des Browsers (`app/[locale]/_komponenten/eingabe.tsx`), ohne neue Abhängigkeit. Gestaltung nach `DESIGN.md`. Übergabe-Karte und Profil sind SVG aus `lib/karte.ts` bzw. `_komponenten/profil.tsx`, ohne Diagramm-Bibliothek.

---

## 3. KI-Schritte

Alle Aufrufe auf dem Server über `lib/ki/model.ts`, Prompts in `lib/ki/prompts.ts`, Schritte in `lib/ki/schritte.ts`. Jede Ausgabe wird mit zod geprüft; bei Formatfehler einmal mit der Fehlermeldung neu gefragt (`lib/ki/json.ts`), danach Demo-Modus.

| Schritt | Eingabe | Ausgabe | Hinweise |
|---|---|---|---|
| **① Vorbereiten** | Eckdaten, Bereiche, Ziel, Text der Website (Server liest sie, `lib/website.ts`) | `Profil`: Kurzbeschreibung, Externe, Aufgaben-Chips und Rückfragen je Bereich | einmal beim Anlegen; Leitung kann Chips ändern |
| **② Verstehen** | Bereich, gewählte Aufgabe, Erzählung, Rückfragen-Vorrat | `Verstaendnis`: Spiegelung (1 Satz), Titel, neutrale Aussage, herausgehörte Häufigkeit und Minuten (oder null), Beteiligte, Folge, Übergabe von/an, höchstens eine Rückfrage mit Chips | Rückfrage nur, wenn unklar ist, was passiert oder wer beteiligt ist; nie nach Häufigkeit/Zeit; höchstens 1 je Thema, 2 je Gespräch |
| **③ Zusammenführen** | alle bestätigten Punkte (Bereiche bereits anonymisiert), „Was läuft gut“ | `Gesamtbild`: 1–5 Fäden mit Kurzname, Aufgabe, Problem, Punkt-IDs, Sichtweisen, Unterschied; Stärken | Nur Probleme, keine Lösungen. Code bereinigt: nur echte Punkt-IDs, jeder Punkt in höchstens einem Faden. Zahlen rechnet `lib/rechnen.ts`. Läuft **einmal** (erstes Bild). Danach wird nur noch ergänzt, siehe ③b. |
| **③b Ergänzen** | neue Punkte, bestehende Fäden mit Beispielen | Zuordnung je Punkt mit kurzer Ursache (`low`, ≈ 3 s); was nirgends passt, wird nach Ursache zu neuen Fäden gruppiert (zweiter Aufruf, ≈ 10 s) | Bestehende Fäden behalten ID, Aufgabe und Reihenfolge; neue bekommen die nächste freie ID (bis 6). Punkte, die nicht zugeordnet werden konnten, bleiben offen und werden beim nächsten Abruf erneut versucht. Steuerung in `lib/gesamtbild.ts`. |

| **④ Lösung** | ein Faden, seine Stimmen, Muster-Katalog (`wissen/loesungsmuster.json`) | `Loesung`: Name, Satz, 3 Schritte, Was es braucht, KI-Kniff, Wofür die Zeit frei wird, Art, Reife, Testlauf, Bauplan-Prompt | je Faden parallel, `medium`, ≈ 20 s; im Hintergrund nach jedem Beitrag (`after`), Rückfall auf der Lösungsseite. Name, Reife und Herkunft kommen aus dem Muster, „von ROKI geprüft“ nur mit `wissenId`. Gilt, solange Faden-ID und Aufgabe gleich bleiben (`lib/loesungen.ts`). |

**Gemeinsame Regeln für alle Prompts:** einfache, ruhige Sprache · nichts erfinden · keine Namen, Schuldzuweisungen neutral · keine Gesundheitsdaten Dritter · keine Einsparungen oder ROI · nur JSON.

---

## 4. Datenformate

Maßgeblich ist `lib/typen.ts` (zod-Schemas, daraus die TypeScript-Typen). Kurzfassung:

- `Bestandsaufnahme`: ID = Code, Betrieb (inkl. Website), Anrede, Ziel, Deadline, `Bereich`[] mit Stundensatz-Spanne, Arbeitswochen, Mindestanzahl, `Profil`
- `Profil`: Kurzbeschreibung, Externe, Chips und Rückfragen je Bereich
- `Beitrag`: Bereich, istLeitung, 1–3 `Punkt`e, Mitsprache (1–5), „Was läuft gut“
- `Punkt`: gewählte Aufgabe, Titel, neutrale Aussage, Häufigkeit, Minuten (eigene Zeit), Beteiligte, Folge, bremst (1–5), von/an
- `Verstaendnis`: KI-Antwort auf eine Erzählung (siehe Schritt ②)
- `Gesamtbild`: `Faden`[] (Kurzname, Aufgabe, Problem, Punkt-IDs, Sichtweisen, Unterschied), Stärken
- `Loesung` je Faden (Schritt ④), gespeichert mit Fingerabdruck
- `LoesungsMuster`, `WissensEintrag`: Wissensbasis in `wissen/`

Euro rechnet `lib/rechnen.ts` mit der Mitte der Spanne des Bereichs, in dem die Person arbeitet.

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

**Supabase (EU, eu-west-1), Schema seit 05.11.2026 angelegt:** `supabase/migrations/20261105120000_workflow_v2.sql`.

| Tabelle | Inhalt |
|---|---|
| `bestandsaufnahmen` | Start der Leitung: Betrieb, Frage, Ziel, Stundensatz, Bereiche, Themen-Chips |
| `beitraege` | eine Antwort je Person; Punkte als JSON (Format `Punkt` in `lib/typen.ts`) |
| `gesamtbilder` | aktuelles gemeinsames Bild je Bestandsaufnahme als JSON, mit Fingerabdruck der Beiträge |
| `beschluesse` | (v2, nicht mehr genutzt) |
| `karten` | Feed-Karten: Text, Bereich, von/an, Handlungsfeld (`20261106100000_feed.sql`) |
| `reaktionen` | Geste je Sitzung und Karte – bewusst ohne Zeitstempel |

- **Zugriff nur über den Server** (`lib/supabase/server.ts`, Service-Role-Key). Row Level Security ist auf allen Tabellen an, es gibt keine Policies; `anon` und `authenticated` haben keine Rechte. Einzelbeiträge erreichen nie den Browser.
- **`lib/speicher.ts`** liest und schreibt; gelesene Zeilen werden mit zod geprüft. Ohne `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` nutzt die App den Speicher im Server (nur lokal sinnvoll).
- **Demo-Daten** legt die App beim ersten Aufruf von `heidekamp` selbst an; „Demo zurücksetzen“ stellt den Ausgangszustand in der Datenbank her.
- **Migrationen** brauchen die Datenbank-Verbindung `SUPABASE_DB_URL` (nur lokal, nicht auf Vercel nötig). Die Datenbank-Typen in `lib/supabase/server.ts` sind von Hand gepflegt und bei Schemaänderungen anzupassen.
- **Später:** Löschen auf Wunsch (Löschen einer Bestandsaufnahme entfernt alles Zugehörige), Aufbewahrungsfristen, Hosting beim Betrieb für die lokale KI.

---

## 7. Demo-Modus

- Ohne `OPENAI_API_KEY`, bei Fehler oder Zeitüberschreitung greift er automatisch und wird angezeigt.
- ① liefert allgemeine Chips je Bereich, ② übernimmt die Erzählung ohne Spiegelung, ③ zeigt das gespeicherte Gesamtbild, ④ zeigt die gespeicherten Lösungen.
- Startdaten (Code `HEIDE1`): `daten/demo/heidekamp/` – Bestandsaufnahme, 11 Beiträge aus `fallstudien/01_metallbau_heidekamp.md` (ohne Werkstattleitung, die live erzählt), geprüftes Gesamtbild (6 Fäden) und geprüfte Lösungen. „Demo zurücksetzen“ auf der Startseite stellt sie her, ohne KI-Aufruf.

---

## 8. Datenschutz in der Demo

- An die Cloud-API und an Supabase gehen **nur fiktive Testdaten**. Keine echten Antworten von echten Beschäftigten.
- API-Schlüssel nur in `.env.local` und in den Vercel-Einstellungen, nie im Repo und nie mit `NEXT_PUBLIC_`. Die Namen stehen in `.env.example`: `OPENAI_API_KEY` und `OPENAI_MODEL`.
- Ziel für echten Einsatz: lokales Modell. Rechtliche Fragen (Datenschutz, Mitbestimmung) sind im Hackathon nicht geprüft. Für die Einführung im Betrieb vorgesehen: Der Betriebsrat ist zu beteiligen (§ 87 Abs. 1 Nr. 6 BetrVG).
- Feed: keine Uhrzeiten, Nutzungsdauern oder Geräteinfos in der Datenbank; Sprache wandelt die Spracherkennung des Browsers in Text; ROKIO bekommt und speichert nur den Text, nie Audio. Achtung: Chrome nutzt dafür einen Google-Dienst – für den echten Einsatz ist eine lokale Transkription vorgesehen.

---

## 9. Ordnerstruktur

```
app/[locale]/           Seiten: Startseite, anlegen, zugang, befragung/[code], analyse/[code], loesungen/[code]
app/[locale]/_komponenten/  Eingabe mit Sprache, Regler, Übergabe-Karte, Profil, Kennzeichnungen
messages/               Texte der Oberfläche (de.json zuerst, en.json mit gleichen Schlüsseln)
lib/ki/                 Modell-Schnittstelle, Prompts, KI-Schritte, JSON-Prüfung
lib/aktionen.ts         Server Actions (Eingaben mit zod geprüft)
lib/gesamtbild.ts       Zusammenführen einmal, danach stabil ergänzen
lib/loesungen.ts        Lösungen je Faden (Hintergrund)
lib/karte.ts            Übergabe-Karte aus von/an
lib/analyse.ts          Zahlen für Analyse und Lösungen
lib/website.ts          Website-Text beim Anlegen lesen
lib/rechnen.ts          Stunden und €
lib/anonym.ts           Bereichsnamen schützen
lib/speicher.ts         Speicherung in Supabase (Rückfall: Speicher im Server)
supabase/migrations/    Datenbankschema
lib/supabase/           Zugriff auf die Datenbank (nur Server)
lib/typen.ts            Datenformate (zod)
wissen/                 roki-wissensauszug.json, loesungsmuster.json
daten/demo/heidekamp/   Startdaten, geprüftes Gesamtbild und geprüfte Lösungen (Code HEIDE1)
```

---

## 10. Neue Abhängigkeiten

Laut `AGENTS.md` nur, wenn der vorhandene Stack es nicht kann – mit Begründung im Pull Request. Absehbar nötig:

| Paket | Wofür |
|---|---|
| Supabase-Client (`@supabase/supabase-js`) | Speicherung (entschieden) |
| — | KI-Aufrufe laufen per `fetch` an OpenAI (`lib/ki/model.ts`). Kein Anbieter-SDK, damit später ein lokales Modell dieselbe Schnittstelle nutzen kann. |
| `zod` | Prüfung der KI-Ausgaben und Eingaben gegen die Datenformate (eingebaut) |
| `qrcode-generator` | QR-Code für Team-Code und Aushang im Dashboard, serverseitig als SVG. Ohne Abhängigkeiten, MIT. Alternative wäre ein fremder Webdienst gewesen, der den Link erhält (06.11.2026) |

---

## 11. Hinweis zum Typcheck

`npm run typecheck` meldet auf einem frischen Checkout „Cannot find name 'LayoutProps'“, solange Next.js seine Routentypen noch nicht erzeugt hat. Einmal `npm run dev` starten oder `npx next typegen` ausführen, dann läuft der Typcheck durch.
