"use client";

// Code öffnen und die anonyme Sitzung dieses Geräts merken (nur im Browser, nie mit Namen).
import { oeffne } from "@/lib/feed-aktionen";

const schluessel = (team: string) => `rokio-team-${team.trim().toUpperCase()}`;

function lies(k: string) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}

/** Liefert Zielpfad und Sprache des Projekts, oder null, wenn es den Code nicht gibt. */
export async function oeffneMitGedaechtnis(code: string): Promise<{ pfad: string; sprache: "de" | "en" } | null> {
  const r = await oeffne(code, lies(schluessel(code))).catch(() => null);
  if (!r || !("pfad" in r)) return null;
  if (r.team && r.sitzung) {
    try {
      localStorage.setItem(schluessel(r.team), r.sitzung);
    } catch {}
  }
  return { pfad: r.pfad, sprache: r.sprache };
}
