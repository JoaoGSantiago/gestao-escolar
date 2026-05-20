"use client";

import { useState, useMemo } from "react";
import { useEscola, type Aluno } from "@/contexts/EscolaContext";
import { professoresMock } from "@/mocks/professores";
import { disciplinasMock } from "@/mocks/disciplinas";
import { turmasMock } from "@/mocks/turmas";
import { DataTable } from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/components/ui/DataTable";
import { FormModal } from "@/components/ui/FormModal";

export default function ProfessorAlunos() {
  // Usar o primeiro professor como padrão (simulando login)
  const professorId = professoresMock[0].id;
  const { alunos, notas, atualizarNota } = useEscola();
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
  const [editandoAb, setEditandoAb] = useState<string | null>(null);
  const [notasTemp, setNotasTemp] = useState<Record<string, number>>({
    AB1: 0,
    AB2: 0,
    AB3: 0,
    AB4: 0,
  });

  const professorInfo = useMemo(() => {
    const prof = professoresMock.find((p) => p.id === professorId);
    if (!prof) return null;

    const disciplina = disciplinasMock.find((d) => d.professorId === prof.id);
    const turma = turmasMock.find((t) => t.id === disciplina?.turmaId);
    const alunosDaTurma = alunos.filter((a) => a.turma === turma?.nome);

    return {
      professor: prof,
      disciplina,
      turma,
      alunosDaTurma,
    };
  }, [alunos, professorId]);

  const alunoDetalhes = useMemo(() => {
    if (!alunoSelecionado || !professorInfo) return null;
    return professorInfo.alunosDaTurma.find((a) => a.id === alunoSelecionado);
  }, [alunoSelecionado, professorInfo]);

  if (!professorInfo) {
    return (
      <div className="rounded-2xl bg-red-50 p-6">
        <p className="text-red-900">Professor não encontrado.</p>
      </div>
    );
  }

  const columns: DataTableColumn<Aluno>[] = [
    {
      key: "nome",
      header: "Nome",
      render: (aluno) => (
        <button
          onClick={() => setAlunoSelecionado(aluno.id)}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {aluno.nome}
        </button>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (aluno) => aluno.email,
    },
    {
      key: "id",
      header: "Matrícula",
      render: (aluno) => aluno.id,
    },
    {
      key: "status",
      header: "Status",
      render: (aluno) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            aluno.status === "Ativo"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {aluno.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Meus Alunos
        </h1>
        <p className="text-sm font-medium text-slate-500">
          {professorInfo.disciplina?.nome} - {professorInfo.turma?.nome}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={professorInfo.alunosDaTurma}
          rowKey={(aluno) => aluno.id}
        />
      </div>

      {/* Modal */}
      <FormModal
        open={!!alunoDetalhes}
        title={alunoDetalhes?.nome || ""}
        onClose={() => {
          setAlunoSelecionado(null);
          setEditandoAb(null);
        }}
      >
        <div className="space-y-6">
          {/* Informações do Aluno */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium text-slate-900">{alunoDetalhes?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Matrícula</p>
              <p className="font-medium text-slate-900">{alunoDetalhes?.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Turma</p>
              <p className="font-medium text-slate-900">{alunoDetalhes?.turma}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Data de Nascimento</p>
              <p className="font-medium text-slate-900">
                {alunoDetalhes?.dataNascimento
                  ? new Date(alunoDetalhes.dataNascimento).toLocaleDateString(
                      "pt-BR"
                    )
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  alunoDetalhes?.status === "Ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alunoDetalhes?.status}
              </span>
            </div>
          </div>

          {/* Seção de Notas */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-900 mb-4">
              Notas (AB1, AB2, AB3, AB4)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["AB1", "AB2", "AB3", "AB4"].map((ab) => {
                const notaData = notas.find(
                  (nota) =>
                    nota.alunoId === alunoDetalhes?.id &&
                    nota.disciplinaId === professorInfo?.disciplina?.id &&
                    nota.avaliacao === ab,
                );
                const valorAtual = notaData?.valor || 0;
                const isEditing = editandoAb === ab;

                return (
                  <div key={ab} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-700">
                        {ab}
                      </label>
                      <span className="text-sm font-bold text-indigo-600">
                        {valorAtual.toFixed(1)}
                      </span>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={notasTemp[ab]}
                          onChange={(e) =>
                            setNotasTemp((prev) => ({
                              ...prev,
                              [ab]: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditandoAb(ab);
                          setNotasTemp((prev) => ({
                            ...prev,
                            [ab]: valorAtual,
                          }));
                        }}
                        className="w-full rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botões de ação quando em edição */}
            {editandoAb && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    const notaValue = notasTemp[editandoAb];
                    if (notaValue < 0 || notaValue > 10) {
                      return;
                    }
                    if (!alunoDetalhes || !professorInfo.disciplina) return;
                    atualizarNota({
                      alunoId: alunoDetalhes.id,
                      disciplinaId: professorInfo.disciplina.id,
                      avaliacao: editandoAb,
                      valor: notaValue,
                      bimestre: 1,
                    });
                    setEditandoAb(null);
                  }}
                  className="flex-1 rounded bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditandoAb(null)}
                  className="flex-1 rounded bg-slate-300 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-400"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Botão Fechar */}
          <button
            onClick={() => {
              setAlunoSelecionado(null);
              setEditandoAb(null);
            }}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50"
          >
            Fechar
          </button>
        </div>
      </FormModal>
    </div>
  );
}
