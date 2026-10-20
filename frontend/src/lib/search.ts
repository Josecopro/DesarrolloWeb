// Búsqueda sin distinguir mayúsculas ni tildes ("medellin" encuentra "Medellín").
// Se pliega carácter por carácter para conservar las posiciones y poder resaltar el texto original.
export const fold = (s: string) =>
  Array.from(s, (c) => c.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase() || c).join("");

/** Posición de `query` dentro de `text`, o -1. */
export const matchIndex = (text: string, query: string) => fold(text).indexOf(fold(query));
