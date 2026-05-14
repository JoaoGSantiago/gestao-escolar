"use client";

import { useMemo, useState } from "react";
import { Book, Clock, User, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { PageTitle, EmptyState } from "../../../components/ui";

/* =========================
   DADOS MOCADOS
========================= */
const DISCIPLINAS_MOCK = [
  { id: '1', nome: 'Matemática', cargaHoraria: 80, professorResponsavel: 'Dr. Ricardo Braga' },
  { id: '2', nome: 'História', cargaHoraria: 40, professorResponsavel: 'Profa. Helena Souza' },
  { id: '3', nome: 'Física Química', cargaHoraria: 60, professorResponsavel: 'Marcos Vinícius' },
  { id: '4', nome: 'Língua Portuguesa', cargaHoraria: 80, professorResponsavel: 'Ana Cláudia' },
  { id: '5', nome: 'Artes', cargaHoraria: 20, professorResponsavel: 'Beatriz Lopes' },
];

export default function DisciplinasClient() {
  const [busca, setBusca] = useState("");

  const disciplinasFiltradas = useMemo(() => {
    return DISCIPLINAS_MOCK.filter((d) =>
      d.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* HEADER DA PÁGINA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <PageTitle
              title="Disciplinas"
              subtitle="Catálogo de matérias e carga horária anual."
            />
            <Link 
              href="/disciplinas/novo" 
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-sm"
            >
              <Plus className="h-5 w-5" /> Nova Disciplina
            </Link>
          </div>

          {/* BARRA DE BUSCA */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome da disciplina..."
              className="w-full p-3 pl-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* GRID DE CARDS */}
          {disciplinasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplinasFiltradas.map((disciplina) => (
                <div 
                  key={disciplina.id} 
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Book className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{disciplina.nome}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span><strong>Carga Horária:</strong> {disciplina.cargaHoraria}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <User className="h-4 w-4 text-amber-500" />
                      <span><strong>Professor:</strong> {disciplina.professorResponsavel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma disciplina encontrada"
              description={`Não encontramos resultados para "${busca}".`}
              icon={<Book className="h-6 w-6" />}
            />
          )}
        </div>
      </main>
    </div>
  );
}