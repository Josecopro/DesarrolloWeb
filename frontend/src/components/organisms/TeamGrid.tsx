import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/molecules/Card";
import type { TeamMember } from "@/types";

// .team-grid / .card--team de legacy/assets/css/components/team.css.
// Legacy usaba margen negativo bajo la foto, lo que montaba el nombre sobre la imagen; aquí no se solapan.
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul className="mx-auto grid max-w-[800px] grid-cols-1 gap-6 sm:grid-cols-2">
      {members.map((m, i) => (
        <li key={m.name} className="animate-slide-up" style={{ animationDelay: `${i * 120}ms` }}>
          <Card as="article" className="h-full text-center">
            <CardContent>
              <div className="mb-4 inline-flex size-20 items-center justify-center self-center rounded-full bg-primary/10 text-[2.5rem] text-primary">
                {m.icon}
              </div>
              <Image
                src={m.image}
                alt={m.name}
                width={400}
                height={400}
                sizes="200px"
                className="mx-auto aspect-16/10 w-full max-w-[200px] rounded-xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
              <CardTitle>{m.name}</CardTitle>
              <p className="mb-3 text-base font-semibold text-primary dark:text-secondary-light">{m.role}</p>
              <CardDescription>{m.bio}</CardDescription>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
