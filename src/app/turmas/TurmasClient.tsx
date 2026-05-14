"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, School } from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, EmptyState, Loading, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { fetchMockData } from "../../../mocks/fetchData";
import { turmasMock, type Turma } from "../../../mocks/turmas";

const SIMULAR_ERRO = false;
const SIMULAR_VAZIO = false;

const colunas: DataTableColumn<Turma>[] = [
  { key: "nome", header: "Turma", render: (turma) => turma.nome },
  { key: "turno", header: "Turno", render: (turma) => turma.turno },
  {
    key: "alunos",
    header: "Qtd. Alunos",
    render: (turma) => turma.alunos,
  },
];

export default function TurmasClient() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["turmas"],
    queryFn: () =>
      fetchMockData(turmasMock, {
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
            title="Turmas"
            subtitle="Dados mockados carregados com useQuery."
          />

          {isLoading ? <Loading label="Carregando turmas..." /> : null}

          {isError ? (
            <EmptyState
              title="Nao foi possivel carregar as turmas"
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
              <DataTable data={data} columns={colunas} rowKey={(turma) => turma.id} />
            ) : (
              <EmptyState
                title="Nenhuma turma cadastrada"
                description="Nao ha dados para mostrar no momento."
                icon={<School className="h-6 w-6" />}
              />
            )
          ) : null}
        </div>
      </main>
    </div>
  );
}
