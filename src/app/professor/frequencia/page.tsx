"use client";

import { useState, useMemo } from "react";
import { useEscola } from "@/contexts/EscolaContext";
import { professoresMock } from "@/mocks/professores";
import { disciplinasMock } from "@/mocks/disciplinas";
import { turmasMock } from "@/mocks/turmas";

export default function ProfessorFrequencia() {
  // Usar o primeiro professor como padrão (simulando login)
  const professorId = professoresMock[0].id;
  const { alunos, frequencias, atualizarFrequencia } = useEscola();
  const [editandoAluno, setEditandoAluno] = useState<string | null>(null);
  const [faltas, setFaltas] = useState<number>(0);

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

  if (!professorInfo) {
    return (
      <div className="rounded-2xl bg-red-50 p-6">
        <p className="text-red-900">Professor não encontrado.</p>
      </div>
    );
  }

  const handleSalvarFrequencia = (alunoId: string) => {
    const alunoFreq = professorInfo.alunosDaTurma.find((a) => a.id === alunoId);
    if (!alunoFreq || !professorInfo.disciplina) return;

    const aulasRegistradas = frequencias.find(
      (frequencia) =>
        frequencia.alunoId === alunoId &&
        frequencia.disciplinaId === professorInfo.disciplina?.id,
    );
    const aulasTotal = aulasRegistradas?.aulasPrevistas || 20;
    const presencas = aulasTotal - faltas;

    atualizarFrequencia({
      alunoId,
      disciplinaId: professorInfo.disciplina.id,
      presencas,
      faltas,
    });
    setEditandoAluno(null);
    setFaltas(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Registrar Frequência
        </h1>
        <p className="text-sm font-medium text-slate-500">
          {professorInfo.disciplina?.nome} - {professorInfo.turma?.nome}
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                Aluno
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                Aulas Previstas
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                Presenças
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                Faltas
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                Frequência %
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {professorInfo.alunosDaTurma.map((aluno) => {
              const freqData = frequencias.find(
                (frequencia) =>
                  frequencia.alunoId === aluno.id &&
                  frequencia.disciplinaId === professorInfo.disciplina?.id,
              );
              const aulasTotal = freqData?.aulasPrevistas || 20;
              const faltasAtual = freqData?.faltas || 0;
              const percentual = Math.round(
                ((aulasTotal - faltasAtual) / aulasTotal) * 100
              );
              const isEditing = editandoAluno === aluno.id;

              return (
                <tr
                  key={aluno.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-900">{aluno.nome}</td>
                  <td className="px-4 py-3 text-center text-sm text-slate-600">
                    {aulasTotal}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-slate-600">
                    {aulasTotal - faltasAtual}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max={aulasTotal}
                        value={faltas}
                        onChange={(e) => setFaltas(parseInt(e.target.value) || 0)}
                        className="w-16 rounded border border-slate-300 px-2 py-1 text-center text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="text-slate-600">{faltasAtual}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        percentual >= 75
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {percentual}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {isEditing ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleSalvarFrequencia(aluno.id)}
                          className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditandoAluno(null)}
                          className="rounded bg-slate-300 px-3 py-1 text-xs font-medium text-slate-900 hover:bg-slate-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditandoAluno(aluno.id);
                          setFaltas(faltasAtual);
                        }}
                        className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
