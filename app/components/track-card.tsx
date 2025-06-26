"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Heart, Share2, ShoppingCart, Pause, Loader2 } from "lucide-react"
import { useState } from "react"
import { incrementPlayCount } from "@/lib/database"
import { useMusicPlayer } from "@/contexts/music-player-context"

interface TrackCardProps {
  id: string
  title: string
  artist: string
  cover: string
  price: string
  plays: number
  likes: number
  track?: any
}

export function TrackCard({ id, title, artist, cover, price, plays, likes, track }: TrackCardProps) {
  const { currentTrack, isPlaying, isLoading, playTrack, pauseTrack, resumeTrack, setPlaylist, playlist } =
    useMusicPlayer()
  const [isLiked, setIsLiked] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(likes)
  const [currentPlays, setCurrentPlays] = useState(plays)
  const [localLoading, setLocalLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isCurrentTrack = currentTrack?.id === id
  const isTrackPlaying = isCurrentTrack && isPlaying
  const isThisTrackLoading = isLoading && isCurrentTrack

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!track) return

    if (isCurrentTrack) {
      if (isPlaying) {
        pauseTrack()
      } else {
        try {
          await resumeTrack()
        } catch (error) {
          console.error("Error resuming track:", error)
        }
      }
    } else {
      try {
        setLocalLoading(true)

        if (playlist.length === 0) {
          setPlaylist([track])
        }

        setCurrentPlays((prev) => prev + 1)
        await incrementPlayCount(id)
        await playTrack(track)
      } catch (error) {
        console.error("Error playing track:", error)
        setCurrentPlays((prev) => prev - 1)
      } finally {
        setLocalLoading(false)
      }
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setCurrentLikes((prev) => (newLikedState ? prev + 1 : prev - 1))
  }

  return (
    <Link href={`/track/${id}`}>
      <div
        className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#7B61FF]/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={cover || "/placeholder.svg"}
            alt={title}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            loading="eager"
          />

          {/* Play Button Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isHovered || isCurrentTrack ? "opacity-100" : "opacity-0"}`}
          >
            <Button
              size="lg"
              className={`rounded-full backdrop-blur-sm transition-all duration-300 ${
                isTrackPlaying ? "bg-white/30 hover:bg-white/40" : "bg-white/20 hover:bg-white/30"
              } ${isHovered ? "scale-100" : "scale-90"}`}
              onClick={handlePlay}
              disabled={isThisTrackLoading || localLoading}
            >
              {isThisTrackLoading || localLoading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : isTrackPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-0.5" />
              )}
            </Button>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3 rounded-full bg-[#7B61FF]/90 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white">
            {price}
          </div>

          {/* Playing Indicator */}
          {isCurrentTrack && (
            <div className="absolute top-3 left-3 rounded-full bg-[#00D4FF]/90 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white">
              {isPlaying ? "در حال پخش" : "متوقف"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-1 text-lg font-semibold text-white truncate">{title}</h3>
          <p className="mb-3 text-white/60 truncate">{artist}</p>

          {/* Stats */}
          <div className="mb-4 flex items-center justify-between text-sm text-white/40">
            <span>{currentPlays.toLocaleString()} پخش</span>
            <span>{currentLikes} لایک</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 rounded-full transition-colors duration-200 ${
                  isLiked ? "text-red-500 hover:bg-red-500/10" : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 transition-transform duration-200 ${isLiked ? "fill-red-500 scale-110" : ""} ${isHovered ? "scale-110" : "scale-100"}`}
                />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90 transition-transform duration-200 hover:scale-105"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              خرید
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
