"use client";

import { useState } from "react";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  Layers,
  FileText,
} from "lucide-react";
import {
  motivationEmotionCourse,
  professionalSocializationCourse,
  studentWorksArchive,
} from "@/data/academic-hub";
import type { CourseProgram, SeminarTopic } from "@/data/academic-hub";

interface CourseExplorerProps {
  onOpenReader: (sourceKey: string, page?: number | string) => void;
  onOpenTeacherProfile?: () => void;
}

const COURSES: CourseProgram[] = [
  motivationEmotionCourse,
  professionalSocializationCourse,
];

export function CourseExplorer({
  onOpenReader,
  onOpenTeacherProfile,
}: CourseExplorerProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    motivationEmotionCourse.id
  );
  const [selectedSeminarNum, setSelectedSeminarNum] = useState<number>(1);

  const currentCourse =
    COURSES.find((c) => c.id === selectedCourseId) || motivationEmotionCourse;

  const currentSeminar: SeminarTopic =
    currentCourse.seminars.find((s) => s.number === selectedSeminarNum) ||
    currentCourse.seminars[0];

  // Related student works for current seminar
  const relatedWorks = studentWorksArchive.filter((w) =>
    w.seminarRelated?.toLowerCase().includes(`семинар ${currentSeminar.number}`)
  );

  return (
    <div className="space-y-8">
      {/* Course Switcher Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#eee5f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] w-fit">
        {COURSES.map((course) => (
          <button
            key={course.id}
            type="button"
            onClick={() => {
              setSelectedCourseId(course.id);
              setSelectedSeminarNum(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedCourseId === course.id
                ? "bg-[#4b3268] text-white shadow-md"
                : "text-[#4b3268] dark:text-[#c6b4dc] hover:bg-white/60 dark:hover:bg-white/10"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{course.shortTitle}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md ${
                selectedCourseId === course.id
                  ? "bg-white/20 text-white"
                  : "bg-[#4b3268]/10 text-[#4b3268] dark:text-[#c6b4dc]"
              }`}
            >
              {course.courseNumber} курс · {course.totalHours}ч
            </span>
          </button>
        ))}
      </div>

      {/* Course Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4b3268] via-[#3a2455] to-[#28183e] text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 rounded-full bg-[#ff804d]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff804d] text-white uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Цифровой силлабус 2026
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90">
              {currentCourse.level === "bachelor" ? "Бакалавриат" : "Магистратура"} · {currentCourse.courseNumber} курс
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90">
              {currentCourse.seminars.length} семинаров · {currentCourse.totalHours} часов
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            {currentCourse.title}
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-3xl leading-relaxed">
            {currentCourse.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/15 text-xs sm:text-sm text-white/90">
            <div>
              <span className="text-white/60">Преподаватель:</span>{" "}
              <button
                type="button"
                onClick={onOpenTeacherProfile}
                className="font-semibold underline decoration-[#ff804d] decoration-2 underline-offset-4 hover:text-[#ff804d] transition inline-flex items-center gap-1"
              >
                {currentCourse.teacherName}
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <span className="text-white/60">Форма контроля:</span>{" "}
              <span className="font-semibold">{currentCourse.examType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seminars Selector Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#34244f] dark:text-[#f8f4fc] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#b83b1c]" />
            Семинарские занятия курса ({currentCourse.seminars.length})
          </h3>
          <span className="text-xs text-[#706577] dark:text-[#bcaec7]">
            Выберите тему для просмотра программы и источников
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {currentCourse.seminars.map((sem) => {
            const isSelected = sem.number === selectedSeminarNum;
            return (
              <button
                key={sem.number}
                type="button"
                onClick={() => setSelectedSeminarNum(sem.number)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-[#fffefa] dark:bg-[#251a35] border-[#b83b1c] shadow-md ring-2 ring-[#b83b1c]/20"
                    : "bg-[#fffefa]/80 dark:bg-[#1a1424]/80 border-[#ded6e2] dark:border-[#3c2c4f] hover:border-[#4b3268] hover:bg-white"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                    isSelected
                      ? "bg-[#b83b1c] text-white"
                      : "bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc]"
                  }`}
                >
                  №{sem.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-[#b83b1c]">
                      Тема {sem.number}
                    </span>
                    <span className="text-[11px] text-[#706577] dark:text-[#bcaec7]">
                      {sem.hours} ч.
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#30233f] dark:text-[#f2ebf8] line-clamp-2 mt-0.5">
                    {sem.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#706577] dark:text-[#bcaec7]">
                    <span>{sem.questions.length} вопр.</span>
                    <span>·</span>
                    <span>{sem.literature.length} источн.</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed View of Active Seminar */}
      <div className="bg-[#fffefa] dark:bg-[#1f172a] border border-[#d9d0df] dark:border-[#433256] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        {/* Header */}
        <div className="border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#b83b1c] uppercase tracking-wider flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#b83b1c]" />
              Семинар №{currentSeminar.number} · {currentCourse.shortTitle}
            </span>
            <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {currentSeminar.hours} академических часа
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#30233f] dark:text-[#f2ebf8]">
            {currentSeminar.title}
          </h3>

          <p className="text-sm text-[#706577] dark:text-[#bcaec7]">
            {currentSeminar.description}
          </p>

          {/* Key terms */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            <span className="text-xs font-semibold text-[#4b3268] dark:text-[#c6b4dc] mr-1">
              Ключевые понятия:
            </span>
            {currentSeminar.keyTerms.map((term, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#f0e8f5] dark:bg-[#2e2042] text-[#4b3268] dark:text-[#e0d4ec] font-medium"
              >
                #{term}
              </span>
            ))}
          </div>
        </div>

        {/* Seminar Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Questions to Prepare (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h4 className="text-base font-serif font-bold text-[#34244f] dark:text-[#f8f4fc] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#4b3268] dark:text-[#c6b4dc]" />
                Вопросы для семинарского обсуждения
              </h4>

              <div className="space-y-2.5">
                {currentSeminar.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] hover:border-[#4b3268] transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#b83b1c] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#30233f] dark:text-[#f2ebf8] leading-relaxed">
                      {q}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodological Guidance */}
            {currentSeminar.methodologicalNotes && (
              <div className="p-4 rounded-xl bg-[#fff8f5] dark:bg-[#2a1b18] border border-[#ff804d]/30 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#b83b1c]">
                  <Lightbulb className="w-4 h-4" />
                  Методические рекомендации преподавателя
                </div>
                <p className="text-[#30233f] dark:text-[#f2ebf8] leading-relaxed">
                  {currentSeminar.methodologicalNotes}
                </p>
              </div>
            )}

            {/* Practical Task */}
            {currentSeminar.practicalTask && (
              <div className="p-4 rounded-xl bg-[#f5f8ff] dark:bg-[#162035] border border-[#3b82f6]/30 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#2563eb] dark:text-[#60a5fa]">
                  <Bookmark className="w-4 h-4" />
                  Практическое задание к семинару
                </div>
                <p className="text-[#30233f] dark:text-[#f2ebf8] leading-relaxed">
                  {currentSeminar.practicalTask}
                </p>
              </div>
            )}
          </div>

          {/* Literature & Sources (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-serif font-bold text-[#34244f] dark:text-[#f8f4fc] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#b83b1c]" />
                  Литература к семинару
                </h4>
                <span className="text-xs text-[#706577] dark:text-[#bcaec7]">
                  {currentSeminar.literature.length} источн.
                </span>
              </div>

              <div className="space-y-2.5">
                {currentSeminar.literature.map((lit) => (
                  <div
                    key={lit.id}
                    className="p-3.5 rounded-xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] space-y-2 hover:border-[#b83b1c]/50 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#4b3268] dark:text-[#c6b4dc]">
                        {lit.author}
                      </span>
                      {lit.isRequired && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#b83b1c]/10 text-[#b83b1c] font-semibold">
                          Обязательно
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#30233f] dark:text-[#f2ebf8] line-clamp-3 leading-snug">
                      {lit.source}
                    </p>

                    {lit.readerKey ? (
                      <button
                        type="button"
                        onClick={() => onOpenReader(lit.readerKey!)}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#4b3268] hover:bg-[#34244f] text-white text-xs font-semibold shadow-xs transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Читать источник в ридере</span>
                      </button>
                    ) : (
                      <div className="text-[11px] text-[#706577] dark:text-[#bcaec7] italic pt-1">
                        Доступно в библиотеке ТФ МГУ
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Research in Archive */}
            {relatedWorks.length > 0 && (
              <div className="p-4 rounded-xl bg-[#faf8fc] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#4b3268] dark:text-[#c6b4dc]">
                  Связанные исследования студентов (ВКР)
                </h5>
                {relatedWorks.map((work) => (
                  <div key={work.id} className="text-xs space-y-1">
                    <p className="font-semibold text-[#30233f] dark:text-[#f2ebf8]">
                      {work.title}
                    </p>
                    <p className="text-[#706577] dark:text-[#bcaec7]">
                      {work.author} · рук.: {work.advisor}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
