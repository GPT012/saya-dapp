import { Hero } from "./components/hero"
import { TrendingTracks } from "./components/trending-tracks"
import { FeaturedArtists } from "./components/featured-artists"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Hero />
      <TrendingTracks />
      <FeaturedArtists />
    </div>
  )
}
