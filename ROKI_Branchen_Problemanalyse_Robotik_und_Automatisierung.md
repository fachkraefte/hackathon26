# ROKI – Branchenspezifische Problemanalyse: Robotik und Automatisierung in KMU

**Zweck dieses Dokuments:**  
Dieses Dokument verbindet die betrieblichen Realitäten von fünf typischen KMU-Profilen (Handwerk, Gastronomie, Pflege, Logistik, Facility Management) mit dem **geprüften Wissensstand der ROKI-Recherchen** (u. a. zu Robotertypen nach ISO 8373/IFR, Pflege-Praxisprojekten wie *Lio*, *HoLLiECares*, *EXPERTISE 4.0* sowie Sicherheitsnormen von DGUV und ISO 13482).

Es folgt dem ROKI-Grundsatz: **Vom konkreten Arbeitsalltag zur Technologie** – ehrlich, evidenzbasiert und frei von technischer Euphorie.

---

## 1. Handwerk: Metallbau & Montage
**Betriebsprofil:** 15 Beschäftigte. Schwerpunkt auf Zäunen, Toren und Geländern. Teams sind viel und getrennt voneinander auf Baustellen und Kundenliegenschaften unterwegs.

### Typische Probleme im Arbeitsalltag
* **Schwere Schlepp- und Hebearbeit auf Baustellen:** Zaunelemente, schwere Schiebetore und Geländer wiegen oft zwischen 40 und über 100 kg. Sie müssen vom Fahrzeug über unebenes Gelände (Rasen, Schotter, Erdaushub, Stufen) getragen werden. Führt zu berufsbedingtem Rücken- und Gelenkverschleiß, Ausfallzeiten und Nachwuchssorgen.
* **Körperlich anstrengendes Halten & Fixieren:** Bei der Montage müssen Bauteile minutenlang exakt in Waage gehalten werden, während ein Kollege bohrt, dübelt oder heftet.
* **Monotone Routinearbeiten in der Werkstatt:** Fachkräfte verbringen Stunden damit, Zaunpfosten zuzuschneiden, Bohrungen zu setzen oder standardisierte Gitterstrukturen zu schweißen – Zeit, die für anspruchsvolle Sonderanfertigungen fehlt.
* **Reibungsverluste zwischen Baustelle und Werkstatt:** Ungenaue Handaufmaße oder fehlendes Montagematerial vor Ort erfordern zeitintensive Rückfragen und Nachfahrten.

### Verknüpfung mit den ROKI-Rechercheergebnissen
* **Exoskelette als Assistenztechnik (Abgrenzung nach ISO 8373):**  
  *Gemäß ROKI-Grundlagenrecherche* gelten passive Exoskelette nicht als Roboter im engeren Sinne (da kein eigener Antrieb/keine Autonomie), sondern als **angrenzende physische Assistenztechnologie**. 
  * *Praxisnutzen im Metallbau:* Für die Baustelle sind vor allem **rein mechanische Rücken-Exoskelette (Federzug/Gasdruck)** relevant. Sie benötigen keinen Akku, sind unempfindlich gegen Staub, Feuchtigkeit und Funkenflug und passen in jeden Montagebus. Für Überkopf-Geländermontagen reduzieren Schulter-Exoskelette die Muskelermüdung messbar.
* **Cobots in der Werkstatt – Sicherheitsrealität nach DGUV:**  
  Kollaborierende Roboter (Cobots) eignen sich hervorragend für kleine Serien (Schweißen von 20 gleichen Zaunelementen).  
  *Wichtige ROKI-Erkenntnis:* „Kollaborierend“ bedeutet **nicht automatisch schutzzaunfrei**. Nach DGUV/IFA-Regeln geht beim Schweißen die Gefährdung nicht primär vom Roboterarm aus, sondern vom **Werkzeug und Prozess** (Lichtbogen, Hitze, Schweißspritzer, giftige Gase). Auch eine Cobot-Schweißzelle im Handwerksbetrieb benötigt daher Blend- und Absaugschutz sowie eine Sicherheitsunterweisung nach EN ISO 10218.
* **Realitäts-Check zu Laufrobotern („Roboterhunden“):**  
  *Gemäß ROKI-Recherche Roboterhunde:* Vierbeinige Laufroboter (z. B. Boston Dynamics Spot, Unitree) faszinieren auf Baustellen, dienen heute aber primär der **autonomen Bauvermessung / 3D-Laserscannung** (z. B. mit Leica/Trimble) oder Inspektion. Als Lastenträger für schwere Zaunelemente sind sie aktuell weder wirtschaftlich noch mechanisch ausgelegt (Nutzlasten liegen meist nur bei 10–15 kg).
* **Praxistaugliche Alternative für die Baustelle:** Kompakte elektrische Raupentransporter, motorisierte Treppensteiger und mobile Vakuum-Hebelifter.

