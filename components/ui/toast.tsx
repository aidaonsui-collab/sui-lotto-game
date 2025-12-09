"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}

export const Toast = ({ title, description, variant = "default", onClose }: ToastProps) => {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex w-96 items-center rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/10",
      variant === "destructive" && "bg-red-50 ring-red-200"
    )}>
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
