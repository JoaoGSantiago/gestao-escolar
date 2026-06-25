"use client";

import { useEffect, useMemo, useState } from "react";
import { obterUsuario } from "@/services/api";
import { useEscola } from "@/contexts/EscolaContext";

/**
 * Resolve o professor logado (pelo e-mail do JWT) e agrega os dados reais dele:
 * disciplinas que leciona, turmas e alunos correspondentes.
 */
export function useProfessorAtual() {
  const { professores, disciplinas, turmas, alunos, notas, frequencias } =
    useEscola();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(obterUsuario()?.email ?? null);
  }, []);

  return useMemo(() => {
    const professor = email
      ? professores.find((p) => p.email === email)
      : undefined;

    if (!professor) {
      return {
        professor: null,
        disciplinas: [],
        turmas: [],
        alunos: [],
        notas,
        frequencias,
      };
    }

    const disciplinasDoProfessor = disciplinas.filter(
      (d) => d.professorId === professor.id,
    );
    const idsDisciplinas = new Set(disciplinasDoProfessor.map((d) => d.id));
    const idsTurmas = new Set(disciplinasDoProfessor.map((d) => d.turmaId));

    const turmasDoProfessor = turmas
      .filter((t) => idsTurmas.has(t.id))
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

    const alunosDoProfessor = alunos
      .filter((a) => idsTurmas.has(a.turmaId))
      .sort((a, b) => a.nome.localeCompare(b.nome));

    return {
      professor,
      disciplinas: disciplinasDoProfessor,
      turmas: turmasDoProfessor,
      alunos: alunosDoProfessor,
      notas: notas.filter((n) => idsDisciplinas.has(n.disciplinaId)),
      frequencias: frequencias.filter((f) =>
        idsDisciplinas.has(f.disciplinaId),
      ),
    };
  }, [email, professores, disciplinas, turmas, alunos, notas, frequencias]);
}
