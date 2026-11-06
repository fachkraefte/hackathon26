// Liest den sichtbaren Text einer Website für die Vorbereitung beim Anlegen (KONZEPT_V3 §3).
// Ohne neue Abhängigkeit: fetch + grobes Entfernen von HTML. Fehler sind kein Abbruch – dann ohne Website.

const MAX_ZEICHEN = 4000;

/** Nur öffentliche http(s)-Adressen; keine IPs, kein localhost (Schutz vor Abrufen ins interne Netz). */
function erlaubteAdresse(eingabe: string): URL | null {
  try {
    const url = new URL(/^https?:\/\//i.test(eingabe) ? eingabe : `https://${eingabe}`);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return null;
    if (/^[\d.]+$/.test(host) || host.includes(":")) return null; // IPv4/IPv6
    if (!host.includes(".")) return null;
    return url;
  } catch {
    return null;
  }
}

export async function leseWebsite(adresse: string | null): Promise<string | null> {
  if (!adresse) return null;
  const url = erlaubteAdresse(adresse.trim());
  if (!url) return null;
  try {
    const antwort = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "ROKIO-Vorbereitung/1.0" },
      redirect: "follow",
    });
    if (!antwort.ok || !(antwort.headers.get("content-type") ?? "").includes("text/html")) return null;
    const html = (await antwort.text()).slice(0, 400_000);
    const text = html
      .replace(/<(script|style|noscript|svg|nav|footer)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&[a-z]+;|&#\d+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 40 ? text.slice(0, MAX_ZEICHEN) : null;
  } catch {
    return null;
  }
}
