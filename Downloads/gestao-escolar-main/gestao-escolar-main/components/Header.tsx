"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Alunos", icon: Users, href: "/alunos" },
  { name: "Professores", icon: GraduationCap, href: "/professores" },
  { name: "Turmas", icon: School, href: "/turmas" },
  { name: "Disciplinas", icon: BookOpen, href: "/disciplinas" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative h-20 border-b border-slate-800 bg-slate-900 flex items-center justify-start px-4 md:px-6 sticky top-0 z-20 w-full md:pl-72">
      <div className="flex items-center gap-3 mr-auto">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 p-2 text-slate-200 transition hover:bg-slate-700 md:hidden"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/image1.png"
            alt="Edu Gestão"
            width={56}
            height={56}
            className="object-contain"
          />
          <span className="hidden sm:block text-white">
            <span className="block text-lg font-semibold">Edu Gestão</span>
            <span className="block text-sm text-slate-400">
              Gestão Educacional
            </span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-100">Administrador</p>
          <p className="text-xs text-slate-400 font-medium">Gestor Escolar</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-md hover:bg-blue-600 transition-colors cursor-pointer">
          AD
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-30 bg-slate-950/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Navegação
                </p>
                <p className="mt-1 text-xl font-bold text-white">EduGestão</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl bg-slate-800 p-2 text-slate-200 transition hover:bg-slate-700"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-200 transition hover:bg-slate-700"
                >
                  <item.icon className="h-5 w-5 text-slate-300" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
