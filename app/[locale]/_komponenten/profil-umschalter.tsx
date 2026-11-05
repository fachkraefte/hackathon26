"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Dimension, Profilwert } from "@/lib/typen";
import { Profildiagramm } from "./profildiagramm";
import styles from "./profil-umschalter.module.css";

type Props = {
  profil: Profilwert[];
  bereiche: { id: string; name: string }[];
  ziele?: Partial<Record<Dimension, number>>;
  startArt?: "netz" | "balken";
};

/** Profil mit Wahl von Bereich und Darstellung (Netz oder Balken – Entscheidung im Team offen). */
export function ProfilUmschalter({ profil, bereiche, ziele, startArt = "netz" }: Props) {
  const t = useTranslations("Profil");
  const [art, setArt] = useState<"netz" | "balken">(startArt);
  const [bereich, setBereich] = useState("gesamt");

  const sichtbareBereiche = [
    { id: "gesamt", name: t("gesamt") },
    ...bereiche.filter((b) => profil.some((p) => p.bereich === b.id)),
  ];
  const auswahl = profil.filter((p) => p.bereich === bereich);
  const anzahl = auswahl[0]?.anzahl ?? 0;
  const punkte = auswahl.map((p) => ({
    dimension: p.dimension,
    ist: p.ist,
    ziel: bereich === "gesamt" ? ziele?.[p.dimension] : undefined,
  }));
  const ausgeblendet = bereiche.filter((b) => !profil.some((p) => p.bereich === b.id));

  return (
    <div>
      <div className={styles.steuerung}>
        <div className="chips" role="group" aria-label={t("bereichWaehlen")}>
          {sichtbareBereiche.map((b) => (
            <button
              key={b.id}
              type="button"
              className="auswahl"
              aria-pressed={bereich === b.id}
              onClick={() => setBereich(b.id)}
            >
              {b.name}
            </button>
          ))}
        </div>
        <div className={styles.art} role="group" aria-label={t("darstellung")}>
          {(["netz", "balken"] as const).map((a) => (
            <button key={a} type="button" aria-pressed={art === a} onClick={() => setArt(a)}>
              {t(a)}
            </button>
          ))}
        </div>
      </div>
      <p className="leise klein">
        {t("anzahl", { anzahl })}
        {ausgeblendet.length > 0 && ` · ${t("zuKlein", { bereiche: ausgeblendet.map((b) => b.name).join(", ") })}`}
      </p>
      <Profildiagramm punkte={punkte} art={art} />
    </div>
  );
}
