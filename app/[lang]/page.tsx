import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  GraduationCap,
} from "lucide-react";
import { getSitePosts } from "@/lib/post-source";
import { normalizePosts } from "@/lib/normalize";
import { PsychologyMap } from "@/components/psychology-map";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getTranslations, localizeHref } from "@/lib/i18n";
import { glossaryTerms } from "@/data/glossary";
import { homeEditorial } from "@/data/home-editorial";

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
  const c =
    homeEditorial[lang as keyof typeof homeEditorial] ?? homeEditorial.ru;
  const lh = (href: string) => localizeHref(href, lang);
  const posts = normalizePosts(getSitePosts());
  const latest = [...posts]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 3);
  const quickLinks = [
    {
      title: c.caseAction,
      href: "https://psy-case-trainer.vercel.app",
      Icon: Brain,
      external: true,
    },
    {
      title: c.statAction,
      href: "https://psy-stat-lab.vercel.app",
      Icon: ChartNoAxesCombined,
      external: true,
    },
    {
      title: c.termAction,
      href: lh("/glossary"),
      Icon: BookOpen,
      external: false,
    },
    {
      title: c.studyAction,
      href: lh("/disciplines"),
      Icon: GraduationCap,
      external: false,
    },
  ];

  return (
    <div className="psychology-home">
      <section className="editorial-hero container">
        <div className="editorial-hero-copy">
          <p className="editorial-eyebrow">
            <span className="editorial-rule" />
            {c.eyebrow}
          </p>
          <h1>
            {c.title}
            <br />
            {c.titleLine} <br />
            <em>{c.titleAccent}</em>
          </h1>
          <p className="editorial-lead">{c.lead}</p>
          <div className="editorial-actions">
            <Link href={lh("/roadmap")} className="editorial-button">
              {c.start}
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link href={lh("/publications")} className="editorial-text-link">
              {c.read}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="editorial-hero-art">
          <div className="editorial-image-wrap">
            <Image
              src="/assets/psychology-perception.webp"
              alt={c.visualAlt}
              fill
              priority
              sizes="(max-width: 700px) 92vw, (max-width: 1100px) 44vw, 560px"
            />
            <span className="art-label">
              {c.visualLabel}
              <span>Ψ / 01</span>
            </span>
          </div>
          <figcaption>
            <span>{c.visualCaption}</span>
            <span aria-hidden="true">↗</span>
          </figcaption>
        </figure>
      </section>

      <nav className="quick-access container" aria-label={c.fast}>
        <span className="quick-access-label">{c.fast}</span>
        <div className="quick-access-links">
          {quickLinks.map(({ title, href, Icon, external }) => (
            <Link
              href={href}
              key={href}
              className="quick-access-link"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
              <span>{title}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </nav>

      <section className="practice-section" id="practice">
        <div className="container">
          <div className="editorial-section-head">
            <div>
              <p className="editorial-eyebrow">{c.labLabel}</p>
              <h2>
                {c.labTitle}
                <br />
                <em>{c.labAccent}</em>
              </h2>
            </div>
            <p className="section-description">{c.labLead}</p>
          </div>
          <div className="practice-grid">
            <a
              className="practice-card practice-cases"
              href="https://psy-case-trainer.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="practice-card-meta">
                <span>{c.casesTag}</span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </div>
              <div className="practice-symbol" aria-hidden="true">
                <Brain size={64} strokeWidth={1} />
                <span>Ψ</span>
              </div>
              <h3>{c.cases}</h3>
              <p>{c.casesDesc}</p>
              <span className="practice-cta">
                {c.open}
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </a>
            <a
              className="practice-card practice-stats"
              href="https://psy-stat-lab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="practice-card-meta">
                <span>{c.statsTag}</span>
                <ArrowUpRight size={22} aria-hidden="true" />
              </div>
              <div className="practice-symbol" aria-hidden="true">
                <ChartNoAxesCombined size={64} strokeWidth={1} />
                <span>∑</span>
              </div>
              <h3>{c.stats}</h3>
              <p>{c.statsDesc}</p>
              <span className="practice-cta">
                {c.open}
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="knowledge-section container">
        <div className="knowledge-heading">
          <p className="editorial-eyebrow">{c.knowledgeLabel}</p>
          <h2>
            {c.knowledgeTitle}
            <br />
            <em>{c.knowledgeAccent}</em>
          </h2>
          <p>{c.knowledgeLead}</p>
          <div className="knowledge-totals">
            <div>
              <strong>{glossaryTerms.length}</strong>
              <span>{c.terms}</span>
            </div>
            <div>
              <strong>{posts.length}</strong>
              <span>{c.publications}</span>
            </div>
          </div>
        </div>
        <PsychologyMap
          heading={t.map.heading}
          description={t.map.description}
          nodes={t.map.nodes}
          locale={lang}
        />
      </section>

      <section className="journal-section">
        <div className="container">
          <div className="editorial-section-head">
            <div>
              <p className="editorial-eyebrow">{c.latestLabel}</p>
              <h2>{c.latestTitle}</h2>
            </div>
            <Link href={lh("/publications")} className="editorial-text-link">
              {c.latestAll}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="journal-grid">
            {latest.map((post, index) => (
              <Link
                href={lh(`/posts/${post.id}`)}
                className={`journal-card journal-card-${index}`}
                key={post.id}
              >
                <div className="journal-card-top">
                  <span>
                    {t.publications.rubrics[post.rubric] || post.rubric}
                  </span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{post.cleanTitle}</h3>
                <div className="journal-card-bottom">
                  <time dateTime={post.date}>
                    {new Intl.DateTimeFormat(
                      lang === "uz"
                        ? "uz-UZ"
                        : lang === "en"
                          ? "en-GB"
                          : "ru-RU",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      }
                    ).format(new Date(post.date))}
                  </time>
                  <ArrowUpRight size={24} aria-label={c.latestRead} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="community-section container">
        <p className="editorial-eyebrow">{c.communityLabel}</p>
        <div className="community-inner">
          <h2>
            {c.communityTitle}
            <br />
            <em>{c.communityAccent}</em>
          </h2>
          <div>
            <p>{c.communityDesc}</p>
            <div className="editorial-actions">
              <a
                href="https://t.me/psy_msutf"
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-button"
              >
                {c.communityCta}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <Link href={lh("/contacts")} className="editorial-text-link">
                {c.contacts}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ScrollToTop />
    </div>
  );
}
