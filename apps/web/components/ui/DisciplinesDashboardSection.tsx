import { BarChart3 } from "lucide-react";
import { DataTable } from "./DataTable";
import { DashboardActions, type DashboardAction } from "./DashboardActions";
import type { DataTableColumn } from "./DataTable";

export type DisciplineDashboardRow = {
  id: string;
  nome: string;
  turma: string;
  professorResponsavel: string;
  totalAlunos: number;
};

type DisciplinesDashboardSectionProps = {
  disciplines: DisciplineDashboardRow[];
  actions: DashboardAction[];
};

const columns: DataTableColumn<DisciplineDashboardRow>[] = [
  {
    key: "disciplina",
    header: "Disciplina",
    render: (disciplina) => (
      <div>
        <p className="font-bold text-slate-900">{disciplina.nome}</p>
        <p className="text-xs text-slate-500">{disciplina.turma}</p>
      </div>
    ),
  },
  {
    key: "professor",
    header: "Professor",
    render: (disciplina) => disciplina.professorResponsavel,
  },
  {
    key: "alunos",
    header: "Alunos",
    render: (disciplina) => (
      <span className="font-bold text-slate-900">
        {disciplina.totalAlunos}
      </span>
    ),
  },
];

export function DisciplinesDashboardSection({
  disciplines,
  actions,
}: DisciplinesDashboardSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-slate-800">
          <BarChart3 className="h-4 w-4 text-blue-500" />
          Dashboard das Disciplinas
        </h3>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-5 lg:p-5">
        <div className="min-w-0">
          <DataTable
            data={disciplines}
            columns={columns}
            rowKey={(disciplina) => disciplina.id}
            emptyTitle="Nenhuma disciplina cadastrada"
            emptyDescription="Cadastre disciplinas para acompanhar a distribuição por turma."
          />
        </div>

        <DashboardActions actions={actions} />
      </div>
    </section>
  );
}
