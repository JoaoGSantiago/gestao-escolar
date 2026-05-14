import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Ajuste os filtros ou cadastre novos itens para preencher esta listagem.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="transition hover:bg-slate-50/80"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 align-middle text-sm text-slate-600"
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-6">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
