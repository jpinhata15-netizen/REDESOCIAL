"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users2, Sparkles, MessageSquare, User, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MobileNav({ onOpenComposer }: { onOpenComposer?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-header border-t border-white/10 bg-slate-950/95 px-4 py-2 flex items-center justify-around backdrop-blur-2xl">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          pathname === "/" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Feed</span>
      </Link>

      <Link
        href="/comunidades"
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          pathname.startsWith("/comunidades") ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Users2 className="w-5 h-5" />
        <span className="text-[10px]">Grupos</span>
      </Link>

      {/* Botão Central de Nova Publicação */}
      {user && onOpenComposer && (
        <button
          onClick={onOpenComposer}
          className="w-12 h-12 -mt-5 rounded-full gradient-brand text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform active:scale-90 transition-transform"
          aria-label="Nova Publicação"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      )}

      <Link
        href="/depoimentos"
        className={`flex flex-col items-center gap-1 p-1 transition-colors relative ${
          pathname === "/depoimentos" ? "text-amber-400 font-bold" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px]">Depoimentos</span>
        {user?.pendingTestimonials && user.pendingTestimonials > 0 ? (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        ) : null}
      </Link>

      <Link
        href={user ? `/perfil/${user.username}` : "/login"}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          user && pathname.startsWith(`/perfil/${user.username}`) ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {user ? (
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.name}
            className="w-5 h-5 rounded-full object-cover border border-slate-700"
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px]">{user ? "Perfil" : "Entrar"}</span>
      </Link>
    </nav>
  );
}
