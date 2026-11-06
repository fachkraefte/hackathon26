import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { analyseDaten } from "@/lib/analyse";
import { ergaenzeLoesungen } from "@/lib/loesungen";
import { zahlenFormat } from "@/lib/rechnen";
import { Drucken } from "../../_komponenten/drucken";
import styles from "./plan.module.css";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

export async function generateMetadata() {
  const t = await getTranslations("Plan");
  return { title: t("seitentitel") };
}

/** Fahrplan zum Herunterladen (Drucken → als PDF sichern). Alles aus den Daten berechnet, nichts dazuerfunden. */
export default async function PlanSeite(props: PageProps<"/[locale]/plan/[code]">) {
  const { code } = await props.params;
  await ergaenzeLoesungen(code.toUpperCase());
  const d = await analyseDaten(code);
  if (!d) notFound();
  const { formatStunden, formatEuro } = zahlenFormat(await getLocale());
  const t = await getTranslations("Plan");
  const tb = await getTranslations("Begriffe");
  const probleme = [...d.faeden].filter((f) => f.personen > 0).sort((a, b) => b.stunden - a.stunden || b.personen - a.personen);
  const mitLoesung = probleme.filter((f) => d.loesungen[f.id]);
  const gut = [...d.lob, ...d.staerken];

  return (
    <main className={styles.plan}>
      <div className={styles.knopf}>
        <Drucken text={t("pdf")} />
        <p>{t("pdfHinweis")}</p>
      </div>

      <header className={styles.kopf}>
        <p className={styles.marke}>ROKIO · {t("fahrplan")}</p>
        <h1>{d.betrieb}</h1>
        <p>{d.deadline ? t("stand", { stimmen: d.teilgenommen, von: d.mitarbeitende, deadline: d.deadline }) : t("standOhne", { stimmen: d.teilgenommen, von: d.mitarbeitende })}</p>
      </header>

      <section>
        <h2>1 · {t("befundTitel")}</h2>
        <p className={styles.kern}>
          {t("kern", { h: formatStunden(d.summe.stunden), euro: formatEuro(d.summe.euro), n: probleme.filter((f) => f.stunden > 0).length })}
        </p>
        <table className={styles.tabelle}>
          <thead>
            <tr>
              <th>{t("problem")}</th>
              <th>{t("stimmen")}</th>
              <th>{t("stdWoche")}</th>
            </tr>
          </thead>
          <tbody>
            {probleme.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong>{f.kurzname}</strong>
                  <br />
                  {f.problem}
                </td>
                <td>{f.personen}</td>
                <td>{f.stunden > 0 ? formatStunden(f.stunden) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {gut.length > 0 && (
        <section>
          <h2>2 · {t("gutTitel")}</h2>
          <ul>{gut.map((g) => <li key={g}>{g}</li>)}</ul>
        </section>
      )}

      <section>
        <h2>3 · {t("vorgehenTitel")}</h2>
        <ol className={styles.schritte}>
          <li>
            <strong>{t("s1Titel")}</strong> {d.deadline ? t("s1Text", { deadline: d.deadline }) : t("s1TextOhne")}
          </li>
          <li>
            <strong>{t("s2Titel")}</strong> {t("s2Text")}
          </li>
          {mitLoesung.slice(0, 2).map((f, i) => (
            <li key={f.id}>
              <strong>{t("testTitel", { woche: i === 0 ? "3–6" : "7–10", name: d.loesungen[f.id].loesung.name })}</strong>{" "}
              {d.loesungen[f.id].loesung.testlauf}
            </li>
          ))}
          <li>
            <strong>{t("s4Titel")}</strong> {t("s4Text")}
          </li>
        </ol>
      </section>

      <section>
        <h2>4 · {t("loesungenTitel")}</h2>
        {mitLoesung.map((f) => {
          const l = d.loesungen[f.id].loesung;
          return (
            <article key={f.id} className={styles.loesung}>
              <h3>
                {l.name} <span>· {f.kurzname}</span>
              </h3>
              <p>{l.satz}</p>
              <p>
                <strong>{t("soLaeuftEs")}</strong> {l.schritte.join(" ")}
              </p>
              <p>
                <strong>{t("braucht")}</strong> {l.braucht.join(" · ")}
              </p>
              <p>
                <strong>{t("zeitFrei")}</strong> {l.zeitFrei}
              </p>
              <p className={styles.einordnung}>
                {tb(`reifegrad.${l.reife}`)} · {tb(`herkunft.${l.herkunft}`)}
              </p>
            </article>
          );
        })}
      </section>

      <section className={styles.hinweise}>
        <h2>5 · {t("hinweiseTitel")}</h2>
        <ul>
          <li>{t("h1")}</li>
          <li>{t("h2")}</li>
          <li>{t("h3")}</li>
        </ul>
      </section>
    </main>
  );
}
