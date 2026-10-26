"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  FileText,
  BookmarkCheck,
  ChevronRight,
} from "lucide-react";
import { tuniyantsProfile } from "@/data/academic-hub";
import type { TeacherFullProfile } from "@/data/academic-hub";

interface TeacherProfileViewProps {
  onOpenReader: (sourceKey: string) => void;
  onSelectCourse?: (courseId: string) => void;
}

export function TeacherProfileView({
  onOpenReader,
  onSelectCourse,
}: TeacherProfileViewProps) {
  const profile: TeacherFullProfile = tuniyantsProfile;
  const [activeTab, setActiveTab] = useState<
    "interests" | "publications" | "courses" | "supervision"
  >("interests");

  return (
    <div className="space-y-8">
      {/* Pilot Flag Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#4b3268]/15 via-[#b83b1c]/15 to-[#ff804d]/15 border border-[#4b3268]/20 dark:border-[#8950bb]/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4b3268] text-white font-serif font-bold text-lg shadow-sm">
            Ψ
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#34244f] dark:text-[#f8f4fc]">
              Пилотный цифровой профиль преподавателя кафедры
            </h4>
            <p className="text-xs text-[#706577] dark:text-[#bcaec7]">
              Оцифрованный академический портрет для студентов, кафедры и заведующего кафедрой
            </p>
          </div>
        </div>
        <a
          href={profile.istinaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#4b3268] text-white hover:bg-[#34244f] transition shadow-xs"
        >
          <span>ИСТИНА МГУ</span>
          <span className="text-white/70">· {profile.istinaId}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#fffefa] dark:bg-[#1f172a] border border-[#d9d0df] dark:border-[#433256] rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-8">
          {/* Avatar / Monogram */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#4b3268] via-[#6e468e] to-[#b83b1c] flex items-center justify-center text-white font-serif font-bold text-3xl sm:text-4xl shadow-xl ring-4 ring-white dark:ring-[#2d1f3f]">
              АА
            </div>
            <div
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#b83b1c] text-white font-sans font-bold text-[10px] tracking-wider uppercase shadow-sm"
              title="Старший преподаватель"
            >
              МГУ
            </div>
          </div>

          {/* Teacher Title & Details */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc]">
                {profile.role}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fff8f5] dark:bg-[#3a221f] text-[#b83b1c]">
                {profile.tenure}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#30233f] dark:text-[#f2ebf8]">
              {profile.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#706577] dark:text-[#bcaec7] leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Quick Meta Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-[#706577] dark:text-[#bcaec7]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#b83b1c]" />
                <span>{profile.consultationHours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#4b3268] dark:text-[#c6b4dc]" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#4b3268] dark:text-[#c6b4dc]" />
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:underline font-medium text-[#4b3268] dark:text-[#c6b4dc]"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Credo Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8fc] dark:bg-[#251a35] border-l-4 border-[#b83b1c] text-xs sm:text-sm italic text-[#30233f] dark:text-[#f2ebf8] leading-relaxed">
          «{profile.pedagogicalCredo}»
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-3">
          {[
            { id: "interests" as const, label: "Научные интересы", count: profile.interests.reduce((acc, c) => acc + c.items.length, 0) },
            { id: "publications" as const, label: "Публикации и статьи", count: profile.publications.length },
            { id: "courses" as const, label: "Дисциплины", count: profile.coursesTaught.length },
            { id: "supervision" as const, label: "Руководство ВКР", count: profile.supervisionTopics.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-[#4b3268] text-white shadow-sm"
                  : "text-[#706577] dark:text-[#bcaec7] hover:bg-[#ece5f0] dark:hover:bg-[#2e2042]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-md ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-[#4b3268]/10 text-[#4b3268] dark:text-[#c6b4dc]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Scientific Interests */}
        {activeTab === "interests" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.interests.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] space-y-3"
                >
                  <h4 className="text-sm font-bold font-serif text-[#34244f] dark:text-[#f8f4fc] border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-2">
                    {cat.category}
                  </h4>
                  <ul className="space-y-2">
                    {cat.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#30233f] dark:text-[#f2ebf8] leading-relaxed"
                      >
                        <BookmarkCheck className="w-4 h-4 text-[#b83b1c] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Publications */}
        {activeTab === "publications" && (
          <div className="space-y-4">
            <p className="text-xs text-[#706577] dark:text-[#bcaec7]">
              Ключевые научные публикации в журналах ВАК / РИНЦ / Вестнике МГУ.
              Статьи с отметкой ридера можно читать прямо в веб-платформе.
            </p>

            <div className="space-y-3">
              {profile.publications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-5 rounded-2xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] hover:border-[#b83b1c]/50 transition space-y-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#b83b1c] uppercase tracking-wider">
                      {pub.year} год · {pub.journal}
                    </span>
                    {pub.coauthors && pub.coauthors.length > 0 && (
                      <span className="text-xs text-[#706577] dark:text-[#bcaec7]">
                        Соавторы: {pub.coauthors.join(", ")}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-[#30233f] dark:text-[#f2ebf8]">
                    {pub.title}
                  </h4>

                  {pub.abstract && (
                    <p className="text-xs sm:text-sm text-[#706577] dark:text-[#bcaec7] leading-relaxed line-clamp-3">
                      {pub.abstract}
                    </p>
                  )}

                  {pub.readerKey && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenReader(pub.readerKey!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4b3268] text-white text-xs font-semibold hover:bg-[#34244f] transition shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Читать статью в ридере платформы</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Courses Taught */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <p className="text-xs text-[#706577] dark:text-[#bcaec7]">
              Курсы и практические семинары, преподаваемые в филиале МГУ в г. Ташкенте:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.coursesTaught.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#b83b1c]">
                      {c.course} курс · {c.hours} часов
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc]">
                      {c.role}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-serif text-[#30233f] dark:text-[#f2ebf8]">
                    {c.title}
                  </h4>

                  <button
                    type="button"
                    onClick={() => onSelectCourse && onSelectCourse(c.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#4b3268] text-white text-xs font-semibold hover:bg-[#34244f] transition"
                  >
                    <span>Открыть интерактивный силлабус</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Supervision Topics */}
        {activeTab === "supervision" && (
          <div className="space-y-4">
            <p className="text-xs text-[#706577] dark:text-[#bcaec7]">
              Тематика квалификационных работ и курсовых исследований студентов под руководством ст. преп. Туниянц А.А.:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.supervisionTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-5 rounded-2xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#b83b1c]">
                      {topic.year} · {topic.type}
                    </span>
                    {topic.studentName && (
                      <span className="text-xs text-[#706577] dark:text-[#bcaec7]">
                        {topic.studentName}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[#30233f] dark:text-[#f2ebf8]">
                    {topic.title}
                  </h4>

                  <p className="text-xs text-[#706577] dark:text-[#bcaec7] leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1">
                    {topic.methods.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
