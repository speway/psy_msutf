"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import type { AcademicTimelineEntry } from "@/data";

const BURGUNDY = "#4A1028";

interface InteractiveTimelineProps {
  entries: AcademicTimelineEntry[];
}

export function InteractiveTimeline({ entries }: InteractiveTimelineProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <AnimateOnScroll
      as="section"
      className="border-t border-b border-[#4A1028]/10 py-10 md:py-14"
      direction="up"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-[720px] mx-auto">
          <div className="relative">
            <div
              className="absolute left-[19px] top-0 bottom-0 w-px hidden sm:block"
              style={{ backgroundColor: "rgba(74, 16, 40, 0.15)" }}
            />

            <div className="space-y-0">
              {entries.map((entry, index) => {
                const isOpen = openIndex === index;
                const isLast = index === entries.length - 1;
                return (
                  <div
                    key={`${entry.year}-${index}`}
                    className="relative flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 w-full text-left group"
                      aria-expanded={isOpen}
                      aria-controls={`timeline-entry-${index}`}
                      aria-label={`${entry.title} — ${entry.year}`}
                    >
                      <div className="flex sm:flex-col items-center gap-3 sm:items-end sm:w-20 shrink-0">
                        <span
                          className="inline-flex items-center justify-center sm:w-10 sm:h-10 w-8 h-8 rounded-full text-xs font-bold border-2 shrink-0 transition-all duration-300"
                          style={{
                            borderColor: isOpen
                              ? BURGUNDY
                              : "rgba(74, 16, 40, 0.25)",
                            color: isOpen ? "white" : BURGUNDY,
                            backgroundColor: isOpen ? BURGUNDY : "white",
                          }}
                        >
                          {entry.year}
                        </span>
                        {!isLast && (
                          <div
                            className="sm:hidden h-px flex-1"
                            style={{
                              backgroundColor: "rgba(74, 16, 40, 0.15)",
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-0 sm:pb-0 pt-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3
                            className="text-sm font-bold transition-colors duration-300"
                            style={{
                              color: isOpen
                                ? BURGUNDY
                                : "rgba(74, 16, 40, 0.75)",
                            }}
                          >
                            {entry.title}
                          </h3>
                          <ChevronDown
                            className="h-4 w-4 shrink-0 transition-transform duration-300"
                            style={{
                              color: "rgba(74, 16, 40, 0.35)",
                              transform: isOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </button>

                    <div
                      id={`timeline-entry-${index}`}
                      className={`overflow-hidden transition-all duration-400 ease-in-out ${
                        isOpen
                          ? "max-h-[600px] opacity-100 mt-0"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                      style={{ transitionDuration: "400ms" }}
                    >
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pb-6 sm:pb-8">
                        <div className="hidden sm:block sm:w-20 shrink-0" />
                        <div className="flex-1">
                          <div
                            className="border-l-2 pl-4 sm:pl-6 py-2"
                            style={{
                              borderColor: "rgba(74, 16, 40, 0.15)",
                            }}
                          >
                            <p
                              className="text-xs sm:text-sm leading-relaxed"
                              style={{ color: "rgba(74, 16, 40, 0.65)" }}
                            >
                              {entry.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isLast && (
                      <div
                        className="hidden sm:block ml-[60px] h-px"
                        style={{
                          backgroundColor: "rgba(74, 16, 40, 0.08)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
