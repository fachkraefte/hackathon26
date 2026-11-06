-- Persönliche Codes: ein Code pro Person, nie mit Namen. Der Bereich wird beim ersten Öffnen gewählt.
create table public.zugaenge (
  code text primary key,
  bestandsaufnahme_id text not null references public.bestandsaufnahmen (id) on delete cascade,
  bereich text
);
create index zugaenge_bestandsaufnahme on public.zugaenge (bestandsaufnahme_id);
alter table public.zugaenge enable row level security;

-- Karten: eine Zeile Kontext (wo, mit welcher Folge), damit andere Bereiche das Problem verstehen.
alter table public.karten add column kontext text;
