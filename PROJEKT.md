# Projekt: KI-gestützte Bestandsaufnahme für KMU

**Arbeitstitel:** noch offen
**Rahmen:** 48-Stunden-AI-Hackathon an der Leuphana Universität Lüneburg, im Rahmen von ROKI – Robotik und KI für die Fachkräftesicherung nutzen (Süderelbe AG)
**Stand:** 05.11.2026 · Version 4 (Workflow v2)
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
3. **Vier Lösungsarten, gleichwertig.** Prozess/Absprache · Software/Automatisierung · KI-Assistenz · Robotik/Hardware. „Hier hilft keine Technik, sondern eine klare Absprache“ ist ein gültiges Ergebnis.
4. **Ehrlich statt begeistert.** Jeder Vorschlag zeigt Reifegrad und Herkunft. Keine erfundenen Einsparungen, keine Erfolgsversprechen.
5. **Der Mensch entscheidet.** Jede Person prüft ihre Aufgabenkarte. Zielwerte und Maßnahmen beschließt das Team.
6. **Vertrauen durch Schutz.** Antworten sind anonym, Namen und Schuldzuweisungen werden entfernt, Ergebnisse erscheinen erst ab einer Mindestanzahl pro Gruppe. Die Leitung sieht keine Einzelantworten. Langfristig läuft die KI lokal.
7. **Alle sehen dasselbe.** Gesamtbild, Profil und Fahrplan sehen alle Beteiligten – nicht nur die Leitung.
8. **Mitmachen ohne Schreibtisch.** Handy statt PC, höchstens 10 Minuten, einfache Sprache; perspektivisch Sprachnachricht und mehrere Sprachen.
9. **ROKI als Lotse.** Das Ergebnis ersetzt keine Beratung, sondern ist Grundlage für das Gespräch mit ROKI. Die App nennt keine Firmen oder Anbieter, die nicht aus geprüften ROKI-Quellen stammen.

Sprache und Ton folgen [`ROKI_SPRACHE_UND_TONALITAET.md`](ROKI_SPRACHE_UND_TONALITAET.md): praxisnah, verständlich, realistisch, bodenständiges Deutsch, keine Werbesprache. Ansprache standardmäßig „Sie“; der Betrieb kann beim Anlegen „Du“ wählen.

**Sprache der App:** Deutsch ist Standard. Englisch folgt später über den vorhandenen Sprachumschalter. **Gestaltung:** vorerst nach dem ROKI-Design ([`DESIGN.md`](DESIGN.md)).

---

## 5. Ablauf in der App (Workflow v2)

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

### Stimmungswert statt Profildiagramm

Das Profildiagramm mit sechs Dimensionen entfällt (entschieden am 05.11.2026). Stattdessen eine Frage „Wie sehr bremst dich das im Alltag?“ (1 = kaum bis 5 = sehr stark), als Durchschnitt je Bereich.

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
  - **Nein:** berechnete Einsparungen, Amortisationszeiten oder ROI für eine Lösung.

---

## 10. Umfang im Hackathon

| | Inhalt |
|---|---|
| **Muss (Live-Demo)** | Starten · Erzählen mit KI-Spiegelung, vorbelegten Reglern und Korrektur · Verstehen mit Problemfäden, Kosten in €, erstem Schritt und Präsentationsmodus – für Metallbau Heidekamp (Personas Marco und Sandra) |
| **Simuliert** | Login und Einladungen (Links ohne Konto) · acht Beiträge als fiktive Testdaten (`daten/demo/heidekamp/`) |
| **Kann (wenn Zeit bleibt)** | zweiter Demo-Betrieb · Sie-Anrede · Export als PDF · Puls nach 4–6 Wochen („Ist es besser geworden?“) |
| **Nicht im Hackathon** | lokale KI · echte Nutzerverwaltung · Anbindung an die ROKI-Plattform · englische Texte (der Umschalter ist schon da, die Übersetzung folgt später) · Teilen mit ROKI |

**Fertig ist das Projekt, wenn:**
- die Live-Demo vom Erzählen bis zum Beschluss ohne Eingriff durchläuft,
- sie auch ohne Internet bzw. bei API-Ausfall mit gespeicherten Ergebnissen läuft (Demo-Modus, siehe [`TECHNIK.md`](TECHNIK.md)),
- jeder Vorschlag Reifegrad und Herkunft zeigt,
- der Pitch zweimal komplett geprobt ist.

---

## 11. Plan für 48 Stunden

Zeiten relativ zum Start (S). Personen tragen sich in die Arbeitspakete ein.

