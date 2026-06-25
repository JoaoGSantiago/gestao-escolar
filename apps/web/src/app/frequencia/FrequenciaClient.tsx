"use client";

import { useState, useMemo } from "react";
import { Check, X, School, BookOpen, ChevronRight } from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";

type AlunoComFrequencia = {
  id: string;
  alunoId: string;
  alunoNome: string;
  aulasPrevistas: number;
  presencas: number;
  faltas: number;
  percentual: number;
};

type NavigationStep = "turmas" | "disciplinas" | "frequencia";

type ModalState = {
  aberto: boolean;
  disciplinaId: string;
  disciplinaNome: string;
};

export default function FrequenciaClient() {
  const { alunos, disciplinas, frequencias, atualizarFrequencia } =
    useEscola();
  const [step, setStep] = useState<NavigationStep>("turmas");
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [modal, setModal] = useState<ModalState>({
    aberto: false,
    disciplinaId: "",
    disciplinaNome: "",
  });

  const [editando, setEditando] = useState<string | null>(null);
  const [frequenciaTemp, setFrequenciaTemp] = useState<Record<string, number>>({});

  // Listar turmas únicas
  const turmas = useMemo(() => {
    return Array.from(new Set(alunos.map((a) => a.turma))).sort();
  }, [alunos]);

  // Disciplinas da turma selecionada
  const disciplinasDaTurma = useMemo(() => {
    if (!turmaSelecionada) return [];
    return disciplinas.filter((d) => d.turma === turmaSelecionada);
  }, [disciplinas, turmaSelecionada]);

  // Frequências dos alunos para a disciplina selecionada
  const alunosComFrequencia = useMemo<AlunoComFrequencia[]>(() => {
    if (!modal.aberto || !modal.disciplinaId) return [];

    const disciplinaAtual = disciplinas.find((d) => d.id === modal.disciplinaId);
    if (!disciplinaAtual) return [];

    return frequencias
      .filter((freq) => freq.disciplinaId === modal.disciplinaId)
      .map((freq) => {
        const aluno = alunos.find((a) => a.id === freq.alunoId);
        return {
          id: freq.id,
          alunoId: freq.alunoId,
          alunoNome: aluno?.nome ?? "Aluno não encontrado",
          aulasPrevistas: freq.aulasPrevistas,
          presencas: freq.presencas,
          faltas: freq.faltas,
          percentual: freq.percentual,
        };
      });
  }, [modal, disciplinas, frequencias, alunos]);

  function selecionarTurma(turma: string) {
    setTurmaSelecionada(turma);
    setStep("disciplinas");
  }

  function voltarTurmas() {
    setTurmaSelecionada("");
    setStep("turmas");
  }

  function abrirModal(disciplinaId: string, disciplinaNome: string) {
    setModal({ aberto: true, disciplinaId, disciplinaNome });
    setStep("frequencia");
  }

  function fecharModal() {
    setModal({ aberto: false, disciplinaId: "", disciplinaNome: "" });
    setEditando(null);
    setFrequenciaTemp({});
  }

  const handleEditar = (freqId: string) => {
    setEditando(freqId);
    const freq = alunosComFrequencia.find((f) => f.id === freqId);
    if (freq) {
      setFrequenciaTemp((prev) => ({
        ...prev,
        [freqId]: freq.faltas || 0,
      }));
    }
  };

  const handleSalvar = async (freqId: string) => {
    const freq = alunosComFrequencia.find((f) => f.id === freqId);
    if (!freq) return;

    const novasFaltas = frequenciaTemp[freqId];

    if (novasFaltas < 0 || novasFaltas > freq.aulasPrevistas) {
      return;
    }

    const presencas = freq.aulasPrevistas - novasFaltas;

    try {
      await atualizarFrequencia({
        alunoId: freq.alunoId,
        disciplinaId: modal.disciplinaId,
        presencas,
        faltas: novasFaltas,
      });
      setEditando(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao salvar frequência.");
    }
  };

  const colunas: DataTableColumn<AlunoComFrequencia>[] = [
    {
      key: "alunoNome",
      header: "Aluno",
      render: (freq) => (
        <div>
          <p className="font-semibold text-slate-900">{freq.alunoNome}</p>
        </div>
      ),
    },
    {
      key: "aulasPrevistas",
      header: "Aulas Previstas",
      render: (freq) => (
        <span className="font-medium text-slate-700">{freq.aulasPrevistas}</span>
      ),
    },
    {
      key: "presencas",
      header: "Presenças",
      render: (freq) => (
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {freq.presencas}
        </span>
      ),
    },
    {
      key: "faltas",
      header: "Faltas",
      render: (freq) =>
        editando === freq.id ? (
          <input
            type="number"
            min="0"
            max={freq.aulasPrevistas}
            value={frequenciaTemp[freq.id] || 0}
            onChange={(e) =>
              setFrequenciaTemp((prev) => ({
                ...prev,
                [freq.id]: Number(e.target.value),
              }))
            }
            className="w-20 rounded border border-slate-300 px-2 py-1"
          />
        ) : (
          <span className="text-sm font-semibold text-slate-700">
            {freq.faltas}
          </span>
        ),
    },
    {
      key: "percentual",
      header: "Frequência %",
      render: (freq) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
            freq.percentual >= 75
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {freq.percentual.toFixed(1)}%
        </span>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      render: (freq) =>
        editando === freq.id ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSalvar(freq.id)}
              className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" /> Salvar
            </button>
            <button
              onClick={() => setEditando(null)}
              className="rounded bg-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-400"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEditar(freq.id)}
            className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Editar
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
                title="Frequência"
                subtitle="Selecione uma turma para acompanhar a frequência dos alunos."
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {turmas.map((turma) => (
                  <button
                    key={turma}
                    onClick={() => selecionarTurma(turma)}
                    className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-blue-500 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
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
                      <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-600" />
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
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  ← Voltar
                </button>
                <PageTitle
                  title={`Frequência - ${turmaSelecionada}`}
                  subtitle="Selecione uma disciplina para gerenciar a frequência."
                />
              </div>

              <div className="space-y-4">
                {disciplinasDaTurma.map((disciplina) => (
                  <button
                    key={disciplina.id}
                    onClick={() =>
                      abrirModal(disciplina.id, disciplina.nome)
                    }
                    className="group w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {disciplina.nome}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Carga horária: {disciplina.cargaHoraria}h
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {modal.aberto && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm"
          onClick={fecharModal}
          role="presentation"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-frequencia-title"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="modal-frequencia-title"
                    className="text-2xl font-bold text-slate-900"
                  >
                    Frequência - {modal.disciplinaNome}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Gerencie a frequência dos alunos nesta disciplina.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fecharModal}
                  className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Fechar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {alunosComFrequencia.length > 0 ? (
                <div className="overflow-x-auto">
                  <DataTable
                    data={alunosComFrequencia}
                    columns={colunas}
                    rowKey={(freq) => freq.id}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    Nenhum registro de frequência para esta disciplina.
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
