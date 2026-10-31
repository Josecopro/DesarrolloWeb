"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/features/common/components/Card";
import { Input } from "@/features/common/components/Input";
import { Tag } from "@/features/common/components/Tag";
import { fold } from "@/features/common/lib/search";
import type { Offering } from "../domain/types";

// Programas reales del área (SNIES) con las universidades que los ofrecen.
// El filtro busca en el nombre del programa y de la universidad, sin distinguir tildes.
export function OfferingList({ offerings }: { offerings: Offering[] }) {
  const [q, setQ] = useState("");
  const shown = offerings.filter((o) => [o.name, ...o.universities.map((u) => u.name)].some((t) => fold(t).includes(fold(q.trim()))));

  return (
    <>
      <div className="mx-auto mb-8 max-w-xl">
        <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar por carrera o universidad" aria-label="Filtrar carreras" />
        <p className="mt-2 text-center text-sm text-text-light" aria-live="polite">
          {shown.length} de {offerings.length} carreras
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((o, i) => (
          <li key={o.name} className="animate-slide-up" style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}>
            <Card as="article" className="h-full">
              <CardContent>
                <CardTitle>{o.name}</CardTitle>
                <ul className="flex flex-wrap gap-2" aria-label={`Universidades que ofrecen ${o.name}`}>
                  {o.universities.map((u) => (
                    <li key={`${u.id}-${u.level}-${u.modality}`}>
                      <a href={u.url} target="_blank" rel="noopener noreferrer" className="rounded-full focus-visible:shadow-(--focus-ring) focus-visible:outline-none">
                        <Tag size="xs" className="whitespace-normal">
                          {u.name}
                          {u.level !== "Universitaria" && ` · ${u.level}`}
                          {u.modality !== "Presencial" && ` · ${u.modality}`}
                        </Tag>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
