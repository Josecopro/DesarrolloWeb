"use client";

import Link from "next/link";
import { Fragment, useId, useRef, useState } from "react";
import { Icon } from "@/features/common/components/Icon";
import { useDismiss } from "@/features/common/lib/useDismiss";
import { cn } from "@/features/common/lib/cn";

// Traducción de legacy/assets/css/components/dropdown.css. Cada grupo se separa con un divisor.
interface DropdownProps {
  label: string;
  groups: { label: string; href: string }[][];
}

export function Dropdown({ label, groups }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useDismiss(ref, open, () => setOpen(false));

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className="inline-flex min-w-40 cursor-pointer whitespace-nowrap items-center justify-between gap-2 rounded-md px-4 py-2 text-sm font-medium text-text-inverse transition-colors duration-120 hover:bg-white/10 focus-visible:shadow-(--focus-ring) aria-expanded:bg-white/15"
      >
        <span>{label}</span>
        <Icon name="chevron-down" size="sm" className={cn("transition-transform duration-120", open && "rotate-180")} />
      </button>
      <div
        id={menuId}
        className={cn(
          "absolute top-[calc(100%+--spacing(2))] right-0 z-(--z-dropdown) min-w-55 rounded-lg border border-border bg-bg-card p-3 shadow-xl transition-all duration-120",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        {groups.map((group, i) => (
          <Fragment key={i}>
            {i > 0 && <div className="my-2 h-px bg-border" />}
            {group.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block w-full rounded-md px-4 py-3 text-left text-sm font-medium text-text transition-all duration-120 hover:bg-bg-hover hover:text-primary focus-visible:bg-bg-hover focus-visible:shadow-(--focus-ring) focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
