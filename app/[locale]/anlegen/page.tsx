import { getTranslations } from "next-intl/server";
import { findeBereichPerLink } from "@/lib/daten";
import { Schrittleiste } from "../_komponenten/schrittleiste";
import { AnlegenFormular } from "./anlegen-formular";

export default async function AnlegenPage() {
  const t = await getTranslations("Anlegen");
  // Vorbelegt mit dem Demo-Betrieb, damit die Demo ohne Tippen läuft.
  const demo = findeBereichPerLink("heidekamp-montage");
  if (!demo) throw new Error("Demo-Betrieb Metallbau Heidekamp fehlt in den Demo-Daten");

  return (
    <main className="seite">
      <Schrittleiste aktiv={0} />
      <header className="seitenkopf">
        <p className="ueberzeile">{t("ueberzeile")}</p>
        <h1>{t("titel")}</h1>
        <p>{t("einleitung")}</p>
      </header>
      <AnlegenFormular betrieb={demo.betrieb} bestandsaufnahme={demo.bestandsaufnahme} />
    </main>
  );
}
