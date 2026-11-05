# Recherche: Vierbeinige Roboter („Roboterhunde“) – Funktionsweise, Anwendungen und Einsatz als Wach-/Patrouillenroboter

## 1. Fragestellung

**Ausgangsfrage:** Was sind vierbeinige mobile Roboter („Roboterhunde“), wie funktionieren sie, für welche Aufgaben werden sie bereits eingesetzt bzw. erprobt, und welche Rolle können sie insbesondere bei Wach-, Sicherheits- und Patrouillenaufgaben spielen?

**Abgrenzung:** Betrachtet werden primär professionelle quadrupede Bodenroboter wie **Boston Dynamics Spot, ANYbotics ANYmal, Ghost Robotics Vision 60, Unitree B2** und spezialisierte Systeme auf diesen Plattformen. Reine Spielzeug-/Haustierroboter wie Sony Aibo stehen nicht im Mittelpunkt. Militärische Anwendungen werden zur Einordnung berücksichtigt, bewaffnete Systeme aber nicht technisch vertieft.

**Geografie:** international, mit besonderem Blick auf Europa/Deutschland.

**Stand der Recherche:** 13.08.2026.

Die Recherche ist eine strukturierte Recherchegrundlage mit Quellen, Unsicherheiten und prüfbaren Kernaussagen und **noch kein Faktencheck oder fertiger Artikel**.

## 2. Kurzfazit

1. **„Roboterhund“ bezeichnet keine eigene technische Kategorie, sondern meist einen vierbeinigen mobilen Roboter (quadruped robot).** Der zentrale Vorteil gegenüber Rädern ist die Fortbewegung in für Menschen gebauten oder unstrukturierten Umgebungen: Treppen, Schwellen, unebene Böden, Geröll oder enge Industrieanlagen. Moderne Systeme kombinieren Gelenkantriebe, Lage- und Kontaktsensorik, Kameras/LiDAR, Echtzeitregelung sowie zunehmend lernbasierte Bewegungssteuerung.

2. **Der derzeit besonders plausible professionelle Anwendungsfall ist die mobile Inspektion.** Roboter können wiederkehrend Messpunkte ablaufen und mit visuellen, thermischen, akustischen, LiDAR-, Gas- oder anderen Sensoren Daten aufnehmen. Das ist insbesondere dort interessant, wo Menschen bislang Kontrollgänge durchführen.

3. **Der „Wachhund“ existiert tatsächlich – aber eher als mobile Sensorplattform als als autonomer Ersatz eines Wachmanns.** Belegt sind automatisierte oder semi-autonome Patrouillen, Kamerabilder, Wärmebildaufnahmen, Detektion und Alarmierung sowie Fernbeobachtung.

4. **Für ROKI ist deshalb die Trennung von „Patrouille/Detektion“ und „Intervention“ wichtig.** Der Roboter kann einen Kontrollgang teilweise automatisieren und Beschäftigten „Augen und Ohren“ an entfernten oder gefährlichen Orten geben. Menschliche Bewertung, Eskalationsentscheidung und physische Intervention bleiben in den belegten Anwendungen dagegen zentral.

5. **Weitere ernsthafte Anwendungen reichen von Katastrophenschutz und Polizei über Bau, Bergbau und Energieanlagen bis zu Assistenzsystemen.** Das Spektrum reicht von der Erkundung einsturzgefährdeter Gebäude und unterirdischer Anlagen über Baufortschrittsdokumentation bis zu experimentellen Roboter-Blindenführhunden. Der Reifegrad unterscheidet sich erheblich.

6. **Die Technik ist nicht universell überlegen.** Batterielaufzeit, Kosten, schwierige Hindernisse, enge Räume, Zuverlässigkeit, Kommunikation, Cybersecurity und die sichere Interaktion mit Menschen bleiben Einschränkungen.

7. **Ein pauschaler Fachkräftesicherungs-Effekt lässt sich aus der bisherigen Evidenz nicht ableiten.** Gut begründbar ist dagegen ein aufgabenbezogener Effekt: wiederkehrende Kontrollgänge, Datenerfassung und Tätigkeiten in gefährlichen Bereichen können automatisiert oder aus der Distanz durchgeführt werden.

## 3. Rechercheergebnisse

### 3.1 Was ist ein „Roboterhund“?

**Befund:**  
Technisch handelt es sich um einen **beinbasierten mobilen Roboter mit vier Beinen**. „Roboterhund“ ist eine anschauliche, aber technisch unscharfe Bezeichnung. Die Systeme müssen nicht biologisch wie Hunde funktionieren oder aussehen.

**Evidenz:**  
Die wissenschaftliche Literatur spricht überwiegend von *quadruped robots*, *quadrupedal robots* oder *legged robots*. Eine aktuelle Review beschreibt sie als mobile Roboter mit biomimetischer vierbeiniger Struktur und hebt ihre Anpassungsfähigkeit an komplexes Gelände hervor.

Ein typisches Beispiel ist Spot: 12 Freiheitsgrade, 32,5 kg Eigengewicht, maximal 1,6 m/s Geschwindigkeit, bis zu 14 kg Nutzlast, 360°-Umgebungssensorik und laut Hersteller typischerweise 90 Minuten Batterielaufzeit.

**Einordnung:**  
Für ROKI ist „**vierbeiniger mobiler Roboter (umgangssprachlich Roboterhund)**“ fachlich sauberer als nur „Roboterhund“.

**Quellen/Fundstellen:**  
- Q01: Qin et al. (2026), Abstract.
- Q02: Boston Dynamics, Spot Documentation, „Robot specifications“, „Power“, „Payload“, „Sensing“.

**Unsicherheit/Einschränkung:**  
Produktdaten sind Herstellerangaben und keine unabhängigen Leistungsnachweise.

### 3.2 Warum vier Beine statt Räder?

**Befund:**  
Der wesentliche technische Mehrwert liegt in der **Geländegängigkeit**.

**Evidenz:**  
Spot ist für Treppen, Steigungen und Stufen spezifiziert. ANYmal wird für mehrgeschossige Industrieanlagen, Gittertreppen, nasse und unebene Böden entwickelt. Unitrees industrieller B2 soll ebenfalls Treppen, Steigungen und größere Hindernisse überwinden können.

Die wissenschaftliche Übersicht von Qin et al. führt die Fähigkeit, schwieriges Gelände zu überwinden, als zentrales Merkmal der Roboterklasse an.

**Einordnung:**  
Beine sind insbesondere dann relevant, wenn die Einsatzumgebung **nicht für Roboter optimiert** wurde, sondern für Menschen: Treppenhäuser, Anlagenplattformen, Baustellen, Tunnel, Bergwerke.

Auf ebenen Hallenböden kann dagegen ein Radroboter technisch einfacher und wirtschaftlicher sein. Der Vierbeiner ist also keine grundsätzlich bessere mobile Plattform.

**Quellen/Fundstellen:**  
- Q01: Qin et al. (2026), Überblick zu Anwendungen und Mobilität.
- Q02: Boston Dynamics, Spot Specifications.
- Q03: ANYbotics, ANYmal Produktinformationen.

**Unsicherheit/Einschränkung:**  
Welche Plattform tatsächlich wirtschaftlicher ist, hängt stark von Gelände, Aufgabe, Autonomiegrad und benötigter Sensorik ab.

### 3.3 Wie funktioniert die Fortbewegung?

**Befund:**  
Die Maschine muss fortlaufend Körperlage, Fußpositionen und Bodenkontakte koordinieren und dabei entscheiden, wo die nächsten Schritte gesetzt werden.

**Evidenz:**  
Moderne Quadrupeden verbinden Aktuatoren an den Beingelenken mit Zustandsabschätzung und Wahrnehmung. Die aktuelle Review unterscheidet insbesondere optimierungsbasierte und lernbasierte Verfahren für die Bewegungssteuerung und behandelt Reinforcement Learning, Wahrnehmung und Sim-to-Real-Transfer als zentrale Forschungsbereiche.

ANYbotics gibt beispielsweise an, für ANYmals Mobilität Reinforcement Learning einzusetzen.

**Einordnung:**  
Vereinfacht besteht das System aus:
- **Beinen und Aktuatoren:** erzeugen die Bewegung.
- **Propriozeptiver Sensorik:** misst unter anderem Gelenkzustände und Körperbewegung.
- **Umgebungssensorik:** Kameras, Tiefenkameras und/oder LiDAR erfassen Hindernisse und Gelände.
- **Lokalisierung und Navigation:** bestimmen Position und Route.
- **Bewegungsregelung:** berechnet Fußpositionen, Kräfte und Körperhaltung.
- **Autonomiesoftware:** führt Missionen bzw. Routen aus.
- **Nutzlastsensoren:** übernehmen die eigentliche Arbeitsaufgabe.

Der Roboterkörper ist daher häufig vor allem die **mobile Trägerplattform für Sensoren und Software**.

**Quellen/Fundstellen:**  
- Q01: Qin et al. (2026), Abschnitte zu Motion Control, Reinforcement Learning und Perception.
- Q03: ANYbotics, Robot Capabilities.

**Unsicherheit/Einschränkung:**  
Nicht jede Plattform nutzt dieselben Steuerungsverfahren; klassische Regelungs- und Optimierungsverfahren existieren neben lernbasierten Ansätzen.

### 3.4 Wahrnehmung: Was kann ein Roboterhund „sehen“, „hören“ und messen?

**Befund:**  
Die Einsatzmöglichkeiten werden wesentlich durch die auf dem Roboter montierte Sensorik bestimmt.

**Evidenz:**  
ANYmal integriert unter anderem visuelle Kamera, Wärmebildkamera, Ultraschallmikrofon und LiDAR; zusätzliche Sensoren können beispielsweise Gas erfassen.

Boston Dynamics bietet für Spot unterschiedliche Nutzlasten für Datenaufnahme, Navigation, Kommunikation, Gasdetektion und weitere Anwendungen an.

**Einordnung:**  
Typische Funktionen:
- RGB-/Zoomkamera: Sichtkontrolle, Instrumente ablesen, Dokumentation.
- Wärmebildkamera: Überhitzung, thermische Anomalien, Personen.
- LiDAR/Tiefenkameras: Navigation, 3D-Kartierung, digitaler Zwilling.
- Mikrofone/Ultraschall: ungewöhnliche Geräusche, Leckagen.
- Gassensoren: Gaspräsenz/-konzentration.
- Strahlungssensoren: radiologische Erkundung.
- Manipulatorarm: Türen/Objekte bedienen, Gegenstände untersuchen.

**Quellen/Fundstellen:**  
- Q03: ANYbotics, „Super-human senses“.
- Q22: Boston Dynamics, Spot Payloads.

**Unsicherheit/Einschränkung:**  
Nicht jede Plattform besitzt diese Fähigkeiten serienmäßig. Häufig handelt es sich um optionale Nutzlasten.

### 3.5 Autonom oder ferngesteuert?

**Befund:**  
„Autonom“ ist kein Alles-oder-nichts-Merkmal. Professionelle Systeme kombinieren unterschiedliche Betriebsarten.

**Evidenz:**  
Spot kann manuell bedient und für autonome Missionen eingerichtet werden. ANYmal kann vorgegebene Inspektionsmissionen nach Anbieterangaben ohne menschlichen Eingriff durchführen. Ghost-Robotics-Systeme bei der US Air Force wurden ausdrücklich als **semi-autonom** beschrieben und konnten zugleich aus einem Operationszentrum ferngesteuert werden.

