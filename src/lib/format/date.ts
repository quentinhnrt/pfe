import type { Locale } from "date-fns";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const localeMap: Record<string, Locale> = {
  en: enUS,
} as const;

export const formatDate = (date: Date | number, locale?: string) => {
  const dateLocale = localeMap[locale ?? "en"];
  return format(date, "P", { locale: dateLocale });
};
