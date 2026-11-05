-- ROwAI Workflow v2 – Schema-ENTWURF zur Freigabe (noch nicht ausgeführt)
-- Bildet lib/typen.ts ab. Zugriff nur über den Server (Service-Role-Key):
-- Row Level Security ist überall an, es gibt bewusst KEINE Policies für anon/authenticated.
-- Damit kann der Browser keine Tabelle direkt lesen oder schreiben.

-- ---------------------------------------------------------------------------
-- ① Bestandsaufnahme (von der Leitung gestartet)
-- ---------------------------------------------------------------------------
create table public.bestandsaufnahmen (
  id               text primary key,                       -- steht im Link, z. B. /mitmachen/heidekamp
  betrieb_name     text not null,
  branche          text not null check (branche in
                     ('produktionHandwerk','gastronomie','gesundheitPflege','logistik','facilityManagement')),
  mitarbeitende    integer not null check (mitarbeitende > 0),
  leistungen       text not null default '',
  fiktiv           boolean not null default true,          -- Demo: nur fiktive Betriebe
  leitung_vorname  text not null,
  leitung_rolle    text not null,
  anrede           text not null default 'du' check (anrede in ('du','sie')),
  frage            text not null check (char_length(frage) between 5 and 800),
  ziel             text not null default '',
  stundensatz      numeric(6,2) not null check (stundensatz > 0),
  arbeitswochen    integer not null default 46 check (arbeitswochen between 1 and 52),
  bereiche         text[] not null check (cardinality(bereiche) >= 1),
  mindestanzahl    integer not null default 3 check (mindestanzahl >= 1),
  zeitfresser      text[] not null default '{}',           -- Chips, von der KI vorgeschlagen
  besprechung_am   date,
  erstellt_am      timestamptz not null default now(),
  geaendert_am     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ② Beitrag einer Person (Einzelantwort – nie an den Browser anderer Personen)
-- ---------------------------------------------------------------------------
create table public.beitraege (
  id                 text primary key,
  bestandsaufnahme_id text not null references public.bestandsaufnahmen(id) on delete cascade,
  bereich            text not null,
  ist_leitung        boolean not null default false,       -- Antworten der Leitung sind nie anonym
  rolle_zeigen       boolean not null default false,       -- Zustimmung, Bereich trotz kleiner Gruppe zu nennen
  -- 1–3 Punkte als JSON-Array (Format: Punkt in lib/typen.ts, vor dem Speichern mit zod geprüft).
  -- Punkt-IDs müssen eindeutig sein, das Gesamtbild verweist darauf.
  punkte             jsonb not null check (jsonb_typeof(punkte) = 'array'
                       and jsonb_array_length(punkte) between 1 and 3),
  bremst             smallint not null check (bremst between 1 and 5),
  gut_laeuft         text,
  fiktiv             boolean not null default false,       -- true nur für Demo-Startdaten
  erstellt_am        timestamptz not null default now()
);

create index beitraege_bestandsaufnahme_idx on public.beitraege (bestandsaufnahme_id);

-- ---------------------------------------------------------------------------
-- ③ Gemeinsames Bild (aktuelle Fassung je Bestandsaufnahme)
-- ---------------------------------------------------------------------------
create table public.gesamtbilder (
  bestandsaufnahme_id text primary key references public.bestandsaufnahmen(id) on delete cascade,
  schluessel          text not null,                       -- Fingerabdruck der Beiträge; ändert er sich, wird neu zusammengeführt
  bild                jsonb not null,                      -- Format: Gesamtbild in lib/typen.ts
  aus_demo            boolean not null default false,      -- true = Ersatzbild, KI war nicht erreichbar
  erstellt_am         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Beschluss je Problemfaden (im Termin eingetragen)
-- ---------------------------------------------------------------------------
create table public.beschluesse (
  bestandsaufnahme_id text not null references public.bestandsaufnahmen(id) on delete cascade,
  faden_id            text not null,
  aufgabe             text not null,                       -- Kopie der gemeinsamen Aufgabe: Faden-IDs können sich bei neuem Zusammenführen ändern
  verantwortlich      text not null,                       -- Rolle, kein Name nötig
  bis                 date not null,
  erstellt_am         timestamptz not null default now(),
  primary key (bestandsaufnahme_id, faden_id)
);

-- ---------------------------------------------------------------------------
-- Zeitstempel bei Änderung
-- ---------------------------------------------------------------------------
create function public.setze_geaendert_am() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.geaendert_am := now();
  return new;
end;
$$;

create trigger bestandsaufnahmen_geaendert_am
  before update on public.bestandsaufnahmen
  for each row execute function public.setze_geaendert_am();

-- ---------------------------------------------------------------------------
-- Schutz: nur der Server (Service-Role) darf zugreifen
-- ---------------------------------------------------------------------------
alter table public.bestandsaufnahmen enable row level security;
alter table public.beitraege         enable row level security;
alter table public.gesamtbilder      enable row level security;
alter table public.beschluesse       enable row level security;

revoke all on public.bestandsaufnahmen, public.beitraege, public.gesamtbilder, public.beschluesse
  from anon, authenticated;
