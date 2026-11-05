# Branchen-Problemanalyse: Robotik, KI und Automatisierung in KMU

**Stand:** 05.11.2026 · Version 2
**Ursprünglicher Entwurf:** Matthis · **Überarbeitet:** am 05.11.2026, damit das Dokument ins Gesamtkonzept passt (Abgleich mit den geprüften Recherchen, fiktive Betriebe, Sprachregeln)
Gehört zu [`PROJEKT.md`](PROJEKT.md). Bei Widersprüchen gilt `PROJEKT.md`.

---

## Wofür dieses Dokument da ist

Es beschreibt pro Branche, **was im Arbeitsalltag typischerweise belastet** – vor allem körperlich und organisatorisch – und welche Lösungsansätze dazu passen könnten. Es ergänzt [`DEMO_BETRIEBE.md`](DEMO_BETRIEBE.md): Dort stehen die Testdaten (mit Schwerpunkt auf Übergaben und Abläufen), hier die Branchensicht (mit Schwerpunkt auf körperlicher Belastung und Technik).

**So wird es genutzt:**
- **Problem-Hypothesen** → Ideen für Nachfragen der KI in der Einzelabfrage und für zusätzliche Testantworten. Es sind Annahmen, keine Fakten über echte Betriebe.
- **Lösungsansätze mit [ROKI geprüft]** → dürfen in den ROKI-Wissensauszug (`wissen/roki-wissensauszug.json`, siehe [`TECHNIK.md`](TECHNIK.md)). Die Fundstelle steht jeweils dabei.
- **Lösungsansätze mit [nicht geprüft]** → dürfen von der KI nur als „nicht von ROKI geprüft“ vorgeschlagen werden.
- **Entscheidungsmatrix** (am Ende) → Teamregel für die Einordnung in Schritt 2.

**Kennzeichnung:**
- **[ROKI geprüft]** – steht so in einer der drei geprüften Recherchen im Repo (Fundstelle in Klammern)
- **[nicht geprüft]** – plausible Einschätzung, aber nicht durch die geprüften Recherchen belegt

Die Betriebsprofile sind die **fiktiven** Demo-Betriebe aus `DEMO_BETRIEBE.md`.

Abkürzungen für Fundstellen: *Robotertypen* = `ROKI_Recherche_Robotertypen_geprueft.md` · *Pflege* = `ROKI_Recherche_Roboter_in_der_Pflege_2026-08-18_geprueft.md` · *Roboterhunde* = `ROKI_Recherche_Roboterhunde_2026-08-13_geprueft.md`

---

## 1. Produktion und Handwerk – Metallbau

**Profil:** Metallbau Heidekamp (fiktiv), 15 Beschäftigte, Zäune, Tore, Geländer. Teams viel und getrennt auf Baustellen unterwegs.

### Problem-Hypothesen
- **Schweres Tragen auf der Baustelle:** Zaunelemente, Tore und Geländer müssen vom Fahrzeug über unebenes Gelände (Rasen, Schotter, Aushub, Stufen) getragen werden. Folgen können Rücken- und Gelenkbeschwerden und Ausfallzeiten sein.
- **Halten und Fixieren bei der Montage:** Bauteile müssen oft längere Zeit genau gehalten werden, während jemand bohrt, dübelt oder heftet.
- **Gleichförmige Arbeit in der Werkstatt:** Pfosten zuschneiden, Bohrungen setzen, gleiche Gitter schweißen – Zeit, die für Sonderanfertigungen fehlt.
- **Reibung zwischen Baustelle und Werkstatt:** ungenaues Aufmaß oder fehlendes Material führen zu Rückfragen und Nachfahrten. (Das ist der Kern der Live-Demo, siehe `DEMO_BETRIEBE.md`.)

**Nachfragen für die Abfrage (Ideen):** „Was tragen Sie am häufigsten, und wie weit?“ · „Wobei müssen Sie lange etwas halten?“ · „Welche Handgriffe in der Werkstatt wiederholen sich?“

