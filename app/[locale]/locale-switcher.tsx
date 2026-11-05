import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./locale-switcher.module.css";

export async function LocaleSwitcher() {
  const t = await getTranslations("LocaleSwitcher");
  const currentLocale = await getLocale();

  return (
    <nav className={styles.nav} aria-label={t("label")}>
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          className={styles.link}
          href="/"
          locale={locale}
          hrefLang={locale}
          aria-current={locale === currentLocale ? "page" : undefined}
        >
          {t(locale)}
        </Link>
      ))}
    </nav>
  );
}
