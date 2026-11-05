import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ladeDemo } from "@/lib/daten";
import { zeitraeume } from "@/lib/typen";
import { Betriebskarte, UebergabeKette } from "../../_komponenten/betriebskarte";
import { Schrittleiste } from "../../_komponenten/schrittleiste";
import { BeschlussUebersicht, ProfilMitZiel } from "../../besprechung/[id]/beschluss";
import { Folien } from "./folien";
import styles from "./praesentation.module.css";

export default async function PraesentationPage(props: PageProps<"/[locale]/praesentation/[id]">) {
  const { id } = await props.params;
  const demo = ladeDemo(id);
  if (!demo) notFound();

  const t = await getTranslations("Praesentation");
  const tb = await getTranslations("Begriffe");
  const { betrieb, bestandsaufnahme, antworten, gesamtbild, fahrplan } = demo;
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
  const hauptthema = gesamtbild.themen[0];

  return (
    <main className="seite">
      <Schrittleiste aktiv={6} />
      <Folien>
        <section className={styles.titelfolie}>
          <p className="ueberzeile">{t("titelUeberzeile")}</p>
          <h1>{betrieb.name}</h1>
          <p className={styles.untertitel}>{t("titelUntertitel")}</p>
          <p className={styles.teilnahme}>{t("teilnahme", { antworten: gesamtbild.antwortenGesamt, erwartet })}</p>
        </section>

        <section>
          <h2>{t("gutTitel")}</h2>
          <div className={styles.grossListe}>
            {gesamtbild.staerken.map((s) => <p key={s}>{s}</p>)}
          </div>
        </section>

        <section>
          <h2>{t("karteTitel")}</h2>
          <div className={styles.zweispaltig}>
            <Betriebskarte themen={gesamtbild.themen} bereiche={kartenBereiche} />
            <ol className={styles.themen}>
              {gesamtbild.themen.map((th) => <li key={th.id}>{th.titel}</li>)}
            </ol>
          </div>
        </section>

        <section>
          <h2>{t("ketteTitel")}</h2>
          <UebergabeKette themen={gesamtbild.themen} namen={namen} />
          {hauptthema && (
            <blockquote className={styles.zitat}>„{hauptthema.aussagen[0]}“</blockquote>
          )}
        </section>

        <section>
          <h2>{t("kostenTitel")}</h2>
          <div className={styles.kosten}>
            {mitStunden.map((th) => (
              <div key={th.id}>
                <span className={styles.kostenBalken} style={{ height: `${((th.stundenProWoche ?? 0) / maxStunden) * 12}rem` }}>
                  {th.stundenProWoche} h
                </span>
                <span className="klein">{th.titel}</span>
              </div>
            ))}
          </div>
          <p className="leise klein">{t("kostenHinweis")}</p>
        </section>

        <section>
          <h2>{t("profilTitel")}</h2>
          <ProfilMitZiel
            id={id}
            profil={gesamtbild.profil}
            bereiche={bestandsaufnahme.bereiche.map((b) => ({ id: b.id, name: b.name }))}
          />
        </section>

        <section>
          <h2>{t("fahrplanTitel")}</h2>
          <div className={styles.fahrplan}>
            {zeitraeume.map((z) => (
              <div key={z}>
                <h3>{tb(`zeitraum.${z}`)}</h3>
                <ul>
                  {fahrplan.massnahmen.filter((m) => m.zeitraum === z).map((m) => (
                    <li key={m.id} style={{ "--art": `var(--art-${m.art})` }}>
                      {m.titel}
                      <span className="leise klein">
                        {tb(`loesungsart.${m.art}`)} · {tb(`herkunft.${m.herkunft}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>{t("beschlussTitel")}</h2>
          <BeschlussUebersicht id={id} />
        </section>

        <section className={styles.schlussfolie}>
          <p className={styles.pointe}>{t("pointe")}</p>
          <h2>{t("rokiTitel")}</h2>
          <p>{t("rokiText")}</p>
        </section>
      </Folien>
    </main>
  );
}
