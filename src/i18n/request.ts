import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

import en from "../messages/en";
import es from "../messages/es";
import pt from "../messages/pt";
import fr from "../messages/fr";
import ar from "../messages/ar";
import zh from "../messages/zh";
import ja from "../messages/ja";
import ko from "../messages/ko";

const messagesByLocale: Record<string, Record<string, unknown>> = {
  en,
  es,
  pt,
  fr,
  ar,
  zh,
  ja,
  ko,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
