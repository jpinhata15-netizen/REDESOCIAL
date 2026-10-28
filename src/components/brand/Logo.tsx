import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}

export default function Logo({ size = "md", withTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl md:text-4xl",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group transition-transform active:scale-95">
      <div
        className={`${iconSizes[size]} rounded-xl gradient-brand flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 transform group-hover:rotate-6`}
      >
        <span className="text-white text-base font-extrabold tracking-tighter">C✦</span>
      </div>
      <div className="flex flex-col">
        <span className={`font-black tracking-tight ${sizeClasses[size]} text-white flex items-center gap-1`}>
          Conecta
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
        </span>
        {withTagline && (
          <span className="text-[11px] font-medium text-emerald-400/90 tracking-wide uppercase">
            A Rede Social do Brasil
          </span>
        )}
      </div>
    </Link>
  );
}
