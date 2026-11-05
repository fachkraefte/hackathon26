"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";
import {
  Aufgabenkarte,
  belastungsarten,
  dimensionen,
  haeufigkeiten,
  type AllgemeineFrage,
  type Belastungsart,
  type Bereich,
  type Dimension,
  Haeufigkeit,
  type KatalogAufgabe,
  type Rolle,
  type Wert,
  type WissensEintrag,
} from "@/lib/typen";
import { Analyse } from "./analyse";
import styles from "./abfrage.module.css";

type AufgabenAntwort = {
  text: string;
  haeufigkeit?: Haeufigkeit;
  stunden?: number;
  belastung: Belastungsart[];
};

type Allgemein = Record<AllgemeineFrage["id"], string>;

type Schritt =
  | { art: "start" }
  | { art: "rollen" }
  | { art: "aufgaben" }
  | { art: "aufgabe"; index: number }
  | { art: "allgemein" }
  | { art: "einschaetzung" }
  | { art: "karte" }
  | { art: "analyse" };

type Props = {
  betriebName: string;
  bereich: Bereich;
  alleBereiche: string[];
  kleineGruppe: boolean;
  rollen: Rolle[];
  aufgaben: KatalogAufgabe[];
  allgemeineFragen: AllgemeineFrage[];
  wissen: WissensEintrag[];
  demoAntwort: boolean;
};

const leerAllgemein: Allgemein = { gutLaeuft: "", kommunikation: "", zeitfresser: "", workLife: "", wunsch: "" };

