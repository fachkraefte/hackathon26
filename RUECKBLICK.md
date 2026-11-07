# ROKIO – Friction to Flow · Rückblick fürs Team

Stand: 2026-11-07 · Leuphana AI Hackathon (ROKI), 5.–6.11.2026

Diese Zusammenfassung ist kurz gehalten und soll beim nächsten Projekt helfen: was wir gebaut haben, wie es gelaufen ist und wie wir es nächstes Mal besser machen.

---

## 1 · Was wir gebaut haben

**ROKIO** ist eine Web-App für kleine und mittlere Betriebe. Beschäftigte melden anonym am Handy, wo die Arbeit hakt. Sie wischen Karten („kenne ich“ oder „kenne ich nicht“) oder sprechen ihr Problem ein.

Die KI zerlegt jede Meldung in einzelne Probleme, die für alle verständlich sind. Aus vielen Stimmen entsteht ein gemeinsames Bild:
- an welchen Übergaben zwischen Teams Zeit verloren geht
- welche Prozess-, KI- oder Robotik-Lösungen helfen könnten
- ein Fahrplan für die Teambesprechung

- **Live:** https://hackathon26-nu.vercel.app
- **Technik:** Next.js, Supabase (EU), OpenAI, Vercel, Deutsch und Englisch
- **Demo:** Metallbau Heidekamp (fiktiv), dazu ein echtes Testprojekt mit den Teilnehmenden des Hackathons
- **Pitch:** 8 Minuten auf Englisch mit Video und Mitmachaktion per QR-Code

---

## 2 · Wie wir vorgegangen sind

| Phase | Was passiert ist |
|---|---|
| **Start** (Tag 1, Mittag) | Repo, Supabase und OpenAI angebunden, Personas und Recherche hochgeladen |
| **Erster Entwurf** | Kompletter Durchlauf als Fragebogen. Ergebnis: zu lang, zu statisch. |
| **Workflow v2** | Kürzerer Ablauf mit KI-Rückfragen, Schiebereglern und Euro-Rechnung |
| **Konzept v3** (Tag 1, Abend) | Drei Fallstudien (Metallbau, Pflege, Mensa), Übergabe-Karte, Lösungsseite, Name ROKIO |
| **„Klo-Test“** (Tag 2, Morgen) | Radikal vereinfacht: Swipe-Karten wie bei Social-Media-Apps, persönliche Codes, Befund, Lösungen im neuen Stil |
| **Beta** | Ein Team-Code und ein Leitungs-Dashboard mit QR-Code, echtes Testprojekt mit Teilnehmenden |
| **Pitch** (Tag 2, Mittag) | Englische Fassung der App, Video, Präsentation und Sprechtext |

---

## 3 · Was gut lief

- Kleine Schritte, die direkt live gingen (rund 25 Pull Requests)
- Echte Tests mit echten Menschen statt nur Demo-Daten
- Die Fallstudien wurden Schritt für Schritt geprüft, bevor gebaut wurde
- Der Prüfauftrag „Jeder Schritt braucht eine Begründung, sonst fliegt er raus“
- Ein fester Zeitrahmen hat Entscheidungen erzwungen

## 4 · Was schwierig war

1. **Die Idee hat sich mehrfach stark verändert.** Dabei ging der Kern verloren. Im Pitch wurden **Zielgruppe, Problem und Produkt nicht klar genug benannt**.
2. **Die Arbeit lief über wenige Köpfe.** Wir hatten unterschiedliche Zugänge und Ressourcen, und es gab keinen gemeinsamen Plan, wer was übernimmt. Viele konnten sich deshalb schwer einklinken.
3. **Die Dokumentation war verteilt** (Google Doc, WhatsApp, Repo). Manche Beiträge, etwa parallele Konzepte oder Übersetzungen, kamen zu einem Zeitpunkt, an dem sich das Produkt noch bewegte, und mussten nachgearbeitet werden.
4. **Englisch wurde spät entschieden.** App, Demo-Daten und Video mussten kurz vor dem Pitch umgestellt werden.
5. **Für den Pitch blieb zu wenig Zeit,** vor allem für den mündlichen Teil und für Proben.
6. **Technik:** Beim Wechsel zwischen Präsentation, Video und Website ist die Beamer-Verbindung abgestürzt. Über 2 Minuten gingen verloren, Live-Demo und Mitmachaktion kamen zu kurz.
7. **Am Ende war das Produkt fast überausgereift.** Weniger Features und eine klarere Geschichte wären stärker gewesen.

