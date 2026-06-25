import { type Aluno } from "../../mocks/alunos";
import { apiFetch } from "./api";

export type { Aluno };

export function listarAlunos() {
  return apiFetch<Aluno[]>("/alunos");
}

export function listarAlunosPorTurma(turmaId: string) {
  return apiFetch<Aluno[]>(`/alunos?turmaId=${encodeURIComponent(turmaId)}`);
}

export type CriarAlunoInput = {
  nome: string;
  email: string;
  turmaId: string;
  matricula?: string;
  dataNascimento?: string;
  status?: string;
};

export function criarAluno(input: CriarAlunoInput) {
  return apiFetch<Aluno>("/alunos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
