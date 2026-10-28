"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Shield,
  Users,
  Layers,
  Users2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  FileText,
  Clock,
  RefreshCw,
  Lock,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reports" | "users" | "audit">("reports");

  const loadAdminData = useCallback(async () => {
    if (!user || user.role !== "ADMIN") return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        toast.error(json.error || "Acesso negado.");
      }
    } catch (err) {
      console.error("Erro ao carregar dados administrativos:", err);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleResolveReport = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESOLVE_REPORT",
          reportId,
          status,
        }),
      });
      if (res.ok) {
        toast.success(status === "RESOLVED" ? "Denúncia resolvida!" : "Denúncia dispensada.");
        loadAdminData();
      }
    } catch {
      toast.error("Erro ao moderar denúncia.");
    }
  };

  const handleDeletePostAdmin = async (postId: string) => {
    if (!confirm("Confirmar exclusão administrativa desta publicação?")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE_POST_ADMIN",
          postId,
        }),
      });
      if (res.ok) {
        toast.success("Publicação removida administrativamente.");
        loadAdminData();
      }
    } catch {
      toast.error("Erro ao excluir publicação.");
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <AppShell>
        <div className="glass-panel rounded-3xl p-12 border border-rose-500/20 text-center flex flex-col items-center gap-3 bg-gradient-to-b from-rose-950/20 to-slate-900">
          <Lock className="w-12 h-12 text-rose-400" />
          <h1 className="text-xl font-bold text-white">Acesso Restrito ao Painel Administrativo</h1>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Esta área é exclusiva para moderadores e administradores da rede Conecta. Seu usuário não possui privilégios
            suficientes.
          </p>
          <Link href="/" className="mt-2 px-5 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs">
            Voltar para a Página Inicial
          </Link>
        </div>
      </AppShell>
    );
  }

  const { metrics, reports, users: userList, auditLogs } = data || {};

  return (
    <AppShell hideRightSidebar>
      <div className="flex flex-col gap-6">
        {/* Cabeçalho do Painel */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Painel Administrativo & Moderação</h1>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Gestão de segurança, denúncias, usuários e registros de auditoria da Conecta.
              </p>
            </div>
          </div>

          <button
            onClick={loadAdminData}
            className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-800 border border-slate-700 transition-colors"
            title="Atualizar painel"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Métricas Reais do Banco de Dados */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Usuários
              </span>
              <span className="text-2xl font-black text-white mt-1">{metrics.totalUsers}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Publicações
              </span>
              <span className="text-2xl font-black text-white mt-1">{metrics.totalPosts}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-indigo-400" />
                Comunidades
              </span>
              <span className="text-2xl font-black text-white mt-1">{metrics.totalCommunities}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Depoimentos
              </span>
              <span className="text-2xl font-black text-amber-400 mt-1">{metrics.totalTestimonials}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-rose-500/20 bg-rose-950/15 flex flex-col col-span-2 sm:col-span-1">
              <span className="text-xs text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Denúncias Pendentes
              </span>
              <span className="text-2xl font-black text-rose-400 mt-1">{metrics.pendingReportsCount}</span>
            </div>
          </div>
        )}

        {/* Abas */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-1">
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "reports"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Fila de Denúncias ({reports?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "users"
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Diretório de Usuários ({userList?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "audit"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Registro de Auditoria ({auditLogs?.length || 0})</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === "reports" && (
          <div className="flex flex-col gap-3">
            {!reports || reports.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center text-xs text-slate-400">
                Nenhuma denúncia pendente de moderação no momento.
              </div>
            ) : (
              reports.map((rep: any) => (
                <div
                  key={rep.id}
                  className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {rep.targetType}
                      </span>
                      <span className="text-xs text-slate-400">
                        Denunciado por <strong>@{rep.reporter.username}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      <strong>Motivo:</strong> &ldquo;{rep.reason}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-500">ID do Alvo: {rep.targetId}</span>
                  </div>

                  {rep.status === "PENDING" && (
                    <div className="flex items-center gap-2 shrink-0">
                      {rep.targetType === "POST" && (
                        <button
                          onClick={() => handleDeletePostAdmin(rep.targetId)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover Post</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleResolveReport(rep.id, "RESOLVED")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluir</span>
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, "DISMISSED")}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Dispensar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-white/5">
                  <tr>
                    <th className="p-3.5">Nome / Usuário</th>
                    <th className="p-3.5">E-mail</th>
                    <th className="p-3.5">Papel</th>
                    <th className="p-3.5">Publicações</th>
                    <th className="p-3.5">Cadastro</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {userList?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-semibold text-white">
                        <Link href={`/perfil/${u.username}`} className="hover:text-emerald-400">
                          {u.name} <span className="text-slate-400 font-normal">(@{u.username})</span>
                        </Link>
                      </td>
                      <td className="p-3.5 text-slate-400">{u.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            u.role === "ADMIN"
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-white">{u._count?.posts || 0}</td>
                      <td className="p-3.5 text-slate-400">
                        {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/perfil/${u.username}`}
                          className="text-emerald-400 font-semibold hover:underline"
                        >
                          Ver perfil
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="flex flex-col gap-2">
            {!auditLogs || auditLogs.length === 0 ? (
              <div className="glass-panel rounded-2xl p-10 border border-white/5 text-center text-xs text-slate-400">
                Nenhuma ação administrativa registrada até o momento.
              </div>
            ) : (
              auditLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="glass-panel rounded-2xl p-3.5 border border-white/5 flex items-center justify-between text-xs text-slate-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {log.action}
                    </span>
                    <span>{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
