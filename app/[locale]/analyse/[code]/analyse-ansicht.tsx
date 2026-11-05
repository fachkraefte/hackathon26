"use client";

// Analyse (KONZEPT_V3 §5): nur Probleme. Erster Blick: Kernzahl, Übergabe-Karte, Top 3, Mitsprache.
// Zweiter Blick: alle Handlungsfelder mit Sichtweisen, Profil, Stärken.
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AnalyseDaten } from "@/lib/analyse";
import { formatEuro, formatStunden } from "@/lib/rechnen";
import { Profil } from "../../_komponenten/profil";
import { UebergabeKarte } from "../../_komponenten/uebergabe-karte";
import styles from "./analyse.module.css";

export function AnalyseAnsicht({ daten }: { daten: Omit<AnalyseDaten, "loesungen"> }) {
  const t = useTranslations("Analyse");
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const kante = gewaehlt !== null ? daten.karte.kanten[gewaehlt] : null;
  const stelle = Math.round((daten.summe.stunden / 40) * 100);

  if (daten.faeden.length === 0) {
    return (
      <section className={styles.leer}>
        <p className="ueberzeile">{daten.betrieb}</p>
        <h1>{t("leerTitel")}</h1>
        <p className="leise">{t("teilgenommen", { n: daten.teilgenommen, gesamt: daten.mitarbeitende })}</p>
        <Link className="button" href={`/befragung/${daten.code}`}>{t("mitmachen")}</Link>
      </section>
    );
  }

  return (
    <div className={styles.analyse}>
      <header className={styles.kopf}>
        <p className="ueberzeile">{daten.betrieb} · {t("ueberzeile")}</p>
        <h1>{t("titel")}</h1>
        <p className="leise">
          {t("teilgenommen", { n: daten.teilgenommen, gesamt: daten.mitarbeitende })} · {t("deadline", { deadline: daten.deadline })}
        </p>
      </header>

      {/* ---------- Erster Blick ---------- */}
      <section className={styles.kernzahl}>
        <p className={styles.gross}>
          <strong>{formatStunden(daten.summe.stunden)}</strong> {t("stundenProWoche")}
        </p>
        <p>
          {t("kernzahlText", { euro: formatEuro(daten.summe.euro), anteil: stelle })}
        </p>
        <p className="leise klein">{t("ausSchaetzungen", { n: daten.summe.schaetzungen })}</p>
      </section>

      <section className={styles.abschnitt}>
        <h2>{t("karteTitel")}</h2>
        <p className="leise">{t("karteText")}</p>
        <UebergabeKarte
          karte={daten.karte}
          gewaehlt={gewaehlt}
          waehle={setGewaehlt}
          beschriftung={{
            stimmen: (n) => t("stimmen", { n }),
            legende: {
              laeuft: t("legendeLaeuft"),
              reibung: t("legendeReibung"),
              bruch: t("legendeBruch"),
              loesung: "",
              hinweis: t("legendeHinweis"),
            },
          }}
        />
        {kante && (
          <div className={`karte ${styles.kantenDetail}`} aria-live="polite">
            <p className={styles.kantenKopf}>
              {kante.von === kante.an ? t("innerhalb", { bereich: kante.von }) : `${kante.von} → ${kante.an}`} · {kante.kurznamen.join(", ")}
            </p>
            <ul>
              {kante.titel.map((titel, i) => <li key={i}>{titel}</li>)}
            </ul>
          </div>
        )}
      </section>

      <section className={styles.abschnitt}>
        <h2>{t("topTitel")}</h2>
        <div className={styles.kacheln}>
          {daten.faeden.slice(0, 3).map((f, i) => (
            <article key={f.id} className={styles.kachel}>
              <p className={styles.rang}>{i + 1}</p>
              <h3>{f.kurzname}</h3>
              <p>{f.aufgabe}</p>
              <p className={styles.zahlen}>
                {f.stunden > 0 ? (
                  <>
                    <strong>{t("proWoche", { h: formatStunden(f.stunden) })}</strong> · {formatEuro(f.euro)} {t("imJahr")}
                  </>
                ) : (
                  <strong>{t("belastungOhneZeit")}</strong>
                )}
              </p>
              <p className="leise klein">{t("stimmenAus", { n: f.personen, bereiche: f.bereiche })}</p>
            </article>
          ))}
        </div>
      </section>

      {daten.mitsprache !== null && (
        <section className={`${styles.abschnitt} ${styles.mitsprache}`}>
          <p className={styles.mitspracheZahl}>
            {daten.mitsprache.toLocaleString("de-DE", { maximumFractionDigits: 1 })}
            <span> / 5</span>
          </p>
          <div>
            <h2>{t("mitspracheTitel")}</h2>
            <p className="leise">„{t("mitspracheAussage")}“</p>
          </div>
        </section>
      )}

      {/* ---------- Zweiter Blick ---------- */}
      <details className={styles.tiefe}>
        <summary>{t("tiefeTitel")}</summary>
        {daten.faeden.map((f) => (
          <article key={f.id} className={styles.feld}>
            <h3>
              {f.kurzname}
              <span className="leise klein">
                {f.stunden > 0 ? ` · ${t("proWoche", { h: formatStunden(f.stunden) })} · ${formatEuro(f.euro)} ${t("imJahr")}` : ""}
                {f.bremst !== null ? ` · ${t("bremstWert", { w: f.bremst.toLocaleString("de-DE", { maximumFractionDigits: 1 }) })}` : ""}
              </span>
            </h3>
            <p className={styles.aufgabe}>{f.aufgabe}</p>
            <p>{f.problem}</p>
            <ul className={styles.stimmen}>
              {f.sichtweisen.map((s) => (
                <li key={s.bereich + s.aussage}>
                  <span className={styles.bereich}>{s.bereich}</span> „{s.aussage}“
                </li>
              ))}
            </ul>
            {f.unterschied && <p className={styles.unterschied}><strong>{t("unterschied")}</strong> {f.unterschied}</p>}
          </article>
        ))}
        <Profil
          achsen={daten.faeden.filter((f) => f.bremst !== null).map((f) => ({ name: f.kurzname, wert: f.bremst ?? 0 }))}
          legende={t("profilLegende")}
        />
        {daten.staerken.length > 0 && (
          <div className={styles.staerken}>
            <h3>{t("staerkenTitel")}</h3>
            <ul>{daten.staerken.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        )}
      </details>

      <section className={styles.weiter}>
        <p>{t("weiterText")}</p>
        <Link className="button" href={`/loesungen/${daten.code}`}>{t("weiter")} →</Link>
      </section>
      {daten.ausDemo && <p className="leise klein">{t("demoHinweis")}</p>}
    </div>
  );
}
