import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Archivo, Rubik } from "next/font/google";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import styles from "./layout.module.css";
import { LocaleSwitcher } from "./locale-switcher";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
// Schmale Schrift mit Charakter für Feed und große Aussagen (Breiten-Achse 62–125).
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Kopf" });

  return (
    <html lang={locale} className={`${rubik.variable} ${archivo.variable}`}>
      <body>
        <NextIntlClientProvider>
          <header className={styles.kopf}>
            <Link href="/" className={styles.marke}>
              <img
                src="/logo.png"
                alt={t("logoAlt")}
                width={2172}
                height={724}
                className={styles.logo}
              />
            </Link>
            <span className={`chip ${styles.demo}`}>{t("demo")}</span>
            <LocaleSwitcher />
          </header>
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
