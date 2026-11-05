import { getTranslations } from "next-intl/server";
import { CodeFeld } from "./code-feld";

export async function generateMetadata() {
  const t = await getTranslations("Zugang");
  return { title: t("seitentitel") };
}

/** Code eingeben. `?ziel=analyse` führt zur Analyse statt zur Befragung. */
export default async function ZugangSeite(props: PageProps<"/[locale]/zugang">) {
  const t = await getTranslations("Zugang");
  const { ziel } = await props.searchParams;
  return (
    <main className="seite seite--schmal">
      <section style={{ display: "grid", gap: "1rem", paddingTop: "1rem" }}>
        <h1 style={{ margin: 0 }}>{t("titel")}</h1>
        <p className="leise" style={{ margin: 0 }}>{t("text")}</p>
        <CodeFeld ziel={ziel === "analyse" ? "analyse" : "befragung"} />
      </section>
    </main>
  );
}
