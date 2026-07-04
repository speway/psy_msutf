import type { Metadata } from "next";
import Link from "next/link";
import { getSitePosts } from "@/lib/post-source";
import { normalizePosts } from "@/lib/normalize";
import { PostFeed } from "@/components/post-feed";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { BauhausBackground } from "@/components/bauhaus-background";
import { SiteNotice } from "@/components/site-notice";
import { getTranslations, localizeHref } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: `${t.publications.title} — ${t.appName}`,
    description: t.publications.desc,
    openGraph: {
      title: `${t.publications.title} — ${t.appName}`,
      description: t.publications.desc,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.publications.title} — ${t.appName}`,
      description: t.publications.desc,
    },
  };
}

export default async function LangPublicationsPage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);

  const posts = getSitePosts();

  const normalized = normalizePosts(posts);
  const sortedPosts = [...normalized].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <BauhausBackground variant="publications" />

      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-bauhaus-blue scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5 w-fit">
              {t.publications.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase">
              {t.publications.title}
            </h1>
            <div className="mt-4 h-1 w-24 bg-bauhaus-blue" />
            <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-[580px] leading-relaxed">
              {t.publications.desc}
            </p>
            <div className="mt-4">
              <Link
                href={localizeHref("/", lang)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-bauhaus-blue transition-colors min-h-[44px]"
              >
                {t.publications.back}
              </Link>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {lang !== "ru" && <SiteNotice message={t.siteNotice.publications} />}

      <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-14">
        <div className="max-w-[1200px] mx-auto">
          <PostFeed posts={sortedPosts} lang={lang} />
        </div>
      </div>
    </div>
  );
}
