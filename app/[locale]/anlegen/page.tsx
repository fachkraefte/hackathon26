import { getTranslations } from "next-intl/server";
import { AnlegenFormular } from "./anlegen-formular";

export async function generateMetadata() {
  const t = await getTranslations("Anlegen");
  return { title: t("seitentitel") };
}

export default function AnlegenSeite() {
  return (
    <main className="seite seite--schmal">
      <AnlegenFormular />
    </main>
  );
}
