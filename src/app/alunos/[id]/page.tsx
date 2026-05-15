"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { Header } from "../../../../components/Header";
import { Sidebar } from "../../../../components/Sidebar";
import { EmptyState, PageTitle } from "../../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";
import { frequenciaMock } from "../../../../mocks/frequencia";
import { notasMock } from "../../../../mocks/notas";

export default function AlunoDetalhesPage() {
  const params = useParams<{ id: string }>();
  const { alunos } = useEscola();

  const aluno = alunos.find((item) => item.id === params.id);

  if (!aluno) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar />
        <Header />

        <main className="px-4 py-6 md:ml-64 md:px-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <Link
              href="/alunos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para alunos
            </Link>

            <EmptyState
              title="Aluno nao encontrado"
              description="Nao localizamos esse cadastro."
              icon={<UserRound className="h-6 w-6" />}
            />
          </div>
        </main>
      </div>
    );
  }

  const notasAluno = notasMock.filter((nota) => nota.alunoId === aluno.id);
  const frequenciasAluno = frequenciaMock.filter(
    (frequencia) => frequencia.alunoId === aluno.id
  );

  const mediaNotas = notasAluno.length
    ? notasAluno.reduce((total, nota) => total + nota.valor, 0) / notasAluno.length
    : 0;

  const mediaFrequencia = frequenciasAluno.length
    ? frequenciasAluno.reduce(
        (total, frequencia) => total + frequencia.percentual,
        0
      ) / frequenciasAluno.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            href="/alunos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para alunos
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <PageTitle
              title={aluno.nome}
              subtitle="Detalhes basicos do aluno."
            />

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">E-mail</p>
                <p className="mt-1 text-slate-800">{aluno.email}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Turma</p>
                <p className="mt-1 text-slate-800">{aluno.turma}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Matricula</p>
                <p className="mt-1 text-slate-800">
                  {aluno.matricula ?? "Nao informada"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Data de Nascimento</p>
                <p className="mt-1 text-slate-800">
                  {aluno.dataNascimento ?? "Nao informada"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Media das notas</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {mediaNotas ? mediaNotas.toFixed(1) : "-"}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Frequencia media</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {mediaFrequencia ? `${mediaFrequencia.toFixed(1)}%` : "-"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
