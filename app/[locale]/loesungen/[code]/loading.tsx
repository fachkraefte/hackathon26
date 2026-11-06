import { getTranslations } from "next-intl/server";
import { Laden } from "../../_komponenten/laden";

export default async function LoesungenLaedt() {
  const t = await getTranslations("Loesungen");
  return <Laden text={t("laedt")} />;
}
