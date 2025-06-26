"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Clock, Zap, EyeOff } from "lucide-react"

export function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false)

  // Simplified dashboard that doesn't try to access window objects
  if (!isVisible) {
    return (
      <div className="fixed bottom-24 right-4 z-40">
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 p-0"
          title="نمایش آمار و تحلیلات"
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 w-96 max-h-[80vh] overflow-y-auto">
      <Card className="bg-gray-900/95 backdrop-blur-md border-white/10 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-persian flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00D4FF]" />
              آمار و تحلیلات
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white">فعال</Badge>
              <Button
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 rounded-full bg-white/10 hover:bg-white/20"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#00D4FF] mr-2" />
              <h3 className="text-lg font-bold text-white">Vercel Analytics فعال است</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">آمار و تحلیل‌های سایت در داشبورد Vercel قابل مشاهده است.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-[#7B61FF] mr-1" />
                </div>
                <div className="text-lg font-bold text-white">بازدیدکنندگان</div>
                <div className="text-xs text-white/60 font-persian">در حال ردیابی</div>
              </div>

              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-green-500 mr-1" />
                </div>
                <div className="text-lg font-bold text-white">عملکرد</div>
                <div className="text-xs text-white/60 font-persian">در حال بررسی</div>
              </div>
            </div>
          </div>

          {/* Powered by Vercel */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-center text-xs text-white/40 font-persian">
              <Zap className="h-3 w-3 mr-1" />
              قدرت گرفته از Vercel Analytics
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
