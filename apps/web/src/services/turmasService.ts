import { type Turma } from "../../mocks/turmas";
import { apiFetch } from "./api";

export type { Turma };

export function listarTurmas() {
  return apiFetch<Turma[]>("/turmas");
}

export type CriarTurmaInput = {
  nome: string;
  turno: string;
  sala?: string;
  nivel?: string;
  ordem?: number;
};

export function criarTurma(input: CriarTurmaInput) {
  return apiFetch<Turma>("/turmas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
