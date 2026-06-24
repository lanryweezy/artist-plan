"use client"

import { useStore } from "@/store/useStore"
import { X, CheckCircle, AlertTriangle, Info, DollarSign } from "lucide-react"

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "financial": return <DollarSign className="h-4 w-4 text-green-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-card border rounded-lg shadow-lg p-4 border-l-4 border-l-primary animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-full">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{toast.title}</p>
                <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
              {toast.message && (
                <p className="text-xs text-muted-foreground">{toast.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
