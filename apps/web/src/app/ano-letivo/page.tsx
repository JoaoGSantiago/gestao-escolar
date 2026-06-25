"use client";

import { useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  GraduationCap,
  Loader2,
  XCircle,
  School,
  ChevronRight,
} from "lucide-react";
import { Button, PageShell, PageTitle } from "../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";
import {
  aprovarAluno,
  buscarBoletim,
  encerrarAno,
  type Boletim,
  type RelatorioEncerramento,
} from "@/services/academicoService";

type NavigationStep = "turmas" | "alunos" | "boletim";

function corSituacao(situacao: string) {
  if (situacao === "Aprovado" || situacao === "APROVADO")
    return "bg-emerald-50 text-emerald-700";
  if (situacao === "Recuperação") return "bg-amber-50 text-amber-700";
  if (situacao === "FORMADO") return "bg-indigo-50 text-indigo-700";
  return "bg-red-50 text-red-700";
}

export default function AnoLetivoPage() {
  const { turmas, alunos } = useEscola();

  const [step, setStep] = useState<NavigationStep>("turmas");
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
  const [alunoId, setAlunoId] = useState("");
  const [boletim, setBoletim] = useState<Boletim | null>(null);
  const [carregandoBoletim, setCarregandoBoletim] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [turmaIdEncerramento, setTurmaIdEncerramento] = useState("");
  const [relatorio, setRelatorio] = useState<RelatorioEncerramento | null>(null);
  const [encerrando, setEncerrando] = useState(false);

  // Listar turmas únicas
  const turmasUnicas = useMemo(() => {
    return Array.from(new Set(alunos.map((a) => a.turma))).sort();
  }, [alunos]);

  // Alunos da turma selecionada
  const alunosDaTurma = useMemo(() => {
    if (!turmaSelecionada) return [];
    return alunos
      .filter((a) => a.turma === turmaSelecionada)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [alunos, turmaSelecionada]);

  function selecionarTurma(turma: string) {
    setTurmaSelecionada(turma);
    setAlunoId("");
    setBoletim(null);
    setStep("alunos");
  }

  function voltarTurmas() {
    setTurmaSelecionada("");
    setStep("turmas");
  }

  function selecionarAluno(id: string) {
    setAlunoId(id);
    setStep("boletim");
  }

  async function verBoletim() {
    if (!alunoId) return;
    setCarregandoBoletim(true);
    setMensagem(null);
    try {
      setBoletim(await buscarBoletim(alunoId));
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Erro ao buscar boletim.");
      setBoletim(null);
    } finally {
      setCarregandoBoletim(false);
    }
  }

  async function promover() {
    if (!boletim) return;
    setMensagem(null);
    try {
      const r = await aprovarAluno(boletim.aluno.id);
      setMensagem(
        r.situacao === "FORMADO"
          ? `🎓 ${r.nome} concluiu o Ensino Médio (FORMADO)!`
          : `✅ ${r.nome} promovido(a) para ${r.turmaDestino}.`,
      );
      setBoletim(null);
      setAlunoId("");
      setStep("alunos");
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Erro ao aprovar aluno.");
    }
  }

  async function encerrar() {
    if (!turmaIdEncerramento) return;
    setEncerrando(true);
    setRelatorio(null);
    try {
      setRelatorio(await encerrarAno(turmaIdEncerramento));
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Erro ao encerrar o ano.");
    } finally {
      setEncerrando(false);
    }
  }

  return (
    <PageShell>
      {step === "turmas" && (
        <>
          <PageTitle
            title="Ano Letivo"
            subtitle="Selecione uma turma para acompanhar o boletim dos alunos."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {turmasUnicas.map((turma) => {
              const alunosDaTurma = alunos.filter((a) => a.turma === turma);

              return (
                <button
                  key={turma}
                  onClick={() => selecionarTurma(turma)}
                  className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-slate-400 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-100 p-3 text-slate-600 transition group-hover:bg-slate-600 group-hover:text-white">
                        <School className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {turma}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {alunosDaTurma.length} alunos
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-slate-600" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seção de encerramento do ano */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Award className="h-5 w-5 text-emerald-600" /> Encerrar ano letivo
              da turma
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Avalia todos os alunos da turma e promove automaticamente os
              aprovados (média ≥ 6 e frequência ≥ 75%) para a série seguinte.
            </p>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="mb-1 block text-sm font-semibold text-slate-600">
                  Turma
                </span>
                <select
                  value={turmaIdEncerramento}
                  onChange={(e) => setTurmaIdEncerramento(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-emerald-400"
                >
                  <option value="">Selecione uma turma...</option>
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} — {t.turno}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="button"
                tone="emerald"
                onClick={encerrar}
                disabled={!turmaIdEncerramento}
              >
                {encerrando ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Encerrar ano"
                )}
              </Button>
            </div>

            {relatorio && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-slate-500">
                  Turma <strong>{relatorio.turma.nome}</strong> —{" "}
                  {relatorio.totalAvaliados} alunos avaliados.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <ResultadoCard
                    titulo="Aprovados"
                    cor="emerald"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    itens={relatorio.aprovados.map(
                      (a) => `${a.nome} → ${a.turmaDestino ?? "próxima série"}`,
                    )}
                  />
                  <ResultadoCard
                    titulo="Formados"
                    cor="indigo"
                    icon={<GraduationCap className="h-5 w-5" />}
                    itens={relatorio.formados.map((a) => a.nome)}
                  />
                  <ResultadoCard
                    titulo="Reprovados"
                    cor="red"
                    icon={<XCircle className="h-5 w-5" />}
                    itens={relatorio.reprovados.map(
                      (a) => `${a.nome} (média ${a.mediaGeral})`,
                    )}
                  />
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {step === "alunos" && (
        <>
          <div className="flex items-center gap-4">
            <button
              onClick={voltarTurmas}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              ← Voltar
            </button>
            <PageTitle
              title={`Alunos - ${turmaSelecionada}`}
              subtitle="Selecione um aluno para ver o boletim."
            />
          </div>

          {mensagem && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              {mensagem}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alunosDaTurma.map((aluno) => (
              <button
                key={aluno.id}
                onClick={() => selecionarAluno(aluno.id)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-lg hover:border-indigo-300"
              >
                <div>
                  <p className="font-semibold text-slate-900">{aluno.nome}</p>
                  <p className="text-sm text-slate-500">{aluno.turma}</p>
                </div>
                <div className="mt-3">
                  <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-indigo-600" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "boletim" && (
        <>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep("alunos")}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              ← Voltar
            </button>
            <PageTitle
              title="Boletim do Aluno"
              subtitle="Consulte o boletim e aprove para promoção."
            />
          </div>

          {mensagem && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              {mensagem}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button type="button" onClick={verBoletim} disabled={!alunoId}>
              {carregandoBoletim ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Ver boletim"
              )}
            </Button>
          </div>

          {boletim && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-sm text-slate-500">
                  Média geral:{" "}
                  <strong className="text-slate-800">
                    {boletim.mediaGeral}
                  </strong>
                </span>
                <span className="text-sm text-slate-500">
                  Frequência:{" "}
                  <strong className="text-slate-800">
                    {boletim.frequenciaGeral}%
                  </strong>
                </span>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-bold ${corSituacao(
                    boletim.situacaoProjetada,
                  )}`}
                >
                  {boletim.situacaoProjetada}
                </span>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="py-2">Disciplina</th>
                    <th className="py-2">Média</th>
                    <th className="py-2">Frequência</th>
                    <th className="py-2">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boletim.disciplinas.map((d) => (
                    <tr key={d.disciplinaId}>
                      <td className="py-2 font-medium text-slate-700">
                        {d.nome}
                      </td>
                      <td className="py-2 text-slate-600">{d.media}</td>
                      <td className="py-2 text-slate-600">{d.frequencia}%</td>
                      <td className="py-2">
                        <span
                          className={`rounded-lg px-2 py-1 text-xs font-semibold ${corSituacao(
                            d.situacao,
                          )}`}
                        >
                          {d.situacao}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {boletim.situacaoProjetada === "APROVADO" && (
                <div className="mt-4">
                  <Button
                    type="button"
                    tone="emerald"
                    onClick={promover}
                    icon={<Award className="h-5 w-5" />}
                  >
                    Aprovar e promover
                  </Button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </PageShell>
  );
}

function ResultadoCard({
  titulo,
  cor,
  icon,
  itens,
}: {
  titulo: string;
  cor: "emerald" | "indigo" | "red";
  icon: React.ReactNode;
  itens: string[];
}) {
  const cores: Record<string, string> = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    red: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${cores[cor]}`}>
      <div className="flex items-center gap-2 font-bold">
        {icon} {titulo} ({itens.length})
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {itens.length === 0 ? (
          <li className="opacity-60">—</li>
        ) : (
          itens.map((t) => <li key={t}>{t}</li>)
        )}
      </ul>
    </div>
  );
}
