"use client";

// Schieberegler mit festen Stufen. Ist der Wert von der KI vorbelegt, zeigt ein Hinweis
// „aus deiner Erzählung“ – die Person bestätigt nur noch oder schiebt.
import type { ReactNode } from "react";
import styles from "./regler.module.css";

export function StufenRegler<T extends string | number>({
  titel,
  stufen,
  wert,
  setzeWert,
  beschriftung,
  hinweis,
}: {
  titel: string;
  stufen: readonly T[];
  wert: T;
  setzeWert: (wert: T) => void;
  beschriftung: (wert: T) => string;
  hinweis?: ReactNode;
}) {
  const index = Math.max(stufen.indexOf(wert), 0);
  const anteil = stufen.length > 1 ? (index / (stufen.length - 1)) * 100 : 0;

  return (
    <label className={styles.regler}>
      <span className={styles.kopf}>
        <span>{titel}</span>
        <strong className={styles.wert}>{beschriftung(wert)}</strong>
      </span>
      <input
        type="range"
        min={0}
        max={stufen.length - 1}
        step={1}
        value={index}
        style={{ "--anteil": `${anteil}%` }}
        onChange={(e) => setzeWert(stufen[Number(e.target.value)])}
      />
      <span className={styles.enden} aria-hidden>
        <span>{beschriftung(stufen[0])}</span>
        <span>{beschriftung(stufen[stufen.length - 1])}</span>
      </span>
      {hinweis && <span className={styles.hinweis}>{hinweis}</span>}
    </label>
  );
}
