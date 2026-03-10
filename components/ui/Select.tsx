"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: Props) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl bg-zinc-900/60 border border-zinc-800 px-3 text-sm outline-none focus:border-zinc-600",
        className
      )}
      {...props}
    />
  );
}
