"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, TrendingUp, Sparkles, Plus, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface SuggestedUser {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  isVerified?: boolean;
}

export default function SidebarRight() {
  const { user } = useAuth();
  const toast = useToast();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Carregar sugestões de pessoas (perfis da seed)
    fetch("/api/busca?tipo=pessoas&q=a")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          const filtered = data.users.filter((u: any) => u.id !== user?.id).slice(0, 4);
          setSuggestedUsers(filtered);
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const toggleFollow = async (username: string) => {
    if (!user) {
      toast.info("Faça login para seguir outros membros.");
      return;
    }

    try {
      const res = await fetch(`/api/usuarios/${username}/follow`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setFollowingMap((prev) => ({ ...prev, [username]: data.isFollowing }));
        toast.success(data.isFollowing ? `Você agora segue @${username}!` : `Você deixou de seguir @${username}.`);
      }
    } catch {
      toast.error("Erro ao seguir usuário.");
    }
  };

  const trendingTopics = [
    { tag: "Brasil", postsCount: "12,4 mil posts", href: "/busca?q=Brasil" },
    { tag: "ConectaSocial", postsCount: "8,9 mil posts", href: "/busca?q=Conecta" },
    { tag: "TecnologiaBrasil", postsCount: "5,2 mil posts", href: "/busca?q=Tecnologia" },
    { tag: "Fotografia", postsCount: "3,7 mil posts", href: "/busca?q=Fotografia" },
    { tag: "CulturaBrasileira", postsCount: "2,8 mil posts", href: "/busca?q=Cultura" },
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pl-2 pb-6">
      {/* Quem Seguir */}
      <div className="glass-panel rounded-2xl p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Quem Seguir no Conecta</h3>
        </div>

        <div className="flex flex-col gap-3">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((person) => {
              const isFollowing = followingMap[person.username];
              return (
                <div key={person.id} className="flex items-center justify-between gap-3 group">
                  <Link href={`/perfil/${person.username}`} className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={person.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.username}`}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-emerald-500 transition-colors shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors truncate flex items-center gap-1">
                        {person.name}
                        {person.isVerified && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
                      </p>
                      <p className="text-sm text-slate-400 truncate">@{person.username}</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollow(person.username)}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 flex items-center gap-1 ${
                      isFollowing
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Seguindo</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400">Carregando sugestões...</p>
          )}
        </div>
      </div>

      {/* Assuntos do Momento (Tendências) */}
      <div className="glass-panel rounded-2xl p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Assuntos do Momento 🇧🇷</h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {trendingTopics.map((item) => (
            <Link
              key={item.tag}
              href={item.href}
              className="group p-2 rounded-xl hover:bg-slate-800/50 transition-colors flex flex-col"
            >
              <span className="text-xs text-slate-400">Tendência no Brasil</span>
              <span className="text-base font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                #{item.tag}
              </span>
              <span className="text-xs text-slate-500">{item.postsCount}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Rodapé e Links Institucionais */}
      <footer className="px-2 text-[11px] text-slate-500 flex flex-col gap-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/termos" className="hover:text-slate-300 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-slate-300 transition-colors">Privacidade (LGPD)</Link>
          <Link href="/ajuda" className="hover:text-slate-300 transition-colors">Central de Ajuda</Link>
          <Link href="/comunidades" className="hover:text-slate-300 transition-colors">Comunidades</Link>
        </div>
        <p className="text-slate-600">
          Conecta Social © {new Date().getFullYear()} — Feito com orgulho para o Brasil.
        </p>
      </footer>
    </aside>
  );
}
