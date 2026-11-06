"use client";

// Lösungen (KONZEPT_V3 §6). Erster Blick: Übergabe-Karte mit Umschalter heute / mit Lösungen, Kacheln.
// Zweiter Blick je Lösung: So läuft es · Was es braucht · KI-Kniff · Zeit frei · Reife/Herkunft/Testlauf · Bauplan-Prompt.
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { AnalyseDaten } from "@/lib/analyse";
import { setzeTest } from "@/lib/feed-aktionen";
import { formatEuro, formatStunden } from "@/lib/rechnen";
import type { Loesung } from "@/lib/typen";
import { UebergabeKarte } from "../../_komponenten/uebergabe-karte";
import styles from "./loesungen.module.css";

const ANNAHMEN = [20, 30, 40, 50, 60, 70] as const;

export function LoesungenAnsicht({ daten, loesungen, testetAnfang }: { daten: AnalyseDaten; loesungen: Record<string, Loesung>; testetAnfang: string[] }) {
  const t = useTranslations("Loesungen");
  const tb = useTranslations("Begriffe");
  const [modus, setModus] = useState<"heute" | "loesungen">("heute");
  const [offen, setOffen] = useState<string | null>(null);
  const [annahme, setAnnahme] = useState<(typeof ANNAHMEN)[number]>(50);
  const [kopiert, setKopiert] = useState<string | null>(null);
  const [testet, setTestet] = useState<string[]>(testetAnfang);

  // Der Wow-Moment: kurz das Heute zeigen, dann auf „mit Lösungen“ umschalten.
  useEffect(() => {
    const zeit = window.setTimeout(() => setModus("loesungen"), 1400);
    return () => window.clearTimeout(zeit);
  }, []);

  const namen = Object.fromEntries(Object.entries(loesungen).map(([id, l]) => [id, l.name]));
  const mitLoesung = daten.faeden.filter((f) => loesungen[f.id]);
  const zurueckStunden = mitLoesung.reduce((s, f) => s + f.stunden, 0) * (annahme / 100);
  const zurueckEuro = mitLoesung.reduce((s, f) => s + f.euro, 0) * (annahme / 100);

  return (
    <div className={styles.loesungen}>
      <header className={styles.kopf}>
        <p className="ueberzeile">{daten.betrieb} · {t("ueberzeile")}</p>
        <h1>{t("titel")}</h1>
        <p className="leise">{t("einleitung")}</p>
      </header>

      {/* ---------- Erster Blick ---------- */}
      <section>
        <div className={styles.umschalter} role="group" aria-label={t("umschalterLabel")}>
          <button type="button" aria-pressed={modus === "heute"} onClick={() => setModus("heute")}>{t("heute")}</button>
          <button type="button" aria-pressed={modus === "loesungen"} onClick={() => setModus("loesungen")}>{t("mitLoesungen")}</button>
        </div>
        <UebergabeKarte
          karte={daten.karte}
          modus={modus}
          loesungen={namen}
          beschriftung={{
            stimmen: (n) => t("stimmen", { n }),
            legende: {
              laeuft: t("legendeLaeuft"),
              reibung: t("legendeReibung"),
              bruch: t("legendeBruch"),
              loesung: t("legendeLoesung"),
              hinweis: t("legendeHinweis"),
            },
          }}
        />
      </section>

      <section className={styles.kacheln}>
        {mitLoesung.map((f) => {
          const l = loesungen[f.id];
          return (
            <button
              key={f.id}
              type="button"
              className={styles.kachel}
              aria-expanded={offen === f.id}
              onClick={() => {
                setOffen(offen === f.id ? null : f.id);
                window.setTimeout(() => document.getElementById(`loesung-${f.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }}
            >
              <span className={styles.feldName}>{f.kurzname}</span>
              <strong className={styles.name}>{l.name}</strong>
              <span>{l.satz}</span>
              <span className={styles.meta}>
                <span className={styles.reife} data-reife={l.reife}>{tb(`reifegrad.${l.reife}`)}</span>
                {f.stunden > 0 && <span>{t("zurueck", { h: formatStunden(f.stunden * (annahme / 100)) })}</span>}
              </span>
            </button>
          );
        })}
      </section>

      <section className={styles.szenario}>
        <label>
          <span>{t("szenarioFrage")}</span>
          <select value={annahme} onChange={(e) => setAnnahme(Number(e.target.value) as (typeof ANNAHMEN)[number])}>
            {ANNAHMEN.map((a) => <option key={a} value={a}>{a} %</option>)}
          </select>
        </label>
        <p className={styles.szenarioZahl}>
          <strong>{t("zurueckSumme", { h: formatStunden(zurueckStunden) })}</strong> · ≈ {formatEuro(zurueckEuro)} {t("imJahr")}
        </p>
        <p className="leise klein">{t("szenarioHinweis")}</p>
      </section>

      {/* ---------- Zweiter Blick ---------- */}
      {mitLoesung.map((f) => {
        const l = loesungen[f.id];
        const istOffen = offen === f.id;
        return (
          <article key={f.id} id={`loesung-${f.id}`} className={styles.detail}>
            <button type="button" className={styles.detailKopf} aria-expanded={istOffen} onClick={() => setOffen(istOffen ? null : f.id)}>
              <span className={styles.feldName}>{f.kurzname} →</span>
              <span className={styles.detailName}>{l.name}</span>
              <span aria-hidden>{istOffen ? "−" : "+"}</span>
            </button>
            {istOffen && (
              <div className={styles.detailInhalt}>
                <p className={styles.satz}>{l.satz}</p>
                <h3>{t("soLaeuftEs")}</h3>
                <ol className={styles.schritte}>{l.schritte.map((s) => <li key={s}>{s}</li>)}</ol>
                <div className={styles.zweispaltig}>
                  <div>
                    <h3>{t("brauchtEs")}</h3>
                    <ul>{l.braucht.map((b) => <li key={b}>{b}</li>)}</ul>
                  </div>
                  <div className={styles.kniff}>
                    <h3>{t("kniff")}</h3>
                    <p>{l.kniff}</p>
                  </div>
                </div>
                <p><strong>{t("zeitFrei")}</strong> {l.zeitFrei}</p>
                <p className={styles.einordnung}>
                  <span>{tb(`loesungsart.${l.art}`)}</span>
                  <span>{tb(`reifegrad.${l.reife}`)}</span>
                  <span className={l.herkunft === "rokiGeprueft" ? styles.geprueft : undefined}>{tb(`herkunft.${l.herkunft}`)}</span>
                </p>
                <p><strong>{t("testlauf")}</strong> {l.testlauf}</p>
                <div className={styles.testen}>
                  <button
                    type="button"
                    className={testet.includes(f.id) ? "button button--tuerkis" : "button"}
                    aria-pressed={testet.includes(f.id)}
                    onClick={() => {
                      const an = !testet.includes(f.id);
                      setTestet(an ? [...testet, f.id] : testet.filter((x) => x !== f.id));
                      setzeTest(daten.code, f.id, an).catch(() => setTestet(testet));
                    }}
                  >
                    {testet.includes(f.id) ? `✓ ${t("testetSchon")}` : t("testenWir")}
                  </button>
                  <span className="leise klein">{t("testenHinweis")}</span>
                </div>
                <div className={styles.bauplan}>
                  <div className={styles.bauplanKopf}>
                    <h3>{t("bauplan")}</h3>
                    <button
                      type="button"
                      className="button button--tuerkis"
                      onClick={() => navigator.clipboard.writeText(l.bauplanPrompt).then(() => setKopiert(f.id))}
                    >
                      {kopiert === f.id ? t("kopiert") : t("kopieren")}
                    </button>
                  </div>
                  <p className="leise klein">{t("bauplanHinweis")}</p>
                  <pre>{l.bauplanPrompt}</pre>
                </div>
              </div>
            )}
          </article>
        );
      })}

      <section className={styles.ersteSchritte}>
        <h2>{t("ersteSchritte")}</h2>
        <ul>
          {mitLoesung.map((f) => (
            <li key={f.id}><strong>{loesungen[f.id].name}:</strong> {loesungen[f.id].testlauf}</li>
          ))}
        </ul>
        <p className="leise">{t("roki", { deadline: daten.deadline })}</p>
        <Link className="button button--ghost" href={`/analyse/${daten.code}`}>← {t("zurAnalyse")}</Link>
      </section>
    </div>
  );
}
