import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-[750] tracking-[0.02em] whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary bg-primary text-primary-foreground shadow-none transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-bauhaus active:translate-x-0 active:translate-y-0 active:shadow-none",
        outline:
          "border-2 border-foreground bg-transparent text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-secondary hover:bg-secondary/60 aria-expanded:bg-secondary/60",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground shadow-none",
        link: "text-foreground underline-offset-4 underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 aria-expanded:bg-destructive/80",
      },
      size: {
        default: "h-10 px-4",
        xs: "h-7 rounded px-2 text-xs",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
