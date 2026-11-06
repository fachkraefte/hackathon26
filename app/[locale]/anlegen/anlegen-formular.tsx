"use client";

// Anlegen durch die Leitung (KONZEPT_V3 §3): Eckdaten, Bereiche mit Stundensatz-Spanne, Deadline.
// Danach bereitet die KI Chips und Rückfragen vor; die Leitung kann Chips löschen und ergänzen.
import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore, useTransition } from "react";
import { Link } from "@/i18n/navigation";
import { legeAn, speichereProfil } from "@/lib/aktionen";
import { branchen, type Bereich, type Branche, type Profil } from "@/lib/typen";
import styles from "./anlegen.module.css";
import { Denkt } from "../ich/[code]/app";

/** Startvorschläge je Branche – frei änderbar. Spanne: Arbeitgeberkosten €/Std., grob. */
const VORSCHLAG: Record<Branche, Bereich[]> = {
  produktionHandwerk: [
    { name: "Leitung", satzVon: 60, satzBis: 70 },
    { name: "Büro", satzVon: 35, satzBis: 45 },
    { name: "Werkstatt", satzVon: 38, satzBis: 46 },
    { name: "Montage", satzVon: 38, satzBis: 46 },
  ],
  gastronomie: [
    { name: "Leitung", satzVon: 50, satzBis: 60 },
    { name: "Küche", satzVon: 36, satzBis: 42 },
    { name: "Ausgabe", satzVon: 28, satzBis: 32 },
    { name: "Spülküche", satzVon: 26, satzBis: 30 },
  ],
  gesundheitPflege: [
    { name: "Leitung", satzVon: 55, satzBis: 70 },
    { name: "Pflegefachkräfte", satzVon: 42, satzBis: 50 },
    { name: "Pflegehilfskräfte", satzVon: 32, satzBis: 38 },
    { name: "Hauswirtschaft", satzVon: 28, satzBis: 34 },
  ],
  logistik: [
    { name: "Leitung", satzVon: 55, satzBis: 65 },
    { name: "Disposition", satzVon: 38, satzBis: 45 },
    { name: "Lager", satzVon: 30, satzBis: 36 },
    { name: "Fahrdienst", satzVon: 30, satzBis: 36 },
  ],
  facilityManagement: [
    { name: "Leitung", satzVon: 50, satzBis: 60 },
    { name: "Objektbetreuung", satzVon: 32, satzBis: 40 },
    { name: "Reinigung", satzVon: 26, satzBis: 32 },
    { name: "Büro", satzVon: 34, satzBis: 40 },
  ],
};

/** Beispiel für die Vorführung (Fallstudie 1). */
const BEISPIEL = {
  name: "Metallbau Heidekamp",
  branche: "produktionHandwerk" as Branche,
  mitarbeitende: 22,
  website: "",
  leistungen: "Treppen, Geländer und Balkone, Stahlkonstruktionen, Vordächer. Aufmaß, Konstruktion, Fertigung und Montage aus einer Hand, Verzinkung extern.",
  ziel: "Ich will wissen, wo wir uns das Leben schwer machen, bevor ich die nächste Stelle ausschreibe.",
  anrede: "du" as const,
  deadline: "Do., 3. Dezember, 7:30 Uhr in der Werkstatt",
  bereiche: [
    { name: "Leitung", satzVon: 60, satzBis: 70 },
    { name: "Technik", satzVon: 45, satzBis: 55 },
    { name: "Büro", satzVon: 35, satzBis: 45 },
    { name: "Werkstatt", satzVon: 38, satzBis: 46 },
    { name: "Montage", satzVon: 38, satzBis: 46 },
  ],
};

const nichts = () => () => {};

