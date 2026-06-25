"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { PageTitle } from "@/components/ui/PageTitle";
import { useEscola } from "@/contexts/EscolaContext";
import { useProfessorAtual } from "../useProfessorAtual";

export default function ProfessorFrequencia() {
  const { atualizarFrequencia } = useEscola();
  const { professor, disciplinas, alunos, frequencias } = useProfessorAtual();

  const [disciplinaId, setDisciplinaId] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [faltasTemp, setFaltasTemp] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!disciplinaId && disciplinas.length > 0) {
      setDisciplinaId(disciplinas[0].id);
    }
  }, [disciplinas, disciplinaId]);

  const disciplinaAtual = disciplinas.find((d) => d.id === disciplinaId);

  const linhas = useMemo(() => {
    if (!disciplinaAtual) return [];
    return alunos
      .filter((a) => a.turmaId === disciplinaAtual.turmaId)
      .map((aluno) => {
        const freq = frequencias.find(
          (f) => f.alunoId === aluno.id && f.disciplinaId === disciplinaId,
        );
        return {
          alunoId: aluno.id,
          nome: aluno.nome,
          aulasPrevistas: freq?.aulasPrevistas ?? 40,
          presencas: freq?.presencas ?? 0,
          faltas: freq?.faltas ?? 0,
          percentual: freq?.percentual ?? 0,
        };
      });
  }, [alunos, disciplinaAtual, frequencias, disciplinaId]);

  async function salvar(linha: (typeof linhas)[number]) {
    if (faltasTemp < 0 || faltasTemp > linha.aulasPrevistas) return;
    setSalvando(true);
    try {
      await atualizarFrequencia({
        alunoId: linha.alunoId,
        disciplinaId,
        presencas: linha.aulasPrevistas - faltasTemp,
        faltas: faltasTemp,
      });
      setEditando(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao salvar frequência.");
    } finally {
      setSalvando(false);
    }
  }

  if (!professor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Carregando seus dados de professor...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Registrar Frequência"
        subtitle="Selecione uma disciplina e ajuste as faltas dos alunos."
      />

      <select
        value={disciplinaId}
        onChange={(e) => {
          setDisciplinaId(e.target.value);
          setEditando(null);
        }}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-indigo-400"
      >
        {disciplinas.map((d) => {
          const turmaNome = d.turma;
          return (
            <option key={d.id} value={d.id}>
              {d.nome} — {turmaNome}
            </option>
          );
        })}
      </select>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="p-4">Aluno</th>
              <th className="p-4">Aulas</th>
              <th className="p-4">Presenças</th>
              <th className="p-4">Faltas</th>
              <th className="p-4">Frequência</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {linhas.map((linha) => (
              <tr key={linha.alunoId}>
                <td className="p-4 font-semibold text-slate-900">
                  {linha.nome}
                </td>
                <td className="p-4 text-slate-600">{linha.aulasPrevistas}</td>
                <td className="p-4 text-slate-600">
                  {editando === linha.alunoId
                    ? linha.aulasPrevistas - faltasTemp
                    : linha.presencas}
                </td>
                <td className="p-4">
                  {editando === linha.alunoId ? (
                    <input
                      type="number"
                      min="0"
                      max={linha.aulasPrevistas}
                      value={faltasTemp}
                      onChange={(e) => setFaltasTemp(Number(e.target.value))}
                      className="w-20 rounded border border-slate-300 px-2 py-1"
                    />
                  ) : (
                    <span className="font-semibold text-slate-700">
                      {linha.faltas}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      linha.percentual >= 75
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {linha.percentual.toFixed(1)}%
                  </span>
                </td>
                <td className="p-4">
                  {editando === linha.alunoId ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={salvando}
                        onClick={() => salvar(linha)}
                        className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <Check className="h-4 w-4" /> Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditando(null)}
                        className="rounded bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(linha.alunoId);
                        setFaltasTemp(linha.faltas);
                      }}
                      className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Nenhum aluno nesta disciplina.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
