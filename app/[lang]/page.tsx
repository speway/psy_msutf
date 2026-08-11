import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Calculator,
  ExternalLink,
  FlaskConical,
  Languages,
  LibraryBig,
} from "lucide-react";
import { getSitePosts } from "@/lib/post-source";
import { normalizePosts } from "@/lib/normalize";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BauhausBackground } from "@/components/bauhaus-background";
import { PsychologyMap } from "@/components/psychology-map";
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

const ecosystemCopy = {
  ru: {
    eyebrow: "Единая образовательная среда",
    lead: "Научный сектор, учебные материалы и интерактивные лаборатории — в одной понятной системе.",
    signal: "Система работает",
    posts: "публикаций",
    terms: "терминов",
    languages: "языка",
    quick: "Быстрый маршрут",
    mapLabel: "Навигация по знаниям",
    labsBadge: "Новые инструменты",
    labsTitle: "Учиться через действие",
    labsDescription:
      "Два самостоятельных тренажёра дополняют материалы сектора: один учит работать с данными, второй — рассуждать как специалист.",
    statTitle: "СтатЛаб",
    statDescription:
      "Интерактивная статистика для психологов: критерии, ANOVA, регрессия и практика без страха перед формулами.",
    caseTitle: "Тренажёр психолога",
    caseDescription:
      "Учебные кейсы, профессиональная логика ответа и обратная связь по понятной рубрике.",
    openLab: "Открыть лабораторию",
    latestBadge: "Редакционный выбор",
    contactsKicker: "На связи",
  },
  en: {
    eyebrow: "One learning environment",
    lead: "Research, learning materials and interactive labs in one clear system.",
    signal: "System online",
    posts: "publications",
    terms: "terms",
    languages: "languages",
    quick: "Quick route",
    mapLabel: "Knowledge navigation",
    labsBadge: "New tools",
    labsTitle: "Learn by doing",
    labsDescription:
      "Two standalone labs extend the sector's materials: one develops data skills, the other professional reasoning.",
    statTitle: "StatLab",
    statDescription:
      "Interactive statistics for psychologists: tests, ANOVA, regression and practice without fear of formulas.",
    caseTitle: "Psychology Case Trainer",
    caseDescription:
      "Educational cases, professional answer logic and feedback based on a transparent rubric.",
    openLab: "Open laboratory",
    latestBadge: "Editor's selection",
    contactsKicker: "Stay connected",
  },
  uz: {
    eyebrow: "Yagona ta'lim muhiti",
    lead: "Ilmiy sektor, o'quv materiallari va interaktiv laboratoriyalar — bitta tushunarli tizimda.",
    signal: "Tizim ishlamoqda",
    posts: "nashr",
    terms: "atama",
    languages: "til",
    quick: "Tezkor yo'nalish",
    mapLabel: "Bilimlar navigatsiyasi",
    labsBadge: "Yangi vositalar",
    labsTitle: "Amaliyot orqali o'rganish",
    labsDescription:
      "Ikki mustaqil trenajyor sektor materiallarini to'ldiradi: biri ma'lumotlar bilan ishlashni, ikkinchisi mutaxassis kabi fikrlashni o'rgatadi.",
    statTitle: "StatLab",
    statDescription:
      "Psixologlar uchun interaktiv statistika: mezonlar, ANOVA, regressiya va formulalardan qo'rqmasdan amaliyot.",
    caseTitle: "Psixolog trenajyori",
    caseDescription:
      "O'quv keyslar, professional javob mantiqi va tushunarli mezonlar bo'yicha fikr-mulohaza.",
    openLab: "Laboratoriyani ochish",
    latestBadge: "Muharrir tanlovi",
    contactsKicker: "Aloqada",
  },
} as const;

