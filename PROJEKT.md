# Projekt: KI-gestützte Bestandsaufnahme für KMU

**Arbeitstitel:** noch offen
**Rahmen:** 48-Stunden-AI-Hackathon an der Leuphana Universität Lüneburg, im Rahmen von ROKI – Robotik und KI für die Fachkräftesicherung nutzen (Süderelbe AG)
**Stand:** 05.11.2026 · Version 2
**Diese Datei ist maßgeblich.** Wenn eine andere Datei widerspricht, gilt `PROJEKT.md`.

| Datei | Wofür |
|---|---|
| `PROJEKT.md` | Was wir bauen und warum, Ablauf, Regeln, Plan, Pitch |
| [`TECHNIK.md`](TECHNIK.md) | Wie wir es bauen: Architektur, KI-Schritte, Datenformate, Demo-Absicherung |
| [`DEMO_BETRIEBE.md`](DEMO_BETRIEBE.md) | Fünf fiktive Testbetriebe, Testdaten für die Live-Demo |
| [`MASTERPROMPT.md`](MASTERPROMPT.md) | Einstieg für neue Teammitglieder und andere KIs |

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

---

## 5. Ablauf in der App

| Schritt | Wer | Was passiert | Ergebnis |
|---|---|---|---|
| **0. Anlegen** | Leitung | Branche, Größe, Bereiche wählen; Anrede wählen; optional Dokumente hochladen (z. B. Organigramm, Ablaufbeschreibungen); Einladungslinks pro Bereich erzeugen | Bestandsaufnahme ist angelegt |
| **1. Einzelabfrage** | jede beteiligte Person | Leitfragen (Abschnitt 6), KI fragt nach; Selbsteinschätzung auf den Profil-Dimensionen | **Aufgabenkarte** – die Person bestätigt oder korrigiert sie |
| **2. Einordnung** | KI; Person sieht das Ergebnis | jede Aufgabe → Lösungsart(en), Reifegrad, Herkunft, Aufwand, „Was prüfen?“ | Einzelvorschläge |
| **3. Gesamtbild** | KI, sobald genug Antworten bestätigt sind | Themen über Bereiche hinweg, Schnittstellen, doppelte Arbeit, Belastungen, Stärken, Kosten der Probleme in Stunden | Gesamtanalyse + **Profildiagramm (Ist)** |
| **4. Fahrplan** | KI; Leitung und Team prüfen | Maßnahmen kurz-, mittel-, langfristig, je mit erstem Schritt, „Was prüfen?“ und „Wer hilft?“ | Fahrplan |
| **5. Besprechung** | ganzes Team | Vorlage wird aus den Daten erzeugt; im Termin werden Zielwerte, erster Testlauf und Verantwortliche eingetragen | Beschluss |

**Zeiträume im Fahrplan (Vorschlag):** kurz = bis 3 Monate · mittel = 3 bis 12 Monate · lang = über 12 Monate.

### Wer sieht was

| | Person selbst | alle Beteiligten | Leitung | ROKI |
|---|---|---|---|---|
| eigene Aufgabenkarte und Einordnung | ✓ | – | – | – |
| Einzelantworten anderer | – | – | – | – |
| Gesamtbild, Profil, Fahrplan, Besprechungsvorlage | ✓ | ✓ | ✓ | nur wenn geteilt |
| Original-Aussagen (gekürzt, ohne Namen) | ✓ wenn Gruppe ≥ Mindestanzahl | ✓ wenn Gruppe ≥ Mindestanzahl | ✓ wenn Gruppe ≥ Mindestanzahl | nur wenn geteilt |

**Gruppen kleiner als die Mindestanzahl** (Vorschlag: 3 Antworten): Die Person entscheidet beim Ausfüllen, ob ihre Antworten mit einer benachbarten Gruppe zusammengelegt oder mit Rollenbezeichnung gezeigt werden. Die Antworten der Leitung sind nie anonym.

### Gliederung der Besprechungsvorlage

1. Wer hat mitgemacht? (Anzahl je Bereich, keine Namen)
2. Was gut läuft
3. Profil heute
4. Die drei wichtigsten Themen, mit gekürzten Original-Aussagen
5. Was diese Themen kosten (Stunden pro Woche, nach Angaben der Beschäftigten)
6. Mögliche Lösungen mit Aufwand, Reifegrad und Herkunft
7. Fahrplan kurz / mittel / lang
8. Gemeinsam entscheiden: Zielwerte, erster Testlauf, Verantwortliche, Termin zum Nachschauen
9. Nächster Schritt mit ROKI

---

## 6. Die Einzelabfrage

**Dauer:** höchstens 10 Minuten. **Gerät:** Handy zuerst.

