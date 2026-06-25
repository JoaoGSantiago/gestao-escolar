"use client";

import { useMemo } from "react";
import { BookOpen, ClipboardCheck, School, Users } from "lucide-react";
import { useProfessorAtual } from "../useProfessorAtual";

export default function ProfessorDashboard() {
  const { professor, disciplinas, turmas, alunos, frequencias } =
    useProfessorAtual();

  const presencaMedia = useMemo(() => {
    if (frequencias.length === 0) return null;
    const soma = frequencias.reduce((t, f) => t + f.percentual, 0);
    return soma / frequencias.length;
  }, [frequencias]);

  if (!professor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Carregando seus dados de professor...
      </div>
    );
  }

  const stats = [
    {
      label: "Disciplinas",
      value: disciplinas.length.toString(),
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Turmas",
      value: turmas.length.toString(),
      icon: School,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Alunos",
      value: alunos.length.toString(),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Presença média",
      value: presencaMedia === null ? "--" : `${presencaMedia.toFixed(1)}%`,
      icon: ClipboardCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Olá, {professor.nome}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Acompanhe suas turmas e registre frequências e notas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${item.bg}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <h3 className="font-bold text-slate-800">Minhas disciplinas</h3>
        </div>
        {disciplinas.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {disciplinas.map((disciplina) => {
              const turma = turmas.find((t) => t.id === disciplina.turmaId);
              const totalAlunos = alunos.filter(
                (a) => a.turmaId === disciplina.turmaId,
              ).length;
              return (
                <div
                  key={disciplina.id}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {disciplina.nome}
                      </p>
                      <p className="text-sm text-slate-500">
                        {turma?.nome ?? "Turma"} • {disciplina.cargaHoraria}h
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    {totalAlunos} alunos
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">
            Você ainda não está vinculado a nenhuma disciplina. Peça à
            coordenação para cadastrá-lo em uma turma.
          </p>
        )}
      </div>
    </div>
  );
}
