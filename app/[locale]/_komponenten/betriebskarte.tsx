// Betriebskarte: Bereiche als Knoten, Themen als Verbindungen zwischen den betroffenen Bereichen.
// Alles wird aus Gesamtbild-Daten abgeleitet, nichts ist von Hand platziert.
import { useTranslations } from "next-intl";
import type { Thema } from "@/lib/typen";
import styles from "./betriebskarte.module.css";

export type KartenBereich = { id: string; name: string; antworten: number; erwartet: number };

const KREIS = 125;

function position(index: number, anzahl: number) {
  const winkel = ((-135 + (index * 360) / anzahl) * Math.PI) / 180;
  return { x: Math.cos(winkel) * KREIS, y: Math.sin(winkel) * KREIS };
}

export function Betriebskarte({ themen, bereiche }: { themen: Thema[]; bereiche: KartenBereich[] }) {
  const t = useTranslations("Ergebnis");
  // Reihenfolge auf dem Kreis: wie die Bereiche in den Themen vorkommen (Schnittstellen zuerst),
  // so laufen Ketten außen herum und Linien kreuzen sich seltener.
  const reihenfolge = [
    ...new Set([
      ...themen.filter((th) => th.istSchnittstelle).flatMap((th) => th.bereiche),
      ...themen.flatMap((th) => th.bereiche),
      ...bereiche.map((b) => b.id),
    ]),
  ].filter((id) => bereiche.some((b) => b.id === id));
  const pos = new Map(reihenfolge.map((id, i) => [id, position(i, reihenfolge.length)]));

  // Kanten: aufeinanderfolgende Bereiche eines Themas. Gleiche Paare werden aufgefächert.
  const kanten = themen.flatMap((thema, themaIndex) =>
    thema.bereiche.slice(1).map((ziel, i) => ({
      thema,
      nummer: themaIndex + 1,
      von: thema.bereiche[i],
      an: ziel,
    })),
  );
  const paarZaehler = new Map<string, number>();
  const paarGesamt = new Map<string, number>();
  for (const k of kanten) {
    const schluessel = [k.von, k.an].sort().join("|");
    paarGesamt.set(schluessel, (paarGesamt.get(schluessel) ?? 0) + 1);
  }

  const maxAntworten = Math.max(...bereiche.map((b) => b.erwartet));

  return (
    <figure className={styles.karte}>
      <svg viewBox="-210 -175 420 350" role="img" aria-label={t("karteAria")}>
        {kanten.map((k) => {
          // Richtung fest nach Paar sortieren, damit sich der Versatz nicht umkehrt.
          const [erster, zweiter] = [k.von, k.an].sort();
          const a = pos.get(erster);
          const b = pos.get(zweiter);
          if (!a || !b) return null;
          const schluessel = `${erster}|${zweiter}`;
          const nr = paarZaehler.get(schluessel) ?? 0;
          paarZaehler.set(schluessel, nr + 1);
          const versatz = (nr - ((paarGesamt.get(schluessel) ?? 1) - 1) / 2) * 46;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const laenge = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const nx = -(b.y - a.y) / laenge;
          const ny = (b.x - a.x) / laenge;
          const cx = mx + nx * versatz * 2;
          const cy = my + ny * versatz * 2;
          // Mittelpunkt der quadratischen Kurve
          const lx = 0.25 * a.x + 0.5 * cx + 0.25 * b.x;
          const ly = 0.25 * a.y + 0.5 * cy + 0.25 * b.y;
          const breite = 2 + (k.thema.stundenProWoche ?? 0) * 0.55;

          return (
            <g key={`${k.thema.id}-${k.von}-${k.an}`}>
              <path
                d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                className={k.thema.istSchnittstelle ? styles.schnittstelle : styles.verbindung}
                strokeWidth={breite}
              />
              <circle cx={lx} cy={ly} r={11} className={k.thema.istSchnittstelle ? styles.nrSchnitt : styles.nr} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" className={styles.nrText}>
                {k.nummer}
              </text>
            </g>
          );
        })}

        {bereiche.map((b) => {
          const p = pos.get(b.id);
          if (!p) return null;
          const r = 22 + (b.erwartet / maxAntworten) * 18;
          const anteil = b.antworten / b.erwartet;
          const umfang = 2 * Math.PI * (r + 5);
          return (
            <g key={b.id}>
              <circle cx={p.x} cy={p.y} r={r + 5} className={styles.ringHinten} />
              <circle
                cx={p.x}
                cy={p.y}
                r={r + 5}
                className={styles.ringVorne}
                strokeDasharray={`${umfang * anteil} ${umfang}`}
                transform={`rotate(-90 ${p.x} ${p.y})`}
              />
              <circle cx={p.x} cy={p.y} r={r} className={styles.knoten} />
              <text x={p.x} y={p.y - 4} textAnchor="middle" className={styles.knotenName}>
                {b.name}
              </text>
              <text x={p.x} y={p.y + 11} textAnchor="middle" className={styles.knotenZahl}>
                {b.antworten}/{b.erwartet}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className={styles.legende}>
        <span><i className={styles.legSchnitt} /> {t("legendeSchnittstelle")}</span>
        <span><i className={styles.legVerbindung} /> {t("legendeGemeinsam")}</span>
        <span className="leise">{t("legendeBreite")}</span>
      </figcaption>
    </figure>
  );
}

/** Kette der Übergaben: hängt Schnittstellen-Themen aneinander, deren Ende und Anfang zusammenpassen. */
export function UebergabeKette({ themen, namen }: { themen: Thema[]; namen: Record<string, string> }) {
  const t = useTranslations("Ergebnis");
  const schnittstellen = themen.filter((th) => th.istSchnittstelle && th.bereiche.length > 1);
  const start = schnittstellen[0];
  if (!start) return null;

  const glieder: { bereich: string; thema?: Thema }[] = start.bereiche.map((b, i) => ({
    bereich: b,
    thema: i < start.bereiche.length - 1 ? start : undefined,
  }));
  const rest = schnittstellen.slice(1);
  let weiter = true;
  while (weiter) {
    weiter = false;
    const ende = glieder[glieder.length - 1];
    const naechstes = rest.find((th) => th.bereiche[0] === ende.bereich);
    if (naechstes) {
      rest.splice(rest.indexOf(naechstes), 1);
      ende.thema = naechstes;
      naechstes.bereiche.slice(1).forEach((b, i, arr) =>
        glieder.push({ bereich: b, thema: i < arr.length - 1 ? naechstes : undefined }),
      );
      weiter = true;
    }
  }

  return (
    <ol className={styles.kette} aria-label={t("ketteAria")}>
      {glieder.map((glied, i) => (
        <li key={`${glied.bereich}-${i}`}>
          <span className={styles.kettenGlied}>{namen[glied.bereich] ?? glied.bereich}</span>
          {glied.thema && (
            <span className={styles.kettenPfeil}>
              {/* Titel nur beim ersten Abschnitt eines Themas */}
              <span>{glieder[i - 1]?.thema?.id === glied.thema.id ? "" : glied.thema.titel}</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
