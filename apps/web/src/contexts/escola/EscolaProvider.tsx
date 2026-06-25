"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { buscarDadosEscola } from "@/services/escolaService";
import { criarAluno } from "@/services/alunosService";
import { criarProfessor } from "@/services/professoresService";
import { criarTurma } from "@/services/turmasService";
import { criarDisciplina } from "@/services/disciplinasService";
import {
  registrarFrequencia,
  type Frequencia,
} from "@/services/frequenciasService";
import { registrarNota, type Nota } from "@/services/notasService";
import { EscolaContext } from "./EscolaContextCore";
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
  const [carregando, setCarregando] = useState(true);

  // Carrega (ou recarrega) todos os dados da escola a partir da API.
  const carregar = useCallback(async () => {
    const dados = await buscarDadosEscola();

    setAlunos(
      dados.alunos.map((aluno) => ({
        ...aluno,
        status: aluno.status ?? "Ativo",
      })),
    );
    setProfessores(
      dados.professores.map((professor) => ({
        ...professor,
        status: professor.status ?? "Ativo",
        telefone: professor.telefone ?? "",
      })),
    );
    setDisciplinas(
      dados.disciplinas.map((disciplina) => ({
        id: disciplina.id,
        nome: disciplina.nome,
        cargaHoraria: disciplina.cargaHoraria,
        professorId: disciplina.professorId,
        professorResponsavel:
          dados.professores.find((p) => p.id === disciplina.professorId)
            ?.nome ?? "A definir",
        turmaId: disciplina.turmaId,
        turma:
          dados.turmas.find((t) => t.id === disciplina.turmaId)?.nome ??
          "Não informada",
      })),
    );
    setTurmas(
      dados.turmas.map((turma, index) => ({
        id: turma.id,
        nome: turma.nome,
        turno: turma.turno,
        sala: turma.sala ?? `Sala ${index + 1}`,
        nivel: turma.nivel,
        ordem: turma.ordem,
        professorResponsavel:
          dados.professores[index % Math.max(dados.professores.length, 1)]
            ?.nome ?? "A definir",
        quantidadeAlunos: turma.alunos,
      })),
    );
    setFrequencias(dados.frequencias);
    setNotas(dados.notas);
  }, []);

  useEffect(() => {
    carregar()
      .catch((erro) => {
        // Sem sessão válida (ou API indisponível): mantém o estado vazio.
        console.warn("Não foi possível carregar os dados da escola:", erro);
      })
      .finally(() => setCarregando(false));
  }, [carregar]);

  const value = useMemo<EscolaContextValue>(
    () => ({
      alunos,
      professores,
      turmas,
      disciplinas,
      frequencias,
      notas,
      carregando,
      recarregar: carregar,
      adicionarAluno: async (aluno) => {
        const turma = turmas.find((t) => t.nome === aluno.turma);
        await criarAluno({
          nome: aluno.nome,
          email: aluno.email,
          turmaId: turma?.id ?? aluno.turma,
          matricula: aluno.matricula || undefined,
          dataNascimento: aluno.dataNascimento || undefined,
          status: aluno.status,
        });
        await carregar();
      },
      adicionarProfessor: async (professor) => {
        await criarProfessor({
          nome: professor.nome,
          email: professor.email,
          telefone: professor.telefone || undefined,
          status: professor.status,
          senha: professor.senha || undefined,
        });
        await carregar();
      },
      adicionarTurma: async (turma) => {
        await criarTurma({
          nome: turma.nome,
          turno: turma.turno,
          sala: turma.sala || undefined,
        });
        await carregar();
      },
      adicionarDisciplina: async (disciplina) => {
        await criarDisciplina({
          nome: disciplina.nome,
          cargaHoraria: Number(disciplina.cargaHoraria),
          professorId: disciplina.professorId || undefined,
          turmaId: disciplina.turmaId || undefined,
        });
        await carregar();
      },
      atualizarFrequencia: async (frequencia) => {
        await registrarFrequencia(frequencia);
        await carregar();
      },
      atualizarNota: async (nota) => {
        await registrarNota(nota);
        await carregar();
      },
    }),
    [
      alunos,
      disciplinas,
      professores,
      turmas,
      frequencias,
      notas,
      carregando,
      carregar,
    ],
  );

  return (
    <EscolaContext.Provider value={value}>{children}</EscolaContext.Provider>
  );
}