**Einordnung:**  
Praktisch sind mindestens vier Ebenen zu unterscheiden:

**Teleoperation → assistierte Bewegung → autonome Navigation → autonome Mission.**

Auch bei einer autonomen Patrouille kann ein Mensch weiterhin Alarmmeldungen prüfen und Entscheidungen treffen.

**Quellen/Fundstellen:**  
- Q23: Boston Dynamics, Spot Product Overview.
- Q03: ANYbotics, ANYmal.
- Q06/Q07: U.S. Air Force, Tyndall.

**Unsicherheit/Einschränkung:**  
Hersteller verwenden den Begriff „autonom“ unterschiedlich; er sollte in späteren Texten jeweils konkretisiert werden.

### 3.6 Anwendung 1: Industrielle Inspektion und Instandhaltung

**Befund:**  
Dies ist derzeit einer der am besten dokumentierten zivilen Einsatzbereiche.

**Evidenz:**  
ANYbotics positioniert ANYmal explizit als autonome Inspektionsplattform für Öl & Gas, Chemie, Energieversorgung, Bergbau/Metalle und Transport. Die Plattform kann wiederkehrende Routen ablaufen und dabei visuelle, thermische, akustische und weitere Messungen durchführen.

Das EU-geförderte Projekt **Autonomous Dog Robot** entwickelt Keyper für industrielle Inspektion, Monitoring und Überwachung. Vorgesehene Funktionen sind unter anderem Gasleck-, Hotspot- und Dampfleckerkennung, Instrumentenablesung sowie Alarmierung.

**Einordnung:**  
Besonders geeignet erscheinen wiederkehrende **Operator Rounds**:

Temperatur kontrollieren → Manometer ablesen → Geräusch prüfen → Leck suchen → Messung dokumentieren → nächste Anlage.

Damit wird nicht zwingend „Instandhaltung automatisiert“, sondern zunächst die **Zustandsdatenerfassung**.

**Quellen/Fundstellen:**  
- Q03: ANYbotics, ANYmal.
- Q24: CORDIS, Autonomous Dog Robot.

**Unsicherheit/Einschränkung:**  
Viele wirtschaftliche Nutzenangaben stammen bislang von Herstellern bzw. deren Kundenreferenzen.

### 3.7 Praxisbeispiel BMW: SpOTTO

**Befund:**  
BMW setzt Spot im Motorenwerk Hams Hall in Großbritannien für reale Produktions- und Instandhaltungsaufgaben ein.

**Evidenz:**  
BMW beschreibt den dort „SpOTTO“ genannten Roboter als autonomes System, das Daten für den digitalen Zwilling sammelt. Zudem überwacht er Temperaturen und sucht nach undichten Druckluftleitungen.

**Einordnung:**  
Das Beispiel zeigt zwei unterschiedliche Rollen derselben Plattform:
1. **mobile Datenerfassung für den digitalen Zwilling**
2. **zustandsorientierte Instandhaltungsunterstützung**

**Quellen/Fundstellen:**  
- Q04/Q05: BMW Group, SpOTTO.

**Unsicherheit/Einschränkung:**  
Aussagen über wirtschaftliche Einsparungen oder Produktivitätssteigerungen sind in der verwendeten BMW-Quelle nicht unabhängig quantifiziert.

### 3.8 Anwendung 2: Wachhund, Sicherheitsdienst und Perimeterpatrouille

#### Was kann ein Roboter-Wachhund tatsächlich tun?

**Befund:**  
Der Wachhund-Use-Case ist real und technisch bereits kommerzialisiert. Die belastbaren Beispiele zeigen aber überwiegend **mobile Überwachung und Aufklärung**, nicht einen vollständig autonomen Ersatz menschlicher Sicherheitskräfte.

**Evidenz:**  
Typische Funktionskette:

**Patrouillenroute ablaufen → Kamera-/Sensordaten aufnehmen → Auffälligkeit erkennen → Leitstelle informieren → menschliche Bewertung → gegebenenfalls Intervention.**

#### Fall A: Tyndall Air Force Base

**Befund:**  
Die US Air Force integrierte ab März 2021 vier semi-autonome vierbeinige Ghost-Robotics-Fahrzeuge in die Sicherheitskräfte der Tyndall Air Force Base.

**Evidenz:**  
Die Air Force beschreibt die Systeme als mobile Sensorplattformen für abgelegene Bereiche. Sie sollten das Situationsbewusstsein erhöhen und Sicherheitskräfte entlasten, sodass diese andere kritische Bereiche überwachen können. Bereits 2020 wurde der geplante Einsatz als Teil von Patrouillen beschrieben. Vorgegebene Patrouillenpfade konnten aus dem Operationszentrum überwacht werden; Kameras und Sensoren ermöglichten Fernbeobachtung, außerdem war Sprachkommunikation vorgesehen.

Die Air Force betonte ausdrücklich, dass die Roboter **nicht die militärischen Diensthunde ersetzen** sollten.

**Einordnung:**  
Das ist ein besonders anschauliches Fachkräfte-Modell: Der Roboter automatisiert Teile des Kontrollgangs; Menschen bleiben für Bewertung, Reaktion und Tätigkeiten mit physischer Präsenz zuständig.

**Quellen/Fundstellen:**  
- Q06: U.S. Air Force, „Computerized canines to join Team Tyndall“.
- Q07: U.S. Air Force, „Tyndall brings in the big dogs“.

**Unsicherheit/Einschränkung:**  
Militärischer Sicherheitsdienst ist nicht direkt auf privaten Wachschutz in Deutschland übertragbar.

#### Fall B: Asylon DroneDog

**Befund:**  
Asylon bietet einen spezialisierten kommerziellen Wach-/Patrouillenroboter an.

**Evidenz:**  
DroneDog basiert auf Boston Dynamics Spot und ergänzt ihn unter anderem um Wärmebild- und optische Kameras sowie Asylons Software. Das System kann programmierte Patrouillen durchführen oder bei Alarmen losgeschickt werden. Eine menschlich besetzte Robotic Security Operations Center (RSOC) überwacht die Einsätze und kann eingreifen bzw. eskalieren. Eine Dockingstation lädt und schützt den Roboter zwischen Einsätzen.

Asylon meldete im Juli 2025 für DroneDog mehr als **150.000 zurückgelegte Patrouillenmeilen**. Die Zahl stammt jedoch vom Anbieter und wurde in dieser Recherche nicht unabhängig verifiziert.

**Einordnung:**  
Das ist deutlich näher am eigentlichen „Roboter-Wachhund“ als ein allgemeiner Spot. Bemerkenswert ist die Architektur:

**Autonomie + Sensorik + Leitstelle + Mensch.**

Der Wachroboter ist also eher Bestandteil eines automatisierten Sicherheitssystems als ein allein arbeitender künstlicher Wachmann.

**Quellen/Fundstellen:**  
- Q08: Asylon Robotics, DroneDog.
- Q09: Asylon Robotics, Missions-/Meilenzahl.

**Unsicherheit/Einschränkung:**  
Die Wirksamkeit bei der Reduktion von Einbrüchen, Diebstählen oder anderen Sicherheitsvorfällen ist in den verwendeten Quellen nicht unabhängig quantifiziert.

### 3.9 Grenzen des Roboter-Wachhunds

**Befund:**  
Aus der recherchierten Evidenz lässt sich kein belastbarer Nachweis ableiten, dass vierbeinige Roboter sämtliche Aufgaben eines menschlichen Sicherheitsmitarbeitenden übernehmen können.

**Evidenz:**  
Gut automatisierbar erscheinen:
- regelmäßige Kontrollgänge,
- große bzw. abgelegene Flächen kontrollieren,
- Video- und Wärmebildübertragung,
- Ereignisse dokumentieren,
- bestimmte Anomalien erkennen,
- Alarmstellen aus der Distanz erkunden.

Deutlich anspruchsvoller bleiben:
- komplexe Situationen interpretieren,
- Absichten von Menschen beurteilen,
- deeskalieren,
- situationsabhängige rechtliche Entscheidungen treffen,
- körperlich intervenieren,
- Erste Hilfe leisten,
- mit Besuchern oder Beschäftigten flexibel kommunizieren.

**Einordnung:**  
Die Aussage **„Roboterhunde ersetzen Wachpersonal“** wäre derzeit zu weitgehend. Besser belegt ist: Sie können Teile von Patrouillen- und Überwachungsaufgaben übernehmen und die Reichweite menschlicher Sicherheitskräfte erhöhen.

**Quellen/Fundstellen:**  
- Synthese aus Q06, Q07, Q08 und Q14.

**Unsicherheit/Einschränkung:**  
Es fehlen belastbare, unabhängige Langzeitstudien zur personellen und sicherheitsbezogenen Wirkung.

### 3.10 Anwendung 3: Polizei, Feuerwehr und Gefahrenerkundung

**Befund:**  
Vierbeiner werden genutzt, um gefährliche Orte zunächst aus der Distanz zu erkunden.

**Evidenz:**  
New York kündigte 2023 Digidog für Hochrisiko- und Gefahrensituationen an, darunter Geiselnahmen und Terrorlagen. Der Roboter sollte durch speziell ausgebildete Beamte ferngesteuert werden.

Beim Einsturz eines Parkhauses in Manhattan setzte die Feuerwehr einen Roboterhund in einem Gebäude ein, das für Einsatzkräfte zu gefährlich war. Nach Angaben der Stadt wurde mit einer Wärmebildkamera geprüft, ob weitere Personen eingeschlossen waren; außerdem wurden Gebäudeteile inspiziert.

Boston Dynamics vermarktet Spot für Remote Investigation, CBRNE-Lagen, Kampfmittelbeseitigung und nukleare Anwendungen. Diese Angaben belegen zunächst die vorgesehenen Hersteller-Use-Cases.

**Quellen/Fundstellen:**  
- Q10: City of New York, Digidog.
- Q11: City of New York, FDNY-Einsatz.
- Q25: Boston Dynamics, Government/Public Safety.

**Unsicherheit/Einschränkung:**  
Herstellerangaben zu möglichen Public-Safety-Anwendungen sind kein unabhängiger Wirksamkeitsnachweis.

### 3.11 Anwendung 4: Suche, Rettung und Katastrophenschutz

**Befund:**  
Unwegsame oder gefährliche Umgebungen sind ein naheliegendes Einsatzfeld, aber der operative Reifegrad variiert.

**Evidenz:**  
DHS ließ 2022 Ghost Robotics Vision 60 durch Ersthelfer evaluieren. Die Tester sahen Potenzial für Search-and-Rescue, berichteten aber auch Probleme in engen Bereichen und beim Überwinden bestimmter Hindernisse.

**Einordnung:**  
Das ist ein wichtiger Gegenpunkt zu Herstellerdarstellungen: Selbst ein explizit geländegängiger Vierbeiner bewältigt nicht automatisch jede reale Umgebung.

**Quellen/Fundstellen:**  
- Q14: U.S. Department of Homeland Security, Executive Summary.

**Unsicherheit/Einschränkung:**  
Einzelne Evaluationen lassen sich nicht ohne Weiteres auf alle Systeme übertragen.

### 3.12 Anwendung 5: Tunnel, Bergwerke und unterirdische Anlagen

**Befund:**  
Vierbeinige Roboter eignen sich grundsätzlich für autonome Erkundung unterirdischer Umgebungen.

