"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7B61FF]" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] flex items-center justify-center text-4xl font-bold text-white">
              {user.username ? user.username[0].toUpperCase() : "S"}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.display_name || user.username || "کاربر سایا"}
              </h1>
              <p className="text-white/60 mb-4">{user.wallet_address}</p>

              {user.bio ? (
                <p className="text-white/80 mb-6">{user.bio}</p>
              ) : (
                <p className="text-white/60 mb-6">هنوز بیوگرافی ثبت نشده است.</p>
              )}

              <Button className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90">
                ویرایش پروفایل
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-white/10 pt-8">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/60">ترک‌ها</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/60">دنبال‌کنندگان</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/60">دنبال‌شوندگان</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-white">0 ETH</div>
              <div className="text-white/60">فروش</div>
            </div>
          </div>

          {/* Placeholder for tracks */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">ترک‌های من</h2>
            <div className="bg-white/10 rounded-lg p-8 text-center">
              <p className="text-white/60">هنوز ترکی آپلود نکرده‌اید.</p>
              <Button className="mt-4 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90">
                آپلود اولین ترک
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
