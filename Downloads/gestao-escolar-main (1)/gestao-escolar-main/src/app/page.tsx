"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  // Dados dos cards com os links para as páginas do sistema
  const resumoGeral = [
    {
      label: "Total Alunos",
      value: "142",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/alunos",
    },
    {
      label: "Professores",
      value: "18",
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
    <div className="flex flex-col gap-6">
      {/* Cabeçalho - Estilo idêntico à tela de Alunos */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Dashboard Acadêmico
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Bem-vindo, Marcelo Henrique. Gerencie sua instituição de forma ágil.
        </p>
      </div>

      {/* Grid de Cards de Navegação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumoGeral.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-300 active:scale-95"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2 rounded-lg ${item.bg} group-hover:scale-110 transition-transform`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                {item.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {item.value}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Seção de Conteúdo e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades Recentes (Estilo Tabela/Card de Alunos) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              Atividades Recentes
            </h3>
          </div>
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <School className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium max-w-[250px]">
              Ainda não há atividades registradas para este período letivo.
            </p>
          </div>
        </div>

        {/* Card de Atalhos Rápidos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800">Ações Rápidas</h3>
          <div className="flex flex-col gap-2">
            <Link
              href="/alunos"
              className="p-3 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all text-sm font-bold text-slate-600 hover:text-blue-600"
            >
              + Cadastrar Novo Aluno
            </Link>
            <Link
              href="/professores"
              className="p-3 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all text-sm font-bold text-slate-600 hover:text-blue-600"
            >
              + Vincular Professor
            </Link>
            <button className="w-full text-left p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all text-sm font-bold text-slate-400 cursor-not-allowed">
              📊 Relatório de Desempenho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