**Leitfragen (für alle Branchen; die KI passt Beispiele an Branche und Bereich an):**
1. Was machen Sie an einem typischen Arbeitstag?
2. Was kostet Sie Zeit, ohne dass es sich sinnvoll anfühlt?
3. Was ist körperlich am anstrengendsten?
4. Wo warten Sie auf Informationen, Material oder Rückmeldungen – und von wem?
5. Was müssen Sie doppelt erfassen, aufschreiben oder nachfragen?
6. Was läuft gut und sollte so bleiben?
7. Wenn Sie eine Sache ändern könnten: Welche wäre das?

Danach: Selbsteinschätzung auf den sechs Profil-Dimensionen (Abschnitt 7).

**Regeln für die Nachfragen der KI:**
- höchstens zwei Nachfragen pro Leitfrage
- nach Häufigkeit und ungefährem Zeitaufwand fragen („Wie oft? Wie lange ungefähr?“)
- keine Technik vorschlagen, nicht bewerten, nicht beschwichtigen
- Namen und Schuldzuweisungen in der Aufgabenkarte neutral umformulieren („Kollege X vergisst …“ → „Information fehlt bei Übergabe von A nach B“)
- Gesundheitsdaten Dritter (z. B. Bewohner:innen) nicht übernehmen

---

## 7. Profildiagramm

Zeigt pro Dimension, wie gut etwas heute klappt (**Ist**) und wohin der Betrieb will (**Ziel**).

| Dimension | Leitfrage |
|---|---|
| Information und Übergaben | Kommen Informationen vollständig und rechtzeitig an? |
| Dokumentation und Verwaltung | Wie viel Zeit kostet Papierkram, und ist er nötig? |
| Planung und Koordination | Klappen Einsatz-, Dienst- und Tourenplanung? |
| Körperliche Belastung | Wie gut ist die körperliche Belastung zu bewältigen? |
| Wissen und Einarbeitung | Ist Wissen verteilt, oder hängt es an Einzelnen? |
| Digitale Werkzeuge | Helfen die vorhandenen Werkzeuge, oder stören sie? |

**Regeln:**
- Skala 1–5, immer gleich gepolt: **1 = klappt schlecht, 5 = klappt gut**. (Bei „Körperliche Belastung“ heißt 5: gut zu bewältigen.)
- **Ist** = Durchschnitt der Selbsteinschätzungen je Bereich und gesamt, mit Anzahl der Antworten. Die KI schätzt keine Werte.
- **Ziel** trägt das Team in der Besprechung ein.
- Darstellung (Netzdiagramm oder Balkenpaar „Ist → Ziel“) ist noch offen.

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
- **Software und KI im Büro:** Dazu gibt es im Repo keine geprüfte ROKI-Grundlage. Für den Hackathon: Kennzeichnung als „nicht von ROKI geprüft“. Ein eigener geprüfter Katalog ist ein Ausblick.
- **„Was rechnet sich?“** Laut den Recherchen fehlen für die meisten Systeme unabhängige Kosten- und Wirtschaftlichkeitsdaten; Herstellerpreise sind nur Beispiele. Deshalb:
  - **Ja:** die Kosten des *Problems* in Stunden pro Woche, aus den Angaben der Beschäftigten. Auf Wunsch rechnet die Leitung mit einem eigenen Stundensatz in Euro um.
  - **Ja:** Aufwand grob einordnen und sagen, was zu prüfen ist.
  - **Nein:** berechnete Einsparungen, Amortisationszeiten oder ROI für eine Lösung.

---

## 10. Umfang im Hackathon

| | Inhalt |
|---|---|
| **Muss (Live-Demo)** | Einzelabfrage mit KI-Nachfragen und Korrektur · Einordnung · Gesamtbild mit Kosten in Stunden · Profildiagramm (Ist) · Fahrplan · Besprechungsvorlage – für Metallbau Heidekamp |
| **Simuliert** | Login und Einladungen (Links ohne Konto) · Antworten der übrigen Personen als Testdaten aus [`DEMO_BETRIEBE.md`](DEMO_BETRIEBE.md) |
| **Kann (wenn Zeit bleibt)** | Spracheingabe · zweiter Demo-Betrieb · Zielwerte im Diagramm eintragen · Export der Besprechungsvorlage |
| **Nicht im Hackathon** | lokale KI · echte Nutzerverwaltung · Anbindung an die ROKI-Plattform · Mehrsprachigkeit · Teilen mit ROKI |

**Fertig ist das Projekt, wenn:**
- die Live-Demo von der Abfrage bis zur Besprechungsvorlage ohne Eingriff durchläuft,
- sie auch ohne Internet bzw. bei API-Ausfall mit gespeicherten Ergebnissen läuft (Demo-Modus, siehe [`TECHNIK.md`](TECHNIK.md)),
- jeder Vorschlag Reifegrad und Herkunft zeigt,
- der Pitch zweimal komplett geprobt ist.

---

## 11. Plan für 48 Stunden

Zeiten relativ zum Start (S). Personen tragen sich in die Arbeitspakete ein.

