"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, EmptyState, FormModal, PageTitle } from "../../../components/ui";
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
  const { professores, adicionarProfessor } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    telefone: "",
    disciplina: "",
    status: "Ativo" as const,
  });

  const professoresFiltrados = useMemo(() => {
    return professores.filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.disciplina.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, professores]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      email: "",
      telefone: "",
      disciplina: "",
      status: "Ativo",
    });
  }

  function salvarProfessor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarProfessor(formulario);
    toast.success("Professor cadastrado com sucesso!");
    fecharModal();
  }

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
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              <Plus className="h-5 w-5" /> Novo Professor
            </button>
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

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Professor"
        description="Preencha os dados do professor sem sair da listagem."
      >
        <form onSubmit={salvarProfessor} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome Completo</label>
            <input
              value={formulario.nome}
              onChange={(event) => atualizarCampo("nome", event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={formulario.email}
                onChange={(event) => atualizarCampo("email", event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Telefone</label>
              <input
                value={formulario.telefone}
                onChange={(event) => atualizarCampo("telefone", event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Disciplina</label>
              <input
                value={formulario.disciplina}
                onChange={(event) => atualizarCampo("disciplina", event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                value={formulario.status}
                onChange={(event) => atualizarCampo("status", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
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
              className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Salvar Professor
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
