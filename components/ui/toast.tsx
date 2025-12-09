"use client"

import * as React from "react"
import { X } from "lucide-react"

export function Toast({ title, description, onClose }: { title?: string; description?: string; onClose?: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-gray-900 px-6 py-4 text-white shadow-xl">
      {title && <h4 className="font-bold">{title}</h4>}
      {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      {onClose && (
        <button onClick={onClose} className="absolute right-3 top-3">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
