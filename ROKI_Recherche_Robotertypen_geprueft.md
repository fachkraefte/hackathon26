# Recherche: Robotertypen als Grundlage für ROKI-Basisartikel

**Stand:** 13.08.2026  
**Geografischer Schwerpunkt:** Deutschland/Europa, ergänzt um internationale Markt- und Normungsquellen  
**Zweck:** Recherchevorarbeit für mehrere Grundlagenartikel; kein fertiger Artikel und kein abschließender Faktencheck.

## 1. Fragestellung

Welche Robotertypen sind für eine Grundlagenserie sinnvoll zu unterscheiden, was sind typische Anwendungen, welche technischen und organisatorischen Voraussetzungen bestehen, wie hoch sind Implementierungsaufwand und Kosten tendenziell und wie eignen sich die Typen für kleine und mittlere Unternehmen (KMU)?

Besonders berücksichtigt werden Gesundheit und Pflege, Gastronomie, Logistik, Handwerk und Facility Management. Die Recherche ist nicht auf diese Branchen beschränkt.

### Abgrenzung

Eine einzige, überschneidungsfreie Liste von Robotertypen existiert nicht. Robotik wird gleichzeitig nach Einsatzkontext, mechanischer Bauform, Mobilität, Grad der Zusammenarbeit mit Menschen und Anwendung klassifiziert. Für eine Artikelserie ist deshalb eine mehrdimensionale Typologie sinnvoll:

1. **Grundkategorien nach ISO/IFR:** Industrie-, Service- und Medizinroboter.
2. **Bauform/Mechanik:** z. B. Gelenkarm, SCARA, Delta, kartesisch/Portal.
3. **Mobilität:** stationär, FTS/AGV, AMR, mobile Manipulatoren, Luft-/Feldroboter.
4. **Interaktion:** klassisch getrennte Arbeitsräume, kollaborative Anwendungen/Cobots.
5. **Anwendung:** Reinigung, Transport, Hospitality, Pflegeassistenz, Rehabilitation, Inspektion usw.

Nicht als physische Roboter im engeren Sinne behandelt werden reine Software-"Bots" bzw. Robotic Process Automation (RPA).

Passive Exoskelette werden in dieser Recherche als **angrenzende physische Assistenztechnologie** betrachtet; sie sind nicht ohne Weiteres mit Robotern gleichzusetzen.

## 2. Kurzfazit

- ISO 8373:2021 definiert Roboter allgemein über einen programmierten, angetriebenen Mechanismus mit einem Grad an Autonomie. Die IFR unterscheidet für Marktstatistiken Industrie-, Service- und seit World Robotics 2024 separat Medizinroboter.
- Für eine ROKI-Grundlagenserie sollte nicht jeder mechanische Untertyp einen eigenen Artikel erhalten. Sinnvoller ist ein **Kernset aus 10–13 Artikeln**, das Nutzerfragen nach Einsatz, Aufwand und Eignung abbildet.
- Besonders praxisreif und branchenübergreifend sind heute klassische Industrieroboter, Cobots, FTS/AGV, AMR sowie professionelle Reinigungs- und Transportroboter. Mobile Manipulatoren sind technisch anspruchsvoller; Humanoide befinden sich trotz wachsender Pilotierung noch in einer frühen Nachweisphase.
- Für KMU sind geringe Integrationskomplexität, standardisierte Aufgaben, flexible Umrüstung, verfügbare Integratoren und kalkulierbare Betriebsmodelle entscheidend. Der reine Hardwarepreis ist häufig nur ein Teil der Gesamtkosten.
- IFR weist darauf hin, dass Programmierung und Integration bei Roboteranwendungen einen erheblichen Kostenanteil ausmachen können. RaaS-/Mietmodelle können hohe Anfangsinvestitionen vermeiden, ersetzen aber nicht die Prüfung von Prozess-, Sicherheits- und Integrationsaufwand.
- Die stärkste ROKI-Relevanz besteht dort, wo Roboter klar abgegrenzte, repetitive, körperlich belastende oder zeitintensive Aufgaben übernehmen bzw. Beschäftigte unterstützen. Die Evidenz trägt nicht die pauschale Aussage, ganze Berufsrollen würden ersetzt.
- Für Gesundheit/Pflege und Facility Management sind mobile Service- und Reinigungsroboter derzeit häufig näher am breiten Praxiseinsatz als komplexe humanoide oder universelle Assistenzroboter.

## 3. Rechercheergebnisse

### 3.1 Übergreifende Klassifikation

**Befund:**  
Die IFR übernimmt für zentrale Begriffe die ISO-8373-Systematik. Industrie­roboter sind automatisch gesteuerte, reprogrammierbare Mehrzweck-Manipulatoren mit mindestens drei Achsen für industrielle Automatisierungsanwendungen. Service­roboter erfüllen nützliche Aufgaben für Menschen oder Geräte außerhalb der klassischen industriellen Automatisierung. Medizinroboter werden in der aktuellen ISO-Systematik als eigene Kategorie geführt.

**Evidenz:**  
IFR/ISO definieren außerdem mobile Roboter als Systeme, die sich unter eigener Kontrolle fortbewegen können. Die IFR weist selbst darauf hin, dass Grenzziehungen zwischen Kategorien in der Praxis teilweise interpretationsbedürftig sind.

**Einordnung:**  
Für redaktionelle Grundlagenartikel sollte klar kommuniziert werden, dass Begriffe wie "Cobot", "AMR" oder "Reinigungsroboter" unterschiedliche Klassifikationsebenen bezeichnen: Cobot = Interaktions-/Sicherheitskonzept, AMR = Mobilitätskonzept, Reinigungsroboter = Anwendung.

**Quellen/Fundstellen:**  
- Q01: International Federation of Robotics (IFR), "Industrial Robots", Abschnitt Definition/Classification.
- Q02: IFR, "Service Robots", Definition.
- Q03: IFR, "Standardisation", Robot definitions at ISO.
- Q04: ISO 8373:2021, "Robotics — Vocabulary", Standardübersicht.

**Unsicherheit/Einschränkung:**  
ISO 8373 wird derzeit überarbeitet; ISO/DIS 8373 befindet sich 2026 noch in Entwicklung. Begriffe können sich in einer künftigen Ausgabe ändern.

---

### 3.2 Klassische Industrieroboter

**Befund:**  
Die IFR unterscheidet bei Industrierobotern nach mechanischer Struktur insbesondere:
- kartesische/Portalroboter,
- SCARA-Roboter,
- Gelenkarmroboter,
- Parallel-/Delta-Roboter,
- zylindrische und polare Roboter.

**Typische Anwendungen:**  
Schweißen, Schneiden, Maschinenbeschickung, Pick-and-Place, Montage, Palettieren, Verpacken, Lackieren, Handling. Die konkrete Eignung hängt stark von Nutzlast, Reichweite, Geschwindigkeit, Genauigkeit und Arbeitsraum ab.

**Aufwand/Voraussetzungen:**  
- geeignete Roboterzelle bzw. sichere Arbeitsumgebung,
- Endeffektor/Greifer/Werkzeug,
- Zuführung und Werkstückbereitstellung,
- Programmierung,
- Schnittstellen zur Maschine/Anlage,
- Risikobeurteilung und Sicherheitskonzept,
- Wartung und Qualifikation des Personals.

**Kosten:**  
Keine belastbare allgemeine Komplettpreis-Spanne aus neutralen Primärquellen gefunden. Die IFR betont, dass Programmierung und Integration erhebliche Kostenanteile ausmachen können. Herstellerpreise einzelner Low-Cost-Systeme beginnen deutlich unter typischen integrierten Industrieanlagen, sind aber nicht repräsentativ für Gesamtsystemkosten.

**KMU-Eignung:**  
Gut, wenn Prozesse wiederholbar und wirtschaftlich ausreichend ausgelastet sind. Standardisierte Zellen und flexiblere Programmierung senken Einstiegshürden. Für sehr kleine Losgrößen kann Umrüst- und Programmieraufwand die Wirtschaftlichkeit begrenzen.

**Branchenbezug:**  
Industrie, Metall-/Holzhandwerk, Lebensmittelverarbeitung, Verpackung, Bauvorfertigung, Laborautomation.

**Quellen/Fundstellen:**  
- Q01, IFR "Industrial Robots", Zeilen/Abschnitte zu mechanical structure und applications.
- Q05: Mittelstand-Digital, "Leichtbauroboter in der Produktion – Ein Praxisleitfaden".

**Unsicherheit/Einschränkung:**  
"Industrieroboter" ist eine sehr breite Kategorie. Für einen Basisartikel sollten Bauformen als Untertypen erklärt werden, aber nicht zwingend jeweils als eigener Artikel.

---

### 3.3 Cobots / kollaborative Roboter

**Befund:**  
Cobots sind für kollaborative Anwendungen ausgelegte Roboter. "Kollaborativ" bedeutet nicht automatisch, dass jede Anwendung ohne trennende Schutzeinrichtung zulässig ist. Entscheidend ist die konkrete Anwendung einschließlich Werkzeug, Werkstück, Geschwindigkeit, Kräfte und Arbeitsraum.

**Typische Anwendungen:**  
Maschinenbeschickung, Montage, Schrauben, Kleben, Schweißen, Schleifen, Qualitätsprüfung, Verpackung, Pick-and-Place, Labor-/Serviceanwendungen.

**Aufwand/Voraussetzungen:**  
- genaue Aufgaben- und Taktzeitanalyse,
- Endeffektor und Werkstückzuführung,
- sichere Steuerung und Sensorik,
- Risikobeurteilung des Gesamtsystems,
- ggf. Messung von Kollisionskräften und -drücken,
- Schulung und betriebliches Know-how.

