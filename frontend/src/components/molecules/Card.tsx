import Image, { type ImageProps } from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Traducción de legacy/assets/css/components/card.css. Piezas componibles como en el BEM original.
interface CardProps extends ComponentProps<"div"> {
  /** .card--featured: borde primario de 2px y degradado sutil. */
  featured?: boolean;
  /** .card--horizontal: contenido e imagen lado a lado desde 640px. */
  horizontal?: boolean;
  as?: "div" | "article";
}

export function Card({ featured, horizontal, as: Tag = "div", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-bg-card transition-[translate,box-shadow,border-color] duration-300",
        "hover:-translate-y-2 hover:border-primary hover:shadow-xl focus-within:shadow-(--focus-ring)",
        featured ? "border-2 border-primary bg-linear-135 from-bg-card to-primary/3" : "border border-border",
        horizontal && "sm:flex-row",
        className,
      )}
      {...props}
    />
  );
}

export function CardImage({ className, horizontal, alt, ...props }: ImageProps & { horizontal?: boolean }) {
  return (
    <Image
      alt={alt}
      className={cn(
        "w-full object-cover transition-transform duration-500 group-hover:scale-105",
        horizontal ? "h-50 sm:h-auto sm:min-h-50 sm:w-60" : "aspect-16/10",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-1 flex-col gap-3 p-6", className)} {...props} />;
}

export function CardTitle({ as: Tag = "h3", className, ...props }: ComponentProps<"h3"> & { as?: "h2" | "h3" }) {
  return <Tag className={cn("m-0 text-xl font-semibold leading-snug text-text", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("m-0 flex-1 text-base leading-relaxed text-text-light", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-auto flex items-center justify-between gap-3 border-t border-border pt-4", className)} {...props} />;
}
