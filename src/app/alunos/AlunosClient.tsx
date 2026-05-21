"use client";

import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormActions,
  FormModal,
  PageShell,
  PageTitle,
  SelectField,
  TextField,
} from "../../../components/ui";
import { useEscola, type Aluno } from "@/contexts/EscolaContext";

const turmasPadrao = ["6º Ano", "7º Ano", "1º Médio"];

export default function AlunosClient() {
  const router = useRouter();
  const { alunos, adicionarAluno } = useEscola();
  const [modalCadastro, setModalCadastro] = useState(false);
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    matricula: "",
    dataNascimento: "",
    turma: "",
    status: "Ativo" as const,
  });

  const alunosAgrupados = useMemo(() => {
    const grupos: Record<string, Aluno[]> = Object.fromEntries(
      turmasPadrao.map((turma) => [turma, []]),
    );

    alunos.forEach((aluno) => {
      if (aluno.turma in grupos) {
        grupos[aluno.turma].push(aluno);
      }
    });

    return grupos;
  }, [alunos]);

  function atualizarCampo(campo: keyof typeof formulario, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function fecharModalCadastro() {
    setModalCadastro(false);
    setFormulario({
      nome: "",
      email: "",
      matricula: "",
      dataNascimento: "",
      turma: "",
      status: "Ativo",
    });
  }

  function salvarAluno(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    adicionarAluno(formulario);
    fecharModalCadastro();
  }

  return (
    <PageShell>
      <PageTitle
        title="Alunos"
        subtitle="Alunos da escola."
        action={
          <Button
            type="button"
            onClick={() => setModalCadastro(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Novo Aluno
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(alunosAgrupados).map(([turma, alunosTurma]) => (
          <button
            key={turma}
            type="button"
            onClick={() =>
              router.push(`/alunos/turma/${encodeURIComponent(turma)}`)
            }
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
          >
            <h3 className="text-lg font-bold text-slate-900">{turma}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {alunosTurma.length} aluno{alunosTurma.length !== 1 ? "s" : ""}
            </p>
            <div className="mt-4 flex items-center gap-2 font-semibold text-blue-600">
              <Users className="h-4 w-4" />
              Ver alunos
            </div>
          </button>
        ))}
      </div>

      <FormModal
        open={modalCadastro}
        onClose={fecharModalCadastro}
        title="Cadastrar Aluno"
        description="Preencha os dados do aluno sem sair da listagem."
      >
        <form onSubmit={salvarAluno} className="space-y-5">
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
              label="Matrícula"
              value={formulario.matricula}
              onChange={(event) =>
                atualizarCampo("matricula", event.target.value)
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Turma"
              value={formulario.turma}
              onChange={(event) => atualizarCampo("turma", event.target.value)}
              required
            >
              <option value="">Selecione uma turma</option>
              {turmasPadrao.map((turma) => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </SelectField>

            <TextField
              label="Data de Nascimento"
              type="date"
              value={formulario.dataNascimento}
              onChange={(event) =>
                atualizarCampo("dataNascimento", event.target.value)
              }
              required
            />
          </div>

          <SelectField
            label="Status"
            value={formulario.status}
            onChange={(event) => atualizarCampo("status", event.target.value)}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </SelectField>

          <FormActions
            submitLabel="Salvar Aluno"
            onCancel={fecharModalCadastro}
          />
        </form>
      </FormModal>
    </PageShell>
  );
}
