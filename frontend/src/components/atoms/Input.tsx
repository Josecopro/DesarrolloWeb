import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Traducción de legacy/assets/css/elements/input.css
const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
};

interface StyleProps {
  inputSize?: keyof typeof sizes;
  error?: boolean;
}

const inputClasses = ({ inputSize = "md", error }: StyleProps, className?: string) =>
  cn(
    "block w-full rounded-lg border-2 border-border bg-bg-card leading-normal text-text",
    "transition-[border-color,box-shadow,background-color] duration-120",
    "not-disabled:not-read-only:hover:border-text-lighter",
    "focus:border-border-focus focus:bg-bg-card focus:shadow-(--focus-ring) focus:outline-none",
    "disabled:cursor-not-allowed disabled:bg-bg-hover disabled:opacity-70 read-only:cursor-not-allowed read-only:bg-bg-hover read-only:opacity-70",
    error && "border-border-error focus:shadow-[0_0_0_3px_rgba(231,76,60,0.25)]",
    sizes[inputSize],
    className,
  );

export function Input({ inputSize, error, className, ...props }: StyleProps & ComponentProps<"input">) {
  return <input aria-invalid={error || undefined} className={inputClasses({ inputSize, error }, className)} {...props} />;
}

export function Textarea({ inputSize, error, className, ...props }: StyleProps & ComponentProps<"textarea">) {
  return (
    <textarea
      aria-invalid={error || undefined}
      className={inputClasses({ inputSize, error }, cn("min-h-[140px] resize-y font-[inherit]", className))}
      {...props}
    />
  );
}
