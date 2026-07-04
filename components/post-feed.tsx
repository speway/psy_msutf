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
        <h2 className="text-2xl font-bold uppercase tracking-tight">
          {t.publications.title}
          {filteredPosts.length > 0 && (
            <span className="ml-3 text-base font-medium text-muted-foreground tracking-normal normal-case">
              {filteredPosts.length}
            </span>
          )}
        </h2>
        <div className="flex-1 h-1 bg-bauhaus-blue" aria-hidden="true" />
        <button
          onClick={() => setCompactView((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue hover:bg-bauhaus-blue/5 hover:border-bauhaus-blue transition-colors min-h-[44px] flex-shrink-0"
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
          {compactView ? t.publications.normalView : t.publications.compactView}
        </button>
      </div>

      <div
        className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-3 border-b border-border mb-6"
        role="tablist"
        aria-label={t.publications.rubric}
      >
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory">
            <button
              onClick={() => handleRubricClick("")}
              role="tab"
              aria-selected={!activeRubric}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all duration-300 ease-out flex-shrink-0 min-h-[44px] whitespace-nowrap snap-start ${
                !activeRubric
                  ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-[inset_0_-3px_0_var(--color-bauhaus-ochre)]"
                  : "bg-transparent text-bauhaus-blue border-bauhaus-blue/30 hover:border-bauhaus-blue hover:bg-bauhaus-blue/5"
              }`}
            >
              {t.publications.all}
              <span className="ml-1.5 text-[10px] opacity-70">
                ({posts.length})
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
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all duration-300 ease-out flex-shrink-0 min-h-[44px] whitespace-nowrap snap-start ${
                    activeRubric === rubric
                      ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-[inset_0_-3px_0_var(--color-bauhaus-ochre)]"
                      : "bg-transparent text-bauhaus-blue border-bauhaus-blue/30 hover:border-bauhaus-blue hover:bg-bauhaus-blue/5"
                  }`}
                >
                  {label}
                  <span className="ml-1.5 text-[10px] opacity-70">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
          <div
            className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background/95 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t.publications.search}
          className="w-full pl-10 pr-4 py-3 text-base sm:text-sm border-2 border-bauhaus-blue/20 bg-background focus:border-bauhaus-blue focus:outline-none transition-colors"
          aria-label={t.publications.search}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground min-h-[44px]"
            aria-label={t.publications.clear}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {activeRubric && (
        <div className="flex items-center gap-2 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,2vw,24px)]">
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

const DIRECTIONS: Array<"up" | "down" | "left" | "right"> = [
  "left",
  "right",
  "up",
  "right",
  "left",
  "down",
];

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
      delay={100 + index * 80}
      direction={DIRECTIONS[index % DIRECTIONS.length]}
    >
      <Link
        href={`/posts/${post.id}`}
        onClick={handleClick}
        className="block h-full"
        aria-label={`${t.post.ariaRead}: ${post.cleanTitle}`}
      >
        <article
          className={`group bauhaus-card bauhaus-card-hover h-full flex flex-col cursor-pointer relative ${
            clickedId === post.id ? "bauhaus-card-click" : ""
          }`}
        >
          {/* Ψ watermark in card cover */}
          <PsiDecor
            className="absolute top-2 right-2 text-2xl sm:text-3xl z-[1]"
            style={{ opacity: 0.08 }}
          />
          <div className="relative w-full mb-3 aspect-video md:aspect-[4/3] bg-bauhaus-burgundy/[0.03]">
            <BauhausCover
              cleanTitle={post.cleanTitle}
              rubric={post.rubric}
              coverTitle={post.coverTitle}
            />
          </div>

          <div className="px-4 pb-4 flex flex-col flex-1">
            {post.rubric && (
              <span
                className={`rubric-badge-${post.rubric} inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border mb-2 self-start`}
              >
                {t.publications.rubrics[post.rubric] || post.rubric}
              </span>
            )}

            <h3 className="text-lg font-bold leading-relaxed mb-2 group-hover:text-bauhaus-ochre transition-colors duration-300 line-clamp-2">
              {post.cleanTitle}
            </h3>

            {post.excerpt && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t-2 border-bauhaus-blue/20 mt-auto">
              <time
                className="text-xs text-muted-foreground"
                dateTime={post.date}
                suppressHydrationWarning
              >
                {new Date(post.date).toLocaleDateString(getLocale(lang), {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bauhaus-ochre group-hover:text-bauhaus-blue transition-colors duration-300 min-h-[44px] px-3">
                {t.post.read}
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
      href={`/posts/${post.id}`}
      className="block"
      aria-label={`${t.post.ariaRead}: ${post.cleanTitle}`}
    >
      <div className="group border-2 border-border/60 hover:border-bauhaus-ochre/30 hover:bg-bauhaus-blue/[0.02] transition-all duration-200 px-4 py-3 flex items-center gap-4 min-h-[56px]">
        {post.rubric && (
          <span
            className={`rubric-badge-${post.rubric} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border shrink-0 hidden sm:inline-block`}
          >
            {t.publications.rubrics[post.rubric] || post.rubric}
          </span>
        )}
        <h3 className="text-lg font-semibold leading-snug group-hover:text-bauhaus-ochre transition-colors line-clamp-1 flex-1 min-w-0">
          {post.cleanTitle}
        </h3>
        <time
          className="text-[11px] text-muted-foreground shrink-0 hidden sm:block"
          dateTime={post.date}
          suppressHydrationWarning
        >
          {new Date(post.date).toLocaleDateString(getLocale(lang), {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </time>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-bauhaus-ochre/70 group-hover:text-bauhaus-ochre transition-colors shrink-0 min-h-[44px] px-2">
          {t.post.read}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[clamp(16px,2vw,24px)]">
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
