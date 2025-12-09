"use client"

import * Simple toast without Radix dependency
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex max-w-md items-center rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5",
      variant === "destructive" && "bg-red-50"
    )}>
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
