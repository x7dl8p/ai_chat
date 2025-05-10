"use client"

import { Search, MessageSquarePlus, User, Moon } from "lucide-react"
import { useTheme } from "next-themes"

const RECENT_CHATS = [
  { id: "chat-1", title: "Project Planning" },
  { id: "chat-2", title: "Code Review" },
  { id: "chat-3", title: "Bug Investigation" },
]

interface SidebarProps {
  onSelectChat: (id: string) => void
  onNewChat: () => void
}

export function Sidebar({ onSelectChat, onNewChat }: SidebarProps) {
  const { setTheme } = useTheme()

  return (
    <div className="w-64 h-full flex flex-col bg-zinc-950 text-white border-r border-zinc-800">
      {/* New Chat Button */}
      <button onClick={onNewChat} className="flex items-center gap-2 m-3 p-2 rounded-md hover:bg-zinc-800">
        <MessageSquarePlus size={18} />
        <span>New Chat</span>
      </button>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            placeholder="Search chats..."
            className="w-full bg-zinc-900 text-sm rounded-md border border-zinc-800 py-2 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>
      </div>

      {/* Recent Chats */}
      <div className="px-3 py-2">
        <h3 className="text-xs text-zinc-500 font-medium mb-2">Recent Chats</h3>
        <ul className="space-y-1">
          {RECENT_CHATS.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => onSelectChat(chat.id)}
                className="w-full text-left p-2 rounded-md hover:bg-zinc-800 text-sm"
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Footer */}
      <div className="p-3 flex justify-between border-t border-zinc-800">
        <button className="p-2 rounded-full hover:bg-zinc-800">
          <User size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-zinc-800" onClick={() => setTheme("light")}>
          <Moon size={18} />
        </button>
      </div>
    </div>
  )
}
