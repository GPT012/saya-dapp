import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, Home, Search } from "lucide-react"

export default function TrackNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center">
            <Music className="h-12 w-12 text-[#7B61FF]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">ترک یافت نشد</h1>
        <p className="text-white/60 mb-8">
          متأسفانه ترک مورد نظر شما یافت نشد. ممکن است این ترک حذف شده باشد یا آدرس اشتباه وارد کرده باشید.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90"
          >
            <Link href="/">
              <Home className="ml-2 h-4 w-4" />
              بازگشت به خانه
            </Link>
          </Button>
          <Button asChild className="rounded-full bg-white/10 text-white hover:bg-white/20">
            <Link href="/explore">
              <Search className="ml-2 h-4 w-4" />
              جستجوی ترک‌ها
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
