import Link from "next/link";
import { Compass, Home } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl bg-slate-900/90 max-w-md flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>
        <h1 className="text-3xl font-black text-white">404</h1>
        <h2 className="text-base font-bold text-slate-200">Página não encontrada</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Parece que o caminho que você tentou acessar não existe ou foi movido para outro lugar.
        </p>

        <Link
          href="/"
          className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-full gradient-brand text-slate-950 font-bold text-xs shadow-lg shadow-emerald-900/30 hover:opacity-95 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Voltar para a Página Inicial</span>
        </Link>
      </div>
    </div>
  );
}
