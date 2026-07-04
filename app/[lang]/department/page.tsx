import type { Metadata } from "next";
import {
  BookOpen,
  GraduationCap,
  FlaskConical,
  Users,
  BookMarked,
} from "lucide-react";
import { BauhausDecor } from "@/components/bauhaus-decor";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { departmentPage, officialLinks } from "@/data";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

const PILLAR_ICONS: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  FlaskConical,
  Users,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const appName = getTranslations(lang).appName;

  const title =
    lang === "uz"
      ? "Psixologiya kafedrasi"
      : lang === "en"
        ? "Department of Psychology"
        : "Кафедра психологии";

  const description =
    lang === "uz"
      ? "Toshkentdagi Moskva davlat universiteti Psixologiya kafedrasi: fundamental ta'lim, ilmiy maktablar, amaliy tayyorgarlik va xalqaro hamkorlik."
      : lang === "en"
        ? "Department of Psychology at the Tashkent branch of Lomonosov Moscow State University: fundamental education, scientific schools, practical training and international cooperation."
        : "Кафедра психологии Ташкентского филиала МГУ имени М. В. Ломоносова: фундаментальное образование, научные школы, практическая подготовка и международное сотрудничество.";

  return {
    title: `${title} — ${appName}`,
    description,
  };
}

export default async function LangDepartmentPage({ params }: Props) {
  const { lang } = await params;
  const { title, description, sections, pillars, scienceActivities } =
    departmentPage;

  const badgeText =
    lang === "uz" ? "Kafedra" : lang === "en" ? "Department" : "Кафедра";
  const fourPillarsHeading =
    lang === "uz"
      ? "Kafedraning to'rtta tayanchi"
      : lang === "en"
        ? "Four pillars of the department"
        : "Четыре опоры кафедры";
  const fourPillarsDesc =
    lang === "uz"
      ? "Kafedraning ta'lim dasturi to'rtta fundamental asosga qurilgan bo'lib, mutaxassislar tayyorlashning yuqori sifatini ta'minlaydi."
      : lang === "en"
        ? "The department's educational program is built on four fundamental foundations that ensure high quality training of specialists."
        : "Образовательная программа кафедры строится на четырёх фундаментальных основаниях, обеспечивающих высокое качество подготовки специалистов.";
  const scienceHeading =
    lang === "uz"
      ? "Ilmiy faoliyat"
      : lang === "en"
        ? "Research activities"
        : "Научная деятельность";
  const scienceDesc =
    lang === "uz"
      ? "Kafedra zamonaviy psixologiya fanining asosiy yo'nalishlari bo'yicha faol ilmiy-tadqiqot ishlarini olib boradi."
      : lang === "en"
        ? "The department conducts active research in key areas of modern psychological science."
        : "Кафедра ведёт активную научно-исследовательскую работу по ключевым направлениям современной психологической науки.";
  const officialHeading =
    lang === "uz"
      ? "Rasmiy ma'lumot"
      : lang === "en"
        ? "Official information"
        : "Официальная информация";
  const officialDesc =
    lang === "uz"
      ? "Filialning kontaktlari va rasmiy resurslari"
      : lang === "en"
        ? "Contacts and official resources of the branch"
        : "Контакты и официальные ресурсы филиала";
  const openSiteLabel =
    lang === "uz"
      ? "Saytni ochish"
      : lang === "en"
        ? "Open website"
        : "Открыть сайт";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <BauhausDecor />

      <AnimateOnScroll
        as="section"
        className="relative border-b-2 border-bauhaus-blue scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-[720px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5">
              <BookMarked className="h-3 w-3" />
              {badgeText}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase text-bauhaus-blue">
              {title}
            </h1>
            <div className="mx-auto mt-4 h-1 w-16 bg-bauhaus-blue" />
            <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-10 md:py-14"
        direction="up"
      >
        <div className="max-w-[720px] mx-auto space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-bauhaus-blue mb-4">
                {section.heading}
              </h2>
              <p className="text-sm sm:text-base leading-[1.8] text-muted-foreground">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="border-t border-b border-bauhaus-blue/10 py-12 md:py-16"
        direction="up"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-[960px] mx-auto">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-bauhaus-blue mb-2 text-center">
              {fourPillarsHeading}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground text-center mb-10 max-w-[560px] mx-auto leading-relaxed">
              {fourPillarsDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar) => {
                const Icon = PILLAR_ICONS[pillar.icon] || BookOpen;
                return (
                  <div
                    key={pillar.title}
                    className="border-2 border-bauhaus-blue/15 bg-card p-6 sm:p-8 hover:border-bauhaus-ochre/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-bauhaus-blue/20 bg-bauhaus-blue/[0.03]">
                        <Icon className="h-5 w-5 text-bauhaus-blue/70" />
                      </div>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-bauhaus-blue">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-12 md:py-16"
        direction="up"
      >
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-bauhaus-blue mb-2 text-center">
            {scienceHeading}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground text-center mb-10 max-w-[560px] mx-auto leading-relaxed">
            {scienceDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {scienceActivities.map((activity) => (
              <div
                key={activity.title}
                className="border-2 border-bauhaus-blue/15 bg-card p-6 sm:p-8 hover:border-bauhaus-ochre/50 transition-colors duration-300"
              >
                <h3 className="text-lg font-bold uppercase tracking-wider text-bauhaus-blue mb-3">
                  {activity.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-4">
                  {activity.description}
                </p>
                <ul className="space-y-1.5">
                  {activity.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-xs text-muted-foreground/80"
                    >
                      <span className="block w-1.5 h-1.5 rounded-full bg-bauhaus-ochre/50 mt-[5px] shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll
        as="section"
        className="border-t-2 border-bauhaus-blue/20 bg-bauhaus-blue/[0.02] scroll-mt-[72px] lg:scroll-mt-24"
        direction="up"
      >
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-[960px] mx-auto">
            <div className="text-center mb-10">
              <span
                className="inline-block text-2xl mb-2 text-bauhaus-ochre/50"
                aria-hidden="true"
              >
                ⊡
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-bauhaus-blue">
                {officialHeading}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
                {officialDesc}
              </p>
              <div className="mx-auto mt-3 h-px w-16 bg-bauhaus-ochre/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {officialLinks.map((link) => (
                <div
                  key={link.title}
                  className="border-2 border-bauhaus-blue/15 bg-card p-6 flex flex-col hover:border-bauhaus-ochre/50 transition-colors duration-300"
                >
                  <h3 className="text-lg font-bold uppercase tracking-wider text-bauhaus-blue mb-2">
                    {link.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-4 flex-1">
                    {link.description}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white transition-colors min-h-[44px] self-start"
                  >
                    {openSiteLabel}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