**Kosten:**  
Herstellerbeispiele zeigen eine sehr große Spannweite. igus bietet 2026 einen ReBeL-Cobot ab rund 4.970 EUR Hardwarepreis an und nennt marktübliche Preise von 25.000–40.000 EUR für andere Cobots; diese Angaben sind Herstellerangaben und keine unabhängige Marktstatistik. Sie schließen Integration, Greifer, Vision, Sicherheitstechnik und Engineering nicht zwingend ein. IFR verweist generell darauf, dass Programmierung/Integration einen großen Teil der Anwendungskosten ausmachen können.

**KMU-Eignung:**  
Tendenziell hoch bei standardisierten, variantenreichen oder teilautomatisierten Aufgaben, weil Cobots oft kompakter und leichter umzurüsten sind. Die tatsächliche Wirtschaftlichkeit hängt jedoch stärker von Gesamtprozess und Integration als vom Arm allein ab.

**Branchenbezug:**  
Handwerk (z. B. Schweißen, Maschinenbeschickung), verarbeitendes Gewerbe, Lebensmittel, Labore, kleine Serienproduktion.

**Quellen/Fundstellen:**  
- Q06: DGUV/IFA, "Kollaborierende Roboter (COBOTS)".
- Q07: DGUV/IFA, "Technische Schutzmaßnahmen".
- Q01: IFR "Industrial Robots", Abschnitt Collaborative Robots.
- Q18: igus, ReBeL Produkt-/Preisangaben (Herstellerquelle).

**Unsicherheit/Einschränkung:**  
Marketingbegriffe wie "Plug and Play" dürfen nicht mit einer vollständig risikobeurteilten, produktionsreifen Anwendung gleichgesetzt werden.

---

### 3.4 FTS/AGV – fahrerlose Transportsysteme / Automated Guided Vehicles

**Befund:**  
AGV/FTS folgen typischerweise festgelegten oder infrastrukturgestützten Routen. Sie sind in der Intralogistik etabliert und werden für wiederkehrende Transporte eingesetzt.

**Typische Anwendungen:**  
Materialversorgung, Paletten-/Behältertransport, Routenzüge, Krankenhauslogistik, Wäsche-/Essens-/Materialtransport.

**Aufwand/Voraussetzungen:**  
- definierte Verkehrswege,
- Übergabestationen,
- ausreichende Bodenqualität und Platz,
- Sicherheitskonzept für Mischverkehr,
- Ladeinfrastruktur,
- ggf. Leitsteuerung und WMS/MES-Schnittstellen.

**Kosten:**  
Stark abhängig von Fahrzeug, Aufbau, Flotte und Infrastruktur. Reine Fahrzeugpreise sind kein ausreichender TCO-Maßstab. Bei festen, wiederkehrenden Routen kann Infrastrukturaufwand planbarer sein als bei hochflexiblen Systemen.

**KMU-Eignung:**  
Gut bei stabilen Materialflüssen und häufigen, wiederkehrenden Transporten. Für einzelne, seltene Transporte kann die Investition unattraktiv sein.

**Branchenbezug:**  
Logistik, Produktion, Kliniken, Pflegeeinrichtungen, Großküchen, Wäschereien.

**Quellen/Fundstellen:**  
- Q03: IFR "Standardisation", Definition mobile robot/AGV.
- Q15: Fraunhofer IPA "Navigation".
- Q09: Fraunhofer IML "5G-RemRob" als Krankenhauslogistik-Beispiel.

**Unsicherheit/Einschränkung:**  
Die Abgrenzung zu AMR wird am Markt nicht immer einheitlich verwendet.

---

### 3.5 AMR – autonome mobile Roboter

**Befund:**  
AMR navigieren flexibler auf Basis von Sensorik und Umgebungsmodellen und können Hindernisse bzw. dynamische Umgebungen berücksichtigen. Die IFR zählt AMR zu professionellen Servicerobotern; Transport und Logistik war 2024 die größte professionelle Service-Robotik-Anwendungsgruppe in der IFR-Stichprobe.

**Typische Anwendungen:**  
Behälter-/Materialtransport, Kommissionierunterstützung, Versorgung von Stationen/Produktionszellen, innerbetriebliche Kurierfahrten, Hotel-/Gastronomie-Service, Kliniklogistik.

**Aufwand/Voraussetzungen:**  
- Kartierung und Inbetriebnahme,
- sichere Navigation in Mischverkehr,
- WLAN/Netzwerk je nach System,
- Ladepunkte,
- Prozess- und Übergabestationen,
- Schnittstellen zu WMS, ERP, Aufzügen oder Türen bei komplexeren Szenarien.

**Kosten:**  
Herstellerbeispiel: igus nannte 2024 für ReBeL Move rund 29.838 EUR und 2025 für ReBeLMove Pro Preise ab 39.800 EUR. Dies sind Herstellerpreise, keine repräsentativen Marktwerte. Integration, Flottensteuerung, Aufbauten, IT-Schnittstellen und Infrastruktur können wesentliche Zusatzkosten verursachen.

**KMU-Eignung:**  
Hoch bis mittel. Besonders attraktiv bei klaren Transportaufgaben und wenn eine Einzelfahrzeug-Lösung ohne tiefgreifende IT-Integration genügt. Flotten- und WMS-Integration erhöht Aufwand deutlich.

**Branchenbezug:**  
Logistik, Produktion, Gesundheit/Pflege, Facility Management, Hotellerie/Gastronomie, Handel.

**Quellen/Fundstellen:**  
- Q10: IFR World Robotics 2025 Service Robots / HTML-Zusammenfassung.
- Q15: Fraunhofer IPA "Navigation".
- Q19/Q20: igus ReBeL Move/ReBeLMove Pro (Herstellerangaben).
- Q09: Fraunhofer IML 5G-RemRob.

**Unsicherheit/Einschränkung:**  
IFR-Service-Robotikzahlen basieren auf einer Herstellerstichprobe und werden nicht auf den Gesamtmarkt hochgerechnet.

---

### 3.6 Mobile Manipulatoren

**Befund:**  
Mobile Manipulatoren kombinieren eine mobile Plattform mit einem Roboterarm. Dadurch können sie nicht nur transportieren, sondern aktiv greifen, bedienen oder reinigen.

**Typische Anwendungen:**  
Maschinenbedienung an wechselnden Stationen, Kommissionierung, mobile Inspektion, Labor-/Krankenhausassistenz, 3D-Reinigung von Oberflächen, Tür-/Schubladenbedienung.

**Aufwand/Voraussetzungen:**  
Deutlich höher als bei reinem AMR:
- Navigation plus Manipulation,
- präzise Lokalisierung,
- 3D-Umgebungserkennung,
- geeignete Greifer,
- sichere Interaktion mit Menschen,
- robuste Prozess- und Fehlerbehandlung.

**Kosten:**  
Keine belastbare allgemeine Preisspanne aus neutralen Quellen. Systemkosten liegen konzeptionell über einfachen AMR oder stationären Armen, weil zwei Robotiksysteme und zusätzliche Sensorik/Software integriert werden.

**KMU-Eignung:**  
Mittel. Interessant, wenn ein System mehrere Stationen bedienen kann und dadurch Auslastung gewinnt. Für einfache Einzelaufgaben ist ein stationärer Cobot oder AMR meist weniger komplex.

**Branchenbezug:**  
Logistik, Produktion, Facility Management, Gesundheit/Pflege, Labore.

**Quellen/Fundstellen:**  
- Q16: Fraunhofer IPA "Serviceroboter-Technologien".
- Q17: Fraunhofer IPA "3D-Bildverarbeitung".
- Q11: Fraunhofer IPA "Roboterbasierte Reinigung und Desinfektion von Oberflächen im Gesundheitswesen".
- Q21: IFR 2026 Datenerhebung mit eigener Kategorie "Mobile Manipulators".

**Unsicherheit/Einschränkung:**  
Noch heterogene Produktlandschaft; nicht jeder mobile Manipulator ist als standardisiertes Serienprodukt für jede Branche verfügbar.

---

### 3.7 Professionelle Reinigungsroboter

**Befund:**  
Professionelle Reinigungsroboter sind eine eigenständige, wachsende Service-Robotik-Anwendung. Die IFR meldete für ihre Herstellerstichprobe 2024 mehr als 25.000 verkaufte Einheiten; Hauptanwendung ist Bodenreinigung.

**Typische Anwendungen:**  
Scheuersaugen großer Flächen, Bodenreinigung in Einkaufszentren, Kliniken, Hotels, Flughäfen, Lagerhallen; Forschung erweitert das Spektrum auf Oberflächen oberhalb des Bodens.

**Aufwand/Voraussetzungen:**  
- ausreichend freie/standardisierte Flächen,
- geeignete Boden- und Türsituationen,
- Reinigungs- und Lade-/Servicepunkte,
- Umgang mit Publikumsverkehr,
- Einbindung in Reinigungspläne,
- manuelle Ergänzung für schwer zugängliche Bereiche.

**Kosten:**  
Stark produktabhängig; Kauf und RaaS/Miete sind verbreitete Modelle. Für die Grundlagenserie sollte zwischen Anschaffung und laufenden Service-/Verbrauchskosten unterschieden werden.

**KMU-Eignung:**  
Gut bei größeren, regelmäßig zu reinigenden Flächen und Personalknappheit. Weniger attraktiv bei kleinen, stark verwinkelten oder häufig umgestellten Flächen.

**Branchenbezug:**  
Facility Management, Gesundheit, Hotellerie/Gastronomie, Handel, Logistik, Industrie.

**Quellen/Fundstellen:**  
- Q10: IFR World Robotics 2025.
- Q11: Fraunhofer IPA DeKonBot 2.
- Q08: BAuA "Physische Arbeitsassistenztechnologien" (Reinigung als Beispiel physischer Arbeitsunterstützung).

**Unsicherheit/Einschränkung:**  
Marktstatistiken geben keine Aussage über Reinigungsqualität, Wirtschaftlichkeit oder tatsächliche Personalentlastung in jedem Einsatzfall.

---

