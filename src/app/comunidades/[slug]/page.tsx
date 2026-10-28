"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { Users2, Lock, Globe, Plus, Check, Clock, Sparkles, Shield, Image, PenSquare } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PostCard from "@/components/feed/PostCard";
import PostComposerModal from "@/components/feed/PostComposerModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function SingleCommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const toast = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const loadCommunity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comunidades/${slug}`);
      const json = await res.json();
      if (json.community) {
        setData(json);
      }
    } catch (err) {
      console.error("Erro ao carregar comunidade:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCommunity();
  }, [loadCommunity]);

  const handleJoinToggle = async () => {
    if (!user) {
      toast.info("Faça login para participar.");
      return;
    }

    setJoinLoading(true);
    try {
      const res = await fetch(`/api/comunidades/${slug}/join`, { method: "POST" });
      const resJson = await res.json();
      if (res.ok) {
        toast.success(resJson.message);
        loadCommunity();
      } else {
        toast.error(resJson.error || "Erro ao processar.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="glass-panel rounded-3xl p-8 border border-white/5 animate-pulse h-64"></div>
      </AppShell>
    );
  }

  if (!data || !data.community) {
    return (
      <AppShell>
        <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center gap-3">
          <Users2 className="w-12 h-12 text-slate-500" />
          <h2 className="text-xl font-bold text-white">Comunidade não encontrada</h2>
          <Link href="/comunidades" className="mt-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs">
            Voltar para Comunidades
          </Link>
        </div>
      </AppShell>
    );
  }

  const { community, userRole, hasRequested, canViewContent, posts } = data;
  const isMember = Boolean(userRole);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Banner da Comunidade */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 relative">
          <div className="h-44 sm:h-56 w-full relative bg-slate-800 overflow-hidden">
            <img
              src={community.coverUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80"}
              alt={community.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
          </div>

          <div className="px-6 pb-6 pt-0 relative flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
              <div className="flex items-end gap-4">
                <img
                  src={community.avatarUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80"}
                  alt={community.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-900 shrink-0"
                />
                <div className="mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {community.category}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      {community.isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                      {community.isPrivate ? "Privada" : "Pública"}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">{community.name}</h1>
                </div>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={handleJoinToggle}
                disabled={joinLoading}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 ${
                  isMember
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    : hasRequested
                    ? "bg-amber-950/40 text-amber-300 border border-amber-500/30"
                    : "gradient-brand text-slate-950 shadow-emerald-900/30 hover:opacity-95"
                }`}
              >
                {isMember ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Membro ({userRole})</span>
                  </>
                ) : hasRequested ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Solicitação Enviada</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{community.isPrivate ? "Solicitar Entrada" : "Participar da Comunidade"}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-1">
              {community.description}
            </p>

            {/* Regras e Dono */}
            {community.rules && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 text-xs text-slate-400">
                <strong className="text-slate-200 block mb-1">Regras da Comunidade:</strong>
                <p className="whitespace-pre-line">{community.rules}</p>
              </div>
            )}
          </div>
        </div>

        {/* Verificação de Permissão de Visualização para Comunidades Privadas */}
        {!canViewContent ? (
          <div className="glass-panel rounded-3xl p-12 border border-amber-500/20 text-center flex flex-col items-center gap-3 bg-gradient-to-b from-amber-950/10 to-slate-900">
            <Lock className="w-12 h-12 text-amber-400" />
            <h3 className="font-bold text-white text-lg">Esta Comunidade é Privada</h3>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              O conteúdo, publicações e discussões internas desta comunidade são protegidos por controle de acesso e
              visíveis apenas para membros aprovados pelos moderadores.
            </p>
            <button
              onClick={handleJoinToggle}
              disabled={joinLoading}
              className="mt-2 px-6 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs shadow-md"
            >
              {hasRequested ? "Solicitação em Análise" : "Solicitar Entrada"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Compositor para Membros */}
            {isMember && (
              <div className="glass-panel rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                    alt="Você"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setIsComposerOpen(true)}
                    className="flex-1 text-left text-xs text-slate-400 bg-slate-900 hover:bg-slate-800/80 px-4 py-2.5 rounded-full border border-slate-800 transition-colors"
                  >
                    Compartilhar uma ideia com a comunidade...
                  </button>
                </div>
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="px-4 py-2 rounded-full gradient-brand text-slate-950 font-bold text-xs shrink-0"
                >
                  Publicar
                </button>
              </div>
            )}

            {/* Feed da Comunidade */}
            {posts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-2">
                <PenSquare className="w-8 h-8 text-slate-500" />
                <h4 className="font-bold text-white text-sm">Nenhuma publicação nesta comunidade ainda</h4>
                <p className="text-xs text-slate-400">Seja a primeira pessoa a puxar assunto com o grupo!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        communityId={community.id}
        communityName={community.name}
        onPostCreated={() => loadCommunity()}
      />
    </AppShell>
  );
}
