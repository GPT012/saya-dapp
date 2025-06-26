"use client"

import { Button } from "@/components/ui/button"
import { Play, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { getPlatformStats, type PlatformStats } from "@/lib/database"
import { useRouter } from "next/navigation"

export function Hero() {
  const [stats, setStats] = useState<PlatformStats>({
    total_tracks: 5,
    total_artists: 4,
    total_volume_eth: 12.5,
    total_plays: 15000,
    total_likes: 850,
  })
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    async function loadStats() {
      try {
        const platformStats = await getPlatformStats()
        setStats(platformStats)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isMounted])

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#7B61FF]/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#00D4FF]/20 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl md:text-6xl font-bold text-white">هر صدا، یک هویت</h1>
          <p className="mb-8 text-xl md:text-2xl text-white/80">سایا، خانه‌ی آثار تو</p>
          <p className="mb-12 text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            فضای هنری مبتنی بر Web3 برای اشتراک‌گذاری و مالکیت ترک‌های موسیقی به‌صورت NFT. موزیک خود را آپلود کن، به NFT
            تبدیل کن و با دنیا به اشتراک بگذار.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] px-8 py-3 text-lg font-medium text-white hover:opacity-90"
            >
              <Upload className="mr-2 h-5 w-5" />
              ساخت NFT موزیک
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 px-8 py-3 text-lg font-medium text-white hover:bg-white/20"
              onClick={() => router.push("/explore")}
            >
              <Play className="mr-2 h-5 w-5" />
              کاوش آثار
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : stats.total_tracks.toLocaleString()}
              </div>
              <div className="text-white/60">ترک منتشر شده</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : stats.total_artists.toLocaleString()}
              </div>
              <div className="text-white/60">هنرمند فعال</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {loading ? "..." : stats.total_volume_eth.toFixed(1)}
              </div>
              <div className="text-white/60">ETH حجم معاملات</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
