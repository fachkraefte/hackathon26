"use client";

// Befragung v3 (KONZEPT_V3 §4): Bereich → Aufgaben des Bereichs → je Thema erzählen →
// Spiegelung, höchstens eine Rückfrage → Regler (wie oft, wie lange, wie sehr bremst es) und
// Übergabe (von/an) → bestätigen → Mitsprache → Rückmeldung nach Datenlage.
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Link } from "@/i18n/navigation";
import { sendeBeitrag, verstehe } from "@/lib/aktionen";
import { formatEuro, formatStunden, stundenProWoche } from "@/lib/rechnen";
import { haeufigkeiten, minutenStufen, type Haeufigkeit, type Punkt, type Verstaendnis } from "@/lib/typen";
import { TextMitSprache } from "../../_komponenten/eingabe";
import { StufenRegler } from "../../_komponenten/regler";
import styles from "./gespraech.module.css";

const MAX_THEMEN = 3;
const MAX_RUECKFRAGEN = 2; // im ganzen Gespräch, höchstens eine je Geschichte
const EIGENER = ""; // Auswahlwert für „eigener Bereich“ (von/an = null)

type Stufe = 1 | 2 | 3 | 4 | 5;

type Geschichte = {
  aufgabe: string;
  text: string;
  verstaendnis?: Verstaendnis;
  rueckfrageOffen: boolean;
  frage?: string; // gestellte Rückfrage, bleibt im Verlauf sichtbar
  antwort?: string;
  haeufigkeit: Haeufigkeit;
  minuten: number;
  bremst: Stufe;
  von: string | null;
  an: string | null;
  vonKi: { haeufigkeit: boolean; minuten: boolean; uebergabe: boolean };
};

type Ergebnis = Awaited<ReturnType<typeof sendeBeitrag>>;
type Phase = "start" | "themen" | "erzaehlen" | "verstanden" | "abschluss" | "karte" | "fertig";

type Props = {
  code: string;
  betrieb: string;
  anrede: "du" | "sie";
  ziel: string;
  deadline: string;
  bereiche: string[];
  extern: string[];
  chips: Record<string, string[]>;
};