### Lösungsansätze
| Ansatz | Was man wissen sollte | Kennzeichnung |
|---|---|---|
| **Exoskelette** (z. B. für Heben, Tragen, Überkopfarbeiten) | Passive Exoskelette sind keine Roboter im engeren Sinn, sondern angrenzende Assistenztechnik. Nutzen hängt von Tätigkeit und Passform ab; Auswahl, Gefährdungsbeurteilung, Schulung und Test sind nötig. | [ROKI geprüft] (Robotertypen 3.13) |
| Rein mechanische Exoskelette für die Baustelle (ohne Akku, robust gegen Staub und Nässe) | Plausibel für die Baustelle, aber nicht in der Recherche untersucht. | [nicht geprüft] |
| **Cobot in der Werkstatt** (z. B. Schweißen gleicher Teile) | Schweißen und Handwerk werden als typische Anwendung genannt. „Kollaborativ“ heißt nicht automatisch ohne Schutzeinrichtung – entscheidend sind Werkzeug, Werkstück, Geschwindigkeit und Arbeitsraum; eine Risikobeurteilung ist nötig. Integration bestimmt die Kosten stärker als der Arm. | [ROKI geprüft] (Robotertypen 3.3) |
| Schutz bei Cobot-Schweißzellen (Blendschutz, Absaugung) | Folgt fachlich aus dem Punkt oben, ist aber nicht einzeln belegt. Konkrete Normen klären. | [nicht geprüft] |
| **Vierbeinige Roboter („Roboterhunde“)** | Auf Baustellen werden sie zur wiederholten digitalen Erfassung des Baufortschritts erprobt (Forschung/Feldversuch). Spot trägt laut Hersteller bis zu 14 kg – als Lastenträger für schwere Bauteile kommen sie damit nicht in Frage. | [ROKI geprüft] (Roboterhunde 3.1, 3.15, 5) |
| Elektrische Raupentransporter, Treppensteiger, Vakuum-Hebegeräte | Mögliche einfache Alternativen für den Transport auf der Baustelle. | [nicht geprüft] |

---

## 2. Gastronomie – Kantine

**Profil:** Kantinenbetrieb Elbküche (fiktiv), 20 Beschäftigte, zwei Kantinen, Standort A kocht für beide.

### Problem-Hypothesen
- **Spitzen zur Mittagszeit:** Ausgabe, Kasse, Tische und Tablettwagen gleichzeitig.
- **Spülküche als körperlicher Engpass:** viel Geschirr in kurzer Zeit, feucht, heiß, laut – möglicherweise ein Grund für Personalwechsel.
- **Laufwege im Speisesaal:** Tablettwagen leeren, Stationen nachfüllen.
- **Transport zwischen den Standorten:** Speisen in Behältern und Nachschub werden täglich gehoben und verladen.

**Nachfragen für die Abfrage (Ideen):** „Was ist zwischen 11:30 und 13:30 am anstrengendsten?“ · „Wie viele Wege gehen Sie im Speisesaal?“ · „Wer belädt den Transport zum zweiten Standort?“

### Lösungsansätze
| Ansatz | Was man wissen sollte | Kennzeichnung |
|---|---|---|
| **Transport-/Serviceroboter im Speisesaal** | Typisch sind Speisen- und Getränketransport und Abräumen. Voraussetzungen: breite, ebene Wege, verlässliche Navigation, klare Übergabe an Personal oder Gäste, Hygiene- und Reinigungsprozesse, Akzeptanz. Eignung mittel bis gut bei häufigen Laufwegen; Nutzen stark prozessabhängig. Kauf, Leasing oder Mietmodelle sind üblich; belastbare herstellerunabhängige Preise gibt es laut Recherche nicht. | [ROKI geprüft] (Robotertypen 3.8) |
| Einschätzung: Ohne Greifarm arbeiten solche Roboter eher als fahrende Sammelstation, auf der Geschirr abgestellt wird | Team-Einschätzung, im konkreten System prüfen. | [nicht geprüft] |
| **Reinigungsroboter für den Speisesaal** | Gut bei größeren, regelmäßig zu reinigenden Flächen; weniger bei kleinen, verwinkelten oder oft umgestellten Flächen. Manuelle Ergänzung bleibt nötig. | [ROKI geprüft] (Robotertypen 3.7) |
| Kassen mit KI-Bilderkennung (Tablett wird erkannt) | Könnte die Kasse in der Spitze entlasten; Wirkung nicht untersucht. | [nicht geprüft] |

