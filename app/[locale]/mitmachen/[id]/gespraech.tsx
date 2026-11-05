"use client";

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

type Geschichte = {
  zeitfresser: string;
  text: string;
  verstaendnis?: Verstaendnis;
  rueckfrageOffen: boolean;
  frage?: string; // gestellte Rückfrage, bleibt im Verlauf sichtbar
  antwort?: string;
  haeufigkeit: Haeufigkeit;
  minuten: number;
  vonKi: { haeufigkeit: boolean; minuten: boolean };
};

type Ergebnis = Awaited<ReturnType<typeof sendeBeitrag>>;

type Phase = "start" | "themen" | "erzaehlen" | "verstanden" | "abschluss" | "karte" | "fertig";

type Props = {
  id: string;
  betrieb: string;
  leitung: string;
  frage: string;
  bereiche: string[];
  zeitfresser: string[];
  besprechungAm?: string;
};

export function Gespraech(props: Props) {
  const t = useTranslations("Mitmachen");
  const tb = useTranslations("Begriffe");
  const [laedt, starte] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("start");
  const [bereich, setBereich] = useState<string | null>(null);
  const [rolleZeigen, setRolleZeigen] = useState(false);
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const [eigenes, setEigenes] = useState("");
  const [geschichten, setGeschichten] = useState<Geschichte[]>([]);
  const [index, setIndex] = useState(0);
  const [rueckfragen, setRueckfragen] = useState(0);
  const [bremst, setBremst] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [gutLaeuft, setGutLaeuft] = useState("");
  const [bearbeiten, setBearbeiten] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);

  const aktuell = geschichten[index];
  const istLeitung = bereich === "Leitung";

  function aendere(i: number, aenderung: Partial<Geschichte>) {
    setGeschichten((alt) => alt.map((g, j) => (j === i ? { ...g, ...aenderung } : g)));
  }

  function themenBestaetigen() {
    const liste = [...gewaehlt, ...(eigenes.trim() ? [eigenes.trim()] : [])].slice(0, MAX_THEMEN);
    setGeschichten(
      liste.map((z) => ({
        zeitfresser: z,
        text: "",
        rueckfrageOffen: false,
        haeufigkeit: "woechentlich",
        minuten: 15,
        vonKi: { haeufigkeit: false, minuten: false },
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
          id: props.id,
          bereich: bereich ?? "",
          zeitfresser: g.zeitfresser,
          geschichte: text,
          rueckfrageErlaubt,
        });
        const v = antwort.daten;
        aendere(i, {
          verstaendnis: { ...v, spiegelung: v.spiegelung || t("spiegelungErsatz") },
          rueckfrageOffen: Boolean(v.rueckfrage),
          // Vorbelegen nur, wenn die KI etwas herausgehört hat – sonst bleibt der Wert der Person.
          haeufigkeit: v.haeufigkeit ?? g.haeufigkeit,
          minuten: v.minuten !== null ? naechsteStufe(v.minuten) : g.minuten,
          vonKi: {
            haeufigkeit: v.haeufigkeit !== null || g.vonKi.haeufigkeit,
            minuten: v.minuten !== null || g.vonKi.minuten,
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
  const punkte: Punkt[] = punktQuelle.map((gi, i) => {
    const g = geschichten[gi];
    return {
      id: `entwurf-${i}`,
      zeitfresser: g.zeitfresser,
      titel: g.verstaendnis?.titel ?? g.zeitfresser,
      aussage: g.verstaendnis?.aussage ?? g.text,
      haeufigkeit: g.haeufigkeit,
      minuten: g.minuten,
      beteiligt: g.verstaendnis?.beteiligt ?? [],
      folge: g.verstaendnis?.folge ?? undefined,
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
        const antwort = await sendeBeitrag({
          bestandsaufnahmeId: props.id,
          bereich,
          istLeitung,
          rolleZeigen: istLeitung || rolleZeigen,
          punkte,
          bremst,
          gutLaeuft: gutLaeuft.trim() || undefined,
        });
        setErgebnis(antwort);
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

  return (
    <div className={styles.gespraech}>
      <div className={styles.fortschritt} aria-hidden>
        <span style={{ width: `${Math.round(fortschritt * 100)}%` }} />
      </div>

      {phase === "start" && (
        <section className={styles.schritt}>
          <p className="ueberzeile">{props.betrieb}</p>
          <h1>{t("startTitel", { leitung: props.leitung })}</h1>
          <blockquote className={styles.frage}>„{props.frage}“</blockquote>
          <p className={styles.gross}>{t("startText")}</p>
          <p className={styles.frageKlein}>{t("bereichFrage")}</p>
          <div className="chips">
            {props.bereiche.map((b) => (
              <button key={b} type="button" className="auswahl" aria-pressed={bereich === b} onClick={() => setBereich(b)}>
                {b}
              </button>
            ))}
          </div>
          {bereich && !istLeitung && (
            <label className={styles.zustimmung}>
              <input type="checkbox" checked={rolleZeigen} onChange={(e) => setRolleZeigen(e.target.checked)} />
              <span>{t("zustimmung")}</span>
            </label>
          )}
          <p className={`leise klein ${styles.schutz}`}>{istLeitung ? t("schutzLeitung") : t("schutz")}</p>
          <button type="button" className="button" disabled={!bereich} onClick={() => setPhase("themen")}>
            {t("los")}
          </button>
        </section>
      )}

      {phase === "themen" && (
        <section className={styles.schritt}>
          <h1>{t("themenTitel")}</h1>
          <p className="leise">{t("themenText", { max: MAX_THEMEN })}</p>
          <div className={styles.themen}>
            {props.zeitfresser.map((z) => {
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
          <input
            type="text"
            value={eigenes}
            placeholder={t("eigenesPlatzhalter")}
            onChange={(e) => setEigenes(e.target.value)}
            disabled={!eigenes && gewaehlt.length >= MAX_THEMEN}
          />
          <Knoepfe
            zurueck={() => setPhase("start")}
            weiter={themenBestaetigen}
            gesperrt={gewaehlt.length === 0 && !eigenes.trim()}
          />
        </section>
      )}

      {phase === "erzaehlen" && aktuell && (
        <section className={styles.schritt} key={`e-${index}`}>
          <p className="ueberzeile">{t("themaVon", { nr: index + 1, gesamt: geschichten.length })}</p>
          <h1>{aktuell.zeitfresser}</h1>
          <div className={styles.ki}>{t("erzaehlFrage")}</div>
          <TextMitSprache
            wert={aktuell.text}
            setzeWert={(text) => aendere(index, { text })}
            platzhalter={t("erzaehlPlatzhalter")}
            autoFokus
          />
          {fehler && <p className={styles.fehler}>{fehler}</p>}
          <Knoepfe
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
              <p className={styles.live}>
                {t("liveZeit", { h: formatStunden(stundenProWoche(aktuell) * 4.33) })}
              </p>
              <Knoepfe
                zurueck={() => setPhase("erzaehlen")}
                weiter={weiterNachGeschichte}
                zurueckText={t("nochmalErzaehlen")}
              />
            </div>
          )}
          {fehler && <p className={styles.fehler}>{fehler}</p>}
        </section>
      )}

      {phase === "abschluss" && (
        <section className={styles.schritt}>
          <h1>{t("abschlussTitel")}</h1>
          <StufenRegler
            titel={t("bremstFrage")}
            stufen={[1, 2, 3, 4, 5] as const}
            wert={bremst}
            setzeWert={setBremst}
            beschriftung={(w) => tb(`bremst.${w}`)}
          />
          <label className="feld">
            <span>{t("gutFrage")}</span>
            <input type="text" value={gutLaeuft} placeholder={t("gutPlatzhalter")} onChange={(e) => setGutLaeuft(e.target.value)} />
          </label>
          <Knoepfe zurueck={() => setPhase("verstanden")} weiter={() => setPhase("karte")} />
        </section>
      )}

      {phase === "karte" && (
        <section className={styles.schritt}>
          <p className="ueberzeile">{t("karteUeberzeile")}</p>
          <h1>{t("karteTitel")}</h1>
          <div className={styles.karte}>
            {punkte.map((p, i) => (
              <article key={p.id} className={styles.punkt}>
                {bearbeiten === i ? (
                  <>
                    <input
                      type="text"
                      value={p.titel}
                      onChange={(e) => aendereVerstaendnis(i, { titel: e.target.value })}
                    />
                    <textarea
                      value={p.aussage}
                      onChange={(e) => aendereVerstaendnis(i, { aussage: e.target.value })}
                    />
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
          <Knoepfe
            zurueck={() => setPhase("abschluss")}
            weiter={absenden}
            gesperrt={bearbeiten !== null}
            weiterText={t("stimmtSo")}
          />
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
              <h1>{t("fertigTitel")}</h1>
              {ergebnis.faeden.length > 0 && (
                <div className={styles.nichtAllein}>
                  <p className={styles.nichtAlleinTitel}>{t("nichtAllein")}</p>
                  {ergebnis.faeden.map((f) => (
                    <div key={f.aufgabe} className={styles.fadenTreffer}>
                      {f.andere > 0 && (
                        <p className={styles.andere}>
                          {t("andere", { anzahl: f.andere })}
                          {f.bereiche.length > 0 && ` ${t("ausBereichen", { bereiche: f.bereiche.join(", ") })}`}
                        </p>
                      )}
                      <p className={styles.aufgabe}>{f.aufgabe}</p>
                      <p className={styles.euro}>{t("kostetBetrieb", { euro: formatEuro(f.euroJahr) })}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className={styles.meineZeit}>
                {t("meineZeit", { h: formatStunden(ergebnis.meineStundenWoche * 4.33) })}
              </p>
              <div className="karte">
                <h2 className={styles.kleinTitel}>{t("wasPassiert")}</h2>
                <p>
                  {props.besprechungAm
                    ? t("besprechung", { datum: new Date(props.besprechungAm).toLocaleDateString("de-DE", { day: "numeric", month: "long" }) })
                    : t("besprechungOhneDatum")}
                </p>
                <Link className="button button--tuerkis" href={`/ergebnis/${props.id}`}>
                  {t("zumBild")}
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
  zurueck,
  weiter,
  gesperrt = false,
  weiterText,
  zurueckText,
}: {
  zurueck: () => void;
  weiter: () => void;
  gesperrt?: boolean;
  weiterText?: string;
  zurueckText?: string;
}) {
  const t = useTranslations("Mitmachen");
  return (
    <div className={styles.knoepfe}>
      <button type="button" className="button button--ghost" onClick={zurueck}>{zurueckText ?? t("zurueck")}</button>
      <button type="button" className="button" disabled={gesperrt} onClick={weiter}>{weiterText ?? t("weiter")}</button>
    </div>
  );
}
