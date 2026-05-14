"use client";

import { BookOpen, GraduationCap, School } from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { notasMock, type Nota } from "../../../mocks/notas";
import { alunosMock } from "../../../mocks/alunos";
import { disciplinasMock } from "../../../mocks/disciplinas";

type NotaTabela = Nota & {
  alunoNome: string;
  disciplinaNome: string;
};

const dadosTabela: NotaTabela[] = notasMock.map((nota) => ({
  ...nota,
  alunoNome:
    alunosMock.find((aluno) => aluno.id === nota.alunoId)?.nome ??
    "Aluno não encontrado",
  disciplinaNome:
    disciplinasMock.find((disciplina) => disciplina.id === nota.disciplinaId)
      ?.nome ?? "Disciplina não encontrada",
}));

const colunas: DataTableColumn<NotaTabela>[] = [
  { key: "alunoNome", header: "Aluno", render: (nota) => nota.alunoNome },
  {
    key: "disciplinaNome",
    header: "Disciplina",
    render: (nota) => nota.disciplinaNome,
  },
  { key: "avaliacao", header: "Avaliação", render: (nota) => nota.avaliacao },
  { key: "valor", header: "Nota", render: (nota) => nota.valor.toFixed(1) },
  { key: "periodo", header: "Período", render: (nota) => nota.periodo },
];

export default function NotasClient() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageTitle
            title="Notas"
            subtitle="Acompanhamento das avaliações registradas por aluno e disciplina."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">Lancamentos</p>
              <p className="text-2xl font-bold text-slate-900">
                {dadosTabela.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <School className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Disciplinas avaliadas
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {new Set(dadosTabela.map((nota) => nota.disciplinaId)).size}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">Média geral</p>
              <p className="text-2xl font-bold text-slate-900">
                {(
                  dadosTabela.reduce((total, nota) => total + nota.valor, 0) /
                  dadosTabela.length
                ).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <DataTable
              data={dadosTabela}
              columns={colunas}
              rowKey={(nota) => nota.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
