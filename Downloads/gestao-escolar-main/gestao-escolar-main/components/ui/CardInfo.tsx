import type { ReactNode } from "react";

interface CardInfoProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  footer?: string;
}

export function CardInfo({
  title,
  value,
  description,
  icon,
  footer,
}: CardInfoProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {description ? (
            <p className="text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        ) : null}
      </div>

      {footer ? (
        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {footer}
        </div>
      ) : null}
    </article>
  );
}
