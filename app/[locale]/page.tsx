import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <main className={styles.main}>
      <h1>{t("title")}</h1>
      <p>{t("intro")}</p>
    </main>
  );
}
