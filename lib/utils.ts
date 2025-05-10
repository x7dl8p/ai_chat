import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if a message is a simple greeting
export function isSimpleGreeting(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim()
  return (
    ["hi", "hello", "hey", "greetings"].includes(normalizedMessage) ||
    ["hi!", "hello!", "hey!", "greetings!"].includes(normalizedMessage)
  )
}

// Translate text to Arabic (simplified mock)
export function translateToArabic(text: string): string {
  // This is a mock implementation
  // In a real app, you would use a translation API
  return `الترجمة العربية: ${text}`
}
