"use client";

// Textfeld mit Einsprechen (Spracherkennung des Browsers). Der erkannte Text landet im Feld
// und lässt sich vor dem Absenden korrigieren (ROwAI_Personas: Marco).
import { useTranslations } from "next-intl";
import { useRef, useState, useSyncExternalStore } from "react";
import styles from "./eingabe.module.css";

function erkennerKlasse() {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

const nichts = () => () => {};

export function TextMitSprache({
  wert,
  setzeWert,
  platzhalter,
  zeilen = 4,
  autoFokus = false,
}: {
  wert: string;
  setzeWert: (text: string) => void;
  platzhalter: string;
  zeilen?: number;
  autoFokus?: boolean;
}) {
  const t = useTranslations("Eingabe");
  const kannSprechen = useSyncExternalStore(nichts, () => Boolean(erkennerKlasse()), () => false);
  const [hoert, setHoert] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const erkenner = useRef<SpeechRecognition | null>(null);

  function umschalten() {
    if (hoert) {
      erkenner.current?.stop();
      return;
    }
    const Klasse = erkennerKlasse();
    if (!Klasse) return;
    const r = new Klasse();
    r.lang = "de-DE";
    r.continuous = true;
    r.interimResults = false;
    const vorher = wert.trim();
    let gesprochen = "";
    r.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) gesprochen += `${event.results[i][0].transcript.trim()} `;
      }
      setzeWert(`${vorher ? `${vorher} ` : ""}${gesprochen}`.trim());
    };
    r.onerror = (event) => setFehler(t("fehler", { grund: event.error }));
    r.onend = () => setHoert(false);
    setFehler(null);
    erkenner.current = r;
    r.start();
    setHoert(true);
  }

  return (
    <div className={styles.feld}>
      <textarea
        value={wert}
        rows={zeilen}
        placeholder={platzhalter}
        autoFocus={autoFokus}
        onChange={(e) => setzeWert(e.target.value)}
      />
      {kannSprechen && (
        <button
          type="button"
          className={`${styles.mikro} ${hoert ? styles.aktiv : ""}`}
          onClick={umschalten}
          aria-pressed={hoert}
        >
          <span aria-hidden>{hoert ? "■" : "🎙"}</span> {hoert ? t("stopp") : t("sprechen")}
        </button>
      )}
      {fehler && <p className={styles.fehler}>{fehler}</p>}
    </div>
  );
}
