"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { setzeDemoZurueck } from "@/lib/aktionen";

/** Vor jedem Pitch-Durchlauf: Live-Beiträge entfernen, Demo-Daten wiederherstellen. */
export function DemoZuruecksetzen() {
  const t = useTranslations("Home");
  const [laedt, starte] = useTransition();
  const [fertig, setFertig] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  return (
    <p className="leise klein">
      <button
        type="button"
        className="button button--ghost"
        disabled={laedt}
        onClick={() =>
          starte(async () => {
            try {
              await setzeDemoZurueck();
              setFertig(true);
            } catch (e) {
              setFehler(e instanceof Error ? e.message : String(e));
            }
          })
        }
      >
        {fertig ? t("zurueckgesetzt") : t("zuruecksetzen")}
      </button>
      {fehler && <span> {fehler}</span>}
    </p>
  );
}
