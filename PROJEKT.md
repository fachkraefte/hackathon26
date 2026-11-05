# Projekt: KI-gestützte Bestandsaufnahme für KMU

**Name:** ROKIO (Robotik und KI)
**Rahmen:** 48-Stunden-AI-Hackathon an der Leuphana Universität Lüneburg, im Rahmen von ROKI – Robotik und KI für die Fachkräftesicherung nutzen (Süderelbe AG)
**Stand:** 05.11.2026 · Version 5 (Workflow v3 in Arbeit, siehe `fallstudien/`)
**Diese Datei ist maßgeblich.** Wenn eine andere Datei widerspricht, gilt `PROJEKT.md`.

| Datei | Wofür |
|---|---|
| `PROJEKT.md` | Was wir bauen und warum, Ablauf, Regeln, Plan, Pitch |
| [`TECHNIK.md`](TECHNIK.md) | Wie wir es bauen: Architektur, KI-Schritte, Datenformate, Speicherung, Demo-Absicherung |
| [`DEMO_BETRIEBE.md`](DEMO_BETRIEBE.md) | Fünf fiktive Testbetriebe, Testdaten für die Live-Demo |
| [`ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md`](ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md) | Branchensicht: typische Belastungen und passende Lösungsansätze, gekennzeichnet nach geprüft / nicht geprüft |
| [`MASTERPROMPT.md`](MASTERPROMPT.md) | Einstieg für neue Teammitglieder und andere KIs |
| [`AGENTS.md`](AGENTS.md) | Regeln für Coding-Agenten (Stack, Stil, Arbeitsweise) |

---

## 1. In einem Satz

**Aus vielen Stimmen im Betrieb ein gemeinsames Bild – und ein realistischer erster Schritt.**

Eine Web-App, mit der ein kleiner oder mittlerer Betrieb seine Beschäftigten zu ihrem Arbeitsalltag befragt. KI ordnet die Antworten, führt sie zusammen und leitet daraus einen Fahrplan ab: Wo hilft eine Prozessänderung, wo Software oder KI, wo Robotik – und wo gar keine Technik. Am Ende steht eine Vorlage für eine Besprechung, in der das ganze Team gemeinsam entscheidet.

---

## 2. Ausgangslage

**ROKI** unterstützt kleine und mittlere Unternehmen in den Landkreisen Harburg, Lüneburg und Stade beim Einstieg in Robotik und KI. Das Angebot ist kostenfrei und EU-gefördert. Schwerpunktbranchen: Gesundheit und Pflege, Gastronomie, Logistik, Produktion und Handwerk, Facility Management.

Herausforderungen der Betriebe laut ROKI-Flyer: zu wenig Zeit und Personal · fehlendes Spezialwissen · komplexe Umsetzung · unklarer Nutzen.

Die Fragen, die Betriebe sich stellen: **Wo fange ich an? Wer kann bei der Einführung helfen? Was rechnet sich?**

**Die Lücke:** Die ROKI-Website bietet Wissen (Grundlagen, Praxisbeispiele, Umsetzung), ein Netzwerk und persönliche Ansprechpartnerinnen. Ein Werkzeug, mit dem ein Betrieb seinen eigenen Bedarf erfasst, gibt es bisher nicht.

**Der Anknüpfungspunkt:** In der ROKI-Projektübersicht sind Metadaten (Branche, Problem, Lösung, Technologie, Aufwand, Nutzen, Partner) ausdrücklich als Grundlage für einen späteren KI-Assistenten vorgesehen. Unser Projekt ist ein Baustein dafür.

---

## 3. Für wen – und was sie davon haben

