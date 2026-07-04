import type { Metadata } from "next";
import { History } from "lucide-react";
import { BauhausDecor } from "@/components/bauhaus-decor";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { InteractiveTimeline } from "@/components/interactive-timeline";
import { academicTimeline } from "@/data";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

const BURGUNDY = "#4A1028";

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
      <BauhausDecor />

      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-[#4A1028]/20 scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-[640px] mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2"
              style={{
                borderColor: "rgba(74, 16, 40, 0.3)",
                color: BURGUNDY,
                backgroundColor: "rgba(74, 16, 40, 0.05)",
              }}
            >
              <History className="h-3 w-3" />
              {badgeText}
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black leading-[1.05] tracking-tighter uppercase"
              style={{ color: BURGUNDY }}
            >
              {titleText}
            </h1>
            <div
              className="mx-auto mt-4 h-1 w-16"
              style={{ backgroundColor: BURGUNDY }}
            />
            <p
              className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[560px] mx-auto"
              style={{ color: "rgba(74, 16, 40, 0.65)" }}
            >
              {descText}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <InteractiveTimeline entries={entries} />

      <ScrollToTop />
    </div>
  );
}
