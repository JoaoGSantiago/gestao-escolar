"use client";

import { useMemo, useState } from "react";
import { Book, Clock, Plus, User } from "lucide-react";
import {
  Button,
  EmptyState,
  FormActions,
  FormModal,
  PageShell,
  PageTitle,
  SearchInput,
  TextField,
} from "../../../components/ui";
import { useEscola } from "@/contexts/EscolaContext";

export default function DisciplinasClient() {
  const { disciplinas, adicionarDisciplina } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    cargaHoraria: "",
    professorResponsavel: "",
    turma: "",
  });

  const disciplinasFiltradas = useMemo(() => {
    return disciplinas.filter((disciplina) =>
      disciplina.nome.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, disciplinas]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      cargaHoraria: "",
      professorResponsavel: "",
      turma: "",
    });
  }

  function salvarDisciplina(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarDisciplina(formulario);
    fecharModal();
  }

  return (
    <PageShell>
      <PageTitle
        title="Disciplinas"
        subtitle="Catálogo de matérias e carga horária anual."
        action={
          <Button
            type="button"
            tone="amber"
            onClick={() => setModalAberto(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Nova Disciplina
          </Button>
        }
      />

      <SearchInput
        tone="amber"
        placeholder="Buscar por nome da disciplina..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />

      {disciplinasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {disciplinasFiltradas.map((disciplina) => (
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
        <EmptyState
          title="Nenhuma disciplina encontrada"
          description={`Não encontramos resultados para "${busca}".`}
          icon={<Book className="h-6 w-6" />}
        />
      )}

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Disciplina"
        description="Cadastre uma nova disciplina sem sair da página."
      >
        <form onSubmit={salvarDisciplina} className="space-y-5">
          <TextField
            label="Nome da Disciplina"
            value={formulario.nome}
            onChange={(event) => atualizarCampo("nome", event.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="Carga Horária"
              type="number"
              min="1"
              value={formulario.cargaHoraria}
              onChange={(event) =>
                atualizarCampo("cargaHoraria", event.target.value)
              }
              required
            />

            <TextField
              label="Turma"
              value={formulario.turma}
              onChange={(event) => atualizarCampo("turma", event.target.value)}
              required
            />
          </div>

          <TextField
            label="Professor Responsável"
            value={formulario.professorResponsavel}
            onChange={(event) =>
              atualizarCampo("professorResponsavel", event.target.value)
            }
            required
          />

          <FormActions
            submitLabel="Salvar Disciplina"
            onCancel={fecharModal}
            tone="amber"
          />
        </form>
      </FormModal>
    </PageShell>
  );
}
