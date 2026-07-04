import type { Metadata } from "next";
import { Calendar, MapPin } from "lucide-react";
import { PsychologyBauhausBackground } from "@/components/psychology-bauhaus-background";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { InternalLinkCard } from "@/components/internal-link-card";
import { historyPage } from "@/data";
import { getTranslations, localizeHref } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

const BURGUNDY = "#4A1028";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const appName = getTranslations(lang).appName;

  return {
    title: `${lang === "uz" ? "Psixologiya yo'nalishi tarixi" : lang === "en" ? "History of the Psychology Programme" : "История психологического направления"} — ${appName}`,
    description:
      lang === "uz"
        ? "Psixologiya Toshkent filialida qanday paydo bo'lgan: birinchi talabalar guruhidan ilmiy jamoagacha."
        : lang === "en"
          ? "How psychology emerged at the Tashkent branch of Moscow State University: from the first student group to the scientific community."
          : "Как появилась психология в Ташкентском филиале МГУ: от первой группы студентов до научного сообщества.",
    openGraph: {
      title: `${lang === "uz" ? "Psixologiya yo'nalishi tarixi" : lang === "en" ? "History of the Psychology Programme" : "История психологического направления"} — ${appName}`,
      description:
        lang === "uz"
          ? "Psixologiya Toshkent filialida qanday paydo bo'lgan."
          : lang === "en"
            ? "How psychology emerged at the Tashkent branch of Moscow State University."
            : "Как появилась психология в Ташкентском филиале МГУ.",
      images: [{ url: "/og/og-main.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lang === "uz" ? "Psixologiya yo'nalishi tarixi" : lang === "en" ? "History of the Psychology Programme" : "История психологического направления"} — ${appName}`,
      description:
        lang === "uz"
          ? "Psixologiya Toshkent filialida qanday paydo bo'lgan."
          : lang === "en"
            ? "How psychology emerged at the Tashkent branch of Moscow State University."
            : "Как появилась психология в Ташкентском филиале МГУ.",
    },
  };
}

export default async function LangHistoryPage({ params }: Props) {
  const { lang } = await params;
  const { title, paragraphs, keyDates, room220 } = historyPage;
  const lh = (href: string) => localizeHref(href, lang);

  const badgeText =
    lang === "uz" ? "Tarix" : lang === "en" ? "History" : "История";
  const keyDatesHeading =
    lang === "uz"
      ? "Muhim sanalar"
      : lang === "en"
        ? "Key dates"
        : "Ключевые даты";
  const archiveTitle =
    lang === "uz"
      ? "Arxiv va an'analar"
      : lang === "en"
        ? "Archive and traditions"
        : "Архив и традиции";
  const archiveDesc =
    lang === "uz"
      ? "Yodgorlik materiallari, talabalar an'analari va tarix sahifalari."
      : lang === "en"
        ? "Memorial materials, student traditions and pages of history."
        : "Памятные материалы, студенческие традиции и страницы истории.";
  const archiveLabel =
    lang === "uz" ? "Arxiv" : lang === "en" ? "Archive" : "Архив";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <PsychologyBauhausBackground />

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
              <Calendar className="h-3 w-3" />
              {badgeText}
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black leading-[1.05] tracking-tighter uppercase"
              style={{ color: BURGUNDY }}
            >
              {title}
            </h1>
            <div
              className="mx-auto mt-4 h-1 w-16"
              style={{ backgroundColor: BURGUNDY }}
            />
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-8 md:py-12"
        direction="up"
      >
        <div className="max-w-[720px] mx-auto">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm sm:text-base leading-[1.8] mb-5 last:mb-0"
              style={{ color: "rgba(74, 16, 40, 0.8)" }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="border-t border-b border-[#4A1028]/10 py-10 md:py-14"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[720px] mx-auto">
            <h2
              className="text-lg sm:text-xl font-bold uppercase tracking-wider mb-8 text-center"
              style={{ color: BURGUNDY }}
            >
              {keyDatesHeading}
            </h2>

            <div className="relative">
              <div
                className="absolute left-[19px] top-0 bottom-0 w-px hidden sm:block"
                style={{ backgroundColor: "rgba(74, 16, 40, 0.15)" }}
              />

              <div className="space-y-8">
                {keyDates.map((item, index) => (
                  <div
                    key={item.year}
                    className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
                  >
                    <div className="flex sm:flex-col items-center gap-3 sm:items-end sm:w-20 shrink-0">
                      <span
                        className="inline-flex items-center justify-center sm:w-10 sm:h-10 w-8 h-8 rounded-full text-xs font-bold border-2 shrink-0"
                        style={{
                          borderColor: BURGUNDY,
                          color: BURGUNDY,
                          backgroundColor: "white",
                        }}
                      >
                        {item.year}
                      </span>
                      {index < keyDates.length - 1 && (
                        <div
                          className="sm:hidden h-px flex-1"
                          style={{
                            backgroundColor: "rgba(74, 16, 40, 0.15)",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4 sm:pb-0">
                      <h3
                        className="text-sm font-bold mb-1"
                        style={{ color: BURGUNDY }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: "rgba(74, 16, 40, 0.65)" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-10 md:py-14"
        direction="up"
      >
        <div className="max-w-[720px] mx-auto">
          <div
            className="border-2 p-6 sm:p-8 md:p-10 relative"
            style={{
              borderColor: "rgba(74, 16, 40, 0.2)",
              backgroundColor: "rgba(74, 16, 40, 0.02)",
            }}
          >
            <div
              className="absolute -top-[1px] left-8 right-8 h-[3px]"
              style={{ backgroundColor: BURGUNDY }}
            />

            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex h-10 w-10 items-center justify-center border-2 shrink-0"
                style={{
                  borderColor: "rgba(74, 16, 40, 0.2)",
                  backgroundColor: "rgba(74, 16, 40, 0.04)",
                }}
              >
                <MapPin
                  className="h-4 w-4"
                  style={{ color: "rgba(74, 16, 40, 0.6)" }}
                />
              </div>
              <h2
                className="text-lg sm:text-xl font-bold uppercase tracking-wider"
                style={{ color: BURGUNDY }}
              >
                {room220.title}
              </h2>
            </div>

            <p
              className="text-sm sm:text-base leading-relaxed mb-6"
              style={{ color: "rgba(74, 16, 40, 0.75)" }}
            >
              {room220.description}
            </p>

            <ul className="space-y-2">
              {room220.details.map((detail, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed"
                  style={{ color: "rgba(74, 16, 40, 0.65)" }}
                >
                  <span
                    className="block w-1.5 h-1.5 rounded-full mt-[6px] shrink-0"
                    style={{ backgroundColor: "rgba(74, 16, 40, 0.3)" }}
                  />
                  {detail}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-[#4A1028]/10">
              <InternalLinkCard
                href={lh("/archive")}
                title={archiveTitle}
                description={archiveDesc}
                label={archiveLabel}
              />
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
