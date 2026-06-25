"use client";

import { useMemo, useState, use } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "../../../../../components/Header";
import { Sidebar } from "../../../../../components/Sidebar";
import { DataTable, PageTitle } from "../../../../../components/ui";
import type { DataTableColumn } from "../../../../../components/ui";
import { useEscola, type Aluno } from "@/contexts/EscolaContext";

type ModalAlunoState = {
  aberto: boolean;
  aluno: Aluno | null;
};

export default function TurmaPage({
  params,
}: {
  params: Promise<{ turma: string }>;
}) {
  const router = useRouter();
  const { alunos } = useEscola();
  const [modalAluno, setModalAluno] = useState<ModalAlunoState>({
    aberto: false,
    aluno: null,
  });

  const { turma } = use(params);
  const turmaDecodificada = decodeURIComponent(turma);

  const alunosDaTurma = useMemo(() => {
    return alunos.filter((aluno) => aluno.turma === turmaDecodificada);
  }, [alunos, turmaDecodificada]);

  const colunas: DataTableColumn<Aluno>[] = [
    {
      key: "nome",
      header: "Nome",
      render: (aluno) => (
        <button
          onClick={() => setModalAluno({ aberto: true, aluno })}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          {aluno.nome}
        </button>
      ),
    },
    { key: "email", header: "Email", render: (aluno) => aluno.email },
    {
      key: "status",
      header: "Status",
      render: (aluno) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            aluno.status === "Ativo"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {aluno.status}
        </span>
      ),
    },
  ];

  function fecharModalAluno() {
    setModalAluno({ aberto: false, aluno: null });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <PageTitle
              title={turmaDecodificada}
              subtitle={`${alunosDaTurma.length} aluno${alunosDaTurma.length !== 1 ? "s" : ""}`}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {alunosDaTurma.length > 0 ? (
              <DataTable
                data={alunosDaTurma}
                columns={colunas}
                rowKey={(aluno) => aluno.id}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">
                  Nenhum aluno nesta turma.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Aluno */}
      {modalAluno.aberto && modalAluno.aluno && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm"
          onClick={fecharModalAluno}
          role="presentation"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-aluno-turma-title"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="modal-aluno-turma-title"
                    className="text-2xl font-bold text-slate-900"
                  >
                    {modalAluno.aluno.nome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Informações do aluno
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fecharModalAluno}
                  className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Fechar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Email
                  </label>
                  <p className="text-slate-900">{modalAluno.aluno.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Matrícula
                  </label>
                  <p className="text-slate-900">{modalAluno.aluno.matricula}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Turma
                  </label>
                  <p className="text-slate-900">{modalAluno.aluno.turma}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Data de Nascimento
                  </label>
                  <p className="text-slate-900">{modalAluno.aluno.dataNascimento}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        modalAluno.aluno.status === "Ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {modalAluno.aluno.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={fecharModalAluno}
                    className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
