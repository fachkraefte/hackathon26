// Profildiagramm Ist → Ziel. Zwei Darstellungen, weil die Wahl laut PROJEKT.md §7 noch offen ist.
import { useTranslations } from "next-intl";
import { dimensionen, type Dimension } from "@/lib/typen";
import styles from "./profildiagramm.module.css";

export type ProfilPunkt = { dimension: Dimension; ist: number; ziel?: number };

const R = 110; // Radius für den Wert 5

function punkt(index: number, wert: number) {
  const winkel = ((-90 + index * 60) * Math.PI) / 180;
  const r = (R * wert) / 5;
  return { x: Math.cos(winkel) * r, y: Math.sin(winkel) * r, winkel };
}

function polygon(werte: number[]) {
  return werte.map((wert, i) => {
    const p = punkt(i, wert);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

export function Profildiagramm({
  punkte,
  art,
  istLabel,
}: {
  punkte: ProfilPunkt[];
  art: "netz" | "balken";
  istLabel?: string;
}) {
  const t = useTranslations("Begriffe");
  const geordnet = dimensionen.map((d) => punkte.find((p) => p.dimension === d) ?? { dimension: d, ist: 0 });
  const hatZiel = geordnet.some((p) => p.ziel !== undefined);

  if (art === "balken") {
    return (
      <div className={styles.balken} role="img" aria-label={t("profilAria")}>
        {geordnet.map((p) => (
          <div key={p.dimension} className={styles.zeile}>
            <span className={styles.label}>{t(`dimension.${p.dimension}`)}</span>
            <div className={styles.spur}>
              {[1, 2, 3, 4, 5].map((stufe) => (
                <span key={stufe} className={styles.strich} style={{ left: `${(stufe / 5) * 100}%` }} />
              ))}
              <span className={styles.ist} style={{ width: `${(p.ist / 5) * 100}%` }} />
              {p.ziel !== undefined && (
                <span className={styles.ziel} style={{ left: `${(p.ziel / 5) * 100}%` }} />
              )}
            </div>
            <span className={styles.wert}>
              {p.ist.toLocaleString("de-DE")}
              {p.ziel !== undefined && <span className={styles.zielwert}> → {p.ziel}</span>}
            </span>
          </div>
        ))}
        <Legende hatZiel={hatZiel} istLabel={istLabel} />
      </div>
    );
  }

  return (
    <figure className={styles.netz}>
      <svg viewBox="-190 -150 380 300" role="img" aria-label={t("profilAria")}>
        {[1, 2, 3, 4, 5].map((stufe) => (
          <polygon key={stufe} points={polygon(dimensionen.map(() => stufe))} className={styles.ring} />
        ))}
        {geordnet.map((p, i) => {
          const aussen = punkt(i, 5);
          const label = punkt(i, 6.1);
          const anker = Math.abs(label.x) < 5 ? "middle" : label.x > 0 ? "start" : "end";
          return (
            <g key={p.dimension}>
              <line x1={0} y1={0} x2={aussen.x} y2={aussen.y} className={styles.achse} />
              <text x={label.x} y={label.y} textAnchor={anker} dominantBaseline="middle" className={styles.achsentext}>
                {t(`dimensionKurz.${p.dimension}`)}
              </text>
            </g>
          );
        })}
        {hatZiel && (
          <polygon points={polygon(geordnet.map((p) => p.ziel ?? p.ist))} className={styles.zielflaeche} />
        )}
        <polygon points={polygon(geordnet.map((p) => p.ist))} className={styles.istflaeche} />
        {geordnet.map((p, i) => {
          const q = punkt(i, p.ist);
          return (
            <g key={p.dimension}>
              <circle cx={q.x} cy={q.y} r={4} className={styles.istpunkt} />
              <text x={q.x} y={q.y - 9} textAnchor="middle" className={styles.punkttext}>
                {p.ist.toLocaleString("de-DE")}
              </text>
            </g>
          );
        })}
      </svg>
      <Legende hatZiel={hatZiel} istLabel={istLabel} />
    </figure>
  );
}

function Legende({ hatZiel, istLabel }: { hatZiel: boolean; istLabel?: string }) {
  const t = useTranslations("Profil");
  return (
    <p className={styles.legende}>
      <span><i className={styles.legendeIst} /> {istLabel ?? t("ist")}</span>
      {hatZiel && <span><i className={styles.legendeZiel} /> {t("ziel")}</span>}
      <span className="leise">{t("skala")}</span>
    </p>
  );
}
