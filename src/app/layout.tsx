import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "Conecta — A Rede Social Brasileira",
  description:
    "A rede social feita para conexões autênticas, comunidades vibrantes, depoimentos e troca de experiências pelo Brasil.",
  keywords: ["rede social", "brasil", "conecta", "comunidades", "depoimentos", "amigos"],
  authors: [{ name: "Conecta Brasil" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 font-sans antialiased min-h-screen">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
