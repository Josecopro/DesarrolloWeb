import { matchIndex } from "@/features/common/lib/search";

// .search-box__highlight de legacy: resalta la primera coincidencia de `query` en `text`.
export function Highlight({ text, query }: { text: string; query: string }) {
  const i = query ? matchIndex(text, query) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-xs bg-secondary/30 px-0.5 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}
