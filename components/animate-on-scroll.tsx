"use client";

import { useEffect, useRef, useState } from "react";

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

const directionVariants: Record<string, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
};

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
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = directionVariants[direction] || directionVariants.up;
  const scaleClass = scale ? "scale-95" : "";

  return (
    <Tag
      id={id}
      ref={ref}
      className={`${
        isVisible
          ? "animate-in fade-in fill-mode-forwards"
          : `opacity-0 ${translate} ${scaleClass}`
      } ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationTimingFunction: "cubic-bezier(0.12, 0.8, 0.3, 1)",
        animationFillMode: "forwards",
        transition: "none",
      }}
    >
      {children}
    </Tag>
  );
}
