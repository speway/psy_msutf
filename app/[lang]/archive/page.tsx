import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { InternalLinkCard } from "@/components/internal-link-card";
import { getTranslations, localizeHref } from "@/lib/i18n";
import {
  ScrollText,
  Music,
  MapPin,
  Users,
  BookMarked,
  FlaskConical,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

const ARCHIVE_ICONS = [
  ScrollText,
  MapPin,
  Music,
  BookMarked,
  FlaskConical,
  Users,
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: `${t.archive.title} — ${t.appName}`,
    description: t.archive.desc,
    openGraph: {
      title: `${t.archive.title} — ${t.appName}`,
      description: t.archive.desc,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.archive.title} — ${t.appName}`,
      description: t.archive.desc,
    },
  };
}

export default async function LangArchivePage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);

  const ARCHIVE_ITEM_HREFS = [
    localizeHref("/history", lang),
    localizeHref("/history", lang),
    localizeHref("/hymn", lang),
    localizeHref("/department", lang),
    localizeHref("/projects", lang),
    localizeHref("/people", lang),
  ];

  return (
    <div className="page-archive relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionIntro
        title={t.archive.title}
        description={t.archive.desc}
        eyebrow={t.archive.badge}
        number="05"
        lang={lang}
      />

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-8 md:py-12"
        direction="up"
      >
        <div className="archive-directory">
          {t.archive.items.map((item, index) => {
            const Icon = ARCHIVE_ICONS[index] || Music;
            return (
              <InternalLinkCard
                key={item.title}
                href={ARCHIVE_ITEM_HREFS[index] || "/"}
                title={item.title}
                description={item.description}
                icon={Icon}
                label={t.archive.label}
              />
            );
          })}
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
