"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  variant?: "danger" | "primary";
  icon?: ReactNode;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  isLoading = false,
  variant = "danger",
  icon,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  const iconColors =
    variant === "danger"
      ? "bg-rose-100 text-rose-700"
      : "bg-blue-100 text-blue-700";

  const buttonColors =
    variant === "danger"
      ? "bg-rose-600 hover:bg-rose-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconColors}`}
            >
              {icon ?? <AlertTriangle className="h-5 w-5" />}
            </div>

            <div className="space-y-2">
              <h2
                id="confirm-modal-title"
                className="text-xl font-semibold text-slate-900"
              >
                {title}
              </h2>
              <p className="text-sm leading-6 text-slate-500">{description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${buttonColors}`}
            >
              {isLoading ? "Processando..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
