"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Lock, Mail, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      toast.success("Login efetuado com sucesso! Bem-vindo(a) de volta.");
      router.push("/");
    } else {
      toast.error(result.error || "Credenciais inválidas.");
    }
  };

  const fillDemoAccount = (demoId: string) => {
    setIdentifier(demoId);
    setPassword("Conecta@2026");
    toast.info(`Credenciais de demonstração (@${demoId}) preenchidas!`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6">
          <Logo size="lg" withTagline />
        </div>

        {/* Card Principal */}
        <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-white">Entrar na sua conta</h1>
            <p className="text-xs text-slate-400 mt-1">
              Conecte-se com pessoas, comunidades e momentos reais.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail ou Nome de usuário
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="ex: clarice ou seu@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Senha</label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl gradient-brand text-slate-950 font-bold text-sm shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Acessando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Atalhos Rápidos para Contas de Demonstração */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Acesso Rápido de Demonstração:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount("clarice")}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="truncate">Clarice (Usuária)</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("thiago_dev")}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="truncate">Thiago (Dev)</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("marina_foto")}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span className="truncate">Marina (Fotógrafa)</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("conecta")}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-left transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="truncate">Admin (Oficial)</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Senha padrão de demonstração: <code>Conecta@2026</code>
            </p>
          </div>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Ainda não tem uma conta?{" "}
            <Link href="/cadastro" className="text-emerald-400 font-bold hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
