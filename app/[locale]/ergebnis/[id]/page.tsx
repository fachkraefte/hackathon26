import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ladeDemo } from "@/lib/daten";
import { Betriebskarte, UebergabeKette } from "../../_komponenten/betriebskarte";
import { ProfilUmschalter } from "../../_komponenten/profil-umschalter";
import { Schrittleiste } from "../../_komponenten/schrittleiste";
import styles from "./ergebnis.module.css";

export default async function ErgebnisPage(props: PageProps<"/[locale]/ergebnis/[id]">) {
  const { id } = await props.params;
  const demo = ladeDemo(id);
  if (!demo) notFound();

  const t = await getTranslations("Ergebnis");
  const { betrieb, bestandsaufnahme, gesamtbild, antworten } = demo;
  const namen = Object.fromEntries(bestandsaufnahme.bereiche.map((b) => [b.id, b.name]));
  const erwartet = bestandsaufnahme.bereiche.reduce((s, b) => s + b.erwarteteAntworten, 0);
  const kartenBereiche = bestandsaufnahme.bereiche.map((b) => ({
    id: b.id,
    name: b.name,
    erwartet: b.erwarteteAntworten,
    antworten: antworten.filter((a) => a.bereichId === b.id).length,
  }));
  const mitStunden = gesamtbild.themen.filter((th) => th.stundenProWoche);
  const maxStunden = Math.max(...mitStunden.map((th) => th.stundenProWoche ?? 0), 1);
  const summeStunden = mitStunden.reduce((s, th) => s + (th.stundenProWoche ?? 0), 0);

  return (
    <main className="seite">
      <Schrittleiste aktiv={3} />
      <header className="seitenkopf">
        <p className="ueberzeile">{t("ueberzeile", { betrieb: betrieb.name })}</p>
        <h1>{t("titel")}</h1>
        <p>{t("einleitung", { antworten: gesamtbild.antwortenGesamt, erwartet })}</p>
      </header>

      <section className={styles.kennzahlen}>
        <div className={`karte ${styles.kennzahl}`}>
          <span className={styles.zahl}>{gesamtbild.antwortenGesamt}/{erwartet}</span>
          <span className="leise">{t("kennzahlAntworten")}</span>
        </div>
        <div className={`karte ${styles.kennzahl}`}>
          <span className={styles.zahl}>{gesamtbild.themen.length}</span>
          <span className="leise">{t("kennzahlThemen")}</span>
        </div>
        <div className={`karte ${styles.kennzahl}`}>
          <span className={styles.zahl}>{gesamtbild.themen.filter((th) => th.istSchnittstelle).length}</span>
          <span className="leise">{t("kennzahlSchnittstellen")}</span>
        </div>
        <div className={`karte ${styles.kennzahl}`}>
          <span className={`${styles.zahl} ${styles.orange}`}>{t("stundenZahl", { stunden: summeStunden })}</span>
          <span className="leise">{t("kennzahlStunden")}</span>
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("karteTitel")}</h2>
        <p className="unterzeile">{t("karteText")}</p>
        <div className={styles.karteMitListe}>
          <div className="karte">
            <Betriebskarte themen={gesamtbild.themen} bereiche={kartenBereiche} />
          </div>
          <ol className={styles.themenliste}>
            {gesamtbild.themen.map((th, i) => (
              <li key={th.id}>
                <span className={th.istSchnittstelle ? styles.nrSchnitt : styles.nr}>{i + 1}</span>
                <div>
                  <a href={`#${th.id}`}><strong>{th.titel}</strong></a>
                  <p className="leise klein">
                    {th.bereiche.map((b) => namen[b] ?? b).join(" · ")}
                    {th.stundenProWoche ? ` · ${t("stundenKurz", { stunden: th.stundenProWoche })}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("ketteTitel")}</h2>
        <p className="unterzeile">{t("ketteText")}</p>
        <div className="karte">
          <UebergabeKette themen={gesamtbild.themen} namen={namen} />
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("kostenTitel")}</h2>
        <p className="unterzeile">{t("kostenText")}</p>
        <div className={`karte ${styles.kosten}`}>
          {mitStunden.map((th) => (
            <div key={th.id} className={styles.kostenZeile}>
              <span>{th.titel}</span>
              <span className={styles.kostenSpur}>
                <span style={{ width: `${((th.stundenProWoche ?? 0) / maxStunden) * 100}%` }} />
              </span>
              <strong>{t("stundenZahl", { stunden: th.stundenProWoche ?? 0 })}</strong>
            </div>
          ))}
          <p className="leise klein">{t("kostenHinweis")}</p>
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("profilTitel")}</h2>
        <p className="unterzeile">{t("profilText")}</p>
        <div className="karte">
          <ProfilUmschalter
            profil={gesamtbild.profil}
            bereiche={bestandsaufnahme.bereiche.map((b) => ({ id: b.id, name: b.name }))}
          />
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("staerkenTitel")}</h2>
        <div className="raster">
          {gesamtbild.staerken.map((s) => (
            <p key={s} className={`karte ${styles.staerke}`}>{s}</p>
          ))}
        </div>
      </section>

      <section className="abschnitt">
        <h2>{t("themenTitel")}</h2>
        <p className="unterzeile">{t("themenText", { mindestanzahl: bestandsaufnahme.mindestanzahl })}</p>
        <div className={styles.themen}>
          {gesamtbild.themen.map((th, i) => (
            <article key={th.id} id={th.id} className="karte">
              <div className={styles.themaKopf}>
                <span className={th.istSchnittstelle ? styles.nrSchnitt : styles.nr}>{i + 1}</span>
                <h3>{th.titel}</h3>
              </div>
              <div className="chips">
                {th.istSchnittstelle && <span className={`chip ${styles.chipSchnitt}`}>{t("schnittstelle")}</span>}
                <span className="chip">{t("nennungen", { anzahl: th.anzahlNennungen })}</span>
                {th.stundenProWoche !== undefined && (
                  <span className="chip">{t("stundenKurz", { stunden: th.stundenProWoche })}</span>
                )}
              </div>
              <p>{th.beschreibung}</p>
              {th.vermuteteUrsache && <p className="leise klein">{th.vermuteteUrsache}</p>}
              <ul className={styles.aussagen}>
                {th.aussagen.map((a) => <li key={a}>„{a}“</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.weiter}>
        <Link className="button" href={`/fahrplan/${id}`}>{t("zumFahrplan")}</Link>
      </div>
    </main>
  );
}
