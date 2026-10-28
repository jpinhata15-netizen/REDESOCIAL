import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function TermosPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Feed</span>
        </Link>

        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl bg-slate-900/90 flex flex-col gap-6">
          <div className="border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Documento Oficial
            </span>
            <h1 className="text-2xl font-black text-white">Termos e Condições de Uso</h1>
            <p className="text-xs text-slate-400 mt-1">Última atualização: 28 de outubro de 2026</p>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-4">
            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">1. Apresentação e Missão</h2>
              <p>
                Bem-vindo(a) à <strong>Conecta</strong>. Somos uma plataforma social desenvolvida no Brasil com o objetivo
                de aproximar pessoas, celebrar a diversidade cultural e proporcionar um ambiente seguro para o
                compartilhamento de ideias, depoimentos e experiências autênticas.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">2. Diretrizes de Convivência</h2>
              <p>
                Ao criar sua conta, você se compromete a tratar todos os membros com respeito mútuo e civilidade. É
                estritamente proibida a publicação de discursos de ódio, discriminação de qualquer natureza, assédio,
                conteúdos ilícitos ou desinformação deliberada.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">3. Sistema de Depoimentos e Consentimento</h2>
              <p>
                A Conecta adota o princípio do <em>consentimento prévio</em>: qualquer depoimento redigido para outro
                usuário permanecerá com status pendente até que o destinatário o aprove formalmente. O destinatário
                mantém total autonomia para aceitar, recusar ou excluir depoimentos a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">4. Moderação e Denúncias</h2>
              <p>
                A equipe de moderação do Conecta reserva-se o direito de remover publicações ou suspender contas que
                infrinjam estes termos, mediante registro transparente de auditoria e respeito ao devido processo.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
