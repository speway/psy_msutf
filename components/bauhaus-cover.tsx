import {
  BookOpen,
  FlaskConical,
  Megaphone,
  GraduationCap,
  CalendarDays,
  Users,
  Lightbulb,
  Flag,
} from "lucide-react";

interface BauhausCoverProps {
  cleanTitle: string;
  rubric?: string;
  coverTitle?: string;
}
const symbols: Record<string, { Icon: typeof BookOpen; mark: string }> = {
  Анонсы: { Icon: Megaphone, mark: "↗" },
  "Научная деятельность": { Icon: FlaskConical, mark: "Ψ" },
  "Учебные материалы": { Icon: GraduationCap, mark: "Aa" },
  Психопросвещение: { Icon: Lightbulb, mark: "?" },
  Возможности: { Icon: Flag, mark: "↗" },
  Итоги: { Icon: BookOpen, mark: "∑" },
  "Памятные даты": { Icon: CalendarDays, mark: "¶" },
  "О секторе": { Icon: Users, mark: "Ψ" },
};

export function BauhausCover({ rubric }: BauhausCoverProps) {
  const { Icon, mark } = symbols[rubric ?? ""] ?? { Icon: BookOpen, mark: "Ψ" };
  return (
    <div className="post-cover" aria-hidden="true">
      <div className="post-cover-top">{rubric || "Психология"}</div>
      <div className="post-cover-bottom">
        <Icon />
        <span>{mark}</span>
      </div>
    </div>
  );
}
