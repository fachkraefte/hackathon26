import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DEMO_ID } from "@/lib/daten";
import { Schrittleiste } from "./_komponenten/schrittleiste";
import styles from "./page.module.css";

const schritte = ["s0", "s1", "s2", "s3", "s4", "s5", "s6"] as const;

export default async function HomePage() {
  const t = await getTranslations("Start");
  const ts = await getTranslations("Schritte");

  return (
    <main className="seite">
      <Schrittleiste aktiv={-1} />
      <section className={styles.held}>
        <p className="ueberzeile">{t("ueberzeile")}</p>
        <h1>{t("titel")}</h1>
        <p className={styles.einleitung}>{t("einleitung")}</p>
        <div className={styles.aktionen}>
          <Link className="button" href="/anlegen">{t("ctaLeitung")}</Link>
          <Link className="button button--tuerkis" href="/abfrage/heidekamp-montage">{t("ctaBeschaeftigte")}</Link>
          <Link className="button button--ghost" href={`/ergebnis/${DEMO_ID}`}>{t("ctaErgebnis")}</Link>
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("ablaufTitel")}</h2>
        <ol className={styles.ablauf}>
          {schritte.map((s, i) => (
            <li key={s} className="karte">
              <span className={styles.nummer}>{i}</span>
              <h3>{ts(s)}</h3>
              <p className="leise">{t(`ablauf.${s}`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`abschnitt karte ${styles.grundsatz}`}>
        <h2>{t("grundsatzTitel")}</h2>
        <p>{t("grundsatz")}</p>
      </section>
    </main>
  );
}
