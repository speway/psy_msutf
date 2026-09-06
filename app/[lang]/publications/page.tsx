import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { getSitePosts } from "@/lib/post-source";
import { normalizePosts } from "@/lib/normalize";
import { PostFeed } from "@/components/post-feed";
import { SiteNotice } from "@/components/site-notice";
import { getTranslations } from "@/lib/i18n";

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
    <div className="page-publications relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionIntro
        title={t.publications.title}
        description={t.publications.desc}
        eyebrow={t.publications.badge}
        number="01"
        lang={lang}
      />

      {lang !== "ru" && <SiteNotice message={t.siteNotice.publications} />}

      <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-14">
        <div className="max-w-[1200px] mx-auto">
          <PostFeed posts={sortedPosts} lang={lang} />
        </div>
      </div>
    </div>
  );
}
