import type { Aluno as AlunoBase } from "@/services/alunosService";
import type { Frequencia } from "@/services/frequenciasService";
import type { Nota } from "@/services/notasService";
import type { Professor as ProfessorBase } from "@/services/professoresService";

export interface Aluno extends AlunoBase {
  status: "Ativo" | "Inativo";
  matricula?: string;
  dataNascimento?: string;
  situacao?: string;
}

export interface Professor extends ProfessorBase {
  status: "Ativo" | "Inativo";
  telefone?: string;
  acessoSistema?: boolean;
}

export interface Turma {
  id: string;
  nome: string;
  turno: string;
  sala: string;
  professorResponsavel: string;
  quantidadeAlunos: number;
  ordem: number;
  nivel: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  cargaHoraria: number;
  professorResponsavel: string;
  professorId: string;
  turma: string;
  turmaId: string;
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
  status: "Ativo" | "Inativo";
  senha?: string;
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
  professorId: string;
  turmaId: string;
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
  carregando: boolean;
  recarregar: () => Promise<void>;
  adicionarAluno: (aluno: NovoAlunoInput) => Promise<void>;
  adicionarProfessor: (professor: NovoProfessorInput) => Promise<void>;
  adicionarTurma: (turma: NovaTurmaInput) => Promise<void>;
  adicionarDisciplina: (disciplina: NovaDisciplinaInput) => Promise<void>;
  atualizarFrequencia: (frequencia: AtualizarFrequenciaInput) => Promise<void>;
  atualizarNota: (nota: AtualizarNotaInput) => Promise<void>;
};
