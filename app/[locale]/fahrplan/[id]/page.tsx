import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ladeDemo, wissenZu } from "@/lib/daten";
import { zeitraeume } from "@/lib/typen";
import { ArtChip, HerkunftHinweis, ReifegradChip } from "../../_komponenten/kennzeichnung";
import { Schrittleiste } from "../../_komponenten/schrittleiste";
import styles from "./fahrplan.module.css";

export default async function FahrplanPage(props: PageProps<"/[locale]/fahrplan/[id]">) {
  const { id } = await props.params;
  const demo = ladeDemo(id);
  if (!demo) notFound();

  const t = await getTranslations("Fahrplan");
  const tb = await getTranslations("Begriffe");
  const { betrieb, gesamtbild, fahrplan } = demo;
  const themaNr = new Map(gesamtbild.themen.map((th, i) => [th.id, { nr: i + 1, titel: th.titel }]));

  return (
    <main className="seite">
      <Schrittleiste aktiv={4} />
      <header className="seitenkopf">
        <p className="ueberzeile">{t("ueberzeile", { betrieb: betrieb.name })}</p>
        <h1>{t("titel")}</h1>
        <p>{t("einleitung")}</p>
      </header>

      <div className={styles.zeitstrahl} aria-hidden>
        {zeitraeume.map((z) => (
          <span key={z}>
            <strong>{tb(`zeitraum.${z}`)}</strong> {tb(`zeitraumDauer.${z}`)}
          </span>
        ))}
      </div>

      <div className={styles.spalten}>
        {zeitraeume.map((z) => (
          <section key={z} className={styles.spalte} aria-label={tb(`zeitraum.${z}`)}>
            <h2 className={styles.spaltenKopf}>
              {tb(`zeitraum.${z}`)} <span className="leise klein">{tb(`zeitraumDauer.${z}`)}</span>
            </h2>
            {fahrplan.massnahmen
              .filter((m) => m.zeitraum === z)
              .map((m) => {
                const wissen = wissenZu(m.wissenId);
                const thema = themaNr.get(m.themaId);
                return (
                  <article key={m.id} className={`karte ${styles.massnahme}`} style={{ "--art": `var(--art-${m.art})` }}>
                    <div className="chips">
                      <ArtChip art={m.art} />
                      {wissen && <ReifegradChip reifegrad={wissen.reifegrad} />}
                    </div>
                    <h3>{m.titel}</h3>
                    {thema && (
                      <p className="leise klein">{t("zuThema", { nr: thema.nr, titel: thema.titel })}</p>
                    )}
                    <p className={styles.ersterSchritt}>
                      <span className="ueberzeile">{t("ersterSchritt")}</span>
                      {m.ersterSchritt}
                    </p>
                    <details>
                      <summary>{t("wasPruefen")}</summary>
                      <ul>
                        {m.wasPruefen.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </details>
                    <p className={styles.werHilft}>
                      <span className="leise klein">{t("werHilft")}</span>
                      <span className="chips">
                        {m.werHilft.map((w) => <span key={w} className="chip">{tb(`werHilft.${w}`)}</span>)}
                      </span>
                    </p>
                    <HerkunftHinweis herkunft={m.herkunft} wissen={wissen} />
                  </article>
                );
              })}
          </section>
        ))}
      </div>

      <section className={`karte ${styles.pointe}`}>
        <p>{t("pointe")}</p>
      </section>

      <div className={styles.weiter}>
        <Link className="button button--ghost" href={`/ergebnis/${id}`}>{t("zurueck")}</Link>
        <Link className="button" href={`/besprechung/${id}`}>{t("zurBesprechung")}</Link>
      </div>
    </main>
  );
}