### 3.8 Transport-/Delivery-/Hospitality-Roboter

**Befund:**  
Hospitality war 2024 in der IFR-Stichprobe die zweitgrößte professionelle Service-Robotik-Anwendungsgruppe. Hierzu zählen u. a. mobile Informations-/Guidance-Systeme, Telepräsenz sowie neue Anwendungen in Food & Beverage.

**Typische Anwendungen:**  
Speisen- und Getränketransport, Abräumen, Zimmer-/Stationslieferung, Orientierung/Guidance, Telepräsenz, einfache Front-Desk-Dienste.

**Aufwand/Voraussetzungen:**  
- ausreichend breite und ebene Wege,
- verlässliche Navigation,
- ggf. Aufzug-/Türintegration,
- klar definierte Übergabe an Personal/Gäste,
- Hygiene- und Reinigungsprozesse,
- Akzeptanz und Prozessgestaltung.

**Kosten:**  
Häufig Kauf, Leasing oder RaaS. Belastbare herstellerunabhängige Durchschnittspreise wurden in dieser Recherche nicht gefunden; sie sollten pro Marktsegment separat erhoben werden.

**KMU-Eignung:**  
Mittel bis gut bei häufigen Laufwegen und standardisierten Abläufen. In kleinen Restaurants mit kurzen Wegen oder sehr individuellem Service kann der Nutzen begrenzt sein.

**Branchenbezug:**  
Gastronomie, Hotellerie, Gesundheit/Pflege, Handel, Büro-/Facility-Services.

**Quellen/Fundstellen:**  
- Q10: IFR World Robotics 2025.
- Q12: Fraunhofer IPA Transportroboter für das Gesundheitswesen.
- Q13: Fraunhofer IPA Pflegeunterstützung/Transport.

**Unsicherheit/Einschränkung:**  
IFR-Stückzahlen belegen Marktaktivität, nicht automatisch Wirtschaftlichkeit oder Servicequalität. Gerade in Gastronomie/Hotellerie ist die Nutzenlage stark prozessabhängig.

---

### 3.9 Pflege- und Assistenzroboter / soziale Roboter

**Befund:**  
In Pflege und Assistenz werden sehr unterschiedliche Systeme erprobt: Transportroboter, intelligente Pflegewagen, Roboter zur Aktivierung/sozialen Interaktion, Hol- und Bringdienste und körpernahe Assistenz. Ein Teil befindet sich weiterhin in Forschung oder begrenzter Praxis.

**Typische Anwendungen:**  
Materialtransport, Getränke-/Versorgungsdienste, Aktivierung, Telepräsenz, Nachtunterstützung, Hol-/Bringdienste, Assistenz bei Mobilität.

**Aufwand/Voraussetzungen:**  
- enge Einbindung in Pflegeprozesse,
- hohe Anforderungen an Sicherheit und Zuverlässigkeit,
- Datenschutz/Privatsphäre bei Sensorik,
- Schulung und Akzeptanz,
- bei medizinischer Zweckbestimmung zusätzliche regulatorische Anforderungen.

**Kosten:**  
Sehr heterogen; von mobilen Plattformen bis zu komplexen Spezialgeräten. Für viele Forschungsprototypen existiert kein belastbarer Marktpreis. Wirtschaftlichkeitsanalysen müssen auf konkrete Aufgabe und Auslastung bezogen werden.

**KMU-Eignung:**  
Für Pflegeeinrichtungen eher bei standardisierten Transport-/Logistikaufgaben als bei universellen Assistenzrobotern. Implementierungsaufwand hängt stark von Gebäudeinfrastruktur und Prozessintegration ab.

**Branchenbezug:**  
Stationäre Pflege, Krankenhäuser, ambulante/häusliche Assistenz.

**Quellen/Fundstellen:**  
- Q13: Fraunhofer IPA "Roboter zur Pflegeunterstützung im Altenheim und Krankenhaus".
- Q14: Fraunhofer IPA "SeRoDi".
- Q22: Fraunhofer IPA SRS/teilautonome häusliche Unterstützung.
- Q02: IFR Service Robots – Care at home / social interaction.

**Unsicherheit/Einschränkung:**  
Viele Beispiele sind Forschungs- oder Pilotprojekte. Eine Übertragung auf flächendeckende Produktreife wäre unzulässig.

---

### 3.10 Medizinroboter

**Befund:**  
ISO/IFR führen Medizinroboter als eigene Kategorie. IFR unterscheidet u. a. OP-Robotik, Rehabilitation/nicht-invasive Therapie sowie Diagnostik/Laboranalyse.

**Typische Anwendungen:**  
robotisch assistierte Chirurgie, Rehabilitation, diagnostische bzw. Laborautomation, therapeutische Assistenz.

**Aufwand/Voraussetzungen:**  
- sehr hohe regulatorische Anforderungen,
- klinische Einbindung und Qualifikation,
- Wartungs-/Servicekonzepte,
- Hygiene,
- IT- und Datenintegration,
- bei Medizinprodukten formale Zulassungs-/Konformitätsanforderungen.

**Kosten:**  
Tendenziell hoch bis sehr hoch bei komplexen chirurgischen Systemen; Rehabilitations- und Laborrobotik ist heterogener. Keine belastbare allgemeine Preisbandbreite sinnvoll.

**KMU-Eignung:**  
Für KMU als Betreiber nur in spezialisierten Gesundheits-/Reha-Kontexten. Für allgemeine KMU wenig relevant; für medizintechnische KMU als Anbieter/Integrator hingegen relevant.

**Branchenbezug:**  
Krankenhäuser, Reha, Diagnostik, Labor, Medizintechnik.

**Quellen/Fundstellen:**  
- Q10: IFR World Robotics 2025, medical robots.
- Q02: IFR Service Robots/Definition medical robots.

**Unsicherheit/Einschränkung:**  
Marktwachstum ist kein Wirksamkeitsnachweis. Für konkrete medizinische Nutzenbehauptungen sind klinische Studien erforderlich.

---

### 3.11 Inspektions-, Wartungs- und Sicherheitsroboter inkl. Drohnen

**Befund:**  
Service-Robotik umfasst Inspektion/Wartung sowie Such-, Rettungs- und Sicherheitsanwendungen. Mobile Bodenroboter, Drohnen und Spezialplattformen können schwer zugängliche oder gefährliche Bereiche untersuchen.

**Typische Anwendungen:**  
Gebäude-/Dachinspektion, Anlagenprüfung, Kanal-/Rohrinspektion, Thermografie, Inventur, Sicherheitsrundgänge, Infrastrukturprüfung.

**Aufwand/Voraussetzungen:**  
- geeignete Sensorik,
- Datenübertragung und Auswertung,
- sichere Navigation bzw. Flugplanung,
- bei Drohnen luftrechtliche Anforderungen,
- Integration in Wartungs-/FM-Prozesse.

**Kosten:**  
Sehr breite Spanne; einfache Inspektionsdrohnen sind deutlich günstiger als spezialisierte Industrieplattformen. Wichtiger als der Plattformpreis sind häufig Sensorik, Datenauswertung, Genehmigungen und Prozessintegration.

**KMU-Eignung:**  
Gut für klar definierte Inspektionsaufgaben, insbesondere wenn gefährliche oder zeitaufwändige Begehungen reduziert werden können. Dienstleistungsmodelle können Investitionshürden senken.

**Branchenbezug:**  
Facility Management, Bau, Energie, Industrie, Handwerk, Logistik, Landwirtschaft.

**Quellen/Fundstellen:**  
- Q10: IFR World Robotics 2025, inspection/maintenance und search & rescue/security.
- Q08: BAuA ordnet Drohnen und unbemannte Landfahrzeuge physischen Assistenzsystemen zu.

**Unsicherheit/Einschränkung:**  
"Drohne" ist nicht in jedem Kontext synonym mit "Roboter"; für einen Basisartikel sollte die Autonomie-/Robotikabgrenzung erklärt werden.

---

### 3.12 Agrar-, Bau- und Feldroboter

**Befund:**  
Die IFR führt Landwirtschaft sowie Bau/Abriss als professionelle Service-Robotik-Anwendungsgruppen. Dazu gehören beispielsweise Melk-/Feldsysteme, autonome Trägerplattformen, Ernte-/Pflegeanwendungen sowie spezialisierte Bauroboter.

**Typische Anwendungen:**  
Säen, Jäten, Ernten, Melken, autonome Feldarbeit; Mauer-/Druck-/Bohr-/Vermessungsaufgaben, Baustellenlogistik.

**Aufwand/Voraussetzungen:**  
- robuste Outdoor-Sensorik,
- wechselnde Umgebung und Wetterbedingungen,
- Sicherheitskonzept,
- ggf. GNSS/RTK,
- hoher Anpassungsbedarf an konkrete Aufgabe.

**Kosten:**  
Stark anwendungsabhängig; Spezialmaschinen können hohe Investitionen erfordern. Bei saisonaler Nutzung sind Auslastung, Sharing-/Dienstleistungsmodelle und Wartung entscheidend.

**KMU-Eignung:**  
Mittel; interessant bei klarer Spezialisierung und hoher Arbeitsbelastung, aber Investition und Saisonalität sind Hürden.

**Branchenbezug:**  
Landwirtschaft, Garten-/Landschaftsbau, Bauhandwerk, Tiefbau.

**Quellen/Fundstellen:**  
- Q10: IFR World Robotics 2025.
- Q23: IFR World Robotics 2025 Contents / application scheme.

**Unsicherheit/Einschränkung:**  
Sehr heterogene Kategorie; einzelne Anwendungen unterscheiden sich stark im Reifegrad.

---

### 3.13 Exoskelette als angrenzende Assistenztechnologie

**Befund:**  
Exoskelette können körperliche Arbeit unterstützen. BAuA untersucht passive Exoskelette insbesondere hinsichtlich Ergonomie, Passform und Langzeiteinsatz. Passive Exoskelette sind nicht automatisch Roboter, aktive Systeme können robotische Komponenten enthalten.

