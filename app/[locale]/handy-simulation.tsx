"use client";

// Startseite: Das Handy ist bedienbar – eine Simulation mit drei Demo-Karten. Nichts wird gespeichert.
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { FeedKarte, Resonanz, Richtung } from "@/lib/feed";
import feedStyles from "./feed/[code]/feed.module.css";
import { AussageKarte, ResonanzSchirm } from "./ich/[code]/app";
import styles from "./page.module.css";

type Sim = { karte: Extract<FeedKarte, { art: "aussage" }>; resonanz: Resonanz };

export function HandySimulation({ karten, demoPfad }: { karten: Sim[]; demoPfad: string }) {
  const t = useTranslations("Home");
  const [index, setIndex] = useState(0);
  const [antwort, setAntwort] = useState<Richtung | null>(null);
  const [runde, setRunde] = useState(0);
  const jetzt = karten[index];

  function weiter() {
    setAntwort(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className={styles.handy}>
      <div className={`${feedStyles.simulation}`}>
        {jetzt ? (
          <>
            <div className={feedStyles.fortschritt} aria-hidden>
              {karten.map((_, i) => (
                <span key={i} data-voll={i < index} data-jetzt={i === index} />
              ))}
            </div>
            <p className={feedStyles.oben}>
              <span>{t("simBereich")}</span>
              <span>{t("simZaehler", { n: index + 1, gesamt: karten.length })}</span>
            </p>
            <AussageKarte
              key={`${runde}-${jetzt.karte.id}`}
              karte={jetzt.karte}
              aktiv={!antwort}
              onAntwort={(r) => {
                setAntwort(r);
                window.setTimeout(weiter, r === "nicht" ? 800 : 1800);
              }}
            />
            {antwort && <ResonanzSchirm phase={{ richtung: antwort, resonanz: jetzt.resonanz }} anrede="du" onWeiter={weiter} />}
          </>
        ) : (
          <div className={feedStyles.simEnde}>
            <p className={feedStyles.simEndeTitel}>{t("simEnde")}</p>
            <p className={feedStyles.leise}>{t("simEndeText")}</p>
            <Link href={demoPfad} className={feedStyles.simEcht}>{t("simEcht")} →</Link>
            <button
              type="button"
              className={feedStyles.simNochmal}
              onClick={() => {
                setIndex(0);
                setRunde((r) => r + 1);
              }}
            >
              {t("simNochmal")}
            </button>
          </div>
        )}
      </div>
      <p className={styles.simHinweis}>{t("simHinweis")}</p>
    </div>
  );
}
