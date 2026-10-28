"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users2, Plus, Search, Filter, Sparkles, RefreshCw } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import CommunityCard from "@/components/communities/CommunityCard";
import { useAuth } from "@/context/AuthContext";

export default function ComunidadesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Todas",
    "Tecnologia",
    "Artes & Fotografia",
    "Cultura & Literatura",
    "Gastronomia",
    "Esportes",
    "Música",
    "Cidades",
  ];

  const loadCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/comunidades?categoria=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.communities) {
        setCommunities(data.communities);
      }
    } catch (err) {
      console.error("Erro ao listar comunidades:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Banner de Exploração e Criação */}
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Users2 className="w-6 h-6 text-emerald-400" />
              <span>Explorar Comunidades</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
              Encontre pessoas que compartilham suas paixões, troque conhecimentos e participe de conversas enriquecedoras.
            </p>
          </div>

          {user && (
            <Link
              href="/comunidades/criar"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Criar Comunidade</span>
            </Link>
          )}
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Busca */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou assunto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categorias Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Comunidades */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-panel rounded-2xl h-64 animate-pulse bg-slate-800/40"></div>
            ))}
          </div>
        ) : communities.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center gap-3">
            <Users2 className="w-12 h-12 text-slate-500" />
            <h3 className="font-bold text-white text-base">Nenhuma comunidade encontrada</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Não encontramos nenhuma comunidade com os critérios informados. Que tal criar uma agora?
            </p>
            {user && (
              <Link
                href="/comunidades/criar"
                className="mt-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs"
              >
                Criar Primeira Comunidade
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
