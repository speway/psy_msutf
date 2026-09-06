import { SectionIntro } from "@/components/section-intro";
import type { Metadata } from "next";
import {
  GraduationCap,
  FlaskConical,
  BookOpen,
  Calendar,
  Handshake,
  Beaker,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { projectsPage } from "@/data";
import { getTranslations } from "@/lib/i18n";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ lang: string }>;
}

const BLOCK_ICONS: Record<string, React.ElementType> = {
  GraduationCap,
  FlaskConical,
  BookOpen,
  Calendar,
  Handshake,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const appName = getTranslations(lang).appName;

  const title =
    lang === "uz"
      ? "Loyihalar va tashabbuslar"
      : lang === "en"
        ? "Projects and initiatives"
        : "Проекты и инициативы";

  return {
    title: `${title} — ${appName}`,
    description:
      lang === "uz"
        ? "Talabalar ilmiy jamiyati, psixologiya laboratoriyasi, yosh psixolog maktabi, qishki va bahorgi maktablar, amaliyot va hamkorlik — Toshkent MDU Psixologiya kafedrasi loyihalari."
        : lang === "en"
          ? "Student scientific society, psychology laboratory, young psychologist school, winter and spring schools, practice and partnerships — projects of the Department of Psychology at Tashkent MSU."
          : "Студенческое научное общество, лаборатория психологии, школа юного психолога, зимние и весенние школы, практика и партнёрства — проекты кафедры психологии Ташкентского филиала МГУ.",
  };
}

export default async function LangProjectsPage({ params }: Props) {
  const { lang } = await params;
  const { title, description, blocks } = projectsPage;

  const badgeText =
    lang === "uz" ? "Loyihalar" : lang === "en" ? "Projects" : "Проекты";

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <SectionIntro
        title={title}
        description={description}
        eyebrow={badgeText}
        number="05.4"
        lang={lang}
      />

      <AnimateOnScroll
        as="section"
        className="container mx-auto px-4 py-12 md:py-16"
        direction="up"
      >
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block) => {
              const Icon = BLOCK_ICONS[block.icon] || Beaker;
              return (
                <div
                  key={block.title}
                  className="border-2 border-bauhaus-blue/15 bg-card p-6 sm:p-8 flex flex-col hover:border-bauhaus-ochre/50 transition-colors duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-bauhaus-blue/20 bg-bauhaus-blue/[0.03]">
                      <Icon className="h-5 w-5 text-bauhaus-blue/70" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-bauhaus-blue">
                      {block.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-4 flex-1">
                    {block.description}
                  </p>
                  <ul className="space-y-1.5 mt-auto pt-2 border-t border-bauhaus-blue/10">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs text-muted-foreground/80"
                      >
                        <span className="block w-1.5 h-1.5 rounded-full bg-bauhaus-ochre/50 mt-[5px] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </AnimateOnScroll>

      <ScrollToTop />
    </div>
  );
}
