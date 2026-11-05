// Beschluss der Besprechung im Dummy: im Browser (localStorage) gespeichert,
// damit Besprechung und Präsentation dieselben Werte zeigen.
// Später liegt der Beschluss in Supabase (Tabelle beschluesse).
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { z } from "zod";
import { Beschluss } from "./typen";

const EREIGNIS = "beschluss-geaendert";

function abonniere(melde: () => void) {
  window.addEventListener("storage", melde);
  window.addEventListener(EREIGNIS, melde);
  return () => {
    window.removeEventListener("storage", melde);
    window.removeEventListener(EREIGNIS, melde);
  };
}

function lies(roh: string | null): { beschluss: Beschluss | null; fehler: string | null } {
  if (!roh) return { beschluss: null, fehler: null };
  let json: unknown;
  try {
    json = JSON.parse(roh);
  } catch (fehler) {
    return { beschluss: null, fehler: `Gespeicherter Beschluss ist kein gültiges JSON: ${String(fehler)}` };
  }
  const ergebnis = Beschluss.safeParse(json);
  return ergebnis.success
    ? { beschluss: ergebnis.data, fehler: null }
    : { beschluss: null, fehler: z.prettifyError(ergebnis.error) };
}

export function leererBeschluss(bestandsaufnahmeId: string): Beschluss {
  return { bestandsaufnahmeId, zielwerte: [], ersterTestlauf: "", verantwortlich: "" };
}

export function useBeschluss(bestandsaufnahmeId: string) {
  const schluessel = `beschluss-${bestandsaufnahmeId}`;
  const roh = useSyncExternalStore(
    abonniere,
    () => window.localStorage.getItem(schluessel),
    () => null,
  );
  const { beschluss, fehler } = useMemo(() => lies(roh), [roh]);

  const speichere = useCallback(
    (neu: Beschluss | null) => {
      if (neu) window.localStorage.setItem(schluessel, JSON.stringify(neu));
      else window.localStorage.removeItem(schluessel);
      window.dispatchEvent(new Event(EREIGNIS));
    },
    [schluessel],
  );

  // Ändert immer den zuletzt gespeicherten Stand, nicht den aus dem letzten Render –
  // sonst überschreiben sich schnell aufeinanderfolgende Eingaben.
  const aendere = useCallback(
    (aenderung: (alt: Beschluss) => Beschluss) => {
      const alt = lies(window.localStorage.getItem(schluessel)).beschluss ?? leererBeschluss(bestandsaufnahmeId);
      speichere(aenderung(alt));
    },
    [schluessel, bestandsaufnahmeId, speichere],
  );

  return { beschluss, fehler, speichere, aendere };
}
