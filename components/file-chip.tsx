"use client"

import { X } from "lucide-react"
import type { SelectedFile } from "@/types"
import { Badge } from "@/components/ui/badge"

export function FileChip({
  file,
  onRemove,
}: {
  file: SelectedFile
  onRemove: (id: string) => void
}) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 py-1 px-2 h-6">
      <span className="text-xs truncate max-w-[100px]">{file.name}</span>
      <button className="ml-1 rounded-full hover:bg-muted/50 p-0.5" onClick={() => onRemove(file.id)}>
        <X className="h-3 w-3" />
        <span className="sr-only">Remove</span>
      </button>
    </Badge>
  )
}
