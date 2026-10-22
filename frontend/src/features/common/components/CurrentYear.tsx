import { cacheLife } from "next/cache";

// Con cacheComponents, new Date() solo puede leerse dentro de un 'use cache': queda prerenderizado y se renueva a diario.
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