| Wer | Rolle in der App | Nutzen |
|---|---|---|
| **Beschäftigte** | beantworten die Abfrage, prüfen ihre Aufgabenkarte, entscheiden in der Besprechung mit | werden gehört, ohne sich exponieren zu müssen; ihre eigenen Probleme landen auf dem Tisch; sie sehen dasselbe Ergebnis wie die Leitung |
| **Leitung** | legt die Bestandsaufnahme an, beantwortet selbst (nicht anonym), lädt zur Besprechung ein | ein Bild aus dem ganzen Betrieb statt Bauchgefühl; Prioritäten; Vorlage für eine Entscheidung, die das Team mitträgt |
| **ROKI** | bekommt das Ergebnis nur, wenn der Betrieb es teilt | Betriebe kommen vorbereitet ins Erstgespräch; Beratung beginnt bei konkreten Aufgaben |

**Ausblick (nicht im Hackathon):** Wenn viele Betriebe ihre Ergebnisse anonymisiert und freiwillig teilen, kann ROKI regionale Muster erkennen – etwa welche Aufgaben in einer Branche immer wieder belasten.

---

## 4. Grundsätze

Diese Punkte gelten für jede Entscheidung – Design, Prompts, Texte, Pitch.

1. **Beschäftigte bekommen eine Stimme.** Die Leitung legt an, der Inhalt kommt von unten. Erst die Zusammenführung macht Probleme an Schnittstellen sichtbar.
2. **Aufgabe vor Technik.** Wir fragen nach Tätigkeiten, Belastungen und Übergaben – nicht nach Wunschtechnologien. Während der Abfrage schlägt die KI keine Technik vor.
3. **KI- und Robotik-Lösungen im Vordergrund, konkret für diesen Betrieb.** Jede Lösung wird als Ablauf im Betrieb beschrieben („Die Leitung spricht beim Kunden ein … die Werkstatt sieht …“), nicht als Technikbegriff. Lösungsarten: Software/Automatisierung · KI-Assistenz · Robotik/Hardware. Nötige Absprachen (z. B. „eine Person gibt Zeichnungen frei“) stehen als **Voraussetzung** in einer Zeile dabei. „Hier hilft keine Technik“ bleibt ein gültiges Ergebnis, wenn es zutrifft. Zu jeder Lösung gibt es einen kopierbaren **Bauplan-Prompt**, zugeschnitten aus den Daten der Befragung (geändert am 05.11.2026).
4. **Ehrlich statt begeistert.** Jeder Vorschlag zeigt Reifegrad, Herkunft und einen ersten Testlauf. Einsparungen nur als gekennzeichnetes **Szenario** mit sichtbarer Annahme, die das Team per Regler ändert. Keine Amortisation, kein ROI, keine Erfolgsversprechen.
5. **Der Mensch entscheidet.** Jede Person prüft ihre Aufgabenkarte. Zielwerte und Maßnahmen beschließt das Team.
6. **Vertrauen durch Schutz.** Antworten sind anonym, Namen und Schuldzuweisungen werden entfernt, Ergebnisse erscheinen erst ab einer Mindestanzahl pro Gruppe. Die Leitung sieht keine Einzelantworten. Langfristig läuft die KI lokal.
7. **Alle sehen dasselbe.** Gesamtbild, Profil und Fahrplan sehen alle Beteiligten – nicht nur die Leitung.
8. **Mitmachen ohne Schreibtisch.** Handy statt PC, höchstens 10 Minuten, einfache Sprache; perspektivisch Sprachnachricht und mehrere Sprachen.
9. **ROKI als Lotse.** Das Ergebnis ersetzt keine Beratung, sondern ist Grundlage für das Gespräch mit ROKI. Die App nennt keine Firmen oder Anbieter, die nicht aus geprüften ROKI-Quellen stammen.

Sprache und Ton folgen [`ROKI_SPRACHE_UND_TONALITAET.md`](ROKI_SPRACHE_UND_TONALITAET.md): praxisnah, verständlich, realistisch, bodenständiges Deutsch, keine Werbesprache, keine Metaphern als Feldnamen. Die Leitung legt beim Anlegen „Sie“ oder „Du“ fest; alle Texte für die Beschäftigten folgen dieser Wahl.

**So einfach wie möglich, so tief wie nötig.** Jede Ergebnisseite hat einen ersten Blick (in 30 Sekunden erfasst: Man fühlt sich gesehen) und einen zweiten Blick (Tiefe für alle, die mehr wissen wollen).