---

## 3. Gesundheit und Pflege – Pflegeheim mit Demenzbereich

**Profil:** Haus am Elbufer (fiktiv), 100 Beschäftigte, vollstationär, eigener Wohnbereich für Menschen mit Demenz.

### Problem-Hypothesen
- **Schwere Transfers:** Bewohner:innen mehrmals täglich vom Bett in den Rollstuhl mobilisieren, lagern, beim Gehen stützen.
- **Interne Transporte:** Wäsche, Mahlzeiten, Material, Abfall – Wege, die nicht pflegerisch sind, aber Zeit kosten.
- **Nachtdienst und Stürze im Demenzbereich:** Menschen stehen nachts auf, Kontrollgänge wecken andere, lückenlose Aufsicht ist nicht möglich.
- **Dokumentation:** Pflegeberichte binden Zeit am Computer.

**Nachfragen für die Abfrage (Ideen):** „Welche Transfers belasten Sie am meisten?“ · „Welche Wege gehen Sie, die mit Pflege nichts zu tun haben?“ · „Was macht den Nachtdienst schwer?“

### Lösungsansätze
| Ansatz | Was man wissen sollte | Kennzeichnung |
|---|---|---|
| **Transportroboter für Wäsche, Essen, Material** | Transport ist eines der reiferen Einsatzfelder, weil standardisierbar und meist ohne Körperkontakt. Entscheidend sind Aufzüge, Türen, Übergabepunkte, Hygiene, Störungen. Erste Schritte laut Recherche: Transportwege messen, häufige nicht-pflegerische Wege finden, Gebäude prüfen, Pilot auf einer Route, tatsächlich eingesparte Personalzeit messen. | [ROKI geprüft] (Pflege 2, 3.3) |
| **Multifunktionale Assistenzroboter (Beispiel Lio)** | Im 22-monatigen Feldtest reagierten Bewohner:innen überwiegend positiv; beim Personal sank die Akzeptanz, weil Zuverlässigkeit und Bedienbarkeit die Erwartungen nicht erfüllten. Eine wahrnehmbare Entlastung wurde nicht festgestellt. | [ROKI geprüft] (Pflege 2, 3.4) |
| **Körpernahe Robotik (Beispiel HoLLiECares)** | Autonomes Rollstuhlschieben und Patientenbegleitung scheiterten im Realtest teilweise an Hardware- und Integrationsproblemen. Körpernahe Systeme sind deutlich anspruchsvoller und sicherheitskritischer als Logistikroboter. | [ROKI geprüft] (Pflege 2, 3.5) |
| **Exoskelette (Beispiel EXPERTISE 4.0)** | Pflegekräfte beschrieben sie als spürbar entlastend und rückenschonend; leichte Modelle wurden besser angenommen. Passform und Nutzen hängen stark von Person und Tätigkeit ab. Einführung freiwillig und begleitet gestalten. | [ROKI geprüft] (Pflege 2, 3.6) |
| Sensoren für Sturz- und Bettfluchterkennung ohne Kamerabilder | Könnte Würde und Privatsphäre schützen; nicht in der Recherche untersucht. | [nicht geprüft] |
| KI-gestützte Spracheingabe für die Dokumentation | Software ist nicht Gegenstand der Pflege-Recherche. | [nicht geprüft] |

---

## 4. Logistik – Lager und Nahverkehr

