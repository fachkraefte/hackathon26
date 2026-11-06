-- ROKIO Workflow v3 (KONZEPT_V3.md §7)
-- Rein ergänzend: neue Spalten, nichts wird gelöscht oder umbenannt.
-- So läuft die bisherige Version (main) während des Umbaus unverändert weiter.
-- Alte Spalten (stundensatz, zeitfresser, besprechung_am, bremst) füllt v3 weiter mit passenden Werten
-- und kann sie nach dem Umstieg in einer eigenen Migration entfernen.

alter table public.bestandsaufnahmen
  add column website        text,
  add column profil         jsonb,   -- Format: Profil in lib/typen.ts (Kurzbeschreibung, Externe, Chips, Rückfragen)
  add column bereich_saetze jsonb,   -- Format: [{name, satzVon, satzBis}] – Stundensatz-Spanne je Bereich
  add column deadline       text;    -- „wann und wo“ der Ergebnisbesprechung, sehen alle

alter table public.beitraege
  add column mitsprache smallint check (mitsprache between 1 and 5);

alter table public.gesamtbilder
  add column loesungen jsonb not null default '{}'::jsonb;  -- je Faden-ID: Lösung + Fingerabdruck des Fadens
