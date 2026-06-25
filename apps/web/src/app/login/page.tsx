"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { login } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const usuario = await login(email, senha);
      router.push(
        usuario.role === "PROFESSOR" ? "/professor/dashboard" : "/dashboard",
      );
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao entrar.");
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-8 sm:px-4">
        {/* Logo Container */}
        <div className="flex justify-center">
          <Image
            src="/image1.png"
            alt="EduGestao"
            width={240}
            height={240}
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black leading-tight text-white">
            Bem-vindo de volta
          </h1>
          <p className="mt-4 text-lg font-medium text-slate-400">
            Acesse seu painel de controle escolar
          </p>
        </div>

        <div className="rounded-3xl bg-slate-800 shadow-2xl p-8 border border-slate-700">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest text-blue-400"
              >
                Identificação
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-600 bg-slate-700 px-4 py-3 transition-all focus-within:bg-slate-600 focus-within:border-blue-500">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@email.com"
                  className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* senha */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-widest text-blue-400"
              >
                Senha
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-600 bg-slate-700 px-4 py-3 transition-all focus-within:bg-slate-600 focus-within:border-blue-500">
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="rounded-lg p-1 text-slate-400 transition hover:text-slate-300"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-base font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Acessar Sistema
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-xs text-slate-400">
            <p className="font-bold text-slate-300">Acessos de demonstração</p>
            <p className="mt-1">
              Coordenação: coordenacao@escola.edu.br / Coord@123
            </p>
            <p>Professor: edvonaldo@escola.edu.br / Prof@123</p>
          </div>
        </div>
      </section>
    </main>
  );
}
