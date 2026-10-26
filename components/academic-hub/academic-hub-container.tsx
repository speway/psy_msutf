"use client";

import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  UserRound,
  Archive,
  Layers,
  BookMarked,
} from "lucide-react";
import { CourseExplorer } from "./course-explorer";
import { TeacherProfileView } from "./teacher-profile-view";
import { LiteratureCatalogView } from "./literature-catalog-view";
import { AcademicReaderModal } from "./academic-reader-modal";
import { studentWorksArchive } from "@/data/academic-hub";
import { DisciplinesExplorer } from "@/components/disciplines-explorer";
import { GlossaryClient } from "@/components/glossary-client";
import type { DisciplinesUITranslation, GlossaryUITranslation } from "@/data/i18n";

type HubTabId =
  | "disciplines"
  | "profile"
  | "literature"
  | "glossary"
  | "archive"
  | "curriculum";

interface AcademicHubContainerProps {
  t: DisciplinesUITranslation;
  glossaryUI?: GlossaryUITranslation;
  defaultTab?: HubTabId;
  disciplineNotice?: string;
}

export function AcademicHubContainer({
  t,
  glossaryUI,
  defaultTab = "disciplines",
  disciplineNotice,
}: AcademicHubContainerProps) {
  const [activeHubTab, setActiveHubTab] = useState<HubTabId>(defaultTab);

  // Reader state
  const [activeReaderKey, setActiveReaderKey] = useState<string | null>(null);
  const [activeReaderPage, setActiveReaderPage] = useState<number | string | undefined>(undefined);

  const handleOpenReader = (key: string, page?: number | string) => {
    setActiveReaderKey(key);
    setActiveReaderPage(page);
  };

  const handleCloseReader = () => {
    setActiveReaderKey(null);
    setActiveReaderPage(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Platform Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-4">
        {[
          { id: "disciplines" as const, label: "Силлабусы и семинары", icon: Layers, badge: "9 тем" },
          { id: "profile" as const, label: "Научный профиль (Туниянц А.А.)", icon: UserRound, badge: "ИСТИНА" },
          { id: "literature" as const, label: "Каталог литературы", icon: BookOpen, badge: "19 книг" },
          { id: "glossary" as const, label: "Глоссарий (Термин дня)", icon: BookMarked, badge: "280 слов" },
          { id: "archive" as const, label: "Архив исследований и ВКР", icon: Archive, badge: "ВКР" },
          { id: "curriculum" as const, label: "Учебный план кафедры", icon: GraduationCap, badge: "1–4 курс" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeHubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveHubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition ${
                isActive
                  ? "bg-[#4b3268] text-white shadow-md ring-2 ring-[#4b3268]/20"
                  : "bg-[#fffefa] dark:bg-[#1f172a] text-[#706577] dark:text-[#bcaec7] hover:bg-[#ece5f0] border border-[#d9d0df] dark:border-[#433256]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                  isActive
                    ? "bg-[#ff804d] text-white"
                    : "bg-[#4b3268]/10 text-[#4b3268] dark:text-[#c6b4dc]"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Disciplines & Interactive Seminars */}
      {activeHubTab === "disciplines" && (
        <CourseExplorer
          onOpenReader={handleOpenReader}
          onOpenTeacherProfile={() => setActiveHubTab("profile")}
        />
      )}

      {/* Tab 2: Teacher Profile */}
      {activeHubTab === "profile" && (
        <TeacherProfileView
          onOpenReader={handleOpenReader}
          onSelectCourse={() => setActiveHubTab("disciplines")}
        />
      )}

      {/* Tab 3: Literature Catalog */}
      {activeHubTab === "literature" && (
        <LiteratureCatalogView onOpenReader={handleOpenReader} />
      )}

      {/* Tab 4: Psychology Glossary & Term of the Day */}
      {activeHubTab === "glossary" && glossaryUI && (
        <div className="space-y-6">
          <GlossaryClient t={glossaryUI} />
        </div>
      )}

      {/* Tab 5: Student Research Archive */}
      {activeHubTab === "archive" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#fffefa] dark:bg-[#1f172a] border border-[#d9d0df] dark:border-[#433256] shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#30233f] dark:text-[#f2ebf8] mb-2">
              Архив квалификационных и курсовых работ
            </h3>
            <p className="text-xs sm:text-sm text-[#706577] dark:text-[#bcaec7]">
              Эмпирические исследования студентов бакалавриата кафедры психологии ТФ МГУ.
              Связаны с практическими темами семинаров по мотивации, эмоциям и саморегуляции.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentWorksArchive.map((work) => (
              <div
                key={work.id}
                className="p-5 rounded-2xl bg-[#fffefa] dark:bg-[#1f172a] border border-[#d9d0df] dark:border-[#433256] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#b83b1c]">
                    {work.year} · {work.type}
                  </span>
                  <span className="text-xs text-[#706577] dark:text-[#bcaec7]">
                    {work.author}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-[#30233f] dark:text-[#f2ebf8]">
                  {work.title}
                </h4>

                <p className="text-xs text-[#4b3268] dark:text-[#c6b4dc] font-semibold">
                  Научный руководитель: {work.advisor}
                </p>

                <div className="text-xs text-[#706577] dark:text-[#bcaec7] space-y-1 bg-[#faf8f4] dark:bg-[#251a35] p-3 rounded-xl border border-[#ded6e2] dark:border-[#3c2c4f]">
                  <p>
                    <strong className="text-[#30233f] dark:text-[#f2ebf8]">Выборка:</strong> {work.sample}
                  </p>
                  <p>
                    <strong className="text-[#30233f] dark:text-[#f2ebf8]">Методики:</strong> {work.methods}
                  </p>
                  <p className="pt-1 text-[#30233f] dark:text-[#f2ebf8] leading-relaxed">
                    <strong className="text-[#b83b1c]">Результат:</strong> {work.keyFindings}
                  </p>
                </div>

                {work.seminarRelated && (
                  <div className="text-[11px] text-[#b83b1c] font-semibold pt-1">
                    Связано с: {work.seminarRelated}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Traditional Curriculum Explorer */}
      {activeHubTab === "curriculum" && (
        <DisciplinesExplorer t={t} disciplineNotice={disciplineNotice} />
      )}

      {/* Fullscreen Reader Modal */}
      {activeReaderKey && (
        <AcademicReaderModal
          sourceKey={activeReaderKey}
          initialPage={activeReaderPage}
          onClose={handleCloseReader}
        />
      )}
    </div>
  );
}
