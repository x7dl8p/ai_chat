"use client"

import { useState } from "react"
import { MessageSquarePlus, Search, Settings, User } from "lucide-react"
import type { ChatHistory } from "@/types"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function ChatSidebar({
  chatHistory,
  onSelectChat,
  onNewChat,
}: {
  chatHistory: ChatHistory[]
  onSelectChat: (id: string) => void
  onNewChat: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = chatHistory.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onNewChat} className="flex items-center gap-2 w-full">
              <MessageSquarePlus className="h-4 w-4" />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SidebarInput
            placeholder="Search chats..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton onClick={() => onSelectChat(chat.id)} className="flex flex-col items-start">
                      <span className="font-medium">{chat.title}</span>
                      <span className="text-xs text-muted-foreground truncate w-full">{chat.lastMessage}</span>
                      <span className="text-xs text-muted-foreground mt-1">{chat.date}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  {searchQuery ? "No chats found" : "No recent chats"}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
