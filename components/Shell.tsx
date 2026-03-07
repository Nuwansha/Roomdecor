"use client";

import { ReactNode, useEffect, useState } from "react";
import { isAuthed } from "@/lib/storage";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export function Shell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!authed) {
    return <LoginScreen onDone={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen">
      <AppHeader onSignOut={() => setAuthed(false)} />
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-4">
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <Sidebar />
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-soft overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
