"use client";

// Feed (Klo-Test): eine Hand, ohne Ton, ohne Tastatur, jederzeit aufhören.
// Gesten: → kenn ich · ← nicht bei uns · ↑ ständig · gedrückt halten = dazu erzählen.
// Im Browser gemerkt wird nur: Sitzungs-ID, Bereich, beantwortete Karten (nichts davon verlässt das Gerät außer der Sitzungs-ID).
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { FeedKarte, Resonanz, Richtung } from "@/lib/feed";
import { istStartKarte } from "@/lib/feed-regeln";
import { erzaehle, geste, gibFrei, ladeFeed } from "@/lib/feed-aktionen";
import styles from "./feed.module.css";

type Props = { code: string; betrieb: string; anrede: "du" | "sie"; bereiche: string[] };
type Phase =
  | { art: "start" }
  | { art: "karten" }
  | { art: "resonanz"; richtung: Richtung; resonanz: Resonanz | null }
  | { art: "erzaehlen" }
  | { art: "ende"; sek?: number };

const SCHWELLE_PX = 90;
/** Nur für „10 Karten in 52 Sekunden“ am Ende – wird nie gespeichert. */
const jetzt = () => Date.now();

type Gemerkt = { sitzung: string; bereich: string | null; beantwortet: string[] };
const schluessel = (code: string) => `rokio-feed-${code}`;
function lies(code: string): Gemerkt {
  try {
    const roh = localStorage.getItem(schluessel(code));
    if (roh) return JSON.parse(roh) as Gemerkt;
  } catch {}
  return { sitzung: Math.random().toString(36).slice(2, 14).padEnd(12, "0"), bereich: null, beantwortet: [] };
}
function merke(code: string, g: Gemerkt) {
  try {
    localStorage.setItem(schluessel(code), JSON.stringify(g));
  } catch {}
}

