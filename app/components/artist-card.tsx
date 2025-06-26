"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, UserPlus } from "lucide-react"
import { useState } from "react"

interface ArtistCardProps {
  id: number
  name: string
  username: string
  avatar: string
  followers: number
  tracks: number
  verified: boolean
}

export function ArtistCard({ name, username, avatar, followers, tracks, verified }: ArtistCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#7B61FF]/50 transition-all duration-300 hover:transform hover:scale-105 p-6 text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-[#7B61FF]/30 transition-transform duration-300 group-hover:scale-110">
        <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" loading="eager" />
      </div>

      {/* Name and Verification */}
      <div className="mb-2 flex items-center justify-center">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {verified && <CheckCircle className="ml-1 h-4 w-4 text-[#00D4FF]" />}
      </div>

      <p className="mb-4 text-white/60">{username}</p>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xl font-bold text-white">{followers.toLocaleString()}</div>
          <div className="text-sm text-white/60">دنبال‌کننده</div>
        </div>
        <div>
          <div className="text-xl font-bold text-white">{tracks}</div>
          <div className="text-sm text-white/60">ترک</div>
        </div>
      </div>

      {/* Follow Button */}
      <Button
        className={`w-full rounded-full transition-all duration-300 ${
          isFollowing
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90"
        } ${isHovered ? "transform scale-105" : ""}`}
        onClick={() => setIsFollowing(!isFollowing)}
      >
        <UserPlus className={`mr-2 h-4 w-4 transition-transform duration-200 ${isHovered ? "scale-110" : ""}`} />
        {isFollowing ? "دنبال می‌کنید" : "دنبال کردن"}
      </Button>
    </div>
  )
}
