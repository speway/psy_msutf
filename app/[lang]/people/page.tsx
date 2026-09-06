import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import { GraduationCap, Users, UserRound, UserRoundSearch } from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { peoplePage } from "@/data";
import { getTranslations } from "@/lib/i18n";

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
      ? "Kafedra xodimlari"
      : lang === "en"
        ? "People of the Department"
        : "Люди кафедры";

  const description =
    lang === "uz"
      ? "Toshkentdagi Moskva davlat universiteti Psixologiya kafedrasining asoschisi, avlodlari va o'qituvchilari."
      : lang === "en"
        ? "Founder, generations and teachers of the Department of Psychology at the Tashkent branch of Lomonosov Moscow State University."
        : "Основатель, поколения и преподаватели кафедры психологии Ташкентского филиала МГУ имени М. В. Ломоносова.";

  return {
    title: `${title} — ${appName}`,
    description,
  };
}

export default async function LangPeoplePage({ params }: Props) {
  const { lang } = await params;
  const { title, description, founder, generations, teachersPlaceholder } =
    peoplePage;

  const badgeText =
    lang === "uz" ? "Xodimlar" : lang === "en" ? "People" : "Люди";
  const founderHeading =
    lang === "uz"
      ? "Kafedra asoschisi"
      : lang === "en"
        ? "Founder of the Department"
        : "Основатель кафедры";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <SectionIntro
        title={title}
        description={description}
        eyebrow={badgeText}
        number="05.2"
        lang={lang}
      />

      <AnimateOnScroll
        as="section"
        className="border-b border-bauhaus-blue/10 py-12 md:py-16"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[720px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-bauhaus-blue/20 bg-bauhaus-blue/[0.03]">
                <UserRoundSearch className="h-6 w-6 text-bauhaus-blue/70" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-bauhaus-blue">
                  {founderHeading}
                </h2>
              </div>
            </div>
            <div className="border-2 border-bauhaus-blue/15 bg-card p-6 sm:p-8 hover:border-bauhaus-ochre/50 transition-colors duration-300">
              <h3 className="text-lg font-bold text-bauhaus-blue mb-1">
                {founder.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/70 mb-4 leading-relaxed">
                {founder.role}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {founder.description}
              </p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="border-b border-bauhaus-blue/10 py-12 md:py-16"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[720px] mx-auto">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-bauhaus-blue mb-2">
              {generations.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-10 leading-relaxed">
              {generations.description}
            </p>
            <div className="space-y-6">
              {generations.periods.map((period, index) => {
                const Icon = PERIOD_ICONS[index] || Users;
                return (
                  <div
                    key={period.title}
                    className="border-2 border-bauhaus-blue/15 bg-card p-6 sm:p-8 hover:border-bauhaus-ochre/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-bauhaus-blue/20 bg-bauhaus-blue/[0.03]">
                        <Icon className="h-4 w-4 text-bauhaus-blue/70" />
                      </div>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-bauhaus-blue">
                        {period.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {period.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll as="section" className="py-12 md:py-16" direction="up">
        <div className="container mx-auto px-4">
          <div className="max-w-[720px] mx-auto">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-bauhaus-blue mb-2">
              {teachersPlaceholder.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed">
              {teachersPlaceholder.description}
            </p>
            <div className="border-2 border-dashed border-bauhaus-blue/20 bg-bauhaus-blue/[0.02] p-10 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center border-2 border-bauhaus-ochre/20 bg-bauhaus-ochre/[0.03]">
                  <UserRound className="h-7 w-7 text-bauhaus-ochre/50" />
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground/60 leading-relaxed max-w-[480px] mx-auto">
                {teachersPlaceholder.note}
              </p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
