"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show theme toggle after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center justify-between h-12 px-4 border-b dark:border-zinc-800 border-zinc-200">
      <div className="flex items-center gap-2">
        <button onClick={toggleSidebar} className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <PanelLeft size={16} className="text-zinc-600 dark:text-zinc-400" />
        </button>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Ai Chat</span>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        {!mounted ? (
          <div className="w-4 h-4" /> // Placeholder same size as icons
        ) : theme === "dark" ? (
          <Sun size={16} className="text-zinc-600 dark:text-zinc-400" />
        ) : (
          <Moon size={16} className="text-zinc-600 dark:text-zinc-400" />
        )}
      </button>
    </div>
  )
}
