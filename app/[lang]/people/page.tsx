import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { GraduationCap, Users, UserRound, UserRoundSearch } from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { peoplePage } from "@/data";
import { getTranslations } from "@/lib/i18n";
import { PeopleProfileSpotlight } from "@/components/academic-hub/people-profile-spotlight";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

const PERIOD_ICONS = [GraduationCap, Users, UserRound] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const appName = getTranslations(lang).appName;

  const title =
    lang === "uz"
      ? "Kafedra xodimlari va ilmiy profillar"
      : lang === "en"
        ? "People of the Department & Faculty Profiles"
        : "Люди кафедры и научные профили";

  const description =
    lang === "uz"
      ? "Toshkentdagi Moskva davlat universiteti Psixologiya kafedrasining asoschisi, o'qituvchilari va raqamlashtirilgan ilmiy profillari."
      : lang === "en"
        ? "Founder, faculty members, and digitized scientific profiles of the Department of Psychology at the Tashkent branch of MSU."
        : "Основатель, преподаватели и оцифрованные научные профили кафедры психологии Ташкентского филиала МГУ имени М. В. Ломоносова.";

  return {
    title: `${title} — ${appName}`,
    description,
  };
}

export default async function LangPeoplePage({ params }: Props) {
  const { lang } = await params;
  const { title, description, founder, generations } = peoplePage;

  const badgeText =
    lang === "uz" ? "Xodimlar" : lang === "en" ? "People" : "Люди";
  const founderHeading =
    lang === "uz"
      ? "Kafedra asoschisi"
      : lang === "en"
        ? "Founder of the Department"
        : "Основатель кафедры";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionIntro
        title={title}
        description={description}
        eyebrow={badgeText}
        number="05.2"
        lang={lang}
      />

      {/* Founder Section */}
      <AnimateOnScroll
        as="section"
        className="border-b border-[#ded6e2] dark:border-[#3c2c4f] py-12 md:py-16"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#4b3268]/20 bg-[#4b3268]/[0.05] rounded-2xl">
                <UserRoundSearch className="h-6 w-6 text-[#4b3268]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#34244f] dark:text-[#f8f4fc]">
                  {founderHeading}
                </h2>
                <p className="text-xs sm:text-sm text-[#706577] dark:text-[#bcaec7]">
                  Научный руководитель и создатель психологической школы филиала
                </p>
              </div>
            </div>
            <div className="border border-[#ded6e2] dark:border-[#3c2c4f] bg-card p-6 sm:p-8 rounded-2xl shadow-sm hover:border-[#b83b1c]/50 transition-colors duration-300 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-[#34244f] dark:text-[#f8f4fc] font-serif">
                {founder.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#b83b1c] font-semibold leading-relaxed">
                {founder.role}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#706577] dark:text-[#bcaec7]">
                {founder.description}
              </p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Spotlight: Digitized Faculty Profile (Tuniyants A.A.) */}
      <AnimateOnScroll
        as="section"
        className="border-b border-[#ded6e2] dark:border-[#3c2c4f] py-12 md:py-16"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <PeopleProfileSpotlight lang={lang} />
          </div>
        </div>
      </AnimateOnScroll>

      {/* Generations Section */}
      <AnimateOnScroll
        as="section"
        className="py-12 md:py-16"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[#34244f] dark:text-[#f8f4fc] mb-2">
              {generations.title}
            </h2>
            <p className="text-sm sm:text-base text-[#706577] dark:text-[#bcaec7] mb-8 leading-relaxed">
              {generations.description}
            </p>
            <div className="space-y-4">
              {generations.periods.map((period, index) => {
                const Icon = PERIOD_ICONS[index] || Users;
                return (
                  <div
                    key={period.title}
                    className="border border-[#ded6e2] dark:border-[#3c2c4f] bg-card p-6 rounded-2xl shadow-xs hover:border-[#b83b1c]/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3.5 mb-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-bold font-serif text-[#34244f] dark:text-[#f8f4fc]">
                        {period.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#706577] dark:text-[#bcaec7]">
                      {period.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
