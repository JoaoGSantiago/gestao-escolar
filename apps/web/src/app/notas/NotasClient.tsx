"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChevronRight, Plus, X, School } from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";

type AlunoComNotas = {
  id: string;
  nome: string;
  turma: string;
  notas: {
    id: string;
    avaliacao: string;
    valor: number;
    bimestre: number;
  }[];
  media: number | null;
};

type NavigationStep = "turmas" | "disciplinas" | "notas";

type ModalState = {
  aberto: boolean;
  disciplinaId: string;
  disciplinaNome: string;
};

type FormularioNota = {
  alunoId: string;
  avaliacao: string;
  valor: string;
};

const avaliacoesPermitidas = ["AB1", "AB2", "AB3", "AB4"] as const;

const formularioInicial: FormularioNota = {
  alunoId: "",
  avaliacao: "AB1",
  valor: "",
};

function formatarMedia(media: number | null) {
  return media === null ? "--" : media.toFixed(1);
}

function classeMedia(media: number | null) {
  if (media === null) return "bg-slate-100 text-slate-500";
  if (media >= 7) return "bg-emerald-100 text-emerald-700";
  if (media >= 5) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

export default function NotasClient() {
  const { alunos, disciplinas, frequencias, notas, atualizarNota } = useEscola();
  const [step, setStep] = useState<NavigationStep>("turmas");
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [modal, setModal] = useState<ModalState>({
    aberto: false,
    disciplinaId: "",
    disciplinaNome: "",
  });
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formulario, setFormulario] =
    useState<FormularioNota>(formularioInicial);

  // Listar turmas únicas
  const turmas = useMemo(() => {
    return Array.from(new Set(alunos.map((a) => a.turma))).sort();
  }, [alunos]);

  // Disciplinas da turma selecionada
  const disciplinasDaTurma = useMemo(() => {
    if (!turmaSelecionada) return [];
    return disciplinas.filter((d) => d.turma === turmaSelecionada);
  }, [disciplinas, turmaSelecionada]);

  // Alunos com notas da disciplina selecionada
  const alunosComNotas = useMemo<AlunoComNotas[]>(() => {
    if (!modal.aberto || !modal.disciplinaId) return [];

    const disciplinaAtual = disciplinas.find((d) => d.id === modal.disciplinaId);
    if (!disciplinaAtual) return [];

    const alunosDaFrequencia = new Set(
      frequencias
        .filter((frequencia) => frequencia.disciplinaId === modal.disciplinaId)
        .map((frequencia) => frequencia.alunoId),
    );

    return alunos
      .filter(
        (aluno) =>
          aluno.turma === disciplinaAtual.turma ||
          alunosDaFrequencia.has(aluno.id),
      )
      .map((aluno) => {
        const notasDoAluno = notas
          .filter(
            (nota) =>
              nota.alunoId === aluno.id &&
              nota.disciplinaId === modal.disciplinaId &&
              avaliacoesPermitidas.includes(
                nota.avaliacao as (typeof avaliacoesPermitidas)[number],
              ),
          )
          .sort(
            (a, b) =>
              avaliacoesPermitidas.indexOf(
                a.avaliacao as (typeof avaliacoesPermitidas)[number],
              ) -
              avaliacoesPermitidas.indexOf(
                b.avaliacao as (typeof avaliacoesPermitidas)[number],
              ),
          );

        const media =
          notasDoAluno.length > 0
            ? notasDoAluno.reduce((total, nota) => total + nota.valor, 0) /
              notasDoAluno.length
            : null;

        return {
          id: aluno.id,
          nome: aluno.nome,
          turma: aluno.turma,
          notas: notasDoAluno,
          media,
        };
      });
  }, [alunos, disciplinas, frequencias, modal, notas]);

  function abrirModal(disciplinaId: string, disciplinaNome: string) {
    setModal({ aberto: true, disciplinaId, disciplinaNome });
    setStep("notas");
  }

  function fecharModal() {
    setModal({ aberto: false, disciplinaId: "", disciplinaNome: "" });
    setFormularioAberto(false);
    setFormulario(formularioInicial);
  }

  function selecionarTurma(turma: string) {
    setTurmaSelecionada(turma);
    setStep("disciplinas");
  }

  function voltarTurmas() {
    setTurmaSelecionada("");
    setStep("turmas");
  }

  function fecharModalEVoltarDisciplinas() {
    setModal({ aberto: false, disciplinaId: "", disciplinaNome: "" });
  }

  function abrirFormularioNota(alunoId = "") {
    setFormulario({
      alunoId,
      avaliacao: "AB1",
      valor: "",
    });
    setFormularioAberto(true);
  }

  function atualizarCampo(campo: keyof FormularioNota, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  async function salvarNota(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valor = Number(formulario.valor);

    if (!formulario.alunoId) {
      return;
    }

    if (
      !avaliacoesPermitidas.includes(
        formulario.avaliacao as (typeof avaliacoesPermitidas)[number],
      )
    ) {
      return;
    }

    if (Number.isNaN(valor) || valor < 0 || valor > 10) {
      return;
    }

    try {
      await atualizarNota({
        alunoId: formulario.alunoId,
        disciplinaId: modal.disciplinaId,
        avaliacao: formulario.avaliacao,
        valor,
        bimestre: 1,
      });
      setFormularioAberto(false);
      setFormulario(formularioInicial);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao salvar nota.");
    }
  }

  const colunas: DataTableColumn<AlunoComNotas>[] = [
    {
      key: "aluno",
      header: "Aluno",
      render: (aluno) => (
        <div>
          <p className="font-semibold text-slate-900">{aluno.nome}</p>
          <p className="text-xs text-slate-400">{aluno.turma}</p>
        </div>
      ),
    },
    {
      key: "notas",
      header: "Notas",
      render: (aluno) => (
        <div className="flex max-w-xl flex-wrap gap-2">
          {avaliacoesPermitidas.map((avaliacao) => {
            const nota = aluno.notas.find(
              (item) => item.avaliacao === avaliacao,
            );

            return (
              <span
                key={avaliacao}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  nota
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {avaliacao}
                <strong className="text-slate-950">
                  {nota ? nota.valor.toFixed(1) : "--"}
                </strong>
              </span>
            );
          })}
        </div>
      ),
    },
    {
      key: "media",
      header: "Média",
      render: (aluno) => (
        <span
          className={`inline-flex min-w-14 justify-center rounded-full px-3 py-1 text-xs font-bold ${classeMedia(
            aluno.media,
          )}`}
        >
          {formatarMedia(aluno.media)}
        </span>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      render: (aluno) => (
        <button
          type="button"
          onClick={() => abrirFormularioNota(aluno.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          {step === "turmas" && (
            <>
              <PageTitle
                title="Notas"
                subtitle="Selecione uma turma para acessar as disciplinas e notas."
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {turmas.map((turma) => (
                  <button
                    key={turma}
                    onClick={() => selecionarTurma(turma)}
                    className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-indigo-500 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                          <School className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {turma}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {
                              alunos.filter((a) => a.turma === turma).length
                            }{" "}
                            alunos
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-indigo-600" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "disciplinas" && (
            <>
              <div className="flex items-center gap-4">
                <button
                  onClick={voltarTurmas}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  ← Voltar
                </button>
                <PageTitle
                  title={`Notas - ${turmaSelecionada}`}
                  subtitle="Selecione uma disciplina para ver as notas dos alunos."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {disciplinasDaTurma.map((disciplina) => {
                  const notasDaDisciplina = notas.filter(
                    (nota) =>
                      nota.disciplinaId === disciplina.id &&
                      avaliacoesPermitidas.includes(
                        nota.avaliacao as (typeof avaliacoesPermitidas)[number],
                      ),
                  );
                  const media =
                    notasDaDisciplina.length > 0
                      ? notasDaDisciplina.reduce(
                          (total, nota) => total + nota.valor,
                          0,
                        ) / notasDaDisciplina.length
                      : null;

                  return (
                    <button
                      key={disciplina.id}
                      onClick={() =>
                        abrirModal(disciplina.id, disciplina.nome)
                      }
                      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 inline-flex rounded-xl bg-indigo-50 p-2 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <h3 className="truncate text-lg font-bold text-slate-950">
                            {disciplina.nome}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {disciplina.cargaHoraria}h
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${classeMedia(
                            media,
                          )}`}
                        >
                          Média {formatarMedia(media)}
                        </span>
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-sm text-slate-500">
                          {notasDaDisciplina.length} notas lançadas
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {modal.aberto && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm"
          onClick={fecharModalEVoltarDisciplinas}
          role="presentation"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-notas-title"
            >
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2
                    id="modal-notas-title"
                    className="text-2xl font-bold text-slate-900"
                  >
                    Notas - {modal.disciplinaNome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Consulte as notas dos alunos e lance novas avaliações.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => abrirFormularioNota()}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Plus className="h-5 w-5" />
                    Adicionar nota
                  </button>
                  <button
                    type="button"
                    onClick={fecharModalEVoltarDisciplinas}
                    className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Fechar modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {formularioAberto && (
                <form
                  onSubmit={salvarNota}
                  className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_0.7fr_auto] md:items-end">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Aluno
                      </label>
                      <select
                        value={formulario.alunoId}
                        onChange={(event) =>
                          atualizarCampo("alunoId", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Selecione</option>
                        {alunosComNotas.map((aluno) => (
                          <option key={aluno.id} value={aluno.id}>
                            {aluno.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Avaliação
                      </label>
                      <select
                        value={formulario.avaliacao}
                        onChange={(event) =>
                          atualizarCampo("avaliacao", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {avaliacoesPermitidas.map((av) => (
                          <option key={av} value={av}>
                            {av}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nota (0-10)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={formulario.valor}
                        onChange={(event) =>
                          atualizarCampo("valor", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormularioAberto(false);
                          setFormulario(formularioInicial);
                        }}
                        className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {alunosComNotas.length > 0 ? (
                <DataTable
                  data={alunosComNotas}
                  columns={colunas}
                  rowKey={(aluno) => aluno.id}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    Nenhum aluno encontrado para esta disciplina.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
