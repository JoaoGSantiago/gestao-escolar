"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Users } from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, EmptyState, Loading, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { alunosMock, type Aluno } from "../../../mocks/alunos";
import { fetchMockData } from "../../../mocks/fetchData";

const SIMULAR_ERRO = false;
const SIMULAR_VAZIO = false;

const colunas: DataTableColumn<Aluno>[] = [
  { key: "nome", header: "Nome", render: (aluno) => aluno.nome },
  { key: "email", header: "Email", render: (aluno) => aluno.email },
  { key: "turma", header: "Turma", render: (aluno) => aluno.turma },
];

export default function AlunosClient() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["alunos"],
    queryFn: () =>
      fetchMockData(alunosMock, {
        simularErro: SIMULAR_ERRO,
        simularVazio: SIMULAR_VAZIO,
      }),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <PageTitle
            title="Alunos"
            subtitle="Dados mockados carregados com useQuery."
          />

          {isLoading ? <Loading label="Carregando alunos..." /> : null}

          {isError ? (
            <EmptyState
              title="Nao foi possivel carregar os alunos"
              description="Esse e um erro fake para demonstrar o tratamento com useQuery."
              icon={<AlertCircle className="h-6 w-6" />}
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Tentar novamente
                </button>
              }
            />
          ) : null}

          {!isLoading && !isError ? (
            data && data.length > 0 ? (
              <DataTable data={data} columns={colunas} rowKey={(aluno) => aluno.id} />
            ) : (
              <EmptyState
                title="Nenhum aluno cadastrado"
                description="Nao ha dados para mostrar no momento."
                icon={<Users className="h-6 w-6" />}
              />
            )
          ) : null}
        </div>
      </main>
    </div>
  );
}
