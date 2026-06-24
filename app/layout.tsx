import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"
import { QuickActions } from "@/components/QuickActions"
import { HelpButton } from "@/components/HelpButton"

export const metadata: Metadata = {
  title: "Artist Plan - Music Career Management",
  description: "The Protector of Your Music Career. Comprehensive management for independent musicians.",
  openGraph: {
    title: "Artist Plan",
    description: "The Protector of Your Music Career.",
    url: "https://artist-plan.vercel.app",
    siteName: "Artist Plan",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <KeyboardShortcuts />
          {children}
          <QuickActions />
          <HelpButton />
        </ErrorBoundary>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