export function Gespraech(props: Props) {
  const tRoh = useTranslations("Befragung");
  const tb = useTranslations("Begriffe");
  // Jeder Text bekommt die Anrede mit; Texte ohne Anrede ignorieren sie.
  const t = (schluessel: Parameters<typeof tRoh>[0], werte: Record<string, string | number> = {}) =>
    tRoh(schluessel, { anrede: props.anrede, ...werte });
  const [laedt, starte] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("start");
  const [bereich, setBereich] = useState<string | null>(null);
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const [eigenes, setEigenes] = useState("");
  const [geschichten, setGeschichten] = useState<Geschichte[]>([]);
  const [index, setIndex] = useState(0);
  const [rueckfragen, setRueckfragen] = useState(0);
  const [mitsprache, setMitsprache] = useState<Stufe>(3);
  const [gutLaeuft, setGutLaeuft] = useState("");
  const [bearbeiten, setBearbeiten] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);

  const aktuell = geschichten[index];
  const istLeitung = bereich === "Leitung";
  const aufgaben = bereich ? (props.chips[bereich] ?? []) : [];
  const ziele = [...props.bereiche, ...props.extern].filter((x) => x !== bereich);

  function aendere(i: number, aenderung: Partial<Geschichte>) {
    setGeschichten((alt) => alt.map((g, j) => (j === i ? { ...g, ...aenderung } : g)));
  }

  function themenBestaetigen() {
    const liste = [...gewaehlt, ...(eigenes.trim() ? [eigenes.trim()] : [])].slice(0, MAX_THEMEN);
    setGeschichten(
      liste.map((aufgabe) => ({
        aufgabe,
        text: "",
        rueckfrageOffen: false,
        haeufigkeit: "woechentlich",
        minuten: 15,
        bremst: 3,
        von: null,
        an: null,
        vonKi: { haeufigkeit: false, minuten: false, uebergabe: false },
      })),
    );
    setIndex(0);
    setPhase("erzaehlen");
  }

  function fragKi(i: number, text: string, rueckfrageErlaubt: boolean) {
    const g = geschichten[i];
    setFehler(null);
    starte(async () => {
      try {
        const antwort = await verstehe({
          code: props.code,
          bereich: bereich ?? "",
          aufgabe: g.aufgabe,
          geschichte: text,
          rueckfrageErlaubt,
        });
        const v = antwort.daten;
        const uebergabe = v.von !== null || v.an !== null;
        aendere(i, {
          verstaendnis: { ...v, spiegelung: v.spiegelung || t("spiegelungErsatz") },
          rueckfrageOffen: Boolean(v.rueckfrage),
          // Vorbelegen nur, wenn die KI etwas herausgehört hat – sonst bleibt der Wert der Person.
          haeufigkeit: v.haeufigkeit ?? g.haeufigkeit,
          minuten: v.minuten !== null ? naechsteStufe(v.minuten) : g.minuten,
          von: uebergabe ? v.von : g.von,
          an: uebergabe ? v.an : g.an,
          vonKi: {
            haeufigkeit: v.haeufigkeit !== null || g.vonKi.haeufigkeit,
            minuten: v.minuten !== null || g.vonKi.minuten,
            uebergabe: uebergabe || g.vonKi.uebergabe,
          },
        });
        if (v.rueckfrage) setRueckfragen((n) => n + 1);
        setPhase("verstanden");
      } catch (e) {
        setFehler(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function beantworteRueckfrage(antwort: string | null) {
    const g = aktuell;
    if (!antwort) {
      aendere(index, { rueckfrageOffen: false });
      return;
    }
    const frage = g.verstaendnis?.rueckfrage?.frage ?? "";
    aendere(index, { antwort, frage, rueckfrageOffen: false });
    fragKi(index, `${g.text}\n\n(Rückfrage: ${frage})\n${antwort}`, false);
  }

  function weiterNachGeschichte() {
    if (index + 1 < geschichten.length) {
      setIndex(index + 1);
      setPhase("erzaehlen");
    } else {
      setPhase("abschluss");
    }
  }

  // Punkte entstehen aus den verstandenen Geschichten; punktQuelle merkt sich die Herkunft für Korrekturen.
  const punktQuelle = geschichten.flatMap((g, i) => (g.verstaendnis ? [i] : []));
  const punkte: Omit<Punkt, "id">[] = punktQuelle.map((gi) => {
    const g = geschichten[gi];
    return {
      zeitfresser: g.aufgabe,
      titel: g.verstaendnis?.titel ?? g.aufgabe,
      aussage: g.verstaendnis?.aussage ?? g.text,
      haeufigkeit: g.haeufigkeit,
      minuten: g.minuten,
      beteiligt: g.verstaendnis?.beteiligt ?? [],
      folge: g.verstaendnis?.folge ?? undefined,
      bremst: g.bremst,
      von: g.von,
      an: g.an,
    };
  });

  function aendereVerstaendnis(i: number, aenderung: Partial<Pick<Verstaendnis, "titel" | "aussage">>) {
    const gi = punktQuelle[i];
    const v = geschichten[gi]?.verstaendnis;
    if (v) aendere(gi, { verstaendnis: { ...v, ...aenderung } });
  }

  function absenden() {
    if (!bereich) return;
    setFehler(null);
    setPhase("fertig");
    starte(async () => {
      try {
        setErgebnis(
          await sendeBeitrag({
            code: props.code,
            bereich,
            punkte,
            mitsprache,
            gutLaeuft: gutLaeuft.trim() || undefined,
          }),
        );
      } catch (e) {
        setFehler(e instanceof Error ? e.message : String(e));
        setPhase("karte");
      }
    });
  }

  const schritte: Phase[] = ["start", "themen", "erzaehlen", "abschluss", "karte", "fertig"];
  const fortschritt =
    phase === "erzaehlen" || phase === "verstanden"
      ? (2 + (index + (phase === "verstanden" ? 0.6 : 0.2)) / Math.max(geschichten.length, 1)) / 5
      : schritte.indexOf(phase) / 5;
  const ersteSpiegelung = geschichten.find((g) => g.verstaendnis?.spiegelung)?.verstaendnis?.spiegelung;

  return (
    <div className={styles.gespraech}>
      <div className={styles.fortschritt} aria-hidden>
        <span style={{ width: `${Math.round(fortschritt * 100)}%` }} />
      </div>

      {phase === "start" && (
        <section className={styles.schritt}>
          <p className="ueberzeile">{props.betrieb}</p>
          <h1>{t("startTitel")}</h1>
          <p className={styles.gross}>{t("einfuehrung", { betrieb: props.betrieb, ziel: props.ziel })}</p>
          <p className={styles.deadline}>{t("deadline", { deadline: props.deadline })}</p>
          <p className="leise">{t("dauer")}</p>
          <p className={styles.frageKlein}>{t("bereichFrage")}</p>
          <div className="chips">
            {props.bereiche.map((b) => (
              <button key={b} type="button" className="auswahl" aria-pressed={bereich === b} onClick={() => setBereich(b)}>
                {b}
              </button>
            ))}
          </div>
          <p className={`leise klein ${styles.schutz}`}>{istLeitung ? t("schutzLeitung") : t("schutz")}</p>
          <button type="button" className="button" disabled={!bereich} onClick={() => setPhase("themen")}>
            {t("los")}
          </button>
        </section>
      )}

      {phase === "themen" && (
        <section className={styles.schritt}>
          <p className="ueberzeile">{bereich}</p>
          <h1>{t("themenTitel")}</h1>
          <p className="leise">{t("themenText", { max: MAX_THEMEN })}</p>
          <div className={styles.themen}>
            {aufgaben.map((z) => {
              const an = gewaehlt.includes(z);
              const voll = !an && gewaehlt.length + (eigenes.trim() ? 1 : 0) >= MAX_THEMEN;
              return (
                <button
                  key={z}
                  type="button"
                  className={styles.thema}
                  aria-pressed={an}
                  disabled={voll}
                  onClick={() => setGewaehlt((alt) => (an ? alt.filter((x) => x !== z) : [...alt, z]))}
                >
                  {z}
                </button>
              );
            })}
          </div>
          <label className={styles.eigenes}>
            <input
              type="text"
              value={eigenes}
              maxLength={80}
              placeholder={t("eigenesPlatzhalter")}
              onChange={(e) => setEigenes(e.target.value)}
              disabled={!eigenes && gewaehlt.length >= MAX_THEMEN}
            />
            {eigenes.trim() && <span className="leise klein">{t("eigenesHinweis")}</span>}
          </label>
          <Knoepfe
            t={t}
            zurueck={() => setPhase("start")}
            weiter={themenBestaetigen}
            gesperrt={gewaehlt.length === 0 && !eigenes.trim()}
          />
        </section>
      )}

      {phase === "erzaehlen" && aktuell && (
        <section className={styles.schritt} key={`e-${index}`}>
          <p className="ueberzeile">{t("themaVon", { nr: index + 1, gesamt: geschichten.length })}</p>
          <h1>{aktuell.aufgabe}</h1>
          <div className={styles.ki}>{t("erzaehlFrage")}</div>
          <TextMitSprache
            wert={aktuell.text}
            setzeWert={(text) => aendere(index, { text })}
            platzhalter={t("erzaehlPlatzhalter")}
            autoFokus
          />
          {fehler && <p className={styles.fehler}>{fehler}</p>}
          <Knoepfe
            t={t}
            zurueck={() => (index === 0 ? setPhase("themen") : (setIndex(index - 1), setPhase("verstanden")))}
            weiter={() => fragKi(index, aktuell.text, rueckfragen < MAX_RUECKFRAGEN)}
            gesperrt={aktuell.text.trim().length < 3 || laedt}
            weiterText={laedt ? t("hoertZu") : t("weiter")}
          />
        </section>
      )}

      {phase === "verstanden" && aktuell?.verstaendnis && (
        <section className={styles.schritt} key={`v-${index}`}>
          <p className="ueberzeile">{t("themaVon", { nr: index + 1, gesamt: geschichten.length })}</p>
          <div className={styles.verlauf}>
            <p className={styles.person}>{aktuell.text}</p>
            {aktuell.antwort && aktuell.frage ? (
              <>
                <p className={styles.ki}>{aktuell.frage}</p>
                <p className={styles.person}>{aktuell.antwort}</p>
              </>
            ) : null}
            {!laedt && <p className={styles.ki}>{aktuell.verstaendnis.spiegelung}</p>}
          </div>

          {laedt ? (
            <p className={styles.tippt} aria-live="polite"><span /><span /><span /></p>
          ) : aktuell.rueckfrageOffen && aktuell.verstaendnis.rueckfrage ? (
            <div className={styles.rueckfrage}>
              <p className={styles.ki}>{aktuell.verstaendnis.rueckfrage.frage}</p>
              <div className="chips">
                {aktuell.verstaendnis.rueckfrage.chips.map((c) => (
                  <button key={c} type="button" className="auswahl" onClick={() => beantworteRueckfrage(c)}>
                    {c}
                  </button>
                ))}
                <button type="button" className={styles.ueberspringen} onClick={() => beantworteRueckfrage(null)}>
                  {t("ueberspringen")}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.regler}>
              <p className={styles.frageKlein}>{t("reglerTitel")}</p>
              <StufenRegler
                titel={t("wieOft")}
                stufen={haeufigkeiten}
                wert={aktuell.haeufigkeit}
                setzeWert={(h) => aendere(index, { haeufigkeit: h, vonKi: { ...aktuell.vonKi, haeufigkeit: false } })}
                beschriftung={(h) => tb(`haeufigkeit.${h}`)}
                hinweis={aktuell.vonKi.haeufigkeit ? t("herausgehoert") : undefined}
              />
              <StufenRegler
                titel={t("wieLange")}
                stufen={minutenStufen}
                wert={aktuell.minuten}
                setzeWert={(m) => aendere(index, { minuten: m, vonKi: { ...aktuell.vonKi, minuten: false } })}
                beschriftung={(m) => (m >= 60 ? t("stunden", { h: formatStunden(m / 60) }) : t("minuten", { m }))}
                hinweis={aktuell.vonKi.minuten ? t("herausgehoert") : undefined}
              />
              <StufenRegler
                titel={t("bremst")}
                stufen={[1, 2, 3, 4, 5] as const}
                wert={aktuell.bremst}
                setzeWert={(w) => aendere(index, { bremst: w })}
                beschriftung={(w) => tb(`bremst.${w}`)}
              />
              <div className={styles.uebergabe}>
                <p className={styles.frageKlein}>
                  {t("uebergabe")} {aktuell.vonKi.uebergabe && <span className={styles.hinweisKi}>{t("herausgehoert")}</span>}
                </p>
                <div className={styles.uebergabeZeile}>
                  <label>
                    <span className="leise klein">{t("von")}</span>
                    <select
                      value={aktuell.von ?? EIGENER}
                      onChange={(e) => aendere(index, { von: e.target.value || null, vonKi: { ...aktuell.vonKi, uebergabe: false } })}
                    >
                      <option value={EIGENER}>{t("eigenerBereich")}</option>
                      {ziele.map((z) => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </label>
                  <span aria-hidden className={styles.pfeil}>→</span>
                  <label>
                    <span className="leise klein">{t("an")}</span>
                    <select
                      value={aktuell.an ?? EIGENER}
                      onChange={(e) => aendere(index, { an: e.target.value || null, vonKi: { ...aktuell.vonKi, uebergabe: false } })}
                    >
                      <option value={EIGENER}>{t("eigenerBereich")}</option>
                      {ziele.map((z) => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </label>
                </div>
              </div>
              <p className={styles.live}>{t("liveZeit", { h: formatStunden(stundenProWoche(aktuell) * 4.33) })}</p>
              <Knoepfe t={t} zurueck={() => setPhase("erzaehlen")} weiter={weiterNachGeschichte} zurueckText={t("nochmalErzaehlen")} />
            </div>
          )}
          {fehler && <p className={styles.fehler}>{fehler}</p>}
        </section>
      )}

      {phase === "abschluss" && (
        <section className={styles.schritt}>
          <h1>{t("abschlussTitel")}</h1>
          <StufenRegler
            titel={t("mitsprache")}
            stufen={[1, 2, 3, 4, 5] as const}
            wert={mitsprache}
            setzeWert={setMitsprache}
            beschriftung={(w) => tb(`mitsprache.${w}`)}
          />
          <label className="feld">
            <span>{t("gutFrage")}</span>
            <input type="text" value={gutLaeuft} placeholder={t("gutPlatzhalter")} onChange={(e) => setGutLaeuft(e.target.value)} />
          </label>
          <Knoepfe t={t} zurueck={() => setPhase("verstanden")} weiter={() => setPhase("karte")} />
        </section>
      )}

      {phase === "karte" && (
        <section className={styles.schritt}>
          <p className="ueberzeile">{t("karteUeberzeile")}</p>
          <h1>{t("karteTitel")}</h1>
          <div className={styles.karte}>
            {punkte.map((p, i) => (
              <article key={i} className={styles.punkt}>
                {bearbeiten === i ? (
                  <>
                    <input type="text" value={p.titel} onChange={(e) => aendereVerstaendnis(i, { titel: e.target.value })} />
                    <textarea value={p.aussage} onChange={(e) => aendereVerstaendnis(i, { aussage: e.target.value })} />
                    <button type="button" className="button button--tuerkis" onClick={() => setBearbeiten(null)}>
                      {t("uebernehmen")}
                    </button>
                  </>
                ) : (
                  <>
                    <h2>{p.titel}</h2>
                    <p>{p.aussage}</p>
                    <p className={styles.punktZahlen}>
                      <span>{tb(`haeufigkeit.${p.haeufigkeit}`)}</span>
                      <span>{t("proMal", { dauer: p.minuten >= 60 ? t("stunden", { h: formatStunden(p.minuten / 60) }) : t("minuten", { m: p.minuten }) })}</span>
                      <strong>{t("proMonat", { h: formatStunden(stundenProWoche(p) * 4.33) })}</strong>
                    </p>
                    <button type="button" className={styles.korrigieren} onClick={() => setBearbeiten(i)}>
                      {t("stimmtNicht")}
                    </button>
                  </>
                )}
              </article>
            ))}
          </div>
          {fehler && <p className={styles.fehler}>{fehler}</p>}
          <Knoepfe t={t} zurueck={() => setPhase("abschluss")} weiter={absenden} gesperrt={bearbeiten !== null} weiterText={t("stimmtSo")} />
        </section>
      )}

      {phase === "fertig" && (
        <section className={styles.schritt}>
          {!ergebnis ? (
            <div className={styles.zusammenfuehren} aria-live="polite">
              <div className={styles.faeden} aria-hidden>
                {props.bereiche.map((b, i) => (
                  <span key={b} style={{ animationDelay: `${i * 0.25}s` }}>{b}</span>
                ))}
              </div>
              <p>{t("legtZusammen")}</p>
            </div>
          ) : (
            <>
              <p className="ueberzeile">{t("fertigUeberzeile")}</p>
              {/* Satz 1: individuell – die Spiegelung der eigenen Geschichte */}
              {ersteSpiegelung && <h1 className={styles.spiegelungTitel}>{ersteSpiegelung}</h1>}
              {/* Satz 2: nach Datenlage */}
              {ergebnis.erste ? (
                <p className={styles.gross}>{t("ersteStimme")}</p>
              ) : (
                <div className={styles.nichtAllein}>
                  <p className={styles.nichtAlleinTitel}>
                    {ergebnis.faeden.some((f) => f.andere > 0) ? t("nichtAllein") : t("neuNotiert")}
                  </p>
                  {ergebnis.faeden.map((f) => (
                    <div key={f.aufgabe} className={styles.fadenTreffer}>
                      <p className={styles.andere}>
                        {f.andere > 0 ? (
                          <>
                            {t("andere", { anzahl: f.andere })}
                            {f.bereiche.length > 0 && ` ${t("ausBereichen", { bereiche: f.bereiche.join(", ") })}`}
                          </>
                        ) : (
                          t("bisherAllein")
                        )}
                      </p>
                      <p className={styles.aufgabe}>{f.aufgabe}</p>
                      {f.euroJahr > 0 && <p className={styles.euro}>{t("kostetBetrieb", { euro: formatEuro(f.euroJahr) })}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="karte">
                <p className="leise">{t("teilgenommen", { n: ergebnis.teilgenommen, gesamt: ergebnis.mitarbeitende })}</p>
                <p><strong>{t("besprechung", { deadline: props.deadline })}</strong></p>
                <Link className="button button--tuerkis" href={`/analyse/${props.code}`}>
                  {t("zurAnalyse")}
                </Link>
              </div>
              {ergebnis.ausDemo && <p className="leise klein">{t("demoHinweis")}</p>}
            </>
          )}
          {fehler && <p className={styles.fehler}>{fehler}</p>}
        </section>
      )}
    </div>
  );
}

function naechsteStufe(minuten: number) {
  return minutenStufen.reduce((beste, stufe) =>
    Math.abs(stufe - minuten) < Math.abs(beste - minuten) ? stufe : beste,
  );
}

function Knoepfe({
  t,
  zurueck,
  weiter,
  gesperrt = false,
  weiterText,
  zurueckText,
}: {
  t: (schluessel: "zurueck" | "weiter") => string;
  zurueck: () => void;
  weiter: () => void;
  gesperrt?: boolean;
  weiterText?: string;
  zurueckText?: string;
}) {
  return (
    <div className={styles.knoepfe}>
      <button type="button" className="button button--ghost" onClick={zurueck}>{zurueckText ?? t("zurueck")}</button>
      <button type="button" className="button" disabled={gesperrt} onClick={weiter}>{weiterText ?? t("weiter")}</button>
    </div>
  );
}
