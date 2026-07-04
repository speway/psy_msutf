function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

interface BauhausCoverProps {
  cleanTitle: string;
  rubric?: string;
  coverTitle?: string;
}

const RUBRIC_COLORS: Record<
  string,
  { bg: string; accent: string; shape: string; text: string }
> = {
  Анонсы: {
    bg: "from-bauhaus-deepblue/15 via-bauhaus-deepblue/5 to-bauhaus-milky/20",
    accent: "border-bauhaus-milky/30",
    shape: "bg-bauhaus-deepblue/10",
    text: "text-bauhaus-deepblue",
  },
  "Научная деятельность": {
    bg: "from-bauhaus-purple/15 via-bauhaus-purple/5 to-bauhaus-gold/10",
    accent: "border-bauhaus-gold/25",
    shape: "bg-bauhaus-purple/10",
    text: "text-bauhaus-purple",
  },
  "Учебные материалы": {
    bg: "from-bauhaus-emerald/15 via-bauhaus-emerald/5 to-bauhaus-gold/10",
    accent: "border-bauhaus-gold/25",
    shape: "bg-bauhaus-emerald/10",
    text: "text-bauhaus-emerald",
  },
  Психопросвещение: {
    bg: "from-bauhaus-terracotta/15 via-bauhaus-terracotta/5 to-bauhaus-milky/20",
    accent: "border-bauhaus-milky/30",
    shape: "bg-bauhaus-terracotta/10",
    text: "text-bauhaus-terracotta",
  },
  Возможности: {
    bg: "from-bauhaus-indigo/15 via-bauhaus-indigo/5 to-bauhaus-gold/10",
    accent: "border-bauhaus-gold/25",
    shape: "bg-bauhaus-indigo/10",
    text: "text-bauhaus-indigo",
  },
  Итоги: {
    bg: "from-bauhaus-graphite/15 via-bauhaus-graphite/5 to-bauhaus-gold/10",
    accent: "border-bauhaus-gold/25",
    shape: "bg-bauhaus-graphite/10",
    text: "text-bauhaus-graphite",
  },
  "Памятные даты": {
    bg: "from-bauhaus-burgundy/15 via-bauhaus-burgundy/5 to-bauhaus-milky/20",
    accent: "border-bauhaus-milky/30",
    shape: "bg-bauhaus-burgundy/10",
    text: "text-bauhaus-burgundy",
  },
  "О секторе": {
    bg: "from-bauhaus-milky/20 via-bauhaus-milky/10 to-bauhaus-burgundy/10",
    accent: "border-bauhaus-burgundy/20",
    shape: "bg-bauhaus-milky/15",
    text: "text-bauhaus-burgundy",
  },
};

const DEFAULT_COLORS = {
  bg: "from-bauhaus-burgundy/10 via-transparent to-bauhaus-gold/15",
  accent: "border-bauhaus-burgundy/20",
  shape: "bg-bauhaus-burgundy/8",
  text: "text-bauhaus-burgundy",
};

const SHAPE_CONFIGS = [
  { type: "circle", w: 70, h: 70, cls: "rounded-full border-2" },
  { type: "square", w: 55, h: 55, cls: "border-2" },
  { type: "circle-filled", w: 40, h: 40, cls: "rounded-full" },
  { type: "square-filled", w: 45, h: 45, cls: "" },
  { type: "diamond", w: 40, h: 40, cls: "border-2 rotate-45" },
  { type: "circle-sm", w: 25, h: 25, cls: "rounded-full border-2" },
];

const POSITIONS = [
  { top: "8%", left: "6%" },
  { top: "58%", left: "74%" },
  { top: "22%", left: "68%" },
  { top: "74%", left: "10%" },
  { top: "10%", left: "80%" },
  { top: "80%", left: "70%" },
  { top: "38%", left: "8%" },
  { top: "12%", left: "38%" },
  { top: "70%", left: "40%" },
  { top: "45%", left: "80%" },
];

export function BauhausCover({
  cleanTitle,
  rubric,
  coverTitle,
}: BauhausCoverProps) {
  const colors = rubric
    ? RUBRIC_COLORS[rubric] || DEFAULT_COLORS
    : DEFAULT_COLORS;
  const h = hashStr(cleanTitle);
  const shape1 = SHAPE_CONFIGS[h % SHAPE_CONFIGS.length];
  const shape2 = SHAPE_CONFIGS[(h + 2) % SHAPE_CONFIGS.length];
  const shape3 = SHAPE_CONFIGS[(h + 5) % SHAPE_CONFIGS.length];
  const shape4 = SHAPE_CONFIGS[(h + 7) % SHAPE_CONFIGS.length];
  const p1 = POSITIONS[h % POSITIONS.length];
  const p2 = POSITIONS[(h + 3) % POSITIONS.length];
  const p3 = POSITIONS[(h + 6) % POSITIONS.length];
  const p4 = POSITIONS[(h + 9) % POSITIONS.length];

  const displayTitle = coverTitle || cleanTitle;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />

      {rubric && (
        <div
          className={`absolute top-3 left-3 text-[8px] font-bold uppercase tracking-[0.15em] opacity-40 ${colors.text}`}
        >
          {rubric}
        </div>
      )}

      <div
        className={`absolute ${shape1.cls} ${colors.accent}`}
        style={{
          top: p1.top,
          left: p1.left,
          width: shape1.w,
          height: shape1.h,
        }}
      />
      <div
        className={`absolute ${shape2.cls} ${colors.accent}`}
        style={{
          top: p2.top,
          left: p2.left,
          width: shape2.w,
          height: shape2.h,
        }}
      />
      <div
        className={`absolute ${shape3.cls} ${colors.shape} opacity-40`}
        style={{
          top: p3.top,
          left: p3.left,
          width: shape3.w,
          height: shape3.h,
        }}
      />
      <div
        className={`absolute ${shape4.cls} ${colors.shape} opacity-30`}
        style={{
          top: p4.top,
          left: p4.left,
          width: shape4.w,
          height: shape4.h,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 text-center">
        <div className="max-w-[90%]">
          <h3
            className={`text-lg font-bold leading-snug line-clamp-2 ${colors.text}`}
          >
            {displayTitle}
          </h3>
          <div
            className={`mt-4 mx-auto w-16 h-0.5 opacity-40 ${colors.text}`}
          />
        </div>
      </div>
    </div>
  );
}
