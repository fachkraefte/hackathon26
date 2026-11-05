"use client";

import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore, useTransition } from "react";
import { Link } from "@/i18n/navigation";
import { starteBestandsaufnahme } from "@/lib/aktionen";
import { TextMitSprache } from "../_komponenten/eingabe";
import { StufenRegler } from "../_komponenten/regler";
import styles from "./start.module.css";

const SAETZE = [30, 35, 40, 45, 50, 55, 60, 65, 70, 80, 90, 100] as const;
type Satz = (typeof SAETZE)[number];

const nichts = () => () => {};

type Props = {
  id: string;
  betrieb: string;
  leitung: string;
  frage: string;
  ziel: string;
  stundensatz: number;
  bereiche: string[];
  anrede: "du" | "sie";
};

export function StartFormular(props: Props) {
  const t = useTranslations("Start");
  const [frage, setFrage] = useState(props.frage);
  const [ziel, setZiel] = useState(props.ziel);
  const [satz, setSatz] = useState<Satz>(SAETZE.find((s) => s >= props.stundensatz) ?? 50);
  const [bereiche, setBereiche] = useState(props.bereiche);
  const [neuerBereich, setNeuerBereich] = useState("");
  const [laedt, starte] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [fertig, setFertig] = useState<{ zeitfresser: string[]; ausDemo: boolean } | null>(null);
  const [kopiert, setKopiert] = useState(false);
  const herkunft = useSyncExternalStore(nichts, () => window.location.origin, () => "");

  const pfad = `/mitmachen/${props.id}`;
  const link = `${herkunft}/de${pfad}`;
  const einladung = t("einladungText", { leitung: props.leitung, link });

  function absenden() {
    setFehler(null);
    starte(async () => {
      try {
        const antwort = await starteBestandsaufnahme({
          id: props.id,
          frage,
          ziel,
          stundensatz: satz,
          bereiche,
          anrede: props.anrede,
        });
        setFertig(antwort);
      } catch (e) {
        setFehler(e instanceof Error ? e.message : String(e));
      }
    });
  }

  if (fertig) {
    return (
      <section className={styles.fertig}>
        <p className="ueberzeile">{t("fertigUeberzeile")}</p>
        <h1>{t("fertigTitel")}</h1>
        <div className="karte">
          <p className={styles.label}>{t("themenVorschau")}</p>
          <div className="chips">
            {fertig.zeitfresser.map((z) => <span key={z} className="chip">{z}</span>)}
          </div>
          <p className="leise klein">{t("themenHinweis")}</p>
        </div>
        <div className={`karte ${styles.teilen}`}>
          <p className={styles.label}>{t("einladung")}</p>
          <p className={styles.einladung}>{einladung}</p>
          <div className={styles.teilenKnoepfe}>
            <a className="button button--tuerkis" href={`https://wa.me/?text=${encodeURIComponent(einladung)}`} target="_blank" rel="noreferrer">
              {t("whatsapp")}
            </a>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                navigator.clipboard.writeText(einladung).then(
                  () => setKopiert(true),
                  (e: unknown) => setFehler(t("kopierFehler", { grund: String(e) })),
                );
              }}
            >
              {kopiert ? t("kopiert") : t("kopieren")}
            </button>
          </div>
        </div>
        <div className={styles.weiter}>
          <Link className="button" href={pfad}>{t("selbstAntworten")}</Link>
          <Link className="button button--ghost" href={`/ergebnis/${props.id}`}>{t("zumErgebnis")}</Link>
        </div>
        {fehler && <p className={styles.fehler}>{fehler}</p>}
      </section>
    );
  }

  return (
    <section className={styles.formular}>
      <p className="ueberzeile">{t("ueberzeile", { betrieb: props.betrieb })}</p>
      <h1>{t("titel")}</h1>
      <p className="leise">{t("einleitung")}</p>

      <label className={styles.frage}>
        <span>{t("frageLabel")}</span>
        <TextMitSprache wert={frage} setzeWert={setFrage} platzhalter={t("fragePlatzhalter")} zeilen={3} />
      </label>

      <label className="feld">
        <span>{t("zielLabel")}</span>
        <input type="text" value={ziel} onChange={(e) => setZiel(e.target.value)} placeholder={t("zielPlatzhalter")} />
      </label>

      <div className="feld">
        <span>{t("bereicheLabel")}</span>
        <div className="chips">
          {bereiche.map((b) => (
            <button key={b} type="button" className="auswahl" aria-pressed onClick={() => setBereiche(bereiche.filter((x) => x !== b))}>
              {b} ✕
            </button>
          ))}
          <form
            className={styles.neu}
            onSubmit={(e) => {
              e.preventDefault();
              const name = neuerBereich.trim();
              if (name && !bereiche.includes(name)) setBereiche([...bereiche, name]);
              setNeuerBereich("");
            }}
          >
            <input type="text" value={neuerBereich} placeholder={t("bereichNeu")} onChange={(e) => setNeuerBereich(e.target.value)} />
          </form>
        </div>
      </div>

      <StufenRegler
        titel={t("stundensatzLabel")}
        stufen={SAETZE}
        wert={satz}
        setzeWert={setSatz}
        beschriftung={(s) => `${s} €/h`}
        hinweis={t("stundensatzHinweis")}
      />

      {fehler && <p className={styles.fehler}>{fehler}</p>}
      <button type="button" className="button" disabled={laedt || frage.trim().length < 10 || bereiche.length === 0} onClick={absenden}>
        {laedt ? t("bereitet") : t("absenden")}
      </button>
    </section>
  );
}
