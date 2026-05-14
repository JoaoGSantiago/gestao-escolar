import type { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-2xl text-sm text-slate-500 md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
