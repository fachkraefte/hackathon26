"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import styles from "./leitung.module.css";

export function Teilen({ text, link }: { text: string; link: string }) {
  const t = useTranslations("Leitung");
  const [kopiert, setKopiert] = useState<"text" | "link" | null>(null);
  return (
    <div className={styles.knoepfe}>
      <a className={styles.knopf} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
        {t("whatsapp")}
      </a>
      <button type="button" className={styles.knopfLeise} onClick={() => navigator.clipboard.writeText(text).then(() => setKopiert("text"))}>
        {kopiert === "text" ? t("kopiert") : t("textKopieren")}
      </button>
      <button type="button" className={styles.knopfLeise} onClick={() => navigator.clipboard.writeText(link).then(() => setKopiert("link"))}>
        {kopiert === "link" ? t("kopiert") : t("linkKopieren")}
      </button>
    </div>
  );
}
