"use client";

import { Languages, ChevronDown, Check } from "lucide-react";
import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LANGUAGES, localizeHref, useLangFromPath } from "@/lib/i18n";

interface LanguageSwitcherProps {
  compact?: boolean;
  open?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function LanguageSwitcher({
  compact,
  open,
  onToggle,
  onClose,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const current = useLangFromPath(pathname);

  const switchLang = useCallback(
    (code: string) => {
      localStorage.setItem("lang", code);
      document.documentElement.setAttribute("lang", code);
      window.dispatchEvent(new Event("storage"));
      onClose?.();

      const segments = pathname.split("/").filter(Boolean);
      if (
        segments[0] === "ru" ||
        segments[0] === "uz" ||
        segments[0] === "en"
      ) {
        segments.shift();
      }
      const path = "/" + segments.join("/");
      const newPath = localizeHref(path === "/" ? "/" : path, code);
      router.push(newPath);
    },
    [pathname, router, onClose]
  );

  if (compact) {
    return (
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Выбор языка"
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === current;
          return (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              aria-current={isActive ? "true" : undefined}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 ${
                isActive
                  ? "bg-accent/20 text-foreground"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              }`}
            >
              {lang.flag}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="dropdown-trigger"
        aria-label="Переключить язык"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left text-[0.7rem] font-bold uppercase">
          {LANGUAGES.find((l) => l.code === current)?.label ?? current}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Выбор языка"
          className="dropdown-panel absolute right-0 top-full mt-1 z-50 w-32"
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                onClick={() => switchLang(lang.code)}
                className={`dropdown-item ${isActive ? "active" : ""}`}
              >
                <span className="w-5 text-center text-xs font-bold shrink-0">
                  {lang.flag}
                </span>
                <span className="flex-1">{lang.label}</span>
                {isActive && (
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
