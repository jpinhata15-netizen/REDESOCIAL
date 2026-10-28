"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Clock, CheckCircle2, Send, ShieldAlert, Heart, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DepoimentosPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "sent">("pending");
  const [receivedTestimonials, setReceivedTestimonials] = useState<any[]>([]);
  const [sentTestimonials, setSentTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [resReceived, resSent] = await Promise.all([
        fetch("/api/depoimentos?filter=received"),
        fetch("/api/depoimentos?filter=sent"),
      ]);
      const dataReceived = await resReceived.json();
      const dataSent = await resSent.json();

      if (dataReceived.testimonials) setReceivedTestimonials(dataReceived.testimonials);
      if (dataSent.testimonials) setSentTestimonials(dataSent.testimonials);
    } catch (err) {
      console.error("Erro ao carregar depoimentos:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setReceivedTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    refreshUser();
  };

  const pendingList = receivedTestimonials.filter((t) => t.status === "PENDING");
  const acceptedList = receivedTestimonials.filter((t) => t.status === "ACCEPTED");

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* Banner Explicativo do Recurso de Depoimentos */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-slate-900 to-emerald-950/20 relative overflow-hidden shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Sistema de Depoimentos Conecta
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                  Exclusivo
                </span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                Depoimentos são mensagens de carinho, respeito e reconhecimento escritas por amigos. No Conecta, sua
                privacidade é sagrada: <strong>nenhum depoimento é exibido publicamente sem a sua aprovação expressa</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="flex items-center justify-between border-b border-white/5 pb-1 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                activeTab === "pending"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pendentes para Aprovação</span>
              {pendingList.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center">
                  {pendingList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("accepted")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                activeTab === "accepted"
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Depoimentos Publicados</span>
              <span className="text-xs text-slate-500">({acceptedList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("sent")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                activeTab === "sent"
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Send className="w-4 h-4 text-teal-400" />
              <span>Enviados por Mim</span>
              <span className="text-xs text-slate-500">({sentTestimonials.length})</span>
            </button>
          </div>

          <button
            onClick={() => loadData()}
            className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Conteúdo da Aba */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="glass-panel rounded-2xl p-6 border border-white/5 animate-pulse h-36"></div>
            ))}
          </div>
        ) : activeTab === "pending" ? (
          pendingList.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Tudo em dia!</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Você não possui nenhum depoimento pendente de aprovação no momento. Quando alguém escrever para você, ele
                aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-xs text-amber-300/90 bg-amber-950/30 p-3 rounded-xl border border-amber-500/20 flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Os depoimentos abaixo estão <strong>invisíveis para terceiros</strong> até que você clique em Aprovar.
                </span>
              </div>
              {pendingList.map((t) => (
                <TestimonialCard
                  key={t.id}
                  testimonial={t}
                  isRecipient={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )
        ) : activeTab === "accepted" ? (
          acceptedList.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-3">
              <Sparkles className="w-10 h-10 text-slate-500" />
              <h3 className="font-bold text-white text-base">Nenhum depoimento publicado ainda</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Depoimentos que você aprovar serão exibidos com orgulho na aba de Depoimentos do seu perfil público.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {acceptedList.map((t) => (
                <TestimonialCard
                  key={t.id}
                  testimonial={t}
                  isRecipient={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )
        ) : (
          sentTestimonials.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center flex flex-col items-center gap-3">
              <Send className="w-10 h-10 text-slate-500" />
              <h3 className="font-bold text-white text-base">Você ainda não enviou depoimentos</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Visite o perfil de um amigo e clique em &ldquo;Enviar Depoimento&rdquo; para deixar uma mensagem inesquecível!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sentTestimonials.map((t) => (
                <div key={t.id} className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Link href={`/perfil/${t.recipient.username}`} className="flex items-center gap-2 group">
                      <img
                        src={t.recipient.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.recipient.username}`}
                        alt={t.recipient.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-semibold text-white group-hover:text-emerald-400">
                        Para: {t.recipient.name} (@{t.recipient.username})
                      </span>
                    </Link>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        t.status === "ACCEPTED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : t.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {t.status === "ACCEPTED" ? "Aprovado" : t.status === "PENDING" ? "Aguardando aprovação" : "Recusado"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic pl-3 border-l-2 border-emerald-500/40 mt-1">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
