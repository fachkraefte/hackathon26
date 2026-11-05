# Demo-Betriebe

**Stand:** 05.11.2026 · Version 3
Gehört zu [`PROJEKT.md`](PROJEKT.md). Datenformate: [`TECHNIK.md`](TECHNIK.md), Abschnitt 4.

**Diese Datei ist die einzige Quelle für Testdaten.** Die [`ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md`](ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md) beschreibt dieselben fünf Betriebe aus Branchensicht (vor allem körperliche Belastung und Technik). Ihre Problem-Hypothesen können als Vorlage für zusätzliche Testantworten dienen.

> **Wichtig:** Alle Betriebe in dieser Datei sind **frei erfunden**. Namen, Strukturen, Aussagen, Stunden und Bewertungen sind plausible Annahmen für Testdaten – keine Rechercheergebnisse und keine Beschreibung realer Unternehmen. Ähnlichkeiten mit echten Betrieben sind nicht beabsichtigt. Echte Firmennamen verwenden wir nur mit Einverständnis.

**Zweck:** Testdaten für Entwicklung und Pitch. Die Betriebe sind bewusst unterschiedlich – groß und klein, getrennte und gemischte Rollen, Lösungen in Software und Hardware.

**Kennzeichnung bei Lösungsansätzen:**
- **[ROKI geprüft]** – gestützt auf die geprüften ROKI-Recherchen im Repo (Fundstelle in Klammern)
- **[nicht geprüft]** – plausible Idee ohne geprüfte ROKI-Grundlage

**Weitere Testantworten** dürfen mit KI erzeugt werden, wenn sie zum Steckbrief passen, als fiktiv markiert bleiben und ein Mensch sie vor der Demo liest.

---

## Übersicht

| Branche | Betrieb | Ort | Größe | Struktur | Was der Fall zeigt |
|---|---|---|---|---|---|
| Produktion und Handwerk | Metallbau Heidekamp | Winsen (Luhe) | 15 | klar getrennt, viel unterwegs | Probleme an Übergaben – **Live-Demo** |
| Gastronomie | Kantinenbetrieb Elbküche | Buxtehude | 20 | gemischt, zwei Standorte | Abfrage am Handy, einfache Sprache, Abstimmung zwischen Standorten |
| Gesundheit und Pflege | Haus am Elbufer | Bleckede | 100 | Hierarchie auf dem Papier, im Alltag gemischt, Schichtbetrieb | viele Antworten, sensible Daten |
| Logistik | Nordheide Logistik | Adendorf | 45 | getrennt, Schichtbetrieb | teilweise schon automatisiert |
| Facility Management | Hausmeisterservice Schwinge | Stade | 8 | stark gemischt, alle allein unterwegs | Grenzen der Anonymität im Kleinstbetrieb |

---

## 1. Produktion und Handwerk – Metallbau Heidekamp (Live-Demo)

> **Maßgeblich ist jetzt die Fallstudie [`fallstudien/01_metallbau_heidekamp.md`](fallstudien/01_metallbau_heidekamp.md)** (22 Beschäftigte, 16 Stimmen, Übergabe-Karte, Lösungen). Die Angaben unten bleiben als älteres Szenario.

> **Hinweis (05.11.2026, Workflow v2):** Für die Live-Demo gilt jetzt die Variante nach [`ROwAI_Personas_Metallbau.md`](ROwAI_Personas_Metallbau.md): 22 Beschäftigte, Treppen, Geländer und Stahlkonstruktionen, Sandra (Geschäftsführerin) und Marco (Werkstattleiter), Thema Zeichnungsstand. Die Testdaten dazu liegen in `daten/demo/heidekamp/`. Die Angaben unten (15 Beschäftigte, Aufmaß) bleiben als zweites Szenario.

**Steckbrief:** Metallbaubetrieb, 15 Mitarbeitende, Winsen (Luhe). Zäune, Tore, Geländer für Privatkunden und Hausverwaltungen. Viele Baustellen gleichzeitig, Teams getrennt unterwegs. Anrede: „Sie“.

**Bereiche:**

| Bereich | Personen | Aufgaben | Sichtbarkeit |
|---|---|---|---|
| Leitung | 1 (Inhaber) | Aufmaß beim Kunden, Angebote, Kundengespräche, Einsatzplanung | nicht anonym (Leitung) |
| Büro | 1 (Teilzeit) | Rechnungen, Telefon, Material bestellen | kleine Gruppe → Person stimmt zu, mit Rolle gezeigt zu werden |
| Werkstatt | 7 (Meister, 5 Gesellen, 1 Azubi) | Zuschnitt, Schweißen, Vorbereitung für Verzinkung, Material für Montage | anonym |
| Montage | 6 (3 Zweiertrupps) | Transport, Montage beim Kunden | anonym |

