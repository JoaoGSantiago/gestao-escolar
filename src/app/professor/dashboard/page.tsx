"use client";

import { useMemo } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  FileText,
  School,
  Users,
} from "lucide-react";
import { useEscola } from "@/contexts/EscolaContext";
import { disciplinasMock } from "@/mocks/disciplinas";
import { professoresMock } from "@/mocks/professores";
import { turmasMock } from "@/mocks/turmas";

export default function ProfessorDashboard() {
  const professorId = professoresMock[0].id;
  const { alunos, frequencias } = useEscola();

  const professorInfo = useMemo(() => {
    const professor = professoresMock.find((item) => item.id === professorId);
    if (!professor) return null;

    const disciplina = disciplinasMock.find(
      (item) => item.professorId === professor.id,
    );
    const turma = turmasMock.find((item) => item.id === disciplina?.turmaId);
    const alunosDaTurma = alunos.filter((aluno) => aluno.turma === turma?.nome);
    const frequenciasDoProfessor = frequencias.filter(
      (frequencia) => frequencia.disciplinaId === disciplina?.id,
    );
    const frequenciaMedia =
      frequenciasDoProfessor.length > 0
        ? frequenciasDoProfessor.reduce(
            (total, frequencia) => total + frequencia.percentual,
            0,
          ) / frequenciasDoProfessor.length
        : null;
    const totalFaltas = frequenciasDoProfessor.reduce(
      (total, frequencia) => total + frequencia.faltas,
      0,
    );
    const alunosComFrequencia = alunosDaTurma.map((aluno) => {
      const frequencia = frequenciasDoProfessor.find(
        (item) => item.alunoId === aluno.id,
      );

      return {
        id: aluno.id,
        nome: aluno.nome,
        presencas: frequencia?.presencas ?? 0,
        faltas: frequencia?.faltas ?? 0,
        percentual: frequencia?.percentual ?? null,
      };
    });

    return {
      professor,
      disciplina,
      turma,
      alunosComFrequencia,
      totalAlunos: alunosDaTurma.length,
      frequenciasRegistradas: frequenciasDoProfessor.length,
      frequenciaMedia,
      totalFaltas,
    };
  }, [alunos, frequencias, professorId]);

  if (!professorInfo) {
    return (
      <div className="rounded-2xl bg-red-50 p-6">
        <p className="text-red-900">Professor não encontrado.</p>
      </div>
    );
  }

  const resumoGeral = [
    {
      label: "Total de Alunos",
      value: professorInfo.totalAlunos.toString(),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Presença Média",
      value:
        professorInfo.frequenciaMedia === null
          ? "--"
          : `${professorInfo.frequenciaMedia.toFixed(1)}%`,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Turma",
      value: professorInfo.turma?.nome || "--",
      icon: School,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Disciplina",
      value: professorInfo.disciplina?.nome || "--",
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Bem-vindo, {professorInfo.professor.nome}. Gerencie sua turma e
          registre frequências e notas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {resumoGeral.map((item) => (
          <div
            key={item.label}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:p-5"
          >
            <div className="mb-5 flex items-center justify-between sm:mb-4">
              <div className={`rounded-lg p-2 ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
            </div>
            <p className="text-sm font-semibold leading-tight text-slate-500">
              {item.label}
            </p>
            <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Dashboard da Matéria
            </h3>
            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {professorInfo.disciplina?.nome} - {professorInfo.turma?.nome}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Alunos na matéria
              </p>
              <p className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                {professorInfo.totalAlunos}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Presença média
              </p>
              <p
                className={`mt-1 text-xl font-black sm:text-2xl ${
                  (professorInfo.frequenciaMedia ?? 0) >= 75
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {professorInfo.frequenciaMedia === null
                  ? "--"
                  : `${professorInfo.frequenciaMedia.toFixed(1)}%`}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Faltas lançadas
              </p>
              <p className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                {professorInfo.totalFaltas}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {professorInfo.alunosComFrequencia.map((aluno) => (
              <div
                key={aluno.id}
                className="grid gap-2 p-4 sm:grid-cols-2 md:grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] md:gap-3"
              >
                <p className="font-semibold text-slate-900">{aluno.nome}</p>
                <p className="text-sm text-slate-600">
                  Presenças: <strong>{aluno.presencas}</strong>
                </p>
                <p className="text-sm text-slate-600">
                  Faltas: <strong>{aluno.faltas}</strong>
                </p>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                    (aluno.percentual ?? 0) >= 75
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {aluno.percentual === null
                    ? "Sem registro"
                    : `${aluno.percentual.toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-800">Informações</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Professor
              </p>
              <p className="font-medium text-slate-900">
                {professorInfo.professor.nome}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Email
              </p>
              <p className="font-medium text-slate-900">
                {professorInfo.professor.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Disciplina
              </p>
              <p className="font-medium text-slate-900">
                {professorInfo.disciplina?.nome}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Turma
              </p>
              <p className="font-medium text-slate-900">
                {professorInfo.turma?.nome}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Status
              </p>
              <p className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Ativo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
