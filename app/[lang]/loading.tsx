import { Skeleton } from "@/components/ui/skeleton";

export default function LangLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
      {/* Hero skeleton */}
      <div className="max-w-[700px] space-y-6 mb-16">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-36" />
          <Skeleton className="h-11 w-36" />
        </div>
      </div>

      {/* Section divider */}
      <div className="h-16" />

      {/* Cards grid skeleton */}
      <div className="max-w-[640px] mx-auto space-y-3">
        <Skeleton className="h-6 w-48 mx-auto mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-2 border-border/80 p-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
