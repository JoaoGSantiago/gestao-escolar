import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTone = "indigo" | "emerald" | "amber" | "slate";
type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const primaryClasses: Record<ButtonTone, string> = {
  indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  slate: "bg-slate-900 text-white hover:bg-slate-800",
};

const secondaryClasses: Record<ButtonTone, string> = {
  indigo: "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
  emerald:
    "border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
  amber: "border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700",
  slate: "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800",
};

export function Button({
  tone = "indigo",
  variant = "primary",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClasses =
    variant === "primary" ? primaryClasses[tone] : secondaryClasses[tone];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all ${variant === "secondary" ? "border bg-white" : ""} ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