**Profil:** Nordheide Logistik (fiktiv), 45 Beschäftigte, Lager im Schichtbetrieb, eigene Fahrzeuge, Lagerverwaltungssystem vorhanden.

### Problem-Hypothesen
- **Lange Laufwege beim Kommissionieren.**
- **Körperliche Belastung an der Rampe:** Be- und Entladen loser Ware von Hand.
- **Fahrpersonal für Stapler** ist schwer zu finden.
- **Suchzeiten und Fehler beim Kommissionieren:** falsch abgestellte Paletten, verzögertes Scannen.

**Nachfragen für die Abfrage (Ideen):** „Wie viel laufen Sie pro Schicht ungefähr?“ · „Was laden Sie von Hand?“ · „Wann suchen Sie Ware?“

### Lösungsansätze
| Ansatz | Was man wissen sollte | Kennzeichnung |
|---|---|---|
| **Fahrerlose Transportsysteme (FTS)** | Folgen festgelegten oder infrastrukturgestützten Routen; gut bei stabilen Materialflüssen und häufigen, wiederkehrenden Transporten. | [ROKI geprüft] (Robotertypen 3.4) |
| **Autonome mobile Roboter (AMR)** | Navigieren flexibler über Sensorik und berücksichtigen Hindernisse. Transport und Logistik war 2024 in der IFR-Herstellerstichprobe die größte Anwendungsgruppe professioneller Serviceroboter. Integration, Flottensteuerung und Anbindung ans Lagerverwaltungssystem können wesentliche Zusatzkosten verursachen; Flotten- und Systemanbindung erhöhen den Aufwand deutlich. Die Abgrenzung FTS/AMR wird am Markt nicht einheitlich verwendet. | [ROKI geprüft] (Robotertypen 3.5, K07) |
| **Exoskelette an der Rampe** | Heben und Tragen in der Logistik sind typische Anwendungen; Nutzen tätigkeitsspezifisch prüfen. | [ROKI geprüft] (Robotertypen 3.13) |
| Roboterwagen, die beim Kommissionieren folgen | Plausibler Einstieg; nicht in der Recherche untersucht. | [nicht geprüft] |
| Automatische Palettenwickler | Etablierte Technik; Wirtschaftlichkeit im Einzelfall prüfen. | [nicht geprüft] |

---

## 5. Facility Management – Hausmeisterservice

**Profil:** Hausmeisterservice Schwinge (fiktiv), 8 Beschäftigte, rund 40 Objekte (Wohnanlagen, Gewerbe, Schulen), davon rund 15 im Winterdienst. Alle sind verteilt unterwegs.

### Problem-Hypothesen
- **Saisonale Spitzen:** Winterdienst früh am Morgen auf vielen Objekten gleichzeitig; im Sommer lange Mäharbeiten bei Hitze.
- **Viel Zeit im Fahrzeug** zwischen den Objekten.
- **Wiederholtes Verladen schwerer Geräte** (Mäher, Laubbläser, Streusalz).
- **Kontrollfahrten ohne Anlass** (z. B. Container noch nicht voll).

**Nachfragen für die Abfrage (Ideen):** „Wie viel Ihrer Zeit sind Sie unterwegs?“ · „Was laden Sie täglich ein und aus?“ · „Welche Fahrten waren im Nachhinein unnötig?“