**Evidenz:**  
Im DARPA Subterranean Challenge Final 2021 gewann Team CERBERUS die Systems Competition. Zum System gehörten vier ANYmal-Laufroboter sowie fliegende Systeme; Ziel waren autonome Kartierung, Navigation und Suche in Tunneln, unterirdischen urbanen Anlagen und Höhlen.

Eine aktuelle Untersuchung der Montanuniversität Leoben testete ANYmal D praxisnah für den Untertagebergbau. Die Autoren sehen Potenzial zur Verringerung manueller Inspektionsarbeiten, betonen aber, dass die Einsatzfähigkeit unter anspruchsvollen Bedingungen weiterhin untersucht werden muss.

**Einordnung:**  
Hier ist der Sicherheitsbezug besonders deutlich: Statt Menschen ausschließlich für Messungen in potenziell gefährliche Bereiche zu schicken, kann zunächst ein Sensorträger vorausgehen.

**Quellen/Fundstellen:**  
- Q12/Q13: DARPA und ETH Zürich.
- Q26: Montanuniversität Leoben / Springer.

**Unsicherheit/Einschränkung:**  
Forschungswettbewerbe und Pilotstudien sind nicht mit routinemäßigem Dauerbetrieb gleichzusetzen.

### 3.13 Anwendung 6: Öl, Gas und Chemie

**Befund:**  
Vierbeiner sind besonders interessant für Anlagen mit Treppen, Gitterrosten und potenziell gefährlichen Atmosphären.

**Evidenz:**  
ANYmal X ist für den Einsatz in explosionsgefährdeten Bereichen konzipiert und laut ANYbotics für Zone 1 nach IECEx/ATEX zertifiziert. Anwendungen umfassen autonome Inspektionsrouten sowie Gas-, Temperatur- und Anlagenüberwachung.

**Einordnung:**  
Hier verbindet sich der Fachkräftebezug mit Arbeitsschutz: Es geht nicht nur darum, Arbeitszeit einzusparen, sondern potenziell darum, **Exposition gegenüber gefährlichen Umgebungen zu reduzieren**.

**Quellen/Fundstellen:**  
- Q27: ANYbotics, ANYmal X.

**Unsicherheit/Einschränkung:**  
Die konkrete Zertifizierung sollte im späteren Faktencheck direkt gegen die Zertifizierungsunterlagen geprüft werden.

### 3.14 Anwendung 7: Energie und kritische Infrastruktur

**Befund:**  
Kraftwerke, Umspannwerke und andere Energieanlagen sind ein weiterer Inspektionsmarkt.

**Evidenz:**  
ANYbotics nennt thermische, nukleare, Wasser-, Solar- und Stromverteilungsanlagen als Einsatzbereiche und beschreibt unter anderem Temperatur-, Gas- und 3D-Erfassung.

**Einordnung:**  
Wiederkehrende Kontrollgänge und schwer zugängliche bzw. gefährliche Anlagenbereiche ähneln strukturell stark den Use-Cases in Chemie und Fertigung.

**Quellen/Fundstellen:**  
- Q28: ANYbotics, Power & Utilities.

**Unsicherheit/Einschränkung:**  
Die Aussage belegt vorrangig Anbieterpositionierung; unabhängige Einsatzdaten sind zusätzlich erforderlich.

### 3.15 Anwendung 8: Bau

**Befund:**  
Quadrupeden können Baustellen regelmäßig begehen und den aktuellen Zustand digital erfassen.

**Evidenz:**  
Eine Studie von 2022 erprobte einen vierbeinigen Roboter auf einer realen Baustelle und verband Robotersteuerung, 360°-Reality-Capture, BIM und Augmented Reality für die Fernüberwachung des Baufortschritts.

Eine aktuelle Review zu Quadrupeden im Bauwesen nennt Inspektion, 3D-Reality-Capture, Sicherheitsmonitoring, Logistik sowie BIM-/Digital-Twin-Integration als wesentliche Anwendungsfelder.

**Einordnung:**  
Besonders interessant ist die **wiederholbare Datenerfassung**: Derselbe Roboter kann regelmäßig dieselbe Route laufen und dadurch zeitlich vergleichbare Datensätze erzeugen.

**Quellen/Fundstellen:**  
- Q15: Buildings (2022), Feldstudie.
- Q29: Buildings (2026), Review.

**Unsicherheit/Einschränkung:**  
Marktreife und Wirtschaftlichkeit unterscheiden sich je nach Anwendung.

### 3.16 Anwendung 9: Mobile Manipulation

**Befund:**  
Mit einem Roboterarm wird aus dem mobilen Sensorträger eine Plattform, die ihre Umgebung auch physisch verändern kann.

**Evidenz:**  
Boston Dynamics bietet für Spot einen Arm an, mit dem sowohl ferngesteuerte als auch automatisierte Manipulations- und Sensoraufgaben möglich sind.

**Einordnung:**  
Dadurch entstehen perspektivisch Aufgaben wie:
- Tür öffnen,
- Hebel betätigen,
- Objekt aufnehmen,
- Messgerät positionieren,
- Probe nehmen.

Der technische Anspruch steigt allerdings erheblich: Navigation und Manipulation müssen koordiniert werden.

**Quellen/Fundstellen:**  
- Q30: Boston Dynamics, Spot Arm.

**Unsicherheit/Einschränkung:**  
Nicht jede demonstrierte Manipulationsaufgabe ist bereits robust für unbeaufsichtigten Routinebetrieb.

### 3.17 Anwendung 10: Assistenz und Roboter-Blindenführhund

**Befund:**  
Vierbeinige Roboter werden experimentell als Mobilitätsassistenz für blinde und sehbehinderte Menschen untersucht.

**Evidenz:**  
Kim et al. entwickelten einen AlienGo-basierten Führroboter mit starrem Geschirr und demonstrierten damit Führungen über Strecken von mehr als 100 Metern. Die Studie umfasste Daten von drei sehbehinderten/blinden und sechs sehenden Personen sowie Sicherheitsmechanismen.

Weitere Forschungsarbeiten untersuchen zugängliche Schnittstellen und geräuschärmere, ruhigere Gangarten.

**Einordnung:**  
Das ist derzeit eher **Forschung als etablierter Markt**.

**Quellen/Fundstellen:**  
- Q16: Kim et al. (2023), Abstract.
- Q31: ergänzende Forschung zu Guide Robots.

**Unsicherheit/Einschränkung:**  
Zuverlässigkeit, Sicherheit, Geräuschentwicklung, Vertrauen und Mensch-Roboter-Interaktion sind wesentlich anspruchsvoller als bei unbemannten Industrieinspektionen.

### 3.18 Anwendung 11: Forschung, Exploration und extreme Umgebungen

**Befund:**  
Quadrupeden sind wichtige Forschungsplattformen für autonome Exploration.

**Evidenz:**  
Die DARPA SubT Challenge zeigte autonome Erkundung von Tunneln, Höhlen und unterirdischen Anlagen mit Lauf- und Flugrobotern.

Die wissenschaftliche Übersicht von 2026 nennt auch Weltraumerkundung als Forschungsfeld.

**Einordnung:**  
Diese Forschung ist relevant, weil Navigation ohne GPS, Kommunikationsabbrüche, unbekanntes Gelände und autonome Entscheidungsfindung auch für Bergbau, Katastrophenschutz und industrielle Störfälle wichtig sind.

**Quellen/Fundstellen:**  
- Q01.
- Q12/Q13.

**Unsicherheit/Einschränkung:**  
Exploration und Wettbewerbsdemonstrationen sind nicht mit industrieller Routine gleichzusetzen.

### 3.19 Grenzen: Batterie und Reichweite

**Befund:**  
Die Energieversorgung begrenzt mobile Einsätze erheblich.

**Evidenz:**  
Boston Dynamics gibt für Spot typischerweise etwa **90 Minuten** Laufzeit an. ANYbotics nennt für ANYmal ebenfalls etwa 90 Minuten bzw. 2 km Reichweite je Ladung. Unitree bewirbt den deutlich größeren B2 mit mehrstündigen Laufzeiten; diese Werte sind Herstellerangaben und zwischen den Plattformen wegen unterschiedlicher Größe, Nutzung und Testbedingungen nicht direkt vergleichbar.

**Einordnung:**  
Für dauerhafte autonome Patrouillen ist deshalb eine Docking-/Ladeinfrastruktur wesentlich. Genau dieses Prinzip nutzt beispielsweise Asylon.

**Quellen/Fundstellen:**  
- Q02: Boston Dynamics.
- Q03: ANYbotics.
- Q08: Asylon.

**Unsicherheit/Einschränkung:**  
Herstellerwerte beruhen nicht zwingend auf vergleichbaren Testbedingungen.

### 3.20 Grenzen: Autonomie und reale Umgebung

**Befund:**  
Geländegängigkeit bedeutet nicht, dass jedes Hindernis autonom bewältigt werden kann.

**Evidenz:**  
Bei der DHS-Evaluation des Vision 60 mussten Bediener teilweise zwischen Bewegungsmodi wechseln oder das System zurücksetzen; die Evaluatoren bemängelten Schwierigkeiten in engen Räumen und bei einigen Hindernissen.

**Einordnung:**  
Werbevideos mit Treppensteigen, Sprüngen oder Parkour zeigen eine **technische Fähigkeit**, aber nicht automatisch die Zuverlässigkeit einer stundenlangen autonomen Mission in einer wechselnden Arbeitsumgebung.

**Quellen/Fundstellen:**  
- Q14: DHS.

**Unsicherheit/Einschränkung:**  
Ergebnisse gelten für das getestete System und den jeweiligen Versuchsaufbau.

### 3.21 Grenzen: Sicherheit und Akzeptanz im Kontakt mit Menschen

**Befund:**  
Wie Menschen vierbeinige Roboter wahrnehmen und auf sie reagieren, ist selbst Gegenstand der Forschung.

**Evidenz:**  
Eine Studie zu Begegnungen mit Spot und Unitree Go1 fand erhöhte Stressreaktionen gegenüber einer Baseline und höhere Belastung bei Begegnungen mit mehreren Robotern. Eine weitere Untersuchung zeigte, dass das Bewegungs-/Auftretensverhalten die wahrgenommene Sicherheit beeinflussen kann.

**Einordnung:**  
Das ist besonders relevant bei:
- Sicherheitsrobotern,
- öffentlichen Räumen,
- Krankenhäusern,
- Assistenzrobotern,
- gemeinsam genutzten Arbeitsbereichen.

Die bloße technische Kollisionsvermeidung reicht für gesellschaftliche und betriebliche Akzeptanz nicht unbedingt aus.

**Quellen/Fundstellen:**  
- Q32/Q33: Forschungsarbeiten zur Mensch-Roboter-Interaktion.

**Unsicherheit/Einschränkung:**  
Die Befunde sind noch nicht als allgemeingültige Aussagen für alle Einsatzkontexte zu verstehen.

### 3.22 Grenzen: Cybersecurity

**Befund:**  
Vernetzte bzw. teleoperierte Quadrupeden eröffnen zusätzliche Angriffsflächen.

**Evidenz:**  
Eine 2026 veröffentlichte systematische Übersicht identifiziert unter anderem Manipulation der Wahrnehmung, Kommunikationsstörungen, Angriffe auf Steuersignale, Lokalisierungsspoofing und Netzwerkangriffe als relevante Bedrohungsklassen. Die Autoren weisen zugleich darauf hin, dass Teile ihrer Plattformbewertung auf öffentlich verfügbaren Informationen beruhen.

