"use client";

// Startseite: die Übergabe-Karte des Demo-Betriebs wechselt von allein zwischen „heute“ und „mit Lösungen“.
import { useEffect, useState } from "react";
import type { Karte } from "@/lib/karte";
import { UebergabeKarte } from "./_komponenten/uebergabe-karte";
import styles from "./page.module.css";

type Texte = { heute: string; mitLoesungen: string; stimmen: string; hinweis: string };

export function LiveKarte({ karte, loesungen, texte }: { karte: Karte; loesungen: Record<string, string>; texte: Texte }) {
  const [modus, setModus] = useState<"heute" | "loesungen">("heute");
  useEffect(() => {
    const takt = window.setInterval(() => setModus((m) => (m === "heute" ? "loesungen" : "heute")), 3200);
    return () => window.clearInterval(takt);
  }, []);
  return (
    <div className={styles.liveKarte}>
      <p className={styles.modus} data-modus={modus}>{modus === "heute" ? texte.heute : texte.mitLoesungen}</p>
      <UebergabeKarte
        karte={karte}
        modus={modus}
        loesungen={loesungen}
        beschriftung={{
          stimmen: (n) => texte.stimmen.replace("{n}", String(n)),
          legende: { laeuft: "", reibung: "", bruch: "", loesung: "", hinweis: texte.hinweis },
        }}
        ohneLegende
      />
    </div>
  );
}
