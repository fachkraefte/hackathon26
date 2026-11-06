"use client";

// Beamer-Ansicht (Jury-Modus): Graph und Zahlen wachsen mit jedem Swipe mit. Lädt alle 2 Sekunden neu.
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { liveDaten } from "@/lib/feed-aktionen";
import { formatEuro, formatStunden } from "@/lib/rechnen";
import { UebergabeKarte } from "../../_komponenten/uebergabe-karte";
import styles from "./live.module.css";

type Daten = NonNullable<Awaited<ReturnType<typeof liveDaten>>>;

export function Live({ code, start, adresse }: { code: string; start: Daten; adresse: string }) {
  const t = useTranslations("Live");
  const ta = useTranslations("Analyse");
  const [d, setD] = useState(start);
  const [neu, setNeu] = useState(false);

  useEffect(() => {
    let aktiv = true;
    const takt = window.setInterval(async () => {
      const frisch = await liveDaten(code).catch(() => null);
      if (!aktiv || !frisch) return;
      setD((alt) => {
        if (frisch.stimmen !== alt.stimmen || Math.abs(frisch.stunden - alt.stunden) > 0.01) {
          setNeu(true);
          window.setTimeout(() => setNeu(false), 900);
        }
        return frisch;
      });
    }, 2000);
    return () => {
      aktiv = false;
      window.clearInterval(takt);
    };
  }, [code]);

  return (
    <div className={styles.buehne}>
      <section className={styles.zahlen}>
        <p className={styles.betrieb}>{d.betrieb} · {t("titel")}</p>
        <p className={styles.zahl} data-neu={neu}>
          {formatStunden(d.stunden)}
          <span>{t("proWoche")}</span>
        </p>
        <p className={styles.zahlKlein}>
          ≈ {formatEuro(d.euro)} <span>{t("imJahr")}</span>
        </p>
        <p className={styles.zahlKlein} data-neu={neu}>
          {d.stimmen} <span>{t("stimmen")}</span>
        </p>
        <ol className={styles.felder}>
          {d.faeden.map((f) => (
            <li key={f.kurzname}>
              <strong>{f.kurzname}</strong> · {ta("stimmen", { n: f.personen })} · {formatStunden(f.stunden)} {t("proWoche")}
            </li>
          ))}
        </ol>
        <p className={styles.mitswipen}>
          {t("mitswipen", { code })}
          <br />
          <span>{adresse}</span>
        </p>
      </section>
      <section className={styles.graph}>
        <UebergabeKarte
          karte={d.karte}
          beschriftung={{
            stimmen: (n) => ta("stimmen", { n }),
            legende: { laeuft: "", reibung: "", bruch: "", loesung: "", hinweis: "" },
          }}
          ohneLegende
        />
      </section>
    </div>
  );
}
