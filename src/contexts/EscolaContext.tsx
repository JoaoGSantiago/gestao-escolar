"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { alunosMock, type Aluno as AlunoBase } from "../../mocks/alunos";
import {
  professoresMock,
  type Professor as ProfessorBase,
} from "../../mocks/professores";
import { turmasMock } from "../../mocks/turmas";
import { disciplinasMock } from "../../mocks/disciplinas";
import { frequenciaMock, type Frequencia } from "../../mocks/frequencia";
import { notasMock, type Nota } from "../../mocks/notas";

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

type AtualizarFrequenciaInput = {
  alunoId: string;
  disciplinaId: string;
  presencas: number;
  faltas: number;
};

type AtualizarNotaInput = {
  alunoId: string;
  disciplinaId: string;
  avaliacao: string;
  valor: number;
  bimestre: number;
};

type EscolaContextValue = {
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

const EscolaContext = createContext<EscolaContextValue | null>(null);

function gerarId(prefixo: string, tamanhoAtual: number) {
  return `${prefixo}${String(tamanhoAtual + 1).padStart(3, "0")}`;
}

function mapearTurmaId(turma: string) {
  const mapa: Record<string, string> = {
    "6º Ano A": "TUR001",
    "7º Ano B": "TUR002",
    "1º Médio C": "TUR003",
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
    })),
  );
  const [professores, setProfessores] = useState<Professor[]>(
    professoresMock.map((professor) => ({
      ...professor,
      status: "Ativo",
      telefone: "(82) 99999-0000",
    })),
  );
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(
    disciplinasMock.map((disciplina) => ({
      id: disciplina.id,
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
      professorResponsavel:
        professoresMock.find(
          (professor) => professor.id === disciplina.professorId,
        )?.nome ?? "A definir",
      turma:
        turmasMock.find((turma) => turma.id === disciplina.turmaId)?.nome ??
        "Não informada",
    })),
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
    })),
  );
  const [frequencias, setFrequencias] = useState<Frequencia[]>(frequenciaMock);
  const [notas, setNotas] = useState<Nota[]>(notasMock);

  const value = useMemo<EscolaContextValue>(
    () => ({
      alunos,
      professores,
      turmas,
      disciplinas,
      frequencias,
      notas,
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
      atualizarFrequencia: (frequencia) => {
        setFrequencias((estadoAtual) => {
          const index = estadoAtual.findIndex(
            (f) =>
              f.alunoId === frequencia.alunoId &&
              f.disciplinaId === frequencia.disciplinaId
          );
          if (index !== -1) {
            const novaFrequencia = [...estadoAtual];
            const aulasPrevistas = novaFrequencia[index].aulasPrevistas;
            const percentual =
              ((frequencia.presencas / aulasPrevistas) * 100) || 0;
            novaFrequencia[index] = {
              ...novaFrequencia[index],
              presencas: frequencia.presencas,
              faltas: frequencia.faltas,
              percentual,
            };
            return novaFrequencia;
          }
          return estadoAtual;
        });
      },
      atualizarNota: (nota) => {
        setNotas((estadoAtual) => {
          const index = estadoAtual.findIndex(
            (n) =>
              n.alunoId === nota.alunoId &&
              n.disciplinaId === nota.disciplinaId &&
              n.bimestre === nota.bimestre
          );
          if (index !== -1) {
            const novaNotas = [...estadoAtual];
            novaNotas[index] = {
              ...novaNotas[index],
              avaliacao: nota.avaliacao,
              valor: nota.valor,
            };
            return novaNotas;
          }
          // Criar nova nota se não existir
          return [
            ...estadoAtual,
            {
              id: gerarId("NOTA", estadoAtual.length),
              alunoId: nota.alunoId,
              disciplinaId: nota.disciplinaId,
              avaliacao: nota.avaliacao,
              valor: nota.valor,
              bimestre: nota.bimestre,
            },
          ];
        });
      },
    }),
    [alunos, disciplinas, professores, turmas, frequencias, notas],
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
