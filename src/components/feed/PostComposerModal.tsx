"use client";

import React, { useState, useRef } from "react";
import { X, Image as ImageIcon, Video, Globe, Lock, Users, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (newPost: any) => void;
  communityId?: string;
  communityName?: string;
}

export default function PostComposerModal({
  isOpen,
  onClose,
  onPostCreated,
  communityId,
  communityName,
}: PostComposerModalProps) {
  const { user } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("PUBLIC");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Upload simulado de foto local / Leitor de arquivo em Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Apenas imagens são permitidas.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrls((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0 && !videoUrl.trim()) {
      toast.error("Adicione ao menos um texto ou mídia para publicar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          mediaUrls,
          videoUrl: videoUrl.trim() || null,
          audience,
          communityId: communityId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao publicar.");
        return;
      }

      toast.success("Publicado com sucesso!");
      setContent("");
      setMediaUrls([]);
      setVideoUrl("");
      setShowVideoInput(false);
      if (onPostCreated) {
        onPostCreated(data.post);
      }
      onClose();
    } catch {
      toast.error("Erro de conexão ao enviar a publicação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h2 className="font-bold text-white text-base">
              {communityName ? `Publicar em ${communityName}` : "Criar Publicação"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Compositor */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Informações do Autor e Seletor de Público */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "user"}`}
                alt={user?.name || "Usuário"}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div>
                <span className="font-semibold text-white text-sm block">{user?.name}</span>
                <span className="text-xs text-slate-400">@{user?.username}</span>
              </div>
            </div>

            {/* Seletor de Público */}
            {!communityId && (
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="PUBLIC">🌍 Público</option>
                <option value="FOLLOWERS">👥 Seguidores</option>
                <option value="PRIVATE">🔒 Privado</option>
              </select>
            )}
          </div>

          {/* Campo de Texto */}
          <textarea
            placeholder={`Solte a sua voz, ${user?.name?.split(" ")[0] || "amigo"}! Conte uma novidade, compartilhe uma foto ou traga uma boa história para a comunidade...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none"
          />

          {/* Pré-visualização de Imagens Anexadas */}
          {mediaUrls.length > 0 && (
            <div className={`grid gap-2 ${mediaUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {mediaUrls.map((url, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden border border-slate-700 group h-36">
                  <img src={url} alt={`Anexo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Campo de Vídeo (se ativado) */}
          {showVideoInput && (
            <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <Video className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="url"
                placeholder="Cole o link do vídeo (YouTube, MP4, etc.)..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setVideoUrl("");
                  setShowVideoInput(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Barra de Ferramentas Inferior */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Input escondido para fotos */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-emerald-400 hover:bg-emerald-950/40 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Adicionar fotos"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setShowVideoInput(!showVideoInput)}
                className="p-2 text-amber-400 hover:bg-amber-950/40 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Adicionar link de vídeo"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Vídeo</span>
              </button>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isSubmitting || (!content.trim() && mediaUrls.length === 0 && !videoUrl.trim())}
              className="flex items-center gap-2 px-5 py-2 rounded-full gradient-brand text-slate-950 font-bold text-sm shadow-md shadow-emerald-900/30 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Publicar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
