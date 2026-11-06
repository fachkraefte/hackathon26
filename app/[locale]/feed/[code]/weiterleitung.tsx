"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Denkt } from "../../ich/[code]/app";
import { oeffneMitGedaechtnis } from "../../zugang/oeffnen";
import styles from "./feed.module.css";

export function Weiterleitung({ code }: { code: string }) {
  const t = useTranslations("Feed");
  const router = useRouter();
  const [fehler, setFehler] = useState(false);
  useEffect(() => {
    oeffneMitGedaechtnis(code).then((pfad) => (pfad ? router.replace(pfad) : setFehler(true)));
  }, [code, router]);
  return (
    <div className={styles.buehne} data-phase="start">
      {fehler ? (
        <section className={styles.start}>
          <h1 className={styles.gross}>{t("codeUnbekannt")}</h1>
          <Link href="/zugang" className={styles.leiseLink}>{t("codeNochmal")} →</Link>
        </section>
      ) : (
        <Denkt text={t("oeffnet")} />
      )}
    </div>
  );
}
