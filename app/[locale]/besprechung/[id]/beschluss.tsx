"use client";

import { useTranslations } from "next-intl";
import { leererBeschluss, useBeschluss } from "@/lib/beschluss-speicher";
import { dimensionen, type Beschluss, type Dimension, type Profilwert, type Wert } from "@/lib/typen";
import { ProfilUmschalter } from "../../_komponenten/profil-umschalter";
import styles from "./besprechung.module.css";

function zieleAus(beschluss: Beschluss | null): Partial<Record<Dimension, number>> {
  return Object.fromEntries((beschluss?.zielwerte ?? []).map((z) => [z.dimension, z.ziel]));
}

/** Profil heute – mit den Zielwerten, sobald das Team sie einträgt. */
export function ProfilMitZiel({
  id,
  profil,
  bereiche,
  startArt,
}: {
  id: string;
  profil: Profilwert[];
  bereiche: { id: string; name: string }[];
  startArt?: "netz" | "balken";
}) {
  const { beschluss } = useBeschluss(id);
  return <ProfilUmschalter profil={profil} bereiche={bereiche} ziele={zieleAus(beschluss)} startArt={startArt} />;
}

/** Abschnitt 8: Zielwerte, erster Testlauf, Verantwortliche, Termin zum Nachschauen. */
export function BeschlussFormular({
  id,
  istWerte,
  testlaeufe,
}: {
  id: string;
  istWerte: Partial<Record<Dimension, number>>;
  testlaeufe: string[];
}) {
  const t = useTranslations("Besprechung");
  const tb = useTranslations("Begriffe");
  const { beschluss, fehler, speichere, aendere } = useBeschluss(id);
  const aktuell = beschluss ?? leererBeschluss(id);
  const ziele = zieleAus(beschluss);

  function setzeZiel(dimension: Dimension, ziel: Wert) {
    aendere((alt) => ({
      ...alt,
      zielwerte: [...alt.zielwerte.filter((z) => z.dimension !== dimension), { dimension, ziel }],
    }));
  }

  return (
    <div className={styles.beschluss}>
      {fehler && (
        <p className={styles.fehler}>
          {t("speicherFehler")} {fehler}{" "}
          <button type="button" className="button button--ghost" onClick={() => speichere(null)}>
            {t("zuruecksetzen")}
          </button>
        </p>
      )}

      <div className="karte">
        <h3>{t("zielwerteTitel")}</h3>
        <p className="leise klein">{t("zielwerteText")}</p>
        {dimensionen.map((d) => (
          <div key={d} className={styles.zielZeile}>
            <span>
              {tb(`dimension.${d}`)}
              <span className="leise klein"> · {t("istWert", { ist: (istWerte[d] ?? 0).toLocaleString("de-DE") })}</span>
            </span>
            <div className={styles.zielStufen} role="radiogroup" aria-label={tb(`dimension.${d}`)}>
              {([1, 2, 3, 4, 5] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  role="radio"
                  aria-checked={ziele[d] === w}
                  data-unter-ist={w < (istWerte[d] ?? 0) || undefined}
                  onClick={() => setzeZiel(d, w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="karte">
        <label className="feld">
          <span>{t("testlauf")}</span>
          <select
            value={testlaeufe.includes(aktuell.ersterTestlauf) ? aktuell.ersterTestlauf : ""}
            onChange={(e) => aendere((alt) => ({ ...alt, ersterTestlauf: e.target.value }))}
          >
            <option value="">{t("testlaufWaehlen")}</option>
            {testlaeufe.map((tl) => <option key={tl} value={tl}>{tl}</option>)}
          </select>
        </label>
        <label className="feld">
          <span>{t("verantwortlich")}</span>
          <input
            type="text"
            value={aktuell.verantwortlich}
            placeholder={t("verantwortlichPlatzhalter")}
            onChange={(e) => aendere((alt) => ({ ...alt, verantwortlich: e.target.value }))}
          />
        </label>
        <label className="feld">
          <span>{t("nachschauen")}</span>
          <input
            type="date"
            value={aktuell.nachschauenAm ?? ""}
            onChange={(e) => aendere((alt) => ({ ...alt, nachschauenAm: e.target.value || undefined }))}
          />
        </label>
        <p className="leise klein">{t("dummySpeicher")}</p>
      </div>
    </div>
  );
}

/** Zusammenfassung des Beschlusses (Präsentation). */
export function BeschlussUebersicht({ id }: { id: string }) {
  const t = useTranslations("Besprechung");
  const tb = useTranslations("Begriffe");
  const { beschluss } = useBeschluss(id);

  if (!beschluss || (!beschluss.ersterTestlauf && beschluss.zielwerte.length === 0)) {
    return <p className={styles.offen}>{t("nochOffen")}</p>;
  }

  return (
    <dl className={styles.uebersicht}>
      <div>
        <dt>{t("testlauf")}</dt>
        <dd>{beschluss.ersterTestlauf || "–"}</dd>
      </div>
      <div>
        <dt>{t("verantwortlich")}</dt>
        <dd>{beschluss.verantwortlich || "–"}</dd>
      </div>
      <div>
        <dt>{t("nachschauen")}</dt>
        <dd>{beschluss.nachschauenAm ? new Date(beschluss.nachschauenAm).toLocaleDateString("de-DE") : "–"}</dd>
      </div>
      <div>
        <dt>{t("zielwerteTitel")}</dt>
        <dd>
          {beschluss.zielwerte.length === 0
            ? "–"
            : dimensionen
                .filter((d) => beschluss.zielwerte.some((z) => z.dimension === d))
                .map((d) => `${tb(`dimensionKurz.${d}`)} ${beschluss.zielwerte.find((z) => z.dimension === d)?.ziel}`)
                .join(" · ")}
        </dd>
      </div>
    </dl>
  );
}

export function DruckenKnopf() {
  const t = useTranslations("Besprechung");
  return (
    <button type="button" className="button button--ghost" onClick={() => window.print()}>
      {t("drucken")}
    </button>
  );
}
