// Clasificación de programas del SNIES (prisma/fetch-programs.ts). No usa red ni base de datos.
import assert from "node:assert/strict";
import { test } from "node:test";
import { classify, programName, toPrograms } from "../prisma/fetch-programs.js";

test("programName limpia títulos del SNIES", () => {
  assert.equal(programName("INGENIERO (A)  DE SISTEMAS"), "Ingeniero de Sistemas");
  assert.equal(programName("ABOGADA(O)"), "Abogado");
  assert.equal(programName("TECN¿LOGO EN GESTI¿N DE REDES INAL¿MBRICAS"), "Tecnólogo en Gestión de Redes Inalámbricas");
  assert.equal(programName("INGENIERO INDUSTRIAL."), "Ingeniero Industrial");
  assert.equal(programName("PALABRA DESCONOCIDA C¿DIGO"), null);
});

test("classify ubica cada programa en su área", () => {
  assert.equal(classify("Psicólogo", "Psicología", "Ciencias sociales y humanas"), "salud");
  assert.equal(classify("Contador Público", "Contaduría pública", "Economía administración contaduría y afines"), "negocios");
  assert.equal(classify("Tecnólogo en Gestión de Servicios Gastronómicos", "Administración", "Economía administración contaduría y afines"), "servicios");
  assert.equal(classify("Licenciado en Educación Física Recreación y Deportes", "Educación", "Ciencias de la educación"), "educacion");
  assert.equal(classify("Licenciado en Educación Infantil", "Sin clasificar", "Sin clasificar"), "educacion");
  assert.equal(classify("Algo Raro", "Sin clasificar", "Sin clasificar"), null);
});

test("toPrograms deduplica sedes y unifica tildes", () => {
  const row = { codigoinstitucion: "1", nombreareaconocimiento: "Ciencias de la salud", nombrenbc: "Medicina", nombrenivelformacion: "Universitaria", nombremetodologia: "Presencial" };
  const { programs } = toPrograms(
    [
      { ...row, nombretituloobtenido: "MEDICO" },
      { ...row, nombretituloobtenido: "MEDICO" },
      { ...row, codigoinstitucion: "2", nombretituloobtenido: "MÉDICO" },
    ],
    new Map([["1", "U1"], ["2", "U2"]]),
  );
  assert.deepEqual(programs.map((p) => [p.university, p.name, p.career]), [["U1", "Médico", "salud"], ["U2", "Médico", "salud"]]);
});
