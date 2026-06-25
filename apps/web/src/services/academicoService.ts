import { apiFetch } from "./api";

export type SituacaoDisciplina = "Aprovado" | "Recuperação" | "Reprovado";

export interface DesempenhoDisciplina {
  disciplinaId: string;
  nome: string;
  media: number;
  frequencia: number;
  situacao: SituacaoDisciplina;
}

export interface Boletim {
  aluno: { id: string; nome: string; turma: string; turmaId: string };
  anoLetivo: number;
  disciplinas: DesempenhoDisciplina[];
  mediaGeral: number;
  frequenciaGeral: number;
  situacaoProjetada: "APROVADO" | "REPROVADO";
}

export interface ResultadoAluno {
  id: string;
  nome: string;
  mediaGeral: number;
  frequenciaGeral: number;
  situacao: "APROVADO" | "REPROVADO" | "FORMADO" | "CURSANDO";
  turmaDestino?: string;
}

export interface RelatorioEncerramento {
  turma: { id: string; nome: string };
  totalAvaliados: number;
  aprovados: ResultadoAluno[];
  reprovados: ResultadoAluno[];
  formados: ResultadoAluno[];
}

export function buscarBoletim(alunoId: string) {
  return apiFetch<Boletim>(`/academico/alunos/${alunoId}/boletim`);
}

export function aprovarAluno(alunoId: string) {
  return apiFetch<ResultadoAluno>(`/academico/alunos/${alunoId}/aprovar`, {
    method: "POST",
  });
}

export function encerrarAno(turmaId: string) {
  return apiFetch<RelatorioEncerramento>(
    `/academico/turmas/${turmaId}/encerrar-ano`,
    { method: "POST" },
  );
}
