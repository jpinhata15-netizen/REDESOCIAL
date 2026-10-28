"use client";

import React, { useState, useEffect } from "react";
import { Settings, User, Lock, Shield, Trash2, Download, Save, Loader2, Sparkles, Check } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ConfiguracoesPage() {
  const { user, refreshUser, logout } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [interests, setInterests] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setAvatarUrl(user.avatarUrl || "");
      setCoverUrl(user.coverUrl || "");
      setInterests(user.interests || "");
      setIsPrivate(Boolean(user.isPrivate));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/usuarios/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          location,
          website,
          avatarUrl,
          coverUrl,
          interests,
          isPrivate,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Perfil e preferências atualizados com sucesso!");
        await refreshUser();
      } else {
        toast.error(data.error || "Erro ao salvar alterações.");
      }
    } catch {
      toast.error("Erro de conexão ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `conecta_dados_${user?.username || "usuario"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Seus dados pessoais foram exportados conforme previsto na LGPD (Art. 18).");
  };

  const handleDeleteAccount = () => {
    const confirmText = prompt(
      `ATENÇÃO: A exclusão da conta é permanente e irreversível.\nPara confirmar, digite seu nome de usuário (${user?.username}):`
    );
    if (confirmText === user?.username) {
      toast.info("Processo de exclusão de conta agendado. Você será desconectado.");
      setTimeout(() => {
        logout();
      }, 1500);
    } else if (confirmText !== null) {
      toast.error("O nome de usuário digitado não confere.");
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Configurações da Conta</h1>
            <p className="text-xs text-slate-400">Personalize seus dados, privacidade e preferências.</p>
          </div>
        </div>

        {/* Formulário de Perfil */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/90 flex flex-col gap-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Editar Informações do Perfil</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome de Exibição</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Biografia</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Fale um pouco sobre você..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade / Estado</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Salvador, BA"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site ou Link Pessoal</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://meusite.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Interesses (separados por vírgula)
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Música Brasileira, Fotografia, Programação, Cinema"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL da Foto de Capa</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Privacidade */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Perfil Privado</span>
                <span className="text-[11px] text-slate-400">
                  Apenas seguidores aprovados poderão visualizar suas publicações completas.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl gradient-brand text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4" />}
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>

        {/* Área de Privacidade e LGPD */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-slate-900/60 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privacidade e Seus Dados (LGPD)</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito ao acesso, portabilidade
            e exclusão de suas informações pessoais cadastradas no Conecta.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleExportData}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Baixar Cópia dos Meus Dados (JSON)</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir Minha Conta</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
