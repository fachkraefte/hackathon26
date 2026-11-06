import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { oeffne } from "@/lib/feed-aktionen";

export const dynamic = "force-dynamic";

/** QR-Code / Demo: Betriebscode eines Demo-Betriebs → neuer persönlicher Demo-Code → eigener Bereich. */
export default async function FeedSeite(props: PageProps<"/[locale]/feed/[code]">) {
  const { code, locale } = await props.params;
  const r = await oeffne(code).catch(() => null);
  if (!r || !("pfad" in r)) notFound();
  redirect({ href: r.pfad, locale: locale as "de" | "en" });
}
