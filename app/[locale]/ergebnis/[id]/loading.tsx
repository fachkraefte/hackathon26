import { getTranslations } from "next-intl/server";
import styles from "./ergebnis.module.css";

export default async function Laden() {
  const t = await getTranslations("Ergebnis");
  return (
    <main className="seite">
      <div className={styles.laden} aria-live="polite">
        <span className={styles.ladenFaden} />
        <span className={styles.ladenFaden} />
        <span className={styles.ladenFaden} />
        <p>{t("laden")}</p>
      </div>
    </main>
  );
}
