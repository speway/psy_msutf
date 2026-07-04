"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Send,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  Contrast,
  Check,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslations, localizeHref, useLangFromPath } from "@/lib/i18n";

const DESKTOP_VISIBLE_COUNT = 5;

const MOBILE_THEMES = [
  { id: "academic", label: "Академическая", icon: Sun },
  { id: "bauhaus", label: "Баухаус", icon: Palette },
  { id: "glamour-archive", label: "Гламурный архив", icon: Moon },
  { id: "night-archive", label: "Ночной архив", icon: Moon },
  { id: "high-contrast", label: "Высокий контраст", icon: Contrast },
] as const;

type MobileTheme = (typeof MOBILE_THEMES)[number]["id"];

const NAV_ITEMS_BASE = [
  { href: "/", key: "home" },
  { href: "/publications", key: "publications" },
  { href: "/glossary", key: "glossary" },
  { href: "/roadmap", key: "roadmap" },
  { href: "/disciplines", key: "disciplines" },
  { href: "/archive", key: "archive" },
  { href: "/contacts", key: "contacts" },
] as const;

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileThemeOpen, setIsMobileThemeOpen] = useState(false);
  const [mobileCurrentTheme, setMobileCurrentTheme] =
    useState<MobileTheme>("academic");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as MobileTheme | null;
      if (MOBILE_THEMES.some((t) => t.id === stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileCurrentTheme(stored as MobileTheme);
      }
    } catch {}
  }, []);
  const pathname = usePathname();
  const lang = useLangFromPath(pathname);
  const t = getTranslations(lang);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const hasOpened = useRef(false);
  const prevPathname = useRef(pathname);

  const NAV_ITEMS = NAV_ITEMS_BASE.map((item) => ({
    ...item,
    href: localizeHref(item.href, lang),
    label: t.nav[item.key],
  }));

  const visibleItems = NAV_ITEMS.slice(0, DESKTOP_VISIBLE_COUNT);
  const overflowItems = NAV_ITEMS.slice(DESKTOP_VISIBLE_COUNT);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      const id = setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsMoreOpen(false);
        setIsLanguageOpen(false);
        setIsThemeOpen(false);
        setIsMobileThemeOpen(false);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    hasOpened.current = true;
    document.body.style.overflow = "hidden";
    const menu = menuRef.current;
    const burger = burgerRef.current;
    if (menu) {
      const firstFocusable = menu.querySelector<HTMLElement>(
        "a, button, [tabindex]:not([tabindex='-1'])"
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
    return () => {
      document.body.style.overflow = "";
      if (hasOpened.current) {
        burger?.focus();
      }
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsMoreOpen(false);
        setIsLanguageOpen(false);
        setIsThemeOpen(false);
        setIsMobileThemeOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(e.target as Node) &&
        moreBtnRef.current &&
        !moreBtnRef.current.contains(e.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        headerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsMoreOpen(false);
      setIsLanguageOpen(false);
      setIsThemeOpen(false);
      setIsMobileThemeOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1120px)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false);
        setIsMobileThemeOpen(false);
      }
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("/#")) {
        const id = href.slice(2);
        if (pathname === localizeHref("/", lang)) {
          e.preventDefault();
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    },
    [pathname, lang]
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileThemeOpen(false);
  }, []);

  const switchMobileTheme = useCallback((themeId: MobileTheme) => {
    localStorage.setItem("theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    window.dispatchEvent(new Event("storage"));
    setMobileCurrentTheme(themeId);
    setIsMobileThemeOpen(false);
  }, []);

  const currentMobileTheme =
    MOBILE_THEMES.find((t) => t.id === mobileCurrentTheme) ?? MOBILE_THEMES[0];
  const CurrentMobileIcon = currentMobileTheme.icon;

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full h-[72px] bg-background/80 backdrop-blur-md border-b-2 border-border"
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
          <Link
            href={localizeHref("/", lang)}
            className="flex items-center gap-3 shrink-0 no-underline"
          >
            <div className="w-[44px] h-[44px] rounded-[6px] bg-bauhaus-ochre/10 flex items-center justify-center shrink-0">
              <span
                className="text-[28px] font-light text-bauhaus-ochre leading-none"
                aria-hidden="true"
              >
                Ψ
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-extrabold leading-tight text-foreground">
                {t.nav.shortTitle}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground leading-tight">
                {t.nav.subtitle}
              </span>
            </div>
          </Link>

          <nav
            aria-label={t.nav.menu}
            className="hidden xl:flex items-center justify-center flex-1 gap-1"
          >
            {visibleItems.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`px-3 py-1 text-sm font-[750] tracking-wide rounded-[6px] transition-all duration-200 min-h-[42px] flex items-center border whitespace-nowrap ${
                  pathname === link.href
                    ? "bg-accent/15 border-accent/30 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {overflowItems.length > 0 && (
              <div className="relative">
                <button
                  ref={moreBtnRef}
                  onClick={() => {
                    setIsMoreOpen((v) => !v);
                    setIsLanguageOpen(false);
                    setIsThemeOpen(false);
                  }}
                  className="dropdown-trigger"
                  aria-expanded={isMoreOpen}
                  aria-controls="more-nav-dropdown"
                  aria-haspopup="listbox"
                >
                  <span className="flex-1 text-left text-xs font-bold">
                    {t.nav.more}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isMoreOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isMoreOpen && (
                  <div
                    id="more-nav-dropdown"
                    ref={moreRef}
                    role="listbox"
                    className="dropdown-panel absolute right-0 top-full mt-1 z-50 w-44"
                  >
                    {overflowItems.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        role="option"
                        onClick={(e) => {
                          setIsMoreOpen(false);
                          handleNavClick(e, link.href);
                        }}
                        aria-selected={pathname === link.href}
                        className={`dropdown-item font-bold ${
                          pathname === link.href ? "active" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-2">
              <LanguageSwitcher
                open={isLanguageOpen}
                onToggle={() => {
                  setIsLanguageOpen((v) => !v);
                  setIsMoreOpen(false);
                  setIsThemeOpen(false);
                }}
                onClose={() => setIsLanguageOpen(false)}
              />
              <ThemeSwitcher
                open={isThemeOpen}
                onToggle={() => {
                  setIsThemeOpen((v) => !v);
                  setIsMoreOpen(false);
                  setIsLanguageOpen(false);
                }}
                onClose={() => setIsThemeOpen(false)}
              />
              <a
                href="https://t.me/psy_msutf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[0.65rem] font-bold rounded-[4px] border-2 border-bauhaus-ochre/60 text-bauhaus-ochre hover:bg-bauhaus-ochre/10 transition-colors duration-200 min-h-[34px]"
              >
                <Send className="h-3 w-3" aria-hidden="true" />
                {t.nav.telegram}
              </a>
            </div>
            <button
              ref={burgerRef}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="xl:hidden flex h-11 w-11 items-center justify-center rounded-[4px] border-2 border-border hover:border-bauhaus-ochre/60 hover:bg-accent/10 transition-all duration-200"
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative h-4 w-4">
                <Menu
                  className={`absolute inset-0 h-4 w-4 transition-all duration-300 motion-reduce:transition-none ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-90 scale-75"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                  aria-hidden="true"
                />
                <X
                  className={`absolute inset-0 h-4 w-4 transition-all duration-300 motion-reduce:transition-none ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-75"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[72px] z-40 bg-black/50 xl:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div
            id="mobile-menu"
            ref={menuRef}
            role="menu"
            aria-label={t.nav.menu}
            className="fixed left-0 right-0 top-[72px] z-[999] max-h-[calc(100dvh-72px)] overflow-y-auto border-b-2 border-border bg-card shadow-lg xl:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  role="menuitem"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    setIsMobileThemeOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`flex items-center px-4 min-h-[48px] text-sm font-[750] rounded-[6px] transition-all duration-150 ${
                    pathname === link.href
                      ? "bg-accent/20 text-foreground"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="px-4 pb-6 border-t-2 border-border/50">
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <LanguageSwitcher compact />
                </div>

                {/* Mobile theme selector */}
                <div className="border-t border-border/50 pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMobileThemeOpen((v) => !v);
                    }}
                    className="flex items-center justify-between w-full min-h-[48px] px-4 text-sm font-[750] rounded-[6px] border-2 border-border bg-background hover:bg-accent/10 transition-colors duration-150"
                    aria-expanded={isMobileThemeOpen}
                    aria-controls="mobile-theme-list"
                  >
                    <span className="flex items-center gap-2">
                      <CurrentMobileIcon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      <span>Тема</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isMobileThemeOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isMobileThemeOpen && (
                    <div id="mobile-theme-list" className="mt-2 grid gap-2">
                      {MOBILE_THEMES.map((theme) => {
                        const Icon = theme.icon;
                        const isActive = theme.id === mobileCurrentTheme;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              switchMobileTheme(theme.id);
                            }}
                            className={`flex items-center justify-between w-full min-h-[46px] px-4 text-sm font-[700] rounded-[6px] border transition-all duration-150 ${
                              isActive
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border bg-background text-foreground hover:bg-accent/10"
                            }`}
                            aria-pressed={isActive}
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                              <span>{theme.label}</span>
                            </span>
                            {isActive && (
                              <Check
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <a
                  href="https://t.me/psy_msutf"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-4 min-h-[48px] text-sm font-[750] text-bauhaus-ochre rounded-[6px] hover:bg-accent/10 transition-colors duration-150"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {t.nav.telegram}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
