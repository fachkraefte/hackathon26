-- Feed: Eine Sitzung ist ein Beitrag, jede bestätigte Karte ein Punkt (bis zu 12, wie in lib/typen.ts).
alter table public.beitraege drop constraint beitraege_punkte_check;
alter table public.beitraege add constraint beitraege_punkte_check
  check (jsonb_typeof(punkte) = 'array' and jsonb_array_length(punkte) between 1 and 12);