**Typische Anwendungen:**  
Überkopfarbeiten, Heben/Tragen, Montage, Logistik, Pflege, Bau-/Handwerksarbeiten.

**Aufwand/Voraussetzungen:**  
- individuelle Passform,
- Auswahl nach konkreter Tätigkeit,
- Ergonomie- und Gefährdungsbeurteilung,
- Akzeptanz/Tragekomfort,
- Schulung,
- Prüfung möglicher Belastungsverlagerungen.

**Kosten:**  
Stark abhängig von passiv/aktiv und Hersteller. Passive Systeme liegen typischerweise weit unter komplexer Robotik, aktive Systeme höher; in dieser Recherche wurde keine belastbare neutrale Preisstatistik gefunden.

**KMU-Eignung:**  
Potentiell hoch als niedrigschwellige Assistenz, wenn vollständige Automatisierung nicht sinnvoll ist. Der Nutzen muss tätigkeitsspezifisch geprüft werden.

**Branchenbezug:**  
Handwerk, Bau, Logistik, Pflege, Produktion, Facility Management.

**Quellen/Fundstellen:**  
- Q24: BAuA "Ergonomische Bewertung des Langzeiteinsatzes von passiven Exoskeletten in der Arbeitswelt".
- Q08: BAuA "Physische Arbeitsassistenztechnologien".
- Q25: Mittelstand-Digital "Robotik im Handwerk – Arbeitsunterstützung mittels Exoskelette".

**Unsicherheit/Einschränkung:**  
Nicht als Robotertyp im engeren ISO-Sinn darstellen; besser als angrenzender Basisartikel "Exoskelette und körpergetragene Assistenzsysteme".

---

### 3.14 Humanoide Roboter

**Befund:**  
Humanoide Roboter werden 2026 verstärkt in realen Pilotumgebungen erprobt, insbesondere Produktion und Lager. Die IFR betont aber selbst, dass Zuverlässigkeit, Effizienz, Taktzeit, Energieverbrauch, Wartung, Sicherheit und menschennahes Geschick noch nachgewiesen werden müssen.

**Typische Anwendungen:**  
Zukünftig vor allem flexible Materialhandhabung, Maschinenbedienung und Logistik in für Menschen gestalteten Umgebungen.

**Aufwand/Voraussetzungen:**  
- hochkomplexe Wahrnehmung, Balance und Manipulation,
- sichere Mensch-Roboter-Interaktion,
- hohe Anforderungen an Wartung und Software,
- noch wenig standardisierte Integration.

**Kosten:**  
Keine belastbare, allgemein verfügbare TCO-Basis für produktive KMU-Einsätze. Herstellerankündigungen und Pilotpreise sind nicht als Marktstandard zu behandeln.

**KMU-Eignung:**  
Derzeit eher gering für breite produktive Nutzung; eher Beobachtungs-/Pilottechnologie. Für Basisartikel sinnvoll als "emerging technology", nicht als gleichrangig praxisreif zu AMR oder Cobots.

**Branchenbezug:**  
Produktion, Lager/Logistik, perspektivisch Service.

**Quellen/Fundstellen:**  
- Q26: IFR "Top 5 Global Robotics Trends 2026", Abschnitt Humanoids.

**Unsicherheit/Einschränkung:**  
Hohe Aktualitäts- und Marketingdynamik; Aussagen zu Leistungsfähigkeit und Kosten müssen eng datiert und herstellerunabhängig überprüft werden.

## 4. Bezug zu Fachkräftesicherung, Sektor und Technologie

### Fachkräftesicherung

Belastbar ist vor allem ein **Aufgabenbezug**:
- Robotik kann repetitive, körperlich belastende, gefährliche oder laufwegintensive Tätigkeiten übernehmen bzw. reduzieren.
- In Pflege, Logistik, Reinigung und Produktion werden Roboter explizit mit Personalengpässen und Entlastung in Verbindung gebracht.
- Die Evidenz erlaubt keine pauschale Aussage, dass Roboter ganze Berufsrollen ersetzen. In vielen realistischen Einsatzfällen werden Teilaufgaben automatisiert, während Menschen Überwachung, Ausnahmen, Kommunikation, komplexe Entscheidungen und nicht standardisierbare Tätigkeiten übernehmen.

### KMU

Für KMU besonders relevant:
1. Standardisierbarkeit der Aufgabe.
2. Häufigkeit/Auslastung.
3. Geringe Rüst- und Programmierzeiten.
4. Verfügbarkeit von Integrations- und Wartungskompetenz.
5. Sicherheits- und Regulierungsaufwand.
6. Gebäude-/IT-Infrastruktur.
7. Finanzierung: Kauf, Leasing, Miete, RaaS.
8. Möglichkeit, klein zu starten und später zu skalieren.

Die IFR nennt RaaS ausdrücklich als Modell, das hohe Anfangsinvestitionen und schwer kalkulierbare Wartungskosten vermeiden kann. Dies ist eine Anbieter-/Branchenperspektive und kein universeller Wirtschaftlichkeitsnachweis.

### Sektormatrix

| Sektor | Besonders relevante Robotertypen |
|---|---|
| Gesundheit & Pflege | AMR/FTS, Transportroboter, Pflege-/Assistenzroboter, Reinigungsroboter, Medizin-/Reharoboter, Exoskelette |
| Gastronomie & Hotellerie | Delivery-/Hospitality-Roboter, Reinigungsroboter, AMR, teilweise Cobots für Food-&-Beverage-Zubereitung |
| Logistik | FTS/AGV, AMR, mobile Manipulatoren, klassische Industrieroboter, Cobots |
| Handwerk | Cobots, klassische Industrieroboter, Inspektionsdrohnen, Exoskelette, perspektivisch mobile Manipulatoren |
| Facility Management | Reinigungsroboter, Inspektions-/Sicherheitsroboter, Drohnen, AMR, mobile Manipulatoren |
| Produktion | klassische Industrieroboter, Cobots, AMR/FTS, mobile Manipulatoren |
| Landwirtschaft | Feld-/Agrarroboter, Drohnen, autonome Fahrzeuge |
| Bau | Bau-/Feldroboter, Drohnen, Exoskelette, Roboter für Vorfertigung |

## 5. Praxisbeispiele

### P01: Transport- und Pflegeunterstützung in stationären Einrichtungen
**Anbieter/Projekt:** Fraunhofer IPA, SeRoDi.  
**Anwendung:** intelligenter Pflegewagen und robotischer Serviceassistent; Praxistests in Klinik und Pflegeeinrichtungen.  
**Belegte Wirkung:** Fraunhofer berichtet, dass der Nutzen zur Entlastung des Personals in den Praxistests verifiziert werden konnte.  
**Einordnung:** Forschungsprojekt; nicht gleichzusetzen mit flächendeckender Marktverfügbarkeit.  
**Quelle:** Q14.

### P02: Roboterbasierte 3D-Reinigung im Gesundheitswesen
**Projekt:** Fraunhofer IPA DeKonBot 2.  
**Anwendung:** Reinigung von Kontaktflächen oberhalb des Bodens, Türöffnung, automatischer Tuchwechsel.  
**Einordnung:** Entwicklungs-/Forschungsprojekt; zeigt technische Richtung mobiler Manipulation im Facility-/Gesundheitsbereich.  
**Quelle:** Q11.

### P03: Low-Cost-Cobot
**Anbieter:** igus ReBeL.  
**Anwendung:** u. a. Pick-and-Place, Maschinenbeschickung, Servicerobotik.  
**Kostenangabe:** ca. 4.970 EUR für einen 6-DOF-ReBeL in der genannten Shopkonfiguration; Greifer und weitere Komponenten separat.  
**Einordnung:** Herstellerpreis für Hardware, kein unabhängiger TCO-Nachweis.  
**Quelle:** Q18.

### P04: Low-Cost-AMR
**Anbieter:** igus ReBeL Move/ReBeLMove Pro.  
**Anwendung:** innerbetrieblicher Transport; optional Kombination mit Cobot.  
**Kostenangabe:** Hersteller nannte 2024 29.838 EUR für ReBeL Move; ReBeLMove Pro 2025 ab 39.800 EUR.  
**Einordnung:** Herstellerangaben, keine repräsentative Marktpreisspanne.  
**Quellen:** Q19, Q20.

### P05: Krankenhauslogistik mit Remote-Unterstützung
**Projekt:** Fraunhofer IML 5G-RemRob.  
**Anwendung:** autonome Transportaufgaben; bei Problemen Remote-Unterstützung durch Operator.  
**Einordnung:** Forschungs-/Demonstrationsprojekt mit Fokus auf reduzierten Implementierungsaufwand.  
**Quelle:** Q09.

## 6. Widersprüche, Unsicherheiten und Recherchelücken

1. **Begriffsüberschneidungen:** Ein Cobot kann zugleich Gelenkarm-Industrieroboter sein; ein AMR kann zugleich Hospitality- oder Logistikroboter sein. Eine flache Typenliste würde Doppelungen erzeugen.
2. **Kosten:** Es fehlen belastbare, herstellerunabhängige Durchschnitts-TCOs für viele Robotiksegmente. Anbieterpreise sollten nur als konkrete Beispiele und nicht als Marktstandard verwendet werden.
3. **KMU-Eignung:** Häufig wird "einfacher" oder "kostengünstiger" behauptet, aber die tatsächliche Eignung hängt von Prozess, Integrator, Auslastung und Sicherheitsanforderungen ab.
4. **Pflege/Gastronomie:** Viele öffentlich sichtbare Anwendungen beruhen auf Pilotprojekten oder Herstellerangaben. Unabhängige Langzeit-Wirtschaftlichkeitsdaten sind begrenzt.
5. **Humanoide:** Hohe Medien- und Herstelleraktivität, aber noch geringe belastbare Evidenz für wirtschaftlichen Dauerbetrieb in KMU.
6. **Exoskelette:** Passive Systeme sind keine Roboter im engeren Sinn; sie sollten redaktionell separat gekennzeichnet werden.
7. **Marktdaten Service Robotik:** IFR weist ausdrücklich darauf hin, dass die Daten Stichprobendaten sind und nicht auf den gesamten Markt hochgerechnet werden.
8. **Normung:** ISO 8373:2021 befindet sich im Revisionsprozess; Terminologie kann sich ändern.
9. **Kostenvertiefung empfohlen:** Für die spätere Redaktion wäre je Basisartikel eine zweite, gezielte Marktpreisrecherche sinnvoll, idealerweise mit 3–5 aktuellen Angeboten plus Integrations-/Servicekosten und ggf. RaaS-Raten.

