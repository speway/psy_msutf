import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { BauhausBackground } from "@/components/bauhaus-background";
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
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <BauhausBackground variant="disciplines" />

      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-bauhaus-blue/20 scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5">
              <BookOpen className="h-3 w-3" />
              {lang === "uz"
                ? "O'quv reja"
                : lang === "en"
                  ? "Curriculum"
                  : "Учебный план"}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase text-bauhaus-blue">
              {t.disciplinesUI.title}
            </h1>
            <div className="mx-auto mt-4 h-1 w-16 bg-bauhaus-blue" />
            <p className="mt-4 mx-auto max-w-lg text-sm text-bauhaus-blue/70">
              {t.disciplinesUI.description}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

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
