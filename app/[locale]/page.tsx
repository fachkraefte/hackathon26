import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { analyseDaten } from "@/lib/analyse";
import { DEMO_ID } from "@/lib/daten";
import { CodeFeld } from "./zugang/code-feld";
import { DemoZuruecksetzen } from "./demo-zuruecksetzen";
import { LiveKarte } from "./live-karte";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const BEISPIELE = ["metallbau", "pflege", "mensa"] as const;
const SCHRITTE = ["anlegen", "erzaehlen", "loesen"] as const;

export default async function Startseite() {
  const t = await getTranslations("Home");
  // Das echte Produktbild: Übergabe-Karte des Demo-Betriebs (fiktiv).
  const demo = await analyseDaten(DEMO_ID).catch(() => null);
  const loesungen = demo ? Object.fromEntries(Object.entries(demo.loesungen).map(([id, e]) => [id, e.loesung.name])) : {};

  return (
    <main className={styles.start}>
      <section className={styles.held}>
        <div className={styles.heldText}>
          <p className="ueberzeile">{t("ueberzeile")}</p>
          <h1>
            {t("titel")}
            <span className={styles.wechsel} aria-hidden>
              {(["werkstatt", "pflege", "kueche", "lager"] as const).map((o) => (
                <span key={o}>{t(`ort.${o}`)}</span>
              ))}
            </span>
          </h1>
          <p className={styles.einleitung}>{t("einleitung")}</p>
          <div className={styles.einstiege}>
            <div className={styles.einstieg}>
              <p className={styles.fuer}>{t("fuerLeitung")}</p>
              <Link className="button" href="/anlegen">{t("anlegen")}</Link>
            </div>
            <div className={styles.einstieg}>
              <p className={styles.fuer}>{t("fuerTeam")}</p>
              <CodeFeld ziel="befragung" />
            </div>
          </div>
          <p className={styles.analyseLink}>
            <Link href="/zugang?ziel=analyse">{t("analyseAnsehen")}</Link>
            {" · "}
            <Link href={`/analyse/${DEMO_ID}`}>{t("beispielAnsehen")}</Link>
          </p>
        </div>
        {demo && (
          <div className={styles.heldBild}>
            <LiveKarte
              karte={demo.karte}
              loesungen={loesungen}
              texte={{
                heute: t("karteHeute"),
                mitLoesungen: t("karteMitLoesungen"),
                stimmen: t.raw("stimmen") as string,
                hinweis: t("karteHinweis"),
              }}
            />
          </div>
        )}
      </section>

      <section className={styles.abschnitt}>
        <h2>{t("schritteTitel")}</h2>
        <ol className={styles.schritte}>
          {SCHRITTE.map((s, i) => (
            <li key={s}>
              <span className={styles.nummer}>{i + 1}</span>
              <span className={styles.dauer}>{t(`schritt.${s}.dauer`)}</span>
              <strong>{t(`schritt.${s}.titel`)}</strong>
              <span className="leise">{t(`schritt.${s}.text`)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.abschnitt}>
        <h2>{t("beispieleTitel")}</h2>
        <div className={styles.beispiele}>
          {BEISPIELE.map((b) => (
            <article key={b} className={styles.beispiel}>
              <p className={styles.branche}>{t(`beispiel.${b}.branche`)}</p>
              <p className={styles.stimme}>„{t(`beispiel.${b}.stimme`)}“</p>
              <p className={styles.loesung}>→ {t(`beispiel.${b}.loesung`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ehrlich}>
        <p>{t("ehrlich")}</p>
        <DemoZuruecksetzen />
      </section>
    </main>
  );
}
