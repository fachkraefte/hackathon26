// Im Browser und auf dem Server nutzbar (keine Server-Abhängigkeiten).

/** Startkarten schreibt die KI (kein Mensch hat das gemeldet) – das steht ehrlich auf der Karte. */
export const istStartKarte = (id: string) => /-s\d+$/.test(id);
