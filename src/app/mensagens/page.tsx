"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Send, Search, Sparkles, User, Loader2, ArrowLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

function MessagesContent() {
  const { user } = useAuth();
  const toast = useToast();
  const searchParams = useSearchParams();
  const initialWithId = searchParams.get("with");

  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(initialWithId);
  const [activePartner, setActivePartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar conversas
  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/mensagens");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (!activePartnerId && data.conversations.length > 0) {
          setActivePartnerId(data.conversations[0].partner.id);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar conversas:", err);
    } finally {
      setLoadingConv(false);
    }
  }, [user, activePartnerId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Carregar mensagens da conversa ativa
  const loadActiveMessages = useCallback(async (isPolling = false) => {
    if (!activePartnerId) return;
    if (!isPolling) setLoadingChat(true);
    try {
      const res = await fetch(`/api/mensagens?with=${activePartnerId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages((prev) => {
          if (
            prev.length !== data.messages.length ||
            (prev.length > 0 && data.messages.length > 0 && prev[prev.length - 1].id !== data.messages[data.messages.length - 1].id)
          ) {
            return data.messages;
          }
          return prev;
        });
        if (data.partner) setActivePartner(data.partner);
      }
    } catch (err) {
      if (!isPolling) console.error("Erro ao carregar chat:", err);
    } finally {
      if (!isPolling) setLoadingChat(false);
    }
  }, [activePartnerId]);

  useEffect(() => {
    loadActiveMessages();
    const interval = setInterval(() => {
      loadActiveMessages(true);
      loadConversations();
    }, 3000);
    return () => clearInterval(interval);
  }, [loadActiveMessages, loadConversations]);

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId || isSending) return;

    setIsSending(true);
    const textToSend = inputText.trim();
    setInputText("");

    try {
      const res = await fetch("/api/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: activePartnerId,
          content: textToSend,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.messageData]);
        loadConversations();
      } else {
        toast.error(data.error || "Erro ao enviar mensagem.");
      }
    } catch {
      toast.error("Erro de conexão ao enviar mensagem.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl bg-slate-900/90 overflow-hidden h-[calc(100vh-8rem)] flex">
      {/* Coluna Esquerda: Lista de Conversas */}
      <div
        className={`w-full sm:w-80 border-r border-white/5 flex flex-col shrink-0 ${
          activePartnerId ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Mensagens</span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {loadingConv ? (
            <div className="p-4 text-center text-xs text-slate-500">Carregando conversas...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <MessageSquare className="w-8 h-8 text-slate-600" />
              <span>Nenhuma conversa iniciada ainda. Visite um perfil para enviar uma mensagem.</span>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.partner.id === activePartnerId;
              let timeStr = "";
              try {
                timeStr = formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                });
              } catch {}

              return (
                <button
                  key={conv.partner.id}
                  onClick={() => setActivePartnerId(conv.partner.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-colors relative ${
                    isActive ? "bg-slate-800/90 border border-emerald-500/30" : "hover:bg-slate-800/40"
                  }`}
                >
                  <img
                    src={conv.partner.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.partner.username}`}
                    alt={conv.partner.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-white truncate">{conv.partner.name}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">{timeStr}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage.content}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Coluna Direita: Fluxo do Chat */}
      <div
        className={`flex-1 flex flex-col bg-slate-950/40 ${
          !activePartnerId ? "hidden sm:flex items-center justify-center" : "flex"
        }`}
      >
        {activePartner ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivePartnerId(null)}
                  className="sm:hidden p-1 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <Link href={`/perfil/${activePartner.username}`} className="flex items-center gap-2.5 group">
                  <img
                    src={activePartner.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activePartner.username}`}
                    alt={activePartner.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-emerald-500 transition-colors"
                  />
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors block">
                      {activePartner.name}
                    </span>
                    <span className="text-xs text-slate-400">@{activePartner.username}</span>
                  </div>
                </Link>
              </div>

              <Link
                href={`/perfil/${activePartner.username}`}
                className="text-xs font-semibold text-emerald-400 hover:underline"
              >
                Ver Perfil
              </Link>
            </div>

            {/* Lista de Mensagens com Balões */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {loadingChat ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                  <span>Diga um &ldquo;Olá!&rdquo; para {activePartner.name} e inicie a conversa.</span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  let time = "";
                  try {
                    time = format(new Date(msg.createdAt), "HH:mm");
                  } catch {}

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[75%] ${isMine ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs shadow-md leading-relaxed whitespace-pre-line break-words ${
                          isMine
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-br-none"
                            : "bg-slate-800 text-slate-100 rounded-bl-none border border-white/5"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 px-1">{time}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/60 border-t border-white/5 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Mensagem para ${activePartner.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="p-2.5 rounded-full gradient-brand text-slate-950 font-bold shadow-md hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-8 text-xs text-slate-500 flex flex-col items-center gap-2">
            <MessageSquare className="w-10 h-10 text-slate-700" />
            <span>Selecione uma conversa ao lado para abrir as mensagens.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MensagensPage() {
  return (
    <AppShell hideRightSidebar>
      <Suspense fallback={<div className="p-10 text-center text-xs text-slate-500">Carregando mensagens...</div>}>
        <MessagesContent />
      </Suspense>
    </AppShell>
  );
}
