import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as localeFromParams } from "next/root-params";
import { routing } from "./routing";

const messageCatalogs = {
  en: () => import("../messages/en.json"),
  de: () => import("../messages/de.json"),
} as const;

export default getRequestConfig(async ({ locale }) => {
  const resolved = locale ?? (await localeFromParams());

  if (!hasLocale(routing.locales, resolved)) {
    notFound();
  }

  return {
    locale: resolved,
    messages: (await messageCatalogs[resolved]()).default,
  };
});
