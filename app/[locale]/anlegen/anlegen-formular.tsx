"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { branchen, type Bestandsaufnahme, type Betrieb, type Branche } from "@/lib/typen";
import styles from "./anlegen.module.css";

type BereichEntwurf = { name: string; erwartet: number };

export function AnlegenFormular({
  betrieb,
  bestandsaufnahme,
}: {
  betrieb: Betrieb;
  bestandsaufnahme: Bestandsaufnahme;
}) {
  const t = useTranslations("Anlegen");
  const tb = useTranslations("Begriffe.branche");

  const [name, setName] = useState(betrieb.name);
  const [branche, setBranche] = useState<Branche>(betrieb.branche);
  const [mitarbeitende, setMitarbeitende] = useState(betrieb.mitarbeitende);
  const [ort, setOrt] = useState(betrieb.ort);
  const [leistungen, setLeistungen] = useState(betrieb.leistungen ?? "");
  const [dokumente, setDokumente] = useState<string[]>([]);
  const [anrede, setAnrede] = useState(bestandsaufnahme.anrede);
  const [bereiche, setBereiche] = useState<BereichEntwurf[]>(
    bestandsaufnahme.bereiche.map((b) => ({ name: b.name, erwartet: b.erwarteteAntworten })),
  );
  const [angelegt, setAngelegt] = useState(false);

  function aendereBereich(index: number, aenderung: Partial<BereichEntwurf>) {
    setBereiche((alt) => alt.map((b, i) => (i === index ? { ...b, ...aenderung } : b)));
  }

  if (angelegt) {
    return (
      <section className={`karte ${styles.fertig}`}>
        <h2>{t("fertigTitel", { name })}</h2>
        <p>{t("fertigText")}</p>
        <ul className={styles.links}>
          {bestandsaufnahme.bereiche.map((b) => (
            <li key={b.id}>
              <span>
                <strong>{b.name}</strong>
                <span className="leise klein"> · {t("erwartet", { anzahl: b.erwarteteAntworten })}</span>
              </span>
              <Link href={`/abfrage/${b.linkId}`}>/abfrage/{b.linkId}</Link>
            </li>
          ))}
        </ul>
        <p className="leise klein">{t("dummyHinweis")}</p>
        <button type="button" className="button button--ghost" onClick={() => setAngelegt(false)}>
          {t("zurueck")}
        </button>
      </section>
    );
  }

  return (
    <form
      className={styles.formular}
      onSubmit={(event) => {
        event.preventDefault();
        setAngelegt(true);
      }}
    >
      <fieldset className="karte">
        <legend>{t("betriebTitel")}</legend>
        <label className="feld">
          <span>{t("name")}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <div className="feld">
          <span>{t("branche")}</span>
          <div className={styles.branchen}>
            {branchen.map((b) => (
              <button
                key={b}
                type="button"
                className={styles.branche}
                aria-pressed={branche === b}
                onClick={() => setBranche(b)}
              >
                {tb(b)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.zweispaltig}>
          <label className="feld">
            <span>{t("mitarbeitende")}</span>
            <input
              type="number"
              min={1}
              value={mitarbeitende}
              onChange={(e) => setMitarbeitende(Number(e.target.value))}
            />
          </label>
          <label className="feld">
            <span>{t("ort")}</span>
            <input type="text" value={ort} onChange={(e) => setOrt(e.target.value)} />
          </label>
        </div>

        <label className="feld">
          <span>{t("leistungen")}</span>
          <textarea value={leistungen} onChange={(e) => setLeistungen(e.target.value)} />
        </label>

        <label className="feld">
          <span>{t("dokumente")}</span>
          <span className="leise klein">{t("dokumenteHinweis")}</span>
          <input
            type="file"
            multiple
            onChange={(e) => setDokumente(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
        </label>
        {dokumente.length > 0 && (
          <ul className="chips">
            {dokumente.map((d) => (
              <li key={d} className="chip">📄 {d}</li>
            ))}
          </ul>
        )}
      </fieldset>

      <fieldset className="karte">
        <legend>{t("bereicheTitel")}</legend>
        <p className="leise klein">{t("bereicheHinweis", { mindestanzahl: bestandsaufnahme.mindestanzahl })}</p>
        <div className={styles.bereiche}>
          {bereiche.map((b, i) => (
            <div key={i} className={styles.bereich}>
              <input
                type="text"
                aria-label={t("bereichName")}
                value={b.name}
                onChange={(e) => aendereBereich(i, { name: e.target.value })}
              />
              <input
                type="number"
                min={1}
                aria-label={t("bereichPersonen")}
                value={b.erwartet}
                onChange={(e) => aendereBereich(i, { erwartet: Number(e.target.value) })}
              />
              {b.erwartet < bestandsaufnahme.mindestanzahl && (
                <span className={`chip ${styles.klein}`}>{t("kleineGruppe")}</span>
              )}
              <button
                type="button"
                className="button button--ghost"
                aria-label={t("bereichEntfernen")}
                onClick={() => setBereiche((alt) => alt.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => setBereiche((alt) => [...alt, { name: "", erwartet: 1 }])}
        >
          {t("bereichHinzu")}
        </button>
      </fieldset>

      <fieldset className="karte">
        <legend>{t("anredeTitel")}</legend>
        <div className="chips">
          {(["sie", "du"] as const).map((a) => (
            <button key={a} type="button" className="auswahl" aria-pressed={anrede === a} onClick={() => setAnrede(a)}>
              {t(`anrede.${a}`)}
            </button>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="button">{t("absenden")}</button>
    </form>
  );
}
