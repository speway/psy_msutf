import { ru } from "@/data/i18n/ru";
import { uz } from "@/data/i18n/uz";
import { en } from "@/data/i18n/en";
import type { SiteTranslation } from "@/data/i18n/index";

const translations: Record<string, SiteTranslation> = { ru, uz, en };

export function getTranslations(lang: string): SiteTranslation {
  return translations[lang] || ru;
}

export const LANGUAGES = [
  { code: "ru", label: "Рус", flag: "RU" },
  { code: "uz", label: "O‘zb", flag: "UZ" },
  { code: "en", label: "Eng", flag: "EN" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANG = "ru";

export function localizeHref(href: string, lang: string): string {
  const safeLang = lang === "en" || lang === "uz" ? lang : "ru";
  if (href === `/${safeLang}` || href.startsWith(`/${safeLang}/`)) return href;
  if (href.startsWith("/ru/") || href.startsWith("/en/") || href.startsWith("/uz/")) {
    const [, , ...rest] = href.split("/");
    const tail = rest.length > 0 ? `/${rest.join("/")}` : "";
    return `/${safeLang}${tail}`;
  }
  return href === "/" ? `/${safeLang}` : `/${safeLang}${href}`;
}

export function useLangFromPath(pathname: string): Lang {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first === "uz" || first === "en") return first;
  return "ru";
}
