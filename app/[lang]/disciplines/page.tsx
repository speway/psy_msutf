import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { DisciplinesExplorer } from "@/components/disciplines-explorer";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: `${lang === "uz" ? "Fanlar" : lang === "en" ? "Disciplines" : "Дисциплины по курсам"} — ${t.appName}`,
    description:
      lang === "uz"
        ? "Bakalavriat va magistratura kurslari bo'yicha fanlar ro'yxati."
        : lang === "en"
          ? "List of disciplines by course for bachelor and master programmes."
          : "Список дисциплин по курсам для бакалавриата и магистратуры.",
    openGraph: {
      title: `${lang === "uz" ? "Fanlar" : lang === "en" ? "Disciplines" : "Дисциплины по курсам"} — ${t.appName}`,
      description:
        lang === "uz"
          ? "Bakalavriat va magistratura kurslari bo'yicha fanlar ro'yxati."
          : lang === "en"
            ? "List of disciplines by course for bachelor and master programmes."
            : "Список дисциплин по курсам.",
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lang === "uz" ? "Fanlar" : lang === "en" ? "Disciplines" : "Дисциплины по курсам"} — ${t.appName}`,
      description:
        lang === "uz"
          ? "Fanlar ro'yxati."
          : lang === "en"
            ? "List of disciplines."
            : "Список дисциплин по курсам.",
    },
  };
}

export default async function LangDisciplinesPage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <div className="page-disciplines relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionIntro
        title={t.disciplinesUI.title}
        description={t.disciplinesUI.description}
        eyebrow={t.nav.disciplines}
        number="03"
        lang={lang}
      />

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-8 md:py-12"
        direction="up"
      >
        <DisciplinesExplorer
          t={t.disciplinesUI}
          disciplineNotice={t.siteNotice.disciplines}
        />
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
