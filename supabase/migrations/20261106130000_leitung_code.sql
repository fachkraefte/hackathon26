-- Ein Team-Code (= ID der Bestandsaufnahme) für alle Beschäftigten, dazu ein privater Leitungs-Code fürs Dashboard.
alter table public.bestandsaufnahmen add column leitung_code text unique;