**Sprache der App:** Deutsch ist Standard. Englisch folgt später über den vorhandenen Sprachumschalter. **Gestaltung:** vorerst nach dem ROKI-Design ([`DESIGN.md`](DESIGN.md)).

---

## 5. Ablauf in der App (Workflow v2)

> **In Überarbeitung (Workflow v3).** Neuer Ablauf: Startseite mit zwei Einstiegen (Projekt anlegen / zur Befragung mit Code) plus Live-Analyse, Lösungen auf eigener Seite. Grundlage sind die Fallstudien in `fallstudien/`. Bis `KONZEPT_V3.md` freigegeben ist, beschreibt dieser Abschnitt den gebauten Stand.

Drei Momente statt vieler Schritte. Begründung und Durchlauf mit den Personas: [`KONZEPT_WORKFLOW.md`](KONZEPT_WORKFLOW.md).

| Moment | Wer | Dauer | Was passiert | Ergebnis |
|---|---|---|---|---|
| **① Starten** | Leitung | ca. 2 Min | Ein Satz „Was soll besser werden?“ (schreiben oder einsprechen), Ziel, Bereiche als Chips, interner Stundensatz per Regler. Die KI schlägt daraus die Zeitfresser-Chips für das Team vor. | Einladungstext mit Link (WhatsApp, kopieren) |
| **② Erzählen** | jede Person | 3–5 Min | Kurzes Formular und Gespräch gemischt: Bereich antippen → bis zu 3 Zeitfresser antippen → je Thema kurz vom letzten Mal erzählen (Text oder Sprache) → die KI spiegelt in einem Satz, fragt höchstens einmal nach und belegt die Regler „Wie oft?“ und „Wie lange?“ aus der Erzählung vor → Regler „Wie sehr bremst dich das?“ → **„So habe ich dich verstanden“** bestätigen oder korrigieren | Beitrag; sofort danach „Du bist nicht allein“ mit der gemeinsamen Aufgabe und ihren Kosten |
| **③ Verstehen** | alle | live | Die KI führt alle bestätigten Beiträge zu **Problemfäden** zusammen: Sichtweisen der Bereiche → gemeinsame Aufgabe. Je Faden Kosten in € pro Jahr (rechnet der Code), Ansätze (Ablauf zuerst, dann Technik mit Begründung), ein erster Schritt zum Beschließen. Dieselbe Seite dient als Präsentation. | Gemeinsames Bild und Beschluss |

**Regeln gegen nervige Rückfragen:** Die KI fragt nur, wenn unklar ist, *was* passiert oder *wer* beteiligt ist – nie nach Häufigkeit oder Zeit (dafür gibt es Regler), nie nach schon Gesagtem. Höchstens eine Rückfrage je Thema und zwei im ganzen Gespräch, immer mit Antwort-Chips und „Überspringen“.

### Wer sieht was

| | Person selbst | alle Beteiligten | Leitung | ROKI |
|---|---|---|---|---|
| eigener Beitrag („So habe ich dich verstanden“) | ✓ | – | – | – |
| Einzelbeiträge anderer | – | – | – | – |
| Gemeinsames Bild, Kosten, Beschlüsse | ✓ | ✓ | ✓ | nur wenn geteilt |
| Bereichsname bei Aussagen | ✓ wenn Bereich ≥ Mindestanzahl oder Zustimmung, sonst „ein anderer Bereich“ | | | |

Die Antworten der Leitung sind nie anonym. Kleine Bereiche werden schon **vor** dem KI-Aufruf zu „ein anderer Bereich“, das Modell sieht ihren Namen nicht. Der Browser bekommt nur Zusammengeführtes, keine Einzelbeiträge.

### Zahlen

