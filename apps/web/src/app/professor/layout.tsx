"use client";

import { Header } from "@/components/Header";
import { ProfessorSidebar } from "@/components/ProfessorSidebar";

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <ProfessorSidebar />
      <Header area="professor" />
      <main className="px-4 py-6 md:ml-64 md:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
