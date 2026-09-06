import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { GlossaryClient } from "@/components/glossary-client";
import { InternalLinkCard } from "@/components/internal-link-card";
import { SiteNotice } from "@/components/site-notice";
import { getTranslations, localizeHref } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: `${t.glossary.title} — ${t.appName}`,
    description: t.glossary.title,
    openGraph: {
      title: `${t.glossary.title} — ${t.appName}`,
      description: t.glossary.title,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.glossary.title} — ${t.appName}`,
      description: t.glossary.title,
    },
  };
}

export default async function LangGlossaryPage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const lh = (href: string) => localizeHref(href, lang);

  return (
    <div className="page-glossary relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionIntro
        title={t.glossary.title}
        eyebrow={t.glossary.badge}
        number="02"
        lang={lang}
      />

      {lang !== "ru" && <SiteNotice message={t.siteNotice.glossary} />}

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-8 md:py-12"
        direction="up"
      >
        <GlossaryClient t={t.glossaryUI} />
      </AnimateOnScroll>

      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-center mb-8 text-bauhaus-blue">
              {t.glossary.relatedHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {t.glossary.relatedCards.map((card) => (
                <InternalLinkCard
                  key={card.title}
                  href={lh(
                    card.title === "Публикации" ||
                      card.title === "Publications" ||
                      card.title === "Nashrlar"
                      ? "/publications"
                      : card.title === "Путь студента в науку" ||
                          card.title === "Student path to science" ||
                          card.title === "Talabaning fanga yo'li"
                        ? "/roadmap"
                        : "/history"
                  )}
                  title={card.title}
                  description={card.description}
                  label={card.label}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
