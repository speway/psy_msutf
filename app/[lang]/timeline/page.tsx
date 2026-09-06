import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { ScrollToTop } from "@/components/scroll-to-top";
import { InteractiveTimeline } from "@/components/interactive-timeline";
import { academicTimeline } from "@/data";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  const title =
    lang === "uz"
      ? "Akademik vaqt shkalasi"
      : lang === "en"
        ? "Academic timeline"
        : "Академическая шкала времени";

  return {
    title: `${title} — ${t.appName}`,
    description:
      lang === "uz"
        ? "Toshkentdagi Moskva davlat universiteti Psixologiya kafedrasi tarixidagi asosiy voqealarning interaktiv xronologiyasi."
        : lang === "en"
          ? "Interactive chronology of key events in the history of the Department of Psychology at the Tashkent branch of Lomonosov Moscow State University."
          : "Интерактивная хронология ключевых событий в истории кафедры психологии Ташкентского филиала МГУ имени М. В. Ломоносова.",
  };
}

export default async function LangTimelinePage({ params }: Props) {
  const { lang } = await params;
  const entries = academicTimeline;

  const badgeText =
    lang === "uz"
      ? "Vaqt shkalasi"
      : lang === "en"
        ? "Timeline"
        : "Шкала времени";
  const titleText =
    lang === "uz"
      ? "Akademik vaqt shkalasi"
      : lang === "en"
        ? "Academic timeline"
        : "Академическая шкала времени";
  const descText =
    lang === "uz"
      ? "Toshkent MDU Psixologiya kafedrasi tarixidagi asosiy voqealar — tashkil etilishidan hozirgi kungacha. Batafsil ma'lumot olish uchun sanani bosing."
      : lang === "en"
        ? "Key events in the history of the Department of Psychology at Tashkent MSU — from its foundation to the present day. Click on a date to learn more."
        : "Ключевые события в истории кафедры психологии Ташкентского филиала МГУ — от основания до наших дней. Нажмите на дату, чтобы узнать подробнее.";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <SectionIntro
        title={titleText}
        description={descText}
        eyebrow={badgeText}
        number="05.5"
        lang={lang}
      />

      <InteractiveTimeline entries={entries} />

      <ScrollToTop />
    </div>
  );
}
