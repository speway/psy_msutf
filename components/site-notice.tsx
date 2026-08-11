import { Info } from "lucide-react";

interface SiteNoticeProps {
  message: string;
}

export function SiteNotice({ message }: SiteNoticeProps) {
  return (
    <div className="container mx-auto px-4 pt-3">
      <div className="flex items-center gap-2 rounded-lg border border-bauhaus-ochre/25 bg-bauhaus-ochre/[0.06] px-4 py-2.5 text-sm text-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
