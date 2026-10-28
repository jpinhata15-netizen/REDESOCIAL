"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Camera, MapPin, Heart, ArrowRight, Check } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableInterests = [
    "Tecnologia & Inovação",
    "Música Popular Brasileira",
    "Fotografia",
    "Cinema & Audiovisual",
    "Literatura & Poesia",
    "Gastronomia Brasileira",
    "Esportes & Futebol",
    "Viagens pelo Brasil",
    "Sustentabilidade",
    "Artes Visuais",
    "Games & Cultura Pop",
    "Filosofia & Política",
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = async () => {
    if (!user) {
      router.push("/");
      return;
    }

    setLoading(true);
    try {
      await fetch(`/api/usuarios/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio.trim(),
          location: location.trim(),
          interests: selectedInterests.join(", "),
        }),
      });

      await refreshUser();
      toast.success("Perfil configurado! Seja bem-vindo(a) ao Conecta.");
      router.push("/");
    } catch {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        <div className="mb-6">
          <Logo size="lg" />
        </div>

        <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/95 backdrop-blur-2xl">
          {/* Indicador de Passos */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full gradient-brand text-slate-950 font-bold text-xs flex items-center justify-center">
                {step}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {step === 1 ? "Apresentação" : "Interesses"}
              </span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Pular etapa
            </button>
          </div>

          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">Conte um pouco sobre você</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pessoas com perfil preenchido recebem mais depoimentos e conexões.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 my-2">
                <img
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "user"}`}
                  alt={user?.name || "Avatar"}
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                />
                <span className="text-xs text-emerald-400">@{user?.username}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sua Biografia / Apresentação
                </label>
                <textarea
                  placeholder="Ex: Designer apaixonado por praia, café e livros. Morando em Salvador..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade / Região</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Ex: Rio de Janeiro, RJ"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-3 w-full py-3 rounded-xl gradient-brand text-slate-950 font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Avançar para Interesses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">Escolha seus Interesses</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Selecione assuntos para descobrirmos comunidades e pessoas compatíveis.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                          : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="truncate">{interest}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl gradient-brand text-slate-950 font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Concluir e Explorar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
