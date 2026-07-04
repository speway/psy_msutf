"use client";

import { useState, useMemo, useCallback, useId } from "react";
import {
  Search,
  Shuffle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  glossaryTerms,
  glossaryCollections,
  CATEGORIES,
  ALPHABET,
} from "@/data/glossary";
import type { GlossaryTerm } from "@/data/glossary";
import type { GlossaryUITranslation } from "@/data/i18n";

interface GlossaryClientProps {
  t: GlossaryUITranslation;
}

function getTermOfDay(): GlossaryTerm {
  const index = new Date().getDate() % glossaryTerms.length;
  return glossaryTerms[index];
}

function getRandomTerm(): GlossaryTerm {
  const index = Math.floor(Math.random() * glossaryTerms.length);
  return glossaryTerms[index];
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="rounded-sm px-0.5 bg-bauhaus-ochre/25 text-inherit"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function GlossaryClient({ t }: GlossaryClientProps) {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [showTermOfDay, setShowTermOfDay] = useState(true);
  const [randomTerm, setRandomTerm] = useState<GlossaryTerm | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<string[]>([]);
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const searchId = useId();

  const termOfDay = useMemo(() => getTermOfDay(), []);
  const toggleCategory = useCallback((cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const toggleCollectionExpanded = useCallback((id: string) => {
    setExpandedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }, []);

  const handleRandomClick = useCallback(() => {
    setRandomTerm(getRandomTerm());
    setQuery("");
    setActiveLetter(null);
    setActiveCategories([]);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const showMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const clearAllFilters = useCallback(() => {
    setQuery("");
    setActiveLetter(null);
    setActiveCategories([]);
    setSortAlphabetical(false);
    setRandomTerm(null);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const filteredTerms = useMemo(() => {
    let terms = glossaryTerms;

    if (randomTerm) return [randomTerm];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      terms = terms.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.shortDefinition.toLowerCase().includes(q) ||
          t.usefulFor.some((u) => u.toLowerCase().includes(q)) ||
          t.categories.some((c) => c.toLowerCase().includes(q)) ||
          t.related.some((r) => r.toLowerCase().includes(q))
      );
    }

    if (activeLetter) {
      terms = terms.filter((t) => t.title.startsWith(activeLetter));
    }

    if (activeCategories.length > 0) {
      terms = terms.filter((t) =>
        activeCategories.some((cat) => t.categories.includes(cat))
      );
    }

    if (sortAlphabetical) {
      terms = [...terms].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    }

    return terms;
  }, [query, activeLetter, activeCategories, sortAlphabetical, randomTerm]);

  const displayTerms = useMemo(
    () => (randomTerm ? filteredTerms : filteredTerms.slice(0, visibleCount)),
    [filteredTerms, visibleCount, randomTerm]
  );

  const hasActiveFilters =
    query.trim() ||
    activeLetter ||
    activeCategories.length > 0 ||
    sortAlphabetical;

  return (
    <>
      {/* Term of the day banner */}
      {showTermOfDay && (
        <div className="max-w-[720px] mx-auto mb-8 border-2 border-bauhaus-ochre/30 bg-bauhaus-ochre/[0.03] p-4 sm:p-5 relative">
          <button
            onClick={() => setShowTermOfDay(false)}
            className="absolute top-2 right-2 text-muted-foreground/72 hover:text-muted-foreground transition-colors"
            aria-label={t.termOfDay}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full border-2 border-bauhaus-ochre/30 shrink-0 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-bauhaus-ochre" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-bauhaus-ochre">
                  {t.termOfDay}
                </span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-bauhaus-blue">
                {termOfDay.title}
              </h3>
              <div className="h-px w-8 bg-bauhaus-ochre/30 my-2" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {termOfDay.shortDefinition}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search - full width, 16px font */}
      <div className="mx-auto mb-6">
        <label htmlFor={searchId} className="sr-only">
          {t.searchLabel}
        </label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-bauhaus-blue/35"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setRandomTerm(null);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 text-base border-2 outline-none transition-colors border-bauhaus-blue/15 focus:border-bauhaus-blue/40 bg-bauhaus-blue/[0.02] text-bauhaus-blue placeholder:text-bauhaus-blue/30"
            aria-label={t.searchLabel}
          />
        </div>
      </div>

      {/* Alphabet filter - horizontal scroll */}
      <div
        className="mx-auto mb-4 overflow-x-auto scrollbar-none pb-2"
        role="group"
        aria-label={t.alphabetFilter}
      >
        <div className="flex gap-1 min-w-max">
          <button
            onClick={() => {
              setActiveLetter(null);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            aria-pressed={!activeLetter}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border transition-colors shrink-0 min-h-[44px] ${
              !activeLetter
                ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
                : "border-bauhaus-blue/20 text-bauhaus-blue/60 hover:border-bauhaus-blue/40 hover:text-bauhaus-blue bg-transparent"
            }`}
          >
            {t.all}
          </button>
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                setActiveLetter(activeLetter === letter ? null : letter);
                setRandomTerm(null);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              aria-pressed={activeLetter === letter}
              className={`w-7 h-7 text-[11px] font-bold border transition-colors shrink-0 ${
                activeLetter === letter
                  ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
                  : "border-bauhaus-blue/20 text-bauhaus-blue/60 hover:border-bauhaus-blue/40 hover:text-bauhaus-blue bg-transparent"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Category filters - collapsible */}
      <div className="mx-auto mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-pressed={showFilters}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors min-h-[44px] flex items-center gap-1.5 ${
              showFilters
                ? "bg-bauhaus-blue text-white border-bauhaus-blue"
                : "border-bauhaus-blue/15 text-bauhaus-blue/50 hover:border-bauhaus-blue/30 hover:text-bauhaus-blue bg-transparent"
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
            {t.filtersLabel}
            {activeCategories.length > 0 && (
              <span className="ml-0.5 text-[10px] opacity-70">
                ({activeCategories.length})
              </span>
            )}
            {showFilters ? (
              <ChevronUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
          <button
            onClick={() => {
              setSortAlphabetical(!sortAlphabetical);
              setRandomTerm(null);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            aria-pressed={sortAlphabetical}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors min-h-[44px] ${
              sortAlphabetical
                ? "bg-bauhaus-blue text-white border-bauhaus-blue shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
                : "border-bauhaus-blue/15 text-bauhaus-blue/50 hover:border-bauhaus-blue/30 hover:text-bauhaus-blue"
            }`}
          >
            {t.sort}
          </button>
          <button
            onClick={handleRandomClick}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-bauhaus-ochre/30 text-bauhaus-ochre hover:bg-bauhaus-ochre/5 transition-colors flex items-center gap-1 min-h-[44px]"
          >
            <Shuffle className="h-2.5 w-2.5" aria-hidden="true" />
            {t.random}
          </button>
        </div>
        {showFilters && (
          <div
            className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-bauhaus-blue/10 animate-in fade-in slide-in-from-top-2 duration-200"
            role="group"
            aria-label={t.categoryFilter}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  toggleCategory(cat);
                  setRandomTerm(null);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                aria-pressed={activeCategories.includes(cat)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors min-h-[44px] ${
                  activeCategories.includes(cat)
                    ? "bg-bauhaus-ochre text-white border-bauhaus-ochre shadow-[0_0_0_2px_rgba(180,130,50,0.3)]"
                    : "border-bauhaus-blue/15 text-bauhaus-blue/50 hover:border-bauhaus-blue/30 hover:text-bauhaus-blue bg-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter state info */}
      {hasActiveFilters && (
        <div className="mx-auto mb-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredTerms.length === 0
              ? t.nothingFound
              : t.foundCount
                  .replace("{found}", String(filteredTerms.length))
                  .replace("{total}", String(glossaryTerms.length))}
          </p>
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-bold uppercase tracking-wider text-bauhaus-ochre hover:underline flex items-center gap-1"
          >
            <RotateCcw className="h-2.5 w-2.5" aria-hidden="true" />
            {t.resetFilters}
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredTerms.length === 0 && hasActiveFilters && (
        <div className="mx-auto text-center py-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-bauhaus-blue/15 bg-bauhaus-blue/[0.03] mb-4">
            <Search className="h-5 w-5 text-bauhaus-blue/30" />
          </div>
          <p className="text-sm font-medium text-bauhaus-blue/50">
            {t.nothingFound}
          </p>
          <p className="text-xs mt-1 text-bauhaus-blue/35">{t.tryChanging}</p>
        </div>
      )}

      {/* Terms cards - single column */}
      {filteredTerms.length > 0 && (
        <div className="mx-auto">
          {randomTerm && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-bauhaus-ochre mb-3">
              {t.randomTermLabel}
            </p>
          )}
          <div className="space-y-3">
            {displayTerms.map((item) => (
              <div
                key={item.title}
                className="bauhaus-card bauhaus-card-hover p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-bauhaus-blue">
                    {query ? highlightText(item.title, query) : item.title}
                  </h3>
                </div>
                <div className="h-px w-10 bg-bauhaus-blue/15 my-2" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {query
                    ? highlightText(item.shortDefinition, query)
                    : item.shortDefinition}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {item.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-bauhaus-blue/15 text-bauhaus-blue/50"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                {/* Related terms - compact */}
                {item.related.length > 0 && (
                  <details className="group mt-2 pt-2 border-t border-bauhaus-blue/5">
                    <summary className="text-[10px] font-bold uppercase tracking-wider text-bauhaus-blue/40 cursor-pointer list-none flex items-center gap-1 hover:text-bauhaus-blue/60 transition-colors">
                      <ChevronDown
                        className="h-3 w-3 transition-transform group-open:rotate-180 shrink-0"
                        aria-hidden="true"
                      />
                      {t.relatedLabel}
                      <span className="text-bauhaus-blue/30 font-normal">
                        ({item.related.length})
                      </span>
                    </summary>
                    <div className="flex flex-wrap gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      {item.related.map((rel) => (
                        <span
                          key={rel}
                          className="text-[11px] text-bauhaus-blue/40 border border-bauhaus-blue/10 px-1.5 py-0.5"
                        >
                          {rel}
                        </span>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>

          {/* Show more */}
          {!randomTerm && visibleCount < filteredTerms.length && (
            <div className="text-center mt-6">
              <button
                onClick={showMore}
                className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider border-2 border-bauhaus-blue/20 text-bauhaus-blue hover:border-bauhaus-blue/40 hover:bg-bauhaus-blue/5 transition-colors"
              >
                {t.showMore}
                <span className="ml-1.5 text-bauhaus-blue/40">
                  ({filteredTerms.length - visibleCount})
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Collections - below results */}
      <div className="mx-auto mt-16 border-t-2 border-bauhaus-blue/10 pt-8">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mb-1 text-center text-bauhaus-blue">
          {t.collections}
        </h2>
        <p className="text-xs text-muted-foreground text-center mb-6">
          {t.collectionsDesc}
        </p>

        <div className="space-y-3">
          {glossaryCollections.map((collection) => {
            const isExpanded = expandedCollections.includes(collection.id);
            const colKey = collection.id.replace(/-([a-z])/g, (_, c) =>
              c.toUpperCase()
            );
            const colTitleKey =
              `col${colKey.charAt(0).toUpperCase()}${colKey.slice(1)}` as keyof GlossaryUITranslation;
            const colDescKey =
              `${colTitleKey}Desc` as keyof GlossaryUITranslation;
            const title = t[colTitleKey] as string;
            const description = t[colDescKey] as string;
            return (
              <div
                key={collection.id}
                className="bauhaus-card bauhaus-card-hover p-4"
              >
                <button
                  onClick={() => toggleCollectionExpanded(collection.id)}
                  className="w-full flex items-center justify-between text-left"
                  aria-expanded={isExpanded}
                >
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-bauhaus-blue">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp
                      className="h-4 w-4 text-bauhaus-blue/30 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDown
                      className="h-4 w-4 text-bauhaus-blue/30 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-bauhaus-blue/10">
                    <ul className="space-y-1">
                      {collection.terms.map((termTitle) => {
                        const term = glossaryTerms.find(
                          (t) => t.title === termTitle
                        );
                        return (
                          <li key={termTitle}>
                            <button
                              onClick={() => {
                                setQuery(termTitle);
                                setActiveLetter(null);
                                setActiveCategories([]);
                                setRandomTerm(null);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-xs text-left text-bauhaus-blue/70 hover:text-bauhaus-blue underline-offset-2 hover:underline transition-colors"
                            >
                              {termTitle}
                            </button>
                            {term && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                                {term.shortDefinition}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
