// Fragt das Modell nach JSON und prüft die Antwort mit zod.
// Schlägt die Prüfung fehl: einmal mit der Fehlermeldung erneut fragen (TECHNIK.md §3).
import { z } from "zod";
import { requestModelCompletion, type ModelMessage, type ModelRequest } from "./model";

type Optionen = Pick<ModelRequest, "reasoningEffort" | "timeoutMs">;

export function kiVerfuegbar() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (fehler) {
    return { __parseFehler: String(fehler) };
  }
}

export async function fragJson<T>(
  schema: z.ZodType<T>,
  messages: ModelMessage[],
  optionen: Optionen = {},
): Promise<T> {
  const start = Date.now();
  const erste = await requestModelCompletion({ messages, json: true, ...optionen });
  console.info(`KI-Antwort nach ${((Date.now() - start) / 1000).toFixed(1)} s`);
  const ergebnis = schema.safeParse(parseJson(erste));
  if (ergebnis.success) return ergebnis.data;

  const fehler = z.prettifyError(ergebnis.error);
  const zweite = await requestModelCompletion({
    json: true,
    ...optionen,
    messages: [
      ...messages,
      { role: "assistant", content: erste },
      {
        role: "user",
        content: `Deine Antwort passt nicht zum verlangten JSON-Format:\n${fehler}\nGib die vollständige Antwort noch einmal als gültiges JSON zurück.`,
      },
    ],
  });
  const zweiter = schema.safeParse(parseJson(zweite));
  if (zweiter.success) return zweiter.data;
  throw new Error(`KI-Antwort hat zweimal das falsche Format:\n${z.prettifyError(zweiter.error)}`, {
    cause: zweiter.error,
  });
}
