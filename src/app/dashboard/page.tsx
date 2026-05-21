"use client";

import { useMemo } from "react";
import {
  BookOpen,
  GraduationCap,
  School,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DashboardStats,
  DisciplinesDashboardSection,
  PageShell,
} from "../../../components/ui";
import type {
  DashboardAction,
  DashboardStat,
  DisciplineDashboardRow,
} from "../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";

export default function DashboardPage() {
  const { alunos, professores, turmas, disciplinas } = useEscola();

  const painelDisciplinas = useMemo<DisciplineDashboardRow[]>(() => {
    return disciplinas.map((disciplina) => {
      const alunosDaTurma = alunos.filter(
        (aluno) => aluno.turma === disciplina.turma,
      );

      return {
        id: disciplina.id,
        nome: disciplina.nome,
        turma: disciplina.turma,
        professorResponsavel: disciplina.professorResponsavel,
        totalAlunos: alunosDaTurma.length,
      };
    });
  }, [alunos, disciplinas]);

  const resumoGeral: DashboardStat[] = [
    {
      label: "Alunos",
      value: alunos.length.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/alunos",
    },
    {
      label: "Professores",
      value: professores.length.toString(),
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/professores",
    },
    {
      label: "Turmas Ativas",
      value: turmas.length.toString(),
      icon: School,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/turmas",
    },
    {
      label: "Disciplinas",
      value: disciplinas.length.toString(),
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/disciplinas",
    },
  ];

  const acoesDashboard: DashboardAction[] = [
    {
      label: "Adicionar Estudante",
      href: "/alunos",
      icon: UserPlus,
      iconClassName: "text-blue-500",
      hoverClassName: "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
    },
    {
      label: "Adicionar Professor",
      href: "/professores",
      icon: GraduationCap,
      iconClassName: "text-indigo-500",
      hoverClassName:
        "hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
    },
  ];

  return (
    <PageShell>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard Acadêmico
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Acompanhe alunos, matérias e cadastros por disciplina.
        </p>
      </div>

      <DashboardStats stats={resumoGeral} />

      <DisciplinesDashboardSection
        disciplines={painelDisciplinas}
        actions={acoesDashboard}
      />
    </PageShell>
  );
}
