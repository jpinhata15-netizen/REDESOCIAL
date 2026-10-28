import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withTagline?: boolean;
  showIconOnly?: boolean;
  useImage?: boolean;
}

// Ícone vetorial estilizado do Planeta com Anéis da Órbita
export function OrbitPlanetIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
      >
        <defs>
          {/* Gradiente da Esfera Planetária */}
          <linearGradient id="planetBodyGrad" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="30%" stopColor="#2563eb" />
            <stop offset="65%" stopColor="#8b5cf6" />
            <stop offset="90%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Gradiente do Anel Superior/Frontal */}
          <linearGradient id="ringGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="65%" stopColor="#a855f7" />
            <stop offset="85%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Gradiente da pequena lua em órbita */}
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* Sombra interna do planeta */}
          <radialGradient id="planetShine" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.65" />
          </radialGradient>
        </defs>

        {/* Parte Traseira do Anel */}
        <ellipse
          cx="50"
          cy="48"
          rx="42"
          ry="15"
          transform="rotate(-22 50 48)"
          stroke="url(#ringGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="140"
          strokeDashoffset="110"
          className="opacity-70"
        />

        {/* Corpo do Planeta */}
        <circle cx="50" cy="48" r="28" fill="url(#planetBodyGrad)" />
        <circle cx="50" cy="48" r="28" fill="url(#planetShine)" />

        {/* Camadas de relevo do planeta */}
        <path
          d="M 28 40 Q 50 56 72 40"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeOpacity="0.25"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 25 50 Q 50 68 75 52"
          stroke="#ffffff"
          strokeWidth="2"
          strokeOpacity="0.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Parte Frontal do Anel (em frente ao planeta) */}
        <ellipse
          cx="50"
          cy="48"
          rx="42"
          ry="15"
          transform="rotate(-22 50 48)"
          stroke="url(#ringGrad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeDasharray="130"
          strokeDashoffset="0"
          className="drop-shadow-[0_2px_8px_rgba(236,72,153,0.5)]"
        />

        {/* Pequena lua / satélite em órbita */}
        <circle cx="75" cy="22" r="5" fill="url(#moonGrad)" className="animate-pulse" />
      </svg>
    </div>
  );
}

export default function Logo({
  size = "md",
  withTagline = false,
  showIconOnly = false,
  useImage = false,
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-4xl md:text-5xl",
  };

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 group transition-transform active:scale-95 select-none"
    >
      {/* Símbolo do Planeta */}
      {useImage ? (
        <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
          <img
            src="/brand/orbita-logo.png"
            alt="Órbita"
            className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(168,85,247,0.5)]"
          />
        </div>
      ) : (
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <OrbitPlanetIcon className={iconSizes[size]} />
        </div>
      )}

      {/* Tipografia */}
      {!showIconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span
              className={`font-black tracking-tight ${sizeClasses[size]} text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-purple-200 group-hover:to-pink-200 transition-all`}
            >
              órbita
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500 inline-block ml-0.5 shadow-md shadow-pink-500/50 animate-pulse"></span>
          </div>

          {withTagline && (
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider">
              Seu mundo. Suas conexões.
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