- Jede Person gibt nur ihre **eigene** Zeit an (verhindert Doppelzählung).
- Stunden pro Woche = Häufigkeit (Reglerstufe, z. B. „mehrmals pro Woche“ ≈ 3×) × Minuten pro Mal.
- € pro Jahr = Stunden pro Woche × interner Stundensatz × Arbeitswochen (Demo: 46). Stundensatz ist auf der Ergebnisseite verschiebbar.
- Das sind die **Kosten des Problems**, keine Einsparungen und kein ROI (Abschnitt 9).

### Handlungsfeld-Profil (bottom-up)

Die Achsen sind die Handlungsfelder, die **aus den Antworten** entstehen – nicht vorgegeben von der Leitung. Der Wert je Achse ist der Durchschnitt des Reglers „Wie sehr bremst dich das?“ (1 = kaum bis 5 = sehr stark) über alle Stimmen in diesem Feld, gerechnet im Code. Dafür wird der Regler je Thema statt einmal je Beitrag abgefragt; es gibt keine zusätzlichen Fragen. Dazu kommt eine feste Frage in jedem Betrieb: „Meine Vorschläge kommen an, und es passiert etwas.“ (Mitsprache). Die Einschätzung der Leitung wird nicht abgefragt (entschieden 05.11.2026).

---

## 8. Lösungsarten, Reifegrad, Herkunft

| Lösungsart | Beispiele |
|---|---|
| Prozess / Absprache | Übergabe-Checkliste, klare Zuständigkeit, feste Abstimmungstermine |
| Software / Automatisierung | digitale Zeiterfassung, Ticketsystem, automatische Benachrichtigungen |
| KI-Assistenz | Angebotsentwurf aus Aufmaß, Sortieren eingehender Mails, Spracheingabe für Dokumentation |
| Robotik / Hardware | Reinigungsroboter, Transportroboter, Cobot, Sensorik |

**Reifegrad** (nach ROKI-Sprachreferenz): heute praktisch eingesetzt · in Pilotprojekten oder Erprobung · noch in Forschung und Entwicklung.

**Aufwand** (grob): gering · mittel · hoch – mit Hinweis, was ihn bestimmt (z. B. Integration, Schulung, Finanzierung über Kauf, Leasing, Miete oder Mietmodell mit Service).

**Herkunft** wird immer angezeigt:
- **von ROKI geprüft** – gestützt auf einen Eintrag im ROKI-Wissensauszug, mit Quellenangabe
- **nicht von ROKI geprüft** – allgemeine Einschätzung der KI, vor einer Entscheidung zu prüfen

---

## 9. Wissensbasis und Umgang mit Zahlen

- **Robotik:** Grundlage sind die geprüften Recherchen im Repo. Daraus erstellen wir einen kompakten **ROKI-Wissensauszug** (Format in [`TECHNIK.md`](TECHNIK.md)), den die KI bei der Einordnung nutzt. Nur Einträge daraus dürfen „von ROKI geprüft“ heißen.
- **Branchen-Problemanalyse:** liefert Problem-Hypothesen und Lösungsansätze pro Branche. Nur Ansätze mit **[ROKI geprüft]** dürfen in den Wissensauszug; ihre Quelle ist die jeweilige Recherche-Datei. Die Entscheidungsmatrix am Ende ist eine Teamregel für die Einordnung, kein Beleg.
- **Software und KI im Büro:** Dazu gibt es im Repo keine geprüfte ROKI-Grundlage. Für den Hackathon: Kennzeichnung als „nicht von ROKI geprüft“. Ein eigener geprüfter Katalog ist ein Ausblick.
- **„Was rechnet sich?“** Laut den Recherchen fehlen für die meisten Systeme unabhängige Kosten- und Wirtschaftlichkeitsdaten; Herstellerpreise sind nur Beispiele. Deshalb:
  - **Ja:** die Kosten des *Problems* in Stunden pro Woche, aus den Angaben der Beschäftigten. Auf Wunsch rechnet die Leitung mit einem eigenen Stundensatz in Euro um.
  - **Ja:** Aufwand grob einordnen und sagen, was zu prüfen ist.
  - **Ja, als Szenario:** „Wenn dieser Zeitverlust um X % sinkt: ≈ Y € im Jahr“. Die Annahme X steht sichtbar daneben und ist per Regler änderbar (entschieden 05.11.2026).
  - **Getrennt ausweisen:** verlorene Zeit (Suchen, Klären, Nacharbeiten – wird abgebaut) und Routinezeit (z. B. Serienschweißen – wird an Maschine oder KI verlagert).
  - **Nein:** Amortisationszeiten oder ROI für eine Lösung.

