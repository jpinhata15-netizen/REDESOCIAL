"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, User, AtSign, Mail, Lock, ArrowRight, Loader2, CheckSquare, Square } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }

    if (!name || !username || !email || !password) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      username,
      email,
      password,
      termsAccepted,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Conta criada com sucesso! Seja bem-vindo(a) à Órbita.");
      router.push("/onboarding");
    } else {
      toast.error(result.error || "Erro ao criar conta.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="mb-6">
          <Logo size="lg" withTagline />
        </div>

        <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-white">Criar sua conta na Órbita</h1>
            <p className="text-xs text-slate-400 mt-1">
              Seu mundo. Suas conexões. Faça parte agora.
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome de Usuário (@)</label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="ex: clarice_lisboa"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Mínimo de 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Checkbox de Termos */}
            <div
              onClick={() => setTermsAccepted(!termsAccepted)}
              className="flex items-start gap-2.5 pt-1 cursor-pointer select-none text-xs text-slate-300"
            >
              <div className="mt-0.5 text-emerald-400">
                {termsAccepted ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <p className="leading-tight">
                Li e concordo com os{" "}
                <Link href="/termos" className="text-emerald-400 underline" onClick={(e) => e.stopPropagation()}>
                  Termos de Uso
                </Link>{" "}
                e com a{" "}
                <Link href="/privacidade" className="text-emerald-400 underline" onClick={(e) => e.stopPropagation()}>
                  Política de Privacidade (LGPD)
                </Link>
                .
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="mt-3 w-full py-3 rounded-xl gradient-brand text-slate-950 font-bold text-sm shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <span>Criar Minha Conta</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
