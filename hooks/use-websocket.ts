"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!autoConnect) return

    // Initialize socket connection
    socketRef.current = io(url, {
      transports: ["websocket", "polling"],
      timeout: 5000,
    })

    const socket = socketRef.current

    socket.on("connect", () => {
      setIsConnected(true)
      setError(null)
      onConnect?.()
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      onDisconnect?.()
    })

    socket.on("connect_error", (err) => {
      const error = new Error(`WebSocket connection failed: ${err.message}`)
      setError(error)
      setIsConnected(false)
      onError?.(error)
    })

    return () => {
      socket.disconnect()
    }
  }, [url, autoConnect, onConnect, onDisconnect, onError])

  const emit = (event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }

  const on = (event: string, callback: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
      
      // Return cleanup function
      return () => {
        socketRef.current?.off(event, callback)
      }
    }
  }

  const off = (event: string, callback?: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  const connect = () => {
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect()
    }
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }

  return {
    isConnected,
    error,
    emit,
    on,
    off,
    connect,
    disconnect,
    socket: socketRef.current
  }
}