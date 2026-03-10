"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-zinc-100 text-zinc-950 hover:bg-white",
    ghost: "bg-zinc-900/60 text-zinc-100 hover:bg-zinc-900 border border-zinc-800",
    danger: "bg-red-500 text-white hover:bg-red-400",
  }[variant];

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  }[size];

  return <button className={cn(base, variants, sizes, className)} {...props} />;
}
