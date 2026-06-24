"use client"

import { useEffect } from "react"
import { useStore } from "@/store/useStore"

export function KeyboardShortcuts() {
  const { toggleSearch } = useStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K — Open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggleSearch()
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleSearch])

  return null
}
