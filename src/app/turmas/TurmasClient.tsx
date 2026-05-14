"use client";

import { useMemo, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { toast } from "react-toastify";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, EmptyState, FormModal, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { useEscola, type Turma } from "@/contexts/EscolaContext";

const colunas: DataTableColumn<Turma>[] = [
  { key: "nome", header: "Turma", render: (t) => t.nome },
  { key: "turno", header: "Turno", render: (t) => t.turno },
  { key: "sala", header: "Sala", render: (t) => t.sala },
  { key: "professorResponsavel", header: "Professor", render: (t) => t.professorResponsavel },
  { 
    key: "quantidadeAlunos", 
    header: "Alunos", 
    render: (t) => (
      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">
        {t.quantidadeAlunos} alunos
      </span>
    ) 
  },
];

export default function TurmasClient() {
  const { turmas, adicionarTurma } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    turno: "Matutino" as const,
    sala: "",
    professorResponsavel: "",
    quantidadeAlunos: "",
  });

  const turmasFiltradas = useMemo(() => {
    return turmas.filter((t) =>
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.professorResponsavel.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, turmas]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      turno: "Matutino",
      sala: "",
      professorResponsavel: "",
      quantidadeAlunos: "",
    });
  }

  function salvarTurma(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarTurma(formulario);
    toast.success("Turma cadastrada com sucesso!");
    fecharModal();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <PageTitle
              title="Turmas"
              subtitle="Gerenciamento de salas e turnos escolares."
            />
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-all w-full md:w-auto justify-center"
            >
              <Plus className="h-5 w-5" /> Nova Turma
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome da turma ou professor..."
              className="w-full p-3 pl-10 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {turmasFiltradas.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <DataTable 
                data={turmasFiltradas} 
                columns={colunas} 
                rowKey={(t) => t.id} 
              />
            </div>
          ) : (
            <EmptyState
              title="Nenhuma turma encontrada"
              description="Não há turmas que correspondam à sua busca no momento."
              icon={<BookOpen className="h-6 w-6" />}
            />
          )}
        </div>
      </main>

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Turma"
        description="Crie uma nova turma diretamente da tela de listagem."
      >
        <form onSubmit={salvarTurma} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome da Turma</label>
            <input
              value={formulario.nome}
              onChange={(event) => atualizarCampo("nome", event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Turno</label>
              <select
                value={formulario.turno}
                onChange={(event) => atualizarCampo("turno", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3"
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Sala</label>
              <input
                value={formulario.sala}
                onChange={(event) => atualizarCampo("sala", event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Professor Responsavel</label>
              <input
                value={formulario.professorResponsavel}
                onChange={(event) =>
                  atualizarCampo("professorResponsavel", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Quantidade de Alunos</label>
              <input
                type="number"
                min="1"
                value={formulario.quantidadeAlunos}
                onChange={(event) =>
                  atualizarCampo("quantidadeAlunos", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
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
              className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Salvar Turma
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
