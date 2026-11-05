import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ladeDemo, wissenZu } from "@/lib/daten";
import { zeitraeume } from "@/lib/typen";
import { ArtChip, ReifegradChip } from "../../_komponenten/kennzeichnung";
import { Schrittleiste } from "../../_komponenten/schrittleiste";
import { BeschlussFormular, DruckenKnopf, ProfilMitZiel } from "./beschluss";
import styles from "./besprechung.module.css";

const gliederung = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"] as const;

export default async function BesprechungPage(props: PageProps<"/[locale]/besprechung/[id]">) {
  const { id } = await props.params;
  const demo = ladeDemo(id);
  if (!demo) notFound();

  const t = await getTranslations("Besprechung");
  const tb = await getTranslations("Begriffe");
  const { betrieb, bestandsaufnahme, antworten, gesamtbild, fahrplan } = demo;

  // Die drei wichtigsten Themen: meiste Nennungen, bei Gleichstand mehr Stunden.
  const top3 = [...gesamtbild.themen]
    .sort((a, b) => b.anzahlNennungen - a.anzahlNennungen || (b.stundenProWoche ?? 0) - (a.stundenProWoche ?? 0))
    .slice(0, 3);
  const mitStunden = gesamtbild.themen.filter((th) => th.stundenProWoche);
  const summe = mitStunden.reduce((s, th) => s + (th.stundenProWoche ?? 0), 0);
  const istGesamt = Object.fromEntries(
    gesamtbild.profil.filter((p) => p.bereich === "gesamt").map((p) => [p.dimension, p.ist]),
  );

  return (
    <main className="seite">
      <Schrittleiste aktiv={5} />
      <header className={`seitenkopf ${styles.kopf}`}>
        <div>
          <p className="ueberzeile">{t("ueberzeile", { betrieb: betrieb.name })}</p>
          <h1>{t("titel")}</h1>
          <p>{t("einleitung")}</p>
        </div>
        <DruckenKnopf />
      </header>

      <div className={styles.layout}>
        <nav className={styles.agenda} aria-label={t("agenda")}>
          <p className="ueberzeile">{t("agenda")}</p>
          <ol>
            {gliederung.map((g, i) => (
              <li key={g}>
                <a href={`#${g}`}><span>{i + 1}</span> {t(`${g}.titel`)}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.inhalt}>
          <Abschnitt id="g1" nr={1} titel={t("g1.titel")}>
            <div className={styles.teilnahme}>
              {bestandsaufnahme.bereiche.map((b) => {
                const anzahl = antworten.filter((a) => a.bereichId === b.id).length;
                return (
                  <div key={b.id} className={styles.teilnahmeBereich}>
                    <div className={styles.punkte} aria-label={t("g1.aria", { anzahl, erwartet: b.erwarteteAntworten })}>
                      {Array.from({ length: b.erwarteteAntworten }, (_, i) => (
                        <span key={i} data-voll={i < anzahl || undefined} />
                      ))}
                    </div>
                    <strong>{b.name}</strong>
                    <span className="leise klein">{anzahl}/{b.erwarteteAntworten}</span>
                  </div>
                );
              })}
            </div>
            <p className="leise klein">{t("g1.hinweis")}</p>
          </Abschnitt>

          <Abschnitt id="g2" nr={2} titel={t("g2.titel")}>
            <ul className={styles.gutListe}>
              {gesamtbild.staerken.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Abschnitt>

          <Abschnitt id="g3" nr={3} titel={t("g3.titel")}>
            <p className="leise">{t("g3.text")}</p>
            <ProfilMitZiel
              id={id}
              profil={gesamtbild.profil}
              bereiche={bestandsaufnahme.bereiche.map((b) => ({ id: b.id, name: b.name }))}
            />
          </Abschnitt>

          <Abschnitt id="g4" nr={4} titel={t("g4.titel")}>
            <div className={styles.top3}>
              {top3.map((th, i) => (
                <article key={th.id} className={styles.topThema}>
                  <span className={styles.rang}>{i + 1}</span>
                  <h3>{th.titel}</h3>
                  <p className="leise klein">{t("g4.nennungen", { anzahl: th.anzahlNennungen })}</p>
                  {th.aussagen.slice(0, 2).map((a) => <blockquote key={a}>„{a}“</blockquote>)}
                </article>
              ))}
            </div>
          </Abschnitt>

          <Abschnitt id="g5" nr={5} titel={t("g5.titel")}>
            <p className={styles.summe}>{t("g5.summe", { stunden: summe })}</p>
            <div className={styles.stundenStapel} role="img" aria-label={t("g5.aria")}>
              {mitStunden.map((th) => (
                <span key={th.id} style={{ flexGrow: th.stundenProWoche }} title={th.titel}>
                  {th.stundenProWoche} h
                </span>
              ))}
            </div>
            <ul className={styles.stundenLegende}>
              {mitStunden.map((th) => (
                <li key={th.id}><strong>{th.stundenProWoche} h</strong> {th.titel}</li>
              ))}
            </ul>
            <p className="leise klein">{t("g5.hinweis")}</p>
          </Abschnitt>

          <Abschnitt id="g6" nr={6} titel={t("g6.titel")}>
            <div className={styles.loesungen}>
              {fahrplan.massnahmen.map((m) => {
                const wissen = wissenZu(m.wissenId);
                return (
                  <div key={m.id} className={styles.loesung}>
                    <span>{m.titel}</span>
                    <span className="chips">
                      <ArtChip art={m.art} />
                      {wissen && <ReifegradChip reifegrad={wissen.reifegrad} />}
                      <span className={`chip ${m.herkunft === "rokiGeprueft" ? styles.geprueft : ""}`}>
                        {tb(`herkunft.${m.herkunft}`)}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="leise klein">{t("g6.hinweis")}</p>
          </Abschnitt>

          <Abschnitt id="g7" nr={7} titel={t("g7.titel")}>
            <div className={styles.miniFahrplan}>
              {zeitraeume.map((z) => (
                <div key={z}>
                  <h3>{tb(`zeitraum.${z}`)} <span className="leise klein">{tb(`zeitraumDauer.${z}`)}</span></h3>
                  <ul>
                    {fahrplan.massnahmen.filter((m) => m.zeitraum === z).map((m) => (
                      <li key={m.id} style={{ "--art": `var(--art-${m.art})` }}>{m.titel}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href={`/fahrplan/${id}`} className="klein">{t("g7.details")}</Link>
          </Abschnitt>

          <Abschnitt id="g8" nr={8} titel={t("g8.titel")} hervorgehoben>
            <p>{t("g8.text")}</p>
            <BeschlussFormular
              id={id}
              istWerte={istGesamt}
              testlaeufe={fahrplan.massnahmen.filter((m) => m.zeitraum === "kurz").map((m) => m.titel)}
            />
          </Abschnitt>

          <Abschnitt id="g9" nr={9} titel={t("g9.titel")}>
            <p>{t("g9.text")}</p>
            <Link className="button button--tuerkis" href={`/praesentation/${id}`}>{t("g9.praesentation")}</Link>
          </Abschnitt>
        </div>
      </div>
    </main>
  );
}

function Abschnitt({
  id,
  nr,
  titel,
  hervorgehoben = false,
  children,
}: {
  id: string;
  nr: number;
  titel: string;
  hervorgehoben?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${styles.abschnitt} ${hervorgehoben ? styles.hervorgehoben : ""}`}>
      <span className={styles.nummer} aria-hidden>{String(nr).padStart(2, "0")}</span>
      <h2>{titel}</h2>
      {children}
    </section>
  );
}
