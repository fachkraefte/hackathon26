-- Karten: Hintergrundbild (Demo) und Typ „lob“ für positive Meldungen („Was gut läuft“).
alter table public.karten add column bild text;
alter table public.karten drop constraint karten_typ_check;
alter table public.karten add constraint karten_typ_check check (typ in ('aussage', 'meme', 'lob'));
