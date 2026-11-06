-- Sprache eines Projekts: steuert die Texte der KI (Karten, Befund, Lösungen) und die Oberfläche beim Öffnen per Code.
alter table public.bestandsaufnahmen add column sprache text not null default 'de' check (sprache in ('de', 'en'));
