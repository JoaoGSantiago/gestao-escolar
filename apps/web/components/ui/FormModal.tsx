"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface FormModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

export function FormModal({
  open,
  title,
  description,
  onClose,
  children,
}: FormModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-modal-title"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2
                id="form-modal-title"
                className="text-2xl font-bold text-slate-900"
              >
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