## 7. Prüfbare Kernaussagen

**K01:** ISO 8373:2021 definiert einen Roboter als programmierten, angetriebenen Mechanismus mit einem Grad an Autonomie zur Ausführung von Fortbewegung, Manipulation oder Positionierung.
- **Beleg:** Q03, Abschnitt "Robot definitions at ISO".
- **Prüfpriorität:** hoch
- **Grund:** Definition/Normbezug.

**K02:** Die IFR unterscheidet in ihrer aktuellen Systematik Industrie-, Service- und Medizinroboter.
- **Beleg:** Q02, Q10.
- **Prüfpriorität:** hoch
- **Grund:** Taxonomie; kann sich durch Normrevision ändern.

**K03:** Die IFR unterscheidet bei Industrierobotern u. a. kartesische/Portal-, SCARA-, Gelenkarm-, Parallel/Delta-, zylindrische und polare Roboter.
- **Beleg:** Q01, Abschnitt "Industrial robots can be classified according to mechanical structure".
- **Prüfpriorität:** normal
- **Grund:** Klassifikation.

**K04:** Ein kollaborativer Roboter ist nicht allein aufgrund seiner Bauart automatisch in jeder Anwendung ohne zusätzliche Schutzmaßnahmen sicher einsetzbar.
- **Beleg:** Q06, Q07.
- **Prüfpriorität:** hoch
- **Grund:** Sicherheitsrelevante Einordnung.

**K05:** Bei kollaborativen Anwendungen muss die Risikobeurteilung die konkrete Roboteranwendung einschließlich Werkzeug und Arbeitsumgebung berücksichtigen.
- **Beleg:** Q06.
- **Prüfpriorität:** hoch
- **Grund:** Arbeitsschutz.

**K06:** Die IFR bezeichnet AMR als professionelle Serviceroboter.
- **Beleg:** Q02.
- **Prüfpriorität:** normal
- **Grund:** Definition.

**K07:** In der IFR-Stichprobe für 2024 war Transport und Logistik mit 102.900 Einheiten die größte Anwendungsgruppe professioneller Serviceroboter.
- **Beleg:** Q10.
- **Prüfpriorität:** hoch
- **Grund:** Zahl, Stichprobencharakter und Bezugsjahr.

**K08:** Die IFR-Stichprobe für 2024 weist mehr als 42.000 verkaufte Hospitality-Roboter aus.
- **Beleg:** Q10.
- **Prüfpriorität:** hoch
- **Grund:** Zahl, Stichprobencharakter.

**K09:** Die IFR-Stichprobe für 2024 weist mehr als 25.000 verkaufte professionelle Reinigungsroboter aus; die Hauptanwendung ist Bodenreinigung.
- **Beleg:** Q10.
- **Prüfpriorität:** hoch
- **Grund:** Zahl und Anwendungsbehauptung.

**K10:** Die IFR berichtet, dass ihre erfasste RaaS-Flotte professioneller Serviceroboter 2024 um 31 Prozent gewachsen ist.
- **Beleg:** Q10.
- **Prüfpriorität:** hoch
- **Grund:** Zahl/Aktualitätsrisiko.

**K11:** Fraunhofer IPA hat in SeRoDi einen intelligenten Pflegewagen und einen robotischen Serviceassistenten in einer Klinik und zwei Pflegeeinrichtungen praktisch getestet.
- **Beleg:** Q14.
- **Prüfpriorität:** mittel
- **Grund:** Praxisbeispiel.

**K12:** Fraunhofer IPA berichtet für SeRoDi, dass der Nutzen der entwickelten Roboter zur Entlastung des Personals in Praxistests verifiziert werden konnte.
- **Beleg:** Q14.
- **Prüfpriorität:** hoch
- **Grund:** Wirkungsbehauptung aus Projektquelle.

**K13:** Die BAuA nennt Montage-, Transport- und Reinigungstätigkeiten als Beispiele physischer Arbeitsaufgaben, die durch Robotersysteme unterstützt werden können.
- **Beleg:** Q08.
- **Prüfpriorität:** normal
- **Grund:** Behördeneinordnung.

**K14:** Die BAuA kommt für passive Exoskelette zu dem Ergebnis, dass Passgenauigkeit, Tragekomfort und Anpassbarkeit wichtige Faktoren für den Praxiseinsatz sind.
- **Beleg:** Q24.
- **Prüfpriorität:** normal
- **Grund:** Forschungsergebnis.

**K15:** Die IFR betont 2026, dass Humanoide für breiten industriellen Einsatz Zuverlässigkeit und Effizienz unter realen Anforderungen erst nachweisen müssen.
- **Beleg:** Q26.
- **Prüfpriorität:** mittel
- **Grund:** zeitabhängige Reifegradeinschätzung.

**K16:** igus listet den ReBeL Cobot 6 DOF 2026 für 4.970 EUR.
- **Beleg:** Q18.
- **Prüfpriorität:** hoch
- **Grund:** Herstellerpreis, hohe Aktualitätsabhängigkeit.

**K17:** igus nannte für den ReBeL Move 2024 einen Preis von 29.838 EUR und für den ReBeLMove Pro 2025 einen Einstiegspreis von 39.800 EUR.
- **Beleg:** Q19, Q20.
- **Prüfpriorität:** hoch
- **Grund:** Herstellerpreise/Aktualitätsrisiko.

**K18:** IFR zufolge können Programmierung und Integration einen erheblichen Anteil an den Kosten einer Roboteranwendung ausmachen.
- **Beleg:** Q27.
- **Prüfpriorität:** hoch
- **Grund:** zentrale Kostenbehauptung; genaue Prozentangabe im Faktencheck prüfen.


## Faktencheck

**Prüfstand:** 13.08.2026  
**Prüfumfang:** Die 18 unter „Prüfbare Kernaussagen“ ausdrücklich aufgeführten Aussagen K01–K18 wurden unabhängig anhand aktueller Webquellen geprüft.  
**Statuswerte:** bestätigt | teilweise bestätigt | widersprüchlich | nicht verifizierbar | veraltet

### K01
Aussage: ISO 8373:2021 definiert einen Roboter als programmierten, angetriebenen Mechanismus mit einem Grad an Autonomie zur Ausführung von Fortbewegung, Manipulation oder Positionierung.

Status: bestätigt

Bewertung: Die Aussage gibt die Definition aus ISO 8373:2021 inhaltlich korrekt wieder. Die IFR übernimmt die Definition unter Verweis auf ISO 8373:2021. ISO führt die Ausgabe von 2021 weiterhin als veröffentlichte Norm; eine Nachfolgefassung befindet sich 2026 in Entwicklung.

Unabhängige Quellen:
- *ISO 8373:2021 – Robotics — Vocabulary* — International Organization for Standardization (ISO), 11/2021, https://www.iso.org/standard/75539.html, Abruf: 13.08.2026, Fundstelle: Standardübersicht/Abstract.
- *Standardisation* — International Federation of Robotics (IFR), laufend aktualisierte Themenseite, https://ifr.org/standardisation, Abruf: 13.08.2026, Fundstelle: „Robot definitions at ISO“.

Abweichende Fundlage: Keine. ISO/DIS 8373 ist als Nachfolger in Entwicklung.

### K02
Aussage: Die IFR unterscheidet in ihrer aktuellen Systematik Industrie-, Service- und Medizinroboter.

Status: teilweise bestätigt

Bewertung: Der sachliche Kern stimmt, die Formulierung „IFR-Systematik“ ist jedoch unpräzise. ISO 8373:2021 behandelt Medizinroboter als eigene Kategorie neben Industrie- und Servicerobotern; die IFR übernimmt diese Unterscheidung in ihrer Marktberichterstattung. Medizinrobotik wird bei der IFR organisatorisch weiterhin im Umfeld von *World Robotics – Service Robots* behandelt.

Unabhängige Quellen:
- *Service Robots* — International Federation of Robotics (IFR), laufend aktualisierte Themenseite, https://ifr.org/service-robots, Abruf: 13.08.2026, Fundstelle: Definition/Statistics.
- *World Robotics – Service Robots* — International Federation of Robotics (IFR), https://ifr.org/wr-service-robots, Abruf: 13.08.2026, Fundstelle: IFR Classification Scheme of Service Robots.

Empfohlene Formulierung: ISO 8373:2021 definiert Medizinroboter als eigene Kategorie neben Industrie- und Servicerobotern; die IFR übernimmt diese Unterscheidung in ihrer aktuellen Marktberichterstattung.

### K03
Aussage: Die IFR unterscheidet bei Industrierobotern u. a. kartesische/Portal-, SCARA-, Gelenkarm-, Parallel/Delta-, zylindrische und polare Roboter.

Status: bestätigt

Bewertung: Die genannten Bauformen entsprechen der von der IFR dargestellten Klassifikation von Industrierobotern nach mechanischer Struktur.

Unabhängige Quellen:
- *Industrial Robots* — International Federation of Robotics (IFR), laufend aktualisierte Themenseite, https://ifr.org/industrial-robots, Abruf: 13.08.2026, Fundstelle: „Industrial robots can be classified according to mechanical structure“.