### Testantworten (14 von 15 – die 15. Person füllt live aus)

Werte in der Reihenfolge **Information · Dokumentation · Planung · Körper · Wissen · Digital**, Skala 1 = klappt schlecht bis 5 = klappt gut. Stunden pro Woche nur, wenn die Person sie selbst angegeben hat.

| ID | Bereich | Kernaussagen | Std./Woche | Werte |
|---|---|---|---|---|
| L1 | Leitung | „Das Aufmaß mache ich auf Papier, Fotos auf meinem privaten Handy. Angebote schreibe ich abends. Beim Kunden ruft ständig die Werkstatt an.“ | 6 (Angebote) | 3-2-3-4-3-2 |
| B1 | Büro | „Stundenzettel telefoniere ich hinterher. Kunden rufen an und fragen, wann wir kommen – das weiß ich oft selbst nicht. Rechnungen gehen dadurch spät raus.“ | 2 (Stundenzettel), 3 (Kundenanrufe) | 2-2-2-5-2-3 |
| W1 | Werkstatt | „Auf dem Aufmaß fehlen oft Maße. Der Chef ist beim Kunden, also warte ich. Was als Nächstes dran ist, erfahre ich auf Zuruf.“ | 3 (Rückfragen) | 2-3-2-3-3-2 |
| W2 | Werkstatt | „Manche Maße kann ich nicht lesen. Dann schätze ich oder warte.“ | 1 | 2-3-2-2-3-2 |
| W3 | Werkstatt | „Das Material für die Montage stelle ich ohne Liste zusammen. Kleinteile fehlen dann.“ | – | 2-3-3-3-3-2 |
| W4 | Werkstatt | „Die Zaunfelder sind schwer, wir heben oft zu zweit.“ | – | 3-3-3-1-3-2 |
| W5 | Werkstatt | „Bei uns hilft jeder jedem, das läuft gut. Nur das Aufmaß stimmt manchmal nicht.“ | – | 3-4-3-2-4-3 |
| W6 | Werkstatt | „Pfosten schweißen ist immer derselbe Handgriff, das ermüdet.“ | – | 3-3-3-2-3-2 |
| W7 | Werkstatt | „Ich frage viel, aber alles Wissen hängt am Meister, und der hat wenig Zeit.“ | – | 2-3-2-2-1-2 |
| M1 | Montage | „Etwa einmal pro Woche fehlt ein Teil. Dann fahren wir zurück, das sind drei Stunden zu zweit.“ | 6 | 1-2-2-2-4-1 |
| M2 | Montage | „Den Stundenzettel schreibe ich am Freitag aus dem Gedächtnis.“ | 1 | 2-1-2-2-4-1 |
| M3 | Montage | „Der Kunde weiß oft nicht, dass wir kommen. Dann stehen wir vor verschlossenem Tor.“ | 1 | 1-2-1-2-4-2 |
| M4 | Montage | „Die Maße passen vor Ort nicht, wir arbeiten nach. Ungefähr zwei Stunden pro Woche, zu zweit.“ | 4 | 1-2-2-2-4-1 |
| M5 | Montage | „Unsere Trupps sind eingespielt. Pfosten einbetonieren geht in den Rücken.“ | – | 2-2-2-1-4-1 |

### Spickzettel für die Live-Abfrage (M6, Montage)

Die Person am Handy sollte ungefähr Folgendes sagen, damit das Ergebnis zur Geschichte passt:
- „Letzte Woche war ein Geländer fünf Zentimeter zu kurz, weil im Aufmaß eine Maßangabe fehlte. Wir haben vor Ort gekürzt und neu angeschweißt.“
- Auf Nachfrage: „So etwas passiert zwei-, dreimal im Monat, jedes Mal etwa zwei Stunden.“
- Gut läuft: „Mit meinem Kollegen im Trupp klappt es super.“
- Auf der Aufgabenkarte **einen Punkt korrigieren** (z. B. Häufigkeit von „wöchentlich“ auf „monatlich“) – zeigt, dass der Mensch entscheidet.
- Werte: 1-2-2-2-4-1

### Erwartetes Ergebnis (zum Prüfen der KI-Ausgaben)

Das sind keine Vorgaben für die KI, sondern das, was ein Mensch aus den Testdaten herauslesen würde. Weicht die KI deutlich ab, Prompts prüfen.

