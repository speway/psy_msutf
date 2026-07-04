"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ListChecks,
  ExternalLink,
  Target,
  Check,
} from "lucide-react";
import { roadmapStepsRu } from "@/data/roadmap";
import type { RoadmapStep } from "@/data/roadmap";
import type { RoadmapUITranslation } from "@/data/i18n";

const STORAGE_KEY = "roadmap-completed";

interface RoadmapProps {
  t: RoadmapUITranslation;
  steps?: RoadmapStep[];
}

export function Roadmap({ t, steps }: RoadmapProps) {
  const stepList = steps ?? roadmapStepsRu;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompleted(new Set(JSON.parse(raw)));
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  const toggleStep = (step: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const toggleExpanded = (step: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      return next;
    });
  };

  const allDone = mounted && completed.size === stepList.length;
  const doneCount = mounted ? completed.size : 0;

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/72 hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
          {t.backToHome}
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-bauhaus-blue/30 text-bauhaus-blue bg-bauhaus-blue/5">
            {t.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tighter uppercase">
            {t.heading}
            <br />
            {t.headingLine2}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg leading-relaxed">
            {t.description}
          </p>
          {mounted && (
            <div className="flex items-center gap-3 mt-4">
              <div className="h-2 flex-1 max-w-xs bg-bauhaus-blue/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-bauhaus-ochre transition-all duration-500"
                  style={{
                    width: `${(doneCount / stepList.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {doneCount}/{stepList.length}
              </span>
            </div>
          )}
        </div>

        <div className="relative space-y-6">
          {/* Vertical timeline line — desktop only */}
          <div
            className="absolute left-5 top-0 bottom-0 w-0.5 bg-bauhaus-blue/10 -z-10 hidden sm:block"
            aria-hidden="true"
          />

          {stepList.map((item) => {
            const stepKey = String(item.step).padStart(2, "0");
            const isCompleted = mounted && completed.has(stepKey);
            const isExpanded = expanded.has(stepKey);
            return (
              <div
                key={stepKey}
                className={`relative border-2 transition-all duration-300 ${
                  isCompleted
                    ? "border-bauhaus-ochre/20 bg-bauhaus-ochre/[0.02]"
                    : "border-bauhaus-blue/10 bg-transparent"
                }`}
              >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  <button
                    type="button"
                    onClick={() => toggleStep(stepKey)}
                    className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? "border-bauhaus-ochre bg-bauhaus-ochre text-white"
                        : "border-bauhaus-blue/30 bg-background text-bauhaus-blue hover:border-bauhaus-blue/60"
                    }`}
                    aria-label={
                      isCompleted
                        ? `Отметить шаг "${item.title}" как невыполненный`
                        : `Отметить шаг "${item.title}" как выполненный`
                    }
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepKey}
                  </button>

                  <div
                    className={`flex-1 min-w-0 transition-opacity duration-300 ${
                      isCompleted ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                            isCompleted
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleStep(stepKey)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors rounded-sm min-h-[44px] ${
                            isCompleted
                              ? "border-bauhaus-ochre/40 text-bauhaus-ochre bg-bauhaus-ochre/5 hover:bg-bauhaus-ochre/10"
                              : "border-bauhaus-blue/20 text-bauhaus-blue hover:bg-bauhaus-blue hover:text-white"
                          }`}
                        >
                          {isCompleted ? t.done : t.mark}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleExpanded(stepKey)}
                          className="sm:hidden inline-flex items-center justify-center w-9 h-9 border border-border/60 rounded text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Подробнее"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div
                      className={`mt-4 pt-4 border-t sm:block ${
                        isExpanded ? "block" : "hidden"
                      } ${
                        isCompleted
                          ? "border-bauhaus-ochre/10"
                          : "border-bauhaus-blue/10"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <ListChecks className="w-3.5 h-3.5 text-bauhaus-blue/60" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-bauhaus-blue/60">
                              {t.actions}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {item.actions.map((action, ai) => (
                              <li
                                key={ai}
                                className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5"
                              >
                                <span className="mt-0.5 block w-1 h-1 rounded-full bg-bauhaus-blue/30 shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <ExternalLink className="w-3.5 h-3.5 text-bauhaus-ochre/70" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-bauhaus-ochre/70">
                              {t.links}
                            </span>
                          </div>
                          <ul className="space-y-1.5">
                            {item.links.map((link, li) => (
                              <li key={li}>
                                <Link
                                  href={link.url}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-bauhaus-blue hover:text-bauhaus-ochre transition-colors"
                                >
                                  <ArrowRight className="w-2.5 h-2.5" />
                                  {link.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Target className="w-3.5 h-3.5 text-bauhaus-blue/60" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-bauhaus-blue/60">
                              {t.result}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {item.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {allDone && (
          <div className="mt-8 border-2 border-bauhaus-ochre/30 bg-bauhaus-ochre/[0.03] p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-12 h-12 rounded-full border-2 border-bauhaus-ochre flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-bauhaus-ochre" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-bauhaus-ochre">
              {t.completed}
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
              Вы отметили все семь шагов на пути студента в науку. Продолжайте
              исследовать и открывать новое!
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => {
              setCompleted(new Set());
              try {
                localStorage.removeItem(STORAGE_KEY);
              } catch {
                /* ignore */
              }
            }}
            className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/72 hover:text-muted-foreground transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
