import Link from "next/link";

interface MapNode {
  label: string;
  desc: string;
  href: string;
}

interface PsychologyMapProps {
  heading: string;
  description: string;
  nodes: MapNode[];
  locale?: string;
}

function localizeHref(href: string, locale?: string): string {
  if (!locale) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href;
  if (href.startsWith("/")) return `/${locale}${href === "/" ? "" : href}`;
  return href;
}

const CIRCLE_POSITIONS = [
  { dx: 0, dy: -220 },
  { dx: 209, dy: -68 },
  { dx: 129, dy: 178 },
  { dx: -129, dy: 178 },
  { dx: -209, dy: -68 },
];

const SVG_LINES = [
  { x1: 300, y1: 300, x2: 300, y2: 120 },
  { x1: 300, y1: 300, x2: 437, y2: 272 },
  { x1: 300, y1: 300, x2: 357, y2: 438 },
  { x1: 300, y1: 300, x2: 243, y2: 438 },
  { x1: 300, y1: 300, x2: 163, y2: 272 },
];

const BAUHAUS_COLORS = [
  { hex: "#4a1028" },
  { hex: "#2c7a7b" },
  { hex: "#276749" },
  { hex: "#553c9a" },
  { hex: "#9b2c2c" },
];

export function PsychologyMap({
  heading,
  description,
  nodes,
  locale,
}: PsychologyMapProps) {
  return (
    <section className="psychology-map-section relative border-b-2 border-bauhaus-blue/10 bg-gradient-to-t from-bauhaus-blue/[0.02] to-transparent">
      <div className="container mx-auto px-4 py-10 sm:py-20 scroll-mt-[72px] lg:scroll-mt-24">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-bauhaus-blue">
              {heading}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground/72 mt-2">
              {description}
            </p>
            <div className="mx-auto mt-3 sm:mt-4 h-px w-16 sm:w-20 bg-bauhaus-ochre/30" />
          </div>

          {/* Desktop: circular scheme */}
          <div
            className="hidden md:flex items-center justify-center relative w-full max-w-[600px] mx-auto"
            style={{ height: 600 }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 animate-in fade-in duration-700 fill-mode-both"
              viewBox="0 0 600 600"
              aria-hidden="true"
            >
              {SVG_LINES.map((line, i) => (
                <line
                  key={i}
                  data-map-index={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={BAUHAUS_COLORS[i].hex}
                  strokeOpacity={0.35}
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  className="map-line animate-in fade-in duration-700 fill-mode-both transition-all duration-300"
                  style={{ animationDelay: `${300 + i * 120}ms` }}
                />
              ))}
            </svg>

            {/* Central Ψ */}
            <div
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              aria-hidden="true"
            >
              <div className="w-32 h-32 border-[3px] border-bauhaus-ochre/20 rounded-full flex items-center justify-center bg-background/80 shadow-sm animate-in fade-in zoom-in-50 duration-700 fill-mode-both">
                <div className="w-24 h-24 border-2 border-bauhaus-ochre/15 rounded-full flex items-center justify-center">
                  <span className="text-5xl font-black text-bauhaus-ochre/70">
                    Ψ
                  </span>
                </div>
              </div>
            </div>

            {/* 5 nodes around */}
            {nodes.map((node, i) => {
              const pos = CIRCLE_POSITIONS[i];
              const color = BAUHAUS_COLORS[i];

              return (
                <div
                  key={node.label}
                  data-map-index={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${pos.dx}px), calc(-50% + ${pos.dy}px))`,
                  }}
                >
                  <div
                    className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                    style={{ animationDelay: `${150 + i * 120}ms` }}
                  >
                    <Link
                      href={localizeHref(node.href, locale)}
                      className="map-node group relative z-10 block"
                      tabIndex={0}
                    >
                      <div
                        className="w-40 min-h-[88px] border-2 flex items-center justify-center p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-bauhaus group-focus-visible:scale-110 group-focus-visible:shadow-bauhaus"
                        style={{
                          borderColor: `${color.hex}40`,
                          backgroundColor: `${color.hex}0D`,
                        }}
                      >
                        <span className="text-sm font-bold uppercase tracking-wider text-center transition-colors duration-300 group-hover:text-bauhaus-ochre">
                          {node.label}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: cards in one column */}
          <div className="md:hidden space-y-3">
            {nodes.map((node, i) => {
              const color = BAUHAUS_COLORS[i];
              return (
                <Link
                  key={node.label}
                  href={localizeHref(node.href, locale)}
                  className="flex flex-col justify-center gap-1 bauhaus-card bauhaus-card-hover px-4 py-3 min-h-[72px]"
                  style={{
                    borderLeftColor: `${color.hex}60`,
                    borderLeftWidth: 3,
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 shrink-0"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-sm font-bold uppercase tracking-wider leading-none"
                      style={{ color: color.hex }}
                    >
                      {node.label}
                    </span>
                  </span>
                  {node.desc && (
                    <span className="text-xs text-muted-foreground/72 leading-relaxed ml-[22px]">
                      {node.desc}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
