import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DEMO_ID } from "@/lib/daten";
import { DemoZuruecksetzen } from "./demo-zuruecksetzen";
import styles from "./page.module.css";

const momente = [
  { schluessel: "m1", href: "/start" },
  { schluessel: "m2", href: `/mitmachen/${DEMO_ID}` },
  { schluessel: "m3", href: `/ergebnis/${DEMO_ID}` },
] as const;

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="seite">
      <section className={styles.held}>
        <p className="ueberzeile">{t("ueberzeile")}</p>
        <h1>{t("titel")}</h1>
        <p className={styles.einleitung}>{t("einleitung")}</p>
      </section>

      <ol className={styles.momente}>
        {momente.map((m, i) => (
          <li key={m.schluessel}>
            <Link href={m.href} className={styles.moment}>
              <span className={styles.nummer}>{i + 1}</span>
              <span className={styles.dauer}>{t(`${m.schluessel}.dauer`)}</span>
              <strong>{t(`${m.schluessel}.titel`)}</strong>
              <span className="leise">{t(`${m.schluessel}.text`)}</span>
              <span className={styles.los}>{t(`${m.schluessel}.los`)} →</span>
            </Link>
          </li>
        ))}
      </ol>

      <p className={styles.grundsatz}>{t("grundsatz")}</p>
      <DemoZuruecksetzen />
    </main>
  );
}