**Einordnung:**  
Das ist für Roboter besonders folgenreich, weil ein Cyberangriff nicht nur Daten betrifft: Er kann potenziell die Bewegung einer physischen Maschine beeinflussen.

**Quellen/Fundstellen:**  
- Q34: systematische Übersicht zu Cybersecurity bei Quadrupeden.

**Unsicherheit/Einschränkung:**  
Die konkrete Risikolage hängt stark von Architektur, Netzwerk, Fernzugriff und eingesetzten Schutzmaßnahmen ab.

### 3.23 Datenschutz und Überwachung

**Befund:**  
Ein autonom patrouillierender Roboter mit Kameras ist datenschutzrechtlich nicht einfach nur „ein Roboter“; entscheidend ist insbesondere, welche personenbezogenen Daten seine Sensoren erfassen und verarbeiten.

**Evidenz:**  
Der Europäische Datenschutzausschuss hat eigene Leitlinien zur Verarbeitung personenbezogener Daten durch Videogeräte veröffentlicht.

Für private Betreiber in Deutschland existiert zudem die Orientierungshilfe der Datenschutzkonferenz zur Videoüberwachung durch nichtöffentliche Stellen.

**Einordnung:**  
Bei einem Roboter-Wachhund müssen daher beispielsweise Zweck, räumlicher Erfassungsbereich, Speicherung, Zugriffsrechte und gegebenenfalls automatisierte Bildanalyse getrennt bewertet werden.

Besonders sensibel wären zusätzliche biometrische Funktionen. Die EU-KI-Verordnung enthält für biometrische Fernidentifizierung eigene, teils sehr strenge Regelungen; insbesondere Strafverfolgungsanwendungen sind nicht mit normaler Werksüberwachung gleichzusetzen.

**Quellen/Fundstellen:**  
- Q20: EDPB, Guidelines 3/2019.
- Q21: Datenschutzkonferenz, Orientierungshilfe Videoüberwachung.
- Q35: EU AI Act.

**Unsicherheit/Einschränkung:**  
Keine Einzelfall-Rechtsberatung; konkrete Pflichten hängen vom tatsächlichen Einsatz ab.

### 3.24 Arbeitssicherheit und Regulierung

**Befund:**  
Der Einsatz eines mobilen Roboters in Arbeitsbereichen erfordert eine Sicherheitsbetrachtung des Gesamtsystems.

**Evidenz:**  
EU-OSHA bewertet fortgeschrittene Robotik grundsätzlich ambivalent: Sie kann Menschen aus gefährlichen Bereichen entfernen und repetitive bzw. belastende Tätigkeiten übernehmen, gleichzeitig entstehen neue physische, organisatorische und psychosoziale Risiken.

Für Maschinen gilt in der EU künftig die Maschinenverordnung (EU) 2023/1230; die konsolidierte EUR-Lex-Fassung nennt den **20. Januar 2027** als allgemeinen Anwendungsbeginn.

**Einordnung:**  
Die regulatorische Bewertung hängt vom konkreten Gesamtsystem, seiner Nutzlast, seinem Autonomiegrad und seinem Einsatzumfeld ab.

**Quellen/Fundstellen:**  
- Q17/Q18: EU-OSHA.
- Q19: Maschinenverordnung (EU) 2023/1230.

**Unsicherheit/Einschränkung:**  
Welche Normen und Rechtsvorschriften für eine konkrete Roboterinstallation gelten, hängt von Produkt, Nutzlast, Betriebsart, Einsatzort und Aufgabe ab. Eine allgemeine Aussage „Roboterhunde fallen unter Norm X“ wäre ohne konkrete Systemprüfung zu pauschal.

## 4. Bezug zu Fachkräftesicherung, Sektor und Technologie

### 4.1 Technologieeinordnung

**Technologie:** mobile Robotik / autonome mobile Robotik / fortgeschrittene Robotik.

Charakteristisch ist die Kombination aus:

**vierbeiniger Mobilität + Wahrnehmung + Navigation/Autonomie + anwendungsspezifischer Sensorik bzw. Manipulation.**

KI kann insbesondere bei Wahrnehmung, Bewegungssteuerung, Navigation und Anomalieerkennung eingesetzt werden. Ein vierbeiniger Roboter ist jedoch nicht automatisch „KI-gesteuert“ in jedem Teil seiner Funktion.

### 4.2 Welche Tätigkeiten können sich verändern?

| Bisherige Aufgabe | Mögliche Robotik-Unterstützung | Verbleibende menschliche Aufgabe |
|---|---|---|
| Kontrollgang | Route autonom ablaufen | Mission planen |
| Sichtprüfung | Bilder aufnehmen | Befund bewerten |
| Temperaturkontrolle | Wärmebild aufnehmen | Diagnose |
| Lecksuche | akustische/Gassensorik | Reparaturentscheidung |
| Sicherheitsrunde | Kamera-/Thermalpatrouille | Alarm bewerten/intervenieren |
| gefährlichen Raum betreten | Roboter vorschicken | Einsatzentscheidung |
| Baustelle dokumentieren | 360°-/3D-Aufnahme | Fortschritt bewerten |
| Anlage kartieren | LiDAR-Scan | Daten nutzen/planen |

**Einordnung:**  
Das ROKI-relevante Muster ist daher weniger **Berufsautomatisierung** als **Aufgabenautomatisierung und Distanzierung vom Gefahrenort**.

EU-OSHA beschreibt für fortgeschrittene Robotik generell, dass sich Arbeit von körperlichen Tätigkeiten hin zu stärker kognitiven Aufgaben verschieben kann und Beschäftigte teilweise Zeit für anspruchsvollere Aufgaben gewinnen.

### 4.3 Fachkräftesicherung

**Belastbar formulierbar:**  
Vierbeinige Roboter können Beschäftigte bei wiederkehrenden Datenerfassungs-, Kontroll- und Erkundungsaufgaben unterstützen und insbesondere die Notwendigkeit reduzieren, dass Menschen bestimmte gefährliche Bereiche für Routinekontrollen betreten.

**Noch nicht belastbar formulierbar:**  
„Roboterhunde lösen den Fachkräftemangel.“

Dafür fehlen sektorübergreifende unabhängige Wirksamkeitsnachweise.

Auch ein direkter Zusammenhang zwischen Fachkräfteengpässen und Einführung eines Quadrupeden ist in vielen Herstellerfällen nur behauptet oder plausibilisiert.

Der Fachkräftebezug sollte deshalb immer **sektor- und tätigkeitsbezogen** hergestellt werden.

## 5. Praxisbeispiele

| Beispiel | Anwendung | Reifegrad nach vorliegender Evidenz | Evidenzqualität |
|---|---|---|---|
| BMW Hams Hall / Spot „SpOTTO“ | digitale Zwillinge, Temperatur, Druckluftleckagen | realer Werksbetrieb | Unternehmensquelle |
| ANYmal | industrielle Inspektion | kommerzielles Produkt | Hersteller + Forschungsumfeld |
| ANYmal X | Öl/Gas/Chemie, Ex-Bereiche | kommerzielles Spezialprodukt | Herstellerangaben; Zertifizierung separat zu prüfen |
| Tyndall AFB / Ghost Robotics | Sicherheits- und Perimeterpatrouille | realer institutioneller Einsatz | Primärquelle US Air Force |
| Asylon DroneDog | kommerzielle Sicherheitsrunden | kommerzieller Betrieb | überwiegend Anbieterquelle |
| NYPD Digidog | Gefahrenerkundung | operativer Einsatz | öffentliche Primärquelle |
| FDNY „Bergh“ | einsturzgefährdetes Gebäude | dokumentierter Einsatz | öffentliche Primärquelle |
| CERBERUS / ANYmal | Tunnel-/Höhlenerkundung | fortgeschrittene Forschung/Demonstration | DARPA + ETH |
| Baustellenmonitoring | Reality Capture/BIM | Forschung/Feldversuch | wissenschaftliche Studie |
| Roboter-Blindenführhund | Mobilitätsassistenz | Forschung | wissenschaftliche Demonstration |

## 6. Widersprüche, Unsicherheiten und Recherchelücken

**Wirtschaftlichkeit:** Es gibt viele Hersteller- und Kundenangaben zu Zeitersparnis, Verfügbarkeit und Kostensenkung, aber deutlich weniger unabhängige Vergleichsstudien mit manueller Inspektion. Ein späterer Faktencheck sollte ROI-Aussagen deshalb besonders streng behandeln.

**Wachhund-Effektivität:** Der technische Einsatz für Patrouillen ist gut belegt. Weniger belastbar ist die Frage, ob dadurch tatsächlich weniger Diebstähle, Einbrüche oder Sicherheitsvorfälle entstehen. Anbieterzahlen zu absolvierten Missionen belegen Nutzung, aber nicht automatisch Wirksamkeit.

**Personalbedarf:** Es ist plausibel und in Einzelfällen explizit vorgesehen, dass automatisierte Patrouillen menschliche Kontrollgänge reduzieren. Wie viele Arbeitsstunden oder Stellen dadurch tatsächlich eingespart bzw. anderweitig eingesetzt werden können, ist nicht allgemein belegt.

**Autonomie:** Hersteller verwenden Begriffe wie „autonomous“ unterschiedlich. Ein System kann eine Route autonom ablaufen und trotzdem für Missionsplanung, Ausnahmen, Alarmbewertung und Wartung Menschen benötigen.

**KI-Anteil:** Nicht jede Funktion eines Quadrupeden basiert auf KI. Klassische Regelungs-, Optimierungs- und Planungsverfahren existieren neben Reinforcement Learning und KI-basierter Wahrnehmung.

**Deutschland:** Gute deutsche bzw. deutschsprachige Praxisbeispiele für einen tatsächlichen **Wachschutz-Einsatz** eines Roboterhunds waren in der Recherche deutlich weniger sichtbar als US-Beispiele. Für einen spezifischen ROKI-Beitrag zum Wachschutz wäre eine vertiefende Deutschland-/EU-Recherche sinnvoll.

**Fachkräftemangel im Sicherheitsgewerbe:** Für eine spätere Anwendungsgeschichte „Roboterhund als Wachhund“ sollte der konkrete Arbeitsmarktbedarf im deutschen Sicherheitsgewerbe separat anhand BA-/Destatis- und gegebenenfalls Branchenstatistik untersucht werden. Diese Recherche liefert dafür noch keine ausreichend belastbare Grundlage.

**Militärische Anwendungen:** Sie existieren und überschneiden sich technisch mit Sicherheits- und Aufklärungsanwendungen. Für ROKI sollte sauber zwischen ziviler Inspektion, zivilem Wachschutz, Polizei/Katastrophenschutz und militärischer Nutzung getrennt werden.

## 7. Prüfbare Kernaussagen

**K01:** Moderne vierbeinige Roboter werden unter anderem für industrielle Inspektion, Suche und Rettung, Verteidigungsanwendungen und Exploration erforscht bzw. eingesetzt.
- **Beleg:** Q01, Abstract.
- **Prüfpriorität:** normal
- **Grund:** Überblicksaussage aus wissenschaftlicher Review.

**K02:** Boston Dynamics gibt für Spot ein Gewicht von 32,5 kg, eine maximale Nutzlast von 14 kg und eine typische Batterielaufzeit von 90 Minuten an.
- **Beleg:** Q02, „Robot specifications“, „Power“, „Payload“.
- **Prüfpriorität:** hoch
- **Grund:** konkrete Herstellerzahlen.