export default async function LangHomePage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const copy =
    ecosystemCopy[lang as keyof typeof ecosystemCopy] ?? ecosystemCopy.ru;
  const lh = (href: string) => localizeHref(href, lang);

  const normalized = normalizePosts(getSitePosts());
  const sortedPosts = [...normalized].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const trendingPosts = sortedPosts.slice(0, 3);

  const labs = [
    {
      index: "01",
      title: copy.statTitle,
      description: copy.statDescription,
      href: "https://psy-stat-lab.vercel.app",
      Icon: Calculator,
      tone: "cyan",
    },
    {
      index: "02",
      title: copy.caseTitle,
      description: copy.caseDescription,
      href: "https://psy-case-trainer.vercel.app",
      Icon: BrainCircuit,
      tone: "lime",
    },
  ];

  return (
    <div className="site-page site-page-home relative">
      <BauhausBackground variant="home" />

      <AnimateOnScroll
        as="section"
        id="hero"
        className="ecosystem-hero scroll-mt-[80px]"
      >
        <div className="container ecosystem-hero-inner">
          <div className="ecosystem-hero-copy">
            <div className="signal-badge">
              <span className="signal-dot" aria-hidden="true" />
              {copy.eyebrow}
            </div>

            <p className="hero-overline">Ψ / PSY · MSU · TF / 2026</p>
            <h1>{t.hero.title}</h1>
            <p className="ecosystem-lead">{copy.lead}</p>

            <div className="hero-actions">
              <Link href={lh("/publications")} className="action-primary">
                {t.hero.publications}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href={lh("/roadmap")} className="action-secondary">
                {copy.quick}
              </Link>
            </div>

            <div className="hero-metrics" aria-label="Краткая статистика сайта">
              <div>
                <strong>{normalized.length}</strong>
                <span>{copy.posts}</span>
              </div>
              <div>
                <strong>200+</strong>
                <span>{copy.terms}</span>
              </div>
              <div>
                <strong>3</strong>
                <span>{copy.languages}</span>
              </div>
            </div>
          </div>

          <div className="ecosystem-console" aria-label={copy.mapLabel}>
            <div className="console-head">
              <div className="console-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span>{copy.signal}</span>
            </div>
            <div className="console-mark" aria-hidden="true">
              <span>Ψ</span>
              <i>26</i>
            </div>
            <div className="console-route-list">
              <Link href={lh("/glossary")}>
                <span className="route-icon">
                  <LibraryBig />
                </span>
                <span>
                  <small>01 / KNOWLEDGE</small>
                  <b>{t.nav.glossary}</b>
                </span>
                <ArrowRight />
              </Link>
              <Link href={lh("/disciplines")}>
                <span className="route-icon">
                  <BookOpen />
                </span>
                <span>
                  <small>02 / CURRICULUM</small>
                  <b>{t.nav.disciplines}</b>
                </span>
                <ArrowRight />
              </Link>
              <Link href={lh("/archive")}>
                <span className="route-icon">
                  <FlaskConical />
                </span>
                <span>
                  <small>03 / MEMORY</small>
                  <b>{t.nav.archive}</b>
                </span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <div className="home-index-strip" aria-label="Структура платформы">
        <div className="container">
          <span>
            <b>01</b>
            {t.nav.publications}
          </span>
          <span>
            <b>02</b>
            {t.nav.glossary}
          </span>
          <span>
            <b>03</b>
            {t.nav.roadmap}
          </span>
          <span>
            <b>04</b>
            {t.nav.disciplines}
          </span>
        </div>
      </div>

      <AnimateOnScroll direction="up" className="map-shell">
        <div className="section-kicker container">
          <span>{copy.mapLabel}</span>
          <i aria-hidden="true" />
        </div>
        <PsychologyMap
          heading={t.map.heading}
          description={t.map.description}
          nodes={t.map.nodes}
          locale={lang}
        />
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="labs-section" direction="up">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <div className="signal-badge compact">{copy.labsBadge}</div>
              <h2>{copy.labsTitle}</h2>
            </div>
            <p>{copy.labsDescription}</p>
          </div>

          <div className="labs-grid">
            {labs.map(({ index, title, description, href, Icon, tone }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`lab-card lab-card-${tone}`}
              >
                <div className="lab-card-top">
                  <span>{index}</span>
                  <ExternalLink aria-hidden="true" />
                </div>
                <div className="lab-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="lab-cta">
                  {copy.openLab}
                  <ArrowRight aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="latest-section" direction="up">
        <div className="container">
          <div className="section-heading-row latest-heading">
            <div>
              <div className="signal-badge compact">{copy.latestBadge}</div>
              <h2>{t.trending}</h2>
            </div>
            <Link href={lh("/publications")} className="text-link">
              {t.trendingCta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="latest-grid">
            {trendingPosts.map((post, index) => (
              <Link
                key={post.id}
                href={lh(`/posts/${post.id}`)}
                className="latest-card"
              >
                <div className="latest-card-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <span className={`rubric-badge-${post.rubric} latest-rubric`}>
                  {post.rubric}
                </span>
                <h3>{post.cleanTitle}</h3>
                <ArrowRight className="latest-arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="contact-band" direction="up">
        <div className="container contact-band-inner">
          <div>
            <span>{copy.contactsKicker}</span>
            <h2>{t.contact.heading}</h2>
            <p>{t.contact.description}</p>
          </div>
          <Link href={lh("/contacts")} className="action-acid">
            {t.contact.cta}
            <ArrowRight aria-hidden="true" />
          </Link>
          <Languages className="contact-band-mark" aria-hidden="true" />
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
