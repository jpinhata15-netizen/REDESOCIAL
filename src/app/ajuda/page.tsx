import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Sparkles, Shield, Users2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function AjudaPage() {
  const faqs = [
    {
      question: "Como funciona a aprovação de depoimentos?",
      answer:
        "Quando alguém envia um depoimento para você, ele vai diretamente para a sua aba privada de Depoimentos com o status 'Pendente'. Somente após você clicar em 'Aprovar', o depoimento se tornará visível publicamente no seu perfil.",
    },
    {
      question: "Qual a diferença entre Comunidades Públicas e Privadas?",
      answer:
        "Comunidades públicas permitem que qualquer pessoa visualize os conteúdos e participe imediatamente. Comunidades privadas protegem o conteúdo interno apenas para membros aprovados, exigindo que interessados enviem uma solicitação de entrada aos administradores.",
    },
    {
      question: "Como proteger a privacidade das minhas publicações?",
      answer:
        "No compositor de publicações, você pode selecionar a visibilidade: 'Público' (visível para qualquer pessoa), 'Seguidores' (apenas pessoas que você aprovou/seguem) ou 'Privado' (visível apenas para você).",
    },
    {
      question: "Como denunciar um conteúdo ou perfil impróprio?",
      answer:
        "Em qualquer publicação ou depoimento, clique no menu de opções (três pontos) e selecione 'Denunciar conteúdo'. Nossa equipe de moderação receberá o alerta imediatamente no painel administrativo.",
    },
  ];

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
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
              <span>Central de Ajuda Conecta</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Dúvidas frequentes sobre como aproveitar ao máximo a sua rede.</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                <h3 className="font-bold text-sm text-white mb-1.5">{faq.question}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
