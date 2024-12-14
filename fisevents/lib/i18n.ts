export const i18n = {
  defaultLocale: "en",
  locales: ["en", "it", "hu", "ro"],
  localeNames: {
    en: "English",
    it: "Italiano",
    hu: "Magyar",
    ro: "Română",
  }
} as const;

export type Locale = (typeof i18n)["locales"][number];