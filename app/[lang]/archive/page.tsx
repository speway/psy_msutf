import type { Metadata } from "next";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BauhausBackground } from "@/components/bauhaus-background";
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
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <BauhausBackground variant="archive" />

      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-bauhaus-burgundy/30 bg-bauhaus-milky/30 scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-burgundy/30 text-bauhaus-burgundy bg-bauhaus-milky/60">
              {t.archive.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase text-bauhaus-burgundy">
              {t.archive.title}
            </h1>
            <div className="mx-auto mt-4 h-1 w-16 bg-bauhaus-burgundy/40" />
            <p className="mt-4 text-sm sm:text-base text-bauhaus-burgundy/60 max-w-[560px] mx-auto leading-relaxed">
              {t.archive.desc}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-8 md:py-12"
        direction="up"
      >
        <div className="max-w-[800px] mx-auto space-y-6">
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
