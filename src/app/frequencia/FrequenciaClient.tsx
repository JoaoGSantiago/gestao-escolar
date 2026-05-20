"use client";

import { useState, useMemo } from "react";
import { BookOpen, Edit2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { DataTable, PageTitle } from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { frequenciaMock, type Frequencia } from "../../../mocks/frequencia";
import { alunosMock } from "../../../mocks/alunos";
import { disciplinasMock } from "../../../mocks/disciplinas";
import { useEscola } from "@/contexts/EscolaContext";

type AlunoComFrequencia = Frequencia & {
  alunoNome: string;
};

type ModalState = {
  aberto: boolean;
  disciplinaId: string;
  disciplinaNome: string;
};

export default function FrequenciaClient() {
  const { atualizarFrequencia } = useEscola();
  const [modal, setModal] = useState<ModalState>({
    aberto: false,
    disciplinaId: "",
    disciplinaNome: "",
  });

  const [editando, setEditando] = useState<string | null>(null);
  const [frequenciaTemp, setFrequenciaTemp] = useState<Record<string, number>>({});

  // Buscar alunos e frequência para o modal
  const alunosComFrequencia = useMemo(() => {
    if (!modal.aberto || !modal.disciplinaId) return [];

    const disciplina = disciplinasMock.find((d) => d.id === modal.disciplinaId);
    if (!disciplina) return [];

    return frequenciaMock
      .filter((freq) => freq.disciplinaId === modal.disciplinaId)
      .map((freq) => ({
        ...freq,
        alunoNome:
          alunosMock.find((aluno) => aluno.id === freq.alunoId)?.nome ??
          "Aluno não encontrado",
      }));
  }, [modal]);

  const abrirModal = (disciplinaId: string, disciplinaNome: string) => {
    setModal({ aberto: true, disciplinaId, disciplinaNome });
  };

  const fecharModal = () => {
    setModal({ aberto: false, disciplinaId: "", disciplinaNome: "" });
    setEditando(null);
    setFrequenciaTemp({});
  };

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

  const handleSalvar = (freqId: string) => {
    const freq = alunosComFrequencia.find((f) => f.id === freqId);
    if (!freq) return;

    const novasFaltas = frequenciaTemp[freqId];

    if (novasFaltas < 0 || novasFaltas > freq.aulasPrevistas) {
      toast.error(`Faltas deve estar entre 0 e ${freq.aulasPrevistas}`);
      return;
    }

    const presencas = freq.aulasPrevistas - novasFaltas;

    atualizarFrequencia({
      alunoId: freq.alunoId,
      disciplinaId: freq.disciplinaId,
      presencas,
      faltas: novasFaltas,
    });

    toast.success("Frequência atualizada com sucesso!");
    setEditando(null);
  };

  const colunas: DataTableColumn<AlunoComFrequencia>[] = [
    {
      key: "alunoNome",
      header: "Aluno",
      render: (freq) => freq.alunoNome,
    },
    {
      key: "aulasPrevistas",
      header: "Aulas",
      render: (freq) => freq.aulasPrevistas,
    },
    {
      key: "presencas",
      header: "Presenças",
      render: (freq) => freq.presencas,
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
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            freq.percentual >= 75
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
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
              className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
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
          <PageTitle
            title="Frequência"
            subtitle="Acompanhamento da frequência dos alunos por disciplina."
          />

          <div className="space-y-4">
            {disciplinasMock.map((disciplina) => (
              <div
                key={disciplina.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {disciplina.nome}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Carga horária: {disciplina.cargaHoraria}h
                    </p>
                  </div>
                  <button
                    onClick={() => abrirModal(disciplina.id, disciplina.nome)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Frequência
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
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
                    Gerencie a frequência dos alunos
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
                <DataTable
                  data={alunosComFrequencia}
                  columns={colunas}
                  rowKey={(freq) => freq.id}
                />
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
