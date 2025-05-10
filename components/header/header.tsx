"use client"

import { Moon, Sun, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between h-12 px-4 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <button onClick={toggleSidebar} className="p-1.5 rounded-full hover:bg-zinc-800">
          <PanelLeft size={16} className="text-zinc-400" />
        </button>
        <span className="text-sm font-medium">Ai Chat</span>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-1.5 rounded-full hover:bg-zinc-800"
      >
        {theme === "dark" ? <Sun size={16} className="text-zinc-400" /> : <Moon size={16} className="text-zinc-600" />}
      </button>
    </div>
  )
}
