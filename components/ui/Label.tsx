"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-xs text-zinc-400", className)} {...props} />;
}
