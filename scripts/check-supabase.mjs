import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), true, {
  info() {},
  error() {},
});

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local. See .env.example.`);
    process.exit(1);
  }
  return value;
}

const url = requiredEnv("SUPABASE_URL");
const key = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

function redact(text) {
  let safe = text.split(key).join("[redacted]").split(url).join("[redacted]");
  try {
    safe = safe.split(new URL(url).host).join("[redacted]");
  } catch {
    // The raw URL is already replaced above.
  }
  return safe;
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

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

if (typeof supabase.from !== "function") {
  console.error("Supabase client is missing the query API.");
  process.exit(1);
}

let response;
try {
  response = await fetch(new URL("/rest/v1/", url), {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
} catch (error) {
  console.error(`Supabase request failed: ${errorDetail(error)}`);
  process.exit(1);
}

if (response.status === 200) {
  console.log("Supabase accepted the server key. No tables were queried.");
  process.exit(0);
}

const body = (await response.text()).trim().slice(0, 200);
const detail = body ? ` ${redact(body)}` : "";
console.error(
  `Supabase rejected the server key (HTTP ${response.status}).${detail}`,
);
process.exit(1);
