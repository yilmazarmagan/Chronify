import { i18n } from "@lingui/core";
import { messages as enMessages } from "../locales/en/messages.po";
import { messages as trMessages } from "../locales/tr/messages.po";

export const locales = {
  en: "English",
  tr: "Türkçe",
} as const;

export type Locale = keyof typeof locales;

const allMessages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  tr: trMessages,
};

export function activateLocale(locale: Locale) {
  i18n.load(locale, allMessages[locale]);
  i18n.activate(locale);
}

// Default: English
activateLocale("en");

export { i18n };
