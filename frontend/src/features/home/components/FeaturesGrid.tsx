import type { IconName } from "@/features/common/components/Icon";
import { FeatureCard } from "@/features/home/components/FeatureCard";
import type { Tone } from "@/features/common/domain/types";

// .features-grid de legacy/assets/css/components/section.css
export interface Feature {
  icon: IconName;
  tone: Tone;
  title: string;
  description: string;
}

export function FeaturesGrid({ features }: { features: Feature[] }) {
  return (
    <div className="mx-auto grid max-w-(--container-max) grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </div>
  );
}
