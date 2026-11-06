import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { analyseDaten } from "@/lib/analyse";
import { demoFuer, demoIdFuer } from "@/lib/daten";
import { demoKarten } from "@/lib/feed";
import { zahlenFormat } from "@/lib/rechnen";
import { CodeFeld } from "./zugang/code-feld";
import { DemoZuruecksetzen } from "./demo-zuruecksetzen";
import { HandySimulation } from "./handy-simulation";
import { LiveKarte } from "./live-karte";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const BEISPIELE = ["metallbau", "pflege", "mensa"] as const;
const GESTEN = [
  { key: "kenn", zeichen: "→" },
  { key: "nicht", zeichen: "←" },
  { key: "staendig", zeichen: "↑" },
  { key: "halten", zeichen: "●" },
] as const;

export default async function Startseite() {
  const locale = await getLocale();
  const { formatStunden, formatEuro } = zahlenFormat(locale);
  // Demo in der Sprache der Oberfläche (deutsch: HEIDE1, englisch: HEIDEEN).
  const DEMO_ID = demoIdFuer(locale);
  const t = await getTranslations("Home");
  // Das echte Produktbild: Übergabe-Karte des Demo-Betriebs (fiktiv).
  const demo = await analyseDaten(DEMO_ID, { schnell: true }).catch(() => null);
  const loesungen = demo ? Object.fromEntries(Object.entries(demo.loesungen).map(([id, e]) => [id, e.loesung.name])) : {};
  const regeln = t.raw("regeln") as string[];
  // Simulation: drei Demo-Karten aus verschiedenen Handlungsfeldern; Resonanz aus den Demo-Stimmen (+ die eigene).
  const sim = demo
    ? ["f1", "f2", "f3"].flatMap((fid) => {
        const alle = demoKarten(demoFuer(DEMO_ID));
        const k = alle.find((x) => x.fadenId === fid && x.bereich !== alle.find((y) => y.fadenId === "f5")?.bereich) ?? alle.find((x) => x.fadenId === fid);
        const f = demo.faeden.find((x) => x.id === fid);
        if (!k || !f) return [];
        const bereiche = [...new Set(f.sichtweisen.map((s) => s.bereich))];
        return [{
          karte: { ...k, art: "aussage" as const, kurzname: f.kurzname },
          resonanz: { kennen: f.personen + 1, gesamt: f.personen + 1, bereiche, sichtbar: true },
        }];
      })
    : [];

  return (
    <main className={styles.start}>
      {/* ---------- Hero ---------- */}
      <section className={styles.held}>
        <div className={styles.heldText}>
          <h1 className={styles.titel}>{t("titel")}</h1>
          <p className={styles.einleitung}>{t("einleitung")}</p>
          <div className={styles.code}>
            <p className={styles.codeFrage}>{t("codeFrage")}</p>
            <CodeFeld ziel="feed" />
          </div>
          <p className={styles.leitung}>
            {t("fuerLeitung")} <Link href="/anlegen" className={styles.pfeilLink}>{t("anlegen")} →</Link>
          </p>
          <p className={styles.links}>
            <Link href={`/feed/${DEMO_ID}`}>{t("demoProbieren")}</Link>
            <Link href={`/live/${DEMO_ID}`}>{t("liveAnsehen")}</Link>
            <Link href="/zugang?ziel=analyse">{t("analyseAnsehen")}</Link>
          </p>
        </div>
        <HandySimulation karten={sim} demoPfad={`/feed/${DEMO_ID}`} />
      </section>

      {/* ---------- Einer erzählt, alle swipen ---------- */}
      <section className={styles.dunkel}>
        <div className={styles.innen}>
          <div className={styles.schleife}>
            <div>
              <h2 className={styles.h2}>{t("schleifeTitel")}</h2>
              <p className={styles.text}>{t("schleifeText")}</p>
            </div>
            <p className={styles.schleifeZahl}>
              {t("schleifeZahl")}
              <span>{t("schleifeZahlText")}</span>
            </p>
          </div>
          <ul className={styles.gesten}>
            {GESTEN.map((g) => (
              <li key={g.key} data-geste={g.key}>
                <span className={styles.gesteZeichen} aria-hidden>{g.zeichen}</span>
                {t(`gesten.${g.key}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Aus Stimmen wird ein Bild ---------- */}
      {demo && (
        <section className={styles.innen}>
          <div className={styles.bild}>
            <div className={styles.bildText}>
              <h2 className={styles.h2}>{t("bildTitel")}</h2>
              <p className={styles.text}>{t("bildText")}</p>
              <p className={styles.bildZahl}>
                {t("bildZahl", { h: formatStunden(demo.summe.stunden) })}
                <span>{t("bildZahlText", { euro: formatEuro(demo.summe.euro) })}</span>
              </p>
              <Link href={`/loesungen/${DEMO_ID}`} className={styles.pfeilLink}>{t("zuDenLoesungen")} →</Link>
            </div>
            <LiveKarte
              karte={demo.karte}
              loesungen={loesungen}
              texte={{
                heute: t("karteHeute"),
                mitLoesungen: t("karteMitLoesungen"),
                stimmen: t.raw("stimmen") as string,
                hinweis: t("karteHinweis"),
              }}
            />
          </div>
        </section>
      )}

      {/* ---------- Beispiele ---------- */}
      <section className={styles.innen}>
        <h2 className={styles.h2}>{t("beispieleTitel")}</h2>
        <ul className={styles.beispiele}>
          {BEISPIELE.map((b) => (
            <li key={b}>
              <span className={styles.branche}>{t(`beispiel.${b}.branche`)}</span>
              <span className={styles.stimme}>{locale === "en" ? `“${t(`beispiel.${b}.stimme`)}”` : `„${t(`beispiel.${b}.stimme`)}“`}</span>
              <span className={styles.loesung}>{t(`beispiel.${b}.loesung`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Vertrauen ---------- */}
      <section className={styles.innen}>
        <div className={styles.vertrauen}>
          <div>
            <h2 className={styles.h2}>{t("vertrauenTitel")}</h2>
            <p className={styles.text}>{t("vertrauenText")}</p>
          </div>
          <ol className={styles.regeln}>
            {regeln.map((r) => <li key={r}>{r}</li>)}
          </ol>
        </div>
      </section>

      <section className={styles.innen}>
        <p className={styles.schluss}>{t("schluss")}</p>
        <div className={styles.ehrlich}>
          <p>{t("ehrlich")}</p>
          <DemoZuruecksetzen />
        </div>
      </section>
    </main>
  );
}
