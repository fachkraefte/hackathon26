"use client";

// Persönliche App (Klo-Test): eigener Code, unten eine Navbar – Karten · Melden · Bild.
// Karten: höchstens 5, kein Zwang. Melden: halten und erzählen, die KI zerlegt in einzelne Probleme.
// Im Browser gemerkt wird nur, welche Karten schon beantwortet sind.
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { FeedKarte, Problem, Resonanz, Richtung } from "@/lib/feed";
import { erzaehle, geste, gibFrei, ladeFeed, liveDaten, waehleBereich } from "@/lib/feed-aktionen";
import { istStartKarte } from "@/lib/feed-regeln";
import { formatStunden } from "@/lib/rechnen";
import styles from "../../feed/[code]/feed.module.css";

type Props = { code: string; betriebId: string; betrieb: string; anrede: "du" | "sie"; bereiche: string[]; bereich: string | null };
type Tab = "karten" | "melden" | "bild";
const SCHWELLE_PX = 90;

const merkSchluessel = (code: string) => `rokio-ich-${code}`;
function liesBeantwortet(code: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(merkSchluessel(code)) ?? "[]") as string[];
  } catch {
    return [];
  }
}
function merkeBeantwortet(code: string, ids: string[]) {
  try {
    localStorage.setItem(merkSchluessel(code), JSON.stringify(ids));
  } catch {}
}

