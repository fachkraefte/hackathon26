const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-6.1-sol";
const TIMEOUT_MS = 20_000;

export type ModelRole = "system" | "user" | "assistant";

export type ModelMessage = {
  role: ModelRole;
  content: string;
};

export type ModelRequest = {
  messages: ModelMessage[];
  /**
   * Ask the model for a JSON object. Callers still validate the text.
   */
  json?: boolean;
  /**
   * How long the model may think. Short steps (a chat reply) use "low" for speed,
   * the merge step uses more. Omitted: the model's default.
   */
  reasoningEffort?: "low" | "medium" | "high";
  /** Overrides the default timeout for slow steps. */
  timeoutMs?: number;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local. See .env.example.`,
    );
  }
  return value;
}

function modelName(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readErrorMessage(body: unknown): string | undefined {
  if (!isRecord(body) || !isRecord(body.error)) {
    return undefined;
  }
  const message = body.error.message;
  return typeof message === "string" ? message : undefined;
}

function readContent(body: unknown): string | undefined {
  if (!isRecord(body) || !Array.isArray(body.choices)) {
    return undefined;
  }
  const first: unknown = body.choices[0];
  if (!isRecord(first) || !isRecord(first.message)) {
    return undefined;
  }
  const content = first.message.content;
  if (typeof content !== "string" || content.trim() === "") {
    return undefined;
  }
  return content;
}

function withoutKey(text: string, key: string): string {
  return text.split(key).join("[redacted]");
}

/**
 * Server-only model call. Import this from Server Components, Server Actions,
 * and Route Handlers. The API key must never be sent to the browser.
 *
 * Nothing calls this yet. Later AI steps use it so a local model can replace
 * the OpenAI request without changing those steps.
 */
export async function requestModelCompletion(
  request: ModelRequest,
): Promise<string> {
  const key = requiredEnv("OPENAI_API_KEY");
  if (request.messages.length === 0) {
    throw new Error("requestModelCompletion needs at least one message.");
  }

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName(),
        messages: request.messages,
        ...(request.json ? { response_format: { type: "json_object" } } : {}),
        ...(request.reasoningEffort ? { reasoning_effort: request.reasoningEffort } : {}),
      }),
      signal: AbortSignal.timeout(request.timeoutMs ?? TIMEOUT_MS),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`OpenAI request failed: ${withoutKey(message, key)}`, {
      cause: error,
    });
  }

  const raw = await response.text();
  let parsed: unknown;
  try {
    parsed = raw === "" ? undefined : (JSON.parse(raw) as unknown);
  } catch (error) {
    throw new Error(
      `OpenAI returned invalid JSON (HTTP ${response.status}).`,
      { cause: error },
    );
  }

  if (!response.ok) {
    const detail = readErrorMessage(parsed) ?? raw.slice(0, 200);
    throw new Error(
      `OpenAI rejected the request (HTTP ${response.status}). ${withoutKey(detail, key)}`,
    );
  }

  const content = readContent(parsed);
  if (!content) {
    throw new Error("OpenAI returned no assistant text.");
  }
  return content;
}
