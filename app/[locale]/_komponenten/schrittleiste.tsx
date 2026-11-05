import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DEMO_ID } from "@/lib/daten";
import styles from "./schrittleiste.module.css";

const schritte = [
  { schluessel: "s0", href: "/anlegen" },
  { schluessel: "s1", href: "/abfrage/heidekamp-montage" },
  { schluessel: "s2", href: "/abfrage/heidekamp-montage" },
  { schluessel: "s3", href: `/ergebnis/${DEMO_ID}` },
  { schluessel: "s4", href: `/fahrplan/${DEMO_ID}` },
  { schluessel: "s5", href: `/besprechung/${DEMO_ID}` },
  { schluessel: "s6", href: `/praesentation/${DEMO_ID}` },
] as const;

/** Navigation durch die sieben Schritte, damit die Demo jederzeit springen kann. */
export function Schrittleiste({ aktiv }: { aktiv: number }) {
  const t = useTranslations("Schritte");

  return (
    <nav className={styles.leiste} aria-label={t("label")}>
      <ol>
        {schritte.map((schritt, index) => (
          <li key={schritt.schluessel}>
            <Link
              href={schritt.href}
              className={styles.schritt}
              aria-current={index === aktiv ? "step" : undefined}
            >
              <span className={styles.nummer}>{index}</span>
              <span className={styles.name}>{t(schritt.schluessel)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