**K03:** ANYmal verfügt in der Standard-Inspektionskonfiguration unter anderem über visuelle und thermische Kameras, Ultraschallmikrofon und LiDAR.
- **Beleg:** Q03, „Super-human senses“.
- **Prüfpriorität:** mittel
- **Grund:** Produktausstattung/Herstellerangabe.

**K04:** BMW nutzt einen Spot-Roboter im Werk Hams Hall zur Datenerfassung für einen digitalen Zwilling sowie zur Temperaturüberwachung und Erkennung undichter Druckluftleitungen.
- **Beleg:** Q04/Q05.
- **Prüfpriorität:** mittel
- **Grund:** Unternehmens-Praxisbeispiel.

**K05:** Die US Air Force integrierte im März 2021 vier semi-autonome vierbeinige Roboter von Ghost Robotics in die Sicherheitskräfte der Tyndall Air Force Base.
- **Beleg:** Q06/Q07.
- **Prüfpriorität:** mittel
- **Grund:** konkretes Praxisbeispiel.

**K06:** Die Tyndall-Systeme sollten abgelegene Bereiche patrouillieren und das Situationsbewusstsein der Sicherheitskräfte erhöhen, während menschliche Kräfte andere kritische Bereiche überwachen.
- **Beleg:** Q06/Q07.
- **Prüfpriorität:** mittel
- **Grund:** zentrale Aussage zum Wachhund-Use-Case.

**K07:** Die US Air Force stellte die vierbeinigen Roboter in Tyndall nicht als Ersatz für militärische Diensthunde, sondern als zusätzliche Sicherheitsebene dar.
- **Beleg:** Q07.
- **Prüfpriorität:** normal
- **Grund:** wichtige Abgrenzung Ersatz/Assistenz.

**K08:** Asylons DroneDog kombiniert Boston Dynamics Spot mit spezieller Sicherheits-Sensorik und Software für automatisierte Patrouillen und wird durch eine menschlich besetzte Leitstelle unterstützt.
- **Beleg:** Q08, Abschnitte „Automated Patrolling“, „Live RSOC Integration“.
- **Prüfpriorität:** hoch
- **Grund:** Herstellerangabe und Kernbeispiel „Wachhund“.

**K09:** Asylon gab im Juli 2025 an, DroneDog habe mehr als 150.000 Meilen in realen Einsätzen zurückgelegt.
- **Beleg:** Q09.
- **Prüfpriorität:** hoch
- **Grund:** nicht unabhängig verifizierte Anbieterzahl.

**K10:** New York City beschrieb Digidog 2023 als ferngesteuertes Werkzeug zur Erkundung von Hochrisiko- und Gefahrensituationen, unter anderem bei Geiselnahmen und Terrorlagen.
- **Beleg:** Q10.
- **Prüfpriorität:** mittel
- **Grund:** Polizei-/Sicherheitsanwendung.

**K11:** Beim Einsturz eines Parkhauses in New York wurde 2023 ein vierbeiniger Roboter eingesetzt, um ein für Einsatzkräfte zu gefährliches Gebäude mit Wärmebildsensorik zu erkunden.
- **Beleg:** Q11.
- **Prüfpriorität:** mittel
- **Grund:** konkreter dokumentierter Einsatz.

**K12:** Team CERBERUS gewann 2021 die Systems Competition der DARPA Subterranean Challenge; das Team setzte unter anderem vier ANYmal-Laufroboter ein.
- **Beleg:** Q12/Q13.
- **Prüfpriorität:** normal
- **Grund:** Forschungs-/Reifegradbeleg.

**K13:** Eine DHS-Evaluation von Ghost Robotics Vision 60 im Jahr 2022 kam zu dem Ergebnis, dass das System Search-and-Rescue unterstützen könnte, zugleich aber Einschränkungen in engen Räumen und beim Überwinden bestimmter Hindernisse zeigte.
- **Beleg:** Q14, Executive Summary.
- **Prüfpriorität:** hoch
- **Grund:** wichtiger unabhängiger Gegenbeleg zu Leistungsversprechen.

**K14:** Eine wissenschaftliche Studie von 2022 erprobte einen vierbeinigen Roboter auf einer realen Baustelle für Remote-Baufortschrittsmonitoring mit 360°-Reality-Capture und BIM/AR.
- **Beleg:** Q15, Methodik/Use Cases.
- **Prüfpriorität:** normal
- **Grund:** wissenschaftlicher Anwendungsbeleg.

**K15:** Eine 2023 veröffentlichte Forschungsarbeit demonstrierte einen quadrupeden Führroboter für blinde bzw. sehbehinderte Menschen auf Strecken von mehr als 100 Metern.
- **Beleg:** Q16, Abstract.
- **Prüfpriorität:** normal
- **Grund:** experimenteller Use-Case, nicht Marktreife.

**K16:** EU-OSHA bewertet fortgeschrittene Robotik als Möglichkeit, Beschäftigte von gefährlichen bzw. repetitiven Aufgaben zu entlasten, weist zugleich aber auf neue physische, psychosoziale und organisatorische Risiken hin.
- **Beleg:** Q17/Q18.
- **Prüfpriorität:** mittel
- **Grund:** zentrale ROKI-Einordnung.

**K17:** Die vorliegende Evidenz trägt nicht die allgemeine Aussage, dass vierbeinige Roboter vollständige Berufsrollen im Wachschutz oder in der Instandhaltung ersetzen.
- **Beleg:** Synthese aus Q06, Q08, Q14, Q17.
- **Prüfpriorität:** hoch
- **Grund:** Synthese/Abgrenzung; mehrere Belege erforderlich.

**K18:** Die EU-Maschinenverordnung (EU) 2023/1230 soll nach der aktuell konsolidierten Fassung grundsätzlich ab 20. Januar 2027 angewendet werden.
- **Beleg:** Q19.
- **Prüfpriorität:** hoch
- **Grund:** zeitabhängige Rechtsaussage.

**K19:** Für Videoaufnahmen eines privat eingesetzten Patrouillenroboters sind in der EU datenschutzrechtliche Anforderungen an die Verarbeitung personenbezogener Daten durch Videogeräte relevant.
- **Beleg:** Q20/Q21.
- **Prüfpriorität:** hoch
- **Grund:** Rechtsaussage; konkreter Einsatz erfordert Einzelfallprüfung.

## 8. Quellenverzeichnis

**Q01 – Qin et al. (2026):** *A comprehensive review of quadruped robots: Vision perception, motion control, applications and challenges.* Journal of Automation and Intelligence, online 28.05.2026. Abruf 13.08.2026.  
URL: https://www.sciencedirect.com/science/article/pii/S2949855426000341

**Q02 – Boston Dynamics:** *About Spot – Spot Documentation / Robot specifications.* Abruf 13.08.2026. Fundstellen: Dimensions, Environment, Power, Payload, Sensing.  
URL: https://dev.bostondynamics.com/docs/concepts/about_spot

**Q03 – ANYbotics:** *ANYmal – Autonomous Robotic Inspection Solution.* Abruf 13.08.2026. Fundstellen: „Super-human senses“, „Technical specifications“.  
URL: https://www.anybotics.com/robotics/anymal/

**Q04 – BMW Group (26.08.2024):** *SpOTTO – Ein Roboterhund mit vielen Tricks für das BMW Group Werk Hams Hall.* Abruf 13.08.2026.  
URL: https://www.bmwgroup.com/de/news/allgemein/2024/robodog.html

**Q05 – BMW Group:** Presseinformation zu SpOTTO; Fundstellen zu digitalem Zwilling, Temperaturüberwachung und Druckluftleckagen. Abruf 13.08.2026.  
URL: https://www.press.bmwgroup.com/deutschland/article/attachment/T0441679DE/615198

**Q06 – U.S. Air Force / 325th Fighter Wing (10.11.2020):** *Computerized canines to join Team Tyndall.* Abruf 13.08.2026.  
URL: https://www.tyndall.af.mil/News/Article-Display/Article/2411598/computerized-canines-to-join-team-tyndall/

**Q07 – U.S. Air Force / 325th Fighter Wing (25.03.2021):** *Tyndall brings in the big dogs.* Abruf 13.08.2026.  
URL: https://www.tyndall.af.mil/News/Article-Display/Article/2550793/tyndall-brings-in-the-big-dogs/

**Q08 – Asylon Robotics:** *DroneDog Security Robot.* Abruf 13.08.2026. Fundstellen: Automated Patrolling, Thermal + EO Cameras, Live RSOC Integration, DogHouse.  
URL: https://asylonrobotics.com/solutions/dronedog/

**Q09 – Asylon Robotics (17.07.2025):** *Asylon Celebrates 250,000 Combined Security Missions and 150,000 Miles Walked by DroneDog.* Abruf 13.08.2026. **Anbieterquelle; Zahlen nicht unabhängig verifiziert.**  
URL: https://asylonrobotics.com/company/news/250k-missions-150k-miles-dronedog-asylon-robotics/

**Q10 – City of New York (2023):** *Mayor Adams Makes Public Safety Announcement With NYPD Commissioner Sewell.* Fundstelle: Beschreibung Digidog. Abruf 13.08.2026.  
URL: https://www.nyc.gov/mayors-office/news/2023/04/transcript-mayor-adams-makes-public-safety-announcement-nypd-commissioner-sewell

**Q11 – City of New York (2023):** *Mayor Adams Highlights Public Safety Technology With FDNY Commissioner Kavanagh.* Fundstelle: Einsatz des Roboterhunds „Bergh“ beim Gebäudeeinsturz. Abruf 13.08.2026.  
URL: https://www.nyc.gov/mayors-office/news/2023/04/transcript-mayor-adams-highlights-public-safety-technology-fdny-commissioner-kavanagh

**Q12 – DARPA (24.09.2021):** *Team CERBERUS and Team Dynamo Win DARPA Subterranean Challenge Final Event.* Abruf 13.08.2026.  
URL: https://www.darpa.mil/news/2021/subterranean-challenge-winners

**Q13 – ETH Zürich (30.09.2021):** *Successful participation in robot competition.* Fundstelle: Einsatz von vier ANYmal-Robotern durch CERBERUS. Abruf 13.08.2026.  
URL: https://mavt.ethz.ch/news-and-events/d-mavt-news/2021/09/successful-participation-in-robot-competition.html

**Q14 – U.S. Department of Homeland Security:** *VISION 60 Q-Unmanned Ground Vehicle – Urban Operational Experimentation 2022.* Fundstelle: Executive Summary. Abruf 13.08.2026.  
URL: https://www.dhs.gov/sites/default/files/2023-01/22_0818_st_vision_60_q_ugv.pdf

**Q15 – Halder/Afsari/Akanmu bzw. verwandte Feldstudie:** *Real-Time and Remote Construction Progress Monitoring with a Quadruped Robot Using Augmented Reality.* Buildings 12(11), 2022. Fundstellen: Framework und Evaluation auf realer Baustelle. Abruf 13.08.2026.  
URL: https://www.mdpi.com/2075-5309/12/11/2027

**Q16 – Kim et al. (2023):** *Transforming a Quadruped into a Guide Robot for the Visually Impaired: Formalizing Wayfinding, Interaction Modeling, and Safety Mechanism.* Proceedings of Machine Learning Research 229, S. 2288–2303. Fundstelle: Abstract. Abruf 13.08.2026.  
URL: https://proceedings.mlr.press/v229/kim23c.html

**Q17 – EU-OSHA:** *Digitalisation of work – Advanced robotics and artificial intelligence.* Abruf 13.08.2026.  
URL: https://osha.europa.eu/en/themes/digitalisation-work

