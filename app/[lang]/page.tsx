import type { Metadata } from "next";
import Link from "next/link";
import { getSitePosts } from "@/lib/post-source";
import { normalizePosts } from "@/lib/normalize";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BauhausBackground } from "@/components/bauhaus-background";
import { PsychologyMap } from "@/components/psychology-map";
import { PsiDecor } from "@/components/psi-decor";
import { ArrowRight } from "lucide-react";
import { getTranslations, localizeHref } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: t.appName,
    description: t.description,
    openGraph: {
      title: t.appName,
      description: t.description,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.appName,
      description: t.description,
      images: ["/og/og-main.png"],
    },
  };
}

export default async function LangHomePage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const lh = (href: string) => localizeHref(href, lang);

  const posts = getSitePosts();

  const normalized = normalizePosts(posts);
  const sortedPosts = [...normalized].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const trendingPosts = sortedPosts.slice(0, 3);

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BauhausBackground variant="home" />

      {/* 1. Hero */}
      <AnimateOnScroll
        as="section"
        id="hero"
        className="relative border-b-2 border-bauhaus-blue scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-8 sm:pt-12 md:pt-16 pb-10 sm:pb-14 md:pb-16">
          <div className="max-w-[700px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5 w-fit">
              {t.hero.badge}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter uppercase">
              {t.hero.title}
            </h1>
            <div className="mt-6 h-1 w-24 bg-bauhaus-blue" />
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-[580px] leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={lh("/publications")}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue bg-bauhaus-blue text-white hover:bg-bauhaus-blue/90 transition-colors min-h-[44px]"
              >
                {t.hero.publications}
              </Link>
              <Link
                href={lh("/glossary")}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue/40 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white transition-colors min-h-[44px]"
              >
                {t.hero.glossary}
              </Link>
              <Link
                href={lh("/disciplines")}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue/40 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white transition-colors min-h-[44px]"
              >
                {t.hero.disciplines}
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground/70 max-w-[560px] leading-relaxed">
              {t.hero.description}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Ψ section divider — bottom-left */}
      <div className="relative h-16 sm:h-20 overflow-hidden" aria-hidden="true">
        <PsiDecor
          className="absolute -bottom-4 left-[12%] text-7xl sm:text-8xl"
          style={{ transform: "rotate(8deg)" }}
        />
      </div>

      {/* 2. Психология как карта */}
      <AnimateOnScroll direction="up">
        <PsychologyMap
          heading={t.map.heading}
          description={t.map.description}
          nodes={t.map.nodes}
          locale={lang}
        />
      </AnimateOnScroll>

      {/* Ψ section divider — diagonal top-right */}
      <div className="relative h-16 sm:h-20 overflow-hidden" aria-hidden="true">
        <PsiDecor
          className="absolute -top-6 right-[8%] text-6xl sm:text-7xl"
          style={{ transform: "rotate(-12deg)" }}
        />
      </div>

      {/* 3. Последние публикации */}
      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-bauhaus-blue/10 bg-gradient-to-t from-bauhaus-blue/[0.02] to-transparent"
        direction="up"
      >
        <div className="container mx-auto px-4 py-12 sm:py-14 scroll-mt-[72px] lg:scroll-mt-24">
          <div className="max-w-[640px] mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-bauhaus-blue">
                {t.trending}
              </h2>
              <p className="text-sm text-muted-foreground/70 mt-2 max-w-[480px] mx-auto leading-relaxed">
                {t.trendingSubtitle}
              </p>
              <div className="mx-auto mt-3 h-px w-16 bg-bauhaus-ochre/30" />
            </div>
            <div className="space-y-3">
              {trendingPosts.map((post) => (
                <Link
                  key={post.id}
                  href={lh(`/posts/${post.id}`)}
                  className="border-2 border-border/80 bg-background/60 p-4 hover:border-bauhaus-ochre/20 hover:bg-background hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 group flex flex-col min-h-[88px] justify-center"
                >
                  <span
                    className={`rubric-badge-${post.rubric} inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border mb-1.5 self-start`}
                  >
                    {post.rubric}
                  </span>
                  <h3 className="text-lg font-semibold leading-relaxed group-hover:text-bauhaus-ochre transition-colors line-clamp-2">
                    {post.cleanTitle}
                  </h3>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {post.date}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href={lh("/publications")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue/60 text-bauhaus-blue rounded-md hover:bg-bauhaus-blue hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t.trendingCta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Ψ section divider — middle-right */}
      <div className="relative h-12 sm:h-16 overflow-hidden" aria-hidden="true">
        <PsiDecor
          className="absolute top-1/2 right-[15%] text-5xl sm:text-6xl"
          style={{ transform: "translateY(-50%) rotate(15deg)" }}
        />
      </div>

      {/* 4. Контакты — компактный teaser */}
      <AnimateOnScroll
        as="section"
        className="border-b-2 border-bauhaus-blue/10"
        direction="up"
      >
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-bauhaus-blue">
              {t.contact.heading}
            </h2>
            <div className="mx-auto mt-3 h-px w-16 bg-bauhaus-ochre/30" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[480px] mx-auto">
              {t.contact.description}
            </p>
            <div className="mt-5">
              <Link
                href={lh("/contacts")}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white transition-colors min-h-[44px]"
              >
                {t.contact.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