### Lösungsansätze
| Ansatz | Was man wissen sollte | Kennzeichnung |
|---|---|---|
| **Reinigungsroboter in großen Objekten** | Professionelle Reinigungsroboter sind eine eigenständige, wachsende Anwendung; gut bei größeren, regelmäßig zu reinigenden Flächen. Laut Recherche im Facility Management häufig näher am breiten Praxiseinsatz als komplexe Assistenzroboter. | [ROKI geprüft] (Robotertypen 2, 3.7) |
| **Inspektion mit Robotern oder Drohnen** | Gut für klar definierte Inspektionsaufgaben, besonders wenn gefährliche oder zeitaufwändige Begehungen wegfallen. Dienstleistungsmodelle können Investitionshürden senken. Bei Drohnen gelten luftrechtliche Anforderungen. | [ROKI geprüft] (Robotertypen 3.11) |
| Team-Einschätzung: Mobile Roboter, die täglich verladen und zum Kunden gefahren werden müssen, lohnen sich für einen kleinen Dienstleister kaum – Geräte sollten vor Ort bleiben | Plausible Überlegung, nicht belegt. | [nicht geprüft] |
| Mähroboter, die dauerhaft auf einer Liegenschaft bleiben | Nicht in der Recherche untersucht. | [nicht geprüft] |
| Sensoren statt Kontrollfahrten (Füllstand, Glätte) | Könnte unnötige Fahrten sparen; nicht in der Recherche untersucht. | [nicht geprüft] |

---

## Entscheidungsmatrix (Teamregel für Schritt 2)

Diese Matrix ist eine **Faustregel des Teams** für die Einordnung von Aufgaben. Sie ist aus den Ansätzen oben abgeleitet, aber als Ganzes **nicht von ROKI geprüft**. Die KI darf sie zur Begründung nutzen, nicht als Beleg.

| Kriterium | Eher geeignet für Robotik | Eher andere Ansätze |
|---|---|---|
| **Umgebung** | geschlossen, eben, gleichbleibend (Lager, Speisesaal, Flur) | wechselnd, unstrukturiert (Baustelle, Garten) → Exoskelette, Hilfsgeräte, Prozess |
| **Aufgabe** | häufig wiederkehrend, feste Wege (Transport, Bodenreinigung) | Einzelanfertigung, Arbeit direkt am Menschen → Cobot nur in der Werkstatt, Sensorik, Prozess |
| **Einsatzort** | Gerät bleibt an einem Ort | viele verteilte Orte → Fernüberwachung, Software, Prozess |
| **Kontakt zu Menschen** | Hintergrundaufgaben (Logistik) | direkte körperliche Nähe → hohe Hürden, Erwartungen klein halten |

---

## Offene Punkte: Belege nachreichen

Diese Angaben standen in Version 1, sind aber **nicht durch die geprüften Recherchen gedeckt**. Sie wurden entfernt oder abgeschwächt. Wer eine Quelle hat, trägt sie hier ein. Mit Quelle können sie als „nicht von ROKI geprüft, Quelle: …“ wieder aufgenommen werden.

- Gewicht von Zaunelementen und Toren (40 bis über 100 kg)
- Preise für Gastro-Serviceroboter (12.000–25.000 €) und Mietraten (400–800 €/Monat). *Hinweis:* Die Robotertypen-Recherche sagt ausdrücklich, dass keine belastbaren herstellerunabhängigen Durchschnittspreise gefunden wurden (3.8).
- Mindestbreite von Gängen (1,20 m)
- Anteil der Schicht für Botendienste in der Pflege (20–30 %)
- Laufwege beim Kommissionieren (10–18 km pro Schicht)
- Preise für mobile Transportroboter (25.000–60.000 €) und Anteil der Integration (40–50 %). *Hinweis:* Die Recherche nennt nur Herstellerbeispiele und „wesentliche Zusatzkosten“ (3.5).
- Amortisation von Palettenwicklern unter 12 Monaten – widerspricht außerdem dem Grundsatz, keine ROI-Aussagen zu machen (`PROJEKT.md`, Abschnitt 9)
- Anteil der Fahrzeit im Hausmeisterservice (30–50 %)
- „Reinigungsroboter sind die zweitgrößte Gruppe professioneller Serviceroboter“. *Korrektur:* Laut Recherche war 2024 Hospitality die zweitgrößte Gruppe (Robotertypen 3.8).
- Messbare Entlastung durch Schulter-Exoskelette
- Normen EN ISO 10218 und ISO 13482 (in den Recherchen nicht behandelt)
