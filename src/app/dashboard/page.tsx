"use client";

import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  GraduationCap,
  School,
  Users,
} from "lucide-react";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";

export default function DashboardPage() {
  const resumoGeral = [
    {
      label: "Alunos",
      value: "6",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/alunos",
    },
    {
      label: "Professores",
      value: "5",
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/professores",
    },
    {
      label: "Turmas Ativas",
      value: "12",
      icon: School,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/turmas",
    },
    {
      label: "Disciplinas",
      value: "24",
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/disciplinas",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />

      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Dashboard Acadêmico
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Bem-vindo, Marcelo Henrique. Gerencie sua instituição de forma
              ágil.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resumoGeral.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-95"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-lg p-2 ${item.bg} transition-transform group-hover:scale-110`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {item.label}
                  </p>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">
                    {item.value}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
                <h3 className="flex items-center gap-2 font-bold text-slate-800">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  Atividades Recentes
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                  <School className="h-8 w-8 text-slate-300" />
                </div>
                <p className="max-w-60 font-medium text-slate-400">
                  Ainda não há atividades registradas para este período letivo.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-800">Ações Rápidas</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/alunos"
                  className="rounded-lg border border-slate-100 p-3 text-sm font-bold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  + Cadastrar Novo Aluno
                </Link>
                <Link
                  href="/professores"
                  className="rounded-lg border border-slate-100 p-3 text-sm font-bold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  + Vincular Professor
                </Link>
                <button
                  type="button"
                  className="cursor-not-allowed rounded-lg border border-slate-100 p-3 text-left text-sm font-bold text-slate-400 transition-all hover:bg-slate-50"
                >
                  Relatório de Desempenho
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
