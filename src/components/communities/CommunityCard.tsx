"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users2, Lock, Globe, Plus, Check, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface CommunityCardProps {
  community: {
    id: string;
    name: string;
    slug: string;
    description: string;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    category: string;
    isPrivate: boolean;
    _count?: {
      members: number;
      posts: number;
    };
  };
  initialIsMember?: boolean;
}

export default function CommunityCard({ community, initialIsMember = false }: CommunityCardProps) {
  const { user } = useAuth();
  const toast = useToast();

  const [isMember, setIsMember] = useState(initialIsMember);
  const [membersCount, setMembersCount] = useState(community._count?.members || 1);
  const [hasRequested, setHasRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleJoinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Faça login para participar de comunidades.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/comunidades/${community.slug}/join`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        if (data.action === "JOINED") {
          setIsMember(true);
          setMembersCount((prev) => prev + 1);
        } else if (data.action === "LEFT") {
          setIsMember(false);
          setMembersCount((prev) => Math.max(1, prev - 1));
        } else if (data.action === "REQUESTED") {
          setHasRequested(true);
        } else if (data.action === "CANCELLED") {
          setHasRequested(false);
        }
      } else {
        toast.error(data.error || "Erro ao atualizar participação.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      href={`/comunidades/${community.slug}`}
      className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-lg shadow-black/20"
    >
      <div>
        {/* Capa */}
        <div className="h-28 w-full relative bg-slate-800 overflow-hidden">
          <img
            src={community.coverUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"}
            alt={community.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
              {community.category}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md ${
                community.isPrivate
                  ? "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                  : "bg-slate-900/80 text-slate-300 border border-slate-700"
              }`}
            >
              {community.isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
              {community.isPrivate ? "Privada" : "Pública"}
            </span>
          </div>
        </div>

        {/* Informações da Comunidade */}
        <div className="p-4 pt-0 relative flex flex-col gap-2">
          {/* Avatar sobreposto */}
          <div className="-mt-8 mb-1 flex items-end justify-between">
            <img
              src={community.avatarUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80"}
              alt={community.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-900 shadow-md group-hover:border-emerald-500 transition-colors"
            />
            <div className="text-right text-xs text-slate-400 flex items-center gap-1">
              <Users2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{membersCount} {membersCount === 1 ? "membro" : "membros"}</span>
            </div>
          </div>

          <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
            {community.name}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        </div>
      </div>

      {/* Botão de Participação */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={handleJoinToggle}
          disabled={loading}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isMember
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              : hasRequested
              ? "bg-amber-950/40 text-amber-300 border border-amber-500/30"
              : "gradient-brand text-slate-950 shadow-md shadow-emerald-900/30 hover:opacity-95"
          }`}
        >
          {isMember ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Participando</span>
            </>
          ) : hasRequested ? (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span>Solicitação Enviada</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{community.isPrivate ? "Solicitar Entrada" : "Participar"}</span>
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
