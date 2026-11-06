-- Feed (Klo-Test): Karten, die alle swipen, und die Reaktionen darauf.
-- Bewusst ohne Zeitstempel (Hausordnung: keine Uhrzeiten, keine Nutzungsdauern).
create table public.karten (
  id text primary key,
  bestandsaufnahme_id text not null references public.bestandsaufnahmen (id) on delete cascade,
  faden_id text,                 -- Handlungsfeld, dem die Karte zugeordnet ist
  text text not null,            -- anonymisierte Aussage in der Sprache des Betriebs
  bereich text not null,         -- aus welchem Bereich die Meldung kommt
  von text,                      -- Übergabe: kommt von …
  an text,                       -- … geht an
  typ text not null default 'aussage' check (typ in ('aussage', 'meme')),
  frei boolean not null default true
);
create index karten_bestandsaufnahme on public.karten (bestandsaufnahme_id);

create table public.reaktionen (
  sitzung text not null,         -- zufällige ID je Feed-Sitzung, nur im Browser bekannt
  karte_id text not null references public.karten (id) on delete cascade,
  bestandsaufnahme_id text not null references public.bestandsaufnahmen (id) on delete cascade,
  bereich text not null,
  richtung text not null check (richtung in ('kenn', 'staendig', 'nicht')),
  primary key (sitzung, karte_id)
);
create index reaktionen_bestandsaufnahme on public.reaktionen (bestandsaufnahme_id);

alter table public.karten enable row level security;
alter table public.reaktionen enable row level security;
