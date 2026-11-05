import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), true, {
  info() {},
  error() {},
});

const DEFAULT_MODEL = "gpt-6.1-sol";
const MODELS_URL = "https://api.openai.com/v1/models";

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local. See .env.example.`);
    process.exit(1);
  }
  return value;
}

const key = requiredEnv("OPENAI_API_KEY");
const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;

function redact(text) {
  return text.split(key).join("[redacted]");
}

function errorDetail(error) {
  const parts = [];
  if (error instanceof Error) {
    parts.push(error.message);
    if (error.cause instanceof Error) {
      const code =
        "code" in error.cause && typeof error.cause.code === "string"
          ? `${error.cause.code}: `
          : "";
      parts.push(`${code}${error.cause.message}`);
    }
  } else {
    parts.push(String(error));
  }
  return redact(parts.join(" "));
}

function isRecord(value) {
  return typeof value === "object" && value !== null;
}

let response;
try {
  response = await fetch(MODELS_URL, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
} catch (error) {
  console.error(`OpenAI request failed: ${errorDetail(error)}`);
  process.exit(1);
}

const raw = await response.text();
let parsed;
try {
  parsed = raw === "" ? undefined : JSON.parse(raw);
} catch (error) {
  console.error(
    `OpenAI returned invalid JSON (HTTP ${response.status}): ${errorDetail(error)}`,
  );
  process.exit(1);
}

function errorMessage(body) {
  if (!isRecord(body) || !isRecord(body.error)) {
    return undefined;
  }
  return typeof body.error.message === "string" ? body.error.message : undefined;
}

if (!response.ok) {
  const detail = errorMessage(parsed) ?? raw.trim().slice(0, 200);
  const suffix = detail ? ` ${redact(detail)}` : "";
  console.error(
    `OpenAI rejected the key (HTTP ${response.status}).${suffix}`,
  );
  process.exit(1);
}

const models = isRecord(parsed) && Array.isArray(parsed.data) ? parsed.data : [];
const found = models.some(
  (entry) => isRecord(entry) && entry.id === model,
);

if (!found) {
  console.error(
    `OpenAI accepted the key, but model ${model} is not in the list. No completion was requested.`,
  );
  process.exit(1);
}

console.log(
  `OpenAI accepted the key. Model ${model} is available. No completion was requested.`,
);