---

## 2. Gastronomie: Kantine & Mensa
**Betriebsprofil:** 20 Beschäftigte. Betrieb von zwei festen Kantinenstandorten mit Mittagsverpflegung.

### Typische Probleme im Arbeitsalltag
* **Massive Belastungsspitzen zur Mittagszeit:** Zwischen 11:30 und 13:30 Uhr ballt sich die Arbeit: Essensausgabe, Kassiervorgang, Tische reinigen und Tablettwagen leeren müssen gleichzeitig bewältigt werden.
* **Körperlicher Engpass Spülküche:** Hunderte Tabletts, Teller, Schalen und Bestecke müssen in kürzester Zeit abgeräumt, sortiert, gereinigt und verräumt werden. Das feucht-heiße, laute Arbeitsumfeld führt zu hoher Personalfluktuation.
* **Hohe Laufwege im Gastraum:** Servicekräfte legen weite Strecken zurück, um Tablettwagen zu leeren und Stationen nachzufüllen.
* **Standort-Logistik:** Der tägliche Transport von Speisen (GN-Behälter) und Nachschub zwischen Zentralküche und zweitem Standort erfordert wiederkehrendes Heben und Verladen.

### Verknüpfung mit den ROKI-Rechercheergebnissen
* **Serviceroboter im Gastraum (IFR-Kategorie Hospitality):**  
  Fahrroboter mit Ablagefächern (Tray-Roboter) entlasten Servicekräfte spürbar von reinen Transportwegen.  
  *Einschränkung aus der ROKI-Evidenz:* Serviceroboter können nicht selbstständig Tische abräumen oder wischen (mobile Manipulatoren mit Greifarmen sind dafür im hektischen Publikumsverkehr noch viel zu fehleranfällig und teuer). Sie fungieren als **fahrende Sammelstationen**, auf denen Gäste oder das Personal Geschirr abstellen.
* **Kassenautomatisierung per KI-Bilderkennung:**  
  Kamerasysteme scannen das gesamte Tablett in unter einer Sekunde und erkennen Speisen zuverlässig. Das entlastet eine volle Fachkraft an der Kasse während der Stoßzeit komplett.
* **Wirtschaftlichkeit & RaaS (Robot-as-a-Service):**  
  *Aus ROKI-Kostenanalysen:* Die Anschaffungskosten für Gastro-Serviceroboter liegen zwischen 12.000 und 25.000 Euro. In der Gastronomie setzen sich zunehmend **Miet- und RaaS-Modelle** (ca. 400–800 Euro/Monat) durch. Dadurch entfällt das Investitionsrisiko bei Saisonschwankungen; Wartung und Software-Updates sind abgedeckt.
* **Voraussetzungen im Betrieb:** Rutschfeste, ebene Böden ohne Stufen/Schwellen, ausreichend breite Hauptgänge (mind. 1,20 m) und Einhaltung der Hygieneanforderungen (HACCP – Gehäuse müssen feucht desinfizierbar sein).

---

## 3. Gesundheit und Pflege: Pflegeheim mit Demenz-Abteilung
**Betriebsprofil:** 100 Beschäftigte. Vollstationäre Einrichtung mit spezialisiertem Wohnbereich für Menschen mit Demenz.

### Typische Probleme im Arbeitsalltag
* **Schwere körperliche Transfers:** Bewohnerinnen und Bewohner müssen mehrfach täglich aus dem Bett in den Rollstuhl mobilisiert, im Bett gelagert oder beim Gehen gestützt werden (Hauptursache für Bandscheibenvorfälle).
* **Hoher Zeitaufwand für interne Transporte:** Pflegekräfte verbringen 20 bis 30 % ihrer Schicht mit reinen Botendiensten: Wäschewagen schieben, Mahlzeitentabletts verteilen, Inkontinenzmaterial auffüllen und Abfall entsorgen.
* **Nachtwachen und Sturzgefahren (speziell Demenz):** Desorientierte Personen stehen nachts auf und stürzen ("Hinlauftendenz"). Regelmäßige Kontrollgänge wecken Bewohner oft unnötig auf; lückenlose Sichtkontrollen sind personell nicht machbar.
* **Hoher Dokumentationsaufwand:** Vorschriftsmäßige Pflegeberichte binden wertvolle Zeit an Computerarbeitsplätzen, die in der direkten Betreuung fehlt.

### Verknüpfung mit den ROKI-Rechercheergebnissen
* **Erkenntnisse aus dem 22-monatigen Praxistest des Assistenzroboters *Lio*:**  
  *Befund der ROKI-Pflegerecherche:* Bewohner:innen reagierten auf Assistenzroboter wie *Lio* mehrheitlich positiv. **Beim Personal sank die Akzeptanz im Testverlauf jedoch deutlich**, weil technische Zuverlässigkeit und Bedienbarkeit die hohen Erwartungen nicht erfüllten. Das System erzeugte zusätzlichen Betreuungsaufwand, sodass **keine wahrnehmbare Netto-Entlastung** gemessen werden konnte.  
  *ROKI-Lehre für KMU:* Komplexe, multifunktionale Assistenzroboter sind für den Pflegealltag derzeit noch zu wartungsintensiv.
