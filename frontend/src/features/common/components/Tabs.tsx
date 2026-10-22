"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { cn } from "@/features/common/lib/cn";

// Traducción de legacy/assets/css/components/tabs.css + la lógica de importante.html (flechas, Home, End).
interface TabsProps {
  label: string;
  tabs: { label: string; content: ReactNode }[];
}

export function Tabs({ label, tabs }: TabsProps) {
  const [active, setActive] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const onKeyDown = (e: KeyboardEvent) => {
    const last = tabs.length - 1;
    const next = { ArrowRight: active === last ? 0 : active + 1, ArrowLeft: active === 0 ? last : active - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    triggers.current[next]?.focus();
  };

  return (
    <div className="mx-auto max-w-[800px]">
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="mb-6 flex gap-1 rounded-xl border border-border bg-bg-alt p-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => {
              triggers.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "relative z-1 flex-1 cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:shadow-(--focus-ring) focus-visible:outline-none max-sm:px-2",
              i === active ? "bg-linear-135 from-primary to-primary-dark text-text-inverse shadow-md" : "text-text-lighter hover:bg-bg-hover hover:text-text",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          tabIndex={0}
          hidden={i !== active}
          className="animate-tabs-panel-in"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