**Q18 – EU-OSHA:** *Advanced robotics and AI-based systems in the workplace: OSH challenges and opportunities originating from actual implementations.* Abruf 13.08.2026.  
URL: https://healthy-workplaces.osha.europa.eu/sites/hwc/files/hwc/publication/Advanced-robotics-and-AI-based-systems-in-the-workplace-OSH-originating_en.pdf

**Q19 – EUR-Lex:** *Regulation (EU) 2023/1230 on machinery*, konsolidierte Fassung vom 29.05.2026. Abruf 13.08.2026.  
URL: https://eur-lex.europa.eu/legal-content/de/ALL/?uri=CELEX%3A32023R1230

**Q20 – European Data Protection Board (30.01.2020):** *Guidelines 3/2019 on processing of personal data through video devices*, Final Version. Abruf 13.08.2026.  
URL: https://www.edpb.europa.eu/documents/guideline/guidelines-32019-on-processing-of-personal-data-through-video-devices_en

**Q21 – Datenschutzkonferenz:** *Orientierungshilfe Videoüberwachung durch nicht-öffentliche Stellen*, Stand 17.07.2020. Abruf 13.08.2026.  
URL: https://www.datenschutzkonferenz-online.de/media/oh/20200903_oh_v%C3%BC_dsk.pdf

**Q22 – Boston Dynamics:** *Spot Payloads.* Abruf 13.08.2026.  
URL: https://bostondynamics.com/products/spot/payload/

**Q23 – Boston Dynamics:** *Spot.* Abruf 13.08.2026.  
URL: https://bostondynamics.com/products/spot/

**Q24 – European Commission / CORDIS:** *Autonomous Dog Robot.* Abruf 13.08.2026.  
URL: https://cordis.europa.eu/project/id/101114429

**Q25 – Boston Dynamics:** *Government / Public Safety.* Abruf 13.08.2026.  
URL: https://bostondynamics.com/industry/government/

**Q26 – Montanuniversität Leoben / Springer:** Studie zum Einsatz von ANYmal D im Untertagebergbau. Abruf 13.08.2026.  
URL: https://link.springer.com/article/10.1007/s00501-025-01697-z

**Q27 – ANYbotics:** *ANYmal X.* Abruf 13.08.2026.  
URL: https://www.anybotics.com/robotics/anymal-x/

**Q28 – ANYbotics:** *Robotic inspections for power utilities.* Abruf 13.08.2026.  
URL: https://www.anybotics.com/industries/robotic-inspections-for-power-utilities/

**Q29 – Buildings (2026):** Review zu Quadrupeden im Bauwesen. Abruf 13.08.2026.  
URL: https://www.mdpi.com/2075-5309/16/5/962

**Q30 – Boston Dynamics:** *Spot Arm.* Abruf 13.08.2026.  
URL: https://bostondynamics.com/products/spot/arm/

**Q31 – arXiv:** Forschung zu quadrupeden Guide Robots und zugänglicher Interaktion. Abruf 13.08.2026.  
URL: https://arxiv.org/abs/2402.11125

**Q32 – arXiv:** Studie zu Stressreaktionen bei Begegnungen mit quadrupeden Robotern. Abruf 13.08.2026.  
URL: https://arxiv.org/abs/2403.17270

**Q33 – arXiv:** Forschung zur wahrgenommenen Sicherheit bei quadrupeden Robotern. Abruf 13.08.2026.  
URL: https://arxiv.org/abs/2403.05400

**Q34 – arXiv (2026):** Systematische Übersicht zu Cybersecurity-Bedrohungen bei quadrupeden Robotern. Abruf 13.08.2026.  
URL: https://arxiv.org/abs/2602.23404

**Q35 – EUR-Lex:** *Verordnung (EU) 2024/1689 – Artificial Intelligence Act.* Abruf 13.08.2026.  
URL: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu

---

**Prozessgrenze:** Diese Datei ist Recherchevorarbeit. Sie ersetzt weder den unabhängigen Faktencheck durch „ROKI Faktencheck“ noch die redaktionelle Bearbeitung oder menschliche Freigabe.
## Faktencheck

**Prüfstand:** 13.08.2026  
**Vorgehen:** Die 19 unter „Prüfbare Kernaussagen“ aufgeführten Aussagen wurden unabhängig von den dort bereits genannten Belegen erneut recherchiert. Bevorzugt wurden Primärquellen, amtliche Stellen, wissenschaftliche Originalpublikationen und aktuelle Hersteller-Originalquellen. Herstellerangaben werden als solche gekennzeichnet und nicht als unabhängiger Wirksamkeitsnachweis behandelt.

### K01
Aussage: Moderne vierbeinige Roboter werden unter anderem für industrielle Inspektion, Suche und Rettung, Verteidigungsanwendungen und Exploration erforscht bzw. eingesetzt.  
Status: bestätigt  
Bewertung: Die aktuelle wissenschaftliche Review von Qin et al. nennt ausdrücklich vorläufige Anwendungen in „search and rescue“, „infrastructure inspection“, „defense“ und „space exploration“. Die Aussage ist als Überblick über Forschungs- und Anwendungsfelder belastbar; sie sagt nicht aus, dass alle Bereiche bereits denselben Reifegrad erreicht haben.  
Unabhängige Quellen:
- *A comprehensive review of quadruped robots: Vision perception, motion control, applications and challenges* — Chuan Qin et al., Journal of Automation and Intelligence, online 28.05.2026, https://www.sciencedirect.com/science/article/pii/S2949855426000341, Abruf: 13.08.2026, Fundstelle: Abstract.

### K02
Aussage: Boston Dynamics gibt für Spot ein Gewicht von 32,5 kg, eine maximale Nutzlast von 14 kg und eine typische Batterielaufzeit von 90 Minuten an.  
Status: teilweise bestätigt  
Bewertung: Die aktuelle Spot-Entwicklerdokumentation (Version 5.1.4) nennt 32,5 kg Nettogewicht, 14 kg maximale Nutzlast und 90 Minuten typische Laufzeit. Die aktuelle öffentliche Produktseite nennt dagegen 33,8 kg „Net Mass/Weight (Spot with battery)“, weiterhin 14 kg Nutzlast und 90 Minuten durchschnittliche Laufzeit. Das Gewicht ist damit versions- bzw. dokumentationsabhängig; 32,5 kg sollte nicht ohne Versionsbezug als allgemeine aktuelle Spot-Spezifikation verwendet werden.  
Unabhängige Quellen:
- *About Spot — Spot 5.1.4 documentation* — Boston Dynamics, laufende Dokumentation, https://dev.bostondynamics.com/docs/concepts/about_spot, Abruf: 13.08.2026, Fundstelle: „Robot specifications“, „Power“, „Payload“.
- *Spot — Spot Specifications* — Boston Dynamics, laufende Produktseite, https://bostondynamics.com/products/spot/, Abruf: 13.08.2026, Fundstelle: „Spot Specifications“, „Battery & Payload“.
Abweichende Fundlage: Entwicklerdokumentation: 32,5 kg; aktuelle Produktseite: 33,8 kg mit Batterie.  
Empfohlene Formulierung: Boston Dynamics nennt für Spot je nach aktueller Dokumentations-/Produktversion rund 33 kg Eigengewicht, bis zu 14 kg Nutzlast und etwa 90 Minuten typische bzw. durchschnittliche Batterielaufzeit.

### K03
Aussage: ANYmal verfügt in der Standard-Inspektionskonfiguration unter anderem über visuelle und thermische Kameras, Ultraschallmikrofon und LiDAR.  
Status: bestätigt  
Bewertung: Die aktuelle ANYmal-Produktseite beschreibt eine „turn-key inspection suite“ mit integrierten visuellen und thermischen Kameras, Ultraschallmikrofon und LiDAR. Es handelt sich um Herstellerangaben zur Ausstattung, nicht um einen unabhängigen Leistungsnachweis der Sensoren.  
Unabhängige Quellen:
- *ANYmal – Autonomous Robotic Inspection Solution* — ANYbotics, o. D., https://www.anybotics.com/robotics/anymal/, Abruf: 13.08.2026, Fundstelle: „Turn-key inspection suite“ und „Super-human senses“.

### K04
Aussage: BMW nutzt einen Spot-Roboter im Werk Hams Hall zur Datenerfassung für einen digitalen Zwilling sowie zur Temperaturüberwachung und Erkennung undichter Druckluftleitungen.  
Status: bestätigt  
Bewertung: BMW beschreibt den in Hams Hall eingesetzten Spot („SpOTTO“) als autonomen Roboter, der Daten für den vollständig vernetzten digitalen Zwilling sammelt. BMW nennt außerdem die Überwachung von Anlagentemperaturen und das Identifizieren von Lecks in Druckluftleitungen als konkrete Instandhaltungsaufgaben. Die Aussage belegt den realen BMW-Anwendungsfall, nicht dessen wirtschaftliche Wirkung.  
Unabhängige Quellen:
- *„Brav, SpOTTO“: Robo-Dog scannt und überwacht Produktionsanlagen im BMW Group Werk Hams Hall* — BMW Group, 07.05.2024, https://www.press.bmwgroup.com/deutschland/article/detail/T0441679DE/, Abruf: 13.08.2026, Fundstelle: Einleitung sowie Abschnitte zu digitalem Zwilling und Instandhaltung.
- *SpOTTO – Ein Roboterhund mit vielen Tricks für das BMW Group Werk Hams Hall* — BMW Group, 26.08.2024, https://www.bmwgroup.com/de/news/allgemein/2024/robodog.html, Abruf: 13.08.2026, Fundstelle: „Einer von 1.600 Mitarbeitenden“ und „Datensammlung für den digitalen Zwilling des Werks“.

### K05
Aussage: Die US Air Force integrierte im März 2021 vier semi-autonome vierbeinige Roboter von Ghost Robotics in die Sicherheitskräfte der Tyndall Air Force Base.  
Status: bestätigt  
Bewertung: Die 325th Fighter Wing meldete, dass die ersten offiziellen semi-autonomen „robot dogs“ am 22.03.2021 zur Integration in die 325th Security Forces Squadron geliefert wurden; die Systeme werden Ghost Robotics und Immersive Wisdom zugeschrieben. Eine weitere offizielle Tyndall-Veröffentlichung nennt ausdrücklich vier Q-UGVs im Bestand. Zusammen tragen die Primärquellen die Aussage.  
Unabhängige Quellen:
- *Tyndall brings in the big dogs* — U.S. Air Force / 325th Fighter Wing Public Affairs, 25.03.2021, https://www.tyndall.af.mil/News/Article-Display/Article/2550793/tyndall-brings-in-the-big-dogs/, Abruf: 13.08.2026, Fundstelle: erster Absatz.
- *“Robot dog” names grounded in Checkertail heritage* — U.S. Air Force / Tyndall Air Force Base, 2021, https://www.tyndall.af.mil/News/Features/Display/Article/2712547/robot-dog-names-grounded-in-checkertail-heritage/, Abruf: 13.08.2026, Fundstelle: Bild-/Begleittext „Tyndall possesses four Q-UGV’s“.

