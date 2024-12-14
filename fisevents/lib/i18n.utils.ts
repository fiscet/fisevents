import "server-only";
import type { Locale } from "./i18n";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  it: () => import("../dictionaries/it.json").then((module) => module.default),
  hu: () => import("../dictionaries/hu.json").then((module) => module.default),
  ro: () => import("../dictionaries/ro.json").then((module) => module.default),
};

const emailDictionaries = {
  en: () => import("../dictionaries/email/en.json").then((module) => module.default),
  it: () => import("../dictionaries/email/it.json").then((module) => module.default),
  hu: () => import("../dictionaries/email/hu.json").then((module) => module.default),
  ro: () => import("../dictionaries/email/hu.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();

export const getEmailDictionary = async (locale: Locale) =>
  emailDictionaries[locale]?.() ?? emailDictionaries.en();
