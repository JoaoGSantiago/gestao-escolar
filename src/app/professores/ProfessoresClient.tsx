"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Plus } from "lucide-react";
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
import { useEscola, type Professor } from "@/contexts/EscolaContext";

const colunas: DataTableColumn<Professor>[] = [
  { key: "nome", header: "Nome", render: (professor) => professor.nome },
  {
    key: "disciplina",
    header: "Disciplina",
    render: (professor) => professor.disciplina,
  },
  { key: "email", header: "Email", render: (professor) => professor.email },
  {
    key: "status",
    header: "Status",
    render: (professor) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-bold ${
          professor.status === "Ativo"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {professor.status}
      </span>
    ),
  },
];

export default function ProfessoresClient() {
  const { professores, adicionarProfessor } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    telefone: "",
    disciplina: "",
    status: "Ativo" as const,
  });

  const professoresFiltrados = useMemo(() => {
    return professores.filter(
      (professor) =>
        professor.nome.toLowerCase().includes(busca.toLowerCase()) ||
        professor.disciplina.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, professores]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario({
      nome: "",
      email: "",
      telefone: "",
      disciplina: "",
      status: "Ativo",
    });
  }

  function salvarProfessor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarProfessor(formulario);
    fecharModal();
  }

  return (
    <PageShell>
      <PageTitle
        title="Professores"
        subtitle="Gerenciamento do corpo docente da instituição."
        action={
          <Button
            type="button"
            onClick={() => setModalAberto(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Novo Professor
          </Button>
        }
      />

      <SearchInput
        placeholder="Buscar por nome ou disciplina..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />

      {professoresFiltrados.length > 0 ? (
        <DataTable
          data={professoresFiltrados}
          columns={colunas}
          rowKey={(professor) => professor.id}
        />
      ) : (
        <EmptyState
          title={busca ? "Nenhum resultado" : "Nenhum professor cadastrado"}
          description={
            busca
              ? `Não encontramos nada para "${busca}"`
              : "Comece adicionando um novo professor ao sistema."
          }
          icon={<GraduationCap className="h-6 w-6" />}
        />
      )}

      <FormModal
        open={modalAberto}
        onClose={fecharModal}
        title="Cadastrar Professor"
        description="Preencha os dados do professor sem sair da listagem."
      >
        <form onSubmit={salvarProfessor} className="space-y-5">
          <TextField
            label="Nome Completo"
            value={formulario.nome}
            onChange={(event) => atualizarCampo("nome", event.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="E-mail"
              type="email"
              value={formulario.email}
              onChange={(event) => atualizarCampo("email", event.target.value)}
              required
            />

            <TextField
              label="Telefone"
              value={formulario.telefone}
              onChange={(event) =>
                atualizarCampo("telefone", event.target.value)
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="Disciplina"
              value={formulario.disciplina}
              onChange={(event) =>
                atualizarCampo("disciplina", event.target.value)
              }
              required
            />

            <SelectField
              label="Status"
              value={formulario.status}
              onChange={(event) => atualizarCampo("status", event.target.value)}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </SelectField>
          </div>

          <FormActions submitLabel="Salvar Professor" onCancel={fecharModal} />
        </form>
      </FormModal>
    </PageShell>
  );
}
