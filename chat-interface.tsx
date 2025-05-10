"use client"

import { useState, useRef, useEffect } from "react"
import type { ChatHistory } from "@/types"
import { isSimpleGreeting } from "@/lib/prompts"
import { Sidebar } from "@/components/sidebar/sidebar"
import { Header } from "@/components/header/header"
import { Tabs, type Tab } from "@/components/tabs/tabs"
import { Message, type Message as MessageType } from "@/components/chat/message"
import { ChatInput } from "@/components/chat/chat-input"
import { translateToArabic } from "@/lib/utils"

type ActiveButton = "none" | "file" | "translate" | "think"

// Sample chat history data
const SAMPLE_CHAT_HISTORY: ChatHistory[] = [
  {
    id: "chat-1",
    title: "Project Planning",
    lastMessage: "Let's discuss the timeline for the new feature",
    date: "Today",
  },
  {
    id: "chat-2",
    title: "Code Review",
    lastMessage: "Can you review my React component?",
    date: "Yesterday",
  },
  {
    id: "chat-3",
    title: "Bug Investigation",
    lastMessage: "I'm seeing an error in the console",
    date: "2 days ago",
  },
]

// Faster word delay for smoother streaming
const WORD_DELAY = 40 // ms per word
const CHUNK_SIZE = 2 // Number of words to add at once

export default function ChatInterface() {
  // State for sidebar
  const [sidebarVisible, setSidebarVisible] = useState(true)

  // State for tabs
  const [tabs, setTabs] = useState<Tab[]>([{ id: "tab-1", title: "New Chat", active: true }])

  // State for messages
  const [messages, setMessages] = useState<MessageType[]>([])

  // State for streaming
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, streamingContent])

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  // Handle new tab
  const handleNewTab = () => {
    setTabs(
      tabs
        .map((tab) => ({ ...tab, active: false }))
        .concat({
          id: `tab-${Date.now()}`,
          title: "New Chat",
          active: true,
        }),
    )
    setMessages([])
  }

  // Handle close tab
  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return

    const tabIndex = tabs.findIndex((tab) => tab.id === id)
    const isActive = tabs[tabIndex].active

    const newTabs = tabs.filter((tab) => tab.id !== id)

    if (isActive && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1)
      newTabs[newActiveIndex].active = true
    }

    setTabs(newTabs)

    // If we closed the active tab, reset messages
    if (isActive) {
      setMessages([])
    }
  }

  // Handle select tab
  const handleSelectTab = (id: string) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        active: tab.id === id,
      })),
    )

    // In a real app, you would load the messages for this tab
    // For now, we'll just reset messages
    setMessages([])
  }

  // Handle select chat from sidebar
  const handleSelectChat = (id: string) => {
    handleNewTab()

    // Update the tab title based on the selected chat
    const chatTitle = id === "chat-1" ? "Project Planning" : id === "chat-2" ? "Code Review" : "Bug Investigation"

    setTabs((currentTabs) => {
      const activeTabIndex = currentTabs.findIndex((tab) => tab.active)
      if (activeTabIndex === -1) return currentTabs

      const updatedTabs = [...currentTabs]
      updatedTabs[activeTabIndex] = {
        ...updatedTabs[activeTabIndex],
        title: chatTitle,
      }

      return updatedTabs
    })
  }

  // Simulate text streaming
  const simulateTextStreaming = async (text: string) => {
    setStreamingContent("")
    setIsWaiting(false)
    setIsStreaming(true)

    const words = text.split(" ")

    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      await new Promise((resolve) => setTimeout(resolve, WORD_DELAY))
      const chunk = words.slice(i, i + CHUNK_SIZE).join(" ") + " "
      setStreamingContent((prev) => prev + chunk)
    }

    setIsStreaming(false)
    return text
  }

  // Handle send message
  const handleSendMessage = async (message: string, mode: ActiveButton) => {
    // Add user message
    const userMessageId = `user-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        content: message,
        type: "user",
      },
    ])

    // Create system message placeholder
    const systemMessageId = `system-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: systemMessageId,
        content: "",
        type: "system",
      },
    ])

    // Show loading state
    setIsWaiting(true)

    // Update tab title if this is the first message
    if (messages.length === 0) {
      setTabs((currentTabs) => {
        return currentTabs.map((tab) => {
          if (!tab.active) return tab

          return {
            ...tab,
            title: message.slice(0, 20) + (message.length > 20 ? "..." : ""),
          }
        })
      })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate response based on mode
    let response = ""
    let thoughtProcess = ""

    if (isSimpleGreeting(message)) {
      response = "Greetings, nice to meet you, what can I help you with?"
    } else if (mode === "translate") {
      response = translateToArabic(message)
    } else if (mode === "think") {
      thoughtProcess = `Step 1: Analyzing the query "${message}"\n\nStep 2: Considering different perspectives\n- Perspective A: This could be interpreted as...\n- Perspective B: Alternatively, this might mean...\n\nStep 3: Evaluating the most likely interpretation\nBased on context, perspective A seems more likely because...\n\nStep 4: Formulating a comprehensive response that addresses the core question while providing relevant context.`

      response = "After careful consideration, here's my response to your query."
    } else {
      response = "Here's my response to your question."
    }

    // Stream the response
    await simulateTextStreaming(response)

    // Update the system message with the full response
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === systemMessageId
          ? {
              ...msg,
              content: response,
              completed: true,
              thoughtProcess: mode === "think" ? thoughtProcess : undefined,
            }
          : msg,
      ),
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {sidebarVisible && <Sidebar onSelectChat={handleSelectChat} onNewChat={handleNewTab} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Tabs */}
        <Tabs tabs={tabs} onNewTab={handleNewTab} onCloseTab={handleCloseTab} onSelectTab={handleSelectTab} />

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                isStreaming={isStreaming && index === messages.length - 1}
                isWaiting={isWaiting && index === messages.length - 1}
                streamingContent={streamingContent}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800">
          <ChatInput onSendMessage={handleSendMessage} isStreaming={isStreaming || isWaiting} />
        </div>
      </div>
    </div>
  )
}
