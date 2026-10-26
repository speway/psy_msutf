import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AcademicHubContainer } from "@/components/academic-hub/academic-hub-container";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return {
    title: `${lang === "uz" ? "Fanlar va dasturlar" : lang === "en" ? "Disciplines & Syllabi" : "Академические программы и силлабусы"} — ${t.appName}`,
    description:
      lang === "uz"
        ? "Psixologiya yo'nalishi fanlari, seminar dasturlari, manbalar katalogi va ilmiy profillar."
        : lang === "en"
          ? "Psychology department disciplines, seminar syllabi, digital source reader and faculty scientific profiles."
          : "Учебные дисциплины, программы семинарских занятий 2026, полнотекстовый ридер первоисточников и научные профили преподавателей кафедры психологии ТФ МГУ.",
    openGraph: {
      title: `${lang === "uz" ? "Fanlar va dasturlar" : lang === "en" ? "Disciplines & Syllabi" : "Академические программы и силлабусы"} — ${t.appName}`,
      description:
        lang === "uz"
          ? "Fanlar va seminar dasturlari."
          : lang === "en"
            ? "Disciplines, seminar syllabi and digital reader."
            : "Учебные программы, семинары и полнотекстовый ридер кафедры психологии.",
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lang === "uz" ? "Fanlar va dasturlar" : lang === "en" ? "Disciplines & Syllabi" : "Академические программы и силлабусы"} — ${t.appName}`,
      description:
        lang === "uz"
          ? "Fanlar ro'yxati."
          : lang === "en"
            ? "List of disciplines."
            : "Список дисциплин, семинаров и первоисточников.",
    },
  };
}

export default async function LangDisciplinesPage({ params }: Props) {
  const { lang } = await params;
  const t = getTranslations(lang);

  const title =
    lang === "uz"
      ? "Fanlar va seminar dasturlari"
      : lang === "en"
        ? "Disciplines & Seminar Programs"
        : "Академическое пространство кафедры";

  const description =
    lang === "uz"
      ? "Toshkent filiali psixologiya yo'nalishi fanlarining to'liq raqamlashtirilgan dasturlari, seminarlar rejasi va asl manbalar kutubxonasi."
      : lang === "en"
        ? "Digitized curriculum, seminar programs, digital primary source reader, and faculty profiles for the Psychology Department at MSU Tashkent."
        : "Единая цифровая академическая платформа кафедры психологии ТФ МГУ: интерактивные программы семинаров 2026, первоисточники, профили преподавателей и архив исследований.";

  return (
    <div className="page-disciplines relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionIntro
        title={title}
        description={description}
        eyebrow={t.nav.disciplines}
        number="03"
        lang={lang}
      />

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-8 md:py-12"
        direction="up"
      >
        <AcademicHubContainer
          t={t.disciplinesUI}
          disciplineNotice={t.siteNotice.disciplines}
        />
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
