"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowUp, Languages, Lightbulb, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

import { ActiveButton } from "../../types";

interface ChatInputProps {
  onSendMessage: (message: string, mode: ActiveButton) => void
  isStreaming: boolean
}

export function ChatInput({ onSendMessage, isStreaming }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [activeButton, setActiveButton] = useState<ActiveButton>("none")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim(), activeButton)
      setInputValue("")
      setActiveButton("none")

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isStreaming) {
      setInputValue(e.target.value)

      // Auto-resize textarea
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
      }
    }
  }

  const toggleButton = (button: ActiveButton) => {
    if (!isStreaming) {
      setActiveButton((prev) => (prev === button ? "none" : button))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full">
      <div className="relative w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3">
        <textarea
          ref={textareaRef}
          placeholder={isStreaming ? "Waiting for response..." : "Ask Anything"}
          className="min-h-[24px] max-h-[160px] w-full rounded-xl border-0 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-base resize-none pb-10"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isStreaming}
          rows={1}
        />

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cn("p-2 rounded-full", activeButton === "file" ? "bg-zinc-700" : "hover:bg-zinc-800")}
                onClick={() => toggleButton("file")}
                disabled={isStreaming}
              >
                <Paperclip size={18} className="text-zinc-400" />
              </button>

              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  activeButton === "translate" ? "bg-zinc-700" : "hover:bg-zinc-800",
                )}
                onClick={() => toggleButton("translate")}
                disabled={isStreaming}
              >
                <Languages size={18} className="text-zinc-400" />
                <span className="text-sm text-zinc-300">Translate</span>
              </button>

              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  activeButton === "think" ? "bg-zinc-700" : "hover:bg-zinc-800",
                )}
                onClick={() => toggleButton("think")}
                disabled={isStreaming}
              >
                <Lightbulb size={18} className="text-zinc-400" />
                <span className="text-sm text-zinc-300">Think</span>
              </button>
            </div>

            <button
              type="submit"
              className={cn(
                "p-2 rounded-full",
                inputValue.trim() ? "bg-zinc-100" : "bg-zinc-800",
                isStreaming && "opacity-50 cursor-not-allowed",
              )}
              disabled={!inputValue.trim() || isStreaming}
            >
              <ArrowUp size={18} className={inputValue.trim() ? "text-zinc-900" : "text-zinc-500"} />
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
