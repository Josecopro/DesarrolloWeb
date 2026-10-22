import type { ComponentProps } from "react";
import { cn } from "@/features/common/lib/cn";

// Traducción de legacy/assets/css/elements/tag.css
const variants = {
  primary: "border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-secondary-light",
  secondary:
    "border border-secondary/20 bg-secondary/15 text-secondary-ink dark:border-secondary/30 dark:bg-secondary/20 dark:text-secondary-light",
  success: "border border-success/20 bg-success/10 text-success-ink",
  outline: "border border-border bg-transparent text-text-light hover:border-text-lighter hover:bg-bg-hover",
};

const sizes = {
  xs: "px-2 py-1 text-xs", // .career-grid__tag
  sm: "px-2 py-0.5 text-[0.6875rem]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-2 text-sm",
};

interface TagProps extends ComponentProps<"span"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Tag({ variant = "primary", size = "md", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full font-semibold leading-none transition-all duration-120",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
