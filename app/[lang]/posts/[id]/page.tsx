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
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <BauhausDecor />

      <article className="container mx-auto px-4 py-8 md:py-12 max-w-[720px] xl:max-w-[800px]">
        <AnimateOnScroll delay={50} direction="left">
          <Link
            href={lh("/")}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-bauhaus-ochre/70 hover:text-bauhaus-blue transition-colors mb-6 group relative min-h-[44px]"
            aria-label={t.post.backLabel}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t.post.back}
          </Link>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100} direction="up">
          {rubric && (
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-2 py-0.5 border border-bauhaus-ochre/30 text-bauhaus-ochre/80 mb-3">
              {rubric}
            </span>
          )}
        </AnimateOnScroll>

        <AnimateOnScroll delay={125} direction="left">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-2 w-2 bg-bauhaus-ochre" aria-hidden="true" />
            <time
              className="text-sm text-muted-foreground font-semibold"
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
        </AnimateOnScroll>

        <AnimateOnScroll delay={150} direction="up">
          <div className="relative w-full mb-6 aspect-[16/9] border-2 border-bauhaus-blue/20 bg-bauhaus-blue/[0.03]">
            <BauhausCover
              cleanTitle={cleanTitle}
              rubric={rubric}
              coverTitle={coverTitle}
            />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200} direction="up">
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-8">
            {cleanTitle}
          </h1>
        </AnimateOnScroll>

        <AnimateOnScroll delay={350} direction="up">
          <div className="relative text-base leading-relaxed text-foreground/85 space-y-6">
            {contentClean.split("\n\n").map((block, i) => {
              const lines = block.split("\n").filter((l) => l.trim());
              if (lines.length === 0) return null;

              const isList = lines.some(
                (l) =>
                  l.trim().startsWith("- ") ||
                  l.trim().startsWith("•") ||
                  l.trim().match(/^\d+\.\s/) ||
                  l
                    .trim()
                    .match(
                      /^[🌟➡️🤩🔥💙❤️⭐️❗️🩶💡📌📍🎗️✨🔘‼️🆕☀️🟡🔵🟣⚪️🖊️🐌🐰⛓💙🩷💚💜🧡💛💬🗒🗣🔘🔜🔛🔚🔙]\s*/
                    )
              );
              if (isList) {
                return (
                  <ul key={i} className="space-y-1">
                    {lines.map((line, j) => {
                      const text = line
                        .trim()
                        .replace(/^- /, "")
                        .replace(/^\d+\.\s/, "");
                      return (
                        <li
                          key={j}
                          className="ml-6 list-disc text-base leading-relaxed"
                        >
                          {text}
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              return (
                <p key={i} className="text-base leading-relaxed">
                  {lines.join(" ")}
                </p>
              );
            })}
          </div>
        </AnimateOnScroll>

        {telegramLink && (
          <AnimateOnScroll delay={400} direction="up">
            <div className="mt-10 pt-8 border-t-2 border-bauhaus-blue/20">
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-blue/40 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white transition-colors duration-300 min-h-[44px]"
              >
                <ExternalLink className="h-4 w-4" />
                {t.post.readOriginal}
              </a>
            </div>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll delay={425} direction="right">
          <div className="mt-12 pt-8 border-t-2 border-bauhaus-blue/20">
            <div className="h-0.5 w-16 bg-bauhaus-ochre" aria-hidden="true" />
          </div>
        </AnimateOnScroll>
      </article>

      {relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 pb-12 max-w-[720px] xl:max-w-[800px]">
          <AnimateOnScroll delay={50} direction="left">
            <div className="flex items-center gap-4 mb-8 mt-16">
              <div
                className="bauhaus-angle-full relative w-8 h-8 hidden md:block flex-shrink-0"
                aria-hidden="true"
              >
                <div className="angle-tl" />
                <div className="angle-bl" />
                <div className="angle-tr" />
                <div className="angle-br" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
                {t.post.otherPosts}
                <span className="ml-2 text-base font-medium text-muted-foreground tracking-normal normal-case">
                  {t.post.fromSection} «{rubric}»
                </span>
              </h2>
              <div
                className="flex-1 h-0.5 bg-bauhaus-blue/30"
                aria-hidden="true"
              />
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,2vw,24px)]">
            {relatedPosts.map((post, index) => (
              <AnimateOnScroll
                key={post.id}
                delay={100 + index * 80}
                direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
              >
                <Link
                  href={lh("/posts/" + post.id)}
                  className="block h-full"
                  aria-label={`${t.post.ariaRead}: ${post.cleanTitle}`}
                >
                  <article className="group bauhaus-card bauhaus-card-hover h-full flex flex-col cursor-pointer relative hover:border-bauhaus-ochre/50 hover:-translate-y-[3px] hover:shadow-[0_4px_20px_rgba(74,16,40,0.08),0_1px_4px_rgba(74,16,40,0.04)]">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-bauhaus-ochre/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      aria-hidden="true"
                    />

                    <div className="relative w-full mb-3 aspect-[4/3] bg-bauhaus-burgundy/[0.03]">
                      <BauhausCover
                        cleanTitle={post.cleanTitle}
                        rubric={post.rubric}
                        coverTitle={post.coverTitle}
                      />
                    </div>

                    <div className="px-4 pb-4 flex flex-col flex-1">
                      {post.rubric && (
                        <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 border border-bauhaus-ochre/30 text-bauhaus-ochre/80 mb-2 self-start">
                          {post.rubric}
                        </span>
                      )}

                      <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-bauhaus-ochre transition-colors duration-300 line-clamp-2">
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
                          {new Date(post.date).toLocaleDateString(
                            lang === "uz"
                              ? "uz-UZ"
                              : lang === "en"
                                ? "en-US"
                                : "ru-RU",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </time>

                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-bauhaus-ochre group-hover:text-bauhaus-blue transition-colors duration-300 min-h-[44px] px-3">
                          {t.post.read}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
