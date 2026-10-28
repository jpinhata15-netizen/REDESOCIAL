"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sparkles, Check, X, Trash2, Clock, ShieldCheck, HeartHandshake } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface TestimonialProps {
  testimonial: {
    id: string;
    content: string;
    status: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      name: string;
      avatarUrl?: string | null;
      isVerified?: boolean;
    };
  };
  isRecipient?: boolean;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export default function TestimonialCard({
  testimonial,
  isRecipient = false,
  onStatusChange,
}: TestimonialProps) {
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  let formattedDate = "recentemente";
  try {
    formattedDate = formatDistanceToNow(new Date(testimonial.createdAt), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    formattedDate = "recentemente";
  }

  const handleAction = async (action: "ACCEPT" | "REJECT" | "DELETE") => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/depoimentos/${testimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        if (onStatusChange) {
          onStatusChange(testimonial.id, action === "ACCEPT" ? "ACCEPTED" : "REJECTED");
        }
      } else {
        toast.error(data.error || "Erro ao processar depoimento.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = testimonial.status === "PENDING";

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all relative overflow-hidden ${
        isPending
          ? "border-amber-500/30 bg-amber-950/10 shadow-lg shadow-amber-950/20"
          : "border-white/5 bg-slate-900/60 hover:border-emerald-500/20"
      }`}
    >
      {/* Detalhe visual de brilho */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

      {/* Cabeçalho do Depoimento */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <Link href={`/perfil/${testimonial.author.username}`} className="flex items-center gap-3 group min-w-0">
          <img
            src={testimonial.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.author.username}`}
            alt={testimonial.author.name}
            className="w-11 h-11 rounded-full object-cover border border-slate-700 group-hover:border-amber-400 transition-colors shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors flex items-center gap-1.5 truncate">
              {testimonial.author.name}
              {testimonial.author.isVerified && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            </h4>
            <span className="text-xs text-slate-400 truncate block">@{testimonial.author.username}</span>
          </div>
        </Link>

        {/* Badge de Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isPending ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Aguardando sua aprovação</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Depoimento Aprovado</span>
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo do Depoimento (Aspas estilizadas e texto carinhoso) */}
      <div className="my-3.5 relative z-10">
        <p className="text-sm text-slate-200 leading-relaxed italic whitespace-pre-line break-words pl-3 border-l-2 border-amber-400/50">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>

      {/* Rodapé do Card com Data e Ações do Destinatário */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 relative z-10">
        <span>Enviado {formattedDate}</span>

        {/* Ações se for o destinatário visualizando */}
        {isRecipient && (
          <div className="flex items-center gap-2">
            {isPending ? (
              <>
                <button
                  onClick={() => handleAction("ACCEPT")}
                  disabled={isProcessing}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  title="Aceitar e exibir publicamente no seu perfil"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aprovar</span>
                </button>

                <button
                  onClick={() => handleAction("REJECT")}
                  disabled={isProcessing}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold border border-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                  title="Recusar depoimento"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Recusar</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAction("DELETE")}
                disabled={isProcessing}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Remover depoimento aceito"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remover do perfil</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
