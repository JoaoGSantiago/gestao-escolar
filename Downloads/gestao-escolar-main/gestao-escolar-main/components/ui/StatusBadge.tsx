import type { ReactNode } from "react";

interface StatusBadgeProps {
  children: ReactNode;
  type?: "success" | "danger" | "warning" | "info" | "neutral";
}

export function StatusBadge({ children, type = "neutral" }: StatusBadgeProps) {
  let colors = "border-slate-300 bg-slate-50 text-slate-700";
  let dotColor = "bg-slate-400";

  if (type === "success") {
    colors = "border-emerald-200 bg-emerald-50 text-emerald-800";
    dotColor = "bg-emerald-600";
  }

  if (type === "danger") {
    colors = "border-rose-200 bg-rose-50 text-rose-800";
    dotColor = "bg-rose-600";
  }

  if (type === "warning") {
    colors = "border-amber-200 bg-amber-50 text-amber-800";
    dotColor = "bg-amber-600";
  }

  if (type === "info") {
    colors = "border-blue-200 bg-blue-50 text-blue-800";
    dotColor = "bg-blue-600";
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium ${colors}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {children}
    </span>
  );
}
