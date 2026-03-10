"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { setAuthed } from "@/lib/storage";

export function LoginScreen({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState("designer");
  const [password, setPassword] = useState("1234");

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-gradient-to-b from-zinc-900/40 to-zinc-950">
          <div className="text-lg font-semibold">Room Designer</div>
          <div className="text-sm text-zinc-400">Prototype login (dummy)</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              // dummy auth: allow anything non-empty
              if (username.trim().length === 0 || password.trim().length === 0) return;
              setAuthed(true);
              onDone();
            }}
          >
            Sign in
          </Button>

          <div className="text-xs text-zinc-500">
            Tip: this is frontend-only. Auth is stored in <span className="text-zinc-300">localStorage</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
