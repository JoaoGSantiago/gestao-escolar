"use client";

import { useEffect, useMemo, useState } from "react";
import { buscarDadosEscola } from "@/services/escolaService";
import type { Frequencia } from "@/services/frequenciasService";
import type { Nota } from "@/services/notasService";
import { EscolaContext } from "./EscolaContextCore";
import { gerarId, mapearTurmaId } from "./helpers";
import type {
  Aluno,
  Disciplina,
  EscolaContextValue,
  Professor,
  Turma,
} from "./types";

export function EscolaProvider({ children }: { children: React.ReactNode }) {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const dados = await buscarDadosEscola();

      if (!ativo) return;

      setAlunos(
        dados.alunos.map((aluno, index) => ({
          ...aluno,
          status: "Ativo",
          matricula: `20260${index + 1}`,
          dataNascimento: "2005-01-01",
        })),
      );
      setProfessores(
        dados.professores.map((professor) => ({
          ...professor,
          status: "Ativo",
          telefone: "(82) 99999-0000",
        })),
      );
      setDisciplinas(
        dados.disciplinas.map((disciplina) => ({
          id: disciplina.id,
          nome: disciplina.nome,
          cargaHoraria: disciplina.cargaHoraria,
          professorResponsavel:
            dados.professores.find(
              (professor) => professor.id === disciplina.professorId,
            )?.nome ?? "A definir",
          turma:
            dados.turmas.find((turma) => turma.id === disciplina.turmaId)
              ?.nome ?? "Não informada",
        })),
      );
      setTurmas(
        dados.turmas.map((turma, index) => ({
          id: turma.id,
          nome: turma.nome,
          turno: turma.turno,
          sala: `Sala ${index + 1}`,
          professorResponsavel:
            dados.professores[index % dados.professores.length]?.nome ??
            "A definir",
          quantidadeAlunos: turma.alunos,
        })),
      );
      setFrequencias(dados.frequencias);
      setNotas(dados.notas);
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

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
              f.disciplinaId === frequencia.disciplinaId,
          );
          if (index !== -1) {
            const novaFrequencia = [...estadoAtual];
            const aulasPrevistas = novaFrequencia[index].aulasPrevistas;
            const percentual =
              (frequencia.presencas / aulasPrevistas) * 100 || 0;
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
              n.avaliacao.toLowerCase() === nota.avaliacao.toLowerCase() &&
              n.bimestre === nota.bimestre,
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
