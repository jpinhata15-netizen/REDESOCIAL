import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function PrivacidadePage() {
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
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Conformidade LGPD (Lei nº 13.709/2018)
            </span>
            <h1 className="text-2xl font-black text-white">Política de Privacidade e Proteção de Dados</h1>
            <p className="text-xs text-slate-400 mt-1">Última atualização: 28 de outubro de 2026</p>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed flex flex-col gap-4">
            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">1. Princípio da Coleta Mínima</h2>
              <p>
                A Conecta coleta estritamente os dados necessários para o fornecimento do serviço social: seu nome de
                exibição, nome de usuário, e-mail (usado para identificação e recuperação) e dados que você decida
                inserir voluntariamente em seu perfil (bio, cidade e foto).
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">2. Segurança e Criptografia</h2>
              <p>
                Senhas são criptografadas com o algoritmo <code>bcrypt</code> antes de qualquer armazenamento. Sessões são
                gerenciadas por tokens JWT protegidos em cookies com atributos <code>HttpOnly</code>, <code>SameSite</code> e
                <code>Secure</code> em ambiente de produção, impedindo ataques de roubo de sessão via JavaScript malicioso (XSS).
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">3. Seus Direitos (Art. 18 da LGPD)</h2>
              <p>
                Você possui total titularidade sobre seus dados. A qualquer momento, na página de Configurações, você pode:
              </p>
              <ul className="list-disc pl-5 mt-1.5 space-y-1">
                <li>Exportar todos os seus dados cadastrais em formato legível por máquina (JSON).</li>
                <li>Corrigir informações incompletas ou inexatas.</li>
                <li>Solicitar a exclusão definitiva e revogação de consentimento de sua conta.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-bold text-white mb-1.5">4. Contato do Encarregado de Dados (DPO)</h2>
              <p>
                Para dúvidas, requisições de titulares ou notificações de incidentes, nosso canal oficial de comunicação
                é: <code>privacidade@conecta.social</code>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
