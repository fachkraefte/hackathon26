"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { beschliesse } from "@/lib/aktionen";
import { euroProJahr, formatEuro, formatStunden } from "@/lib/rechnen";
import type { Beschluss, Faden, Herkunft, Loesungsart, Reifegrad } from "@/lib/typen";
import { ArtChip, HerkunftHinweis, ReifegradChip } from "../../_komponenten/kennzeichnung";
import { StufenRegler } from "../../_komponenten/regler";
import styles from "./ergebnis.module.css";

export type FadenAnsicht = Omit<Faden, "ansaetze"> & {
  stundenWoche: number;
  personen: number;
  ansaetze: {
    art: Loesungsart;
    text: string;
    warum: string;
    wasFehlt: string;
    herkunft: Herkunft;
    quelle: string | null;
    reifegrad: Reifegrad | null;
  }[];
};

export type ErgebnisDaten = {
  id: string;
  betrieb: string;
  mitarbeitende: number;
  leitung: string;
  frage: string;
  ziel: string;
  stundensatz: number;
  arbeitswochen: number;
  beitraege: number;
  ausDemo: boolean;
  faeden: FadenAnsicht[];
  bremst: { bereich: string; mittel: number; anzahl: number }[];
  staerken: string[];
  offeneFragen: string[];
  beschluesse: Beschluss[];
};

const SAETZE = [30, 35, 40, 45, 50, 55, 60, 65, 70, 80, 90, 100] as const;
type Satz = (typeof SAETZE)[number];
const FARBEN = ["var(--brand-primary)", "var(--brand-highlight)", "var(--art-software)", "var(--art-kiAssistenz)"];

