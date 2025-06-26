import { ArtistCard } from "./artist-card"
import { Users } from "lucide-react"
import { Suspense } from "react"

// Skeleton loading component
function ArtistCardSkeleton() {
  return (
    <div className="animate-pulse group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center">
      <div className="relative mx-auto mb-4 h-20 w-20 rounded-full bg-white/10"></div>
      <div className="h-6 bg-white/10 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-1/2 mx-auto mb-4"></div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="h-6 bg-white/10 rounded w-1/2 mx-auto mb-1"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
        </div>
        <div>
          <div className="h-6 bg-white/10 rounded w-1/2 mx-auto mb-1"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
      <div className="h-10 bg-white/10 rounded-full w-full"></div>
    </div>
  )
}

export function FeaturedArtists() {
  const artists = [
    {
      id: 1,
      name: "علی محمدی",
      username: "@ali_music",
      avatar: "/placeholder.svg?height=100&width=100",
      followers: 1234,
      tracks: 15,
      verified: true,
    },
    {
      id: 2,
      name: "سارا احمدی",
      username: "@sara_beats",
      avatar: "/placeholder.svg?height=100&width=100",
      followers: 987,
      tracks: 8,
      verified: false,
    },
    {
      id: 3,
      name: "رضا کریمی",
      username: "@reza_sound",
      avatar: "/placeholder.svg?height=100&width=100",
      followers: 2156,
      tracks: 23,
      verified: true,
    },
    {
      id: 4,
      name: "مینا رضایی",
      username: "@mina_music",
      avatar: "/placeholder.svg?height=100&width=100",
      followers: 876,
      tracks: 12,
      verified: false,
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-[#00D4FF] mr-2" />
            <h2 className="text-3xl font-bold text-white">هنرمندان برتر</h2>
          </div>
          <p className="text-white/60">خالقان محبوب جامعه سایا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Suspense fallback={[...Array(4)].map((_, i) => <ArtistCardSkeleton key={i} />)}>
            {artists.map((artist) => (
              <ArtistCard key={artist.id} {...artist} />
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  )
}
