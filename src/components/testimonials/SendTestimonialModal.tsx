"use client";

import React, { useState } from "react";
import { X, Sparkles, AlertCircle, Loader2, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface SendTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientUsername: string;
  recipientAvatar?: string | null;
  onSent?: () => void;
}

export default function SendTestimonialModal({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientUsername,
  recipientAvatar,
  onSent,
}: SendTestimonialModalProps) {
  const { user } = useAuth();
  const toast = useToast();

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const MAX_CHARS = 1000;
  const remainingChars = MAX_CHARS - content.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Faça login para enviar um depoimento.");
      return;
    }

    if (!content.trim()) {
      toast.error("O texto do depoimento não pode ser vazio.");
      return;
    }

    if (content.length > MAX_CHARS) {
      toast.error(`O depoimento excedeu o limite de ${MAX_CHARS} caracteres.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/depoimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setContent("");
        if (onSent) onSent();
        onClose();
      } else {
        toast.error(data.error || "Erro ao enviar depoimento.");
      }
    } catch {
      toast.error("Erro de conexão ao enviar depoimento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-amber-500/20 shadow-2xl bg-slate-900/95 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Enviar Depoimento Especial</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Card do Destinatário */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <img
              src={recipientAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientUsername}`}
              alt={recipientName}
              className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
            />
            <div>
              <span className="text-xs text-slate-400 block">Escrevendo para:</span>
              <span className="font-bold text-white text-sm block">{recipientName}</span>
              <span className="text-xs text-amber-400">@{recipientUsername}</span>
            </div>
          </div>

          {/* Aviso sobre moderação obrigatória */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Como funciona:</strong> Este depoimento será enviado de forma privada para {recipientName}. Ele só
              será publicado no perfil quando for <strong>aprovado expressamente</strong> por {recipientName}.
            </p>
          </div>

          {/* Campo de Texto */}
          <div className="flex flex-col gap-1">
            <textarea
              placeholder={`Escreva com carinho o que ${recipientName} representa para você, momentos marcantes ou palavras de amizade...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={MAX_CHARS}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
            />
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Máximo de 1.000 caracteres</span>
              <span className={remainingChars < 50 ? "text-amber-400 font-bold" : ""}>
                {remainingChars} restantes
              </span>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>Enviar Depoimento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
