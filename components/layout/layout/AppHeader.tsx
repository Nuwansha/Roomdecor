"use client";

import { Button } from "@/components/ui/Button";
import { LogOut, Sparkles } from "lucide-react";
import { setAuthed } from "@/lib/storage";

export function AppHeader({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-zinc-100 text-zinc-950 grid place-items-center">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="font-semibold leading-tight">Room Designer Prototype</div>
            <div className="text-xs text-zinc-400">2D layout → 3D preview (Next.js + Three.js)</div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setAuthed(false);
            onSignOut();
          }}
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
