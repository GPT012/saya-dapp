"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Zap, Clock, Wifi, EyeOff } from "lucide-react"

interface PerformanceMetrics {
  fcp: number
  ttfb: number
  loadTime: number
  domContentLoaded: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [connectionType, setConnectionType] = useState<string>("unknown")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Get connection info safely
    try {
      if (typeof navigator !== "undefined" && "connection" in navigator) {
        const connection = (navigator as any).connection
        setConnectionType(connection?.effectiveType || "4g")
      }
    } catch (error) {
      console.log("Connection API not available")
    }

    // Collect performance metrics safely
    const collectMetrics = () => {
      try {
        if (typeof window === "undefined" || !("performance" in window)) {
          return
        }

        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType("paint")

        if (!navigation) return

        const fcp = paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0
        const ttfb = navigation.responseStart - navigation.requestStart || 0
        const loadTime = navigation.loadEventEnd - navigation.navigationStart || 0
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart || 0

        setMetrics({
          fcp: Math.round(fcp),
          ttfb: Math.round(ttfb),
          loadTime: Math.round(loadTime),
          domContentLoaded: Math.round(domContentLoaded),
        })
      } catch (error) {
        console.log("Performance API not available")
      }
    }

    // Collect metrics after page load
    if (document.readyState === "complete") {
      setTimeout(collectMetrics, 1000)
    } else {
      const handleLoad = () => {
        setTimeout(collectMetrics, 1000)
      }
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [isMounted])

  const getScoreColor = (metric: string, value: number) => {
    switch (metric) {
      case "fcp":
        return value < 1800 ? "bg-green-500" : value < 3000 ? "bg-yellow-500" : "bg-red-500"
      case "ttfb":
        return value < 800 ? "bg-green-500" : value < 1800 ? "bg-yellow-500" : "bg-red-500"
      case "loadTime":
        return value < 3000 ? "bg-green-500" : value < 5000 ? "bg-yellow-500" : "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatMetric = (value: number) => {
    return `${value}ms`
  }

  if (!isMounted) {
    return null
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-24 left-4 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 p-0"
          title="نمایش متریک‌های عملکرد"
        >
          <Activity className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 left-4 z-40 w-80">
      <Card className="bg-gray-900/95 backdrop-blur-md border-white/10 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-persian">متریک‌های عملکرد</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                {connectionType}
              </Badge>
              <Button
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-white/20"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics ? (
            <>
              {/* First Contentful Paint */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getScoreColor("fcp", metrics.fcp)}`}></div>
                  <span className="text-sm font-persian">FCP</span>
                </div>
                <span className="text-sm font-english">{formatMetric(metrics.fcp)}</span>
              </div>

              {/* Time to First Byte */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getScoreColor("ttfb", metrics.ttfb)}`}></div>
                  <span className="text-sm font-persian">TTFB</span>
                </div>
                <span className="text-sm font-english">{formatMetric(metrics.ttfb)}</span>
              </div>

              {/* Load Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getScoreColor("loadTime", metrics.loadTime)}`}></div>
                  <span className="text-sm font-persian">Load Time</span>
                </div>
                <span className="text-sm font-english">{formatMetric(metrics.loadTime)}</span>
              </div>

              {/* Performance Score */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#00D4FF]" />
                    <span className="text-sm font-persian">امتیاز کلی</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white">
                    {metrics.fcp < 2000 && metrics.ttfb < 1000 ? "عالی" : "خوب"}
                  </Badge>
                </div>
              </div>

              {/* Tips */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/60 font-persian">
                  <Clock className="h-3 w-3 inline mr-1" />
                  آمار عملکرد مرورگر
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Activity className="h-8 w-8 text-white/40 mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-white/60 font-persian">در حال جمع‌آوری داده‌ها...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