export function AnlegenFormular() {
  const t = useTranslations("Anlegen");
  const tb = useTranslations("Begriffe");
  const [name, setName] = useState("");
  const [branche, setBranche] = useState<Branche>("produktionHandwerk");
  const [mitarbeitende, setMitarbeitende] = useState(20);
  const [website, setWebsite] = useState("");
  const [leistungen, setLeistungen] = useState("");
  const [ziel, setZiel] = useState("");
  const [anrede, setAnrede] = useState<"du" | "sie">("du");
  const [deadline, setDeadline] = useState("");
  const [bereiche, setBereiche] = useState<Bereich[]>(VORSCHLAG.produktionHandwerk);
  const [neuerBereich, setNeuerBereich] = useState("");
  const [laedt, starte] = useTransition();
  const [fehler, setFehler] = useState<string | null>(null);
  const [fertig, setFertig] = useState<{ code: string; leitungCode: string; profil: Profil; websiteGelesen: boolean; ausDemo: boolean } | null>(null);

  function beispielEinsetzen() {
    setName(BEISPIEL.name);
    setBranche(BEISPIEL.branche);
    setMitarbeitende(BEISPIEL.mitarbeitende);
    setWebsite(BEISPIEL.website);
    setLeistungen(BEISPIEL.leistungen);
    setZiel(BEISPIEL.ziel);
    setAnrede(BEISPIEL.anrede);
    setDeadline(BEISPIEL.deadline);
    setBereiche(BEISPIEL.bereiche);
  }

  function setzeSatz(i: number, feld: "satzVon" | "satzBis", wert: number) {
    setBereiche(bereiche.map((b, j) => (j === i ? { ...b, [feld]: wert } : b)));
  }

  const vollstaendig = name.trim().length >= 2 && leistungen.trim().length >= 5 && ziel.trim().length >= 5 && bereiche.length > 0;

  function absenden() {
    setFehler(null);
    starte(async () => {
      try {
        setFertig(
          await legeAn({ name, branche, mitarbeitende, website: website || null, leistungen, ziel, anrede, deadline, bereiche }),
        );
      } catch (e) {
        setFehler(e instanceof Error ? e.message : String(e));
      }
    });
  }

  if (fertig) return <Fertig {...fertig} anrede={anrede} betrieb={name} deadline={deadline} />;

  return (
    <section className={styles.formular}>
      <div className={styles.kopf}>
        <p className="ueberzeile">{t("ueberzeile")}</p>
        <h1>{t("titel")}</h1>
        <p className="leise">{t("einleitung")}</p>
        <button type="button" className={styles.beispiel} onClick={beispielEinsetzen}>
          {t("beispiel")}
        </button>
      </div>

      <section className={`karte ${styles.block}`}>
        <h2 className={styles.h2}>{t("blockBetrieb")}</h2>
        <label className="feld">
          <span>{t("name")}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <div className={styles.zweispaltig}>
          <label className="feld">
            <span>{t("branche")}</span>
            <select
              value={branche}
              onChange={(e) => {
                const neu = e.target.value as Branche;
                setBranche(neu);
                setBereiche(VORSCHLAG[neu]);
              }}
            >
              {branchen.map((b) => (
                <option key={b} value={b}>
                  {tb(`branche.${b}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="feld">
            <span>{t("mitarbeitende")}</span>
            <input type="number" min={2} max={500} value={mitarbeitende} onChange={(e) => setMitarbeitende(Number(e.target.value))} />
          </label>
        </div>
        <label className="feld">
          <span>{t("leistungen")}</span>
          <input type="text" value={leistungen} onChange={(e) => setLeistungen(e.target.value)} placeholder={t("leistungenPlatzhalter")} />
        </label>
        <label className="feld">
          <span>
            {t("website")} <span className="leise klein">{t("optional")}</span>
          </span>
          <input type="text" inputMode="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.beispiel.de" />
        </label>
        <label className="feld">
          <span>{t("ziel")}</span>
          <input type="text" value={ziel} onChange={(e) => setZiel(e.target.value)} placeholder={t("zielPlatzhalter")} />
        </label>
        <div className="feld">
          <span>{t("anrede")}</span>
          <div className="chips">
            {(["du", "sie"] as const).map((a) => (
              <button key={a} type="button" className="auswahl" aria-pressed={anrede === a} onClick={() => setAnrede(a)}>
                {t(`anrede_${a}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`karte ${styles.block}`}>
        <h2 className={styles.h2}>{t("blockBereiche")}</h2>
        <p className="leise klein">{t("bereicheHinweis")}</p>
        <ul className={styles.bereiche}>
          {bereiche.map((b, i) => (
            <li key={b.name}>
              <span className={styles.bereichName}>{b.name}</span>
              <span className={styles.spanne}>
                <input type="number" min={10} max={200} value={b.satzVon} aria-label={t("satzVon", { bereich: b.name })} onChange={(e) => setzeSatz(i, "satzVon", Number(e.target.value))} />
                <span>–</span>
                <input type="number" min={10} max={200} value={b.satzBis} aria-label={t("satzBis", { bereich: b.name })} onChange={(e) => setzeSatz(i, "satzBis", Number(e.target.value))} />
                <span className="leise klein">€/Std.</span>
              </span>
              <button type="button" className={styles.entfernen} aria-label={t("entfernen", { bereich: b.name })} onClick={() => setBereiche(bereiche.filter((_, j) => j !== i))}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <form
          className={styles.neu}
          onSubmit={(e) => {
            e.preventDefault();
            const neu = neuerBereich.trim();
            if (neu && !bereiche.some((b) => b.name === neu)) setBereiche([...bereiche, { name: neu, satzVon: 35, satzBis: 45 }]);
            setNeuerBereich("");
          }}
        >
          <input type="text" value={neuerBereich} placeholder={t("bereichNeu")} onChange={(e) => setNeuerBereich(e.target.value)} />
          <button type="submit" className="button button--ghost">{t("hinzufuegen")}</button>
        </form>
      </section>

      <section className={`karte ${styles.block}`}>
        <h2 className={styles.h2}>{t("blockDeadline")}</h2>
        <label className="feld">
          <span>{t("deadline")}</span>
          <input type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder={t("deadlinePlatzhalter")} />
        </label>
        <p className="leise klein">{t("deadlineHinweis")}</p>
      </section>

      <button type="button" className="button" disabled={!vollstaendig || laedt} onClick={absenden}>
        {laedt ? t("bereitetVor") : t("anlegen")}
      </button>
      {laedt && (
        <div className={styles.laedtBlock}>
          <Denkt text={t("lernt")} />
        </div>
      )}
      {fehler && <p className={styles.fehler}>{fehler}</p>}
    </section>
  );
}

function Fertig(props: {
  code: string;
  leitungCode: string;
  profil: Profil;
  websiteGelesen: boolean;
  ausDemo: boolean;
  anrede: "du" | "sie";
  betrieb: string;
  deadline: string;
}) {
  const t = useTranslations("Anlegen");
  const [chips, setChips] = useState(props.profil.chips);
  const [neu, setNeu] = useState<Record<string, string>>({});
  const [gespeichert, setGespeichert] = useState(true);
  const [speichert, starte] = useTransition();
  const [kopiert, setKopiert] = useState(false);
  const herkunft = useSyncExternalStore(nichts, () => window.location.origin, () => "");
  const link = `${herkunft}/de/feed/${props.code}`;
  const einladung =
    t(`einladung_${props.anrede}`, { betrieb: props.betrieb, link, code: props.code }) +
    (props.deadline.trim() ? `\n\n${t("einladungTermin", { deadline: props.deadline })}` : "");

  function aendere(bereich: string, liste: string[]) {
    setChips({ ...chips, [bereich]: liste });
    setGespeichert(false);
  }

  return (
    <section className={styles.formular}>
      <div className={styles.kopf}>
        <p className="ueberzeile">{t("fertigUeberzeile")}</p>
        <h1>{t("fertigTitel")}</h1>
        <p className={styles.code}>
          <span className="leise">{t("code")}</span> <strong>{props.code}</strong>
        </p>
      </div>

      <div className={styles.leitungBox}>
        <p className={styles.leitungTitel}>{t("leitungCode")}</p>
        <p className={styles.leitungWert}>{props.leitungCode}</p>
        <p>{t("leitungCodeText")}</p>
        <Link className="button" href={`/leitung/${props.leitungCode}`}>{t("zumDashboard")} →</Link>
      </div>

      <div className={`karte ${styles.block}`}>
        <h2 className={styles.h2}>{t("chipsTitel")}</h2>
        <p className="leise klein">
          {props.ausDemo ? t("chipsErsatz") : props.websiteGelesen ? t("chipsMitWebsite") : t("chipsOhneWebsite")}
        </p>
        {Object.entries(chips).map(([bereich, liste]) => (
          <div key={bereich} className={styles.chipBereich}>
            <p className={styles.bereichName}>{bereich}</p>
            <div className="chips">
              {liste.map((c) => (
                <button key={c} type="button" className="auswahl" aria-pressed onClick={() => aendere(bereich, liste.filter((x) => x !== c))}>
                  {c} ✕
                </button>
              ))}
              <form
                className={styles.chipNeu}
                onSubmit={(e) => {
                  e.preventDefault();
                  const wert = (neu[bereich] ?? "").trim();
                  if (wert && !liste.includes(wert)) aendere(bereich, [...liste, wert]);
                  setNeu({ ...neu, [bereich]: "" });
                }}
              >
                <input type="text" value={neu[bereich] ?? ""} placeholder={t("chipNeu")} onChange={(e) => setNeu({ ...neu, [bereich]: e.target.value })} />
              </form>
            </div>
          </div>
        ))}
        {!gespeichert && (
          <button
            type="button"
            className="button button--ghost"
            disabled={speichert}
            onClick={() =>
              starte(async () => {
                await speichereProfil(props.code, { ...props.profil, chips });
                setGespeichert(true);
              })
            }
          >
            {t("chipsSpeichern")}
          </button>
        )}
      </div>

      <div className={`karte ${styles.block}`}>
        <h2 className={styles.h2}>{t("teilenTitel")}</h2>
        <p className={styles.einladung}>{einladung}</p>
        <div className={styles.knoepfe}>
          <a className="button button--tuerkis" href={`https://wa.me/?text=${encodeURIComponent(einladung)}`} target="_blank" rel="noreferrer">
            {t("whatsapp")}
          </a>
          <button type="button" className="button button--ghost" onClick={() => navigator.clipboard.writeText(einladung).then(() => setKopiert(true))}>
            {kopiert ? t("kopiert") : t("kopieren")}
          </button>
        </div>
      </div>

      <div className={styles.knoepfe}>
        <Link className="button button--ghost" href={`/feed/${props.code}`}>{t("selbst")}</Link>
        <Link className="button button--ghost" href={`/analyse/${props.code}`}>{t("zurAnalyse")}</Link>
      </div>
    </section>
  );
}
