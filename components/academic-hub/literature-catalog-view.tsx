"use client";

import { useState, useMemo } from "react";
import {
  Search,
  FileText,
} from "lucide-react";
import { academicLiteratureCatalog } from "@/data/academic-hub";

interface LiteratureCatalogViewProps {
  onOpenReader: (sourceKey: string) => void;
}

const CATEGORIES = [
  "Все",
  "Мотивация",
  "Эмоции",
  "Психодинамика",
  "Позитивная психология",
  "Социализация",
  "Методология",
] as const;

export function LiteratureCatalogView({
  onOpenReader,
}: LiteratureCatalogViewProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const filteredItems = useMemo(() => {
    return academicLiteratureCatalog.filter((item) => {
      const matchCat =
        selectedCategory === "Все" || item.category === selectedCategory;
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        (item.annotation && item.annotation.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [query, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#fffefa] dark:bg-[#1f172a] border border-[#d9d0df] dark:border-[#433256] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706577]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по автору, названию книги или хрестоматии..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#faf8f4] dark:bg-[#251a35] border border-[#ded6e2] dark:border-[#3c2c4f] text-[#30233f] dark:text-[#f2ebf8] focus:outline-none focus:ring-2 focus:ring-[#8950bb]"
          />
        </div>

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-2 rounded-xl text-xs font-semibold text-[#706577] hover:text-[#30233f] border border-[#ded6e2] dark:border-[#3c2c4f]"
          >
            Сброс
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat
                ? "bg-[#4b3268] text-white shadow-xs"
                : "bg-[#fffefa] dark:bg-[#1f172a] text-[#706577] dark:text-[#bcaec7] hover:bg-[#ece5f0] border border-[#d9d0df] dark:border-[#433256]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-[#fffefa] dark:bg-[#1f172a] border border-[#d9d0df] dark:border-[#433256] hover:border-[#b83b1c]/50 transition space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#b83b1c] uppercase tracking-wider">
                  {item.category} · {item.year}
                </span>
                {item.isPdfAvailable && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Оцифровано в ридере
                  </span>
                )}
              </div>

              <h4 className="text-base font-serif font-bold text-[#30233f] dark:text-[#f2ebf8]">
                {item.title}
              </h4>

              <p className="text-xs font-semibold text-[#4b3268] dark:text-[#c6b4dc]">
                {item.author}
              </p>

              <p className="text-xs text-[#706577] dark:text-[#bcaec7] line-clamp-2 leading-relaxed">
                {item.source}
              </p>

              {item.annotation && (
                <p className="text-xs text-[#30233f]/80 dark:text-[#f2ebf8]/80 italic pt-1 border-t border-[#ded6e2] dark:border-[#3c2c4f]">
                  {item.annotation}
                </p>
              )}
            </div>

            <div className="pt-2">
              {item.readerKey ? (
                <button
                  type="button"
                  onClick={() => onOpenReader(item.readerKey!)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#4b3268] hover:bg-[#34244f] text-white text-xs font-semibold shadow-xs transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Открыть страницы в полноэкранном ридере</span>
                </button>
              ) : (
                <div className="text-center py-1.5 text-xs text-[#706577] dark:text-[#bcaec7]">
                  Доступно на кафедре и в библиотеке филиала
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
