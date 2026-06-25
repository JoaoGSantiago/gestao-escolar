"use client";

import { useMemo, useState } from "react";
import { ChevronRight, School } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/components/ui/DataTable";
import { PageTitle } from "@/components/ui/PageTitle";
import { useProfessorAtual } from "../useProfessorAtual";
import type { Aluno } from "@/contexts/EscolaContext";

const colunas: DataTableColumn<Aluno>[] = [
  { key: "nome", header: "Nome", render: (a) => a.nome },
  { key: "email", header: "Email", render: (a) => a.email },
  { key: "matricula", header: "Matrícula", render: (a) => a.matricula ?? "—" },
  {
    key: "status",
    header: "Status",
    render: (a) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-bold ${
          a.status === "Ativo"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {a.status}
      </span>
    ),
  },
];

export default function ProfessorAlunos() {
  const { professor, turmas, alunos } = useProfessorAtual();
  const [turmaId, setTurmaId] = useState<string | null>(null);

  const alunosDaTurma = useMemo(
    () => alunos.filter((a) => a.turmaId === turmaId),
    [alunos, turmaId],
  );

  if (!professor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Carregando seus dados de professor...
      </div>
    );
  }

  // ----------------------------- Seleção de turma -----------------------------
  if (!turmaId) {
    return (
      <div className="flex flex-col gap-6">
        <PageTitle
          title="Meus Alunos"
          subtitle="Selecione uma turma para ver os alunos."
        />

        {turmas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {turmas.map((turma) => {
              const total = alunos.filter(
                (a) => a.turmaId === turma.id,
              ).length;
              return (
                <button
                  key={turma.id}
                  type="button"
                  onClick={() => setTurmaId(turma.id)}
                  className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-indigo-500 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                        <School className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {turma.nome}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {turma.turno} • {total} alunos
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-indigo-600" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
            Você ainda não tem turmas vinculadas às suas disciplinas.
          </div>
        )}
      </div>
    );
  }

  // ----------------------------- Alunos da turma -----------------------------
  const turma = turmas.find((t) => t.id === turmaId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setTurmaId(null)}
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          ← Voltar
        </button>
        <PageTitle
          title={`Meus Alunos — ${turma?.nome ?? ""}`}
          subtitle={`${alunosDaTurma.length} alunos nesta turma.`}
        />
      </div>

      <DataTable
        data={alunosDaTurma}
        columns={colunas}
        rowKey={(a) => a.id}
        emptyTitle="Nenhum aluno encontrado"
        emptyDescription="Esta turma ainda não tem alunos."
      />
    </div>
  );
}
