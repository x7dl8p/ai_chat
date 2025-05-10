export interface ChatMessage {
  id: string
  content: string
  type: "user" | "system"
  completed?: boolean
  newSection?: boolean
}

export interface ChatTab {
  id: string
  title: string
  messages: ChatMessage[]
  active: boolean
}

export interface ChatHistory {
  id: string
  title: string
  lastMessage: string
  date: string
}

export interface SelectedFile {
  id: string
  name: string
  type: string
}
