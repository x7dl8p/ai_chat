"use client"

import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Tab {
  id: string
  title: string
  active: boolean
}

interface TabsProps {
  tabs: Tab[]
  onNewTab: () => void
  onCloseTab: (id: string) => void
  onSelectTab: (id: string) => void
}

export function Tabs({ tabs, onNewTab, onCloseTab, onSelectTab }: TabsProps) {
  return (
    <div className="inline-flex border-b border-zinc-800">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "group flex items-center gap-2 px-4 py-2 border-r border-zinc-800 cursor-pointer",
            tab.active ? "bg-zinc-900" : "bg-zinc-950 hover:bg-zinc-900",
          )}
          onClick={() => onSelectTab(tab.id)}
        >
          <span className="text-sm text-zinc-300">{tab.title}</span>
          {tabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCloseTab(tab.id)
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-zinc-800"
            >
              <X size={14} className="text-zinc-500" />
            </button>
          )}
        </div>
      ))}
      <button onClick={onNewTab} className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900">
        <Plus size={16} />
      </button>
    </div>
  )
}
