-- Neue Branche „Bildung und Veranstaltungen“ (z. B. Hackathon als Testprojekt).
alter table public.bestandsaufnahmen drop constraint bestandsaufnahmen_branche_check;
alter table public.bestandsaufnahmen add constraint bestandsaufnahmen_branche_check
  check (branche in ('produktionHandwerk','gastronomie','gesundheitPflege','logistik','facilityManagement','bildungVeranstaltung'));
