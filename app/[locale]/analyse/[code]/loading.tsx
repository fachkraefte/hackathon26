import { getTranslations } from "next-intl/server";
import { Laden } from "../../_komponenten/laden";

export default async function AnalyseLaedt() {
  const t = await getTranslations("Analyse");
  return <Laden text={t("laedt")} />;
}
