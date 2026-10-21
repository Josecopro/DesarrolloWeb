"use client";

import { Button, ButtonLink } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { useComparison } from "@/lib/saved";
import type { SavedItem } from "@/types";

// .compare-* de legacy/assets/css/components/compare.css. Lee la comparación guardada en vez de la URL
// (legacy la pasaba como JSON en ?items=), así /comparar también funciona desde el menú.
const rows: { label: string; render: (item: SavedItem) => React.ReactNode }[] = [
  { label: "Tipo", render: (item) => item.category },
  {
    label: "Sitio web",
    render: (item) => (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-dark dark:text-secondary-light">
        Abrir
      </a>
    ),
  },
];

const cell = "border-b border-border p-4 max-md:p-3 max-md:text-sm";

export function CompareTable() {
  const { items, remove, clear } = useComparison();

  if (items.length < 2) {
    return (
      <div className="animate-fade-in px-4 py-16 text-center">
        <div className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-bg-alt text-text-lighter">
          <Icon name="table" size="xl" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-text">No hay elementos para comparar</h2>
        <p className="mx-auto mb-6 max-w-[400px] text-text-lighter">Selecciona al menos 2 universidades desde la página de universidades</p>
        <ButtonLink href="/universidades">Ver universidades</ButtonLink>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${cell} border-b-2 bg-bg-alt text-left font-semibold text-primary dark:text-secondary-light`}>Característica</th>
              {items.map((item) => (
                <th key={item.id} className={`${cell} border-b-2 bg-bg-alt text-left font-semibold text-primary dark:text-secondary-light`}>
                  <span className="flex items-start justify-between gap-2">
                    {item.name}
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      aria-label={`Quitar ${item.name} de la comparación`}
                      className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-lighter transition-all duration-120 hover:bg-error hover:text-text-inverse"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="last:[&>td]:border-b-0">
                <td className={`${cell} whitespace-nowrap font-medium text-primary dark:text-secondary-light`}>{row.label}</td>
                {items.map((item) => (
                  <td key={item.id} className={`${cell} align-top text-text`}>
                    {row.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={clear}>
          Limpiar todo
        </Button>
      </div>
    </div>
  );
}
