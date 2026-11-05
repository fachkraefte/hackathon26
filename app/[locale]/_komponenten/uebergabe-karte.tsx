"use client";

// Übergabe-Karte (KONZEPT_V3 §5/§6): Bereiche als Knoten, Bruchstellen als Linien.
// Modus „heute“: Farbe und Stärke nach Zahl der Stimmen. Modus „loesungen“: Linien mit Lösung werden türkis.
import type { Karte, KartenKante } from "@/lib/karte";
import styles from "./uebergabe-karte.module.css";

const R = 50;
const FARBE = { grau: "rgba(21,38,62,0.35)", orange: "#F08119", rot: "#D9480F", tuerkis: "#2FB9CB" };

type Props = {
  karte: Karte;
  modus?: "heute" | "loesungen";
  loesungen?: Record<string, string>; // Faden-ID → Name der Lösung
  gewaehlt?: number | null;
  waehle?: (index: number | null) => void;
  beschriftung: { stimmen: (n: number) => string; legende: { laeuft: string; reibung: string; bruch: string; loesung: string; hinweis: string } };
};

export function UebergabeKarte({ karte, modus = "heute", loesungen = {}, gewaehlt = null, waehle, beschriftung }: Props) {
  const pos = new Map(karte.knoten.map((k) => [k.name, k]));
  const farbe = (k: KartenKante) => {
    if (modus === "loesungen") return k.fadenIds.some((id) => loesungen[id]) ? FARBE.tuerkis : FARBE.grau;
    return k.stimmen >= 3 ? FARBE.rot : k.stimmen === 2 ? FARBE.orange : FARBE.grau;
  };
  const breite = (k: KartenKante) => 2 + 2.2 * Math.min(k.stimmen, 4);

  return (
    <figure className={styles.karte}>
      <svg viewBox={`0 0 ${karte.breite} ${karte.hoehe}`} role="img" aria-label={beschriftung.legende.hinweis}>
        <defs>
          {Object.entries(FARBE).map(([name, f]) => (
            <marker key={name} id={`pfeil-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill={f} />
            </marker>
          ))}
        </defs>

        {karte.kanten.map((k, i) => {
          const a = pos.get(k.von);
          const z = pos.get(k.an);
          if (!a || !z) return null;
          const f = farbe(k);
          const marker = `url(#pfeil-${Object.entries(FARBE).find(([, wert]) => wert === f)?.[0] ?? "grau"})`;
          const { d, lx, ly } = k.von === k.an ? schleife(a.x, a.y) : bogen(a.x, a.y, z.x, z.y);
          const aktiv = gewaehlt === i;
          const loesung = modus === "loesungen" ? k.fadenIds.map((id) => loesungen[id]).find(Boolean) : undefined;
          const zeigeText = aktiv || k.stimmen >= 2 || Boolean(loesung);
          return (
            <g
              key={`${k.von}-${k.an}`}
              className={styles.kante}
              role="button"
              tabIndex={0}
              aria-pressed={aktiv}
              aria-label={`${k.von} → ${k.an}: ${k.kurznamen.join(", ")}, ${beschriftung.stimmen(k.stimmen)}`}
              onClick={() => waehle?.(aktiv ? null : i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && waehle?.(aktiv ? null : i)}
            >
              <path d={d} fill="none" stroke="transparent" strokeWidth={22} />
              <path
                d={d}
                fill="none"
                stroke={f}
                strokeWidth={breite(k) + (aktiv ? 2 : 0)}
                strokeLinecap="round"
                markerEnd={k.von === k.an ? undefined : marker}
                className={styles.linie}
              />
              {zeigeText && (
                <text x={lx} y={ly} textAnchor="middle" className={styles.kantenText}>
                  <tspan x={lx} className={styles.kantenTitel}>{loesung ?? k.kurznamen.slice(0, 2).join(" · ")}</tspan>
                  {!loesung && <tspan x={lx} dy="1.2em" className={styles.leise}>{beschriftung.stimmen(k.stimmen)}</tspan>}
                </text>
              )}
            </g>
          );
        })}

        {karte.knoten.map((k) => (
          <g key={k.name}>
            <circle cx={k.x} cy={k.y} r={R} className={k.extern ? styles.extern : styles.knoten} />
            <text x={k.x} y={k.y} textAnchor="middle" className={styles.knotenText}>
              {zeilen(k.name).map((z, i, alle) => (
                <tspan key={i} x={k.x} dy={i === 0 ? `${0.35 - (alle.length - 1) * 0.55}em` : "1.1em"}>{z}</tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className={styles.legende}>
        {modus === "heute" ? (
          <>
            <span><i style={{ background: FARBE.grau, height: 2 }} />{beschriftung.legende.laeuft}</span>
            <span><i style={{ background: FARBE.orange }} />{beschriftung.legende.reibung}</span>
            <span><i style={{ background: FARBE.rot, height: 8 }} />{beschriftung.legende.bruch}</span>
          </>
        ) : (
          <span><i style={{ background: FARBE.tuerkis }} />{beschriftung.legende.loesung}</span>
        )}
        <span className={styles.hinweis}>{beschriftung.legende.hinweis}</span>
      </figcaption>
    </figure>
  );
}

/** Leicht gebogene Linie von Rand zu Rand; Gegenrichtungen liegen dadurch nebeneinander. */
function bogen(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const laenge = Math.hypot(dx, dy) || 1;
  const nx = -dy / laenge;
  const ny = dx / laenge;
  const versatz = laenge * 0.12;
  const mx = (x1 + x2) / 2 + nx * versatz;
  const my = (y1 + y2) / 2 + ny * versatz;
  // Start und Ende am Kreisrand (mit Platz für den Pfeil)
  const sx = x1 + ((mx - x1) / Math.hypot(mx - x1, my - y1)) * (R + 2);
  const sy = y1 + ((my - y1) / Math.hypot(mx - x1, my - y1)) * (R + 2);
  const ex = x2 + ((mx - x2) / Math.hypot(mx - x2, my - y2)) * (R + 8);
  const ey = y2 + ((my - y2) / Math.hypot(mx - x2, my - y2)) * (R + 8);
  // Beschriftung: Punkt auf der Kurve (t = 0,5), etwas nach außen versetzt
  const lx = 0.25 * sx + 0.5 * mx + 0.25 * ex + nx * 14;
  const ly = 0.25 * sy + 0.5 * my + 0.25 * ey + ny * 14;
  // Gerundet, damit Server und Browser exakt dieselben Werte rendern (sonst Hydration-Fehler).
  const r = (n: number) => Math.round(n * 10) / 10;
  return { d: `M${r(sx)},${r(sy)} Q${r(mx)},${r(my)} ${r(ex)},${r(ey)}`, lx: Math.round(lx), ly: Math.round(ly) };
}

/** Schleife über dem Knoten: Problem innerhalb eines Bereichs. */
function schleife(x: number, y: number) {
  const oben = y - R;
  return {
    d: `M${x - 16},${oben + 4} C${x - 50},${oben - 62} ${x + 50},${oben - 62} ${x + 16},${oben + 4}`,
    lx: x,
    ly: oben - 58,
  };
}

/** Knotennamen auf höchstens zwei Zeilen verteilen. */
function zeilen(name: string): string[] {
  if (name.length <= 11) return [name];
  const leer = name.indexOf(" ");
  if (leer > 0) return [name.slice(0, leer), name.slice(leer + 1)];
  const mitte = Math.ceil(name.length / 2);
  return [`${name.slice(0, mitte)}-`, name.slice(mitte)];
}
