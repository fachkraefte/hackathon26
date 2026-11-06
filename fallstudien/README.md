# Fallstudien

**Stand:** 05.11.2026

Drei fiktive Betriebe, an denen wir ROKIO einmal komplett durchspielen: was die Leitung beim Anlegen eingibt, was die Beschäftigten erzählen, was Analyse und Lösungen zeigen. Die Betriebe und Personen sind erfunden, die Branchenangaben sind belegt (Quellen jeweils in Teil B).

| Fall | Branche | Größe | Größtes Handlungsfeld | Stärkste KI-Lösung | Live-Demo |
|---|---|---|---|---|---|
| [01 Metallbau Heidekamp](01_metallbau_heidekamp.md) | Handwerk | 22 | Zeichnungsstand und Material | Änderungs-Agent, Schweiß-Cobot ohne Programmierung | **ja** |
| [02 Haus am Elbufer](02_pflege_haus_am_elbufer.md) | Pflege | 100 | Schichtübergabe und Dokumentation | Übergabe-Assistent mehrsprachig, Sprechen statt Schreiben | nein |
| [03 Mensa am Kanal](03_mensa_am_kanal.md) | Gemeinschaftsverpflegung | 42 | Spülküche in der Stoßzeit | Mengen-Prognose, Rückgabe mit Augen | nein |

## Was alle drei Fälle gemeinsam zeigen

1. **Die Probleme sitzen an Übergaben, nicht bei Personen.** In jedem Fall beschreiben mindestens zwei Bereiche dasselbe Problem von verschiedenen Seiten. Die Übergabe-Karte ist deshalb das zentrale Bild.
2. **Die Leitung sucht Fachkräfte und übersieht verlorene Zeit.** In jedem Fall ist die Lösungsidee der Leitung „mehr Personal“. Die Stimmen zeigen, wie viel Zeit vorhandener Fachkräfte an Übergaben verloren geht.
3. **Die leiseste Stelle ist oft die wichtigste:** Azubi und Altgeselle (Metallbau), Hilfskraft mit anderer Muttersprache (Pflege), Spülküche (Mensa).
4. **Sprache ist überall ein Thema.** Die Befragung muss Sprachaufnahmen in anderen Sprachen annehmen, sonst fehlen genau diese Stimmen.
5. **Der KI-Kniff ist fast immer derselbe:**
   - Aus Gesprochenem und Beiläufigem wird Struktur (Änderung, Übergabe, Pflegebericht, Entnahme).
   - Signale, die getrennt vorliegen, werden verbunden (Kasse + Kalender + Wetter, Stückliste + Lager).
   - Eine Person bestätigt, die KI entscheidet nie allein.
6. **Robotik passt dort, wo Wege und Wiederholungen sind:** Schweiß-Cobot, Transportroboter, Serviceroboter, Reinigungsroboter, Exoskelette. Ausdrücklich nicht vorgeschlagen: Humanoide (Metallbau) und multifunktionale Assistenzroboter wie Lio (Pflege).
7. **Nicht alles ist Zeit.** Körperliche Belastung (alle drei) und Ware im Abfall (Mensa) müssen sichtbar sein, ohne in Euro gerechnet zu werden.
8. **3 bis 6 Handlungsfelder.** Profil und Lösungsseite müssen mit unterschiedlich vielen Feldern funktionieren.

## Für den Umbau der App (`KONZEPT_V3.md`, nächster Schritt)

- Befragung: Sprachaufnahme in jeder Sprache, Regler „Wie sehr bremst dich das?“ je Thema, optional „Was geht dabei verloren?“
- Analyse: Übergabe-Karte aus Bereichen, Kanten aus den Stimmen. Dafür braucht jede Stimme ein „von wem / an wen“. Das leitet die KI ab, die Person kann es per Chip korrigieren.
- Lösungen: fester Aufbau (So läuft es · Was es braucht · Der KI-Kniff · Wofür die Zeit frei wird · Reife/Herkunft · Testlauf · Bauplan-Prompt). Die KI wählt aus einem Muster-Katalog und passt ihn an den Betrieb an, statt frei zu erfinden.
- Daten: Gesundheitsangaben (Pflege) und Namen werden vor dem Speichern entfernt. Pitch-Argument: lokale KI.
