import { type Disciplina } from "../../mocks/disciplinas";
import { apiFetch } from "./api";

export type { Disciplina };

export function listarDisciplinas() {
  return apiFetch<Disciplina[]>("/disciplinas");
}

export type CriarDisciplinaInput = {
  nome: string;
  cargaHoraria: number;
  professorId?: string;
  turmaId?: string;
};

export function criarDisciplina(input: CriarDisciplinaInput) {
  return apiFetch<Disciplina>("/disciplinas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
