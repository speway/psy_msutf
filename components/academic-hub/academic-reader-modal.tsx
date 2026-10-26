"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { academicReaderSources } from "@/data/academic-hub";
import type { ReaderSourceItem, ReaderPage } from "@/data/academic-hub";

interface AcademicReaderModalProps {
  sourceKey: string | null;
  initialPage?: number | string;
  onClose: () => void;
}

export function AcademicReaderModal({
  sourceKey,
  initialPage,
  onClose,
}: AcademicReaderModalProps) {
  const source: ReaderSourceItem | null = useMemo(() => {
    if (!sourceKey || !academicReaderSources[sourceKey]) return null;
    return academicReaderSources[sourceKey];
  }, [sourceKey]);

  const [activePageIdx, setActivePageIdx] = useState<number>(() => {
    if (!source) return 0;
    if (initialPage !== undefined) {
      const idx = source.pages.findIndex(
        (p) => String(p.num) === String(initialPage)
      );
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [isSerif, setIsSerif] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setActivePageIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight" && source) {
        setActivePageIdx((prev) => Math.min(source.pages.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [source, onClose]);

  const currentPage: ReaderPage | null = useMemo(() => {
    if (!source || !source.pages.length) return null;
    return source.pages[activePageIdx] || source.pages[0];
  }, [source, activePageIdx]);

  const handleCopyCitation = useCallback(() => {
    if (!source || !currentPage) return;
    const citation = `«${currentPage.text.slice(0, 180)}...» // ${source.author}. ${source.title} (${source.source}, стр. ${currentPage.num}). [Цифровая платформа кафедры психологии ТФ МГУ]`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2200);
    });
  }, [source, currentPage]);

  if (!source) return null;

  const fontClass = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-loose",
    xl: "text-xl leading-loose",
  }[fontSize];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={source.title}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-2 sm:p-4 md:p-6 ${
        isFullscreen ? "p-0" : ""
      }`}
    >
      <div
        className={`relative flex flex-col bg-[#faf8f4] dark:bg-[#1a1424] text-[#30233f] dark:text-[#f2ebf8] border border-[#d9d0df] dark:border-[#4a395b] rounded-2xl shadow-2xl overflow-hidden w-full transition-all duration-200 ${
          isFullscreen
            ? "h-screen w-screen rounded-none border-none"
            : "max-w-4xl max-h-[92vh] h-[850px]"
        }`}
      >
        {/* Top Control Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#f0e8f5] dark:bg-[#251a35] border-b border-[#ded6e2] dark:border-[#3c2c4f] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4b3268] text-white font-serif font-bold text-lg shadow-sm">
              Ψ
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold font-serif text-[#34244f] dark:text-[#f8f4fc] truncate">
                {source.title}
              </h2>
              <p className="text-xs text-[#706577] dark:text-[#bcaec7] truncate">
                {source.author} · {source.source}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Style Toggle */}
            <button
              type="button"
              onClick={() => setIsSerif(!isSerif)}
              title={isSerif ? "Переключить на шрифт без засечек" : "Шрифт с засечками (книжный)"}
              className={`p-2 rounded-lg text-xs font-semibold border transition ${
                isSerif
                  ? "bg-[#4b3268] text-white border-[#4b3268]"
                  : "bg-white dark:bg-[#34244f] text-[#34244f] dark:text-white border-[#d9d0df] dark:border-[#523e69]"
              }`}
            >
              {isSerif ? "Serif" : "Sans"}
            </button>

            {/* Font Size Selector */}
            <div className="flex items-center rounded-lg border border-[#d9d0df] dark:border-[#523e69] bg-white dark:bg-[#34244f] p-0.5">
              {(["sm", "base", "lg"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-1 text-xs font-medium rounded transition ${
                    fontSize === sz
                      ? "bg-[#b83b1c] text-white"
                      : "text-[#706577] dark:text-[#bcaec7] hover:text-[#34244f] dark:hover:text-white"
                  }`}
                >
                  {sz === "sm" ? "A-" : sz === "base" ? "A" : "A+"}
                </button>
              ))}
            </div>

            {/* Copy Citation */}
            <button
              type="button"
              onClick={handleCopyCitation}
              title="Скопировать цитату по ГОСТу"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#34244f] text-[#4b3268] dark:text-[#e0d4ec] border border-[#d9d0df] dark:border-[#523e69] hover:bg-[#ece5f0] transition"
            >
              {copiedQuote ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-600 font-semibold">
                    Скопировано!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Цитата</span>
                </>
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Свернуть" : "На весь экран"}
              className="p-2 rounded-lg bg-white dark:bg-[#34244f] text-[#706577] dark:text-[#bcaec7] border border-[#d9d0df] dark:border-[#523e69] hover:bg-[#ece5f0] transition hidden sm:inline-flex"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title="Закрыть ридер (Esc)"
              className="p-2 rounded-lg bg-[#b83b1c]/10 hover:bg-[#b83b1c] text-[#b83b1c] hover:text-white border border-[#b83b1c]/30 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Search & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#f8f5fa] dark:bg-[#20162e] border-b border-[#ded6e2] dark:border-[#3c2c4f] shrink-0 text-xs text-[#706577] dark:text-[#bcaec7]">
          {/* Page tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-thin">
            <span className="font-semibold text-[#4b3268] dark:text-[#c6b4dc] mr-1">
              Страницы:
            </span>
            {source.pages.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePageIdx(idx)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  activePageIdx === idx
                    ? "bg-[#4b3268] text-white shadow-xs"
                    : "bg-white dark:bg-[#2e2042] text-[#4b3268] dark:text-[#e0d4ec] hover:bg-[#ece5f0] border border-[#d9d0df] dark:border-[#433256]"
                }`}
              >
                стр. {p.num}
              </button>
            ))}
          </div>

          {/* Page Counter & Prev/Next */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              disabled={activePageIdx <= 0}
              onClick={() => setActivePageIdx((p) => Math.max(0, p - 1))}
              className="p-1 rounded bg-white dark:bg-[#2e2042] border border-[#d9d0df] dark:border-[#433256] disabled:opacity-30 hover:bg-[#ece5f0] transition"
              title="Предыдущая страница (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium whitespace-nowrap">
              {activePageIdx + 1} из {source.pages.length}
            </span>
            <button
              type="button"
              disabled={activePageIdx >= source.pages.length - 1}
              onClick={() =>
                setActivePageIdx((p) => Math.min(source.pages.length - 1, p + 1))
              }
              className="p-1 rounded bg-white dark:bg-[#2e2042] border border-[#d9d0df] dark:border-[#433256] disabled:opacity-30 hover:bg-[#ece5f0] transition"
              title="Следующая страница (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reading Canvas */}
        <main
          className={`flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 py-8 ${
            isSerif ? "font-serif" : "font-sans"
          }`}
        >
          {currentPage ? (
            <article className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#ded6e2] dark:border-[#3c2c4f] pb-3 text-xs text-[#706577] dark:text-[#bcaec7] uppercase tracking-wider font-sans">
                <span>{source.category}</span>
                <span>Стр. {currentPage.num}</span>
              </div>

              <div
                className={`${fontClass} text-[#30233f] dark:text-[#f2ebf8] whitespace-pre-wrap select-text selection:bg-[#ff804d] selection:text-white`}
              >
                {currentPage.text}
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 text-[#706577]">
              <BookOpen className="w-12 h-12 stroke-1 mb-2 opacity-50" />
              <p>Текст страницы загружается...</p>
            </div>
          )}
        </main>

        {/* Footer info bar */}
        <footer className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#f0e8f5] dark:bg-[#251a35] border-t border-[#ded6e2] dark:border-[#3c2c4f] shrink-0 text-xs text-[#706577] dark:text-[#bcaec7]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Оцифровано кафедрой психологии ТФ МГУ</span>
          </div>
          <div className="text-right">
            <span>Используйте стрелки клавиатуры [←] и [→] для листания</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