### K04
Aussage: Ein kollaborativer Roboter ist nicht allein aufgrund seiner Bauart automatisch in jeder Anwendung ohne zusätzliche Schutzmaßnahmen sicher einsetzbar.

Status: bestätigt

Bewertung: Die DGUV/IFA-Unterlagen stützen die Aussage. Bei kollaborierenden Anwendungen ist die Sicherheit der konkreten Anwendung zu bewerten; abhängig von Gefährdungen können technische Schutzmaßnahmen und weitere Sicherheitsmaßnahmen erforderlich sein. Die Produkteigenschaft eines Cobots allein macht eine Anwendung nicht automatisch sicher.

Unabhängige Quellen:
- *Kollaborierende Roboter (COBOTS)* — Deutsche Gesetzliche Unfallversicherung (DGUV), Institut für Arbeitsschutz (IFA), https://www.dguv.de/ifa/fachinfos/kollaborierende-roboter/index.jsp, Abruf: 13.08.2026, Fundstelle: sichere Kooperation von Mensch und Roboter.
- *Kollaborierende Roboter – Technische Schutzmaßnahmen* — DGUV/IFA, https://www.dguv.de/ifa/fachinfos/kollaborierende-roboter/technische-schutzmassnahmen/index.jsp, Abruf: 13.08.2026, Fundstelle: technische Schutzmaßnahmen.

### K05
Aussage: Bei kollaborativen Anwendungen muss die Risikobeurteilung die konkrete Roboteranwendung einschließlich Werkzeug und Arbeitsumgebung berücksichtigen.

Status: bestätigt

Bewertung: Die DGUV/IFA betrachtet ausdrücklich die vollständige Anwendung einschließlich Endeffektor beziehungsweise Werkzeug, bewegter Gegenstände und des betrieblichen Arbeitsplatzes. Damit wird die Aussage in ihrer wesentlichen Form gestützt.

Unabhängige Quellen:
- *Kollaborierende Roboter (COBOTS)* — DGUV/IFA, https://www.dguv.de/ifa/fachinfos/kollaborierende-roboter/index.jsp, Abruf: 13.08.2026, Fundstelle: Risikobeurteilung/Endeffektor/Arbeitsplatz.

### K06
Aussage: Die IFR bezeichnet AMR als professionelle Serviceroboter.

Status: bestätigt

Bewertung: Die IFR ordnet AMR im Kontext professioneller Servicerobotik ein. Zugleich weist die IFR darauf hin, dass „AMR“ eine Markt-/Marketingbezeichnung und kein in ISO 8373:2021 definierter Terminus ist. Diese terminologische Einschränkung sollte bei einem Grundlagenartikel sichtbar bleiben.

Unabhängige Quellen:
- *World Robotics – Service Robots* — International Federation of Robotics (IFR), https://ifr.org/wr-service-robots, Abruf: 13.08.2026, Fundstelle: professional service robots.
- *Sources & Methods – World Robotics 2025 Service Robots* — International Federation of Robotics (IFR), https://ifr.org/img/worldrobotics/Sources___Methods_WR_2025_Service_Robots.pdf, Abruf: 13.08.2026, Fundstelle: Terminologie zu AMR.

Empfohlene Formulierung: Die IFR ordnet AMR den professionellen Servicerobotern zu; „AMR“ selbst ist jedoch keine in ISO 8373:2021 definierte Kategorie.

### K07
Aussage: In der IFR-Stichprobe für 2024 war Transport und Logistik mit 102.900 Einheiten die größte Anwendungsgruppe professioneller Serviceroboter.

Status: bestätigt

Bewertung: Die IFR nennt für 2024 102.900 verkaufte professionelle Serviceroboter im Bereich Transport und Logistik und bezeichnet diese als größte Anwendungsgruppe. Die Zahl stammt aus der IFR-Herstellerstichprobe und darf nicht als hochgerechnete Gesamtmarktzahl interpretiert werden.

Unabhängige Quellen:
- *Service Robots See Global Growth Boom – World Robotics 2025 report* — International Federation of Robotics (IFR), 07.10.2025, https://ifr.org/news/service-robots-see-global-growth-boom/1st-quarterly-newsletter-2009, Abruf: 13.08.2026, Fundstelle: „Top applications for professional service robots by units sold“ sowie Methodikhinweis zur Stichprobe.

### K08
Aussage: Die IFR-Stichprobe für 2024 weist mehr als 42.000 verkaufte Hospitality-Roboter aus.

Status: bestätigt

Bewertung: Die IFR berichtet für 2024 von mehr als 42.000 verkauften Hospitality-Robotern. Auch diese Zahl ist Teil der IFR-Herstellerstichprobe und keine Hochrechnung auf den Gesamtmarkt.

Unabhängige Quellen:
- *Service Robots See Global Growth Boom – World Robotics 2025 report* — International Federation of Robotics (IFR), 07.10.2025, https://ifr.org/news/service-robots-see-global-growth-boom/1st-quarterly-newsletter-2009, Abruf: 13.08.2026, Fundstelle: Hospitality robots.

### K09
Aussage: Die IFR-Stichprobe für 2024 weist mehr als 25.000 verkaufte professionelle Reinigungsroboter aus; die Hauptanwendung ist Bodenreinigung.

Status: bestätigt

Bewertung: Beide Bestandteile werden von der IFR gestützt. Für 2024 werden mehr als 25.000 verkaufte professionelle Reinigungsroboter genannt; als wichtigste Anwendung wird die Bodenreinigung beschrieben. Die Zahlen sind Stichprobendaten.

Unabhängige Quellen:
- *Service Robots See Global Growth Boom – World Robotics 2025 report* — International Federation of Robotics (IFR), 07.10.2025, https://ifr.org/news/service-robots-see-global-growth-boom/1st-quarterly-newsletter-2009, Abruf: 13.08.2026, Fundstelle: professional cleaning robots.

### K10
Aussage: Die IFR berichtet, dass ihre erfasste RaaS-Flotte professioneller Serviceroboter 2024 um 31 Prozent gewachsen ist.

Status: teilweise bestätigt

Bewertung: Die IFR nennt ein Wachstum der erfassten Robot-as-a-Service-Flotte um 31 Prozent. Daneben nennt sie für RaaS im Segment Transport und Logistik eine Wachstumsrate von 42 Prozent. Die Aussage sollte deshalb ausdrücklich auf die gesamte erfasste RaaS-Flotte bezogen werden, damit beide Werte nicht verwechselt werden.

Unabhängige Quellen:
- *Service Robots See Global Growth Boom – World Robotics 2025 report* — International Federation of Robotics (IFR), 07.10.2025, https://ifr.org/news/service-robots-see-global-growth-boom/1st-quarterly-newsletter-2009, Abruf: 13.08.2026, Fundstellen: RaaS fleet (+31 %) und Transportation/Logistics RaaS (+42 %).

Empfohlene Formulierung: Die IFR berichtet für ihre erfasste RaaS-Flotte professioneller Serviceroboter ein Wachstum von 31 Prozent; im Segment Transport und Logistik lag die von der IFR ausgewiesene RaaS-Wachstumsrate 2024 bei 42 Prozent.

### K11
Aussage: Fraunhofer IPA hat in SeRoDi einen intelligenten Pflegewagen und einen robotischen Serviceassistenten in einer Klinik und zwei Pflegeeinrichtungen praktisch getestet.

Status: bestätigt

Bewertung: Fraunhofer IPA beschreibt beide entwickelten Systeme und nennt umfangreiche Praxistests in einer Klinik und zwei Pflegeeinrichtungen. Die Aussage ist als Beschreibung des Forschungsprojekts belegt.

Unabhängige Quellen:
- *SeRoDi – Servicerobotik zur Unterstützung bei personenbezogenen Dienstleistungen* — Fraunhofer IPA, https://www.ipa.fraunhofer.de/de/referenzprojekte/serodi.html, Abruf: 13.08.2026, Fundstelle: „In Kürze“/Projektbeschreibung.
- *Servicerobotik für die Pflege – Forschungsprojekt SeRoDi präsentiert Abschlussergebnisse* — Fraunhofer IPA, 09.10.2018, https://www.ipa.fraunhofer.de/de/presse/presseinformationen/servicerobotik_fuer_die_pflege.html, Abruf: 13.08.2026, Fundstelle: Projekt-/Praxistestbeschreibung.

### K12
Aussage: Fraunhofer IPA berichtet für SeRoDi, dass der Nutzen der entwickelten Roboter zur Entlastung des Personals in Praxistests verifiziert werden konnte.

Status: bestätigt

Bewertung: Als zugeschriebene Aussage von Fraunhofer IPA ist die Behauptung belegt. Die Quelle berichtet, der Nutzen zur Entlastung des Personals habe in Praxistests verifiziert werden können. Daraus folgt jedoch kein allgemeiner Wirksamkeitsnachweis für Pflege- oder Serviceroboter außerhalb des Projekts.

Unabhängige Quellen:
- *SeRoDi – Servicerobotik zur Unterstützung bei personenbezogenen Dienstleistungen* — Fraunhofer IPA, https://www.ipa.fraunhofer.de/de/referenzprojekte/serodi.html, Abruf: 13.08.2026, Fundstelle: Ergebniszusammenfassung.
- *Servicerobotik für die Pflege – Forschungsprojekt SeRoDi präsentiert Abschlussergebnisse* — Fraunhofer IPA, 09.10.2018, https://www.ipa.fraunhofer.de/de/presse/presseinformationen/servicerobotik_fuer_die_pflege.html, Abruf: 13.08.2026.

Empfohlene Formulierung: Fraunhofer IPA berichtet für das Forschungsprojekt SeRoDi, dass der Nutzen der entwickelten Systeme zur Entlastung des Personals in den durchgeführten Praxistests verifiziert werden konnte.

