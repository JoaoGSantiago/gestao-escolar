import { LoaderCircle } from "lucide-react";

interface LoadingProps {
  label?: string;
}

export function Loading({ label = "Carregando dados..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-8 text-sm font-medium text-slate-500 shadow-sm">
      <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
      <span>{label}</span>
    </div>
  );
}
