"use client";

import { useMemo, useState } from "react";
import { BarChart3, ClipboardPlus, Plus, X } from "lucide-react";
import { useEscola, type Aluno } from "@/contexts/EscolaContext";
import { professoresMock } from "@/mocks/professores";
import { disciplinasMock } from "@/mocks/disciplinas";
import { turmasMock } from "@/mocks/turmas";

type NotaAluno = {
  id: string;
  avaliacao: string;
  valor: number;
  bimestre: number;
};

type AlunoComNotas = Aluno & {
  notasDaDisciplina: NotaAluno[];
  media: number | null;
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

export default function ProfessorNotas() {
  const professorId = professoresMock[0].id;
  const { alunos, notas, atualizarNota } = useEscola();
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formulario, setFormulario] =
    useState<FormularioNota>(formularioInicial);

  const professorInfo = useMemo(() => {
    const professor = professoresMock.find((item) => item.id === professorId);
    const disciplina = disciplinasMock.find(
      (item) => item.professorId === professor?.id,
    );
    const turma = turmasMock.find((item) => item.id === disciplina?.turmaId);

    if (!professor || !disciplina || !turma) return null;

    const alunosDaTurma: AlunoComNotas[] = alunos
      .filter((aluno) => aluno.turma === turma.nome)
      .map((aluno) => {
        const notasDaDisciplina = notas
          .filter(
            (nota) =>
              nota.alunoId === aluno.id &&
              nota.disciplinaId === disciplina.id &&
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
          notasDaDisciplina.length > 0
            ? notasDaDisciplina.reduce((total, nota) => total + nota.valor, 0) /
              notasDaDisciplina.length
            : null;

        return {
          ...aluno,
          notasDaDisciplina,
          media,
        };
      });

    const todasAsNotas = alunosDaTurma.flatMap(
      (aluno) => aluno.notasDaDisciplina,
    );
    const mediaTurma =
      todasAsNotas.length > 0
        ? todasAsNotas.reduce((total, nota) => total + nota.valor, 0) /
          todasAsNotas.length
        : null;

    return {
      professor,
      disciplina,
      turma,
      alunosDaTurma,
      mediaTurma,
      totalNotas: todasAsNotas.length,
    };
  }, [alunos, notas, professorId]);

  if (!professorInfo) {
    return (
      <div className="rounded-2xl bg-red-50 p-6">
        <p className="text-red-900">Professor nao encontrado.</p>
      </div>
    );
  }

  function abrirFormulario(alunoId = "") {
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

  function salvarNota(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valor = Number(formulario.valor);
    const disciplinaId = professorInfo?.disciplina.id;

    if (!disciplinaId) {
      return;
    }

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

    atualizarNota({
      alunoId: formulario.alunoId,
      disciplinaId,
      avaliacao: formulario.avaliacao,
      valor,
      bimestre: 1,
    });

    setFormulario(formularioInicial);
    setFormularioAberto(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Registrar Notas
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {professorInfo.disciplina.nome} - {professorInfo.turma.nome}
          </p>
        </div>

        <button
          type="button"
          onClick={() => abrirFormulario()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <ClipboardPlus className="h-5 w-5" />
          Adicionar nota
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Alunos</p>
          <strong className="mt-2 block text-3xl text-slate-950">
            {professorInfo.alunosDaTurma.length}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Notas lancadas</p>
          <strong className="mt-2 block text-3xl text-slate-950">
            {professorInfo.totalNotas}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Media da turma</p>
          <strong
            className={`mt-2 inline-flex rounded-full px-4 py-2 text-xl ${classeMedia(
              professorInfo.mediaTurma,
            )}`}
          >
            {formatarMedia(professorInfo.mediaTurma)}
          </strong>
        </div>
      </div>

      {formularioAberto ? (
        <form
          onSubmit={salvarNota}
          className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900">Nova nota</h2>
              <p className="text-sm text-slate-500">
                Lance uma avaliacao para qualquer aluno da turma.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormularioAberto(false)}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label="Fechar formulario"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_0.7fr_auto] md:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Aluno
              </label>
              <select
                value={formulario.alunoId}
                onChange={(event) => atualizarCampo("alunoId", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Selecione</option>
                {professorInfo.alunosDaTurma.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Avaliacao
              </label>
              <select
                value={formulario.avaliacao}
                onChange={(event) =>
                  atualizarCampo("avaliacao", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {avaliacoesPermitidas.map((avaliacao) => (
                  <option key={avaliacao} value={avaliacao}>
                    {avaliacao}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nota
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formulario.valor}
                onChange={(event) => atualizarCampo("valor", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Notas dos alunos
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-white">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Aluno
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Notas
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Media
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Acao
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {professorInfo.alunosDaTurma.map((aluno) => (
                <tr key={aluno.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{aluno.nome}</p>
                    <p className="text-xs text-slate-400">{aluno.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex max-w-xl flex-wrap gap-2">
                      {avaliacoesPermitidas.map((avaliacao) => {
                        const nota = aluno.notasDaDisciplina.find(
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
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex min-w-14 justify-center rounded-full px-3 py-1 text-xs font-bold ${classeMedia(
                        aluno.media,
                      )}`}
                    >
                      {formatarMedia(aluno.media)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => abrirFormulario(aluno.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar nota
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
