"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, MessageSquare, Plus, LogOut, Settings, User as UserIcon, Shield, Sparkles } from "lucide-react";
import Logo from "../brand/Logo";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ onOpenComposer }: { onOpenComposer?: () => void }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header backdrop-blur-xl border-b border-white/5 bg-slate-950/80">
      <div className="w-full px-3 sm:px-5 h-16 flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
        {/* Lado Esquerdo: Logo */}
        <div className="flex items-center gap-6">
          <Logo size="md" />
        </div>

        {/* Centro: Barra de Busca Global */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-lg lg:max-w-xl relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar pessoas, comunidades, assuntos #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 text-base rounded-full pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Lado Direito: Ações e Perfil */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Botão Novo Post */}
              {onOpenComposer && (
                <button
                  onClick={onOpenComposer}
                  className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar</span>
                </button>
              )}

              {/* Mensagens */}
              <Link
                href="/mensagens"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors relative"
                title="Mensagens Diretas"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              {/* Notificações */}
              <Link
                href="/notificacoes"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors relative"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {user.unreadNotifications && user.unreadNotifications > 0 ? (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {user.unreadNotifications > 9 ? "9+" : user.unreadNotifications}
                  </span>
                ) : null}
              </Link>

              {/* Dropdown de Usuário */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full border border-emerald-500/30 hover:border-emerald-500/60 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown z-50 py-2 text-sm shadow-2xl border border-slate-800 text-slate-200">
                      <div className="px-4 py-3 border-b border-slate-800/80">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-emerald-400">@{user.username}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href={`/perfil/${user.username}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800/70 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-emerald-400" />
                          <span>Meu Perfil</span>
                        </Link>

                        <Link
                          href="/depoimentos"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center justify-between px-4 py-2 hover:bg-slate-800/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Depoimentos</span>
                          </div>
                          {user.pendingTestimonials && user.pendingTestimonials > 0 ? (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                              {user.pendingTestimonials} pendentes
                            </span>
                          ) : null}
                        </Link>

                        <Link
                          href="/configuracoes"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800/70 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Configurações</span>
                        </Link>

                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800/70 text-amber-300 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-amber-400" />
                            <span>Painel Administrativo</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-800/80 pt-1">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sair da conta</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
