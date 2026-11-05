// Handlungsfeld-Profil (KONZEPT_V3 §5): Achsen = Handlungsfelder, Wert = Ø „Wie sehr bremst dich das?“.
// Je weiter außen, desto stärker bremst das Feld. Ab drei Feldern sinnvoll.
import styles from "./profil.module.css";

export function Profil({ achsen, legende }: { achsen: { name: string; wert: number }[]; legende: string }) {
  if (achsen.length < 3) return null;
  const cx = 230;
  const cy = 200;
  const r = 130;
  const punkt = (i: number, wert: number) => {
    const w = -Math.PI / 2 + (i / achsen.length) * 2 * Math.PI;
    return [cx + Math.cos(w) * r * (wert / 5), cy + Math.sin(w) * r * (wert / 5)] as const;
  };
  const vieleck = (werte: number[]) => werte.map((w, i) => punkt(i, w).join(",")).join(" ");

  return (
    <figure className={styles.profil}>
      <svg viewBox="-120 -10 700 420" role="img" aria-label={legende}>
        {[1, 2, 3, 4, 5].map((s) => (
          <polygon key={s} points={vieleck(achsen.map(() => s))} className={styles.ring} />
        ))}
        {achsen.map((_, i) => {
          const [x, y] = punkt(i, 5);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className={styles.ring} />;
        })}
        <polygon points={vieleck(achsen.map((a) => a.wert))} className={styles.flaeche} />
        {achsen.map((a, i) => {
          const [x, y] = punkt(i, 5.9);
          return (
            <text key={a.name} x={x} y={y} textAnchor={x < cx - 10 ? "end" : x > cx + 10 ? "start" : "middle"} className={styles.text}>
              {a.name} <tspan className={styles.wert}>{a.wert.toLocaleString("de-DE", { maximumFractionDigits: 1 })}</tspan>
            </text>
          );
        })}
      </svg>
      <figcaption className="leise klein">{legende}</figcaption>
    </figure>
  );
}
