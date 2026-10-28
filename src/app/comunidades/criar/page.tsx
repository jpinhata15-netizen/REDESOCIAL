"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users2, ArrowLeft, Globe, Lock, Loader2, Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function CreateCommunityPage() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tecnologia");
  const [rules, setRules] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Tecnologia",
    "Artes & Fotografia",
    "Cultura & Literatura",
    "Gastronomia",
    "Esportes",
    "Música",
    "Cidades",
    "Geral",
  ];

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Faça login para criar uma comunidade.");
      return;
    }

    if (!name || !slug || !description) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comunidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          category,
          rules,
          isPrivate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Comunidade criada com sucesso!");
        router.push(`/comunidades/${data.community.slug}`);
      } else {
        toast.error(data.error || "Erro ao criar comunidade.");
      }
    } catch {
      toast.error("Erro de conexão ao criar comunidade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <Link
          href="/comunidades"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Explorar Comunidades</span>
        </Link>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/90 flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Users2 className="w-6 h-6 text-emerald-400" />
              <span>Criar Nova Comunidade</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Crie um espaço dedicado a um tema, causa, cidade ou hobby.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome da Comunidade *
              </label>
              <input
                type="text"
                placeholder="Ex: Desenvolvedores de Software do Brasil"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Identificador Único (slug de URL) *
              </label>
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 text-xs text-slate-400">
                <span>conecta.social/comunidades/</span>
                <input
                  type="text"
                  placeholder="devs-brasil"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="bg-transparent py-2.5 px-1 text-white focus:outline-none flex-1 font-semibold text-emerald-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoria Principal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descrição da Comunidade *
              </label>
              <textarea
                placeholder="Explique sobre o que é esta comunidade e quem deve participar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Regras de Convivência (Opcional)
              </label>
              <textarea
                placeholder="1. Respeite todos os membros.&#10;2. Sem ofensas ou spam."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Seletor de Tipo de Comunidade (Pública vs Privada) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => setIsPrivate(false)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  !isPrivate
                    ? "bg-emerald-950/30 border-emerald-500 text-emerald-200 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Comunidade Pública</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Qualquer pessoa pode encontrar na busca, ler os posts e participar livremente.
                </p>
              </div>

              <div
                onClick={() => setIsPrivate(true)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isPrivate
                    ? "bg-amber-950/30 border-amber-500 text-amber-200 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Comunidade Privada</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Discussões restritas a membros aprovados. Novos membros devem solicitar entrada.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <Link
                href="/comunidades"
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl gradient-brand text-slate-950 font-bold text-xs shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Criar Comunidade</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
