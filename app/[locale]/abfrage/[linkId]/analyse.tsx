"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { dimensionen, type Aufgabenkarte, type Dimension, type KatalogAufgabe, type Wert, type WissensEintrag } from "@/lib/typen";
import { ArtChip, HerkunftHinweis, ReifegradChip } from "../../_komponenten/kennzeichnung";
import { Profildiagramm } from "../../_komponenten/profildiagramm";
import styles from "./abfrage.module.css";

/**
 * Schritt 2: persönliche Analyse. Im Dummy regelbasiert aus dem Fragenkatalog;
 * später formuliert die KI die Einordnung (TECHNIK.md, Schritt 2).
 */
export function Analyse({
  karte,
  einschaetzung,
  aufgaben,
  wissen,
}: {
  karte: Aufgabenkarte;
  einschaetzung: Partial<Record<Dimension, Wert>>;
  aufgaben: KatalogAufgabe[];
  wissen: WissensEintrag[];
}) {
  const t = useTranslations("Analyse");
  const tb = useTranslations("Begriffe");

  const stundenGesamt = karte.aufgaben.reduce((s, a) => s + (a.stundenProWoche ?? 0), 0);
  const maxStunden = Math.max(...karte.aufgaben.map((a) => a.stundenProWoche ?? 0), 1);
  const staerkste = dimensionen.filter((d) => (einschaetzung[d] ?? 0) >= 4);
  const schwaechste = dimensionen.filter((d) => (einschaetzung[d] ?? 5) <= 2);

  return (
    <section className={styles.analyse}>
      <p className="ueberzeile">{t("ueberzeile")}</p>
      <h1>{t("titel")}</h1>
      <p className="leise">{t("einleitung")}</p>

      {karte.wunsch && (
        <blockquote className={styles.wunsch}>
          <span className="ueberzeile">{t("wunsch")}</span>
          <p>{karte.wunsch}</p>
        </blockquote>
      )}

      <div className={styles.analyseRaster}>
        <div className="karte">
          <h2>{t("profilTitel")}</h2>
          <Profildiagramm
            art="netz"
            istLabel={t("profilTitel")}
            punkte={dimensionen.map((d) => ({ dimension: d, ist: einschaetzung[d] ?? 0 }))}
          />
          {staerkste.length > 0 && (
            <p className="klein">{t("staerke", { liste: staerkste.map((d) => tb(`dimension.${d}`)).join(", ") })}</p>
          )}
          {schwaechste.length > 0 && (
            <p className="klein">{t("schwaeche", { liste: schwaechste.map((d) => tb(`dimension.${d}`)).join(", ") })}</p>
          )}
        </div>

        <div className="karte">
          <h2>{t("zeitTitel")}</h2>
          {stundenGesamt > 0 ? (
            <>
              <p className={styles.grosseZahl}>
                {t("stunden", { stunden: stundenGesamt.toLocaleString("de-DE") })}
              </p>
              <p className="leise klein">{t("zeitHinweis")}</p>
              <ul className={styles.zeitBalken}>
                {karte.aufgaben.map((a) => (
                  <li key={a.id}>
                    <span>{a.titel}</span>
                    <span className={styles.balkenSpur}>
                      <span style={{ width: `${((a.stundenProWoche ?? 0) / maxStunden) * 100}%` }} />
                    </span>
                    <span className="klein">{a.stundenProWoche ? `${a.stundenProWoche.toLocaleString("de-DE")} h` : "–"}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="leise">{t("keineStunden")}</p>
          )}
        </div>
      </div>

      <h2 className={styles.zwischentitel}>{t("ideenTitel")}</h2>
      <p className="leise">{t("ideenText")}</p>
      <div className={styles.ideen}>
        {karte.aufgaben.map((a) => {
          const katalogAufgabe = aufgaben.find((k) => k.id === a.id);
          const ohneProblem = a.belastung.length === 0 && !a.stundenProWoche;
          return (
            <article key={a.id} className="karte">
              <h3>{a.titel}</h3>
              <p className={styles.heute}>
                <span className="ueberzeile">{t("heute")}</span>
                {a.beschreibung || t("keineBeschreibung")}
                <span className="leise klein"> · {tb(`haeufigkeit.${a.haeufigkeit}`)}</span>
              </p>
              <span className={styles.pfeil} aria-hidden>↓</span>
              <span className="ueberzeile">{t("morgen")}</span>
              {ohneProblem ? (
                <div className={styles.idee}>
                  <ArtChip art="keineTechnik" />
                  <p>{t("nichtsAendern")}</p>
                </div>
              ) : (
                katalogAufgabe?.vorschlaege.map((v) => {
                  const eintrag = wissen.find((w) => w.id === v.wissenId);
                  return (
                    <div key={v.text} className={styles.idee}>
                      <div className="chips">
                        <ArtChip art={v.art} />
                        {eintrag && <ReifegradChip reifegrad={eintrag.reifegrad} />}
                      </div>
                      <p>{v.text}</p>
                      <HerkunftHinweis herkunft={v.herkunft} wissen={eintrag} />
                    </div>
                  );
                })
              )}
            </article>
          );
        })}
      </div>

      {karte.wasGutLaeuft.length > 0 && (
        <div className={`karte ${styles.bleibt}`}>
          <h2>{t("bleibtTitel")}</h2>
          {karte.wasGutLaeuft.map((g) => <p key={g}>„{g}“</p>)}
        </div>
      )}

      <div className={`karte ${styles.weiterImTeam}`}>
        <h2>{t("teamTitel")}</h2>
        <p>{t("teamText")}</p>
        <Link className="button button--tuerkis" href="/ergebnis/heidekamp">{t("zumGesamtbild")}</Link>
      </div>
    </section>
  );
}
