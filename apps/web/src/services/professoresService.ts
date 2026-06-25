import { type Professor } from "../../mocks/professores";
import { apiFetch } from "./api";

export type { Professor };

export function listarProfessores() {
  return apiFetch<Professor[]>("/professores");
}

export type CriarProfessorInput = {
  nome: string;
  email: string;
  telefone?: string;
  status?: string;
  /** Se informada, cria o login de acesso do professor. */
  senha?: string;
};

export function criarProfessor(input: CriarProfessorInput) {
  return apiFetch<Professor>("/professores", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
