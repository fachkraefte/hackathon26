"use client";

import { useTranslations } from "next-intl";
import { Children, useEffect, useState, type ReactNode } from "react";
import styles from "./praesentation.module.css";

/** Foliensteuerung: Pfeiltasten, Leertaste oder Knöpfe. Die Folien kommen fertig vom Server. */
export function Folien({ children }: { children: ReactNode }) {
  const t = useTranslations("Praesentation");
  const folien = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const letzte = folien.length - 1;

  useEffect(() => {
    function taste(event: KeyboardEvent) {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        setIndex((i) => Math.min(i + 1, letzte));
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, [letzte]);

  return (
    <div className={styles.buehne}>
      <div className={styles.folie} key={index}>
        {folien[index]}
      </div>
      <div className={styles.steuerung}>
        <button type="button" className="button button--ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ←
        </button>
        <div className={styles.punkte} role="tablist" aria-label={t("folien")}>
          {folien.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={t("folieNr", { nr: i + 1 })}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className="button button--ghost" disabled={index === letzte} onClick={() => setIndex(index + 1)}>
          →
        </button>
      </div>
      <p className={`leise klein ${styles.tastenHinweis}`}>{t("tasten", { nr: index + 1, gesamt: folien.length })}</p>
    </div>
  );
}
