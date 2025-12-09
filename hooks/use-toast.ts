"use client"

import * as React from "react"

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

const toast = ({ title, description }: { title?: string; description?: string }) => {
  console.log("Toast:", title, description)
}

export function useToast() {
  return {
    toast,
    dismiss: (id: string) => {},
    toasts: [] as ToasterToast[],
  }
}
