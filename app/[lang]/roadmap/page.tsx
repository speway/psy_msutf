import type { Metadata } from "next";
import { PsychologyBauhausBackground } from "@/components/psychology-bauhaus-background";
import { Roadmap } from "@/components/roadmap";
import { InternalLinkCard } from "@/components/internal-link-card";
import { getTranslations, localizeHref } from "@/lib/i18n";
import { roadmapStepsEn } from "@/data/roadmap-en";
import { roadmapStepsUz } from "@/data/roadmap-uz";
import type { RoadmapStep } from "@/data/roadmap";

interface Props {
  params: Promise<{ lang: string }>;
}

const stepMap: Record<string, RoadmapStep[]> = {
  en: roadmapStepsEn,
  uz: roadmapStepsUz,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  const desc =
    lang === "uz"
      ? "7 bosqich: birinchi qiziqishdan o'quv yoki ilmiy loyihagacha. Talaba uchun mo'ljallangan yo'nalish."
      : "7 steps: from first interest to an educational or scientific project. A route for students who want to try research.";

  return {
    title: `${t.roadmapUI.heading} ${t.roadmapUI.headingLine2} — ${t.appName}`,
    description: desc,
    openGraph: {
      title: `${t.roadmapUI.heading} ${t.roadmapUI.headingLine2} — ${t.appName}`,
      description: desc,
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.roadmapUI.heading} ${t.roadmapUI.headingLine2} — ${t.appName}`,
      description: desc,
    },
  };
}

export default async function LangRoadmapPage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const lh = (href: string) => localizeHref(href, lang);
  const steps = stepMap[lang] ?? undefined;

  return (
    <>
      <PsychologyBauhausBackground />
      <Roadmap t={t.roadmapUI} steps={steps} />
      <section className="container mx-auto px-4 py-12 md:py-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-center mb-8 text-bauhaus-blue">
            {t.roadmap.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {t.roadmap.relatedCards.map((card) => {
              let href = "/glossary";
              if (
                card.title === "Публикации" ||
                card.title === "Publications" ||
                card.title === "Nashrlar"
              )
                href = "/publications";
              if (
                card.title === "Архив и традиции" ||
                card.title === "Archive and traditions" ||
                card.title === "Arxiv va an'analar"
              )
                href = "/archive";
              return (
                <InternalLinkCard
                  key={card.title}
                  href={lh(href)}
                  title={card.title}
                  description={card.description}
                  label={card.label}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
