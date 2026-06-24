"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, Keyboard } from "lucide-react"

const shortcuts = [
  { keys: ["⌘", "K"], action: "Open Search" },
  { keys: ["⌘", "N"], action: "New Project" },
  { keys: ["⌘", "/"], action: "Show Shortcuts" },
  { keys: ["Esc"], action: "Close Dialogs" },
]

export function HelpButton() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-20 left-4 z-40"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {shortcuts.map(s => (
                  <div key={s.action} className="flex items-center justify-between">
                    <span className="text-sm">{s.action}</span>
                    <div className="flex gap-1">
                      {s.keys.map(k => (
                        <kbd key={k} className="px-2 py-1 bg-muted rounded text-xs font-mono">{k}</kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                <p>Artist Plan — The Protector of Your Music Career</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
