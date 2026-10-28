"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  Compass,
  Users2,
  MessageSquareHeart,
  Globe2,
} from "lucide-react";
import Logo, { OrbitPlanetIcon } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      toast.success("Bem-vindo(a) à Órbita!");
      router.push("/");
    } else {
      toast.error(result.error || "Credenciais inválidas.");
    }
  };

  const fillDemoAccount = (demoId: string) => {
    setIdentifier(demoId);
    setPassword("Conecta@2026");
    toast.info(`Credenciais de @${demoId} selecionadas! Clique em "Entrar na Órbita".`);
  };

  const demoAccounts = [
    {
      id: "clarice",
      name: "Clarice Lisboa",
      role: "Escritora & Fotógrafa",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "thiago_dev",
      name: "Thiago Dev",
      role: "Engenheiro de Software",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "marina_foto",
      name: "Marina Duarte",
      role: "Fotógrafa de Natureza",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "conecta",
      name: "Admin Órbita",
      role: "Canal Oficial",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a14] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Nebulosas e Luzes Cósmicas de Fundo */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute top-[40%] right-[30%] w-[450px] h-[450px] bg-pink-600/15 rounded-full blur-[120px] pointer-events-none -z-0"></div>

      {/* Grid de estrelas de fundo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>

      {/* Container Principal Duas Colunas */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Coluna Esquerda: Vitrine e Apresentação da Marca Órbita */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          
          {/* Logo e Planeta com Anéis */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center gap-4">
              <OrbitPlanetIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    órbita
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500 inline-block ml-1 shadow-lg shadow-pink-500/50 animate-pulse"></span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 uppercase tracking-widest mt-0.5">
                  Seu mundo. Suas conexões.
                </span>
              </div>
            </div>
          </div>

          {/* Slogan Principal e Proposta de Valor */}
          <div className="space-y-3 max-w-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Uma rede social para aproximar{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                pessoas e ideias.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
              Descubra comunidades que giram em torno dos seus interesses, converse em tempo real e viva trocas genuínas.
            </p>
          </div>

          {/* 3 Pilares Cósmicos em Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col items-center lg:items-start text-center lg:text-left hover:border-purple-500/40 transition-colors">
              <Compass className="w-5 h-5 text-purple-400 mb-1.5" />
              <span className="text-xs font-bold text-white">Comunidades</span>
              <span className="text-[11px] text-slate-400">Encontre sua tribo</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col items-center lg:items-start text-center lg:text-left hover:border-pink-500/40 transition-colors">
              <MessageSquareHeart className="w-5 h-5 text-pink-400 mb-1.5" />
              <span className="text-xs font-bold text-white">Bate-Papo</span>
              <span className="text-[11px] text-slate-400">Mensagens ao vivo</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col items-center lg:items-start text-center lg:text-left hover:border-blue-500/40 transition-colors">
              <Sparkles className="w-5 h-5 text-blue-400 mb-1.5" />
              <span className="text-xs font-bold text-white">Depoimentos</span>
              <span className="text-[11px] text-slate-400">Carinho de amigos</span>
            </div>
          </div>

          {/* Citação / Card de Membro */}
          <div className="hidden lg:flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-lg max-w-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Clarice"
              className="w-10 h-10 rounded-full object-cover border border-purple-500/40 shrink-0"
            />
            <p className="text-xs text-slate-300 italic">
              &ldquo;A Órbita trouxe de volta a magia de conhecer pessoas com os mesmos gostos e trocar conversas de verdade.&rdquo;
              <span className="block not-italic text-[10px] text-purple-300 mt-0.5 font-semibold">
                — Clarice Lisboa, escritora
              </span>
            </p>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Login */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 relative">
            
            {/* Brilho de topo do card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>

            <div className="mb-6 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-2">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Acesso Seguro</span>
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Entre na sua Órbita</h2>
              <p className="text-xs text-slate-400 mt-1">
                Digite suas credenciais ou escolha um perfil de teste abaixo.
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  E-mail ou Usuário
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="clarice ou seu@email.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Senha</label>
                  <Link
                    href="/recuperar-senha"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar na Órbita</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-3 text-slate-400 font-medium">
                  Ou acesse com 1 clique de teste
                </span>
              </div>
            </div>

            {/* Contas de Demonstração Rápidas */}
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => fillDemoAccount(acc.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    identifier === acc.id
                      ? "bg-purple-600/20 border-purple-500 text-white"
                      : "bg-slate-950/60 border-white/5 hover:border-purple-500/30 text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate leading-tight">{acc.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">@{acc.id}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Rodapé do Card */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Ainda não está na Órbita?{" "}
                <Link
                  href="/cadastro"
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:underline"
                >
                  Criar minha conta gratuita
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