**Themen:**
1. **Unvollständiges Aufmaß löst eine Kette aus** (Leitung → Werkstatt → Montage) – Schnittstelle, Werkstatt und Montage nennen es, zusammen etwa 14 Stunden pro Woche (W1, W2, M1, M4) plus die Live-Antwort.
2. **Stundenzettel verzögern Rechnungen** (Montage → Büro) – Schnittstelle, etwa 3 Stunden pro Woche.
3. **Kunden wissen nicht, wann das Team kommt** (Büro, Montage) – etwa 4 Stunden pro Woche.
4. **Körperliche Belastung** in Werkstatt und Montage (Heben, Betonieren, gleichförmiges Schweißen).
5. **Wissen hängt an Einzelnen** (Meister, Inhaber).

**Stärken:** Hilfsbereitschaft in der Werkstatt, eingespielte Montagetrupps.

**Fahrplan, ungefähr:**
- **kurz:** Aufmaß-Vorlage mit Pflichtfeldern und Fotos (Prozess) · Packliste pro Auftrag (Prozess) · Termin-Info an Kunden am Vortag (Software, [nicht geprüft])
- **mittel:** digitales Aufmaß auf dem Tablet, direkt für die Werkstatt sichtbar (Software, [nicht geprüft]) · Zeiterfassung per Handy (Software, [nicht geprüft]) · Angebotsentwurf aus dem digitalen Aufmaß (KI-Assistenz, [nicht geprüft]) · Wissen des Meisters für Einarbeitung festhalten (Prozess) · Exoskelette fürs Tragen und Halten mit den Beschäftigten testen – Nutzen hängt von Tätigkeit und Passform ab (Hardware, [ROKI geprüft] – Robotertypen-Recherche 3.13)
- **lang:** Schweiß-Cobot für Serienteile wie Pfosten prüfen (Robotik, [ROKI geprüft] – Cobots im Handwerk z. B. zum Schweißen; Integration und Risikobeurteilung bestimmen den Aufwand; Robotertypen-Recherche 3.3)

**Die Pointe:** Der erste Schritt ist kein Roboter, sondern eine bessere Übergabe. Assistenztechnik und Robotik kommen dort ins Spiel, wo die Belastung körperlich ist oder sich Handgriffe ständig wiederholen.

---

## 2. Gastronomie – Kantinenbetrieb Elbküche

**Steckbrief:** Betreibt zwei Kantinen in Buxtehude, 20 Mitarbeitende. Standort A kocht für beide, Standort B gibt nur aus. Viele Teilzeitkräfte. Anrede: „Du“ (vom Betrieb gewählt).

**Bereiche:**

| Bereich | Personen | Aufgaben | Sichtbarkeit |
|---|---|---|---|
| Leitung | 1 | Einkauf, Speiseplan, Personal, Abrechnung | nicht anonym |
| Küche (Standort A) | 5 (Küchenchef, 4 Köche) | Zubereitung, Rezepte, Transport nach B | anonym |
| Küchenhilfen | 10 | Vorbereitung, Spüle, Ausgabe – wechselnd | anonym |
| Ausgabe und Kasse | 4 (je 2 pro Standort) | Ausgabe, Kasse, Reinigung Speisesaal | als ein Bereich für beide Standorte, sonst zu klein |

**Stimmen:**
- Küchenchef: „Wir kochen zu viel oder sind um halb eins ausverkauft.“
- Leitung: „Wenn sich ein Rezept ändert, passe ich die Allergenkennzeichnung von Hand an.“
- Küche: „Die Temperaturlisten für die Hygiene führen wir auf Papier.“
- Küchenhilfe: „Krankmeldungen kommen morgens per WhatsApp, dann muss jemand spontan springen.“
- Küchenhilfe: „Die Spüle in der Mittagszeit ist körperlich hart.“
- Ausgabe Standort B: „Was von A kommt, erfahren wir oft erst, wenn es ankommt.“

**Mögliche Ansätze:**

| Lösungsart | Ansatz | Kennzeichnung |
|---|---|---|
| Prozess | feste Abstimmung zwischen A und B am Vortag | [nicht geprüft] |
| Software | Rezeptdatenbank mit automatischer Allergenkennzeichnung, Temperatursensoren statt Papierlisten, Dienstplan-App | [nicht geprüft] |
| KI-Assistenz | Vorhersage der Essenszahlen aus Vorbestellungen und Erfahrungswerten | [nicht geprüft] |
| Robotik | Reinigungsroboter für den Speisesaal – gut bei größeren, regelmäßig zu reinigenden Flächen, weniger bei verwinkelten oder oft umgestellten | [ROKI geprüft] (Robotertypen 3.7) |

