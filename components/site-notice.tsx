import { Info } from "lucide-react";

interface SiteNoticeProps {
  message: string;
}

export function SiteNotice({ message }: SiteNoticeProps) {
  return (
    <div className="container mx-auto px-4 pt-3">
      <div className="flex items-center gap-2 rounded-lg border border-amber-200/40 bg-amber-50/60 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/30 dark:text-amber-200">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
