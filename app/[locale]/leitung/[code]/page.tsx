import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import qrcode from "qrcode-generator";
import { Link } from "@/i18n/navigation";
import { analyseDaten } from "@/lib/analyse";
import { zahlenFormat } from "@/lib/rechnen";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { betriebZuLeitungsCode } from "@/lib/zugang";
import { Drucken } from "../../_komponenten/drucken";
import { Teilen } from "./teilen";
import styles from "./leitung.module.css";

export const dynamic = "force-dynamic";
// KI-Zuordnung neuer Meldungen kann dauern – nicht an der Standard-Zeitgrenze scheitern.
export const maxDuration = 90;

export async function generateMetadata() {
  const t = await getTranslations("Leitung");
  return { title: t("seitentitel") };
}

/** Dashboard der Leitung (privater Leitungs-Code): Team-Code teilen (Link, QR, Aushang), Stand, Befund, Lösungen, Fahrplan. */
export default async function LeitungSeite(props: PageProps<"/[locale]/leitung/[code]">) {
  const { code, locale } = await props.params;
  const betriebId = await betriebZuLeitungsCode(code);
  if (!betriebId) notFound();
  const b = await holeBestandsaufnahme(betriebId);
  if (!b) notFound();
  const { formatStunden } = zahlenFormat(await getLocale());
  const t = await getTranslations("Leitung");
  const d = await analyseDaten(b.id, { schnell: true }).catch(() => null);

  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const link = `${proto}://${host}/${locale}/feed/${b.id}`;
  const qr = qrcode(0, "M");
  qr.addData(link);
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
  const einladung = t(b.anrede === "sie" ? "einladungSie" : "einladungDu", { betrieb: b.betrieb.name, link, code: b.id }) +
    (b.deadline ? `\n\n${t("einladungTermin", { deadline: b.deadline })}` : "");
  const probleme = d ? [...d.faeden].filter((f) => f.personen > 0).sort((a, z) => z.personen - a.personen).slice(0, 3) : [];

  return (
    <main className={styles.dashboard}>
      <header className={styles.kopf}>
        <p className={styles.ueber}>{t("ueber")}</p>
        <h1>{b.betrieb.name}</h1>
        <p className={styles.privat}>{t("privat", { code: code.toUpperCase() })}</p>
      </header>

      {/* ---------- Team-Code teilen ---------- */}
      <section className={styles.teilen}>
        <div className={styles.aushang}>
          <p className={styles.aushangUeber}>ROKIO · {b.betrieb.name}</p>
          <p className={styles.aushangTitel}>{t("aushangTitel")}</p>
          <div className={styles.qr} dangerouslySetInnerHTML={{ __html: svg }} />
          <p className={styles.teamCode}>{b.id}</p>
          <p className={styles.aushangText}>{t("aushangText", { adresse: `${host}/${locale}/feed/${b.id}` })}</p>
        </div>
        <div className={styles.teilenText}>
          <h2>{t("teilenTitel")}</h2>
          <p>{t("teilenText")}</p>
          <p className={styles.einladung}>{einladung}</p>
          <Teilen text={einladung} link={link} />
          <Drucken text={t("drucken")} className={styles.knopfLeise} />
        </div>
      </section>

      {/* ---------- Stand ---------- */}
      {d && (
        <section className={styles.stand}>
          <h2>{t("standTitel")}</h2>
          <div className={styles.zahlen}>
            <p>
              <strong>{d.teilgenommen}</strong>
              <span>{t("mitgemacht", { von: d.mitarbeitende })}</span>
            </p>
            <p>
              <strong>{formatStunden(d.summe.stunden)}</strong>
              <span>{t("stunden")}</span>
            </p>
            <p>
              <strong>{probleme.length ? d.faeden.filter((f) => f.personen > 0).length : 0}</strong>
              <span>{t("probleme")}</span>
            </p>
          </div>
          {probleme.length > 0 && (
            <ol className={styles.top}>
              {probleme.map((f) => (
                <li key={f.id}>
                  <strong>{f.kurzname}</strong> · {t("stimmen", { n: f.personen })}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {/* ---------- Weiter ---------- */}
      <nav className={styles.wege}>
        <Link href={`/analyse/${b.id}`}>{t("befund")} →</Link>
        <Link href={`/loesungen/${b.id}`}>{t("loesungen")} →</Link>
        <Link href={`/plan/${b.id}`}>{t("fahrplan")} ↓</Link>
        <Link href={`/live/${b.id}`}>{t("live")} →</Link>
      </nav>
    </main>
  );
}
