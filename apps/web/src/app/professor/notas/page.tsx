"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { useEscola } from "@/contexts/EscolaContext";
import { useProfessorAtual } from "../useProfessorAtual";

const AVALIACOES = ["AB1", "AB2", "AB3", "AB4"] as const;
type Avaliacao = (typeof AVALIACOES)[number];

export default function ProfessorNotas() {
  const { atualizarNota } = useEscola();
  const { professor, disciplinas, alunos, notas } = useProfessorAtual();

  const [disciplinaId, setDisciplinaId] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [temp, setTemp] = useState<Record<Avaliacao, string>>({
    AB1: "",
    AB2: "",
    AB3: "",
    AB4: "",
  });
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
        const notasAluno = notas.filter(
          (n) => n.alunoId === aluno.id && n.disciplinaId === disciplinaId,
        );
        const valores: Record<Avaliacao, number | null> = {
          AB1: null,
          AB2: null,
          AB3: null,
          AB4: null,
        };
        notasAluno.forEach((n) => {
          if ((AVALIACOES as readonly string[]).includes(n.avaliacao)) {
            valores[n.avaliacao as Avaliacao] = n.valor;
          }
        });
        const lancadas = AVALIACOES.map((av) => valores[av]).filter(
          (v): v is number => v !== null,
        );
        const media =
          lancadas.length > 0
            ? lancadas.reduce((t, v) => t + v, 0) / lancadas.length
            : null;
        return { alunoId: aluno.id, nome: aluno.nome, valores, media };
      });
  }, [alunos, disciplinaAtual, notas, disciplinaId]);

  function iniciarEdicao(linha: (typeof linhas)[number]) {
    setEditando(linha.alunoId);
    setTemp({
      AB1: linha.valores.AB1?.toString() ?? "",
      AB2: linha.valores.AB2?.toString() ?? "",
      AB3: linha.valores.AB3?.toString() ?? "",
      AB4: linha.valores.AB4?.toString() ?? "",
    });
  }

  async function salvar(alunoId: string) {
    setSalvando(true);
    try {
      for (const av of AVALIACOES) {
        const bruto = temp[av];
        if (bruto === "") continue;
        const valor = Number(bruto);
        if (Number.isNaN(valor) || valor < 0 || valor > 10) continue;
        await atualizarNota({
          alunoId,
          disciplinaId,
          avaliacao: av,
          valor,
          bimestre: 1,
        });
      }
      setEditando(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao salvar notas.");
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
        title="Lançar Notas"
        subtitle="Selecione uma disciplina e registre as avaliações (AB1 a AB4)."
      />

      <select
        value={disciplinaId}
        onChange={(e) => {
          setDisciplinaId(e.target.value);
          setEditando(null);
        }}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-indigo-400"
      >
        {disciplinas.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nome} — {d.turma}
          </option>
        ))}
      </select>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="p-4">Aluno</th>
              {AVALIACOES.map((av) => (
                <th key={av} className="p-4">
                  {av}
                </th>
              ))}
              <th className="p-4">Média</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {linhas.map((linha) => (
              <tr key={linha.alunoId}>
                <td className="p-4 font-semibold text-slate-900">
                  {linha.nome}
                </td>
                {AVALIACOES.map((av) => (
                  <td key={av} className="p-4">
                    {editando === linha.alunoId ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={temp[av]}
                        onChange={(e) =>
                          setTemp((t) => ({ ...t, [av]: e.target.value }))
                        }
                        className="w-16 rounded border border-slate-300 px-2 py-1"
                      />
                    ) : (
                      <span className="text-slate-700">
                        {linha.valores[av] === null
                          ? "--"
                          : linha.valores[av]?.toFixed(1)}
                      </span>
                    )}
                  </td>
                ))}
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      linha.media === null
                        ? "bg-slate-100 text-slate-500"
                        : linha.media >= 6
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {linha.media === null ? "--" : linha.media.toFixed(1)}
                  </span>
                </td>
                <td className="p-4">
                  {editando === linha.alunoId ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={salvando}
                        onClick={() => salvar(linha.alunoId)}
                        className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Salvar
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
                      onClick={() => iniciarEdicao(linha)}
                      className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Lançar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {linhas.length === 0 && (
              <tr>
                <td
                  colSpan={AVALIACOES.length + 3}
                  className="p-8 text-center text-slate-500"
                >
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
