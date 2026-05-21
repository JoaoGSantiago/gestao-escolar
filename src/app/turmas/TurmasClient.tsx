"use client";

import { useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import {
  Button,
  DataTable,
  EmptyState,
  FormActions,
  FormModal,
  PageShell,
  PageTitle,
  SearchInput,
  SelectField,
  TextField,
} from "../../../components/ui";
import type { DataTableColumn } from "../../../components/ui";
import { useEscola, type Turma } from "@/contexts/EscolaContext";

const colunas: DataTableColumn<Turma>[] = [
  { key: "nome", header: "Turma", render: (turma) => turma.nome },
  { key: "turno", header: "Turno", render: (turma) => turma.turno },
  { key: "sala", header: "Sala", render: (turma) => turma.sala },
  {
    key: "professorResponsavel",
    header: "Professor",
    render: (turma) => turma.professorResponsavel,
  },
  {
    key: "quantidadeAlunos",
    header: "Alunos",
    render: (turma) => (
      <span className="rounded-lg bg-blue-50 px-2 py-1 font-medium text-blue-700">
        {turma.quantidadeAlunos} alunos
      </span>
    ),
  },
];

export default function TurmasClient() {
  const { turmas, adicionarTurma } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    turno: "Matutino" as const,
    sala: "",
    professorResponsavel: "",
    quantidadeAlunos: "",
  });

  const turmasFiltradas = useMemo(() => {
    return turmas.filter(
      (turma) =>
        turma.nome.toLowerCase().includes(busca.toLowerCase()) ||
        turma.professorResponsavel.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, turmas]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      turno: "Matutino",
      sala: "",
      professorResponsavel: "",
      quantidadeAlunos: "",
    });
  }

  function salvarTurma(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarTurma(formulario);
    fecharModal();
  }

  return (
    <PageShell>
      <PageTitle
        title="Turmas"
        subtitle="Gerenciamento de salas e turnos escolares."
        action={
          <Button
            type="button"
            tone="emerald"
            onClick={() => setModalAberto(true)}
            icon={<Plus className="h-5 w-5" />}
            className="w-full md:w-auto"
          >
            Nova Turma
          </Button>
        }
      />

      <SearchInput
        tone="emerald"
        placeholder="Buscar por nome da turma ou professor..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />

      {turmasFiltradas.length > 0 ? (
        <DataTable
          data={turmasFiltradas}
          columns={colunas}
          rowKey={(turma) => turma.id}
        />
      ) : (
        <EmptyState
          title="Nenhuma turma encontrada"
          description="Não há turmas que correspondam à sua busca no momento."
          icon={<BookOpen className="h-6 w-6" />}
        />
      )}

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Turma"
        description="Crie uma nova turma diretamente da tela de listagem."
      >
        <form onSubmit={salvarTurma} className="space-y-5">
          <TextField
            label="Nome da Turma"
            value={formulario.nome}
            onChange={(event) => atualizarCampo("nome", event.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Turno"
              value={formulario.turno}
              onChange={(event) => atualizarCampo("turno", event.target.value)}
            >
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
            </SelectField>

            <TextField
              label="Sala"
              value={formulario.sala}
              onChange={(event) => atualizarCampo("sala", event.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="Professor Responsável"
              value={formulario.professorResponsavel}
              onChange={(event) =>
                atualizarCampo("professorResponsavel", event.target.value)
              }
              required
            />

            <TextField
              label="Quantidade de Alunos"
              type="number"
              min="1"
              value={formulario.quantidadeAlunos}
              onChange={(event) =>
                atualizarCampo("quantidadeAlunos", event.target.value)
              }
              required
            />
          </div>

          <FormActions
            submitLabel="Salvar Turma"
            onCancel={fecharModal}
            tone="emerald"
          />
        </form>
      </FormModal>
    </PageShell>
  );
}
