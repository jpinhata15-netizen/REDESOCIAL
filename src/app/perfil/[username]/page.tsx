"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MapPin,
  Globe,
  Calendar,
  Sparkles,
  MessageSquare,
  UserPlus,
  UserCheck,
  Heart,
  Share2,
  Edit3,
  Camera,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PostCard from "@/components/feed/PostCard";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import SendTestimonialModal from "@/components/testimonials/SendTestimonialModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "testimonials" | "media" | "about">("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isSendTestimonialOpen, setIsSendTestimonialOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/usuarios/${username}`);
      const data = await res.json();
      if (data.user) {
        setProfileData(data);
        setIsFollowing(Boolean(data.isFollowing));
        setFollowersCount(data.user._count?.followers || 0);
      } else {
        setProfileData(null);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.info("Faça login para seguir perfis.");
      return;
    }

    try {
      const res = await fetch(`/api/usuarios/${username}/follow`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
        toast.success(data.isFollowing ? `Agora você segue @${username}!` : `Você deixou de seguir @${username}.`);
      }
    } catch {
      toast.error("Erro ao atualizar relacionamento.");
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link do perfil copiado! 📋");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="glass-panel rounded-3xl p-8 border border-white/5 animate-pulse flex flex-col gap-4">
          <div className="h-44 bg-slate-800 rounded-2xl"></div>
          <div className="w-24 h-24 rounded-full bg-slate-700 -mt-16 ml-6 border-4 border-slate-900"></div>
          <div className="h-6 w-48 bg-slate-800 rounded"></div>
          <div className="h-4 w-72 bg-slate-800 rounded"></div>
        </div>
      </AppShell>
    );
  }

  if (!profileData || !profileData.user) {
    return (
      <AppShell>
        <div className="glass-panel rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center gap-3">
          <Sparkles className="w-12 h-12 text-slate-500" />
          <h2 className="text-xl font-bold text-white">Perfil não encontrado</h2>
          <p className="text-sm text-slate-400">O usuário @{username} não existe ou foi renomeado.</p>
          <Link href="/" className="mt-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs">
            Voltar para o Feed
          </Link>
        </div>
      </AppShell>
    );
  }

  const { user, testimonials, posts } = profileData;
  const isOwnProfile = currentUser?.id === user.id;

  let memberSince = "2026";
  try {
    memberSince = format(new Date(user.createdAt), "MMMM 'de' yyyy", { locale: ptBR });
  } catch {}

  const interestsList = user.interests ? user.interests.split(",").map((i: string) => i.trim()).filter(Boolean) : [];

  // Mídias filtradas
  const mediaPosts = posts.filter((p: any) => p.mediaUrls && p.mediaUrls.length > 0);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Banner do Perfil com Capa e Avatar */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 relative">
          {/* Foto de Capa */}
          <div className="h-48 sm:h-64 w-full relative bg-slate-800 overflow-hidden">
            <img
              src={user.coverUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80"}
              alt={`Capa de ${user.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
          </div>

          {/* Área Principal de Perfil (Avatar + Ações) */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-900"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {isOwnProfile ? (
                  <Link
                    href="/configuracoes"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>Editar Meu Perfil</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                        isFollowing
                          ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                          : "gradient-brand text-slate-950 shadow-emerald-900/30 hover:opacity-95"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Seguindo</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Seguir</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsSendTestimonialOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/30 transition-all active:scale-95"
                      title="Escrever um depoimento que será publicado após a aprovação do usuário"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Enviar Depoimento</span>
                    </button>

                    <Link
                      href={`/mensagens?with=${user.id}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                      title="Enviar Mensagem Privada"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  </>
                )}

                <button
                  onClick={handleShareProfile}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title="Compartilhar Perfil"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nome e Bio */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">{user.name}</h1>
                {user.isVerified && <Sparkles className="w-4 h-4 text-amber-400" />}
              </div>
              <span className="text-sm text-emerald-400 font-medium">@{user.username}</span>

              {user.bio && (
                <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl whitespace-pre-line">
                  {user.bio}
                </p>
              )}

              {/* Metadados adicionais */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 flex-wrap">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Membro desde {memberSince}
                </span>
              </div>
            </div>

            {/* Barra de Métricas */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-sm">
              <div className="flex items-center gap-1.5">
                <strong className="text-white font-bold">{user._count?.posts || 0}</strong>
                <span className="text-slate-400 text-xs">Publicações</span>
              </div>
              <div className="flex items-center gap-1.5">
                <strong className="text-white font-bold">{followersCount}</strong>
                <span className="text-slate-400 text-xs">Seguidores</span>
              </div>
              <div className="flex items-center gap-1.5">
                <strong className="text-white font-bold">{user._count?.following || 0}</strong>
                <span className="text-slate-400 text-xs">Seguindo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <strong className="text-amber-400 font-bold">{user._count?.receivedTestimonials || 0}</strong>
                <span className="text-slate-400 text-xs">Depoimentos Aceitos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Conteúdo */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === "posts"
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Publicações ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === "testimonials"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Depoimentos Aceitos ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === "media"
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeria de Fotos</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === "about"
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sobre & Interesses</span>
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === "posts" && (
          posts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-2">
              <Layers className="w-8 h-8 text-slate-500" />
              <p className="text-sm text-slate-400">{user.name} ainda não publicou nada no feed.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )
        )}

        {activeTab === "testimonials" && (
          testimonials.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 border border-amber-500/10 text-center flex flex-col items-center gap-3">
              <Sparkles className="w-10 h-10 text-amber-400" />
              <h3 className="font-bold text-white text-base">Nenhum depoimento aceito ainda</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Seja a primeira pessoa a escrever um depoimento especial para {user.name}!
              </p>
              {!isOwnProfile && (
                <button
                  onClick={() => setIsSendTestimonialOpen(true)}
                  className="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md"
                >
                  Escrever Depoimento Agora
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <span>Depoimentos aprovados e publicados por {user.name}.</span>
                {!isOwnProfile && (
                  <button
                    onClick={() => setIsSendTestimonialOpen(true)}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    + Enviar depoimento
                  </button>
                )}
              </div>
              {testimonials.map((t: any) => (
                <TestimonialCard key={t.id} testimonial={t} isRecipient={isOwnProfile} />
              ))}
            </div>
          )
        )}

        {activeTab === "media" && (
          mediaPosts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-slate-500" />
              <p className="text-sm text-slate-400">Nenhuma foto compartilhada ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediaPosts.flatMap((p: any) =>
                p.mediaUrls.map((url: string, idx: number) => (
                  <Link
                    key={`${p.id}-${idx}`}
                    href={`/post/${p.id}`}
                    className="aspect-square rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500 transition-colors group relative"
                  >
                    <img src={url} alt="Foto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                ))
              )}
            </div>
          )
        )}

        {activeTab === "about" && (
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Apresentação</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {user.bio || "Nenhuma biografia informada até o momento."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3">Interesses & Afinidades</h3>
              {interestsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Nenhum interesse selecionado.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Enviar Depoimento */}
      <SendTestimonialModal
        isOpen={isSendTestimonialOpen}
        onClose={() => setIsSendTestimonialOpen(false)}
        recipientId={user.id}
        recipientName={user.name}
        recipientUsername={user.username}
        recipientAvatar={user.avatarUrl}
      />
    </AppShell>
  );
}
