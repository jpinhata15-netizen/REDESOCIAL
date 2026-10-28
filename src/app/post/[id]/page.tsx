"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import PostCard from "@/components/feed/PostCard";

export default function SinglePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      if (data.post) setPost(data.post);
    } catch (err) {
      console.error("Erro ao carregar post:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Feed Principal</span>
        </Link>

        {loading ? (
          <div className="glass-panel rounded-2xl p-6 border border-white/5 animate-pulse h-64"></div>
        ) : !post ? (
          <div className="glass-panel rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center gap-3">
            <Sparkles className="w-10 h-10 text-slate-600" />
            <h2 className="text-lg font-bold text-white">Publicação não encontrada</h2>
            <p className="text-xs text-slate-400">Esta publicação pode ter sido removida pelo autor.</p>
            <Link href="/" className="mt-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs">
              Voltar para o Feed
            </Link>
          </div>
        ) : (
          <PostCard post={post} />
        )}
      </div>
    </AppShell>
  );
}
