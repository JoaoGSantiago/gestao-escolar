"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { alunosMock, type Aluno as AlunoBase } from "../../mocks/alunos";
import { professoresMock, type Professor as ProfessorBase } from "../../mocks/professores";
import { turmasMock } from "../../mocks/turmas";
import { disciplinasMock } from "../../mocks/disciplinas";

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

type NovoAlunoInput = {
  nome: string;
  email: string;
  matricula: string;
  dataNascimento: string;
  turma: string;
  status: "Ativo" | "Inativo";
};

type NovoProfessorInput = {
  nome: string;
  email: string;
  telefone: string;
  disciplina: string;
  status: "Ativo" | "Inativo";
};

type NovaTurmaInput = {
  nome: string;
  turno: "Matutino" | "Vespertino" | "Noturno";
  sala: string;
  professorResponsavel: string;
  quantidadeAlunos: string;
};

type NovaDisciplinaInput = {
  nome: string;
  cargaHoraria: string;
  professorResponsavel: string;
  turma: string;
};

type EscolaContextValue = {
  alunos: Aluno[];
  professores: Professor[];
  turmas: Turma[];
  disciplinas: Disciplina[];
  adicionarAluno: (aluno: NovoAlunoInput) => void;
  adicionarProfessor: (professor: NovoProfessorInput) => void;
  adicionarTurma: (turma: NovaTurmaInput) => void;
  adicionarDisciplina: (disciplina: NovaDisciplinaInput) => void;
};

const EscolaContext = createContext<EscolaContextValue | null>(null);

function gerarId(prefixo: string, tamanhoAtual: number) {
  return `${prefixo}${String(tamanhoAtual + 1).padStart(3, "0")}`;
}

function mapearTurmaId(turma: string) {
  const mapa: Record<string, string> = {
    "1º Ano A": "TUR001",
    "2º Ano B": "TUR002",
    "3º Período": "TUR001",
    "5º Período": "TUR002",
    "7º Período": "TUR003",
  };

  return mapa[turma] ?? "TUR999";
}

export function EscolaProvider({ children }: { children: React.ReactNode }) {
  const [alunos, setAlunos] = useState<Aluno[]>(
    alunosMock.map((aluno, index) => ({
      ...aluno,
      status: "Ativo",
      matricula: `20260${index + 1}`,
      dataNascimento: "2005-01-01",
    }))
  );
  const [professores, setProfessores] = useState<Professor[]>(
    professoresMock.map((professor) => ({
      ...professor,
      status: "Ativo",
      telefone: "(82) 99999-0000",
    }))
  );
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(
    disciplinasMock.map((disciplina) => ({
      id: disciplina.id,
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
      professorResponsavel:
        professoresMock.find((professor) => professor.id === disciplina.professorId)?.nome ??
        "A definir",
      turma:
        turmasMock.find((turma) => turma.id === disciplina.turmaId)?.nome ??
        "Nao informada",
    }))
  );
  const [turmas, setTurmas] = useState<Turma[]>(
    turmasMock.map((turma, index) => ({
      id: turma.id,
      nome: turma.nome,
      turno: turma.turno,
      sala: `Sala ${index + 1}`,
      professorResponsavel:
        professoresMock[index % professoresMock.length]?.nome ?? "A definir",
      quantidadeAlunos: turma.alunos,
    }))
  );

  const value = useMemo<EscolaContextValue>(
    () => ({
      alunos,
      professores,
      turmas,
      disciplinas,
      adicionarAluno: (aluno) => {
        setAlunos((estadoAtual) => [
          ...estadoAtual,
          {
            id: gerarId("ALU", estadoAtual.length),
            nome: aluno.nome,
            email: aluno.email,
            turma: aluno.turma,
            turmaId: mapearTurmaId(aluno.turma),
            status: aluno.status,
            matricula: aluno.matricula,
            dataNascimento: aluno.dataNascimento,
          },
        ]);
      },
      adicionarProfessor: (professor) => {
        setProfessores((estadoAtual) => [
          ...estadoAtual,
          {
            id: gerarId("PROF", estadoAtual.length),
            nome: professor.nome,
            email: professor.email,
            disciplina: professor.disciplina,
            disciplinaId: `DIS${String(estadoAtual.length + 1).padStart(3, "0")}`,
            status: professor.status,
            telefone: professor.telefone,
          },
        ]);
      },
      adicionarTurma: (turma) => {
        setTurmas((estadoAtual) => [
          ...estadoAtual,
          {
            id: gerarId("TUR", estadoAtual.length),
            nome: turma.nome,
            turno: turma.turno,
            sala: turma.sala,
            professorResponsavel: turma.professorResponsavel,
            quantidadeAlunos: Number(turma.quantidadeAlunos),
          },
        ]);
      },
      adicionarDisciplina: (disciplina) => {
        setDisciplinas((estadoAtual) => [
          ...estadoAtual,
          {
            id: gerarId("DIS", estadoAtual.length),
            nome: disciplina.nome,
            cargaHoraria: Number(disciplina.cargaHoraria),
            professorResponsavel: disciplina.professorResponsavel,
            turma: disciplina.turma,
          },
        ]);
      },
    }),
    [alunos, disciplinas, professores, turmas]
  );

  return (
    <EscolaContext.Provider value={value}>{children}</EscolaContext.Provider>
  );
}

export function useEscola() {
  const context = useContext(EscolaContext);

  if (!context) {
    throw new Error("useEscola deve ser usado dentro de EscolaProvider.");
  }

  return context;
}
