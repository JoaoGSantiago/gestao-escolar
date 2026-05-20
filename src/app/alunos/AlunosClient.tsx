"use client";

import { useMemo, useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import {
  EmptyState,
  FormModal,
  PageTitle,
} from "../../../components/ui";
import { useEscola, type Aluno } from "@/contexts/EscolaContext";

type ModalAlunoState = {
  aberto: boolean;
  aluno: Aluno | null;
};

export default function AlunosClient() {
  const router = useRouter();
  const { alunos, adicionarAluno } = useEscola();
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalAluno, setModalAluno] = useState<ModalAlunoState>({
    aberto: false,
    aluno: null,
  });
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    matricula: "",
    dataNascimento: "",
    turma: "",
    status: "Ativo" as const,
  });

  const alunosAgrupados = useMemo(() => {
    const grupos: Record<string, Aluno[]> = {
      "6º Ano A": [],
      "7º Ano B": [],
      "1º Médio C": [],
    };

    alunos.forEach((aluno) => {
      if (aluno.turma in grupos) {
        grupos[aluno.turma].push(aluno);
      }
    });

    return grupos;
  }, [alunos]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModalCadastro() {
    setModalCadastro(false);
    setFormulario({
      nome: "",
      email: "",
      matricula: "",
      dataNascimento: "",
      turma: "",
      status: "Ativo",
    });
  }

  function fecharModalAluno() {
    setModalAluno({ aberto: false, aluno: null });
  }

  function salvarAluno(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarAluno(formulario);
    toast.success("Aluno cadastrado com sucesso!");
    fecharModalCadastro();
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
              onClick={() => setModalCadastro(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              <Plus className="h-5 w-5" /> Novo Aluno
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(alunosAgrupados).map(([turma, alunosTurma]) => (
              <button
                key={turma}
                onClick={() => router.push(`/alunos/turma/${encodeURIComponent(turma)}`)}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left cursor-pointer"
              >
                <h3 className="text-lg font-bold text-slate-900">{turma}</h3>
                <p className="text-sm text-slate-500 mt-2">
                  {alunosTurma.length} aluno{alunosTurma.length !== 1 ? "s" : ""}
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold">
                  <Users className="h-4 w-4" />
                  Ver alunos
                </div>
              </button>
            ))}
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
              aria-labelledby="modal-aluno-title"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="modal-aluno-title"
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

      <FormModal
        open={modalCadastro}
        onClose={fecharModalCadastro}
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
              <select
                value={formulario.turma}
                onChange={(event) =>
                  atualizarCampo("turma", event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-white p-3"
              >
                <option value="">Selecione uma turma</option>
                <option value="6º Ano A">6º Ano A</option>
                <option value="7º Ano B">7º Ano B</option>
                <option value="1º Médio C">1º Médio C</option>
              </select>
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
              onClick={fecharModalCadastro}
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
