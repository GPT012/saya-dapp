"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { WalletConnectButton } from "./wallet-connect-button"
import { useState, useEffect } from "react"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-white/10 bg-gray-900/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Clickable to home */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border-2 border-[#7B61FF] border-r-transparent animate-spin-slow"></div>
              <div className="absolute inset-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] opacity-20"></div>
            </div>
            <span className="text-xl font-bold text-white">Saya</span>
            <span className="text-xl font-bold text-white/60">| سایا</span>
          </Link>

          {/* Search - Glass morphism style */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                  searchFocused ? "text-[#7B61FF]" : "text-white/40"
                }`}
              />
              <Input
                className={`w-full rounded-full border transition-all duration-300 ${
                  searchFocused
                    ? "border-[#7B61FF] bg-white/15 pl-10 text-white ring-1 ring-[#7B61FF]/30"
                    : "border-white/20 bg-white/10 backdrop-blur-sm pl-10 text-white"
                } placeholder:text-white/40 focus:border-[#7B61FF]`}
                placeholder="جستجوی موزیک، هنرمند..."
                dir="rtl"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Actions - Only Wallet Connect */}
          <div className="flex items-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
