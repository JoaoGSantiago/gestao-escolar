import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

type SearchTone = "indigo" | "emerald" | "amber";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  tone?: SearchTone;
};

const focusClasses: Record<SearchTone, string> = {
  indigo: "focus:ring-indigo-500",
  emerald: "focus:ring-emerald-500",
  amber: "focus:ring-amber-500",
};

export function SearchInput({
  tone = "indigo",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        className={`w-full rounded-xl border border-gray-200 bg-white p-3 pl-10 outline-none focus:ring-2 ${focusClasses[tone]} ${className}`}
        {...props}
      />
    </div>
  );
}
