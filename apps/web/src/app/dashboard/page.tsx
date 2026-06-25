"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Clock,
  GraduationCap,
  School,
  User,
  Users,
  X,
} from "lucide-react";
import { DashboardStats, PageShell } from "../../../components/ui";
import type { DashboardStat } from "../../../components/ui";
import { useEscola, type Turma } from "@/contexts/EscolaContext";

export default function DashboardPage() {
  const { alunos, professores, turmas, disciplinas } = useEscola();
  const [turmaModal, setTurmaModal] = useState<Turma | null>(null);

  const turmasOrdenadas = useMemo(
    () => [...turmas].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
    [turmas],
  );

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
      href: "/turmas",
    },
  ];

  const disciplinasDoModal = useMemo(() => {
    if (!turmaModal) return [];
    return disciplinas.filter((d) => d.turmaId === turmaModal.id);
  }, [disciplinas, turmaModal]);

  return (
    <PageShell>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard Acadêmico
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Selecione uma turma para ver o dashboard das suas disciplinas.
        </p>
      </div>

      <DashboardStats stats={resumoGeral} />

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Disciplinas por Turma
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turmasOrdenadas.map((turma) => {
            const totalDisciplinas = disciplinas.filter(
              (d) => d.turmaId === turma.id,
            ).length;
            const totalAlunos = alunos.filter(
              (a) => a.turmaId === turma.id,
            ).length;

            return (
              <button
                key={turma.id}
                type="button"
                onClick={() => setTurmaModal(turma)}
                className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-blue-400 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <School className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {turma.nome}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {totalAlunos} alunos • {totalDisciplinas} disciplinas
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-600" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {turmaModal && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm"
          onClick={() => setTurmaModal(null)}
          role="presentation"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-dashboard-turma"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="modal-dashboard-turma"
                    className="text-2xl font-bold text-slate-900"
                  >
                    {turmaModal.nome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {turmaModal.turno} • {disciplinasDoModal.length} disciplinas
                    •{" "}
                    {alunos.filter((a) => a.turmaId === turmaModal.id).length}{" "}
                    alunos
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTurmaModal(null)}
                  className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {disciplinasDoModal.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {disciplinasDoModal.map((disciplina) => (
                    <div
                      key={disciplina.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {disciplina.nome}
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>{disciplina.cargaHoraria}h de carga</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-amber-500" />
                          <span>{disciplina.professorResponsavel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-slate-500">
                  Nenhuma disciplina cadastrada nesta turma.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