* **Körpernahe Robotik – Scheitern im Projekt *HoLLiECares*:**  
  Versuche, Roboter Aufgaben wie das autonome Schieben von Rollstühlen oder die direkte Patientenbegleitung übernehmen zu lassen, scheiterten im Feldtest an mechanischen Hardwareschnittstellen und Sicherheitsrisiken im Realbetrieb.
* **Erkenntnisse zu Pflege-Exoskeletten aus dem INQA-Projekt *EXPERTISE 4.0*:**  
  Pflegekräfte bestätigen eine spürbare Entlastung der Lendenwirbelsäule beim Umlagern im Bett.  
  *Wichtige Einschränkung:* Nutzen, Tragekomfort und Passform sind extrem personenspezifisch. Ein Exoskelett kann in einer 100-MA-Einrichtung nicht einfach „für alle“ im Schrank hängen, sondern muss individuell angepasst und akzeptiert werden.
* **Wo Automatisierung heute tatsächlich wirkt:**  
  1. **Autonome Transportroboter (AMR) in der Hintergrundlogistik:** Transportieren Wäsche- und Essenswagen über Aufzugskopplungen, ohne mit Bewohnern direkt zu interagieren.  
  2. **Diskrete Sensorik statt Kameras:** Deckenmontierte optische Sensoren oder Radarsensoren erkennen Stürze und Bettflucht sofort, ohne Bilder aufzuzeichnen (Schutz von Würde und Intimsphäre).  
  3. **KI-Sprachdiktat:** Entlastet nachweislich von Schreibarbeiten bei der Dokumentation.

---

## 4. Logistik: Spedition & Umschlagslager (Beispiel Hiller Logistik)
**Betriebsprofil:** Mittelständisches Logistikunternehmen mit Lagerhaltung, Umschlag und LKW-Transport.

### Typische Probleme im Arbeitsalltag
* **Lange Laufwege beim Kommissionieren:** Lagermitarbeitende laufen pro Schicht oft 10 bis 18 Kilometer zu Fuß durch Hochregalgänge, um Teilsendungen und Kartons einzusammeln.
* **Körperliche Extrembelastung an der Rampe:** Manuelles Be- und Entladen von LKW oder Containern mit lose geladener Stückgutware ("Floor-Loaded") führt zu hoher Ermüdung und Fehlzeiten.
* **Mangel an Fahrpersonal für Flurförderzeuge:** Zuverlässige Gabelstaplerfahrer für den Mehrschichtbetrieb sind schwer zu rekrutieren.
* **Suchzeiten und Kommissionierfehler:** Falsch abgestellte Paletten oder manuelle Scan-Verzögerungen stören den Takt der Tourenbereitstellung.

### Verknüpfung mit den ROKI-Rechercheergebnissen
* **AMR vs. FTS (Klassifikation nach ISO 8373 / IFR):**  
  *Gemäß ROKI-Recherche* war Transport und Logistik 2024 die mit Abstand größte Anwendungsgruppe professioneller Service-Robotik.  
  *Unterschied für KMU:* Klassische Fahrerlose Transportsysteme (FTS/AGV) benötigen feste Bodenmarkierungen oder Magnetspuren. Für bestehende Logistikhallen mittelständischer Betriebe sind **Autonome Mobile Roboter (AMR)** deutlich besser geeignet, da sie dank SLAM-Navigation und Laserscannern dynamisch um Hindernisse herumfahren, ohne dass der Boden umgebaut werden muss.
* **Die Kosten- und Integrationsfalle (IFR-Befund):**  
  *Aus ROKI-Recherche Robotertypen:* Der reine Anschaffungspreis eines mobilen Transportroboters (ca. 25.000 bis 60.000 Euro) ist **nur ein Teil der Gesamtkosten**. 
  Integration, Anbindung an das Lagerverwaltungssystem (LVS/WMS), Erstellung der digitalen Sicherheitskarte und Anpassung von Schutzzonen machen häufig **bis zu 40–50 % der Gesamtinvestition** aus.
* **Praxisbewährte Einstiegslösungen:**  
  * **Kollaborative Follow-Me-Wagen:** Der Roboter folgt dem Picker autonom. Der Mensch kommissioniert mit beiden Händen frei; die körperliche Belastung durch das Ziehen schwerer Rollwagen entfällt.
  * **Automatische Palettenwickler am Bandende:** Standardtechnik mit extrem schnellem ROI (unter 12 Monaten).
  * **Industrie-Exoskelette an der Rampe:** Mechanische Unterstützung beim Heben schwerer Einzelkartons im Container.

