import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

export type DashboardStat = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

type DashboardStatsProps = {
  stats: DashboardStat[];
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-95 sm:p-5"
        >
          <div className="mb-5 flex items-center justify-between sm:mb-4">
            <div
              className={`rounded-lg p-2 ${item.bg} transition-transform group-hover:scale-110`}
            >
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
          </div>
          <p className="text-sm font-semibold leading-tight text-slate-500">
            {item.label}
          </p>
          <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
            {item.value}
          </h3>
        </Link>
      ))}
    </div>
  );
}
