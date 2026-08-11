"use client";

interface AnimateOnScrollProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "span";
  direction?: "up" | "down" | "left" | "right";
  scale?: boolean;
  duration?: number;
  id?: string;
}

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  direction = "up",
  scale = false,
  duration = 1000,
  id,
}: AnimateOnScrollProps) {
  return (
    <Tag
      id={id}
      className={`section-reveal ${className}`}
      data-reveal-direction={direction}
      data-reveal-scale={scale ? "true" : undefined}
      style={
        {
          "--reveal-duration": `${duration}ms`,
          "--reveal-delay": `${delay}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
