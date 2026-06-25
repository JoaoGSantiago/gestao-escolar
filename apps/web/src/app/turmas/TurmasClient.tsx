"use client";

import { useMemo, useState } from "react";
import {
  Book,
  ChevronRight,
  Clock,
  Plus,
  School,
  User,
} from "lucide-react";
import {
  Button,
  FormActions,
  FormModal,
  PageShell,
  PageTitle,
  SelectField,
  TextField,
} from "../../../components/ui";
import { useEscola, type Turma } from "@/contexts/EscolaContext";

const turmaInicial = {
  nome: "",
  turno: "Matutino" as "Matutino" | "Vespertino" | "Noturno",
  sala: "",
  professorResponsavel: "",
  quantidadeAlunos: "0",
};

const disciplinaInicial = {
  nome: "",
  cargaHoraria: "",
  professorId: "",
};

export default function TurmasClient() {
  const {
    turmas,
    disciplinas,
    professores,
    adicionarTurma,
    adicionarDisciplina,
  } = useEscola();

  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [modalTurma, setModalTurma] = useState(false);
  const [modalDisciplina, setModalDisciplina] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [formTurma, setFormTurma] = useState(turmaInicial);
  const [formDisciplina, setFormDisciplina] = useState(disciplinaInicial);

  const turmasOrdenadas = useMemo(
    () => [...turmas].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)),
    [turmas],
  );

  const disciplinasDaTurma = useMemo(() => {
    if (!turmaSelecionada) return [];
    return disciplinas.filter((d) => d.turmaId === turmaSelecionada.id);
  }, [disciplinas, turmaSelecionada]);

  async function salvarTurma(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await adicionarTurma(formTurma);
      setModalTurma(false);
      setFormTurma(turmaInicial);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar turma.");
    } finally {
      setSalvando(false);
    }
  }

  async function salvarDisciplina(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!turmaSelecionada) return;
    setSalvando(true);
    setErro(null);
    try {
      await adicionarDisciplina({
        nome: formDisciplina.nome,
        cargaHoraria: formDisciplina.cargaHoraria,
        professorId: formDisciplina.professorId,
        turmaId: turmaSelecionada.id,
      });
      setModalDisciplina(false);
      setFormDisciplina(disciplinaInicial);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar disciplina.");
    } finally {
      setSalvando(false);
    }
  }

  // -------------------------- Lista de turmas --------------------------
  if (!turmaSelecionada) {
    return (
      <PageShell>
        <PageTitle
          title="Turmas"
          subtitle="Selecione uma turma para gerenciar suas disciplinas."
          action={
            <Button
              type="button"
              tone="emerald"
              onClick={() => setModalTurma(true)}
              icon={<Plus className="h-5 w-5" />}
            >
              Nova Turma
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turmasOrdenadas.map((turma) => (
            <button
              key={turma.id}
              type="button"
              onClick={() => setTurmaSelecionada(turma)}
              className="group rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-emerald-500 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <School className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {turma.nome}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {turma.turno} •{" "}
                      {disciplinas.filter((d) => d.turmaId === turma.id).length}{" "}
                      disciplinas
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:text-emerald-600" />
              </div>
            </button>
          ))}
        </div>

        <FormModal
          open={modalTurma}
          onClose={() => setModalTurma(false)}
          title="Cadastrar Turma"
          description="Crie uma nova turma."
        >
          <form onSubmit={salvarTurma} className="space-y-5">
            <TextField
              label="Nome da Turma"
              value={formTurma.nome}
              onChange={(e) =>
                setFormTurma((f) => ({ ...f, nome: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                label="Turno"
                value={formTurma.turno}
                onChange={(e) =>
                  setFormTurma((f) => ({
                    ...f,
                    turno: e.target.value as typeof f.turno,
                  }))
                }
              >
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </SelectField>
              <TextField
                label="Sala"
                value={formTurma.sala}
                onChange={(e) =>
                  setFormTurma((f) => ({ ...f, sala: e.target.value }))
                }
              />
            </div>
            {erro && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {erro}
              </p>
            )}
            <FormActions
              submitLabel={salvando ? "Salvando..." : "Salvar Turma"}
              onCancel={() => setModalTurma(false)}
              tone="emerald"
            />
          </form>
        </FormModal>
      </PageShell>
    );
  }

  // ---------------------- Disciplinas de uma turma ----------------------
  return (
    <PageShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setTurmaSelecionada(null)}
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            ← Voltar
          </button>
          <PageTitle
            title={`Disciplinas — ${turmaSelecionada.nome}`}
            subtitle={`${turmaSelecionada.turno} • Sala ${turmaSelecionada.sala}`}
          />
        </div>
        <Button
          type="button"
          tone="amber"
          onClick={() => {
            setFormDisciplina(disciplinaInicial);
            setErro(null);
            setModalDisciplina(true);
          }}
          icon={<Plus className="h-5 w-5" />}
        >
          Nova Disciplina
        </Button>
      </div>

      {disciplinasDaTurma.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {disciplinasDaTurma.map((disciplina) => (
            <div
              key={disciplina.id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-3 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Book className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {disciplina.nome}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>
                    <strong>Carga Horária:</strong> {disciplina.cargaHoraria}h
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-amber-500" />
                  <span>
                    <strong>Professor:</strong>{" "}
                    {disciplina.professorResponsavel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-12 text-center">
          <Book className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h3 className="text-lg font-semibold text-amber-900">
            Nenhuma disciplina cadastrada
          </h3>
          <p className="mt-2 text-sm text-amber-700">
            Clique em “Nova Disciplina” para adicionar a primeira disciplina
            desta turma.
          </p>
        </div>
      )}

      <FormModal
        open={modalDisciplina}
        onClose={() => setModalDisciplina(false)}
        title="Cadastrar Disciplina"
        description={`Adicione uma disciplina à turma ${turmaSelecionada.nome}.`}
      >
        <form onSubmit={salvarDisciplina} className="space-y-5">
          <TextField
            label="Nome da Disciplina"
            value={formDisciplina.nome}
            onChange={(e) =>
              setFormDisciplina((f) => ({ ...f, nome: e.target.value }))
            }
            required
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="Carga Horária (h)"
              type="number"
              min="1"
              value={formDisciplina.cargaHoraria}
              onChange={(e) =>
                setFormDisciplina((f) => ({
                  ...f,
                  cargaHoraria: e.target.value,
                }))
              }
              required
            />
            <SelectField
              label="Professor"
              value={formDisciplina.professorId}
              onChange={(e) =>
                setFormDisciplina((f) => ({
                  ...f,
                  professorId: e.target.value,
                }))
              }
              required
            >
              <option value="">Selecione um professor</option>
              {professores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </SelectField>
          </div>
          {erro && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {erro}
            </p>
          )}
          <FormActions
            submitLabel={salvando ? "Salvando..." : "Salvar Disciplina"}
            onCancel={() => setModalDisciplina(false)}
            tone="amber"
          />
        </form>
      </FormModal>
    </PageShell>
  );
}
