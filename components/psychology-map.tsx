import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  LibraryBig,
  Compass,
  GraduationCap,
  Archive,
} from "lucide-react";
import { localizeHref } from "@/lib/i18n";

interface MapNode {
  label: string;
  desc: string;
  href: string;
}
const icons = [BookOpen, LibraryBig, GraduationCap, Compass, Archive];

export function PsychologyMap({
  heading,
  description,
  nodes,
  locale = "ru",
}: {
  heading: string;
  description: string;
  nodes: MapNode[];
  locale?: string;
}) {
  return (
    <nav
      className="knowledge-directory"
      aria-label={heading + ". " + description}
    >
      {nodes.map((node, index) => {
        const Icon = icons[index] ?? BookOpen;
        return (
          <Link
            href={localizeHref(node.href, locale)}
            className="knowledge-entry"
            key={node.href}
          >
            <span className="knowledge-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Icon className="knowledge-icon" aria-hidden="true" />
            <span className="knowledge-copy">
              <strong>{node.label}</strong>
              <span>{node.desc}</span>
            </span>
            <ArrowUpRight className="knowledge-arrow" aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