export function Abfrage(props: Props) {
  const t = useTranslations("Abfrage");
  const tb = useTranslations("Begriffe");

  const [schritt, setSchritt] = useState<Schritt>({ art: "start" });
  const [sichtbarkeit, setSichtbarkeit] = useState<"zusammenlegen" | "mitRolleZeigen">();
  const [rollen, setRollen] = useState<string[]>([]);
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const [antworten, setAntworten] = useState<Record<string, AufgabenAntwort>>({});
  const [allgemein, setAllgemein] = useState<Allgemein>(leerAllgemein);
  const [kommunikationVon, setKommunikationVon] = useState("");
  const [einschaetzung, setEinschaetzung] = useState<Partial<Record<Dimension, Wert>>>({});
  const [karte, setKarte] = useState<Aufgabenkarte | null>(null);
  const [kartenFehler, setKartenFehler] = useState<string | null>(null);

  const aufgabeZu = (id: string) => props.aufgaben.find((a) => a.id === id);
  const antwortZu = (id: string): AufgabenAntwort => antworten[id] ?? { text: "", belastung: [] };

  function setzeAntwort(id: string, aenderung: Partial<AufgabenAntwort>) {
    setAntworten((alt) => ({ ...alt, [id]: { ...antwortZu(id), ...aenderung } }));
  }

  function waehleRolle(id: string) {
    const neu = rollen.includes(id) ? rollen.filter((r) => r !== id) : [...rollen, id];
    setRollen(neu);
    // Aufgaben der Rollen vorschlagen; die Person kann abwählen und ergänzen.
    const vorschlag = props.rollen
      .filter((r) => neu.includes(r.id))
      .flatMap((r) => r.aufgaben)
      .filter((a) => props.aufgaben.some((k) => k.id === a));
    setGewaehlt([...new Set(vorschlag)]);
  }

  function demoEinsetzen() {
    // Spickzettel aus DEMO_BETRIEBE.md (M6, Montage)
    setRollen(["montage"]);
    setGewaehlt(["montage"]);
    setAntworten({
      montage: {
        text: "Letzte Woche war ein Geländer fünf Zentimeter zu kurz, weil im Aufmaß eine Maßangabe fehlte. Wir haben vor Ort gekürzt und neu angeschweißt. So etwas passiert zwei-, dreimal im Monat, jedes Mal etwa zwei Stunden.",
        haeufigkeit: "woechentlich",
        stunden: 1.5,
        belastung: ["zeit", "fehleranfaellig"],
      },
    });
    setAllgemein({ ...leerAllgemein, gutLaeuft: "Mit meinem Kollegen im Trupp klappt es super." });
    setEinschaetzung({
      informationUebergaben: 1,
      dokumentationVerwaltung: 2,
      planungKoordination: 2,
      koerperlicheBelastung: 2,
      wissenEinarbeitung: 4,
      digitaleWerkzeuge: 1,
    });
    setSchritt({ art: "aufgabe", index: 0 });
  }

  function baueKarte(): Aufgabenkarte {
    const kommunikationText = allgemein.kommunikation.trim();
    return {
      antwortId: `live-${props.bereich.id}`,
      rollen,
      aufgaben: gewaehlt.map((id) => {
        const a = antwortZu(id);
        return {
          id,
          titel: aufgabeZu(id)?.titel ?? id,
          beschreibung: a.text.trim(),
          haeufigkeit: a.haeufigkeit ?? "selten",
          stundenProWoche: a.stunden,
          belastung: a.belastung,
          aussage: a.text.trim(),
        };
      }),
      wasGutLaeuft: allgemein.gutLaeuft.trim() ? [allgemein.gutLaeuft.trim()] : [],
      kommunikation: kommunikationText
        ? { von: kommunikationVon || t("unbekannterBereich"), an: props.bereich.name, problem: kommunikationText }
        : undefined,
      zeitfresser: allgemein.zeitfresser.trim() || undefined,
      workLife: allgemein.workLife.trim() || undefined,
      wunsch: allgemein.wunsch.trim() || undefined,
      bestaetigt: false,
      korrigiert: false,
    };
  }

  function aendereKarte(aufgabeId: string, aenderung: Partial<Aufgabenkarte["aufgaben"][number]>) {
    setKarte((alt) =>
      alt && {
        ...alt,
        korrigiert: true,
        aufgaben: alt.aufgaben.map((a) => (a.id === aufgabeId ? { ...a, ...aenderung } : a)),
      },
    );
  }

  function bestaetige() {
    if (!karte) return;
    const geprueft = Aufgabenkarte.safeParse({ ...karte, bestaetigt: true });
    if (!geprueft.success) {
      setKartenFehler(z.prettifyError(geprueft.error));
      return;
    }
    setKartenFehler(null);
    setKarte(geprueft.data);
    setSchritt({ art: "analyse" });
  }

  // Aufgaben der gewählten Rollen zuerst; Reihenfolge bleibt beim Antippen stabil.
  const zurRolle = new Set(props.rollen.filter((r) => rollen.includes(r.id)).flatMap((r) => r.aufgaben));
  const aufgabenSortiert = [...props.aufgaben].sort(
    (a, b) => Number(zurRolle.has(b.id)) - Number(zurRolle.has(a.id)),
  );

  // ---------- Fortschritt ----------
  const reihenfolge: Schritt["art"][] = ["start", "rollen", "aufgaben", "aufgabe", "allgemein", "einschaetzung", "karte", "analyse"];
  const fortschritt =
    schritt.art === "aufgabe"
      ? (3 + (schritt.index + 1) / Math.max(gewaehlt.length, 1)) / (reihenfolge.length - 1)
      : reihenfolge.indexOf(schritt.art) / (reihenfolge.length - 1);

  return (
    <div className={styles.abfrage}>
      <div className={styles.fortschritt} aria-hidden>
        <span style={{ width: `${Math.round(fortschritt * 100)}%` }} />
      </div>

      {schritt.art === "start" && (
        <section>
          <p className="ueberzeile">{t("ueberzeile", { betrieb: props.betriebName, bereich: props.bereich.name })}</p>
          <h1>{t("startTitel")}</h1>
          <p className={styles.gross}>{t("startText")}</p>
          <ul className={styles.versprechen}>
            <li>{t("versprechen1")}</li>
            <li>{t("versprechen2")}</li>
            <li>{t("versprechen3")}</li>
          </ul>
          {props.kleineGruppe && (
            <div className="karte">
              <p><strong>{t("kleineGruppeTitel")}</strong></p>
              <p className="leise klein">{t("kleineGruppeText")}</p>
              <div className="chips">
                {(["zusammenlegen", "mitRolleZeigen"] as const).map((s) => (
                  <button key={s} type="button" className="auswahl" aria-pressed={sichtbarkeit === s} onClick={() => setSichtbarkeit(s)}>
                    {t(`sichtbarkeit.${s}`)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className={styles.aktionen}>
            <button
              type="button"
              className="button"
              disabled={props.kleineGruppe && !sichtbarkeit}
              onClick={() => setSchritt({ art: "rollen" })}
            >
              {t("los")}
            </button>
            {props.demoAntwort && (
              <button type="button" className="button button--ghost" onClick={demoEinsetzen}>
                {t("demoEinsetzen")}
              </button>
            )}
          </div>
        </section>
      )}

      {schritt.art === "rollen" && (
        <section>
          <h1>{t("rollenTitel")}</h1>
          <p className="leise">{t("rollenText")}</p>
          <div className={styles.kacheln}>
            {props.rollen.map((r) => (
              <button key={r.id} type="button" className={styles.kachel} aria-pressed={rollen.includes(r.id)} onClick={() => waehleRolle(r.id)}>
                {r.name}
              </button>
            ))}
          </div>
          <Weiter
            zurueck={() => setSchritt({ art: "start" })}
            weiter={() => setSchritt({ art: "aufgaben" })}
            gesperrt={rollen.length === 0}
          />
        </section>
      )}

      {schritt.art === "aufgaben" && (
        <section>
          <h1>{t("aufgabenTitel")}</h1>
          <p className="leise">{t("aufgabenText")}</p>
          <div className={styles.kacheln}>
            {aufgabenSortiert.map((a) => (
              <button
                key={a.id}
                type="button"
                className={styles.kachel}
                aria-pressed={gewaehlt.includes(a.id)}
                onClick={() =>
                  setGewaehlt((alt) => (alt.includes(a.id) ? alt.filter((x) => x !== a.id) : [...alt, a.id]))
                }
              >
                {a.titel}
              </button>
            ))}
          </div>
          <p className="leise klein">{t("aufgabenAnzahl", { anzahl: gewaehlt.length })}</p>
          <Weiter
            zurueck={() => setSchritt({ art: "rollen" })}
            weiter={() => setSchritt({ art: "aufgabe", index: 0 })}
            gesperrt={gewaehlt.length === 0}
          />
        </section>
      )}

      {schritt.art === "aufgabe" && (() => {
        const id = gewaehlt[schritt.index];
        const aufgabe = aufgabeZu(id);
        const a = antwortZu(id);
        if (!aufgabe) return null;
        return (
          <section key={id}>
            <p className="ueberzeile">{t("aufgabeVon", { nr: schritt.index + 1, gesamt: gewaehlt.length })}</p>
            <h1>{aufgabe.titel}</h1>
            <div className={styles.blase}>{aufgabe.frage}</div>
            <textarea
              value={a.text}
              placeholder={t("antwortPlatzhalter")}
              onChange={(e) => setzeAntwort(id, { text: e.target.value })}
            />

            <div className={`${styles.blase} ${styles.nachfrage}`}>
              {t("nachfrage")}
              <span className={styles.kiHinweis}>{t("nachfrageHinweis")}</span>
            </div>
            <div className="feld">
              <span>{t("wieOft")}</span>
              <div className="chips">
                {haeufigkeiten.map((h) => (
                  <button key={h} type="button" className="auswahl" aria-pressed={a.haeufigkeit === h} onClick={() => setzeAntwort(id, { haeufigkeit: h })}>
                    {tb(`haeufigkeit.${h}`)}
                  </button>
                ))}
              </div>
            </div>
            <label className="feld">
              <span>{t("stunden")}</span>
              <input
                type="number"
                min={0}
                step={0.5}
                inputMode="decimal"
                value={a.stunden ?? ""}
                placeholder={t("stundenPlatzhalter")}
                onChange={(e) => setzeAntwort(id, { stunden: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
            </label>
            <div className="feld">
              <span>{t("belastung")}</span>
              <div className="chips">
                {belastungsarten.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className="auswahl"
                    aria-pressed={a.belastung.includes(b)}
                    onClick={() =>
                      setzeAntwort(id, {
                        belastung: a.belastung.includes(b) ? a.belastung.filter((x) => x !== b) : [...a.belastung, b],
                      })
                    }
                  >
                    {tb(`belastung.${b}`)}
                  </button>
                ))}
              </div>
            </div>
            <Weiter
              zurueck={() =>
                setSchritt(schritt.index === 0 ? { art: "aufgaben" } : { art: "aufgabe", index: schritt.index - 1 })
              }
              weiter={() =>
                setSchritt(
                  schritt.index + 1 < gewaehlt.length ? { art: "aufgabe", index: schritt.index + 1 } : { art: "allgemein" },
                )
              }
              gesperrt={!a.haeufigkeit}
            />
          </section>
        );
      })()}

      {schritt.art === "allgemein" && (
        <section>
          <h1>{t("allgemeinTitel")}</h1>
          <p className="leise">{t("allgemeinText")}</p>
          {props.allgemeineFragen.map((f) => (
            <label key={f.id} className="feld">
              <span>{f.frage}</span>
              {f.hinweis && <span className="leise klein">{f.hinweis}</span>}
              {f.id === "kommunikation" && (
                <select value={kommunikationVon} onChange={(e) => setKommunikationVon(e.target.value)}>
                  <option value="">{t("ausBereich")}</option>
                  {props.alleBereiche.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              )}
              <textarea
                value={allgemein[f.id]}
                onChange={(e) => setAllgemein((alt) => ({ ...alt, [f.id]: e.target.value }))}
              />
            </label>
          ))}
          <Weiter
            zurueck={() => setSchritt({ art: "aufgabe", index: gewaehlt.length - 1 })}
            weiter={() => setSchritt({ art: "einschaetzung" })}
          />
        </section>
      )}

      {schritt.art === "einschaetzung" && (
        <section>
          <h1>{t("einschaetzungTitel")}</h1>
          <p className="leise">{t("einschaetzungText")}</p>
          {dimensionen.map((d) => (
            <div key={d} className={styles.skala}>
              <p>
                <strong>{tb(`dimension.${d}`)}</strong>
                <span className="leise klein">{tb(`dimensionFrage.${d}`)}</span>
              </p>
              <div className={styles.stufen} role="radiogroup" aria-label={tb(`dimension.${d}`)}>
                {([1, 2, 3, 4, 5] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    role="radio"
                    aria-checked={einschaetzung[d] === w}
                    onClick={() => setEinschaetzung((alt) => ({ ...alt, [d]: w }))}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <p className={`leise ${styles.skalaEnden}`}>
                <span>{tb("skala.schlecht")}</span>
                <span>{tb("skala.gut")}</span>
              </p>
            </div>
          ))}
          <Weiter
            zurueck={() => setSchritt({ art: "allgemein" })}
            weiter={() => {
              setKarte(baueKarte());
              setSchritt({ art: "karte" });
            }}
            gesperrt={dimensionen.some((d) => !einschaetzung[d])}
            weiterText={t("karteErstellen")}
          />
        </section>
      )}

      {schritt.art === "karte" && karte && (
        <section>
          <p className="ueberzeile">{t("karteUeberzeile")}</p>
          <h1>{t("karteTitel")}</h1>
          <p className="leise">{t("karteText")}</p>
          <div className={styles.karte}>
            {karte.aufgaben.map((a) => (
              <article key={a.id} className={styles.kartenAufgabe}>
                <h2>{a.titel}</h2>
                <textarea
                  aria-label={t("beschreibung")}
                  value={a.beschreibung}
                  onChange={(e) => aendereKarte(a.id, { beschreibung: e.target.value, aussage: e.target.value })}
                />
                <div className={styles.kartenZeile}>
                  <label>
                    <span className="leise klein">{t("wieOft")}</span>
                    <select value={a.haeufigkeit} onChange={(e) => aendereKarte(a.id, { haeufigkeit: Haeufigkeit.parse(e.target.value) })}>
                      {haeufigkeiten.map((h) => (
                        <option key={h} value={h}>{tb(`haeufigkeit.${h}`)}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="leise klein">{t("stundenKurz")}</span>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={a.stundenProWoche ?? ""}
                      onChange={(e) =>
                        aendereKarte(a.id, { stundenProWoche: e.target.value === "" ? undefined : Number(e.target.value) })
                      }
                    />
                  </label>
                </div>
                {a.belastung.length > 0 && (
                  <div className="chips">
                    {a.belastung.map((b) => <span key={b} className="chip">{tb(`belastung.${b}`)}</span>)}
                  </div>
                )}
              </article>
            ))}
            {karte.kommunikation && (
              <article className={styles.kartenAufgabe}>
                <h2>{t("kommunikationTitel")}</h2>
                <p className="klein"><strong>{karte.kommunikation.von} → {karte.kommunikation.an}</strong></p>
                <p>{karte.kommunikation.problem}</p>
              </article>
            )}
            {karte.wasGutLaeuft.length > 0 && (
              <article className={`${styles.kartenAufgabe} ${styles.gut}`}>
                <h2>{t("gutTitel")}</h2>
                {karte.wasGutLaeuft.map((g) => <p key={g}>{g}</p>)}
              </article>
            )}
          </div>
          <p className="leise klein">{t("neutralHinweis")}</p>
          {karte.korrigiert && <p className={styles.korrigiert}>{t("korrigiert")}</p>}
          {kartenFehler && <pre className={styles.fehler}>{kartenFehler}</pre>}
          <Weiter
            zurueck={() => setSchritt({ art: "einschaetzung" })}
            weiter={bestaetige}
            weiterText={t("bestaetigen")}
          />
        </section>
      )}

      {schritt.art === "analyse" && karte && (
        <Analyse
          karte={karte}
          einschaetzung={einschaetzung}
          aufgaben={props.aufgaben}
          wissen={props.wissen}
        />
      )}
    </div>
  );
}

function Weiter({
  zurueck,
  weiter,
  gesperrt = false,
  weiterText,
}: {
  zurueck: () => void;
  weiter: () => void;
  gesperrt?: boolean;
  weiterText?: string;
}) {
  const t = useTranslations("Abfrage");
  return (
    <div className={styles.aktionen}>
      <button type="button" className="button button--ghost" onClick={zurueck}>{t("zurueck")}</button>
      <button type="button" className="button" disabled={gesperrt} onClick={weiter}>{weiterText ?? t("weiter")}</button>
    </div>
  );
}
