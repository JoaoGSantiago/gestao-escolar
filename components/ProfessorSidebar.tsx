"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
} from "lucide-react";

export function ProfessorSidebar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/professor/dashboard" },
    { name: "Meus Alunos", icon: Users, href: "/professor/alunos" },
    { name: "Frequência", icon: Clock, href: "/professor/frequencia" },
    { name: "Notas", icon: FileText, href: "/professor/notas" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 shadow-xl">
      <div className="p-6 text-white font-bold text-xl flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm">
          Prof
        </div>
        <span>EduGestão</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
          Professor
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
          >
            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-green-400" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 text-xs text-slate-500 border-t border-slate-800">
        &copy; 2026 EduGestão v1.0
      </div>
    </aside>
  );
}
