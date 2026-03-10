"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Range({ className, ...props }: Props) {
  return (
    <input
      type="range"
      className={cn("w-full accent-zinc-100", className)}
      {...props}
    />
  );
}
