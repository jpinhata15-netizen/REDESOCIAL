"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SalvosPage() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/salvos")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setSavedPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Publicações Salvas</h1>
            <p className="text-xs text-slate-400">Suas postagens e memórias favoritas reunidas em um só lugar.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="glass-panel rounded-2xl p-6 border border-white/5 animate-pulse h-48"></div>
            ))}
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center gap-3">
            <Bookmark className="w-10 h-10 text-slate-600" />
            <h3 className="font-bold text-white text-base">Nenhum item salvo ainda</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Quando você encontrar uma postagem interessante no feed, clique no ícone de marcador para guardá-la aqui.
            </p>
            <Link href="/" className="mt-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs">
              Explorar o Feed
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => setSavedPosts((prev) => prev.filter((p) => p.id !== post.id))}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
