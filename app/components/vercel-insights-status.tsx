"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle, AlertCircle } from "lucide-react"

export function VercelInsightsStatus() {
  const [isActive, setIsActive] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check if Vercel Analytics is loaded
    const checkAnalytics = () => {
      if (typeof window !== "undefined") {
        // Check for Vercel Analytics
        const hasAnalytics = !!(window as any).va || !!(window as any).vaq
        // Check for Speed Insights
        const hasSpeedInsights = !!(window as any).si

        setIsActive(hasAnalytics || hasSpeedInsights)
      }
    }

    // Check immediately and after a delay
    checkAnalytics()
    const timer = setTimeout(checkAnalytics, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed top-20 left-4 z-50">
      <Badge
        variant="outline"
        className={`${
          isActive
            ? "bg-green-500/20 border-green-500/50 text-green-400"
            : "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
        } backdrop-blur-sm`}
      >
        {isActive ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            <Zap className="h-3 w-3 mr-1" />
            Vercel Insights فعال
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 mr-1" />
            در حال بارگذاری...
          </>
        )}
      </Badge>
    </div>
  )
}