export function Ergebnis({ daten }: { daten: ErgebnisDaten }) {
  const t = useTranslations("Ergebnis");
  const [satz, setSatz] = useState<Satz>(
    SAETZE.find((s) => s >= daten.stundensatz) ?? SAETZE[SAETZE.length - 1],
  );
  const [praesentation, setPraesentation] = useState(false);
  const [folie, setFolie] = useState(0);

  const rechne = (stunden: number) => euroProJahr(stunden, { stundensatz: satz, arbeitswochen: daten.arbeitswochen });
  const gesamtStunden = daten.faeden.reduce((s, f) => s + f.stundenWoche, 0);
  const gesamtEuro = rechne(gesamtStunden);
  const maxEuro = Math.max(...daten.faeden.map((f) => rechne(f.stundenWoche)), 1);

  const ueberblick = (
    <section className={styles.ueberblick}>
      <p className="ueberzeile">{daten.betrieb}</p>
      <h1>{t("titel")}</h1>
      <p className={styles.frage}>
        <span>{daten.leitung}:</span> „{daten.frage}“
      </p>
      <div className={styles.kennzahlen}>
        <div>
          <ZaehlZahl wert={gesamtEuro} format={formatEuro} className={styles.euroGross} />
          <span>{t("proJahr")}</span>
        </div>
        <div>
          <strong>{formatStunden(gesamtStunden)} h</strong>
          <span>{t("proWoche")}</span>
        </div>
        <div>
          <strong>{daten.beitraege}/{daten.mitarbeitende}</strong>
          <span>{t("stimmen")}</span>
        </div>
      </div>
      <div className={styles.verteilung} role="img" aria-label={t("verteilungAria")}>
        {daten.faeden.map((f, i) => (
          <span key={f.id} style={{ flexGrow: Math.max(f.stundenWoche, 0.1), background: FARBEN[i % FARBEN.length] }} />
        ))}
      </div>
      <ol className={styles.legende}>
        {daten.faeden.map((f, i) => (
          <li key={f.id}>
            <i style={{ background: FARBEN[i % FARBEN.length] }} />
            <a href={`#${f.id}`}>{f.aufgabe}</a>
            <strong>{formatEuro(rechne(f.stundenWoche))}</strong>
          </li>
        ))}
      </ol>
      <div className={styles.satz}>
        <StufenRegler
          titel={t("stundensatz")}
          stufen={SAETZE}
          wert={satz}
          setzeWert={setSatz}
          beschriftung={(s) => `${s} €/h`}
        />
        <p className="leise klein">{t("rechenweg", { wochen: daten.arbeitswochen })}</p>
      </div>
    </section>
  );

  const fadenTeile = daten.faeden.map((f, i) => (
    <FadenAbschnitt
      key={f.id}
      faden={f}
      nummer={i + 1}
      farbe={FARBEN[i % FARBEN.length]}
      euro={rechne(f.stundenWoche)}
      anteil={rechne(f.stundenWoche) / maxEuro}
      id={daten.id}
      beschluss={daten.beschluesse.find((b) => b.fadenId === f.id)}
    />
  ));

  const stimmung = (
    <section className={styles.abschnitt}>
      <h2>{t("stimmungTitel")}</h2>
      <div className={styles.stimmung}>
        {daten.bremst.map((b) => (
          <div key={b.bereich} className={styles.stimmungZeile}>
            <span>{b.bereich}</span>
            <span className={styles.stimmungSpur}>
              <span style={{ width: `${(b.mittel / 5) * 100}%` }} />
            </span>
            <strong>{formatStunden(b.mittel)}</strong>
          </div>
        ))}
      </div>
      <p className="leise klein">{t("stimmungSkala")}</p>
      {daten.staerken.length > 0 && (
        <div className={styles.staerken}>
          <h3>{t("staerkenTitel")}</h3>
          <ul>{daten.staerken.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
    </section>
  );

  const offen = (
    <section className={styles.abschnitt}>
      <h2>{t("offenTitel")}</h2>
      <ul className={styles.offen}>{daten.offeneFragen.map((q) => <li key={q}>{q}</li>)}</ul>
      <p className={styles.ziel}>
        <span className="ueberzeile">{t("zielTitel")}</span>
        {daten.ziel}
      </p>
    </section>
  );

  const folien: ReactNode[] = [ueberblick, ...fadenTeile, stimmung, offen];

  useEffect(() => {
    if (!praesentation) return;
    function taste(e: KeyboardEvent) {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        setFolie((n) => Math.min(n + 1, folien.length - 1));
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        setFolie((n) => Math.max(n - 1, 0));
      } else if (e.key === "Escape") {
        setPraesentation(false);
      }
    }
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, [praesentation, folien.length]);

  if (praesentation) {
    return (
      <div className={styles.buehne}>
        <div className={styles.folie} key={folie}>{folien[folie]}</div>
        <div className={styles.buehnenLeiste}>
          <button type="button" className="button button--ghost" onClick={() => setPraesentation(false)}>{t("beenden")}</button>
          <span className="leise">{folie + 1} / {folien.length}</span>
          <span className={styles.pfeile}>
            <button type="button" className="button button--ghost" disabled={folie === 0} onClick={() => setFolie(folie - 1)}>←</button>
            <button type="button" className="button" disabled={folie === folien.length - 1} onClick={() => setFolie(folie + 1)}>→</button>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.seite}>
      <div className={styles.werkzeug}>
        <button type="button" className="button button--ghost" onClick={() => { setFolie(0); setPraesentation(true); }}>
          {t("praesentieren")}
        </button>
        <Link href={`/mitmachen/${daten.id}`} className="button button--ghost">{t("mitmachen")}</Link>
      </div>
      {ueberblick}
      {daten.ausDemo && <p className={styles.demo}>{t("demoHinweis")}</p>}
      {fadenTeile}
      <div className={styles.zweiSpalten}>
        {stimmung}
        {offen}
      </div>
    </div>
  );
}

function FadenAbschnitt({
  faden,
  nummer,
  farbe,
  euro,
  anteil,
  id,
  beschluss,
}: {
  faden: FadenAnsicht;
  nummer: number;
  farbe: string;
  euro: number;
  anteil: number;
  id: string;
  beschluss?: Beschluss;
}) {
  const t = useTranslations("Ergebnis");
  const n = faden.sichtweisen.length;

  return (
    <section id={faden.id} className={styles.faden} style={{ "--farbe": farbe }}>
      <p className={styles.fadenNr}>{t("faden", { nr: nummer })}</p>

      <div className={styles.fadenBild}>
        <ul className={styles.sichtweisen} style={{ gridTemplateRows: `repeat(${n}, 1fr)` }}>
          {faden.sichtweisen.map((s) => (
            <li key={s.bereich}>
              <span className={styles.bereich}>{s.bereich}</span>
              <span className={styles.zitat}>„{s.aussage}“</span>
            </li>
          ))}
        </ul>
        <svg className={styles.linien} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {faden.sichtweisen.map((s, i) => {
            const y = ((i + 0.5) / n) * 100;
            return (
              <path
                key={s.bereich}
                d={`M 0 ${y} C 55 ${y}, 45 50, 100 50`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}
        </svg>
        <div className={styles.aufgabe}>
          <span className={styles.aufgabeLabel}>{t("gemeinsameAufgabe")}</span>
          <p>{faden.aufgabe}</p>
          <div className={styles.kosten}>
            <strong>{formatEuro(euro)}</strong>
            <span>{t("kostenZeile", { h: formatStunden(faden.stundenWoche), personen: faden.personen })}</span>
            <span className={styles.kostenSpur}><span style={{ width: `${Math.max(anteil, 0.04) * 100}%` }} /></span>
          </div>
        </div>
      </div>

      <p className={styles.problem}>{faden.problem}</p>
      {faden.unterschied && (
        <p className={styles.unterschied}>
          <strong>{t("unterschied")}</strong> {faden.unterschied}
        </p>
      )}

      <h3 className={styles.zwischen}>{t("ansaetze")}</h3>
      <div className={styles.ansaetze}>
        {faden.ansaetze.map((a, i) => (
          <article key={a.text} className={styles.ansatz} style={{ "--art": `var(--art-${a.art})` }}>
            <div className="chips">
              {i === 0 && <span className={`chip ${styles.zuerst}`}>{t("zuerst")}</span>}
              <ArtChip art={a.art} />
              {a.reifegrad && <ReifegradChip reifegrad={a.reifegrad} />}
            </div>
            <p className={styles.ansatzText}>{a.text}</p>
            <p className="klein"><strong>{t("warum")}</strong> {a.warum}</p>
            <p className="klein leise"><strong>{t("wasFehlt")}</strong> {a.wasFehlt}</p>
            <HerkunftHinweis herkunft={a.herkunft} quelle={a.quelle} />
          </article>
        ))}
      </div>

      <ErsterSchritt id={id} fadenId={faden.id} text={faden.ersterSchritt} beschluss={beschluss} />
    </section>
  );
}

function ErsterSchritt({ id, fadenId, text, beschluss }: { id: string; fadenId: string; text: string; beschluss?: Beschluss }) {
  const t = useTranslations("Ergebnis");
  const [wer, setWer] = useState(beschluss?.verantwortlich ?? "");
  const [bis, setBis] = useState(beschluss?.bis ?? "");
  const [fertig, setFertig] = useState(Boolean(beschluss));
  const [fehler, setFehler] = useState<string | null>(null);
  const [laedt, starte] = useTransition();

  return (
    <div className={`${styles.schritt} ${fertig ? styles.beschlossen : ""}`}>
      <span className="ueberzeile">{fertig ? t("beschlossen") : t("ersterSchritt")}</span>
      <p className={styles.schrittText}>{text}</p>
      {fertig ? (
        <p className={styles.schrittWer}>
          {t("werBis", { wer, bis: bis ? new Date(bis).toLocaleDateString("de-DE") : "–" })}{" "}
          <button type="button" className={styles.aendern} onClick={() => setFertig(false)}>{t("aendern")}</button>
        </p>
      ) : (
        <form
          className={styles.schrittForm}
          onSubmit={(e) => {
            e.preventDefault();
            setFehler(null);
            starte(async () => {
              try {
                await beschliesse(id, { fadenId, verantwortlich: wer, bis });
                setFertig(true);
              } catch (err) {
                setFehler(err instanceof Error ? err.message : String(err));
              }
            });
          }}
        >
          <input type="text" required value={wer} placeholder={t("werPlatzhalter")} onChange={(e) => setWer(e.target.value)} />
          <input type="date" required value={bis} onChange={(e) => setBis(e.target.value)} />
          <button type="submit" className="button" disabled={laedt}>{t("machenWir")}</button>
        </form>
      )}
      {fehler && <p className={styles.fehler}>{fehler}</p>}
    </div>
  );
}

/** Zählt beim ersten Anzeigen hoch und folgt danach dem Wert (z. B. beim Verschieben des Stundensatzes). */
function ZaehlZahl({ wert, format, className }: { wert: number; format: (n: number) => string; className?: string }) {
  const [anzeige, setAnzeige] = useState(0);
  useEffect(() => {
    let rahmen = 0;
    const start = performance.now();
    const von = anzeige;
    const schritt = (jetzt: number) => {
      const p = Math.min((jetzt - start) / 700, 1);
      setAnzeige(von + (wert - von) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) rahmen = requestAnimationFrame(schritt);
    };
    rahmen = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(rahmen);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startet nur bei neuem Zielwert
  }, [wert]);
  return <strong className={className}>{format(anzeige)}</strong>;
}
