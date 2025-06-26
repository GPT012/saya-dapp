"use client"

import { useEffect, useState } from "react"
import { TrackCard } from "./track-card"
import { TrendingUp } from "lucide-react"
import { getTrendingTracks, type Track } from "@/lib/database"
import { useMusicPlayer } from "@/contexts/music-player-context"

export function TrendingTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { setPlaylist } = useMusicPlayer()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    async function loadTracks() {
      try {
        const trendingTracks = await getTrendingTracks(4)
        setTracks(trendingTracks)
        setPlaylist(trendingTracks)
      } catch (error) {
        console.error("Error loading trending tracks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTracks()
  }, [isMounted, setPlaylist])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-[#00D4FF] mr-2" />
            <h2 className="text-3xl font-bold text-white">ترک‌های ترند</h2>
          </div>
          <p className="text-white/60">محبوب‌ترین آثار هفته</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/10 rounded-2xl aspect-square"></div>
                  <div className="mt-4 h-5 bg-white/10 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-8 bg-white/10 rounded w-1/4"></div>
                    <div className="h-8 bg-white/10 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            : tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist_name}
                  cover={
                    track.cover_image_hash
                      ? `https://ipfs.io/ipfs/${track.cover_image_hash}`
                      : "/placeholder.svg?height=300&width=300"
                  }
                  price={track.price_eth ? `${track.price_eth} ETH` : "رایگان"}
                  plays={track.play_count}
                  likes={track.like_count}
                  track={track}
                />
              ))}
        </div>
      </div>
    </section>
  )
}