---

## 10. Umfang im Hackathon (Workflow v3)

| | Inhalt |
|---|---|
| **Muss (Live-Demo)** | Startseite mit zwei Einstiegen (Projekt anlegen · Zur Befragung mit Code) und „Aktuelle Analyse“ · Anlegen mit Eckdaten, Bereichen, Stundensatz-Spannen, Deadline, Website, Anrede · Befragung mit Code: kurze Einführung, Bereich, betriebsspezifische Aufgaben-Chips, eigene Geschichte (Text oder Sprache), Rückfragen aus der Geschichte, Regler · persönliche Rückmeldung · Analyse (live, nur Probleme) mit Übergabe-Karte · Lösungsseite mit Umschalter heute / mit Lösungen und Bauplan-Prompt je Lösung – für Metallbau Heidekamp |
| **Muss (Qualität)** | **Freie Eingaben funktionieren.** Wer in der Demo etwas anderes erzählt als die vorbereiteten Stimmen, bekommt eine passende Rückfrage, eine passende Rückmeldung und landet im richtigen oder einem neuen Handlungsfeld. Kein Durchklicken vorbereiteter Antworten. |
| **Simuliert** | Login (Code ohne Konto) · vorbereitete Beiträge aus der Fallstudie (alle außer dem Werkstattleiter) als fiktive Testdaten |
| **Kann (wenn Zeit bleibt)** | Handlungsfeld-Profil · zweiter und dritter Demo-Betrieb (Pflege, Mensa) · Export als PDF · Nachbefragung nach 4–6 Wochen |
| **Nicht im Hackathon** | lokale KI · Nutzerverwaltung · Mitbestimmungs- und Datenschutzprüfung (Hinweis im Pitch: datenschutzkonform mit lokaler KI) · Anbindung an die ROKI-Plattform · englische Texte · Teilen mit ROKI |

**Regel für echte Betriebe (nicht für die Demo):** In kleinen Betrieben erscheint die Analyse erst ab 5 Beiträgen und aktualisiert sich in Schüben. Kleine Bereiche werden beim Anlegen zusammengelegt.

**Was ROKIO verspricht und was nicht:** ROKIO macht Abläufe besser. Es ist kein Werkzeug zur Konfliktlösung. Die Zusage an die Beschäftigten ist die Ergebnisbesprechung zur Deadline, die beim Anlegen festgelegt wird. Jede Lösung sagt, wofür die frei werdende Zeit genutzt wird.

**Fertig ist das Projekt, wenn:**
- die Live-Demo vom Anlegen bis zum Bauplan-Prompt ohne Eingriff durchläuft – auch mit spontan eingegebenem Text,
- sie bei API-Ausfall mit gespeicherten Ergebnissen weiterläuft (Demo-Modus, siehe [`TECHNIK.md`](TECHNIK.md)),
- jede Lösung Reife, Herkunft, „Was es braucht“ und den KI-Kniff zeigt,
- der Pitch zweimal komplett geprobt ist.

---

## 11. Arbeitspakete (Workflow v3)

