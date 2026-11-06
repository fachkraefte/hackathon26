import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { erzeugeZugaenge, holeZugaenge } from "@/lib/zugang";
import { Drucken } from "./drucken";
import styles from "./codes.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("Codes");
  return { title: t("seitentitel") };
}

/** Code-Dokument für die Leitung: ein Zettel pro Person zum Ausschneiden. Codes sind nie mit Namen verknüpft. */
export default async function CodesSeite(props: PageProps<"/[locale]/codes/[code]">) {
  const { code } = await props.params;
  const b = await holeBestandsaufnahme(code.toUpperCase());
  if (!b) notFound();
  const t = await getTranslations("Codes");
  let codes = await holeZugaenge(b.id);
  // Bis zur Zahl der Beschäftigten auffüllen (z. B. Demo-Betrieb beim ersten Aufruf).
  if (codes.length < b.betrieb.mitarbeitende) codes = [...codes, ...(await erzeugeZugaenge(b.id, b.betrieb.mitarbeitende - codes.length))];
  const adresse = (await headers()).get("host") ?? "";
  return (
    <main className={styles.seite}>
      <header className={styles.kopf}>
        <div>
          <h1>{t("titel", { betrieb: b.betrieb.name })}</h1>
          <p>{t("anleitung")}</p>
          <p className={styles.leise}>{t("anzahl", { n: codes.length })}</p>
        </div>
        <Drucken text={t("drucken")} />
      </header>
      <ul className={styles.zettel}>
        {codes.map((c) => (
          <li key={c}>
            <span className={styles.marke}>ROKIO · {b.betrieb.name}</span>
            <span className={styles.dein}>{t("dein")}</span>
            <span className={styles.code}>{c}</span>
            <span className={styles.so}>{t("so", { adresse })}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
