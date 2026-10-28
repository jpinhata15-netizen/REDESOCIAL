"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Users, Users2, Layers, Sparkles, Plus, ArrowRight } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PostCard from "@/components/feed/PostCard";
import CommunityCard from "@/components/communities/CommunityCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("todos");
  const [results, setResults] = useState<{ users: any[]; communities: any[]; posts: any[] }>({
    users: [],
    communities: [],
    posts: [],
  });
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (q: string, tab: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/busca?q=${encodeURIComponent(q)}&tipo=${tab}`);
      const data = await res.json();
      setResults({
        users: data.users || [],
        communities: data.communities || [],
        posts: data.posts || [],
      });
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, activeTab);
    }
  }, [initialQuery, activeTab, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, activeTab);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de Busca Principal */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-4 border border-white/5 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por pessoas, comunidades, hashtags #..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl gradient-brand text-slate-950 font-bold text-xs shadow-md shrink-0 active:scale-95 transition-all"
        >
          Buscar
        </button>
      </form>

      {/* Abas da Busca */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("todos")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "todos" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          Todos os Resultados
        </button>
        <button
          onClick={() => setActiveTab("pessoas")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "pessoas" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pessoas ({results.users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("comunidades")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "comunidades" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Comunidades ({results.communities.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "posts" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Publicações ({results.posts.length})</span>
        </button>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Buscando na rede Conecta...</div>
      ) : !query.trim() ? (
        <div className="glass-panel rounded-2xl p-12 border border-white/5 text-center text-xs text-slate-400">
          Digite um termo acima para iniciar a busca.
        </div>
      ) : results.users.length === 0 && results.communities.length === 0 && results.posts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center gap-2">
          <Search className="w-10 h-10 text-slate-600" />
          <h3 className="font-bold text-white text-base">Nenhum resultado para &ldquo;{query}&rdquo;</h3>
          <p className="text-xs text-slate-400 max-w-sm">Tente palavras diferentes ou navegue pelas comunidades.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Pessoas */}
          {(activeTab === "todos" || activeTab === "pessoas") && results.users.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Pessoas</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/perfil/${u.username}`}
                    className="glass-panel rounded-2xl p-4 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-700 group-hover:border-emerald-500 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 truncate flex items-center gap-1">
                          {u.name}
                          {u.isVerified && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </h4>
                        <span className="text-xs text-slate-400 block truncate">@{u.username}</span>
                        {u.location && <span className="text-[10px] text-slate-500 truncate block mt-0.5">{u.location}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comunidades */}
          {(activeTab === "todos" || activeTab === "comunidades") && results.communities.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users2 className="w-4 h-4 text-emerald-400" />
                <span>Comunidades</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.communities.map((c) => (
                  <CommunityCard key={c.id} community={c} />
                ))}
              </div>
            </div>
          )}

          {/* Publicações */}
          {(activeTab === "todos" || activeTab === "posts") && results.posts.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Publicações</span>
              </h3>
              <div className="flex flex-col gap-4">
                {results.posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BuscaPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Carregando busca...</div>}>
        <SearchContent />
      </Suspense>
    </AppShell>
  );
}
