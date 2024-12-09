import { Locale, i18n } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export const useCurrentLang = () => {
  const pathName = usePathname();

  if (!pathName) return i18n.defaultLocale;

  const segments = pathName.split('/');

  return segments[1] as Locale;
};  