| Paket | Inhalt | Prüfpunkt |
|---|---|---|
| A – Startseite | Überzeugende Startseite für ROKIO, zwei Einstiege plus „Aktuelle Analyse“ | versteht man in 10 Sekunden |
| B – Anlegen | Eckdaten, Bereiche mit Spannen, Deadline, Website, Anrede; KI erstellt Betriebsprofil, Chips, Rückfragen-Vorrat; Code und Link | Heidekamp in 2 Minuten angelegt |
| C – Befragung | Code, Einführung, Bereich, Chips inkl. „Etwas anderes …“, Geschichte, Rückfragen, Regler, Rückmeldung | freier Text führt zu passender Rückfrage |
| D – Analyse | Handlungsfelder mit festen IDs, Übergabe-Karte, Kernzahl, Sichtweisen | neue Stimme ändert die Analyse in wenigen Sekunden, Namen bleiben stabil |
| E – Lösungen | KI-Lösungen je Feld (Ablauf, Was es braucht, KI-Kniff, Reife, Herkunft), Bauplan-Prompt, Umschalter auf der Karte | Lösungen liegen vorberechnet bereit |
| F – Pitch | Drehbuch, Folien, zwei Proben | |

---

## 12. Pitch und Live-Demo

**Aufbau des Pitches:**
1. **Problem:** Betriebe suchen Fachkräfte – und verlieren gleichzeitig Zeit an Übergaben, die niemand allein sieht. Die, die die Arbeit machen, werden selten gefragt.
2. **Lösung:** ROKIO hört allen zu, macht die Bruchstellen sichtbar und zeigt konkrete KI- und Robotik-Lösungen für genau diesen Betrieb – bis zum fertigen Bauplan.
3. **Live-Demo** (unten).
4. **Was uns unterscheidet:** viele Stimmen statt einer · systemische Ursachen statt Schuld · Lösungen als Ablauf im Betrieb, ehrlich gekennzeichnet · Bauplan-Prompt aus den eigenen Daten.
5. **Warum ROKI:** schließt die Lücke zwischen Wissen und Beratung; Baustein für den geplanten KI-Assistenten.
6. **Ausblick:** lokale KI (datenschutzkonform), Anbindung an die ROKI-Wissensplattform, regionale Muster aus geteilten Ergebnissen.

**Drehbuch der Live-Demo** (Metallbau Heidekamp, Fallstudie: [`fallstudien/01_metallbau_heidekamp.md`](fallstudien/01_metallbau_heidekamp.md)):
1. **Anlegen:** Sandra legt Heidekamp an – Bereiche, Spannen, Deadline. ROKIO schlägt aus der Website betriebsspezifische Aufgaben vor. Die Beiträge der anderen liegen schon vor.
2. **Live am Handy:** Marco gibt den Code ein, wählt „Zeichnung klären“ und erzählt frei. ROKIO fragt genau einmal sinnvoll nach und belegt die Regler vor.
3. **„Du bist nicht allein“:** persönliche Rückmeldung – Leitung, Technik und Montage beschreiben dasselbe.
4. **Analyse:** Kernzahl („über eine halbe Stelle pro Woche“), Übergabe-Karte mit den Bruchstellen.
5. **Wow:** Umschalter „mit Lösungen“ – die Linien werden türkis, an jeder steht eine KI-Lösung. Ein Klick: Änderungs-Agent mit „Was es braucht“ und KI-Kniff.
6. **Bauplan-Prompt:** kopieren, in einen KI-Assistenten einfügen, Lenas Frage stellen – die Antwort kommt mit Quelle.

**Die Pointe:** Die Probleme kommen aus dem Team, die KI macht die Lösung greifbar – zugeschnitten auf genau diesen Betrieb, bis zum Bauplan. Robotik kommt dort ins Spiel, wo Arbeit körperlich ist oder sich ständig wiederholt.

---

## 13. Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Beschäftigte trauen der Abfrage nicht | Anonymität, Mindestanzahl, alle sehen dasselbe Ergebnis, Leitung sieht keine Einzelantworten |
| Leitung nutzt das Ergebnis gegen Einzelne | keine Einzelantworten für die Leitung, Namen und Schuldzuweisungen werden entfernt |
| KI erfindet Lösungen oder Zahlen | Wissensauszug als einzige Quelle für „geprüft“, Kennzeichnung, keine Einsparungsrechnung |
| KI-Ausgabe hat das falsche Format | feste Datenformate, Prüfung jeder Antwort, Wiederholung bei Fehler (siehe `TECHNIK.md`) |
| API fällt in der Demo aus | Demo-Modus mit gespeicherten Ergebnissen |
| Zu viel für 48 Stunden | Muss/Kann-Liste, Funktionsstopp bei S+40 |
| Daten bei Cloud-Anbietern (KI-API, Supabase, Vercel) | in der Demo nur fiktive Daten; Supabase in einer EU-Region; Ziel ist lokale KI – dafür wäre später eine andere Infrastruktur als Vercel nötig |
| Rechtliche Fragen bei echtem Einsatz (Datenschutz, Mitbestimmung) | im Hackathon nicht geprüft; vor echtem Einsatz klären – im Pitch offen benennen |