### K06
Aussage: Die Tyndall-Systeme sollten abgelegene Bereiche patrouillieren und das Situationsbewusstsein der Sicherheitskräfte erhöhen, während menschliche Kräfte andere kritische Bereiche überwachen.  
Status: bestätigt  
Bewertung: Die Air Force beschreibt die Q-UGVs ausdrücklich als mobile Sensorplattformen, die abgelegene Bereiche patrouillieren und die situational awareness der Sicherheitskräfte erhöhen sollen. Gleichzeitig sollten menschliche „defenders“ andere kritische Bereiche weiter überwachen. Die Aussage entspricht sehr eng der Primärquelle.  
Unabhängige Quellen:
- *Tyndall brings in the big dogs* — U.S. Air Force / 325th Fighter Wing Public Affairs, 25.03.2021, https://www.tyndall.af.mil/News/Article-Display/Article/2550793/tyndall-brings-in-the-big-dogs/, Abruf: 13.08.2026, Fundstelle: Zitat von Mark Shackley.
- *Computerized canines to join Team Tyndall* — U.S. Air Force / 325th Fighter Wing Public Affairs, 10.11.2020, https://www.tyndall.af.mil/News/Article-Display/Article/2411598/computerized-canines-to-join-team-tyndall/, Abruf: 13.08.2026, Fundstelle: Abschnitte zu Patrouillenpfad, Fernüberwachung und Entlastung der Sicherheitskräfte.

### K07
Aussage: Die US Air Force stellte die vierbeinigen Roboter in Tyndall nicht als Ersatz für militärische Diensthunde, sondern als zusätzliche Sicherheitsebene dar.  
Status: bestätigt  
Bewertung: Die offizielle Air-Force-Veröffentlichung sagt ausdrücklich, dass die „robot dogs“ nicht dazu bestimmt seien, Military Working Dogs zu ersetzen, sondern eine zusätzliche Sicherheitsebene zu schaffen. Auch die frühere Ankündigung beschreibt sie als Unterstützung der Patrouillen, damit Menschen sich auf Aufgaben mit notwendiger physischer Präsenz konzentrieren können.  
Unabhängige Quellen:
- *Tyndall brings in the big dogs* — U.S. Air Force / 325th Fighter Wing Public Affairs, 25.03.2021, https://www.tyndall.af.mil/News/Article-Display/Article/2550793/tyndall-brings-in-the-big-dogs/, Abruf: 13.08.2026, Fundstelle: Bildunterschrift/Einordnung zum Military Working Dog.
- *Computerized canines to join Team Tyndall* — U.S. Air Force / 325th Fighter Wing Public Affairs, 10.11.2020, https://www.tyndall.af.mil/News/Article-Display/Article/2411598/computerized-canines-to-join-team-tyndall/, Abruf: 13.08.2026, Fundstelle: Absatz „not intended to replace the military working dogs“.

### K08
Aussage: Asylons DroneDog kombiniert Boston Dynamics Spot mit spezieller Sicherheits-Sensorik und Software für automatisierte Patrouillen und wird durch eine menschlich besetzte Leitstelle unterstützt.  
Status: bestätigt  
Bewertung: Asylon beschreibt DroneDog aktuell als Kombination aus Boston Dynamics Spot, eigener PupPack-Sicherheitsnutzlast und DroneIQ-Software. Die Produktseite nennt programmierte Patrouillen, Wärmebild- und elektrooptische Kameras sowie die Integration in ein rund um die Uhr betriebenes Robotic Security Operations Center, dessen menschliche Analysten eingreifen, eskalieren und Reaktionen steuern können. Dies ist eine Herstellerquelle und belegt Funktions-/Betriebsangaben, nicht unabhängig die Sicherheitswirkung.  
Unabhängige Quellen:
- *DroneDog Security Robot* — Asylon Robotics, o. D., https://asylonrobotics.com/solutions/dronedog/, Abruf: 13.08.2026, Fundstelle: „Automated Patrolling“, „Thermal + Electro-Optical Cameras“, „Live RSOC Integration“.

### K09
Aussage: Asylon gab im Juli 2025 an, DroneDog habe mehr als 150.000 Meilen in realen Einsätzen zurückgelegt.  
Status: bestätigt  
Bewertung: Asylon veröffentlichte am 17.07.2025 die Angabe, DroneDog habe mehr als 150.000 Meilen in „real world operational environments“ patrouilliert. Damit ist die Aussage über die Anbieterangabe selbst bestätigt. Eine unabhängige Prüfung der tatsächlich zurückgelegten Meilen ist aus den gefundenen Quellen weiterhin nicht möglich.  
Unabhängige Quellen:
- *Asylon Celebrates 250,000 Combined Security Missions and 150,000 Miles Walked by DroneDog* — Asylon Robotics, 17.07.2025, https://asylonrobotics.com/company/news/250k-missions-150k-miles-dronedog-asylon-robotics/, Abruf: 13.08.2026, Fundstelle: erster Absatz.
Abweichende Fundlage: Keine unabhängige Drittquelle mit zugänglicher Methodik bzw. Audit der Meilenzahl gefunden.  
Empfohlene Formulierung: Asylon gab im Juli 2025 an, DroneDog habe mehr als 150.000 Patrouillenmeilen in realen Betriebsumgebungen zurückgelegt; die Zahl ist eine nicht unabhängig verifizierte Anbieterangabe.

### K10
Aussage: New York City beschrieb Digidog 2023 als ferngesteuertes Werkzeug zur Erkundung von Hochrisiko- und Gefahrensituationen, unter anderem bei Geiselnahmen und Terrorlagen.  
Status: bestätigt  
Bewertung: In der offiziellen Ankündigung der Stadt wird Digidog als Werkzeug beschrieben, das Hochrisiko- und Gefahrensituationen bzw. -orte betreten, bewerten und die NYPD unterstützen soll. Zugleich heißt es, der Roboter werde ausschließlich von ausgebildeten TARU-Beamten ferngesteuert und unter anderem bei Geiselverhandlungen sowie Counter-Terrorism-Einsätzen eingesetzt.  
Unabhängige Quellen:
- *Transcript: Mayor Adams Makes Public Safety Announcement With NYPD Commissioner Sewell* — City of New York, April 2023, https://www.nyc.gov/mayors-office/news/2023/04/transcript-mayor-adams-makes-public-safety-announcement-nypd-commissioner-sewell, Abruf: 13.08.2026, Fundstelle: Vorstellung von „Digidog“ durch NYPD Chief Maddrey.

### K11
Aussage: Beim Einsturz eines Parkhauses in New York wurde 2023 ein vierbeiniger Roboter eingesetzt, um ein für Einsatzkräfte zu gefährliches Gebäude mit Wärmebildsensorik zu erkunden.  
Status: bestätigt  
Bewertung: Die Stadt New York dokumentiert den Einsatz eines Roboterhundes beim Parkhaus-Einsturz am 18.04.2023 ausdrücklich mit dem Zweck, keine Menschen in das instabile Gebäude schicken zu müssen. In der nachfolgenden öffentlichen Demonstration wurde erklärt, dass die am Einsatz verwendete Robotertechnik unter anderem mit Wärmebildtechnik zur Suche bzw. Lageerkundung diente. Der konkrete Einsatz eines vierbeinigen Roboters in der instabilen Struktur ist damit amtlich dokumentiert.  
Unabhängige Quellen:
- *Transcript: Mayor Adams Briefs Media on Building Collapse in Lower Manhattan* — City of New York, 18.04.2023, https://www.nyc.gov/mayors-office/news/2023/04/transcript-mayor-adams-briefs-media-building-collapse-lower-manhattan, Abruf: 13.08.2026, Fundstelle: Aussage des Bürgermeisters zum „robotic dog“ im instabilen Gebäude.
- *Mayor Adams Highlights Public Safety Technology With FDNY Commissioner Kavanagh* — City of New York, April 2023, https://www.nyc.gov/mayors-office/news/2023/04/transcript-mayor-adams-highlights-public-safety-technology-fdny-commissioner-kavanagh, Abruf: 13.08.2026, Fundstelle: Beschreibung der beim Einsturz eingesetzten Rettungs-/Erkundungstechnik.

### K12
Aussage: Team CERBERUS gewann 2021 die Systems Competition der DARPA Subterranean Challenge; das Team setzte unter anderem vier ANYmal-Laufroboter ein.  
Status: bestätigt  
Bewertung: DARPA nennt CERBERUS als Sieger der Systems Competition des Final Events 2021. ETH Zürich dokumentiert, dass CERBERUS im Finalwettbewerb vier ANYmal-Laufroboter einsetzte. Die zwei voneinander getrennten Primärquellen stützen beide Teile der Aussage.  
Unabhängige Quellen:
- *Team CERBERUS and Team Dynamo Win DARPA Subterranean Challenge Final Event* — DARPA, 24.09.2021, https://www.darpa.mil/news/2021/subterranean-challenge-winners, Abruf: 13.08.2026, Fundstelle: Ergebnisliste „Systems Competition“.
- *Successful participation in robot competition* — ETH Zürich, 30.09.2021, https://mavt.ethz.ch/news-and-events/d-mavt-news/2021/09/successful-participation-in-robot-competition.html, Abruf: 13.08.2026, Fundstelle: Absatz zum Finalwettbewerb und „four ANYmal legged robots“.

### K13
Aussage: Eine DHS-Evaluation von Ghost Robotics Vision 60 im Jahr 2022 kam zu dem Ergebnis, dass das System Search-and-Rescue unterstützen könnte, zugleich aber Einschränkungen in engen Räumen und beim Überwinden bestimmter Hindernisse zeigte.  
Status: bestätigt  
Bewertung: Der DHS-Bericht zur Urban Operational Experimentation vom 19.07.2022 hält fest, dass Ersthelfer Vision 60 als potenziell hilfreich für Search-and-Rescue bewerteten. Zugleich nennt die Executive Summary eingeschränkte Manövrierbarkeit in engen Räumen, Schwierigkeiten mit bestimmten Hindernissen, rutschigen Oberflächen und der Wahl des passenden Bewegungsmodus. Die Aussage gibt die unabhängige Evaluation sachgerecht wieder.  
Unabhängige Quellen:
- *VISION 60 Q-Unmanned Ground Vehicle – Urban Operational Experimentation 2022* — U.S. Department of Homeland Security, Science and Technology Directorate, Evaluation durchgeführt 19.07.2022, https://www.dhs.gov/sites/default/files/2023-01/22_0818_st_vision_60_q_ugv.pdf, Abruf: 13.08.2026, Fundstelle: Executive Summary, S. 1.
Abweichende Fundlage: Der Original-PDF-Server verweigerte beim direkten Abruf zeitweise den Zugriff; die indexierte DHS-Fassung der Executive Summary war zugänglich.

### K14
Aussage: Eine wissenschaftliche Studie von 2022 erprobte einen vierbeinigen Roboter auf einer realen Baustelle für Remote-Baufortschrittsmonitoring mit 360°-Reality-Capture und BIM/AR.  
Status: bestätigt  
Bewertung: Die peer-reviewte Buildings-Studie von 2022 beschreibt ein Framework zur Fernsteuerung eines Quadrupeden auf einer Baustelle, kombiniert mit 360°-Livevideo und einer AR-Lösung zum Vergleich des Ist-Zustands mit BIM-Planungsdaten. Die Implementierung wurde in zwei Use Cases experimentell evaluiert. Der Begriff „Reality-Capture“ ist als Zusammenfassung vertretbar; die Originalarbeit spricht konkret von 360° live-stream video und AR/BIM-Vergleich.  
Unabhängige Quellen:
- *Real-Time and Remote Construction Progress Monitoring with a Quadruped Robot Using Augmented Reality* — Buildings 12(11), 2022, https://www.mdpi.com/2075-5309/12/11/2027, Abruf: 13.08.2026, Fundstelle: Abstract und Methodik/Framework.
Empfohlene Formulierung: Eine Studie von 2022 erprobte einen vierbeinigen Roboter für das Remote-Baufortschrittsmonitoring mit 360°-Livevideo sowie BIM-/AR-Abgleich auf einer realen Baustelle.

