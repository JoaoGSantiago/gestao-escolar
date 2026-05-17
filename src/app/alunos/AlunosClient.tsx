"use client";

import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import {
  DataTable,
  EmptyState,
  FormModal,
  PageTitle,
} from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { useEscola, type Aluno } from "@/contexts/EscolaContext";

const colunas: DataTableColumn<Aluno>[] = [
  {
    key: "nome",
    header: "Nome",
    render: (aluno) => (
      <Link
        href={`/alunos/${aluno.id}`}
        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
      >
        {aluno.nome}
      </Link>
    ),
  },
  { key: "email", header: "Email", render: (aluno) => aluno.email },
  { key: "turma", header: "Turma", render: (aluno) => aluno.turma },
  {
    key: "status",
    header: "Status",
    render: (aluno) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${aluno.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
      >
        {aluno.status}
      </span>
    ),
  },
];

export default function AlunosClient() {
  const { alunos, adicionarAluno } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    matricula: "",
    dataNascimento: "",
    turma: "",
    status: "Ativo" as const,
  });

  const alunosFiltrados = useMemo(() => {
    return alunos.filter(
      (aluno) =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
        aluno.turma.toLowerCase().includes(busca.toLowerCase()) ||
        aluno.email.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, alunos]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      email: "",
      matricula: "",
      dataNascimento: "",
      turma: "",
      status: "Ativo",
    });
  }

  function salvarAluno(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarAluno(formulario);
    toast.success("Aluno cadastrado com sucesso!");
    fecharModal();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex justify-between items-end">
            <PageTitle title="Alunos" subtitle="Alunos da escola." />
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              <Plus className="h-5 w-5" /> Novo Aluno
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar por nome, email ou turma..."
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {alunosFiltrados.length > 0 ? (
            <DataTable
              data={alunosFiltrados}
              columns={colunas}
              rowKey={(aluno) => aluno.id}
            />
          ) : (
            <EmptyState
              title={
                busca
                  ? "Nenhum resultado encontrado"
                  : "Nenhum aluno cadastrado"
              }
              description={
                busca
                  ? `Não encontramos nada para "${busca}"`
                  : "Comece adicionando um novo aluno ao sistema."
              }
              icon={<Users className="h-6 w-6" />}
            />
          )}
        </div>
      </main>

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Aluno"
        description="Preencha os dados do aluno sem sair da listagem."
      >
        <form onSubmit={salvarAluno} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome Completo
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
              <label className="mb-1 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={formulario.email}
                onChange={(event) =>
                  atualizarCampo("email", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Matrícula
              </label>
              <input
                value={formulario.matricula}
                onChange={(event) =>
                  atualizarCampo("matricula", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div>
              <label className="mb-1 block text-sm font-medium">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formulario.dataNascimento}
                onChange={(event) =>
                  atualizarCampo("dataNascimento", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
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
              Salvar Aluno
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
