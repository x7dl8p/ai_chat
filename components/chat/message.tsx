"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingDots } from "./loading-dots"

export interface Message {
  id: string
  content: string
  type: "user" | "system"
  completed?: boolean
  thoughtProcess?: string
}

interface MessageProps {
  message: Message
  isStreaming?: boolean
  isWaiting?: boolean
  streamingContent?: string
}

export function Message({ message, isStreaming, isWaiting, streamingContent }: MessageProps) {
  const [showThoughts, setShowThoughts] = useState(false)
  const hasThoughts = message.thoughtProcess && message.thoughtProcess.length > 0

  return (
    <div className={cn("flex flex-col", message.type === "user" ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl",
          message.type === "user"
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-br-none"
            : "bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-bl-none",
        )}
      >
        {message.type === "system" && isWaiting ? (
          <LoadingDots />
        ) : (
          <>
            {message.type === "system" && hasThoughts && (
              <div className="mb-3">
                <button
                  onClick={() => setShowThoughts(!showThoughts)}
                  className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 mb-1 transition-colors"
                >
                  {showThoughts ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Thought Process</span>
                </button>

                {showThoughts && (
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700 whitespace-pre-wrap transition-colors">
                    {message.thoughtProcess}
                  </div>
                )}
              </div>
            )}

            {isStreaming ? streamingContent : message.content}
          </>
        )}
      </div>
    </div>
  )
}
