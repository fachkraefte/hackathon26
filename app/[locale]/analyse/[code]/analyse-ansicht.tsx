"use client";

// Befund: Was im Betrieb hakt – klar, visuell, ohne Lösungen (die kommen auf der nächsten Seite).
// Alle Zahlen und Erkenntnisse rechnet der Code aus den Stimmen; die KI erfindet hier nichts.
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AnalyseDaten } from "@/lib/analyse";
import { zahlenFormat } from "@/lib/rechnen";
import { UebergabeKarte } from "../../_komponenten/uebergabe-karte";
import styles from "./befund.module.css";

type Daten = Omit<AnalyseDaten, "loesungen">;

/** Stärkste Übergabe je Handlungsfeld aus der Übergabe-Karte. */
function uebergabeFuer(d: Daten, fadenId: string) {
  const k = d.karte.kanten.filter((x) => x.fadenIds.includes(fadenId)).sort((a, b) => b.stimmen - a.stimmen)[0];
  return k ? { von: k.von, an: k.an, zwischen: k.von !== k.an } : null;
}

export function AnalyseAnsicht({ daten: d }: { daten: Daten }) {
  const locale = useLocale();
  const { formatStunden, formatEuro } = zahlenFormat(locale);
  const zitat = (x: string) => (locale === "en" ? `“${x}”` : `„${x}“`);
  const t = useTranslations("Befund");
  const ta = useTranslations("Analyse");
  const faeden = d.faeden.filter((f) => f.personen > 0).sort((a, b) => b.stunden - a.stunden || b.personen - a.personen);
  const max = Math.max(...faeden.map((f) => f.stunden), 0.1);
  const gesamt = d.summe.stunden || 0.1;

  // ---------- Erkenntnisse aus den Zahlen ----------
  const mitUebergabe = faeden.map((f) => ({ f, u: uebergabeFuer(d, f.id) }));
  const zwischen = mitUebergabe.filter((x) => x.u?.zwischen).length;
  const top2 = faeden.slice(0, 2).reduce((s, f) => s + f.stunden, 0);
  const staerksteKante = [...d.karte.kanten].filter((k) => k.von !== k.an).sort((a, b) => b.stimmen - a.stimmen)[0];
  const mehrereBereiche = faeden.filter((f) => f.bereiche >= 2).length;
  const groesstes = faeden[0];

  return (
    <div className={styles.befund}>
      {/* ---------- Kopf ---------- */}
      <header className={styles.kopf}>
        <p className={styles.ueber}>{t("ueber", { betrieb: d.betrieb })}</p>
        <h1 className={styles.satz}>
          {t.rich("satz", {
            h: formatStunden(d.summe.stunden),
            n: faeden.filter((f) => f.stunden > 0).length,
            z: (c) => <span className={styles.markiert}>{c}</span>,
          })}
        </h1>
        <p className={styles.unter}>
          {t("unter", { euro: formatEuro(d.summe.euro), stimmen: d.teilgenommen, von: d.mitarbeitende })}
        </p>
      </header>

      {/* ---------- Die Probleme ---------- */}
      <section>
        <h2 className={styles.h2}>{t("problemeTitel")}</h2>
        <ol className={styles.probleme}>
          {mitUebergabe.map(({ f, u }, i) => (
            <li key={f.id}>
              <details className={styles.problem}>
                <summary>
                  <span className={styles.rang}>{i + 1}</span>
                  <span className={styles.problemKopf}>
                    <span className={styles.name}>{f.kurzname}</span>
                    <span className={styles.problemSatz}>{f.problem}</span>
                    <span className={styles.meta}>
                      {u && <span className={styles.chip}>{u.zwischen ? `${u.von} → ${u.an}` : t("innerhalb", { bereich: u.von })}</span>}
                      <span className={styles.punkte} aria-label={t("stimmen", { n: f.personen })}>
                        {Array.from({ length: Math.min(f.personen, 12) }, (_, j) => <span key={j} />)}
                      </span>
                      <span>{t("stimmen", { n: f.personen })}</span>
                    </span>
                  </span>
                  <span className={styles.zahl}>
                    <strong>{f.stunden > 0 ? formatStunden(f.stunden) : "–"}</strong>
                    <span>{f.stunden > 0 ? t("stdWoche") : t("ohneZeit")}</span>
                  </span>
                  <span className={styles.balken} style={{ width: `${Math.max(4, (f.stunden / max) * 100)}%` }} aria-hidden />
                </summary>
                <div className={styles.sichtweisen}>
                  <p className={styles.sichtTitel}>{t("sichtweisen")}</p>
                  {f.sichtweisen.map((s) => (
                    <blockquote key={s.bereich + s.aussage}>
                      <span>{s.bereich}</span>{zitat(s.aussage)}
                    </blockquote>
                  ))}
                  {f.unterschied && <p className={styles.unterschied}>{f.unterschied}</p>}
                  <p className={styles.leise}>
                    {t("detailZahlen", { euro: formatEuro(f.euro), bereiche: f.bereiche })}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Was daraus folgt ---------- */}
      <section className={styles.folgt}>
        <h2 className={styles.h2}>{t("folgtTitel")}</h2>
        <div className={styles.spalten}>
          <div>
            <h3>{t("fuerTeam")}</h3>
            <ul>
              <li>{t("teamNichtAllein", { n: mehrereBereiche, gesamt: faeden.length })}</li>
              <li>{t("teamUebergaben", { n: zwischen, gesamt: faeden.length })}</li>
              <li>{t("teamWeiter")}</li>
            </ul>
          </div>
          <div>
            <h3>{t("fuerLeitung")}</h3>
            <ul>
              {groesstes && (
                <li>{t("leitungHebel", { name: groesstes.kurzname, h: formatStunden(groesstes.stunden), p: Math.round((groesstes.stunden / gesamt) * 100) })}</li>
              )}
              {faeden.length > 2 && <li>{t("leitungTop2", { p: Math.round((top2 / gesamt) * 100) })}</li>}
              {staerksteKante && (
                <li>{t("leitungKante", { von: staerksteKante.von, an: staerksteKante.an, n: staerksteKante.stimmen })}</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Wo es zwischen Bereichen hakt ---------- */}
      <section>
        <h2 className={styles.h2}>{t("karteTitel")}</h2>
        <p className={styles.leise}>{t("karteText")}</p>
        <div className={styles.karte}>
          <UebergabeKarte
            zeichnen
            karte={d.karte}
            beschriftung={{
              stimmen: (n) => ta("stimmen", { n }),
              legende: {
                laeuft: ta("legendeLaeuft"),
                reibung: ta("legendeReibung"),
                bruch: ta("legendeBruch"),
                loesung: "",
                hinweis: t("karteHinweis"),
              },
            }}
          />
        </div>
      </section>

      {d.staerken.length + d.lob.length > 0 && (
        <section>
          <h2 className={styles.h2}>{t("staerkenTitel")}</h2>
          <ul className={styles.staerken}>
            {[...d.lob, ...d.staerken].map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}

      {/* ---------- Weiter ---------- */}
      <section className={styles.weiter}>
        <p>{t("weiterText")}</p>
        <Link href={`/loesungen/${d.code}`} className={styles.weiterKnopf}>{t("weiterKnopf")} →</Link>
      </section>
    </div>
  );
}
