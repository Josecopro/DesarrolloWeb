import { Icon, type IconName } from "@/features/common/components/Icon";
import { cn } from "@/features/common/lib/cn";
import type { Tone } from "@/features/common/domain/types";

// Círculo con ícono: .feature__icon / .aid-type__icon de legacy/assets/css/components/section.css
const tones: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary-light",
  secondary: "bg-secondary/15 text-secondary-ink dark:bg-secondary/20 dark:text-secondary-light",
  success: "bg-success/10 text-success-ink",
  accent: "bg-accent/10 text-accent",
};

interface IconBadgeProps {
  name: IconName;
  tone?: Tone;
  /** md = 56px (.aid-type__icon), lg = 64px (.feature__icon). */
  size?: "md" | "lg";
  className?: string;
}

export function IconBadge({ name, tone = "primary", size = "lg", className }: IconBadgeProps) {
  return (
    <div className={cn("inline-flex shrink-0 items-center justify-center rounded-full", size === "md" ? "size-14" : "size-16", tones[tone], className)}>
      <Icon name={name} size="xl" />
    </div>
  );
}
