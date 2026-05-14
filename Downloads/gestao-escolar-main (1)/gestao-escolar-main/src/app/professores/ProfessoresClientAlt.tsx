"use client";

import { useMemo, useState } from "react";
import { AlertCircle, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, EmptyState, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { useEscola, type Professor } from "@/contexts/EscolaContext";

const colunas: DataTableColumn<Professor>[] = [
  { key: "nome", header: "Nome", render: (p) => p.nome },
  { key: "disciplina", header: "Disciplina", render: (p) => p.disciplina },
  { key: "email", header: "Email", render: (p) => p.email },
  { 
    key: "status", 
    header: "Status", 
    render: (p) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {p.status}
      </span>
    ) 
  },
];

export default function ProfessoresClient() {
  const { professores } = useEscola();
  const [busca, setBusca] = useState("");

  const professoresFiltrados = useMemo(() => {
    return professores.filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.disciplina.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, professores]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex justify-between items-end">
            <PageTitle
              title="Professores"
              subtitle="Gerenciamento do corpo docente da instituição."
            />
            <Link 
              href="/professores/novo" 
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              <Plus className="h-5 w-5" /> Novo Professor
            </Link>
          </div>

          <input
            type="text"
            placeholder="Buscar por nome ou disciplina..."
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {professoresFiltrados.length > 0 ? (
            <DataTable 
              data={professoresFiltrados} 
              columns={colunas} 
              rowKey={(p) => p.id} 
            />
          ) : (
            <EmptyState
              title={busca ? "Nenhum resultado" : "Nenhum professor cadastrado"}
              description={busca ? `Não encontramos nada para "${busca}"` : "Comece adicionando um novo professor ao sistema."}
              icon={<GraduationCap className="h-6 w-6" />}
            />
          )}
        </div>
      </main>
    </div>
  );
}