---

## 5 · So machen wir es nächstes Mal

### Zehn Regeln
1. **Zuerst einen Nordstern festlegen:** Zielgruppe, Problem, Produktidee und Pitch-Kernsatz, je ein Satz, in `NORDSTERN.md`. Ohne ihn wird nicht gebaut.
2. **Jede neue Idee wird geprüft:** Löst sie noch unser Problem? Lässt sie sich in einem Satz pitchen?
3. **Ändert sich die Idee, wird zuerst der Nordstern angepasst,** dann wird gebaut. Alte Konzepte kommen nach `alt/` und werden nicht parallel weitergepflegt.
4. **Reduzieren statt anhäufen.** Was den Pitch-Kernsatz nicht stärkt, kommt in `BACKLOG.md`.
5. **Pitch-Sprache, Länge und Jury-Kriterien in der ersten Stunde klären.**
6. **Mindestens ein Viertel der Zeit gehört dem Pitch.** Dazu gehören drei Proben mit Stoppuhr.
7. **Präsentation, Video und Demo liegen in einer einzigen Datei.** Die Demo wird als Aufnahme eingebettet, live läuft nur der QR-Code auf den Handys des Publikums. Davor ein Technik-Check am Beamer.
8. **Rollen am Start verteilen** (`ROLLEN.md`): wer welche Zugänge hat, wer was übernimmt und wer was ändern darf.
9. **Eine Quelle der Wahrheit: das Repo.** Entscheidungen stehen in `ENTSCHEIDUNGEN.md`, der aktuelle Stand in `STAND.md`. Kein Google Doc als Arbeitsdoku.
10. **Feature-Freeze vor dem Pitch.** Übersetzungen und Feinschliff kommen erst danach.

### Fahrplan (48 Stunden, Anteile gelten auch für andere Formate)

| Zeit | Schritt |
|---|---|
| Stunde 0–1,5 | Setup und Team: Repo, Zugänge, Rollen und Aufgaben |
| Stunde 1,5–3 | Klärung: `NORDSTERN.md` gemeinsam festlegen |
| Stunde 3–4 | Pitch-Gerüst: Geschichte in 5 Sätzen, welcher Moment wird live gezeigt? |
| Stunde 4–8 | Kern-Prototyp: nur der wichtigste Moment, mit echten Menschen testen |
| Stunde 8–24 | Bauen in kleinen Paketen, nach jedem Paket kurz zeigen |
| Stunde 24 | Kurs-Check: Große Änderungen gibt es nur hier |
| Stunde 24–36 | Echt testen, Zahlen sichern, danach Feature-Freeze |
| Stunde 36–48 | Pitch: Präsentation, Sprechtext, Video, Proben, Technik-Check |

### Wer hilft wie (ohne sich in die Quere zu kommen)

**Hilft parallel:**
- Recherche und Gespräche mit echten Nutzer:innen, Zahlen mit Quelle prüfen
- Testpersonen gewinnen und Feedback sammeln
- Design: Logo, Bilder, Illustrationen, abgelegt per Pull Request
- Video nach freigegebenem Skript
- Pitch-Training: Probepublikum, Zeit stoppen, Fragen für die Q&A sammeln
- Technik vor Ort: Beamer, Adapter, Ton, Ersatzgerät

**Nur nach Absprache:**
- eigene Konzeptdateien neben dem Nordstern
- Übersetzungen, solange sich das Produkt noch ändert
- Änderungen an Dateien, an denen gerade jemand anderes arbeitet

---

## 6 · Vorlagen

**NORDSTERN.md**
```
# NORDSTERN – <Projekt>
- Zielgruppe:
- Problem (1 Satz + Beleg):
- Produktidee (1 Satz):
- Kernmoment (≤ 30 Sekunden):
- Pitch-Kernsatz:
- Pitch: Sprache / Länge / Jury-Kriterien / Live-Elemente:
- Deadline / Feature-Freeze:
- Bauen wir bewusst nicht:
```

**ROLLEN.md**
```
| Person | Zugänge / Ressourcen | Stärke | Aufgabe | Darf ändern | Bitte nicht ändern |
|---|---|---|---|---|---|
```

**Feedback**
```
MUSS: …   SOLL: …   KANN: …
Fertig, wenn: …
Passt noch zum Nordstern? ja / nein, weil …
```