export function Feed({ code, betrieb, anrede, bereiche }: Props) {
  const t = useTranslations("Feed");
  const [gemerkt, setGemerkt] = useState<Gemerkt | null>(null);
  const [phase, setPhase] = useState<Phase>({ art: "start" });
  const [karten, setKarten] = useState<FeedKarte[]>([]);
  const [index, setIndex] = useState(0);
  const [fehler, setFehler] = useState(false);
  const start = useRef(0);

  // localStorage gibt es erst im Browser – deshalb nach dem ersten Rendern lesen.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setGemerkt(lies(code)), [code]);

  const aktualisiere = useCallback(
    (g: Gemerkt) => {
      setGemerkt(g);
      merke(code, g);
    },
    [code],
  );

  async function los(bereich: string) {
    if (!gemerkt) return;
    const g = { ...gemerkt, bereich };
    aktualisiere(g);
    setFehler(false);
    try {
      const k = await ladeFeed(code, bereich, g.beantwortet);
      setKarten(k);
      setIndex(0);
      start.current = jetzt();
      setPhase(k.length ? { art: "karten" } : { art: "ende" });
    } catch {
      setFehler(true);
    }
  }

  const karte = karten[index];

  function naechste() {
    if (index + 1 >= karten.length) setPhase({ art: "ende", sek: Math.max(1, Math.round((jetzt() - start.current) / 1000)) });
    else {
      setIndex(index + 1);
      setPhase({ art: "karten" });
    }
  }

  function antworte(richtung: Richtung) {
    if (!gemerkt?.bereich || !karte) return;
    const g = { ...gemerkt, beantwortet: [...gemerkt.beantwortet, karte.id] };
    aktualisiere(g);
    if (karte.art === "wirkung") return naechste();
    setPhase({ art: "resonanz", richtung, resonanz: null });
    geste({ code, sitzung: g.sitzung, bereich: g.bereich!, karteId: karte.id, richtung })
      .then((resonanz) => setPhase((p) => (p.art === "resonanz" ? { ...p, resonanz } : p)))
      .catch(() => setFehler(true));
  }

  // Resonanz kurz zeigen, dann weiter (antippen geht schneller).
  useEffect(() => {
    if (phase.art !== "resonanz") return;
    // Ohne Antwort nach 1,6 s trotzdem weiter – die Stimme ist gespeichert, die Zahl kommt beim nächsten Mal.
    const dauer = phase.richtung === "nicht" ? 700 : phase.resonanz ? 1700 : 1600;
    const z = window.setTimeout(naechste, dauer);
    return () => window.clearTimeout(z);
  });

  if (!gemerkt) return <div className={styles.buehne} />;

  return (
    <div className={styles.buehne} data-phase={phase.art}>
      {phase.art === "start" && (
        <section className={styles.start}>
          <p className={styles.betrieb}>{betrieb}</p>
          <h1 className={styles.gross}>{t("hallo", { anrede, betrieb })}</h1>
          <p className={styles.einleitung}>{t("einleitung", { anrede })}</p>
          <ul className={styles.hausordnung}>
            <li>{t("hausordnung1")}</li>
            <li>{t("hausordnung2")}</li>
            <li>{t("hausordnung3")}</li>
          </ul>
          <div className={styles.daumen}>
            <p className={styles.frage}>{t("bereichFrage", { anrede })}</p>
            <div className={styles.bereiche}>
              {bereiche.map((b) => (
                <button key={b} type="button" className={styles.bereich} data-gewaehlt={gemerkt.bereich === b} onClick={() => los(b)}>
                  {b}
                </button>
              ))}
            </div>
            {fehler && <p className={styles.fehler}>{t("fehler")}</p>}
            <Link href={`/befragung/${code}`} className={styles.leiseLink}>{t("ausfuehrlich")}</Link>
          </div>
        </section>
      )}

      {(phase.art === "karten" || phase.art === "resonanz") && karte && (
        <>
          <Fortschritt n={index} gesamt={karten.length} />
          <p className={styles.oben}>
            <span>{gemerkt.bereich}</span>
            <span>{t("zaehler", { n: index + 1, gesamt: karten.length })}</span>
          </p>
          {karte.art === "aussage" ? (
            <AussageKarte
              key={karte.id}
              karte={karte}
              aktiv={phase.art === "karten"}
              onAntwort={antworte}
              onHalten={() => setPhase({ art: "erzaehlen" })}
            />
          ) : (
            <WirkungsKarte key={karte.id} karte={karte} onWeiter={() => antworte("kenn")} />
          )}
          {phase.art === "resonanz" && (
            <ResonanzSchirm phase={phase} anrede={anrede} onWeiter={naechste} />
          )}
        </>
      )}

      {phase.art === "erzaehlen" && gemerkt.bereich && (
        <Erzaehlen
          code={code}
          bereich={gemerkt.bereich}
          anrede={anrede}
          onFertig={() => (karte ? setPhase({ art: "karten" }) : setPhase({ art: "ende" }))}
        />
      )}

      {phase.art === "ende" && (
        <section className={styles.ende}>
          <h1 className={styles.gross}>{karten.length ? t("endeTitel") : t("leer")}</h1>
          {karten.length > 0 && (
            <p className={styles.einleitung}>
              {t("endeText", { anrede, n: karten.length, sek: phase.sek ?? 0 })}
            </p>
          )}
          <p className={styles.leise}>{t("endeLeitung")}</p>
          <div className={styles.daumen}>
            <button type="button" className={styles.halten} onClick={() => setPhase({ art: "erzaehlen" })}>
              <span className={styles.punkt} aria-hidden /> {t("etwasMelden")}
            </button>
            <Link href={`/analyse/${code}`} className={styles.leiseLink}>{t("bildAnsehen")}</Link>
          </div>
        </section>
      )}
    </div>
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

// ---------- Aussagekarte mit Swipe ----------
function AussageKarte({
  karte,
  aktiv,
  onAntwort,
  onHalten,
}: {
  karte: Extract<FeedKarte, { art: "aussage" }>;
  aktiv: boolean;
  onAntwort: (r: Richtung) => void;
  onHalten: () => void;
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
        transform:
          weg === "kenn" ? "translate(120vw, 0) rotate(18deg)" : weg === "nicht" ? "translate(-120vw, 0) rotate(-18deg)" : "translate(0, -120vh)",
        transition: "transform 0.25s ease-in",
      }
    : {
        transform: `translate(${ziehen.x}px, ${Math.min(0, ziehen.y)}px) rotate(${ziehen.x / 18}deg)`,
        transition: ziehen.aktiv ? "none" : "transform 0.25s ease-out",
      };

  const uebergabe = karte.von && karte.an && karte.von !== karte.an ? `${karte.von} → ${karte.an}` : karte.bereich;

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
          if (Math.abs(x) > 8 || Math.abs(y) > 8) {
            if (halteZeit.current) window.clearTimeout(halteZeit.current);
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
        <blockquote className={styles.zitat}>„{karte.text}“</blockquote>
        <p className={styles.quelle}>
          {istStartKarte(karte.id) ? t("startKarte") : t("ausMeldung")} · {uebergabe}
        </p>
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
      <button type="button" className={styles.haltenLeise} onClick={onHalten} disabled={!aktiv}>
        <span className={styles.punkt} aria-hidden /> {t("halten")}
      </button>
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

function ResonanzSchirm({
  phase,
  anrede,
  onWeiter,
}: {
  phase: Extract<Phase, { art: "resonanz" }>;
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
          ) : r ? (
            <>
              <span className={styles.resonanzZahl}>{t("notiert")}</span>
              <span className={styles.resonanzZeile}>{t("ersteStimmen", { anrede })}</span>
            </>
          ) : (
            <span className={styles.resonanzZahl}>{t("notiert")}</span>
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

// ---------- Halten und erzählen ----------
type Erkenner = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

function Erzaehlen({ code, bereich, anrede, onFertig }: { code: string; bereich: string; anrede: "du" | "sie"; onFertig: () => void }) {
  const t = useTranslations("Feed");
  const [text, setText] = useState("");
  const [hoert, setHoert] = useState(false);
  const [denkt, setDenkt] = useState(false);
  const [entwurf, setEntwurf] = useState<Awaited<ReturnType<typeof erzaehle>> | null>(null);
  const [oft, setOft] = useState<string | null>(null);
  const [minuten, setMinuten] = useState<number | null>(null);
  const [fertig, setFertig] = useState<Awaited<ReturnType<typeof gibFrei>> | null>(null);
  const [fehler, setFehler] = useState(false);
  const erkenner = useRef<Erkenner | null>(null);
  const sekunden = useRef<number | null>(null);
  const [zeit, setZeit] = useState(0);

  function starteAufnahme() {
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
    sekunden.current = window.setInterval(() => setZeit((z) => (z >= 29 ? (stoppeAufnahme(), 30) : z + 1)), 1000);
  }
  function stoppeAufnahme() {
    erkenner.current?.stop();
    erkenner.current = null;
    if (sekunden.current) window.clearInterval(sekunden.current);
    sekunden.current = null;
    setHoert(false);
  }

  async function senden() {
    setDenkt(true);
    setFehler(false);
    try {
      const e = await erzaehle({ code, bereich, geschichte: text });
      setEntwurf(e);
      setOft(e.haeufigkeit);
      setMinuten(e.minuten);
    } catch {
      setFehler(true);
    }
    setDenkt(false);
  }

  async function freigeben() {
    if (!entwurf || !oft || !minuten) return;
    setDenkt(true);
    try {
      setFertig(
        await gibFrei({
          code,
          bereich,
          karte: entwurf.karte,
          titel: entwurf.titel,
          aussage: entwurf.aussage,
          haeufigkeit: oft as never,
          minuten,
          von: entwurf.von,
          an: entwurf.an,
        }),
      );
    } catch {
      setFehler(true);
    }
    setDenkt(false);
  }

  if (fertig) {
    const r = fertig.resonanz;
    return (
      <button type="button" className={styles.resonanz} data-richtung="kenn" onClick={onFertig}>
        <span className={styles.resonanzUeber}>{fertig.kurzname ?? ""}</span>
        {r.sichtbar ? (
          <span className={styles.resonanzZahl}>{t("vonGesamt", { kennen: r.kennen, gesamt: Math.max(r.gesamt, r.kennen) })}</span>
        ) : (
          <span className={styles.resonanzZahl}>{t("notiert")}</span>
        )}
        <span className={styles.resonanzZeile}>
          {fertig.empfaenger.length ? t("gehtAn", { bereiche: liste(fertig.empfaenger) }) : t("gehtAnAlle")}
        </span>
        <span className={styles.resonanzFuss}>{t("weiter")} →</span>
      </button>
    );
  }

  if (entwurf) {
    return (
      <section className={styles.erzaehlen}>
        <p className={styles.betrieb}>{t("soSehenEsAndere")}</p>
        <blockquote className={styles.vorschau}>„{entwurf.karte}“</blockquote>
        <p className={styles.leise}>{t("keineNamen")}</p>
        <p className={styles.leise}>
          {t("soVerstanden")}: {entwurf.spiegelung}
        </p>
        {!entwurf.haeufigkeit && (
          <Chips frage={t("wieOft")} werte={["woechentlich", "mehrmalsProWoche", "taeglich", "mehrmalsTaeglich"]} wahl={oft} name={(w) => t(`oft.${w as "woechentlich"}`)} onWahl={setOft} />
        )}
        {!entwurf.minuten && (
          <Chips frage={t("wieLange")} werte={[5, 15, 30, 60]} wahl={minuten} name={(m) => (m === 60 ? "1 Std." : `${m} Min.`)} onWahl={setMinuten} />
        )}
        {fehler && <p className={styles.fehler}>{t("fehler")}</p>}
        <div className={styles.daumen}>
          <div className={styles.knoepfe}>
            <button type="button" className={styles.nein} onClick={onFertig}>{t("verwerfen")}</button>
            <button type="button" className={styles.ja} onClick={freigeben} disabled={!oft || !minuten || denkt}>
              {denkt ? "…" : t("freigeben")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.erzaehlen}>
      <h1 className={styles.gross}>{t("erzaehlenTitel", { anrede })}</h1>
      <p className={styles.leise}>{t("erzaehlenText", { anrede })}</p>
      <textarea
        className={styles.textfeld}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("tippen")}
        rows={4}
        maxLength={2000}
      />
      {denkt && <p className={styles.leise}>{t("denkt")}</p>}
      {fehler && <p className={styles.fehler}>{t("fehler")}</p>}
      <div className={styles.daumen}>
        <button
          type="button"
          className={styles.aufnahme}
          data-hoert={hoert}
          onPointerDown={(e) => {
            e.preventDefault();
            starteAufnahme();
          }}
          onPointerUp={stoppeAufnahme}
          onPointerLeave={() => hoert && stoppeAufnahme()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className={styles.aufnahmeKreis}>{hoert ? `0:${String(zeit).padStart(2, "0")}` : "●"}</span>
          <span>{hoert ? t("hoertZu") : t("aufnahme")}</span>
        </button>
        <div className={styles.knoepfe}>
          <button type="button" className={styles.nein} onClick={onFertig}>{t("abbrechen")}</button>
          <button type="button" className={styles.ja} onClick={senden} disabled={text.trim().length < 3 || denkt || hoert}>
            {t("senden")}
          </button>
        </div>
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
  werte: T[];
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
