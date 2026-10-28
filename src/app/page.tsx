"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import PostCard from "@/components/feed/PostCard";
import PostComposerModal from "@/components/feed/PostComposerModal";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Flame, Users, Clock, Image, Video, PenSquare, RefreshCw } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("para-voce");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?tab=${activeTab}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Erro ao buscar publicações:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Ouvir evento global de criação de post
  useEffect(() => {
    const handlePostCreated = () => {
      loadPosts();
    };
    window.addEventListener("conecta:post-created", handlePostCreated);
    return () => window.removeEventListener("conecta:post-created", handlePostCreated);
  }, [loadPosts]);

  const handlePostDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* Banner de Boas-Vindas e Compositor Rápido */}
        {user ? (
          <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col gap-3 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <button
                onClick={() => setIsComposerOpen(true)}
                className="flex-1 bg-slate-900/90 hover:bg-slate-800/80 text-left text-base text-slate-400 hover:text-slate-200 px-5 py-3 rounded-full border border-slate-700 transition-colors"
              >
                Ei, {user.name.split(" ")[0]}! Que história você quer contar hoje?
              </button>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-emerald-400 font-medium transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span>Foto</span>
                </button>
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-amber-400 font-medium transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Vídeo</span>
                </button>
              </div>

              <button
                onClick={() => setIsComposerOpen(true)}
                className="px-4 py-1.5 rounded-full gradient-brand text-slate-950 font-bold text-xs shadow-md shadow-emerald-900/30 hover:opacity-95 transition-all"
              >
                Publicar
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-amber-950/20 text-center flex flex-col items-center gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              ✦
            </div>
            <h2 className="text-2xl font-black text-white">Bem-vindo(a) à Conecta!</h2>
            <p className="text-base text-slate-300 max-w-md leading-relaxed">
              A rede social brasileira feita para valorizar conexões reais, trocas culturais e comunidades autênticas.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="/cadastro"
                className="px-6 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-base shadow-lg shadow-emerald-900/40 hover:opacity-95 transition-all"
              >
                Criar Minha Conta Grátis
              </a>
              <a
                href="/login"
                className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-700 transition-colors"
              >
                Entrar
              </a>
            </div>
          </div>
        )}

        {/* Abas do Feed */}
        <div className="flex items-center justify-between border-b border-white/5 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("para-voce")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold transition-all ${
                activeTab === "para-voce"
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Para você</span>
            </button>

            {user && (
              <button
                onClick={() => setActiveTab("seguindo")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold transition-all ${
                  activeTab === "seguindo"
                    ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Seguindo</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("recentes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold transition-all ${
                activeTab === "recentes"
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Mais Recentes</span>
            </button>
          </div>

          <button
            onClick={() => loadPosts()}
            className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Atualizar feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Lista de Publicações */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel rounded-2xl p-5 border border-white/5 animate-pulse flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="w-32 h-3.5 bg-slate-800 rounded"></div>
                    <div className="w-20 h-2.5 bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-slate-800 rounded"></div>
                <div className="w-full h-44 bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Nenhuma publicação encontrada</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              {activeTab === "seguindo"
                ? "As pessoas que você segue ainda não publicaram nada recente. Siga mais amigos na barra lateral!"
                : "Seja a primeira pessoa a publicar e puxar conversa na rede Conecta!"}
            </p>
            {user && (
              <button
                onClick={() => setIsComposerOpen(true)}
                className="mt-2 px-5 py-2 rounded-full gradient-brand text-slate-950 font-bold text-sm shadow-md"
              >
                Criar Publicação Agora
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Nova Publicação */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])}
      />
    </AppShell>
  );
}
