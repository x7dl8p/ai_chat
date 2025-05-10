"use client"
import { Plus, X } from "lucide-react"
import type { ChatTab } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ChatTabs({
  tabs,
  onNewTab,
  onCloseTab,
  onSelectTab,
}: {
  tabs: ChatTab[]
  onNewTab: () => void
  onCloseTab: (id: string) => void
  onSelectTab: (id: string) => void
}) {
  return (
    <div className="flex items-center border-b overflow-x-auto scrollbar-hide">
      <div className="flex-1 flex items-center">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border-r cursor-pointer group",
              tab.active ? "bg-background" : "bg-muted/30 hover:bg-muted/50",
            )}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="text-sm truncate max-w-[120px]">{tab.title || "New Chat"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onCloseTab(tab.id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={onNewTab}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
