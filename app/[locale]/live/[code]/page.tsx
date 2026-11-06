import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { liveDaten } from "@/lib/feed-aktionen";
import { Live } from "./live";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("Live");
  return { title: `${t("titel")} – ROKIO` };
}

export default async function LiveSeite(props: PageProps<"/[locale]/live/[code]">) {
  const { code } = await props.params;
  const start = await liveDaten(code);
  if (!start) notFound();
  const host = (await headers()).get("host") ?? "";
  return <Live code={code.toUpperCase()} start={start} adresse={`${host}/feed/${code.toUpperCase()}`} />;
}
