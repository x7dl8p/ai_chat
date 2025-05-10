"use client"

import { useState, useRef, useEffect } from "react"
import type { ChatHistory, ChatMessage, ChatTab } from "@/types"
import { isSimpleGreeting } from "@/lib/prompts"
import { Sidebar } from "@/components/sidebar/sidebar"
import { Header } from "@/components/header/header"
import { Tabs } from "@/components/tabs/tabs"
import { Message } from "@/components/chat/message"
import { ChatInput } from "@/components/chat/chat-input"
import { translateToArabic } from "@/lib/utils"
import { generateGeminiResponse } from "@/lib/gemini"

// Available modes for chat interaction
import { ActiveButton } from "./types";

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

  // State for tabs - using ChatTab type with messages array
  const [tabs, setTabs] = useState<ChatTab[]>([{ 
    id: "tab-1", 
    title: "New Chat", 
    active: true,
    messages: [] 
  }])

  // State for streaming
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get current active tab and its messages
  const activeTabIndex = tabs.findIndex(tab => tab.active)
  const activeTab = activeTabIndex >= 0 ? tabs[activeTabIndex] : tabs[0]
  const activeMessages = activeTab?.messages || []

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages, streamingContent])

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
          messages: []
        }),
    )
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
  }

  // Handle select tab - no need to reset messages since they're stored per tab
  const handleSelectTab = (id: string) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        active: tab.id === id,
      })),
    )
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

  // Handle send message - now adding messages to the appropriate tab
  const handleSendMessage = async (message: string, mode: ActiveButton) => {
    if (activeTabIndex < 0) return

    // Create user message
    const userMessageId = `user-${Date.now()}`
    const userMessage: ChatMessage = {
      id: userMessageId,
      content: message,
      type: "user",
    }

    // Create system message placeholder
    const systemMessageId = `system-${Date.now()}`
    const systemMessage: ChatMessage = {
      id: systemMessageId,
      content: "",
      type: "system",
    }

    // Add both messages to the current active tab
    setTabs(currentTabs => {
      const newTabs = [...currentTabs]
      newTabs[activeTabIndex] = {
        ...newTabs[activeTabIndex],
        messages: [...newTabs[activeTabIndex].messages, userMessage, systemMessage]
      }
      return newTabs
    })

    // Show loading state
    setIsWaiting(true)

    // Update tab title if this is the first message
    if (activeMessages.length === 0) {
      setTabs((currentTabs) => {
        const newTabs = [...currentTabs]
        newTabs[activeTabIndex] = {
          ...newTabs[activeTabIndex],
          title: message.slice(0, 20) + (message.length > 20 ? "..." : ""),
        }
        return newTabs
      })
    }

    // Generate response based on mode
    let response = "";
    let thoughtProcess = "";

    try {
      if (isSimpleGreeting(message)) {
        response = "Greetings, nice to meet you, what can I help you with?";
      } else if (mode === "translate") {
        // Here we could enhance this to use Gemini's translation capabilities
        // For now we'll keep the existing translation function
        response = translateToArabic(message);
      } else if (mode === "think") {
        // For the "thinking" mode, we'll use Gemini but ask it to think step by step
        const thinkingPrompt = `Think through this step by step and provide a detailed analysis: ${message}`;
        thoughtProcess = await generateGeminiResponse({
          model: "gemini-1.5-pro",
          prompt: thinkingPrompt,
          thinking: true
        });
        
        // Then get a more concise answer
        response = await generateGeminiResponse({
          model: "gemini-1.5-pro",
          prompt: `Provide a concise answer to: ${message}`,
        });
      } else {
        // Normal mode - just get a direct response from Gemini
        response = await generateGeminiResponse({
          model: "gemini-1.5-flash", 
          prompt: message
        });
      }
    } catch (error) {
      console.error("Error generating response:", error);
      response = "Sorry, I encountered an error while generating a response. Please try again later.";
    }

    // Stream the response
    await simulateTextStreaming(response);

    // Update the system message with the full response
    setTabs(currentTabs => {
      const newTabs = [...currentTabs]
      newTabs[activeTabIndex] = {
        ...newTabs[activeTabIndex],
        messages: newTabs[activeTabIndex].messages.map(msg =>
          msg.id === systemMessageId
            ? {
                ...msg,
                content: response,
                completed: true,
                thoughtProcess: mode === "think" ? thoughtProcess : undefined,
              }
            : msg
        )
      }
      return newTabs
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950 transition-colors">
      {/* Sidebar */}
      {sidebarVisible && <Sidebar onSelectChat={handleSelectChat} onNewChat={handleNewTab} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Tabs */}
        <Tabs tabs={tabs} onNewTab={handleNewTab} onCloseTab={handleCloseTab} onSelectTab={handleSelectTab} />

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 scrollbar-hide bg-white dark:bg-zinc-950">
          <div className="max-w-3xl mx-auto space-y-4">
            {activeMessages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                isStreaming={isStreaming && index === activeMessages.length - 1}
                isWaiting={isWaiting && index === activeMessages.length - 1}
                streamingContent={streamingContent}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
          <ChatInput onSendMessage={handleSendMessage} isStreaming={isStreaming || isWaiting} />
        </div>
      </div>
    </div>
  )
}
