"use client";

import { useMemo, useState } from "react";
import { Book, Clock, Plus, Search, User } from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { EmptyState, FormModal, PageTitle } from "../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";

export default function DisciplinasClient() {
  const { disciplinas, adicionarDisciplina } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    cargaHoraria: "",
    professorResponsavel: "",
    turma: "",
  });

  const disciplinasFiltradas = useMemo(() => {
    return disciplinas.filter((d) =>
      d.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, disciplinas]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      cargaHoraria: "",
      professorResponsavel: "",
      turma: "",
    });
  }

  function salvarDisciplina(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarDisciplina(formulario);
    fecharModal();
  }

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
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-sm"
            >
              <Plus className="h-5 w-5" /> Nova Disciplina
            </button>
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
                    <h3 className="text-xl font-bold text-gray-800">
                      {disciplina.nome}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>
                        <strong>Carga Horária:</strong>{" "}
                        {disciplina.cargaHoraria}h
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <User className="h-4 w-4 text-amber-500" />
                      <span>
                        <strong>Professor:</strong>{" "}
                        {disciplina.professorResponsavel}
                      </span>
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

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Disciplina"
        description="Cadastre uma nova disciplina sem sair da página."
      >
        <form onSubmit={salvarDisciplina} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome da Disciplina
            </label>
            <input
              value={formulario.nome}
              onChange={(event) => atualizarCampo("nome", event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Carga Horária
              </label>
              <input
                type="number"
                min="1"
                value={formulario.cargaHoraria}
                onChange={(event) =>
                  atualizarCampo("cargaHoraria", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Turma</label>
              <input
                value={formulario.turma}
                onChange={(event) =>
                  atualizarCampo("turma", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Professor Responsável
            </label>
            <input
              value={formulario.professorResponsavel}
              onChange={(event) =>
                atualizarCampo("professorResponsavel", event.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={fecharModal}
              className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white hover:bg-amber-600"
            >
              Salvar Disciplina
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
