"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit3,
  Flag,
  Globe,
  Users,
  Lock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import CommentSection from "./CommentSection";

export interface PostProps {
  post: {
    id: string;
    content: string;
    mediaUrls?: string[];
    videoUrl?: string | null;
    audience: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      name: string;
      avatarUrl?: string | null;
      isVerified?: boolean;
    };
    community?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    _count: {
      likes: number;
      comments: number;
      savedBy: number;
    };
    isLiked?: boolean;
    isSaved?: boolean;
  };
  onDelete?: (id: string) => void;
}

export default function PostCard({ post, onDelete }: PostProps) {
  const { user } = useAuth();
  const toast = useToast();

  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved));
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post._count.comments);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Formatação de data amigável em português do Brasil
  let formattedDate = "recentemente";
  try {
    formattedDate = formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    formattedDate = "recentemente";
  }

  // Curtir publicação com atualização otimista
  const handleLike = async () => {
    if (!user) {
      toast.info("Faça login para curtir publicações.");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    const prevLiked = isLiked;
    const prevCount = likesCount;

    // Atualização otimista imediata
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      } else {
        // Reverter em caso de falha
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
        toast.error("Erro ao curtir a publicação.");
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Erro de conexão.");
    } finally {
      setIsLiking(false);
    }
  };

  // Salvar publicação nos favoritos
  const handleSave = async () => {
    if (!user) {
      toast.info("Faça login para salvar publicações.");
      return;
    }

    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    try {
      const res = await fetch(`/api/posts/${post.id}/save`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.isSaved);
        toast.success(data.isSaved ? "Publicação salva nos favoritos!" : "Publicação removida dos favoritos.");
      } else {
        setIsSaved(prevSaved);
      }
    } catch {
      setIsSaved(prevSaved);
    }
  };

  // Compartilhar link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Link da publicação copiado para a área de transferência! 📋");
    }
  };

  // Excluir publicação
  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;

    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Publicação excluída com sucesso.");
        if (onDelete) onDelete(post.id);
      } else {
        toast.error("Erro ao excluir publicação.");
      }
    } catch {
      toast.error("Erro de conexão ao excluir.");
    }
  };

  // Denunciar publicação
  const handleReport = async () => {
    const reason = prompt("Por favor, descreva o motivo da denúncia:");
    if (!reason?.trim()) return;

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REPORT",
          targetType: "POST",
          targetId: post.id,
          reason,
        }),
      });
      if (res.ok) {
        toast.success("Denúncia enviada à equipe de moderação. Obrigado!");
      }
    } catch {
      toast.error("Erro ao enviar denúncia.");
    }
  };

  // Renderizar hashtags com destaque clicável
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_À-ÿ]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        const query = part.slice(1);
        return (
          <Link
            key={index}
            href={`/busca?q=${encodeURIComponent(query)}`}
            className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
          >
            {part}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <article className="glass-panel rounded-2xl p-5 border border-white/5 transition-all hover:border-white/10 shadow-lg shadow-black/20 flex flex-col gap-3.5">
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/perfil/${post.user.username}`} className="shrink-0">
            <img
              src={post.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`}
              alt={post.user.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-700 hover:border-emerald-500 transition-colors"
            />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/perfil/${post.user.username}`}
                className="font-bold text-white text-base hover:text-emerald-400 transition-colors truncate"
              >
                {post.user.name}
              </Link>
              {post.user.isVerified && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              {post.community && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  em{" "}
                  <Link
                    href={`/comunidades/${post.community.slug}`}
                    className="text-emerald-400 font-medium hover:underline"
                  >
                    {post.community.name}
                  </Link>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Link href={`/perfil/${post.user.username}`} className="hover:text-slate-300">
                @{post.user.username}
              </Link>
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span title={`Visibilidade: ${post.audience}`}>
                {post.audience === "PUBLIC" && <Globe className="w-3 h-3 text-slate-400 inline" />}
                {post.audience === "FOLLOWERS" && <Users className="w-3 h-3 text-slate-400 inline" />}
                {post.audience === "PRIVATE" && <Lock className="w-3 h-3 text-slate-400 inline" />}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Contextual de Opções */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-1 w-44 rounded-xl glass-dropdown z-40 py-1 text-xs shadow-2xl border border-slate-800 text-slate-200">
                <Link
                  href={`/post/${post.id}`}
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-800/80 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ver post individual</span>
                </Link>

                {user && (user.id === post.user.id || user.role === "ADMIN") ? (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleDelete();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir publicação</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleReport();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-amber-400 hover:bg-amber-950/30 transition-colors text-left"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Denunciar conteúdo</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conteúdo Textual */}
      {post.content && (
        <div className="text-base text-slate-200 leading-relaxed whitespace-pre-line break-words">
          {renderFormattedContent(post.content)}
        </div>
      )}

      {/* Galeria de Fotos */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div
          className={`grid gap-2 rounded-2xl overflow-hidden border border-slate-800 ${
            post.mediaUrls.length === 1
              ? "grid-cols-1"
              : post.mediaUrls.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {post.mediaUrls.map((imgUrl, i) => (
            <div key={i} className="relative aspect-video sm:aspect-square bg-slate-900 overflow-hidden group/img">
              <img
                src={imgUrl}
                alt={`Imagem ${i + 1}`}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Vídeo Anexado */}
      {post.videoUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-black flex items-center justify-center">
          {post.videoUrl.includes("youtube.com") || post.videoUrl.includes("youtu.be") ? (
            <iframe
              src={post.videoUrl.replace("watch?v=", "embed/")}
              title="Vídeo da publicação"
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <video src={post.videoUrl} controls className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {/* Barra de Interações (Curtir, Comentar, Salvar, Compartilhar) */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Curtir */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-90 ${
              isLiked
                ? "text-rose-500 bg-rose-500/10 font-bold"
                : "hover:text-rose-400 hover:bg-slate-800/60"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comentários */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              showComments ? "text-emerald-400 bg-emerald-500/10 font-bold" : "hover:text-emerald-400 hover:bg-slate-800/60"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>

          {/* Compartilhar */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
            title="Copiar link da publicação"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>

        {/* Salvar nos Favoritos */}
        <button
          onClick={handleSave}
          className={`p-2 rounded-full transition-colors ${
            isSaved ? "text-amber-400 bg-amber-400/10" : "hover:text-amber-400 hover:bg-slate-800/60"
          }`}
          title={isSaved ? "Remover dos salvos" : "Salvar publicação"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-400" : ""}`} />
        </button>
      </div>

      {/* Seção de Comentários Integrada */}
      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
    </article>
  );
}
