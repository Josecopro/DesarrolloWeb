import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Traducción de legacy/assets/css/elements/button.css
const lift = "not-disabled:hover:-translate-y-0.5 not-disabled:hover:shadow-lg";

const variants = {
  primary: cn(
    "bg-primary text-text-inverse border-primary not-disabled:hover:bg-primary-dark not-disabled:hover:border-primary-dark",
    lift,
    "not-disabled:active:translate-y-0 not-disabled:active:shadow-md",
  ),
  secondary: cn("bg-secondary text-text border-secondary not-disabled:hover:bg-secondary-dark not-disabled:hover:border-secondary-dark", lift),
  // .button--outline.button--secondary-style de legacy (section.css)
  "outline-secondary": cn("bg-transparent border-secondary text-secondary not-disabled:hover:bg-secondary not-disabled:hover:text-text", lift),
  // En oscuro, primario sobre el fondo es ilegible (también en legacy): texto y borde claros.
  outline: cn(
    "bg-transparent border-primary text-primary dark:border-text-lighter dark:text-text-light not-disabled:hover:bg-primary not-disabled:hover:border-primary not-disabled:hover:text-text-inverse",
    lift,
  ),
  ghost: "bg-transparent border-transparent text-text not-disabled:hover:bg-bg-hover not-disabled:hover:text-primary",
  danger: cn("bg-error text-text-inverse border-error not-disabled:hover:bg-accent not-disabled:hover:border-accent", lift),
};

const sizes = {
  sm: "gap-1 px-4 py-2 text-xs",
  md: "gap-2 px-6 py-3 text-sm",
  lg: "gap-2 px-8 py-4 text-base",
  xl: "gap-2 px-10 py-5 text-lg",
};

interface StyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  full?: boolean;
}

export function buttonClasses({ variant = "primary", size = "md", full }: StyleProps, className?: string) {
  return cn(
    "inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg border-2 font-semibold leading-normal transition-all duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    full && "w-full",
    className,
  );
}

type ButtonProps = StyleProps & ComponentProps<"button">;

export function Button({ variant, size, full, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, full }, className)} {...props} />;
}

type ButtonLinkProps = StyleProps & ComponentProps<typeof Link>;

export function ButtonLink({ variant, size, full, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, full }, className)} {...props} />;
}
