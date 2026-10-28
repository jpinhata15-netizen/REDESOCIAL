"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send, CornerDownRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string | null;
  };
  replies?: Comment[];
}

export default function CommentSection({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded?: () => void;
}) {
  const { user } = useAuth();
  const toast = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.comments) setComments(data.comments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Faça login para comentar.");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyingTo?.id || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Comentário adicionado!");
        setNewComment("");
        setReplyingTo(null);

        // Recarregar comentários
        const refresh = await fetch(`/api/posts/${postId}/comments`);
        const refreshData = await refresh.json();
        if (refreshData.comments) setComments(refreshData.comments);
        if (onCommentAdded) onCommentAdded();
      } else {
        toast.error(data.error || "Erro ao comentar.");
      }
    } catch {
      toast.error("Erro de conexão ao comentar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-3 border-t border-white/5 flex flex-col gap-3">
      {/* Campo de Inserção de Comentário */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {replyingTo && (
          <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <span>Respondendo a <strong>@{replyingTo.name}</strong></span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "guest"}`}
            alt={user?.name || "Visitante"}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={user ? "Escreva uma resposta acolhedora..." : "Faça login para participar da conversa..."}
              disabled={!user || isSubmitting}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-4 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!user || isSubmitting || !newComment.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-400 hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>

      {/* Lista de Comentários */}
      {loading ? (
        <div className="py-2 text-center text-xs text-slate-500">Carregando comentários...</div>
      ) : comments.length === 0 ? (
        <div className="py-2 text-center text-xs text-slate-500">
          Nenhum comentário ainda. Seja a primeira pessoa a interagir!
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-2">
          {comments.map((comment) => {
            let commentDate = "agora";
            try {
              commentDate = formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: ptBR,
              });
            } catch {
              commentDate = "agora";
            }

            return (
              <div key={comment.id} className="flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <Link href={`/perfil/${comment.user.username}`}>
                    <img
                      src={comment.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.username}`}
                      alt={comment.user.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-700"
                    />
                  </Link>
                  <div className="flex-1 bg-slate-900/60 rounded-2xl px-3.5 py-2 border border-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/perfil/${comment.user.username}`}
                        className="font-bold text-xs text-white hover:text-emerald-400 transition-colors"
                      >
                        {comment.user.name}
                      </Link>
                      <span className="text-[10px] text-slate-500">{commentDate}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 whitespace-pre-line break-words">{comment.content}</p>

                    {user && (
                      <button
                        onClick={() => setReplyingTo({ id: comment.id, name: comment.user.username })}
                        className="mt-1.5 text-[10px] font-semibold text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Responder</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Respostas Aninhadas */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-9 flex flex-col gap-2 border-l border-white/5 ml-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <Link href={`/perfil/${reply.user.username}`}>
                          <img
                            src={reply.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user.username}`}
                            alt={reply.user.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700"
                          />
                        </Link>
                        <div className="flex-1 bg-slate-900/40 rounded-xl px-3 py-1.5 border border-white/5">
                          <Link
                            href={`/perfil/${reply.user.username}`}
                            className="font-semibold text-xs text-slate-200 hover:text-emerald-400 transition-colors block"
                          >
                            {reply.user.name}
                          </Link>
                          <p className="text-xs text-slate-300 mt-0.5">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