---

## 5. Facility Management: Hausmeisterservice
**Betriebsprofil:** 8 Beschäftigte. Betreuung zahlreicher dezentraler Liegenschaften (Schulen, Gewerbeimmobilien, Wohnanlagen); Teams sind mobil und verteilt im Einsatz.

### Typische Probleme im Arbeitsalltag
* **Saisonale Überlastungsspitzen und Witterungsdruck:**
  * *Winterdienst:* Schneeräumung und Streupflicht ab 4:00 Uhr morgens auf 15 getrennten Objekten gleichzeitig – mit 8 Mitarbeitern kaum fristgerecht zu bewältigen.
  * *Grünpflege im Sommer:* Tagelanges Mähen großer Rasenflächen bei sommerlicher Hitze.
* **Hohe Rüst- und Fahrzeiten:** 30 bis 50 % der Arbeitszeit wird im Fahrzeug beim Pendeln zwischen Objekten verbracht.
* **Wiederholtes Verladen schwerer Maschinen:** Schwere Benzin-Rasenmäher, Balkenmäher, Laubbläser und Streusalzsäcke müssen mehrmals täglich auf Pritschenwagen gehoben und gesichert werden.
* **Unwirtschaftliche Kontrollfahrten:** Anfahrt zum Objekt, nur um festzustellen, dass Müllcontainer noch nicht voll oder Gehwege noch sauber sind.

### Verknüpfung mit den ROKI-Rechercheergebnissen
* **Das Dezentralitäts-Dilemma kleiner Betriebe:**  
  *Erkenntnis aus den ROKI-Kosten- und Einsatzanalysen:* Mobile Robotik rechnet sich für einen 8-Personen-Dienstleister **nicht**, wenn der Roboter täglich auf den Pritschenwagen gehoben, zum Kunden gefahren, abgeladen, überwacht und wieder eingepackt werden muss. Die Rüstzeiten fressen den Produktivitätsgewinn vollständig auf.
* **Lösung: Stationierung auf Kundenliegenschaften (RTK-GPS-Mähroboter):**  
  Großflächenmähroboter arbeiten heute dank RTK-Satellitennavigation ohne Begrenzungskabel und verbleiben ganzjährig fest auf dem betreuten Gewerbeobjekt oder Schulhof. Das FM-Unternehmen verkauft dem Kunden das „gepflegte Grün als Dienstleistung“ und muss nur noch sporadisch Kanten schneiden.
* **Professionelle Reinigungsrobotik (IFR-Kategorie Service):**  
  Autonome Scheuersaugroboter sind technologisch hochgradig ausgereift (Reinigungsroboter bilden die zweitgrößte Gruppe professioneller Serviceroboter weltweit). Bei betreuten Großobjekten (z. B. Bürokomplexe, Turnhallen) reinigen sie nachts selbstständig Flure und Hallen.
* **IoT-Sensorik schlägt Roboter:**  
  Für viele Probleme eines mobilen Hausmeisterservices ist kein teurer Roboter nötig, sondern smarte Sensorik: Füllstandssensoren in Großcontainern, Laub- und Feuchtigkeitssensoren in Dachrinnen sowie Bodentemperaturmelder für Glatteis verhindern unnötige Anfahrten.

---

## Zusammenfassung: Die ROKI-Entscheidungsmatrix für KMU

| Kriterium | Eignung für vollautonome Robotik | Besserer Alternativansatz für KMU |
|:---|:---|:---|
| **Umgebung** | **Geschlossen, strukturiert, eben** (Lager, Kantinensaal, Krankenhausflur) | **Unstrukturiert, wechselnd** (Baustelle, Garten) → *Exoskelette, motorisierte Handgeräte* |
| **Aufgabenart** | **Hochgradig repetitiv, feste Routen** (Palettentransport, Bodenreinigung, Kassenbild) | **Individuelle Einzelmontage, Pflege am Menschen** → *Cobots für Werkstatt, Sensorik für Sicherheit* |
| **Betriebsort** | **Stationär am Standort** (Gerät verbleibt vor Ort) | **Verteilt / Dezentral** (Dienstleister fährt viele Orte an) → *IoT-Fernüberwachung statt mobiler Roboter* |
| **Interaktion** | **Hintergrundlogistik & Assistenz** | **Direkte menschliche Nähe** → *Hohe Akzeptanzhürden; Überfrachtung mit Erwartungen vermeiden* |

---

*Erstellt auf Basis der geprüften ROKI-Recherchen zu Robotertypen (ISO 8373), Pflegerobotik (Lio, HoLLiECares, EXPERTISE 4.0), Roboterhunden und DGUV-Arbeitsschutzrichtlinien.*