**Was der Fall zeigt:** Zwei Standorte, wechselnde Rollen, viele Teilzeitkräfte, vermutlich teils mehrsprachiges Team. Die Abfrage muss kurz, am Handy und in einfacher Sprache funktionieren; Spracheingabe und mehrere Sprachen wären hier besonders wichtig (Ausblick).

---

## 3. Gesundheit und Pflege – Haus am Elbufer

**Steckbrief:** Pflegeheim in Bleckede, 100 Mitarbeitende, mit eigenem Wohnbereich für Menschen mit Demenz. Dreischichtbetrieb. Anrede: „Sie“.

**Bereiche:**

| Bereich | Aufgaben |
|---|---|
| Leitung (Einrichtungsleitung, Pflegedienstleitung) | Personal, Qualität, Organisation |
| Wohnbereichsleitungen | Dienstplan, Übergaben, Koordination |
| Pflegefachkräfte | Grundpflege, Behandlungspflege, Dokumentation |
| Pflegehilfskräfte | Grundpflege, Unterstützung im Alltag |
| Betreuungskräfte | Aktivierung, Beschäftigung, besonders im Demenzbereich |
| Hauswirtschaft und Reinigung | Wäsche, Reinigung |
| Küche | Mahlzeiten |
| Haustechnik | Wartung, Reparaturen |
| Verwaltung | Abrechnung, Angehörige, Bewerbungen |

Auf dem Papier eine klare Hierarchie, im Alltag gemischt: Die Pflege übernimmt oft auch Hauswirtschaft und Wege. Kleine Bereiche (z. B. Haustechnik) werden zusammengelegt oder die Personen stimmen der Rollenangabe zu.

**Stimmen:**
- Pflegefachkraft: „Wir dokumentieren doppelt, auf Papier und in der Software.“
- Wohnbereichsleitung: „Bei der Schichtübergabe gehen Infos verloren, weil sie nur mündlich läuft.“
- Pflegehilfskraft: „Ich laufe viel für Wäsche und Material.“
- Nachtdienst Demenzbereich: „Nachts bin ich allein. Weglaufen und Stürze machen mir am meisten Sorgen.“
- Wohnbereichsleitung: „Wenn jemand ausfällt, telefonieren wir eine Liste ab.“
- Verwaltung: „Angehörige rufen an und wollen wissen, wie es geht – die Pflege hat dafür keine Zeit.“

**Mögliche Ansätze:**

| Lösungsart | Ansatz | Kennzeichnung |
|---|---|---|
| Prozess | strukturierte Übergabe mit fester Vorlage | [nicht geprüft] |
| Software | digitale Übergabe, App fürs Einspringen bei Ausfällen | [nicht geprüft] |
| KI-Assistenz | Spracheingabe für Pflegedokumentation | [nicht geprüft] |
| Sensorik | Sturz- und Bewegungserkennung im Demenzbereich | [nicht geprüft] |
| Robotik | Transportroboter für Wäsche und Material – laut Recherche das derzeit klarste Entlastungspotenzial in der Pflege | [ROKI geprüft] (Pflege-Recherche 2, 3.3) |
| Robotik | soziale Roboter (z. B. PARO) zur Aktivierung – viele positive Erfahrungsberichte, aber gemischte Belege für Wirkung | [ROKI geprüft] (Pflege-Recherche 2, 3.2) |

**Wichtiger Hinweis aus der Recherche:** Im 22-monatigen Feldtest des Assistenzroboters Lio wurde keine wahrnehmbare Entlastung des Personals festgestellt; die Akzeptanz beim Personal sank wegen Zuverlässigkeit und Bedienbarkeit (Pflege-Recherche 2, 3.4). Die App darf Robotik in der Pflege nicht als einfache Lösung darstellen.

**Was der Fall zeigt:** Viele Antworten zum Zusammenführen und hochsensible Daten – Gesundheitsdaten von Bewohner:innen können in Antworten auftauchen und müssen weggelassen werden. Stärkstes Argument für lokale KI.

---

## 4. Logistik – Nordheide Logistik

**Steckbrief:** Logistikdienstleister in Adendorf, 45 Mitarbeitende. Lager im Schichtbetrieb, eigene Fahrzeuge im Nahverkehr. Ein Lagerverwaltungssystem ist vorhanden, sonst viele Einzellösungen. Anrede: „Sie“.

**Bereiche:**