export function PersoenlicheApp(props: Props) {
  const t = useTranslations("Feed");
  const [bereich, setBereich] = useState(props.bereich);
  const [tab, setTab] = useState<Tab>("karten");

  if (!bereich) {
    return (
      <div className={styles.buehne} data-phase="start">
        <section className={styles.start}>
          <p className={styles.betrieb}>{props.betrieb}</p>
          <h1 className={styles.gross}>{t("hallo", { anrede: props.anrede, betrieb: props.betrieb })}</h1>
          <p className={styles.einleitung}>{t("einleitungApp", { anrede: props.anrede })}</p>
          <ul className={styles.hausordnung}>
            <li>{t("hausordnung1")}</li>
            <li>{t("hausordnung2")}</li>
            <li>{t("hausordnung3")}</li>
          </ul>
          <div className={styles.daumen}>
            <p className={styles.frage}>{t("bereichFrage", { anrede: props.anrede })}</p>
            <div className={styles.bereiche}>
              {props.bereiche.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={styles.bereich}
                  onClick={() => {
                    setBereich(b);
                    waehleBereich(props.code, b).catch(() => undefined);
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className={styles.leiseKlein}>{t("einmalig")}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.buehne} data-phase={tab === "karten" ? "karten" : "start"} data-app>
      <div className={styles.inhalt}>
        {tab === "karten" && <KartenTab {...props} bereich={bereich} zuMelden={() => setTab("melden")} />}
        {tab === "melden" && <Melden {...props} bereich={bereich} fertig={() => setTab("karten")} />}
        {tab === "bild" && <BildTab betriebId={props.betriebId} />}
      </div>
      <nav className={styles.navbar} aria-label={t("navLabel")}>
        <button type="button" data-aktiv={tab === "karten"} onClick={() => setTab("karten")}>
          <span aria-hidden>▤</span>
          {t("navKarten")}
        </button>
        <button type="button" className={styles.navMelden} data-aktiv={tab === "melden"} onClick={() => setTab("melden")}>
          <span className={styles.navPunkt} aria-hidden />
          {t("navMelden")}
        </button>
        <button type="button" data-aktiv={tab === "bild"} onClick={() => setTab("bild")}>
          <span aria-hidden>◎</span>
          {t("navBild")}
        </button>
      </nav>
    </div>
  );
}

// ---------- Karten ----------
type Phase = { art: "laedt" } | { art: "karten" } | { art: "resonanz"; richtung: Richtung; resonanz: Resonanz | null } | { art: "ende" };

function KartenTab({ code, betriebId, anrede, bereich, zuMelden }: Props & { bereich: string; zuMelden: () => void }) {
  const t = useTranslations("Feed");
  const [karten, setKarten] = useState<FeedKarte[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>({ art: "laedt" });
  const [fehler, setFehler] = useState(false);

  useEffect(() => {
    let aktiv = true;
    ladeFeed(betriebId, bereich, liesBeantwortet(code))
      .then((k) => {
        if (!aktiv) return;
        setKarten(k);
        setPhase(k.length ? { art: "karten" } : { art: "ende" });
      })
      .catch(() => aktiv && setFehler(true));
    return () => {
      aktiv = false;
    };
  }, [code, betriebId, bereich]);

  const karte = karten[index];

  function naechste() {
    if (index + 1 >= karten.length) setPhase({ art: "ende" });
    else {
      setIndex(index + 1);
      setPhase({ art: "karten" });
    }
  }

  function antworte(richtung: Richtung) {
    if (!karte) return;
    merkeBeantwortet(code, [...liesBeantwortet(code), karte.id]);
    if (karte.art === "wirkung") return naechste();
    setPhase({ art: "resonanz", richtung, resonanz: null });
    geste({ code: betriebId, sitzung: code, bereich, karteId: karte.id, richtung })
      .then((resonanz) => setPhase((p) => (p.art === "resonanz" ? { ...p, resonanz } : p)))
      .catch(() => setFehler(true));
  }

  useEffect(() => {
    if (phase.art !== "resonanz") return;
    const dauer = phase.richtung === "nicht" ? 700 : phase.resonanz ? 1700 : 1600;
    const z = window.setTimeout(naechste, dauer);
    return () => window.clearTimeout(z);
  });

  if (phase.art === "laedt") return <Denkt text={fehler ? t("fehler") : t("laedtKarten")} />;

  if (phase.art === "ende" || !karte) {
    return (
      <section className={styles.ende}>
        <p className={styles.betrieb}>{bereich}</p>
        <h1 className={styles.gross}>{karten.length ? t("endeTitel") : t("leerTitel")}</h1>
        <p className={styles.einleitung}>{karten.length ? t("endeText5", { anrede }) : t("leer")}</p>
        <p className={styles.leise}>{t("endeLeitung")}</p>
        <div className={styles.daumen}>
          <button type="button" className={styles.halten} onClick={zuMelden}>
            <span className={styles.punkt} aria-hidden /> {t("etwasMelden")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Fortschritt n={index} gesamt={karten.length} />
      <p className={styles.oben}>
        <span>{bereich}</span>
        <span>{t("zaehler", { n: index + 1, gesamt: karten.length })}</span>
      </p>
      {karte.art === "aussage" ? (
        <AussageKarte key={karte.id} karte={karte} aktiv={phase.art === "karten"} onAntwort={antworte} onHalten={zuMelden} />
      ) : (
        <WirkungsKarte key={karte.id} karte={karte} onWeiter={() => antworte("kenn")} />
      )}
      {phase.art === "resonanz" && <ResonanzSchirm phase={phase} anrede={anrede} onWeiter={naechste} />}
    </>
  );
}

function Fortschritt({ n, gesamt }: { n: number; gesamt: number }) {
  return (
    <div className={styles.fortschritt} aria-hidden>
      {Array.from({ length: gesamt }, (_, i) => (
        <span key={i} data-voll={i < n} data-jetzt={i === n} />
      ))}
    </div>
  );
}

export function AussageKarte({
  karte,
  aktiv,
  onAntwort,
  onHalten,
}: {
  karte: Extract<FeedKarte, { art: "aussage" }>;
  aktiv: boolean;
  onAntwort: (r: Richtung) => void;
  onHalten?: () => void;
}) {
  const t = useTranslations("Feed");
  const [ziehen, setZiehen] = useState({ x: 0, y: 0, aktiv: false });
  const [weg, setWeg] = useState<Richtung | null>(null);
  const anfang = useRef<{ x: number; y: number } | null>(null);
  const halteZeit = useRef<number | null>(null);

  const richtung: Richtung | null =
    weg ?? (ziehen.y < -SCHWELLE_PX * 0.6 && Math.abs(ziehen.y) > Math.abs(ziehen.x) ? "staendig" : ziehen.x > 30 ? "kenn" : ziehen.x < -30 ? "nicht" : null);
  const staerke = Math.min(1, Math.max(Math.abs(ziehen.x), Math.abs(ziehen.y)) / SCHWELLE_PX);

  function entscheide(r: Richtung) {
    setWeg(r);
    if (navigator.vibrate) navigator.vibrate(12);
    window.setTimeout(() => onAntwort(r), 220);
  }

  useEffect(() => {
    if (!aktiv) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") entscheide("kenn");
      if (e.key === "ArrowLeft") entscheide("nicht");
      if (e.key === "ArrowUp") entscheide("staendig");
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  });

  const stil = weg
    ? {
        transform: weg === "kenn" ? "translate(120vw, 0) rotate(18deg)" : weg === "nicht" ? "translate(-120vw, 0) rotate(-18deg)" : "translate(0, -120vh)",
        transition: "transform 0.25s ease-in",
      }
    : {
        transform: `translate(${ziehen.x}px, ${Math.min(0, ziehen.y)}px) rotate(${ziehen.x / 18}deg)`,
        transition: ziehen.aktiv ? "none" : "transform 0.25s ease-out",
      };

  const uebergabe = karte.von && karte.an && karte.von !== karte.an ? `${karte.von} → ${karte.an}` : karte.von && karte.von !== karte.bereich ? `${karte.von} → ${karte.bereich}` : karte.bereich;

  return (
    <div className={styles.kartenFlaeche}>
      <article
        className={styles.karte}
        style={stil}
        data-richtung={richtung ?? undefined}
        onPointerDown={(e) => {
          if (!aktiv) return;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          anfang.current = { x: e.clientX, y: e.clientY };
          setZiehen({ x: 0, y: 0, aktiv: true });
          if (onHalten)
            halteZeit.current = window.setTimeout(() => {
              anfang.current = null;
              setZiehen({ x: 0, y: 0, aktiv: false });
              if (navigator.vibrate) navigator.vibrate(20);
              onHalten();
            }, 650);
        }}
        onPointerMove={(e) => {
          if (!anfang.current) return;
          const x = e.clientX - anfang.current.x;
          const y = e.clientY - anfang.current.y;
          if ((Math.abs(x) > 8 || Math.abs(y) > 8) && halteZeit.current) {
            window.clearTimeout(halteZeit.current);
            halteZeit.current = null;
          }
          setZiehen({ x, y, aktiv: true });
        }}
        onPointerUp={() => {
          if (halteZeit.current) window.clearTimeout(halteZeit.current);
          halteZeit.current = null;
          if (!anfang.current) return;
          anfang.current = null;
          const { x, y } = ziehen;
          if (y < -SCHWELLE_PX && Math.abs(y) > Math.abs(x)) entscheide("staendig");
          else if (x > SCHWELLE_PX) entscheide("kenn");
          else if (x < -SCHWELLE_PX) entscheide("nicht");
          else setZiehen({ x: 0, y: 0, aktiv: false });
        }}
        onPointerCancel={() => {
          if (halteZeit.current) window.clearTimeout(halteZeit.current);
          anfang.current = null;
          setZiehen({ x: 0, y: 0, aktiv: false });
        }}
      >
        {karte.kurzname && <span className={styles.hintergrundWort} aria-hidden>{karte.kurzname}</span>}
        {richtung && (
          <span className={styles.stempel} data-richtung={richtung} style={{ opacity: weg ? 1 : staerke }}>
            {richtung === "kenn" ? t("stempelKenn") : richtung === "nicht" ? t("stempelNicht") : t("stempelStaendig")}
          </span>
        )}
        <p className={styles.uebergabe}>{uebergabe}</p>
        <h2 className={styles.problem}>{karte.text}</h2>
        {karte.kontext && <p className={styles.kontext}>{karte.kontext}</p>}
        <p className={styles.quelle}>{istStartKarte(karte.id) ? t("startKarte") : t("ausMeldung")}</p>
      </article>
      <div className={styles.knoepfe}>
        <button type="button" className={styles.nein} onClick={() => entscheide("nicht")} disabled={!aktiv}>
          ✕ {t("nichtBeiUns")}
        </button>
        <button type="button" className={styles.oft} onClick={() => entscheide("staendig")} disabled={!aktiv} aria-label={t("staendig")}>
          ↑
        </button>
        <button type="button" className={styles.ja} onClick={() => entscheide("kenn")} disabled={!aktiv}>
          {t("kennIch")} ♥
        </button>
      </div>
    </div>
  );
}

function WirkungsKarte({ karte, onWeiter }: { karte: Extract<FeedKarte, { art: "wirkung" }>; onWeiter: () => void }) {
  const t = useTranslations("Feed");
  return (
    <div className={styles.kartenFlaeche}>
      <article className={`${styles.karte} ${styles.wirkung}`}>
        <p className={styles.wirkungUeber}>{t("wirkungUeber")}</p>
        <h2 className={styles.wirkungTitel}>{t("wirkungTitel", { loesung: karte.loesung })}</h2>
        <p className={styles.wirkungSatz}>{karte.satz}</p>
        <p className={styles.quelle}>{t("wirkungStimmen", { n: karte.stimmen, von: karte.von, an: karte.an })}</p>
      </article>
      <div className={styles.knoepfe}>
        <button type="button" className={styles.nein} onClick={onWeiter}>{t("gespannt")}</button>
        <button type="button" className={styles.gelb} onClick={onWeiter}>{t("machMit")}</button>
      </div>
    </div>
  );
}

export function ResonanzSchirm({
  phase,
  anrede,
  onWeiter,
}: {
  phase: { richtung: Richtung; resonanz: Resonanz | null };
  anrede: "du" | "sie";
  onWeiter: () => void;
}) {
  const t = useTranslations("Feed");
  const r = phase.resonanz;
  const wort = phase.richtung === "staendig" ? t("staendig") : t("kennIch");
  return (
    <button type="button" className={styles.resonanz} data-richtung={phase.richtung} onClick={onWeiter}>
      {phase.richtung === "nicht" ? (
        <span className={styles.resonanzZeile}>{t("nichtNotiert")}</span>
      ) : (
        <>
          <span className={styles.resonanzUeber}>{t("duHastGesagt", { anrede, wort })}</span>
          {r?.sichtbar ? (
            <>
              <span className={styles.resonanzZahl}>{t("vonGesamt", { kennen: r.kennen, gesamt: Math.max(r.gesamt, r.kennen) })}</span>
              <span className={styles.resonanzZeile}>{t("kennenAuch", { bereiche: liste(r.bereiche) })}</span>
            </>
          ) : (
            <>
              <span className={styles.resonanzZahl}>{t("notiert")}</span>
              {r && <span className={styles.resonanzZeile}>{t("ersteStimmen", { anrede })}</span>}
            </>
          )}
          <span className={styles.resonanzFuss}>{t("hausordnung1")}</span>
        </>
      )}
    </button>
  );
}

function liste(xs: string[]) {
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} und ${xs[xs.length - 1]}`;
}

// ---------- Warten: Stimmen sammeln sich zu einer Karte ----------
export function Denkt({ text }: { text: string }) {
  return (
    <div className={styles.denkt} role="status">
      <div className={styles.denktBuehne} aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={styles.denktPunkt} style={{ ["--i" as string]: i }} />
        ))}
        <span className={styles.denktKarte} />
      </div>
      <p className={styles.denktText}>{text}</p>
    </div>
  );
}

// ---------- Melden: halten und erzählen ----------
type Erkenner = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};
type Entwurf = Awaited<ReturnType<typeof erzaehle>>;

function Melden({ betriebId, anrede, bereich, fertig }: Props & { bereich: string; fertig: () => void }) {
  const t = useTranslations("Feed");
  const [text, setText] = useState("");
  const [hoert, setHoert] = useState(false);
  const [denkt, setDenkt] = useState<string | null>(null);
  const [entwurf, setEntwurf] = useState<Entwurf | null>(null);
  const [aktiv, setAktiv] = useState<boolean[]>([]);
  const [oft, setOft] = useState<Problem["haeufigkeit"]>(null);
  const [minuten, setMinuten] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<Awaited<ReturnType<typeof gibFrei>> | null>(null);
  const [fehler, setFehler] = useState(false);
  const erkenner = useRef<Erkenner | null>(null);
  const uhr = useRef<number | null>(null);
  const [zeit, setZeit] = useState(0);

  function starte() {
    const W = window as unknown as { SpeechRecognition?: new () => Erkenner; webkitSpeechRecognition?: new () => Erkenner };
    const Klasse = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Klasse) return;
    const e = new Klasse();
    e.lang = document.documentElement.lang === "en" ? "en-US" : "de-DE";
    e.continuous = true;
    e.interimResults = true;
    const vorher = text ? `${text} ` : "";
    e.onresult = (ev) => setText(vorher + Array.from(ev.results, (r) => r[0].transcript).join(" "));
    e.onend = () => setHoert(false);
    e.start();
    erkenner.current = e;
    setHoert(true);
    setZeit(0);
    uhr.current = window.setInterval(() => setZeit((z) => (z >= 29 ? (stoppe(), 30) : z + 1)), 1000);
  }
  function stoppe() {
    erkenner.current?.stop();
    erkenner.current = null;
    if (uhr.current) window.clearInterval(uhr.current);
    uhr.current = null;
    setHoert(false);
  }

  async function senden() {
    setDenkt(t("denkt"));
    setFehler(false);
    try {
      const e = await erzaehle({ code: betriebId, bereich, geschichte: text });
      setEntwurf(e);
      setAktiv(e.probleme.map(() => true));
    } catch {
      setFehler(true);
    }
    setDenkt(null);
  }

  const gewaehlt = entwurf?.probleme.filter((_, i) => aktiv[i]) ?? [];
  const brauchtOft = gewaehlt.some((p) => !p.haeufigkeit);
  const brauchtMinuten = gewaehlt.some((p) => !p.minuten);

  async function freigeben() {
    if (!gewaehlt.length) return;
    setDenkt(t("verteilt"));
    try {
      setErgebnis(
        await gibFrei({
          code: betriebId,
          bereich,
          probleme: gewaehlt.map((p) => ({
            text: p.text,
            kontext: p.kontext,
            titel: p.titel,
            haeufigkeit: p.haeufigkeit ?? oft ?? "woechentlich",
            minuten: p.minuten ?? minuten ?? 15,
            von: p.von,
            an: p.an,
          })),
        }),
      );
    } catch {
      setFehler(true);
    }
    setDenkt(null);
  }

  function neu() {
    setText("");
    setEntwurf(null);
    setErgebnis(null);
    setOft(null);
    setMinuten(null);
  }

  if (denkt) return <Denkt text={denkt} />;

  if (ergebnis) {
    const sichtbar = ergebnis.ergebnisse.find((e) => e.resonanz.sichtbar);
    return (
      <button type="button" className={styles.resonanz} data-richtung="kenn" onClick={() => (neu(), fertig())}>
        <span className={styles.resonanzUeber}>{t("gemeldet", { n: ergebnis.ergebnisse.length })}</span>
        {sichtbar ? (
          <>
            <span className={styles.resonanzZahl}>{t("vonGesamt", { kennen: sichtbar.resonanz.kennen, gesamt: Math.max(sichtbar.resonanz.gesamt, sichtbar.resonanz.kennen) })}</span>
            <span className={styles.resonanzZeile}>{t("kennenSchon", { thema: sichtbar.kurzname ?? sichtbar.text })}</span>
          </>
        ) : (
          <span className={styles.resonanzZahl}>{t("notiert")}</span>
        )}
        <span className={styles.resonanzZeile}>
          {ergebnis.empfaenger.length ? t("gehtAn", { bereiche: liste(ergebnis.empfaenger) }) : t("gehtAnAlle")}
        </span>
        <span className={styles.resonanzFuss}>{t("weiter")} →</span>
      </button>
    );
  }

  if (entwurf) {
    return (
      <section className={styles.erzaehlen}>
        <p className={styles.betrieb}>{entwurf.probleme.length > 1 ? t("probleme", { n: entwurf.probleme.length }) : t("soSehenEsAndere")}</p>
        {entwurf.spiegelung && <p className={styles.leise}>{entwurf.spiegelung}</p>}
        <div className={styles.vorschauListe}>
          {entwurf.probleme.map((p, i) => (
            <button
              key={i}
              type="button"
              className={styles.vorschau}
              data-aus={!aktiv[i]}
              onClick={() => setAktiv(aktiv.map((a, j) => (j === i ? !a : a)))}
            >
              <span className={styles.vorschauText}>{p.text}</span>
              {p.kontext && <span className={styles.vorschauKontext}>{p.kontext}</span>}
              <span className={styles.vorschauHaken}>{aktiv[i] ? "✓" : "–"}</span>
            </button>
          ))}
        </div>
        <p className={styles.leiseKlein}>{t("keineNamen")}</p>
        {brauchtOft && (
          <Chips frage={t("wieOft")} werte={["woechentlich", "mehrmalsProWoche", "taeglich", "mehrmalsTaeglich"] as const} wahl={oft} name={(w) => t(`oft.${w as "woechentlich"}`)} onWahl={setOft} />
        )}
        {brauchtMinuten && (
          <Chips frage={t("wieLange")} werte={[5, 15, 30, 60]} wahl={minuten} name={(m) => (m === 60 ? "1 Std." : `${m} Min.`)} onWahl={setMinuten} />
        )}
        {fehler && <p className={styles.fehler}>{t("fehler")}</p>}
        <div className={styles.knoepfe}>
          <button type="button" className={styles.nein} onClick={neu}>{t("verwerfen")}</button>
          <button
            type="button"
            className={styles.ja}
            onClick={freigeben}
            disabled={!gewaehlt.length || (brauchtOft && !oft) || (brauchtMinuten && !minuten)}
          >
            {t("freigeben")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.erzaehlen}>
      <p className={styles.betrieb}>{t("meldenUeber", { bereich })}</p>
      <h1 className={styles.gross}>{t("erzaehlenTitel", { anrede })}</h1>
      <p className={styles.leise}>{t("erzaehlenText", { anrede })}</p>
      <textarea className={styles.textfeld} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("tippen")} rows={3} maxLength={2000} />
      {fehler && <p className={styles.fehler}>{t("fehler")}</p>}
      <div className={styles.daumen}>
        <button
          type="button"
          className={styles.aufnahme}
          data-hoert={hoert}
          onPointerDown={(e) => {
            e.preventDefault();
            starte();
          }}
          onPointerUp={stoppe}
          onPointerLeave={() => hoert && stoppe()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className={styles.aufnahmeKreis}>{hoert ? `0:${String(zeit).padStart(2, "0")}` : "●"}</span>
          <span>
            {hoert ? t("hoertZu") : t("aufnahme")}
            <small className={styles.aufnahmeKlein}>{t("loslassen")}</small>
          </span>
        </button>
        <button type="button" className={styles.ja} onClick={senden} disabled={text.trim().length < 3 || hoert}>
          {t("senden")}
        </button>
      </div>
    </section>
  );
}

function Chips<T extends string | number>({
  frage,
  werte,
  wahl,
  name,
  onWahl,
}: {
  frage: string;
  werte: readonly T[];
  wahl: T | null;
  name: (w: T) => string;
  onWahl: (w: T) => void;
}) {
  return (
    <div className={styles.chipsBlock}>
      <p className={styles.frage}>{frage}</p>
      <div className={styles.chips}>
        {werte.map((w) => (
          <button key={String(w)} type="button" className={styles.chip} data-gewaehlt={wahl === w} onClick={() => onWahl(w)}>
            {name(w)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Bild: das gemeinsame Bild in Kurzform ----------
function BildTab({ betriebId }: { betriebId: string }) {
  const t = useTranslations("Feed");
  const [d, setD] = useState<Awaited<ReturnType<typeof liveDaten>> | null>(null);
  useEffect(() => {
    liveDaten(betriebId).then(setD, () => undefined);
  }, [betriebId]);
  if (!d) return <Denkt text={t("laedtBild")} />;
  const max = Math.max(...d.faeden.map((f) => f.stunden), 1);
  return (
    <section className={styles.erzaehlen}>
      <p className={styles.betrieb}>{t("bildUeber", { n: d.stimmen })}</p>
      <h1 className={styles.gross}>{t("bildZahl", { h: formatStunden(d.stunden) })}</h1>
      <p className={styles.leise}>{t("bildText")}</p>
      <ol className={styles.befunde}>
        {d.faeden.map((f) => (
          <li key={f.kurzname}>
            <span className={styles.befundName}>{f.kurzname}</span>
            <span className={styles.befundBalken} style={{ width: `${Math.max(8, (f.stunden / max) * 100)}%` }} />
            <span className={styles.befundZahl}>
              {t("befundZahl", { n: f.personen, h: formatStunden(f.stunden) })}
            </span>
          </li>
        ))}
      </ol>
      <Link href={`/analyse/${betriebId}`} className={styles.leiseLink}>{t("bildGanz")} →</Link>
    </section>
  );
}
