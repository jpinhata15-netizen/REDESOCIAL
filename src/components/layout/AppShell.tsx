"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import MobileNav from "./MobileNav";
import PostComposerModal from "../feed/PostComposerModal";

interface AppShellProps {
  children: React.ReactNode;
  hideRightSidebar?: boolean;
}

export default function AppShell({ children, hideRightSidebar = false }: AppShellProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar onOpenComposer={() => setIsComposerOpen(true)} />

      {/* Main 3-Column Container */}
      <div className="flex-1 w-full px-2 sm:px-4 py-4 md:py-6">
        <div
          className={`grid grid-cols-1 md:grid-cols-[240px_1fr] ${
            hideRightSidebar
              ? "lg:grid-cols-[260px_1fr]"
              : "lg:grid-cols-[250px_1fr_300px] xl:grid-cols-[270px_1fr_320px] 2xl:grid-cols-[290px_1fr_360px]"
          } gap-4 items-start w-full max-w-screen-2xl mx-auto`}
        >
          {/* Left Column: Navigation & Profile */}
          <SidebarLeft onOpenComposer={() => setIsComposerOpen(true)} />

          {/* Center Column: Main Content (Feed, Profile, Community, etc.) */}
          <main className="w-full min-w-0 pb-20 md:pb-10">
            {children}
          </main>

          {/* Right Column: Suggestions, Trends & Footer */}
          {!hideRightSidebar && <SidebarRight />}
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <MobileNav onOpenComposer={() => setIsComposerOpen(true)} />

      {/* Master Post Composer Modal */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={() => {
          // Disparar evento para componentes ouvintes atualizarem se necessário
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("conecta:post-created"));
          }
        }}
      />
    </div>
  );
}
