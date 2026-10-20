import type { IconName } from "@/components/atoms/Icon";
import { IconBadge } from "@/components/atoms/IconBadge";
import { Card } from "@/components/molecules/Card";
import type { Tone } from "@/types";

// .card--feature + .feature__* de legacy/assets/css/components/section.css
interface FeatureCardProps {
  icon: IconName;
  tone: Tone;
  title: string;
  description: string;
}

export function FeatureCard({ icon, tone, title, description }: FeatureCardProps) {
  return (
    <Card as="article" className="p-6 text-center">
      <IconBadge name={icon} tone={tone} className="mb-4 self-center" />
      <h3 className="mb-2 text-xl font-semibold text-text">{title}</h3>
      <p className="leading-relaxed text-text-muted">{description}</p>
    </Card>
  );
}
