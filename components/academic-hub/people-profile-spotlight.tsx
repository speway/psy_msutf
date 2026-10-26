"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  FileText,
  Clock,
  ChevronRight,
  BookmarkCheck,
} from "lucide-react";
import { tuniyantsProfile } from "@/data/academic-hub";
import { AcademicReaderModal } from "./academic-reader-modal";
import { localizeHref } from "@/lib/i18n";

interface PeopleProfileSpotlightProps {
  lang: string;
}

export function PeopleProfileSpotlight({ lang }: PeopleProfileSpotlightProps) {
  const profile = tuniyantsProfile;
  const [activeReaderKey, setActiveReaderKey] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Pilot Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4b3268] via-[#3a2455] to-[#25183b] text-white p-6 sm:p-8 shadow-xl border border-[#8950bb]/30">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ff804d] text-white uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Пилотный проект кафедры
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90">
              Стандарт оцифровки преподавателей ТФ МГУ
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white">
            Цифровой научный профиль преподавателя
          </h3>

          <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            Интерактивный академический портрет, объединяющий исследовательские
            интересы, профиль в системе «ИСТИНА» МГУ, преподаваемые дисциплины,
            программы семинаров и полнотекстовый каталог литературы.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-[#d9d0df] dark:border-[#433256] bg-[#fffefa] dark:bg-[#1f172a] p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#4b3268] to-[#b83b1c] flex items-center justify-center text-white font-serif font-bold text-2xl sm:text-3xl shadow-lg shrink-0">
            АА
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ece5f0] dark:bg-[#34244f] text-[#4b3268] dark:text-[#c6b4dc]">
                {profile.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fff8f5] dark:bg-[#3a221f] text-[#b83b1c]">
                {profile.tenure}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#30233f] dark:text-[#f2ebf8]">
              {profile.name}
            </h4>

            <p className="text-xs sm:text-sm text-[#706577] dark:text-[#bcaec7] leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#706577] dark:text-[#bcaec7]">
              <a
                href={profile.istinaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#4b3268] dark:text-[#c6b4dc] hover:text-[#b83b1c] underline underline-offset-4 flex items-center gap-1"
              >
                <span>ИСТИНА МГУ: IRID {profile.istinaId}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#b83b1c]" />
                {profile.consultationHours}
              </span>
            </div>
          </div>
        </div>

        {/* Areas of Interest */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#4b3268] dark:text-[#c6b4dc]">
            Сфера научных интересов и специализация
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {profile.interests.map((cat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] space-y-1.5"
              >
                <div className="text-xs font-bold font-serif text-[#34244f] dark:text-[#f8f4fc]">
                  {cat.category}
                </div>
                <div className="text-[11px] text-[#706577] dark:text-[#bcaec7] space-y-1">
                  {cat.items.slice(0, 3).map((it, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <BookmarkCheck className="w-3 h-3 text-[#b83b1c] shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taught Courses with link */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#4b3268] dark:text-[#c6b4dc]">
              Преподаваемые дисциплины
            </h5>
            <Link
              href={localizeHref("/disciplines", lang)}
              className="text-xs font-semibold text-[#b83b1c] hover:underline flex items-center gap-1"
            >
              <span>Открыть интерактивные силлабусы</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.coursesTaught.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#b83b1c]">
                    {c.course} курс · {c.hours} ч.
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-[#30233f] dark:text-[#f2ebf8]">
                    {c.title}
                  </div>
                </div>
                <Link
                  href={localizeHref("/disciplines", lang)}
                  className="px-2.5 py-1 rounded-lg bg-[#4b3268] text-white text-xs font-semibold hover:bg-[#34244f] transition shrink-0"
                >
                  Силлабус
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Key publications */}
        <div className="space-y-3 pt-2 border-t border-[#ded6e2] dark:border-[#3c2c4f]">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#4b3268] dark:text-[#c6b4dc]">
            Избранные публикации (доступно чтение в платформе)
          </h5>
          <div className="space-y-2">
            {profile.publications.slice(0, 2).map((pub) => (
              <div
                key={pub.id}
                className="p-3 rounded-xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#30233f] dark:text-[#f2ebf8]">
                    {pub.title}
                  </div>
                  <div className="text-[11px] text-[#706577] dark:text-[#bcaec7]">
                    {pub.journal} ({pub.year}) · соавторы: {pub.coauthors?.join(", ")}
                  </div>
                </div>
                {pub.readerKey && (
                  <button
                    type="button"
                    onClick={() => setActiveReaderKey(pub.readerKey!)}
                    className="flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-[#4b3268] text-white text-xs font-semibold hover:bg-[#34244f] transition shrink-0"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Читать</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {activeReaderKey && (
        <AcademicReaderModal
          sourceKey={activeReaderKey}
          onClose={() => setActiveReaderKey(null)}
        />
      )}
    </div>
  );
}
