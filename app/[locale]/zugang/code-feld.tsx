"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { pruefeCode } from "@/lib/aktionen";
import { oeffneMitGedaechtnis } from "./oeffnen";

/** Code-Eingabe, auch auf der Startseite verwendet. */
export function CodeFeld({ ziel }: { ziel: "befragung" | "analyse" | "feed" }) {
  const t = useTranslations("Zugang");
  const router = useRouter();
  const [code, setCode] = useState("");
  const [falsch, setFalsch] = useState(false);
  const [prueft, starte] = useTransition();

  return (
    <form
      style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
      onSubmit={(e) => {
        e.preventDefault();
        setFalsch(false);
        starte(async () => {
          if (ziel === "feed") {
            // Ein Feld für alles: Team-Code → anonyme App (dieses Gerät merkt sich seine Sitzung), Leitungs-Code → Dashboard.
            const r = await oeffneMitGedaechtnis(code);
            if (r) router.push(r);
            else setFalsch(true);
            return;
          }
          const gueltig = await pruefeCode(code);
          if (gueltig) router.push(`/${ziel}/${gueltig}`);
          else setFalsch(true);
        });
      }}
    >
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder={t("code")}
        aria-label={t("code")}
        autoComplete="off"
        style={{ flex: "1 1 9rem", letterSpacing: "0.15em", fontWeight: 600, textTransform: "uppercase" }}
      />
      <button type="submit" className="button" disabled={code.trim().length < 4 || prueft}>
        {t("los")}
      </button>
      {falsch && <p style={{ margin: 0, flexBasis: "100%", color: "#b42318" }}>{t("falsch")}</p>}
    </form>
  );
}
