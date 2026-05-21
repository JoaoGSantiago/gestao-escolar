import type { Aluno as AlunoBase } from "@/services/alunosService";
import type { Frequencia } from "@/services/frequenciasService";
import type { Nota } from "@/services/notasService";
import type { Professor as ProfessorBase } from "@/services/professoresService";

export interface Aluno extends AlunoBase {
  status: "Ativo" | "Inativo";
  matricula?: string;
  dataNascimento?: string;
}

export interface Professor extends ProfessorBase {
  status: "Ativo" | "Inativo";
  telefone?: string;
}

export interface Turma {
  id: string;
  nome: string;
  turno: string;
  sala: string;
  professorResponsavel: string;
  quantidadeAlunos: number;
}

export interface Disciplina {
  id: string;
  nome: string;
  cargaHoraria: number;
  professorResponsavel: string;
  turma: string;
}

export type NovoAlunoInput = {
  nome: string;
  email: string;
  matricula: string;
  dataNascimento: string;
  turma: string;
  status: "Ativo" | "Inativo";
};

export type NovoProfessorInput = {
  nome: string;
  email: string;
  telefone: string;
  disciplina: string;
  status: "Ativo" | "Inativo";
};

export type NovaTurmaInput = {
  nome: string;
  turno: "Matutino" | "Vespertino" | "Noturno";
  sala: string;
  professorResponsavel: string;
  quantidadeAlunos: string;
};

export type NovaDisciplinaInput = {
  nome: string;
  cargaHoraria: string;
  professorResponsavel: string;
  turma: string;
};

export type AtualizarFrequenciaInput = {
  alunoId: string;
  disciplinaId: string;
  presencas: number;
  faltas: number;
};

export type AtualizarNotaInput = {
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  valor: number;
  bimestre: number;
};

export type EscolaContextValue = {
  alunos: Aluno[];
  professores: Professor[];
  turmas: Turma[];
  disciplinas: Disciplina[];
  frequencias: Frequencia[];
  notas: Nota[];
  adicionarAluno: (aluno: NovoAlunoInput) => void;
  adicionarProfessor: (professor: NovoProfessorInput) => void;
  adicionarTurma: (turma: NovaTurmaInput) => void;
  adicionarDisciplina: (disciplina: NovaDisciplinaInput) => void;
  atualizarFrequencia: (frequencia: AtualizarFrequenciaInput) => void;
  atualizarNota: (nota: AtualizarNotaInput) => void;
};