| Zeit | Ziel | Prüfpunkt |
|---|---|---|
| S+0 bis S+4 | Arbeitspakete verteilen, Next.js-Gerüst (steht schon), API-Zugang, Supabase-Projekt anlegen, Datenformate aus `TECHNIK.md` festziehen | alle können lokal starten |
| S+4 bis S+16 | Einzelabfrage mit Nachfragen und Aufgabenkarte; Wissensauszug; Testdaten Metallbau | eine Person kann die Abfrage komplett durchlaufen |
| S+16 bis S+28 | Einordnung, Gesamtbild, Profildiagramm | Gesamtbild aus Testdaten erscheint |
| S+28 bis S+36 | Fahrplan, Besprechungsvorlage, Gestaltung nach ROKI-Design | kompletter Durchlauf möglich |
| S+36 bis S+40 | Demo-Modus mit gespeicherten Ergebnissen, Fehler beheben | **Funktionsstopp bei S+40** |
| S+40 bis S+48 | Pitch fertigstellen, zwei Proben, Puffer | Abgabe |

| Arbeitspaket | Inhalt | Wer |
|---|---|---|
| A – Oberfläche | Seiten, Handy-Ansicht, Profildiagramm, ROKI-Design | offen |
| B – KI-Schritte | Prompts, Datenformate, Schnittstelle zum Modell, Demo-Modus | offen |
| C – Wissen und Inhalte | Wissensauszug aus den Recherchen und der Branchen-Problemanalyse, Leitfragen, Testdaten | offen |
| D – Pitch | Geschichte, Folien, Demo-Drehbuch, Proben | offen |

---

## 12. Pitch und Live-Demo

**Aufbau des Pitches:**
1. **Problem:** Betriebe wissen nicht, wo sie anfangen sollen – und die, die die Arbeit machen, werden selten gefragt.
2. **Lösung:** Bestandsaufnahme von unten, mit KI zusammengeführt, mit ehrlichem Fahrplan.
3. **Live-Demo** (unten).
4. **Was uns unterscheidet:** viele Stimmen statt einer · Aufgabe vor Technik · ehrlich gekennzeichnete Vorschläge · alle sehen dasselbe Ergebnis.
5. **Warum ROKI:** schließt die Lücke zwischen Wissen und Beratung; Baustein für den geplanten KI-Assistenten.
6. **Ausblick:** lokale KI, Anbindung an die ROKI-Wissensplattform, regionale Muster aus geteilten Ergebnissen.

**Drehbuch der Live-Demo (Metallbau Heidekamp, Personas aus [`ROwAI_Personas_Metallbau.md`](ROwAI_Personas_Metallbau.md)):**
1. Sandra (Geschäftsführerin) hat in zwei Minuten gestartet: „Unsere Aufträge brauchen zu viel Abstimmung.“ Acht Beiträge liegen vor (Testdaten).
2. **Live am Handy:** Marco (Werkstattleiter) tippt „Unklarer Zeichnungsstand“ an und spricht ein: „Heute hatten wir wieder zwei Zeichnungsstände.“ ROwAI spiegelt in einem Satz und hat „mehrmals pro Woche“ schon herausgehört. Er korrigiert seine Karte → *Der Mensch entscheidet.*
3. **„Du bist nicht allein“:** Büro, Montage und Leitung beschreiben dieselbe Stelle – das Thema kostet den Betrieb einen fünfstelligen Betrag im Jahr.
4. **Gemeinsames Bild:** Ein Faden, vier Sichtweisen, eine gemeinsame Aufgabe. Stundensatz verschieben, die Zahl folgt.
5. **Erster Schritt:** ein kleiner Prüfauftrag statt einer Anschaffung – im Termin mit Rolle und Datum beschlossen. Präsentationsmodus für die Besprechung und das Gespräch mit ROKI.

Die Pointe: Der erste Schritt ist kein Roboter, sondern eine bessere Übergabe – und das hat der Betrieb von seinen eigenen Leuten erfahren. Assistenztechnik und Robotik kommen dort ins Spiel, wo die Belastung körperlich ist oder sich Handgriffe ständig wiederholen.

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
- Vier gleichwertige Lösungsarten, nicht nur Robotik
- Demo mit Cloud-KI und nur fiktiven Daten; Ziel ist lokale KI
- Workflow v2: drei Momente (Starten, Erzählen, Verstehen), Formular und KI-Gespräch gemischt (05.11.2026)
- Statt Profildiagramm ein Stimmungswert „Wie sehr bremst das?“
- Kosten der Probleme in € pro Jahr über den internen Stundensatz der Leitung
- KI: OpenAI (`lib/ki/model.ts`, Modell über `OPENAI_MODEL`)
- Demo-Fall: Personas Marco und Sandra im Betrieb Metallbau Heidekamp
- Supabase-Schema: `bestandsaufnahmen`, `beitraege`, `gesamtbilder`, `beschluesse`, nur Server-Zugriff (05.11.2026)
- Ergebnis ist eine Vorlage für eine Unternehmensbesprechung
- Fünf fiktive Demo-Betriebe, keine echten Firmennamen; Live-Demo mit Metallbau Heidekamp
- Speicherung über die Demo hinaus: Supabase. Der Server-Client ist angebunden. Tabellen folgen, sobald das Schema festliegt.

**Offen:**
- [ ] Name des Projekts
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
