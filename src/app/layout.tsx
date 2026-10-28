import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Órbita — Seu mundo. Suas conexões.",
  description:
    "Uma rede social para aproximar pessoas e ideias. Comunidades vibrantes, depoimentos autênticos e bate-papo em tempo real.",
  keywords: ["órbita", "rede social", "conexões", "comunidades", "depoimentos", "brasil", "amigos"],
  authors: [{ name: "Órbita" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#05070f] text-slate-100 font-sans antialiased min-h-screen">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
