"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  Users2,
  MessageSquare,
  Bell,
  Bookmark,
  Compass,
  User,
  Settings,
  Shield,
  PenSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SidebarLeft({ onOpenComposer }: { onOpenComposer?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: "Página Inicial", href: "/", icon: Home },
    {
      label: "Depoimentos",
      href: "/depoimentos",
      icon: Sparkles,
      badge: user?.pendingTestimonials && user.pendingTestimonials > 0 ? user.pendingTestimonials : undefined,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    { label: "Comunidades", href: "/comunidades", icon: Users2 },
    { label: "Mensagens", href: "/mensagens", icon: MessageSquare },
    {
      label: "Notificações",
      href: "/notificacoes",
      icon: Bell,
      badge: user?.unreadNotifications && user.unreadNotifications > 0 ? user.unreadNotifications : undefined,
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    { label: "Salvos", href: "/salvos", icon: Bookmark },
    { label: "Explorar", href: "/busca", icon: Compass },
  ];

  if (user) {
    navItems.push({
      label: "Meu Perfil",
      href: `/perfil/${user.username}`,
      icon: User,
    });
    navItems.push({
      label: "Configurações",
      href: "/configuracoes",
      icon: Settings,
    });
    if (user.role === "ADMIN") {
      navItems.push({
        label: "Painel Admin",
        href: "/admin",
        icon: Shield,
      });
    }
  }

  return (
    <aside className="hidden md:flex flex-col gap-4 sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto pr-2 pb-6">
      {/* Card do Usuário Logado */}
      {user && (
        <div className="glass-panel rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-emerald-900/40 via-emerald-700/30 to-amber-900/30 -z-0"></div>
          <div className="relative z-10 flex flex-col items-center text-center pt-2">
            <Link href={`/perfil/${user.username}`}>
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-emerald-500 object-cover shadow-md group-hover:scale-105 transition-transform"
              />
            </Link>
            <Link href={`/perfil/${user.username}`} className="mt-2 font-bold text-base text-white hover:text-emerald-400 transition-colors">
              {user.name}
            </Link>
            <span className="text-sm text-slate-400">@{user.username}</span>

            {/* Micro métricas */}
            <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-3 border-t border-white/5 text-center">
              <div>
                <span className="block text-base font-bold text-white">{user._count?.posts ?? 0}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Posts</span>
              </div>
              <div>
                <span className="block text-base font-bold text-white">{user._count?.followers ?? 0}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Seguidores</span>
              </div>
              <div>
                <span className="block text-base font-bold text-amber-400">{user._count?.receivedTestimonials ?? 0}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Depoimentos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu de Navegação */}
      <nav className="glass-panel rounded-2xl p-2 border border-white/5 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium transition-all ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || "bg-emerald-500/20 text-emerald-300"}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Botão de Ação Rápida */}
      {user && onOpenComposer && (
        <button
          onClick={onOpenComposer}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl gradient-brand text-slate-950 font-bold text-sm shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all transform active:scale-95"
        >
          <PenSquare className="w-4 h-4 text-slate-950" />
          <span>Escrever Publicação</span>
        </button>
      )}
    </aside>
  );
}
