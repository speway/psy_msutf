"use client";

import { Sun, Moon, Palette, Contrast, ChevronDown, Check } from "lucide-react";
import { useCallback, useRef, useSyncExternalStore } from "react";

const THEMES = [
  { id: "academic", label: "Академическая", icon: Sun },
  { id: "bauhaus", label: "Баухаус", icon: Palette },
  { id: "glamour-archive", label: "Гламурный архив", icon: Moon },
  { id: "night-archive", label: "Ночной архив", icon: Moon },
  { id: "high-contrast", label: "Высокий контраст", icon: Contrast },
] as const;

type Theme = (typeof THEMES)[number]["id"];

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

interface ThemeSwitcherProps {
  open?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

function getThemeSnapshot(): Theme {
  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && THEMES.some((t) => t.id === stored)) return stored;
  } catch {}
  return "academic";
}

function subscribeToTheme(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ThemeSwitcher({ open, onToggle, onClose }: ThemeSwitcherProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "academic" as Theme
  );

  const switchTheme = useCallback(
    (theme: Theme) => {
      localStorage.setItem("theme", theme);
      applyTheme(theme);
      window.dispatchEvent(new Event("storage"));
      onClose?.();
    },
    [onClose]
  );

  const currentTheme = THEMES.find((t) => t.id === current) ?? THEMES[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="dropdown-trigger"
        aria-label="Переключить тему"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <CurrentIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">Тема</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Выбор темы"
          className="dropdown-panel absolute right-0 top-full mt-1 z-50 w-52"
        >
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const isActive = theme.id === current;
            return (
              <button
                key={theme.id}
                role="option"
                aria-selected={isActive}
                onClick={() => switchTheme(theme.id)}
                className={`dropdown-item ${isActive ? "active" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1">{theme.label}</span>
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
