// Kennzeichnungen für Ansätze: Lösungsart, Reifegrad und Herkunft (immer sichtbar).
import { useTranslations } from "next-intl";
import type { Herkunft, Loesungsart, Reifegrad } from "@/lib/typen";
import styles from "./kennzeichnung.module.css";

export function ArtChip({ art }: { art: Loesungsart }) {
  const t = useTranslations("Begriffe.loesungsart");
  return (
    <span className={`chip ${styles.art}`} style={{ "--art": `var(--art-${art})` }}>
      {t(art)}
    </span>
  );
}

export function ReifegradChip({ reifegrad }: { reifegrad: Reifegrad }) {
  const t = useTranslations("Begriffe.reifegrad");
  return <span className={`chip ${styles.reifegrad}`}>{t(reifegrad)}</span>;
}

export function HerkunftHinweis({ herkunft, quelle }: { herkunft: Herkunft; quelle: string | null }) {
  const t = useTranslations("Begriffe");
  const geprueft = herkunft === "rokiGeprueft";
  return (
    <p className={`${styles.herkunft} ${geprueft ? styles.geprueft : styles.ungeprueft}`}>
      <strong>{t(`herkunft.${herkunft}`)}</strong>
      <span>{geprueft && quelle ? t("quelle", { quelle }) : t("herkunftHinweisUngeprueft")}</span>
    </p>
  );
}
