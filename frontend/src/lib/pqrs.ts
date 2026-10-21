"use server";

// Envía el PQRS al backend desde el servidor de Next: la clave API_KEY nunca llega al navegador
// y la API no necesita CORS.
export type PqrsResult = { ok: true } | { ok: false; errors?: Record<string, string> };

export async function submitPqrs(input: { nombre: string; correo: string; comentario: string }): Promise<PqrsResult> {
  const { API_URL, API_KEY } = process.env;
  if (!API_URL || !API_KEY) {
    console.error("PQRS: faltan API_URL o API_KEY");
    return { ok: false };
  }
  try {
    const res = await fetch(`${API_URL}/api/pqrs`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify({ nombre: input.nombre, correo: input.correo, comentario: input.comentario }),
    });
    if (res.status === 201) return { ok: true };
    if (res.status === 400) return { ok: false, errors: (await res.json()).errors };
    console.error(`PQRS: la API respondió ${res.status}`);
  } catch (e) {
    console.error("PQRS: no se pudo contactar la API", e);
  }
  return { ok: false };
}
