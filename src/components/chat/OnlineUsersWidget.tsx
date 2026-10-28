"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, MessageSquare, X, Search, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface OnlineUser {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  status: "online" | "ausente";
  lastActive: string;
}

export default function OnlineUsersWidget() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Carregar usuários online
  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch("/api/usuarios/online");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários online:", err);
    }
  };

  useEffect(() => {
    fetchOnlineUsers();
    // Atualizar periodicamente a cada 15 segundos
    const timer = setInterval(fetchOnlineUsers, 15000);
    return () => clearInterval(timer);
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = users.filter((u) => u.status === "online").length;

  const handleStartChat = (targetUserId: string) => {
    setIsOpen(false);
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/mensagens?with=${targetUserId}`);
  };

  return (
    <div ref={widgetRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      {/* Popover Card com Lista de Usuários */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-[320px] sm:w-[360px] max-h-[480px] bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header do Card */}
          <div className="p-4 border-b border-white/10 bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Usuários Online</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {onlineCount}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Conecte-se e inicie um bate-papo</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="p-2.5 border-b border-white/5 bg-slate-950/30">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuário..."
                className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[300px]">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Users className="w-8 h-8 text-slate-600" />
                <span>Nenhum usuário encontrado.</span>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isOnline = u.status === "online";

                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/60 transition-colors group"
                  >
                    <Link
                      href={`/perfil/${u.username}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 min-w-0 flex-1"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={
                            u.avatarUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                          }
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-emerald-500/50 transition-colors"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                            isOnline ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          title={isOnline ? "Online agora" : "Ausente"}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {u.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">@{u.username}</p>
                      </div>
                    </Link>

                    {/* Botão de Enviar Mensagem / Conversar */}
                    <button
                      onClick={() => handleStartChat(u.id)}
                      className="p-2 ml-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-sm"
                      title={`Conversar com ${u.name}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé do Card */}
          <div className="p-3 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Conexões em tempo real</span>
            </span>
            <Link
              href="/mensagens"
              onClick={() => setIsOpen(false)}
              className="text-emerald-400 font-semibold hover:underline"
            >
              Abrir Bate-Papo
            </Link>
          </div>
        </div>
      )}

      {/* Botão Flutuante Principal (Ícone na parte inferior) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-850 text-white border border-emerald-500/40 shadow-xl shadow-emerald-950/50 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Ver Usuários Online"
        title="Ver Usuários Online"
      >
        {/* Luz pulsante */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>

        {/* Ícone de Usuários */}
        <Users className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />

        {/* Texto e Contador */}
        <span className="text-xs font-semibold tracking-wide flex items-center gap-1">
          <span>Online</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
            {onlineCount}
          </span>
        </span>

        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        )}
      </button>
    </div>
  );
}