| Bereich | Personen | Aufgaben | Sichtbarkeit |
|---|---|---|---|
| Leitung | 2 | Kunden, Personal, Investitionen | nicht anonym |
| Disposition | 3 | Tourenplanung, Fahrereinsatz | anonym |
| Lager | 25 (Schichtbetrieb) | Wareneingang, Kommissionierung, Versand | anonym |
| Fahrer | 10 | Zustellung, Abholung | anonym |
| Kundenservice und Verwaltung | 5 | Anfragen, Avise, Rechnungen | anonym |

**Stimmen:**
- Disposition: „Die Touren hat vor allem ein Kollege im Kopf. Wenn er Urlaub hat, wird es schwierig.“
- Lager: „Wir suchen Ware und kommissionieren manchmal falsch.“
- Lager: „Lange Laufwege und schweres Heben, besonders in der Spätschicht.“
- Fahrer: „An der Rampe warte ich lange, und die Lieferscheine sind auf Papier.“
- Kundenservice: „Ständig fragen Kunden per Mail, wo ihre Sendung ist.“

**Mögliche Ansätze:**

| Lösungsart | Ansatz | Kennzeichnung |
|---|---|---|
| Prozess | Tourenwissen festhalten, Vertretung einarbeiten | [nicht geprüft] |
| Software | Tourenplanungssoftware, digitaler Liefernachweis, Zeitfenster für Rampen | [nicht geprüft] |
| KI-Assistenz | eingehende Mails sortieren, Avise auslesen, Sendungsanfragen beantworten | [nicht geprüft] |
| Robotik | autonome mobile Roboter oder fahrerlose Transportsysteme fürs Lager – laut Recherche praxisreif | [ROKI geprüft] (Robotertypen 2, 3.4, 3.5) |
| Hardware | Exoskelette – angrenzende Technik, Nutzen stark abhängig von Person und Tätigkeit | [ROKI geprüft] (Robotertypen 3.13) |

**Was der Fall zeigt:** Der Betrieb fängt nicht bei null an. Die App muss mit vorhandenen Insellösungen umgehen und „Wissen hängt an einer Person“ als Risiko erkennen.

---

## 5. Facility Management – Hausmeisterservice Schwinge

**Steckbrief:** Hausmeisterservice in Stade, 8 Mitarbeitende, betreut rund 40 Objekte (Wohnanlagen, Gewerbe, Schulen). Saisonal Grünpflege und für rund 15 Objekte Winterdienst. Anrede: „Du“ (vom Betrieb gewählt).

**Bereiche:**

| Bereich | Personen | Aufgaben | Sichtbarkeit |
|---|---|---|---|
| Leitung | 1 (Inhaberin) | Angebote, Kunden, fährt selbst mit raus | nicht anonym |
| Büro | 1 | Aufträge, Abrechnung, Telefon | kleine Gruppe → zusammenlegen oder Zustimmung |
| Hausmeister | 6 | Reparaturen, Kontrollgänge, Grünpflege, Winterdienst – jeder allein unterwegs | anonym |

**Stimmen:**
- Büro: „Mängelmeldungen kommen per Anruf, WhatsApp und Mail. Manches geht unter.“
- Hausmeister: „Den Winterdienst weise ich handschriftlich nach.“
- Hausmeister: „Was man über ein Objekt wissen muss, hat jeder nur im Kopf.“
- Leitung: „Neue Kollegen einzuarbeiten dauert ewig.“
- Hausmeister: „Mir fehlt oft Material, dann fahre ich zum Baumarkt.“
- Hausmeister: „Mäher und Streusalz lade ich mehrmals am Tag ein und aus.“

**Mögliche Ansätze:**

| Lösungsart | Ansatz | Kennzeichnung |
|---|---|---|
| Prozess | eine feste Annahmestelle für alle Meldungen | [nicht geprüft] |
| Software | digitale Objektmappe, Winterdienst-Nachweis per Foto und Zeitstempel | [nicht geprüft] |
| KI-Assistenz | aus Nachrichten automatisch Aufträge erstellen | [nicht geprüft] |
| Robotik | Mähroboter für größere Grünflächen | [nicht geprüft] |
| Robotik | Reinigungsroboter für größere Flächen in Gewerbeobjekten | [ROKI geprüft] (Robotertypen 2, 3.7) |

**Was der Fall zeigt:** Im Kleinstbetrieb ist Anonymität schwer. Weil alle allein unterwegs sind und es kaum Teambesprechungen gibt, ist die Besprechungsvorlage hier besonders wertvoll.
