import { InputHTMLAttributes, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function InputField({
  label,
  icon: Icon,
  error,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="block text-xs font-bold uppercase tracking-widest text-blue-400"
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
          error
            ? "border-red-500 bg-red-900/20 focus-within:border-red-400 focus-within:bg-red-900/30"
            : "border-slate-600 bg-slate-700 focus-within:border-blue-500 focus-within:bg-slate-600"
        }`}
      >
        <Icon className="h-5 w-5 text-slate-400 flex-shrink-0" />
        <input
          {...props}
          className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-400"
        />
      </div>
      {error && (
        <span className="block text-xs font-medium text-red-400">{error}</span>
      )}
    </div>
  );
}
