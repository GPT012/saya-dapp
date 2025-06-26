"use client"

import { useEffect, useState } from "react"
import { TrackCard } from "../components/track-card"
import { getTrendingTracks, type Track } from "@/lib/database"

export default function ExplorePage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTracks() {
      try {
        const allTracks = await getTrendingTracks(50)
        setTracks(allTracks)
      } catch (error) {
        console.error("Error loading tracks:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTracks()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">کاوش آثار موسیقی</h1>
        {loading ? (
          <div className="text-white text-center">در حال بارگذاری...</div>
        ) : tracks.length === 0 ? (
          <div className="text-white/60 text-center">هنوز اثری ثبت نشده است.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                id={track.id}
                title={track.title}
                artist={track.artist_name}
                cover={track.cover_image_hash ? `https://ipfs.io/ipfs/${track.cover_image_hash}` : "/placeholder.svg"}
                price={track.price_eth ? `${track.price_eth} ETH` : "رایگان"}
                plays={track.play_count}
                likes={track.like_count}
                track={track}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
