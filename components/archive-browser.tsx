"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpDown } from "lucide-react";

interface ArchiveItem {
  title: string;
  description: string;
}

interface ArchiveBrowserProps {
  items: ArchiveItem[];
  hrefs: string[];
  icons: React.ComponentType<{ className?: string }>[];
  label: string;
}

export function ArchiveBrowser({
  items,
  hrefs,
  icons,
  label,
}: ArchiveBrowserProps) {
  const [sortOrder, setSortOrder] = useState<"default" | "az" | "za">(
    "default"
  );

  const sortedItems = useMemo(() => {
    const indexed = items.map((item, i) => ({ item, index: i }));
    if (sortOrder === "az") {
      return indexed.sort((a, b) => a.item.title.localeCompare(b.item.title));
    }
    if (sortOrder === "za") {
      return indexed.sort((a, b) => b.item.title.localeCompare(a.item.title));
    }
    return indexed;
  }, [items, sortOrder]);

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "default" | "az" | "za")
            }
            className="bauhaus-native-select"
            aria-label="Сортировка"
          >
            <option value="default">По умолчанию</option>
            <option value="az">А—Я</option>
            <option value="za">Я—А</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedItems.map(({ item, index }) => {
          const Icon = icons[index] || icons[0];
          return (
            <Link
              key={item.title}
              href={hrefs[index] || "/"}
              className="group block bauhaus-card bauhaus-card-hover p-5"
            >
              <div className="flex items-start gap-4">
                {Icon && (
                  <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-ochre/30 text-bauhaus-ochre shrink-0 group-hover:bg-bauhaus-ochre group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold uppercase tracking-wider group-hover:text-bauhaus-ochre transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-bauhaus-ochre group-hover:gap-2.5 transition-all">
                    {label}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
