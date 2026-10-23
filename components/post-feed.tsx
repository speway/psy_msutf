"use client";

import { useState, useCallback, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { BauhausCover } from "@/components/bauhaus-cover";
import { PsiDecor } from "@/components/psi-decor";
import { RUBRICS } from "@/lib/rubric";
import type { NormalizedPost } from "@/lib/normalize";
import { X, Search, List, LayoutGrid } from "lucide-react";
import { getTranslations } from "@/lib/i18n";

interface PostFeedProps {
  posts: NormalizedPost[];
  lang?: string;
}

function getLocale(lang: string): string {
  if (lang === "uz") return "uz-UZ";
  if (lang === "en") return "en-US";
  return "ru-RU";
}

function PostFeedInner({ posts, lang = "ru" }: PostFeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = getTranslations(lang);
  const activeRubric = searchParams.get("rubric") || "";
  const searchQuery = searchParams.get("q") || "";
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [compactView, setCompactView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("compactView") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompactView(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("compactView", String(compactView));
  }, [compactView]);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        if (activeRubric && post.rubric !== activeRubric) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const title = post.cleanTitle.toLowerCase();
          const excerpt = post.excerpt.toLowerCase();
          if (!title.includes(q) && !excerpt.includes(q)) return false;
        }
        return true;
      }),
    [activeRubric, searchQuery, posts]
  );

  const handleClick = useCallback((id: string) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 400);
  }, []);

  const handleRubricClick = useCallback(
    (rubric: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!rubric || rubric === "Все") {
        params.delete("rubric");
      } else {
        params.set("rubric", rubric);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, searchParams, pathname]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, searchParams, pathname]
  );

  const handleReset = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const rubricsWithoutAll = RUBRICS.filter((r) => r !== "Все");

  return (
    <>
      <div className="post-feed-heading flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t.publications.title}
          </h2>
          {filteredPosts.length > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {filteredPosts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setCompactView((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-xs"
          aria-label={
            compactView ? t.publications.normalView : t.publications.compactView
          }
          aria-pressed={compactView}
        >
          {compactView ? (
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <List className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{compactView ? t.publications.normalView : t.publications.compactView}</span>
        </button>
      </div>

      <div
        className="post-feed-tabs sticky top-[72px] z-20 bg-background/95 backdrop-blur-md -mx-4 px-4 py-3 border-b border-border/60 mb-6"
        role="tablist"
        aria-label={t.publications.rubric}
      >
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-none snap-x pb-0.5">
            <button
              onClick={() => handleRubricClick("")}
              role="tab"
              aria-selected={!activeRubric}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex-shrink-0 whitespace-nowrap snap-start shadow-xs ${
                !activeRubric
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
              }`}
            >
              {t.publications.all}
              <span className="ml-1.5 text-[11px] opacity-75">
                {posts.length}
              </span>
            </button>
            {rubricsWithoutAll.map((rubric) => {
              const count = posts.filter((p) => p.rubric === rubric).length;
              const label = t.publications.rubrics[rubric] || rubric;
              return (
                <button
                  key={rubric}
                  onClick={() => handleRubricClick(rubric)}
                  role="tab"
                  aria-selected={activeRubric === rubric}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex-shrink-0 whitespace-nowrap snap-start shadow-xs ${
                    activeRubric === rubric
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
                  }`}
                >
                  {label}
                  <span className="ml-1.5 text-[11px] opacity-75">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t.publications.search}
          className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-border bg-card/80 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-xs"
          aria-label={t.publications.search}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md"
            aria-label={t.publications.clear}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {activeRubric && (
        <div className="post-feed-active-filter flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">
            {t.publications.section}{" "}
            <strong>
              {t.publications.rubrics[activeRubric] || activeRubric}
            </strong>
          </span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-bauhaus-blue/30 text-bauhaus-blue hover:bg-bauhaus-blue/5 transition-colors min-h-[44px]"
          >
            <X className="h-3 w-3" />
            {t.publications.reset}
          </button>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="mb-4 h-16 w-16 rounded-full border-2 border-bauhaus-blue/20 flex items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="text-2xl font-bold text-bauhaus-blue/40"
              aria-hidden="true"
            >
              Ψ
            </span>
          </div>
          <p className="text-muted-foreground text-lg">
            {t.publications.noPosts}
          </p>
        </div>
      ) : compactView ? (
        <div className="space-y-2">
          {filteredPosts.map((post) => (
            <CompactPostCard key={post.id} post={post} t={t} lang={lang} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(16px,2vw,24px)]">
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              clickedId={clickedId}
              onCardClick={handleClick}
              t={t}
              lang={lang}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface PostCardProps {
  post: NormalizedPost;
  index: number;
  clickedId: string | null;
  onCardClick: (id: string) => void;
  t: ReturnType<typeof getTranslations>;
  lang: string;
}

function PostCard({
  post,
  index,
  clickedId,
  onCardClick,
  t,
  lang,
}: PostCardProps) {
  const handleClick = useCallback(() => {
    onCardClick(post.id);
  }, [post.id, onCardClick]);

  return (
    <AnimateOnScroll
      delay={Math.min(index * 30, 180)}
      direction="up"
    >
      <Link
        href={`/${lang}/posts/${post.id}`}
        onClick={handleClick}
        className="block h-full no-underline"
        aria-label={`${t.post.ariaRead}: ${post.cleanTitle}`}
      >
        <article
          className={`group rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col cursor-pointer relative ${
            clickedId === post.id ? "scale-[0.99] opacity-90" : ""
          }`}
        >
          <div className="relative w-full aspect-video md:aspect-[16/10] bg-muted/40 overflow-hidden">
            <BauhausCover
              cleanTitle={post.cleanTitle}
              rubric={post.rubric}
              coverTitle={post.coverTitle}
            />
          </div>

          <div className="p-4 sm:p-5 flex flex-col flex-1">
            {post.rubric && (
              <span
                className={`rubric-badge-${post.rubric} inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-md border mb-2.5 self-start`}
              >
                {t.publications.rubrics[post.rubric] || post.rubric}
              </span>
            )}

            <h3 className="text-base sm:text-lg font-bold leading-snug mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
              {post.cleanTitle}
            </h3>

            {post.excerpt && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-auto text-xs">
              <time
                className="text-muted-foreground"
                dateTime={post.date}
                suppressHydrationWarning
              >
                {new Date(post.date).toLocaleDateString(getLocale(lang), {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>

              <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline">
                {t.post.read} →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </AnimateOnScroll>
  );
}

interface CompactPostCardProps {
  post: NormalizedPost;
  t: ReturnType<typeof getTranslations>;
  lang: string;
}

function CompactPostCard({ post, t, lang }: CompactPostCardProps) {
  return (
    <Link
      href={`/${lang}/posts/${post.id}`}
      className="block no-underline"
      aria-label={`${t.post.ariaRead}: ${post.cleanTitle}`}
    >
      <div className="compact-post-card group rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30 transition-all duration-200 px-4 py-3 flex items-center gap-4 min-h-[56px] shadow-xs">
        {post.rubric && (
          <span
            className={`rubric-badge-${post.rubric} text-[10px] font-semibold rounded-md px-2 py-0.5 border shrink-0 hidden sm:inline-block`}
          >
            {t.publications.rubrics[post.rubric] || post.rubric}
          </span>
        )}
        <h3 className="text-sm sm:text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1 min-w-0">
          {post.cleanTitle}
        </h3>
        <time
          className="text-xs text-muted-foreground shrink-0 hidden sm:block"
          dateTime={post.date}
          suppressHydrationWarning
        >
          {new Date(post.date).toLocaleDateString(getLocale(lang), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
          {t.post.read} →
        </span>
      </div>
    </Link>
  );
}

function PostFeedSkeleton() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div
          className="bauhaus-angle-full relative w-10 h-10 hidden md:block flex-shrink-0"
          aria-hidden="true"
        >
          <div className="angle-tl" />
          <div className="angle-bl" />
          <div className="angle-tr" />
          <div className="angle-br" />
        </div>
        <div className="h-8 w-48 animate-pulse bg-bauhaus-blue/10" />
        <div className="flex-1 h-1 bg-bauhaus-blue/20" aria-hidden="true" />
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto -mx-4 px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-11 w-28 animate-pulse bg-bauhaus-blue/10 flex-shrink-0"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(16px,2vw,24px)]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-2 border-bauhaus-blue/10 p-0">
            <div className="aspect-video md:aspect-[4/3] animate-pulse bg-bauhaus-blue/5" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 animate-pulse bg-bauhaus-blue/10" />
              <div className="h-5 w-full animate-pulse bg-bauhaus-blue/10" />
              <div className="h-5 w-3/4 animate-pulse bg-bauhaus-blue/10" />
              <div className="h-4 w-full animate-pulse bg-bauhaus-blue/5" />
              <div className="h-4 w-2/3 animate-pulse bg-bauhaus-blue/5" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function PostFeed(props: PostFeedProps) {
  return (
    <Suspense fallback={<PostFeedSkeleton />}>
      <PostFeedInner {...props} />
    </Suspense>
  );
}
