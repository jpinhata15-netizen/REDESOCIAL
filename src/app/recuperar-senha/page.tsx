"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useToast } from "@/context/ToastContext";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulação segura que não revela se o e-mail existe
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Instruções enviadas caso o e-mail esteja registrado.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="mb-6">
          <Logo size="lg" withTagline />
        </div>

        <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-white">Recuperação de Acesso</h1>
            <p className="text-xs text-slate-400 mt-1">
              Informe seu e-mail cadastrado para receber o link seguro de redefinição de senha.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Verifique sua caixa de entrada</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Se o e-mail <strong>{email}</strong> estiver cadastrado em nossa plataforma, você receberá um link com
                instruções para redefinir sua senha em instantes.
              </p>
              <Link
                href="/login"
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-brand text-slate-950 font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <span>Enviar Link</span>}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para o Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
