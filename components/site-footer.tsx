"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTranslations, useLangFromPath } from "@/lib/i18n";
import { PsiDecor } from "@/components/psi-decor";

interface SiteFooterProps {
  lang?: string;
}

export function SiteFooter({ lang }: SiteFooterProps) {
  const pathname = usePathname();
  const pathLang = useLangFromPath(pathname);
  const currentLang = lang || pathLang;
  const t = getTranslations(currentLang);

  const mid = Math.ceil(t.footer.links.length / 2);

  return (
    <footer
      id="contacts"
      className="border-t-2 border-bauhaus-blue scroll-mt-[72px] lg:scroll-mt-24"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-4">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <PsiDecor className="text-xl" />
              {t.appName}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
              {t.footer.linksLabel}
            </h3>
            <nav className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <ul className="flex flex-col gap-1.5">
                {t.footer.links.slice(0, mid).map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground transition-colors inline-flex items-center min-h-[44px]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="underline hover:text-foreground transition-colors inline-flex items-center min-h-[44px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
              {t.footer.materialsLabel}
            </h3>
            <nav className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <ul className="flex flex-col gap-1.5">
                {t.footer.links.slice(mid).map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground transition-colors inline-flex items-center min-h-[44px]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="underline hover:text-foreground transition-colors inline-flex items-center min-h-[44px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
              {t.nav.contacts}
            </h3>
            <div className="flex flex-col gap-3 text-xs text-muted-foreground">
              <p className="leading-relaxed">{t.footer.address}</p>
              <a
                href={t.footer.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors inline-flex items-center min-h-[44px]"
              >
                {t.footer.telegram}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t.footer.copyright}</span>
          <span>
            {t.footer.by}{" "}
            <a
              href="https://t.me/speway"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors inline-flex items-center min-h-[44px]"
            >
              spw
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