---

## 14. Entscheidungen

**Entschieden:**
- Web-App in Next.js
- Die Leitung legt an, Inhalt kommt von unten
- Projektname **ROKIO** (05.11.2026)
- KI- und Robotik-Lösungen im Vordergrund, Absprachen als Voraussetzung; Bauplan-Prompt für jede Lösung (05.11.2026)
- Einsparungen nur als gekennzeichnetes Szenario mit änderbarer Annahme, kein ROI (05.11.2026)
- Fallstudien als Grundlage für Workflow v3: Metallbau, Pflege, Mensa (05.11.2026)
- Demo mit Cloud-KI und nur fiktiven Daten; Ziel ist lokale KI
- Workflow v2: drei Momente (Starten, Erzählen, Verstehen), Formular und KI-Gespräch gemischt (05.11.2026)
- Handlungsfeld-Profil bottom-up: Achsen aus den Antworten, Werte aus dem Regler „Wie sehr bremst dich das?“ je Thema, plus Mitsprache-Frage; keine Einschätzung der Leitung (05.11.2026)
- Kosten der Probleme in € pro Jahr über den internen Stundensatz der Leitung
- KI: OpenAI (`lib/ki/model.ts`, Modell über `OPENAI_MODEL`)
- Demo-Fall: Personas Marco und Sandra im Betrieb Metallbau Heidekamp
- Supabase-Schema: `bestandsaufnahmen`, `beitraege`, `gesamtbilder`, `beschluesse`, nur Server-Zugriff (05.11.2026)
- Ergebnis auf drei Seiten: persönliche Rückmeldung → Analyse (live, nur Probleme) → Lösungen; die Präsentation für die Besprechung kommt zuletzt
- Fünf fiktive Demo-Betriebe, keine echten Firmennamen; Live-Demo mit Metallbau Heidekamp
- Speicherung über die Demo hinaus: Supabase. Der Server-Client ist angebunden. Tabellen folgen, sobald das Schema festliegt.

**Offen:**
- [ ] Bewertungskriterien der Jury, Länge des Pitches, Abgabeformat
- [ ] Teamgröße und Verteilung der Arbeitspakete
- [ ] Mindestanzahl Antworten pro Gruppe (Demo: 3)

---

## 15. Weitere Dateien im Repo

| Datei | Inhalt |
|---|---|
| `AGENTS.md` | Regeln für Coding-Agenten; `CLAUDE.md`, `.cursor/rules/` und `.github/copilot-instructions.md` verweisen darauf |
| `ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md` | Problem-Hypothesen und Lösungsansätze pro Branche |
| `roki-projektübersicht.md` | ROKI-Wissensplattform: Story, Zielgruppen, Content, Metadaten |
| `ROKI_SPRACHE_UND_TONALITAET.md` | Verbindliche Sprachregeln |
| `DESIGN.md` | Design-System der ROKI-Plattform (verweist auf Code-Dateien, die nicht im Repo liegen) |
| `ROKI_Recherche_Robotertypen_geprueft.md` | Robotertypen, Branchenübersicht, KMU-Kriterien |
| `ROKI_Recherche_Roboter_in_der_Pflege_2026-08-18_geprueft.md` | Roboter in der Pflege |
| `ROKI_Recherche_Roboterhunde_2026-08-13_geprueft.md` | Vierbeinige Roboter, Inspektion, Wachschutz |