### K13
Aussage: Die BAuA nennt Montage-, Transport- und Reinigungstätigkeiten als Beispiele physischer Arbeitsaufgaben, die durch Robotersysteme unterstützt werden können.

Status: bestätigt

Bewertung: Die BAuA nennt diese Tätigkeitsgruppen ausdrücklich im Zusammenhang mit physischen Arbeitsassistenztechnologien und Robotersystemen.

Unabhängige Quellen:
- *Physische Arbeitsassistenztechnologien* — Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA), https://www.baua.de/DE/Themen/Arbeitsgestaltung/Digitalisierung-KI/Physische-Arbeitsassistenztechnologien, Abruf: 13.08.2026, Fundstelle: Themenbestimmung/Beispiele.

### K14
Aussage: Die BAuA kommt für passive Exoskelette zu dem Ergebnis, dass Passgenauigkeit, Tragekomfort und Anpassbarkeit wichtige Faktoren für den Praxiseinsatz sind.

Status: bestätigt

Bewertung: Die BAuA-Ergebnisse zu passiven Exoskeletten stützen die genannten Faktoren. Passgenauigkeit, Komfort und Anpassbarkeit werden als relevante Voraussetzungen für Akzeptanz und Nutzung im Arbeitskontext behandelt.

Unabhängige Quellen:
- *Ergonomische Bewertung des Langzeiteinsatzes von passiven Exoskeletten in der Arbeitswelt* — Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA), 2024, https://www.baua.de/DE/Angebote/Publikationen/Berichte/F2466, Abruf: 13.08.2026, Fundstelle: Ergebniszusammenfassung.
- *Forschungsprojekt F2466* — BAuA, https://www.baua.de/DE/Forschung/Forschungsprojekte/f2466, Abruf: 13.08.2026, Fundstelle: Projektbeschreibung/Ergebnisse.

### K15
Aussage: Die IFR betont 2026, dass Humanoide für breiten industriellen Einsatz Zuverlässigkeit und Effizienz unter realen Anforderungen erst nachweisen müssen.

Status: bestätigt

Bewertung: Die IFR formuliert 2026 ausdrücklich, dass Humanoide Zuverlässigkeit und Effizienz beweisen müssen. Als relevante reale Anforderungen nennt sie unter anderem Taktzeiten, Energieverbrauch, Wartungskosten, Sicherheit, Haltbarkeit und konstante Leistung. Die Recherche gibt diese Reifegradeinschätzung angemessen wieder.

Unabhängige Quellen:
- *Top 5 Global Robotics Trends 2026* — International Federation of Robotics (IFR), 08.01.2026, https://ifr.org/news/top-5-global-robotics-trends-2026/1st-quarterly-newsletter-2016, Abruf: 13.08.2026, Fundstelle: „Humanoids to prove reliability and efficiency“.

### K16
Aussage: igus listet den ReBeL Cobot 6 DOF 2026 für 4.970 EUR.

Status: bestätigt

Bewertung: Der igus-Onlineshop listete die genannte 6-DOF-Konfiguration zum Prüfzeitpunkt für 4.970 EUR pro Stück. Dies belegt den konkreten Herstellerpreis zum Abrufzeitpunkt, nicht einen allgemeinen Marktpreis oder die Gesamtkosten einer produktionsreifen Anwendung.

Unabhängige Quellen:
- *ReBeL Cobot* — igus GmbH, Online-Shop, https://www.igus.de/robolink/rebel-cobot, Abruf: 13.08.2026, Fundstelle: Produktvariante ReBeL Cobot 6 DOF/Preis.

Empfohlene Formulierung: igus listete den ReBeL Cobot 6 DOF zum Abrufzeitpunkt 13.08.2026 für 4.970 EUR pro Stück; zusätzliche Komponenten und Integration sind darin nicht als vollständige Anwendungskosten abgebildet.

### K17
Aussage: igus nannte für den ReBeL Move 2024 einen Preis von 29.838 EUR und für den ReBeLMove Pro 2025 einen Einstiegspreis von 39.800 EUR.

Status: bestätigt

Bewertung: Beide historischen Herstellerpreisangaben lassen sich in den jeweiligen igus-Pressemitteilungen nachvollziehen. Sie belegen die damaligen Herstellerangaben, nicht eine repräsentative Marktpreisspanne oder aktuelle TCO.

Unabhängige Quellen:
- *ReBeL Move: Autonomes Logistik-Fahrzeug von igus für 29.838 Euro* — igus GmbH, 08.10.2024, https://presse.igus.de/rebel-move-autonomes-logistik-fahrzeug-von-igus-fuer-29-838-euro/, Abruf: 13.08.2026, Fundstelle: Titel/Preisangabe.
- *ReBeLMove Pro: Modulare Roboterplattform für Logistik, Montage und Handling* — igus GmbH, 23.10.2025, https://presse.igus.de/rebelmove-pro-modulare-roboterplattform-fuer-logistik-montage-und-handling/, Abruf: 13.08.2026, Fundstelle: Preis „ab 39.800 Euro“.

### K18
Aussage: IFR zufolge können Programmierung und Integration einen erheblichen Anteil an den Kosten einer Roboteranwendung ausmachen.

Status: teilweise bestätigt

Bewertung: Die qualitative Aussage wird durch einen IFR-Beitrag gestützt. Dort wird IFR-Generalsekretärin Susanne Bieller mit der Größenordnung zitiert, Programmierung und Integration könnten 50–70 Prozent der Kosten einer Roboteranwendung ausmachen. Die konkrete Prozentzahl lässt sich aus der dort dokumentierten Quellenkette jedoch nicht auf eine belastbare Originalstudie beziehungsweise allgemeingültige Marktstatistik zurückführen. Die qualitative Formulierung „erheblicher Anteil“ ist daher tragfähig; die 50–70-Prozent-Zahl sollte nicht als gesicherte allgemeine Kennzahl verwendet werden.

Unabhängige Quellen:
- *Traditional robot programming vs AI & machine vision* — International Federation of Robotics (IFR), 27.02.2023, https://ifr.org/post/traditional-robot-programming-vs-ai-machine-vision, Abruf: 13.08.2026, Fundstelle: Einleitung/Aussage zu Programmierungs- und Integrationskosten.
- *IFR Blog* — International Federation of Robotics (IFR), https://ifr.org/blog/P40, Abruf: 13.08.2026, Fundstelle: Eintrag vom 27.02.2023.

Abweichende Fundlage: Eine belastbare Primärstudie für die konkrete Größenordnung von 50–70 Prozent konnte aus der angegebenen IFR-Quellenkette nicht verifiziert werden.

Empfohlene Formulierung: Die IFR weist darauf hin, dass Programmierung und Integration einen erheblichen Teil der Kosten einer Roboteranwendung ausmachen können. Eine von der IFR genannte Größenordnung von 50–70 Prozent sollte ohne belastbare Primärstudie nicht als allgemeingültige Marktkennzahl verwendet werden.

### Ergänzende Prüfhinweise zur Recherchegrundlage

1. **IFR-Service-Robotikdaten:** Die in der Recherche verwendeten Stückzahlen für professionelle Servicerobotik sind Stichprobendaten. Die IFR weist darauf hin, dass die Daten nicht auf den gesamten Markt hochgerechnet werden. Diese Einschränkung ist in der Recherche bereits korrekt enthalten und sollte in späteren Artikeln erhalten bleiben.
2. **Normrevision:** ISO 8373:2021 ist weiterhin die veröffentlichte Norm. ISO/DIS 8373 befindet sich 2026 in Entwicklung und soll ISO 8373:2021 ersetzen. Der Hinweis der Recherche auf eine laufende Revision ist daher aktuell.
3. **AMR-Terminologie:** Die sachliche Beschreibung von AMR ist tragfähig. Ergänzend sollte kenntlich gemacht werden, dass „AMR“ laut IFR keine in ISO 8373:2021 definierte Kategorie ist.
4. **Exoskelette:** Die redaktionelle Abgrenzung passiver Exoskelette als angrenzende Assistenztechnologie ist sachgerecht. Passive, nicht angetriebene Exoskelette sind nicht ohne Weiteres Roboter im Sinne der ISO-Roboterdefinition.
5. **Herstellerpreise:** Die konkreten igus-Preise sind als Herstellerangaben belegt. Sie dürfen nicht als Marktpreis, TCO oder vollständige Integrationskosten verallgemeinert werden.
6. **Pilot- und Forschungsprojekte:** Aussagen aus SeRoDi und vergleichbaren Projekten belegen den jeweiligen Projektkontext. Sie erlauben keine pauschale Übertragung auf die Wirksamkeit oder Wirtschaftlichkeit einer gesamten Robotergattung.

## Zusammenfassung des Faktenchecks

Es wurden **18 Kernaussagen** geprüft.

- **bestätigt:** 15
- **teilweise bestätigt:** 3
- **widersprüchlich:** 0
- **nicht verifizierbar:** 0
- **veraltet:** 0

Die Recherchegrundlage ist insgesamt belastbar und nach den genannten Präzisierungen als Grundlage für die nächste ROKI-Prozessstufe geeignet.

Vor einer redaktionellen Verwendung sollten insbesondere folgende Punkte angepasst beziehungsweise bewusst eingeschränkt werden:

- **K02:** ISO-Systematik und IFR-Marktberichterstattung präziser auseinanderhalten.
- **K10:** 31 Prozent Wachstum der gesamten erfassten RaaS-Flotte nicht mit 42 Prozent im Segment Transport und Logistik vermischen.
- **K18:** Die konkrete Größenordnung von 50–70 Prozent für Programmierungs- und Integrationskosten nicht als allgemein gesicherte Marktkennzahl verwenden.
- Bei allen IFR-Service-Robotikzahlen den **Stichprobencharakter** sichtbar halten.
- Herstellerpreise nur als **konkrete Herstellerangaben zum jeweiligen Zeitpunkt**, nicht als Markt- oder TCO-Werte verwenden.
- Wirkungsangaben aus Forschungs- und Pilotprojekten nicht über den belegten Projektkontext hinaus verallgemeinern.

