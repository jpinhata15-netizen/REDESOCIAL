"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Heart,
  MessageCircle,
  Sparkles,
  Users2,
  UserPlus,
  CheckCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function NotificacoesPage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notificacoes");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notificacoes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        refreshUser();
        toast.success("Todas as notificações foram marcadas como lidas.");
      }
    } catch {
      toast.error("Erro ao atualizar notificações.");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "COMMENT":
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
      case "TESTIMONIAL":
        return <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case "FOLLOW":
        return <UserPlus className="w-4 h-4 text-teal-400" />;
      case "COMMUNITY":
        return <Users2 className="w-4 h-4 text-sky-400" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Central de Notificações</h1>
              <p className="text-xs text-slate-400">Acompanhe quem interagiu com você no Conecta.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Marcar todas como lidas</span>
            </button>
            <button
              onClick={loadNotifications}
              className="p-2 text-slate-400 hover:text-emerald-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Atualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Lista de Notificações */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel rounded-2xl p-4 border border-white/5 animate-pulse h-20"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center gap-3">
            <Bell className="w-10 h-10 text-slate-600" />
            <h3 className="font-bold text-white text-base">Nenhuma notificação por enquanto</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Quando alguém curtir suas fotos, comentar em suas publicações ou enviar um depoimento, você verá tudo aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notifications.map((notif) => {
              let time = "recentemente";
              try {
                time = formatDistanceToNow(new Date(notif.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                });
              } catch {}

              const CardContent = (
                <div
                  className={`glass-panel rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
                    notif.read
                      ? "border-white/5 bg-slate-900/40 opacity-75 hover:opacity-100"
                      : "border-emerald-500/30 bg-emerald-950/15 shadow-sm"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-slate-800 shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>

                  {!notif.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 animate-pulse"></span>
                  )}
                </div>
              );

              return notif.link ? (
                <Link key={notif.id} href={notif.link} className="block group">
                  {CardContent}
                </Link>
              ) : (
                <div key={notif.id}>{CardContent}</div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
