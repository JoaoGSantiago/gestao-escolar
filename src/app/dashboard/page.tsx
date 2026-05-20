"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  GraduationCap,
  School,
  Users,
} from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { useEscola } from "@/contexts/EscolaContext";

export default function DashboardPage() {
  const { alunos, professores, turmas, disciplinas, frequencias } = useEscola();

  const painelDisciplinas = useMemo(() => {
    return disciplinas.map((disciplina) => {
      const alunosDaTurma = alunos.filter(
        (aluno) => aluno.turma === disciplina.turma,
      );
      const frequenciasDaDisciplina = frequencias.filter(
        (frequencia) => frequencia.disciplinaId === disciplina.id,
      );
      const frequenciaMedia =
        frequenciasDaDisciplina.length > 0
          ? frequenciasDaDisciplina.reduce(
              (total, frequencia) => total + frequencia.percentual,
              0,
            ) / frequenciasDaDisciplina.length
          : null;

      return {
        id: disciplina.id,
        nome: disciplina.nome,
        turma: disciplina.turma,
        professorResponsavel: disciplina.professorResponsavel,
        totalAlunos: alunosDaTurma.length,
        frequenciaMedia,
      };
    });
  }, [alunos, disciplinas, frequencias]);

  const resumoGeral = [
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

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Dashboard Academico
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Acompanhe alunos, materias e presenca por disciplina.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resumoGeral.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-95"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-lg p-2 ${item.bg} transition-transform group-hover:scale-110`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {item.label}
                </p>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  {item.value}
                </h3>
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 p-5">
                <h3 className="flex items-center gap-2 font-bold text-slate-800">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  Dashboard das Disciplinas
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {painelDisciplinas.map((disciplina) => (
                  <div
                    key={disciplina.id}
                    className="grid gap-4 p-5 md:grid-cols-[1.4fr_0.7fr_0.8fr]"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {disciplina.nome}
                      </p>
                      <p className="text-sm text-slate-500">
                        {disciplina.turma} - {disciplina.professorResponsavel}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Alunos na materia
                      </p>
                      <p className="mt-1 text-xl font-black text-slate-900">
                        {disciplina.totalAlunos}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Presenca
                      </p>
                      <p
                        className={`mt-1 text-xl font-black ${
                          (disciplina.frequenciaMedia ?? 0) >= 75
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {disciplina.frequenciaMedia === null
                          ? "--"
                          : `${disciplina.frequenciaMedia.toFixed(1)}%`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
