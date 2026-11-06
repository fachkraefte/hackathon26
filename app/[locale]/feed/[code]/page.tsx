import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { holeBestandsaufnahme } from "@/lib/speicher";
import { Feed } from "./feed";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("Feed");
  return { title: t("seitentitel") };
}

export default async function FeedSeite(props: PageProps<"/[locale]/feed/[code]">) {
  const { code } = await props.params;
  const b = await holeBestandsaufnahme(code.toUpperCase());
  if (!b) notFound();
  return <Feed code={b.id} betrieb={b.betrieb.name} anrede={b.anrede} bereiche={b.bereiche.map((x) => x.name)} />;
}
