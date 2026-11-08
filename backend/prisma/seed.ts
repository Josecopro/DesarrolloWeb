// Seed: catálogo con los datos reales de la Entrega 1 (legacy/data/*.js) + usuarios de prueba.
// Idempotente (upsert): se puede correr varias veces. Uso: npm run db:seed
import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import type { Scholarship } from "../src/domain/scholarship.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL }) });
const load = (file: string) => JSON.parse(readFileSync(new URL(`./seed-data/${file}`, import.meta.url), "utf8"));

const universities = load("universities.json") as Record<"private" | "public", { name: string; url: string; snies: string }[]>;
const { categories } = load("careers.json") as {
  categories: { id: string; name: string; icon: string; image: string; description: string; summary: string; tone: "primary" | "secondary" | "success" | "accent"; symbol: string }[];
};
// Generado con `npm run data:programs` desde el SNIES.
const programs = load("programs.json") as { university: string; name: string; career: string; level: string; modality: string }[];
// Enlaces oficiales de cada programa, recolectados a mano (clave "nombre|nivel|modalidad"). Revisar con `npm run data:links`.
const { universities: links } = load("program-links.json") as {
  universities: Record<string, { catalog: string | null; programs: Record<string, string> }>;
};
const programKey = (p: { name: string; level: string; modality: string }) => `${p.name}|${p.level}|${p.modality}`;
// Recolectadas a mano de las fuentes oficiales (`url` de cada una); revisar `checkedAt` cada semestre.
const { scholarships } = load("scholarships.json") as {
  scholarships: (Omit<Scholarship, "deadline" | "note"> & { deadline: string | null; note?: string })[];
};

// Credenciales de prueba SOLO para el ambiente de la entrega (documentadas en el README).
// En producción real se cambiarían con SEED_ADMIN_PASSWORD / SEED_USER_PASSWORD.
const testUsers = [
  { name: "Administrador DUAM", email: "admin@duam.co", password: process.env.SEED_ADMIN_PASSWORD ?? "AdminDuam2026!", role: "admin" as const },
  { name: "Usuario de Prueba", email: "usuario@duam.co", password: process.env.SEED_USER_PASSWORD ?? "UsuarioDuam2026!", role: "user" as const },
];

async function main() {
  const known = new Set(programs.map((p) => `${p.university}|${programKey(p)}`));
  for (const [university, { programs: urls }] of Object.entries(links)) {
    if (![...universities.private, ...universities.public].some((u) => u.name === university)) throw new Error(`program-links.json: universidad desconocida ${university}`);
    const unknown = Object.keys(urls).filter((k) => !known.has(`${university}|${k}`));
    if (unknown.length) throw new Error(`program-links.json, ${university}: programas que no existen ${unknown.join("; ")}`);
  }

  for (const type of ["private", "public"] as const) {
    for (const { snies: _, ...u } of universities[type]) {
      const programsUrl = links[u.name]?.catalog ?? null;
      await prisma.university.upsert({ where: { name: u.name }, create: { ...u, type, programsUrl }, update: { url: u.url, type, programsUrl } });
    }
  }

  for (const [sort, c] of categories.entries()) {
    const data = { ...c, sort };
    await prisma.career.upsert({ where: { id: c.id }, create: data, update: data });
  }

  // Programas: solo lectura y sin referencias entrantes, así que se recrean completos en cada seed.
  const universityIds = new Map((await prisma.university.findMany({ select: { id: true, name: true } })).map((u) => [u.name, u.id]));
  await prisma.$transaction([
    prisma.program.deleteMany(),
    prisma.program.createMany({
      data: programs.map(({ university, career, ...p }) => ({
        ...p,
        url: links[university]?.programs[programKey(p)] ?? null,
        careerId: career,
        universityId: universityIds.get(university)!,
      })),
    }),
  ]);

  const universityNames = new Set([...universities.private, ...universities.public].map((u) => u.name));
  await prisma.scholarship.deleteMany({ where: { id: { notIn: scholarships.map((s) => s.id) } } });
  for (const [sort, s] of scholarships.entries()) {
    const unknown = s.universities.filter((n) => !universityNames.has(n));
    if (unknown.length) throw new Error(`Beca ${s.id}: universidades desconocidas ${unknown.join(", ")}`);
    const data = { ...s, deadline: s.deadline ? new Date(s.deadline) : null, note: s.note ?? null, sort };
    await prisma.scholarship.upsert({ where: { id: s.id }, create: data, update: data });
  }

  for (const { password, ...user } of testUsers) {
    // Solo se crea si no existe: no pisa una contraseña cambiada después.
    await prisma.user.upsert({ where: { email: user.email }, create: { ...user, password: await bcrypt.hash(password, 10) }, update: {} });
  }

  const [u, c, p, linked, s, users] = await Promise.all([
    prisma.university.count(),
    prisma.career.count(),
    prisma.program.count(),
    prisma.program.count({ where: { url: { not: null } } }),
    prisma.scholarship.count(),
    prisma.user.count(),
  ]);
  console.log(`Seed listo: ${u} universidades, ${c} áreas, ${p} programas (${linked} con enlace propio), ${s} becas, ${users} usuarios.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
