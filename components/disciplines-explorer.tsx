"use client";

import { useState, useMemo, useCallback, useId } from "react";
import {
  Search,
  RotateCcw,
  GraduationCap,
  BookOpen,
  Languages,
  Check,
} from "lucide-react";
import { disciplinesData } from "@/data/disciplines";
import type { EducationLevel } from "@/data/disciplines";
import type { DisciplinesUITranslation } from "@/data/i18n";

interface DisciplinesExplorerProps {
  t: DisciplinesUITranslation;
  disciplineNotice?: string;
}

export function DisciplinesExplorer({
  t,
  disciplineNotice,
}: DisciplinesExplorerProps) {
  const [level, setLevel] = useState<EducationLevel>("bachelor");
  const [course, setCourse] = useState<number>(1);
  const [query, setQuery] = useState("");
  const searchId = useId();

  const showLangNotice = t.bachelor !== "Бакалавриат";

  const levelOptions: { value: EducationLevel; label: string }[] = [
    { value: "bachelor", label: t.bachelor },
    { value: "master", label: t.master },
  ];

  const currentProgram = useMemo(
    () => disciplinesData.find((p) => p.level === level),
    [level]
  );

  const courseOptions = useMemo(() => {
    if (!currentProgram) return [];
    return currentProgram.courses.map((c) => c.course);
  }, [currentProgram]);

  const displayDisciplines = useMemo(() => {
    if (!currentProgram) return [];
    const courseData = currentProgram.courses.find((c) => c.course === course);
    if (!courseData) return [];

    if (!query.trim()) return courseData.subjects;

    const q = query.toLowerCase().trim();
    return courseData.subjects.filter((d) => d.toLowerCase().includes(q));
  }, [currentProgram, course, query]);

  const handleLevelChange = useCallback((newLevel: EducationLevel) => {
    setLevel(newLevel);
    setCourse(1);
    setQuery("");
  }, []);

  const handleReset = useCallback(() => {
    setLevel("bachelor");
    setCourse(1);
    setQuery("");
  }, []);

  const hasActiveFilters = query.trim().length > 0;

  return (
    <div className="max-w-[960px] mx-auto space-y-8">
      {showLangNotice && disciplineNotice && (
        <div className="flex items-start gap-2.5 p-4 border-2 border-border/60 bg-muted/30 text-sm text-muted-foreground">
          <Languages className="h-4 w-4 shrink-0 text-bauhaus-ochre mt-0.5" />
          <p>{disciplineNotice}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:flex sm:justify-center w-full sm:w-fit mx-auto gap-4">
        {levelOptions.map((opt) => {
          const isSelected = level === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleLevelChange(opt.value)}
              aria-pressed={isSelected}
              className={`inline-flex items-center justify-center gap-2.5 px-6 py-0 text-sm font-bold uppercase tracking-wider border-2 h-12 rounded-md transition-all duration-300 ease-out ${
                isSelected
                  ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-bauhaus"
                  : "border-border/60 text-muted-foreground hover:border-bauhaus-blue/40 hover:text-bauhaus-blue bg-transparent hover:bg-muted/30"
              }`}
            >
              {isSelected ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.course}:
        </span>
        <div className="grid grid-cols-2 sm:flex gap-3">
          {courseOptions.map((c) => {
            const isSelected = course === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setCourse(c);
                  setQuery("");
                }}
                aria-pressed={isSelected}
                className={`px-6 py-0 text-sm font-bold tracking-wider border-2 h-12 rounded-md transition-all duration-300 ease-out ${
                  isSelected
                    ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-bauhaus"
                    : "border-border/60 text-muted-foreground hover:border-bauhaus-blue/40 hover:text-bauhaus-blue bg-transparent hover:bg-muted/30"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full mx-auto">
        <label htmlFor={searchId} className="sr-only">
          {t.searchLabel}
        </label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-border/60 bg-card text-foreground placeholder:text-muted-foreground/72 outline-none transition-all duration-300 focus:border-bauhaus-blue/40"
            aria-label={t.searchLabel}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {displayDisciplines.length === 0
              ? t.nothingFound
              : `${t.foundCount}: ${displayDisciplines.length}`}
          </p>
          <button
            onClick={handleReset}
            className="text-xs font-bold uppercase tracking-wider text-bauhaus-ochre hover:text-bauhaus-ochre/80 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            {t.reset}
          </button>
        </div>
      )}

      {displayDisciplines.length === 0 && hasActiveFilters && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-14 h-14 border-2 border-muted-foreground/20 mb-4">
            <Search className="h-6 w-6 text-muted-foreground/72" />
          </div>
          <p className="text-base font-medium text-muted-foreground">
            {t.nothingFound}
          </p>
          <p className="text-sm mt-1.5 text-muted-foreground/72">
            {t.tryChanging}
          </p>
        </div>
      )}

      {currentProgram && displayDisciplines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
            <BookOpen
              className="h-5 w-5 text-bauhaus-ochre shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {currentProgram.levelTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentProgram.id} {currentProgram.title} &mdash;{" "}
                {currentProgram.profile}
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {course} {t.course} &middot; {displayDisciplines.length}{" "}
            {t.subjects}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayDisciplines.map((discipline, index) => (
              <li
                key={`${discipline}-${index}`}
                className="flex items-center justify-center min-w-[180px] border-2 border-border/40 bg-card px-4 py-3.5 text-sm font-semibold text-foreground leading-relaxed tracking-wide text-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-bauhaus hover:border-bauhaus-blue/20 animate-in duration-700 slide-in-from-bottom-6 fill-mode-both"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="break-words">{discipline}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
