"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTranslations, useLangFromPath } from "@/lib/i18n";
import { PsiDecor } from "@/components/psi-decor";
import { ArrowUpRight } from "lucide-react";

interface SiteFooterProps {
  lang?: string;
}

export function SiteFooter({ lang }: SiteFooterProps) {
  const pathname = usePathname();
  const pathLang = useLangFromPath(pathname);
  const currentLang = lang || pathLang;
  const t = getTranslations(currentLang);
  const labsLabel =
    currentLang === "en"
      ? "Learning labs"
      : currentLang === "uz"
        ? "O'quv laboratoriyalari"
        : "Учебные лаборатории";

  const mid = Math.ceil(t.footer.links.length / 2);

  return (
    <footer id="contacts" className="site-footer scroll-mt-[76px]">
      <div className="container footer-shell">
        <div className="footer-brand-row">
          <div className="footer-brand-mark" aria-hidden="true">
            <PsiDecor className="text-4xl" />
          </div>
          <div>
            <h2>{t.appName}</h2>
            <p>{t.footer.description}</p>
          </div>
          <span className="footer-edition">TF MSU / 2026</span>
        </div>

        <div className="footer-grid">
          <div>
            <h3>{t.footer.linksLabel}</h3>
            <nav>
              <ul>
                {t.footer.links.slice(0, mid).map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <ArrowUpRight />
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>

          <div>
            <h3>{t.footer.materialsLabel}</h3>
            <nav>
              <ul>
                {t.footer.links.slice(mid).map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <ArrowUpRight />
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>

          <div>
            <h3>{labsLabel}</h3>
            <nav>
              <ul>
                <li>
                  <a
                    href="https://psy-stat-lab.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    StatLab
                    <ArrowUpRight />
                  </a>
                </li>
                <li>
                  <a
                    href="https://psy-case-trainer.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Case Trainer
                    <ArrowUpRight />
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h3>{t.nav.contacts}</h3>
            <div className="footer-contact">
              <p>{t.footer.address}</p>
              <a
                href={t.footer.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.footer.telegram}
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.copyright}</span>
          <span>
            {t.footer.by}{" "}
            <a
              href="https://t.me/speway"
              target="_blank"
              rel="noopener noreferrer"
            >
              spw
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
