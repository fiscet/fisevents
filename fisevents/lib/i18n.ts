export const i18n = {
  defaultLocale: "en",
  locales: ["en", "it", "hu"],
  visibleLocales: ["en", "it"],
  localeNames: {
    en: "English",
    it: "Italiano",
    hu: "Magyar"
  }
} as const;

export type Locale = (typeof i18n)["locales"][number];