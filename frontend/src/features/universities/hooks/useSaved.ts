"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { SavedItem } from "@/features/universities/domain/types";

// Lista persistida en localStorage y compartida entre componentes (y pestañas, vía el evento `storage`).
// Las claves son las de legacy (advanced.js) para no perder lo guardado. En la Fase 5 pasa al backend por usuario.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

function useStoredList(key: string) {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => "[]");
  const items = useMemo<SavedItem[]>(() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [raw]);

  const save = useCallback(
    (next: SavedItem[]) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((l) => l());
    },
    [key],
  );

  return [items, save] as const;
}

export const MAX_COMPARISON = 4;

const same = (a: SavedItem, b: SavedItem) => a.id === b.id && a.type === b.type;

// Favoritos y comparación comparten la misma forma: lista sin duplicados con alternar/quitar/limpiar.
function useSavedList(key: string, limit = Infinity) {
  const [items, save] = useStoredList(key);
  const has = (item: SavedItem) => items.some((i) => same(i, item));
  return {
    items,
    has,
    full: items.length >= limit,
    toggle: (item: SavedItem) => {
      if (has(item)) save(items.filter((i) => !same(i, item)));
      else if (items.length < limit) save([...items, item]);
    },
    remove: (item: SavedItem) => save(items.filter((i) => !same(i, item))),
    clear: () => save([]),
  };
}

export const useFavorites = () => useSavedList("duam-favorites");
export const useComparison = () => useSavedList("duam-comparison", MAX_COMPARISON);
