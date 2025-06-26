import Link from "next/link"
import { Twitter, Instagram, TextIcon as Telegram, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-900/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="h-8 w-8 rounded-full border-2 border-[#7B61FF] border-r-transparent"></div>
                <div className="absolute inset-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] opacity-20"></div>
              </div>
              <span className="text-xl font-bold text-white">Saya</span>
              <span className="text-xl font-bold text-white/60">| سایا</span>
            </div>
            <p className="text-white/60 mb-6 max-w-md">
              فضای هنری مبتنی بر Web3 برای اشتراک‌گذاری و مالکیت ترک‌های موسیقی به‌صورت NFT. هر صدا، یک هویت. سایا، خانه‌ی
              آثار تو.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/60 hover:text-[#00D4FF] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/60 hover:text-[#00D4FF] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/60 hover:text-[#00D4FF] transition-colors">
                <Telegram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/60 hover:text-[#00D4FF] transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/60 hover:text-white transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-white/60 hover:text-white transition-colors">
                  جستجو
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-white/60 hover:text-white transition-colors">
                  آپلود
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-white/60 hover:text-white transition-colors">
                  پروفایل
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">پشتیبانی</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-white/60 hover:text-white transition-colors">
                  راهنما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/60 hover:text-white transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-white/60 hover:text-white transition-colors">
                  سیاست‌ها و شرایط استفاده
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 Saya. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}
