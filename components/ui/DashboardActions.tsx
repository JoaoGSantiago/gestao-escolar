import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type DashboardAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  hoverClassName: string;
};

type DashboardActionsProps = {
  actions: DashboardAction[];
};

export function DashboardActions({ actions }: DashboardActionsProps) {
  return (
    <div className="grid w-full shrink-0 grid-cols-2 gap-3 lg:w-60 lg:grid-cols-1">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-bold text-slate-700 shadow-sm transition-all active:scale-95 lg:min-h-28 ${action.hoverClassName}`}
        >
          <action.icon className={`h-6 w-6 ${action.iconClassName}`} />
          {action.label}
        </Link>
      ))}
    </div>
  );
}
