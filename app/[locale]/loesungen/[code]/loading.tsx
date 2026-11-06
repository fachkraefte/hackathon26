import { getTranslations } from "next-intl/server";

export default async function Laden() {
  const t = await getTranslations("Loesungen");
  return (
    <main className="seite seite--schmal">
      <p className="leise" style={{ paddingTop: "3rem", textAlign: "center" }}>{t("laedt")}</p>
    </main>
  );
}
