import { Weiterleitung } from "./weiterleitung";

export const dynamic = "force-dynamic";

/** Link und QR-Code aus der Einladung: Team-Code → anonyme App auf diesem Gerät. */
export default async function FeedSeite(props: PageProps<"/[locale]/feed/[code]">) {
  const { code } = await props.params;
  return <Weiterleitung code={code} />;
}
