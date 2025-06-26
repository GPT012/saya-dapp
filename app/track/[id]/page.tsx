import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"
import { TrackDetailsView } from "@/app/components/track-details-view"
import { getTrackById, checkIfLiked } from "@/lib/track-details"
import { getCurrentUser } from "@/lib/web3auth"

interface TrackPageProps {
  params: {
    id: string
  }
}

export default async function TrackPage({ params }: TrackPageProps) {
  const trackId = params.id

  // Get track details
  const track = await getTrackById(trackId)

  // If track not found, show 404
  if (!track) {
    notFound()
  }

  // Check if current user has liked the track
  let isLiked = false
  try {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      isLiked = await checkIfLiked(trackId, currentUser.id)
    }
  } catch (error) {
    console.error("Error checking if track is liked:", error)
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#7B61FF]" />
        </div>
      }
    >
      <TrackDetailsView track={track} initialIsLiked={isLiked} />
    </Suspense>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: TrackPageProps) {
  const trackId = params.id
  const track = await getTrackById(trackId)

  if (!track) {
    return {
      title: "ترک یافت نشد | سایا",
      description: "ترک مورد نظر یافت نشد.",
    }
  }

  return {
    title: `${track.title} - ${track.artist_name} | سایا`,
    description: track.description || `گوش دادن به ${track.title} از ${track.artist_name} در پلتفرم سایا`,
    openGraph: {
      images: track.cover_image_hash ? [`https://ipfs.io/ipfs/${track.cover_image_hash}`] : [],
    },
  }
}