| Zeit | Ziel | Prüfpunkt |
|---|---|---|
| S+0 bis S+4 | Arbeitspakete verteilen, Next.js-Gerüst, API-Zugang, Datenformate aus `TECHNIK.md` festziehen | alle können lokal starten |
| S+4 bis S+16 | Einzelabfrage mit Nachfragen und Aufgabenkarte; Wissensauszug; Testdaten Metallbau | eine Person kann die Abfrage komplett durchlaufen |
| S+16 bis S+28 | Einordnung, Gesamtbild, Profildiagramm | Gesamtbild aus Testdaten erscheint |
| S+28 bis S+36 | Fahrplan, Besprechungsvorlage, Gestaltung nach ROKI-Design | kompletter Durchlauf möglich |
| S+36 bis S+40 | Demo-Modus mit gespeicherten Ergebnissen, Fehler beheben | **Funktionsstopp bei S+40** |
| S+40 bis S+48 | Pitch fertigstellen, zwei Proben, Puffer | Abgabe |

| Arbeitspaket | Inhalt | Wer |
|---|---|---|
| A – Oberfläche | Seiten, Handy-Ansicht, Profildiagramm, ROKI-Design | offen |
| B – KI-Schritte | Prompts, Datenformate, Schnittstelle zum Modell, Demo-Modus | offen |
| C – Wissen und Inhalte | Wissensauszug aus den Recherchen, Leitfragen, Testdaten | offen |
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

**Drehbuch der Live-Demo (Metallbau Heidekamp):**
1. Die Bestandsaufnahme ist angelegt, 14 von 15 Personen haben geantwortet (Testdaten). Kurz zeigen.
2. **Live am Handy:** Ein Monteur füllt die Abfrage aus. Die KI fragt nach („Wie oft passiert das?“). Er korrigiert einen Punkt auf seiner Aufgabenkarte → *Der Mensch entscheidet.*
3. Seine Aufgaben werden eingeordnet – mit Reifegrad und Herkunft.
4. **Gesamtbild:** Erst jetzt wird sichtbar, dass Werkstatt, Montage, Büro und Leitung über dasselbe Problem sprechen: Das Aufmaß ist der Anfang einer Kette (Werkstatt → Montage → Stundenzettel → Rechnung). Kosten in Stunden pro Woche.
5. **Fahrplan:** kurz – Aufmaß-Vorlage mit Pflichtfeldern; mittel – digitales Aufmaß und Zeiterfassung per Handy; lang – Schweiß-Cobot für Serienteile prüfen.
6. **Besprechungsvorlage** und Übergabe an ROKI.

Die Pointe: Der erste Schritt ist kein Roboter, sondern eine bessere Übergabe – und das hat der Betrieb von seinen eigenen Leuten erfahren.

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
| Daten in einer Cloud-KI | in der Demo nur fiktive Daten; Ziel ist lokale KI |
| Rechtliche Fragen bei echtem Einsatz (Datenschutz, Mitbestimmung) | im Hackathon nicht geprüft; vor echtem Einsatz klären – im Pitch offen benennen |

---

## 14. Entscheidungen

**Entschieden:**
- Web-App in Next.js
- Die Leitung legt an, Inhalt kommt von unten
- Vier gleichwertige Lösungsarten, nicht nur Robotik
- Demo mit Cloud-KI und nur fiktiven Daten; Ziel ist lokale KI
- Profildiagramm mit Ist (von Beschäftigten) und Ziel (vom Team)
- Ergebnis ist eine Vorlage für eine Unternehmensbesprechung
- Fünf fiktive Demo-Betriebe, keine echten Firmennamen; Live-Demo mit Metallbau Heidekamp

**Offen:**
- [ ] Name des Projekts
- [ ] Bewertungskriterien der Jury, Länge des Pitches, Abgabeformat
- [ ] Teamgröße und Verteilung der Arbeitspakete
- [ ] Welche Cloud-API
- [ ] Darstellung des Profildiagramms (Netz oder Balken)
- [ ] Mindestanzahl Antworten pro Gruppe (Vorschlag: 3)
- [ ] Speicherung der Daten über die Demo hinaus

---

## 15. Weitere Dateien im Repo

| Datei | Inhalt |
|---|---|
| `roki-projektübersicht.md` | ROKI-Wissensplattform: Story, Zielgruppen, Content, Metadaten |
| `ROKI_SPRACHE_UND_TONALITAET.md` | Verbindliche Sprachregeln |
| `DESIGN.md` | Design-System der ROKI-Plattform (verweist auf Code-Dateien, die nicht im Repo liegen) |
| `ROKI_Recherche_Robotertypen_geprueft.md` | Robotertypen, Branchenübersicht, KMU-Kriterien |
| `ROKI_Recherche_Roboter_in_der_Pflege_2026-08-18_geprueft.md` | Roboter in der Pflege |
| `ROKI_Recherche_Roboterhunde_2026-08-13_geprueft.md` | Vierbeinige Roboter, Inspektion, Wachschutz |
