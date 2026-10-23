import { getSitePostById, getSitePosts } from "@/lib/post-source";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { normalizePost, normalizePosts } from "@/lib/normalize";
import type { NormalizedPost } from "@/lib/normalize";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { BauhausCover } from "@/components/bauhaus-cover";
import { BauhausDecor } from "@/components/bauhaus-decor";
import { getPostRubric } from "@/lib/rubric";
import { getTranslations, localizeHref } from "@/lib/i18n";

interface Props {
  params: Promise<{ id: string; lang: string }>;
}

export async function generateStaticParams() {
  const langs = ["ru", "en", "uz"];
  return langs.flatMap((lang) =>
    getSitePosts().map((post) => ({ lang, id: post.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;

  const post = getSitePostById(id);

  if (!post) return {};

  const rubric = getPostRubric(post);
  const t = getTranslations(lang);
  const description =
    post.excerpt || `${t.post.fromSection} "${rubric}" — ${t.appName}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function LangPostPage({ params }: Props) {
  const { id, lang } = await params;

  const post = getSitePostById(id);

  if (!post) notFound();

  const normalized = normalizePost(post);
  if (!normalized) notFound();

  const { cleanTitle, coverTitle, contentClean, rubric, date, telegramLink } =
    normalized;

  const t = getTranslations(lang);
  const lh = (href: string) => localizeHref(href, lang);

  let relatedPosts: NormalizedPost[] = [];
  if (rubric) {
    const allPosts = getSitePosts();
    relatedPosts = normalizePosts(allPosts)
      .filter((p) => p.rubric === rubric && p.id !== id && !p.isSystem)
      .slice(0, 3);
  }

  return (
    <div className="relative animate-in fade-in duration-300">
      <BauhausDecor />

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-[760px]">
        <Link
          href={lh("/")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-6 group min-h-[38px]"
          aria-label={t.post.backLabel}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t.post.back}
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          {rubric && (
            <span className="inline-block text-xs font-semibold rounded-md px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20">
              {rubric}
            </span>
          )}
          <time
            className="text-xs text-muted-foreground"
            dateTime={date}
            suppressHydrationWarning
          >
            {new Date(date).toLocaleDateString(
              lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </time>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-[2.6rem] font-bold leading-[1.2] tracking-tight mb-6 text-foreground">
          {cleanTitle}
        </h1>

        <div className="relative w-full mb-8 aspect-[16/9] rounded-xl overflow-hidden border border-border/80 bg-muted/30 shadow-xs">
          <BauhausCover
            cleanTitle={cleanTitle}
            rubric={rubric}
            coverTitle={coverTitle}
          />
        </div>

        <div className="relative text-base sm:text-[1.0625rem] leading-[1.75] text-foreground/90 space-y-5 font-normal">
          {contentClean.split("\n\n").map((block, i) => {
            const lines = block.split("\n").filter((l) => l.trim());
            if (lines.length === 0) return null;

            const isList = lines.some(
              (l) =>
                l.trim().startsWith("- ") ||
                l.trim().startsWith("•") ||
                l.trim().match(/^\d+\.\s/)
            );
            if (isList) {
              return (
                <ul key={i} className="space-y-1.5 pl-6 list-disc">
                  {lines.map((line, j) => {
                    const text = line
                      .trim()
                      .replace(/^- /, "")
                      .replace(/^\d+\.\s/, "");
                    return (
                      <li key={j} className="text-base sm:text-[1.0625rem] leading-[1.75]">
                        {text}
                      </li>
                    );
                  })}
                </ul>
              );
            }

            return (
              <p key={i} className="text-base sm:text-[1.0625rem] leading-[1.75]">
                {lines.join(" ")}
              </p>
            );
          })}
        </div>

        {telegramLink && (
          <div className="mt-10 pt-6 border-t border-border/60">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/15 font-medium text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {t.post.readOriginal}
            </a>
          </div>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 pb-14 max-w-[760px]">
          <div className="flex items-center gap-3 mb-6 mt-12 border-t border-border/60 pt-8">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              {t.post.otherPosts}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({rubric})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={lh("/posts/" + post.id)}
                className="block h-full no-underline"
                aria-label={`${t.post.ariaRead}: ${post.cleanTitle}`}
              >
                <article className="group rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col cursor-pointer">
                  <div className="relative w-full aspect-[16/10] bg-muted/30">
                    <BauhausCover
                      cleanTitle={post.cleanTitle}
                      rubric={post.rubric}
                      coverTitle={post.coverTitle}
                    />
                  </div>

                  <div className="p-3.5 flex flex-col flex-1">
                    <h3 className="text-sm font-bold leading-snug mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.cleanTitle}
                    </h3>

                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto text-[11px] text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(
                          lang === "uz" ? "uz-UZ" : lang === "en" ? "en-US" : "ru-RU",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </time>
                      <span className="font-semibold text-primary">
                        {t.post.read} →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
