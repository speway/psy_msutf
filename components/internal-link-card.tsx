import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface InternalLinkCardProps {
  href: string;
  title: string;
  description: string;
  label?: string;
  icon?: LucideIcon;
}

export function InternalLinkCard({
  href,
  title,
  description,
  label = "Подробнее",
  icon: Icon,
}: InternalLinkCardProps) {
  return (
    <Link
      href={href}
      className="group block border-2 border-border/80 bg-background/60 p-5 hover:border-bauhaus-ochre/30 hover:bg-background hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-10 h-10 flex items-center justify-center border border-bauhaus-ochre/30 text-bauhaus-ochre shrink-0 group-hover:bg-bauhaus-ochre group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold uppercase tracking-wider group-hover:text-bauhaus-ochre transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-bauhaus-ochre group-hover:gap-2.5 transition-all">
            {label}
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