### K15
Aussage: Eine 2023 veröffentlichte Forschungsarbeit demonstrierte einen quadrupeden Führroboter für blinde bzw. sehbehinderte Menschen auf Strecken von mehr als 100 Metern.  
Status: bestätigt  
Bewertung: Die 2023 in den Proceedings of Machine Learning Research veröffentlichte Arbeit beschreibt einen auf AlienGo basierenden quadrupeden Führroboter mit starrem Geschirr. Im Abstract wird ausdrücklich eine Demonstration über „100+ meter trajectories“ genannt. Die Studie ist ein Forschungsnachweis, kein Beleg für Marktreife oder Alltagstauglichkeit.  
Unabhängige Quellen:
- *Transforming a Quadruped into a Guide Robot for the Visually Impaired: Formalizing Wayfinding, Interaction Modeling, and Safety Mechanism* — J. Taery Kim et al., Proceedings of Machine Learning Research 229, 2023, https://proceedings.mlr.press/v229/kim23c.html, Abruf: 13.08.2026, Fundstelle: Abstract.

### K16
Aussage: EU-OSHA bewertet fortgeschrittene Robotik als Möglichkeit, Beschäftigte von gefährlichen bzw. repetitiven Aufgaben zu entlasten, weist zugleich aber auf neue physische, psychosoziale und organisatorische Risiken hin.  
Status: bestätigt  
Bewertung: Der von EU-OSHA beauftragte Policy Brief nennt als Chancen unter anderem die Entfernung von Beschäftigten aus gefährlichen Arbeitsumgebungen, die Reduktion körperlicher Belastung und die Automatisierung repetitiver bzw. monotoner Tätigkeiten. Zugleich klassifiziert er relevante Herausforderungen als physische, psychosoziale und organisatorische Faktoren und nennt beispielsweise Restrisiken körperlicher Verletzungen, Arbeitsplatzunsicherheit sowie neue Qualifikations- und Organisationsanforderungen.  
Unabhängige Quellen:
- *Advanced robotics and AI-based systems in the workplace: OSH challenges and opportunities originating from actual implementations* — EU-OSHA / BAuA-Autorenteam, 19.06.2023, https://healthy-workplaces.osha.europa.eu/sites/hwc/files/hwc/publication/Advanced-robotics-and-AI-based-systems-in-the-workplace-OSH-originating_en.pdf, Abruf: 13.08.2026, Fundstellen: S. 1–4, insbesondere „Opportunities“ und „Challenges“.
- *Fortschrittliche Robotik und KI-gestützte Systeme am Arbeitsplatz: Herausforderungen und Chancen ...* — EU-OSHA, 19.06.2023, https://healthy-workplaces.osha.europa.eu/de/publications/advanced-robotics-and-ai-based-systems-workplace-osh-challenges-and-opportunities-originating-actual-implementations, Abruf: 13.08.2026, Fundstelle: Zusammenfassung.

### K17
Aussage: Die vorliegende Evidenz trägt nicht die allgemeine Aussage, dass vierbeinige Roboter vollständige Berufsrollen im Wachschutz oder in der Instandhaltung ersetzen.  
Status: bestätigt  
Bewertung: Die überprüften Praxisquellen beschreiben überwiegend Aufgabenautomatisierung: Patrouillen, mobile Sensorik, Fernbeobachtung, Datenerfassung und wiederkehrende Kontrollaufgaben. Tyndall betont ausdrücklich Assistenz statt Ersatz; Asylon integriert menschliche Analysten für Intervention und Eskalation; BMW beschreibt SpOTTO als Unterstützung der Instandhaltung; EU-OSHA analysiert vor allem die Automatisierung von Tätigkeiten und den Wandel von Aufgabenprofilen. Ein belastbarer sektorübergreifender Nachweis für den vollständigen Ersatz ganzer Berufsrollen wurde in den geprüften Quellen nicht gefunden.  
Unabhängige Quellen:
- *Computerized canines to join Team Tyndall* — U.S. Air Force / 325th Fighter Wing Public Affairs, 10.11.2020, https://www.tyndall.af.mil/News/Article-Display/Article/2411598/computerized-canines-to-join-team-tyndall/, Abruf: 13.08.2026, Fundstelle: Unterstützung der Patrouillen; menschliche Aufgaben mit physischer Präsenz bleiben.
- *DroneDog Security Robot* — Asylon Robotics, o. D., https://asylonrobotics.com/solutions/dronedog/, Abruf: 13.08.2026, Fundstelle: „Live RSOC Integration“.
- *„Brav, SpOTTO“: Robo-Dog scannt und überwacht Produktionsanlagen im BMW Group Werk Hams Hall* — BMW Group, 07.05.2024, https://www.press.bmwgroup.com/deutschland/article/detail/T0441679DE/, Abruf: 13.08.2026, Fundstelle: Unterstützung der Instandhaltung.
- *Advanced robotics and AI-based systems in the workplace: OSH challenges and opportunities originating from actual implementations* — EU-OSHA / BAuA-Autorenteam, 19.06.2023, https://healthy-workplaces.osha.europa.eu/sites/hwc/files/hwc/publication/Advanced-robotics-and-AI-based-systems-in-the-workplace-OSH-originating_en.pdf, Abruf: 13.08.2026, Fundstellen: S. 2–4.
Empfohlene Formulierung: Die geprüfte Evidenz belegt vor allem die Automatisierung einzelner Patrouillen-, Inspektions- und Datenerfassungsaufgaben; ein allgemeiner Ersatz vollständiger Berufsrollen im Wachschutz oder in der Instandhaltung ist daraus nicht ableitbar.

### K18
Aussage: Die EU-Maschinenverordnung (EU) 2023/1230 soll nach der aktuell konsolidierten Fassung grundsätzlich ab 20. Januar 2027 angewendet werden.  
Status: bestätigt  
Bewertung: Artikel 54 der aktuellen konsolidierten Fassung vom 29.05.2026 bestimmt, dass die Verordnung grundsätzlich ab 20.01.2027 gilt. Einzelne Artikel gelten bereits zu früheren Zeitpunkten; deshalb ist „grundsätzlich“ als Einschränkung wichtig. Die Aussage ist aktuell belastbar.  
Unabhängige Quellen:
- *Regulation (EU) 2023/1230 on machinery — consolidated text 29/05/2026* — EUR-Lex, konsolidierte Fassung 29.05.2026, https://eur-lex.europa.eu/eli/reg/2023/1230/en, Abruf: 13.08.2026, Fundstelle: Artikel 54 „Entry into force and application“.
- *Regulation (EU) 2023/1230 — Summary* — EUR-Lex, https://eur-lex.europa.eu/legal-content/EN/LSU/?uri=CELEX%3A32023R1230, Abruf: 13.08.2026, Fundstelle: „From when does the regulation apply?“.
Empfohlene Formulierung: Die Maschinenverordnung (EU) 2023/1230 gilt nach der konsolidierten Fassung grundsätzlich ab 20. Januar 2027; einzelne Bestimmungen gelten bereits früher.

### K19
Aussage: Für Videoaufnahmen eines privat eingesetzten Patrouillenroboters sind in der EU datenschutzrechtliche Anforderungen an die Verarbeitung personenbezogener Daten durch Videogeräte relevant.  
Status: bestätigt  
Bewertung: Die EDPB-Leitlinien 3/2019 behandeln die Verarbeitung personenbezogener Daten durch Videogeräte ausdrücklich; die deutsche Datenschutzkonferenz konkretisiert dies für Videoüberwachung durch nichtöffentliche Stellen. Für einen privat betriebenen Patrouillenroboter ist dieses Regelungsfeld daher relevant, sobald die Videoaufnahme personenbezogene Daten erfasst bzw. verarbeitet. Welche Rechtsgrundlage, Informationspflichten, Speicherdauer oder weiteren Anforderungen konkret gelten, hängt vom Einsatzfall ab.  
Unabhängige Quellen:
- *Guidelines 3/2019 on processing of personal data through video devices* — European Data Protection Board, finale Fassung 30.01.2020, https://www.edpb.europa.eu/documents/guideline/guidelines-32019-on-processing-of-personal-data-through-video-devices_en, Abruf: 13.08.2026, Fundstelle: Gesamtdokument/Anwendungsbereich.
- *Orientierungshilfe Videoüberwachung durch nicht-öffentliche Stellen* — Datenschutzkonferenz, Stand 17.07.2020, https://www.datenschutzkonferenz-online.de/media/oh/20200903_oh_v%C3%BC_dsk.pdf, Abruf: 13.08.2026, Fundstelle: Titel, Begriffsbestimmung „nicht-öffentliche Stellen“ und rechtliche Anforderungen an Videoüberwachung.
Empfohlene Formulierung: Soweit ein privat eingesetzter Patrouillenroboter mit seinen Kameras personenbezogene Daten erfasst oder verarbeitet, sind die datenschutzrechtlichen Vorgaben für Videoüberwachung bzw. Videogeräte zu beachten; die konkreten Pflichten hängen vom Einsatzfall ab.

## Zusammenfassung des Faktenchecks

Geprüft wurden **19 Kernaussagen**. Davon sind **18 bestätigt** und **1 teilweise bestätigt**; **0 widersprüchlich**, **0 nicht verifizierbar** und **0 veraltet**.

Die wichtigste materielle Korrektur betrifft **K02**: Die Spot-Gewichtsangabe ist zwischen aktueller Entwicklerdokumentation (32,5 kg) und aktueller Produktseite (33,8 kg mit Batterie) nicht einheitlich. Für eine Veröffentlichung sollte deshalb entweder die konkrete Dokumentationsversion genannt oder neutral von „rund 33 kg“ gesprochen werden.

Bei **K09** ist nur sicher bestätigt, dass Asylon die Zahl von mehr als 150.000 Patrouillenmeilen im Juli 2025 veröffentlicht hat; die zugrunde liegende Betriebszahl konnte nicht unabhängig auditiert werden. Bei Hersteller- und Anbieterquellen wie ANYbotics und Asylon sollten Produktfunktionen daher als Herstellerangaben gekennzeichnet bleiben, sofern daraus Leistungs- oder Wirkungsbehauptungen abgeleitet werden.

Die Aussagen zum „Roboter-Wachhund“ sind insgesamt belastbar, wenn sie auf **Patrouille, Sensorik, Fernbeobachtung, Alarmierung und menschlich überwachte Eskalation** begrenzt werden. Die geprüfte Evidenz trägt **nicht** die pauschale Aussage, vierbeinige Roboter ersetzten menschliches Wachpersonal oder vollständige Instandhaltungsberufe.

Vor redaktioneller Verwendung zwingend anzupassen sind **K02** (Gewicht versionsabhängig präzisieren) und **K09** (150.000 Meilen ausdrücklich als nicht unabhängig verifizierte Anbieterangabe kennzeichnen). Bei **K19** sollte stets die Bedingung ergänzt werden, dass datenschutzrechtliche Videoanforderungen greifen, soweit tatsächlich personenbezogene Daten erfasst oder verarbeitet werden.

Die finale fachliche und redaktionelle Verantwortung bleibt bei der menschlichen Freigabe.
