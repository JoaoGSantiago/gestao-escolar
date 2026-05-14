import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({
  placeholder = "Pesquisar...",
  ...props
}: SearchInputProps) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm shadow-slate-200/50 focus-within:border-blue-300">
      <Search className="h-4 w-4 shrink-0" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        {...props}
      />
    </label>
  );
}
