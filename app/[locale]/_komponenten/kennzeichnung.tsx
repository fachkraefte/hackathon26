// Kennzeichnungen für Vorschläge: Lösungsart, Herkunft (immer sichtbar) und Reifegrad.
import { useTranslations } from "next-intl";
import type { Herkunft, Loesungsart, Reifegrad, WissensEintrag } from "@/lib/typen";
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

/** Herkunft wird immer angezeigt; bei "von ROKI geprüft" mit Quelle aus dem Wissensauszug. */
export function HerkunftHinweis({
  herkunft,
  wissen,
}: {
  herkunft: Herkunft;
  wissen?: WissensEintrag;
}) {
  const t = useTranslations("Begriffe");
  const geprueft = herkunft === "rokiGeprueft";

  return (
    <p className={`${styles.herkunft} ${geprueft ? styles.geprueft : styles.ungeprueft}`}>
      <strong>{t(`herkunft.${herkunft}`)}</strong>
      {geprueft && wissen ? (
        <span>{t("quelle", { datei: wissen.quelle.datei, abschnitt: wissen.quelle.abschnitt })}</span>
      ) : (
        <span>{t("herkunftHinweisUngeprueft")}</span>
      )}
    </p>
  );
}
