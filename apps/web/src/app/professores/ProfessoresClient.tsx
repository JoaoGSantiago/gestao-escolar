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
  { key: "email", header: "Email", render: (professor) => professor.email },
  {
    key: "telefone",
    header: "Telefone",
    render: (professor) => professor.telefone || "—",
  },
  {
    key: "acesso",
    header: "Acesso ao sistema",
    render: (professor) =>
      professor.acessoSistema ? (
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
          Habilitado
        </span>
      ) : (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
          Sem login
        </span>
      ),
  },
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

const formularioInicial = {
  nome: "",
  email: "",
  telefone: "",
  senha: "",
  status: "Ativo" as "Ativo" | "Inativo",
};

export default function ProfessoresClient() {
  const { professores, adicionarProfessor } = useEscola();
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const professoresFiltrados = useMemo(() => {
    return professores.filter(
      (professor) =>
        professor.nome.toLowerCase().includes(busca.toLowerCase()) ||
        professor.email.toLowerCase().includes(busca.toLowerCase()),
    );
  }, [busca, professores]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setErro(null);
    setFormulario(formularioInicial);
  }

  async function salvarProfessor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await adicionarProfessor(formulario);
      fecharModal();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar professor.");
    } finally {
      setSalvando(false);
    }
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
        description="Preencha os dados do professor. Informe uma senha para liberar o acesso dele ao sistema."
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
              label="E-mail (login do professor)"
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
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="Senha de acesso (mín. 6 caracteres)"
              type="password"
              value={formulario.senha}
              onChange={(event) => atualizarCampo("senha", event.target.value)}
              placeholder="Deixe em branco para não criar login"
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

          <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            Com e-mail e senha, o professor poderá entrar no sistema e lançar
            notas e frequências das suas turmas.
          </p>

          {erro && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {erro}
            </p>
          )}

          <FormActions
            submitLabel={salvando ? "Salvando..." : "Salvar Professor"}
            onCancel={fecharModal}
          />
        </form>
      </FormModal>
    </PageShell>
  );
}
