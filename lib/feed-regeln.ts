// Im Browser und auf dem Server nutzbar (keine Server-Abhängigkeiten).

/** Startkarten schreibt die KI (kein Mensch hat das gemeldet) – das steht ehrlich auf der Karte. */
export const istStartKarte = (id: string) => /-s\d+$/.test(id);

/** Eine Person = ihr persönlicher Code: Feed-Stimmen („feed-CODE“) und Meldungen („feed-CODE-m…“) zählen zusammen. */
export const personVon = (beitragId: string) => beitragId.match(/^(feed-[A-Z0-9]+)(-m[a-z0-9]+)?$/)?.[1] ?? beitragId;
