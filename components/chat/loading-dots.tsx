"use client"

import { cn } from "@/lib/utils"

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1.5 items-center", className)}>
      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: "300ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" style={{ animationDelay: "600ms" }}></div>
    </div>
  )
}