Der Faktencheck ist Vorarbeit für die vorgesehene menschliche fachliche und redaktionelle Freigabe und ersetzt diese nicht.

## 8. Quellenverzeichnis

**Q01 – International Federation of Robotics (IFR):** "Industrial Robots".  
URL: https://ifr.org/industrial-robots  
Veröffentlichungsdatum: laufend aktualisierte Themenseite.  
Abruf: 13.08.2026.  
Relevante Fundstellen: Definition; mechanical structure; collaborative robots; SME/RaaS.

**Q02 – International Federation of Robotics (IFR):** "Service Robots".  
URL: https://ifr.org/service-robots  
Abruf: 13.08.2026.  
Relevante Fundstellen: Definition Service Robot, Autonomy, medical robots.

**Q03 – International Federation of Robotics (IFR):** "Standardisation".  
URL: https://ifr.org/standardisation  
Abruf: 13.08.2026.  
Relevante Fundstellen: Robot definitions at ISO; mobile robot; AGV.

**Q04 – ISO:** ISO 8373:2021 "Robotics — Vocabulary".  
URL: https://www.iso.org/standard/75539.html  
Veröffentlicht: 11/2021.  
Abruf: 13.08.2026.

**Q05 – Mittelstand-Digital:** "Leichtbauroboter in der Produktion – Ein Praxisleitfaden".  
URL: https://newsletter.mittelstand-digital.de/MDN/Redaktion/DE/Newsletter/2020/32/Meldungen/32_Publikationen_KompZAugsburg_Roboter_Produktion.html  
Abruf: 13.08.2026.

**Q06 – DGUV/IFA:** "Kollaborierende Roboter (COBOTS)".  
URL: https://www.dguv.de/ifa/fachinfos/kollaborierende-roboter/index.jsp  
Abruf: 13.08.2026.

**Q07 – DGUV/IFA:** "Kollaborierende Roboter – Technische Schutzmaßnahmen".  
URL: https://www.dguv.de/ifa/fachinfos/kollaborierende-roboter/technische-schutzmassnahmen/index.jsp  
Abruf: 13.08.2026.

**Q08 – Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA):** "Physische Arbeitsassistenztechnologien".  
URL: https://www.baua.de/DE/Themen/Arbeitsgestaltung/Digitalisierung-KI/Physische-Arbeitsassistenztechnologien  
Abruf: 13.08.2026.

**Q09 – Fraunhofer IML:** "5G-RemRob – 5G-Remote Assistance for Robotics".  
URL: https://www.iml.fraunhofer.de/de/abteilungen/b3/health_care_logistics/forschung_hcl/5g-remrob.html  
Abruf: 13.08.2026.

**Q10 – International Federation of Robotics (IFR):** "World Robotics 2025 report – SERVICE ROBOTS – released by IFR / Service Robots See Global Growth Boom".  
URL: https://ifr.org/news/service-robots-see-global-growth-boom/1st-quarterly-newsletter-2009  
Veröffentlicht: 07.10.2025.  
Abruf: 13.08.2026.  
Hinweis: IFR weist aus, dass Service-Robotikdaten Stichprobendaten von 294 Anbietern sind und nicht auf die Gesamtindustrie hochgerechnet werden.

**Q11 – Fraunhofer IPA:** "Roboterbasierte Reinigung und Desinfektion von Oberflächen im Gesundheitswesen".  
URL: https://www.ipa.fraunhofer.de/de/referenzprojekte/roboterbasierte-reinigung-und-desinfektion-von-oberflaechen-im-gesundheitswesen.html  
Abruf: 13.08.2026.

**Q12 – Fraunhofer IPA:** "Transportroboter für das Gesundheitswesen".  
URL: https://www.ipa.fraunhofer.de/de/veranstaltungen-messen/veranstaltungen/2024/transportroboter.html  
Abruf: 13.08.2026.

**Q13 – Fraunhofer IPA:** "Roboter zur Pflegeunterstützung im Altenheim und Krankenhaus".  
URL: https://www.ipa.fraunhofer.de/de/aktuelle-forschung/roboter--und-assistenzsysteme/haushalts--und-assistenzrobotik/roboter-zur-pflegeunterstuetzung-im-altenheim-und-krankenhaus.html  
Abruf: 13.08.2026.

**Q14 – Fraunhofer IPA:** "SeRoDi – Servicerobotik zur Unterstützung bei personenbezogenen Dienstleistungen".  
URL: https://www.ipa.fraunhofer.de/de/referenzprojekte/serodi.html  
Abruf: 13.08.2026.

**Q15 – Fraunhofer IPA:** "Navigation".  
URL: https://www.ipa.fraunhofer.de/de/aktuelle-forschung/roboter--und-assistenzsysteme/serviceroboter-technologien/navigation.html  
Abruf: 13.08.2026.

**Q16 – Fraunhofer IPA:** "Serviceroboter-Technologien".  
URL: https://www.ipa.fraunhofer.de/de/aktuelle-forschung/roboter--und-assistenzsysteme/serviceroboter-technologien.html  
Abruf: 13.08.2026.

**Q17 – Fraunhofer IPA:** "3D-Bildverarbeitung".  
URL: https://www.ipa.fraunhofer.de/de/aktuelle-forschung/roboter--und-assistenzsysteme/serviceroboter-technologien/3d-bildverarbeitung.html  
Abruf: 13.08.2026.

**Q18 – igus GmbH:** "ReBeL Cobot" / Online-Shop.  
URL: https://www.igus.de/robolink/rebel-cobot  
Abruf: 13.08.2026.  
Einordnung: Herstellerquelle; belegt Produkt- und Preisangabe, nicht Marktpreis oder Wirtschaftlichkeit.

**Q19 – igus GmbH:** "ReBeL Move: Autonomes Logistik-Fahrzeug von igus für 29.838 Euro".  
URL: https://presse.igus.de/rebel-move-autonomes-logistik-fahrzeug-von-igus-fuer-29-838-euro/  
Veröffentlicht: 08.10.2024.  
Abruf: 13.08.2026.  
Einordnung: Herstellerquelle.

**Q20 – igus GmbH:** "ReBeLMove Pro: Modulare Roboterplattform für Logistik, Montage und Handling".  
URL: https://presse.igus.de/rebelmove-pro-modulare-roboterplattform-fuer-logistik-montage-und-handling/  
Veröffentlicht: 23.10.2025.  
Abruf: 13.08.2026.  
Einordnung: Herstellerquelle.

**Q21 – International Federation of Robotics (IFR):** "How to participate – Industrial Robots", 2026 questionnaires.  
URL: https://ifr.org/survey-participation/IR  
Abruf: 13.08.2026.  
Relevante Fundstelle: separate Datenerhebung zu Cobots und Mobile Manipulators.

**Q22 – Fraunhofer IPA:** "SRS: Häusliche Unterstützung mittels teilautonomer Serviceroboter".  
URL: https://www.ipa.fraunhofer.de/de/referenzprojekte/SRS.html  
Abruf: 13.08.2026.

**Q23 – International Federation of Robotics (IFR):** "World Robotics 2025 – Service Robots", application scheme/contents.  
URL: https://ifr.org/wr-service-robots  
Abruf: 13.08.2026.

**Q24 – Bundesanstalt für Arbeitsschutz und Arbeitsmedizin (BAuA):** "Ergonomische Bewertung des Langzeiteinsatzes von passiven Exoskeletten in der Arbeitswelt".  
URL: https://www.baua.de/DE/Angebote/Publikationen/Berichte/F2466  
Veröffentlicht: 2024.  
Abruf: 13.08.2026.

**Q25 – Mittelstand-Digital:** "Robotik im Handwerk – Arbeitsunterstützung mittels Exoskelette".  
URL: https://www.mittelstand-digital.de/MD/Redaktion/DE/TERMIN-IMPORT/2023/1664216445723-6873-Termin.html  
Abruf: 13.08.2026.

**Q26 – International Federation of Robotics (IFR):** "Top 5 Global Robotics Trends 2026".  
URL: https://ifr.org/news/top-5-global-robotics-trends-2026/1st-quarterly-newsletter-2016  
Veröffentlicht: 08.01.2026.  
Abruf: 13.08.2026.

**Q27 – International Federation of Robotics (IFR):** Blog-Übersicht mit Beitrag "Traditional robot programming vs AI & machine vision", 27.02.2023.  
URL: https://ifr.org/blog/P40  
Abruf: 13.08.2026.  
Relevante Fundstelle: IFR-General Secretary mit Aussage, dass Programmierung und Integration 50–70 % der Kosten einer Roboteranwendung ausmachen können. Diese Prozentangabe sollte im Faktencheck auf die Originalquelle zurückgeführt werden.

---

## Vorschlag für die spätere Basisartikel-Serie

Als redaktionelle Arbeitsstruktur erscheint folgendes Kernset zweckmäßig:

1. Industrieroboter – Bauformen und Einsatz
2. Cobots / kollaborative Roboter
3. FTS/AGV
4. Autonome mobile Roboter (AMR)
5. Mobile Manipulatoren
6. Reinigungsroboter
7. Transport- und Serviceroboter in Gastronomie/Hotellerie
8. Pflege- und Assistenzroboter
9. Medizin- und Rehabilitationsroboter
10. Inspektions- und Wartungsroboter inkl. Drohnen
11. Agrar- und Bauroboter
12. Exoskelette und körpergetragene Assistenzsysteme (klar als angrenzende Technologie)
13. Humanoide Roboter (Emerging Technology)

Die mechanischen Untertypen Gelenkarm, SCARA, Delta, Portal/Kartesisch sollten im Artikel "Industrieroboter" ausführlich behandelt werden; separate Artikel lohnen sich nur, wenn später genügend anwendungsbezogene Tiefe vorhanden ist.
