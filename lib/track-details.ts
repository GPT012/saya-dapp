import { supabase, type Track, type User } from "./supabase"

export interface TrackDetails extends Track {
  artist?: User
  comments?: Comment[]
  isLiked?: boolean
  relatedTracks?: Track[]
}

export interface Comment {
  id: string
  user_id: string
  track_id: string
  content: string
  created_at: string
  user?: User
}

// Get track details by ID
export async function getTrackById(trackId: string): Promise<TrackDetails | null> {
  try {
    // Get track with artist info
    const { data: track, error } = await supabase
      .from("tracks")
      .select(`
        *,
        users (*)
      `)
      .eq("id", trackId)
      .single()

    if (error || !track) {
      console.error("Error fetching track:", error)
      return null
    }

    // Get comments for the track
    const { data: comments } = await supabase
      .from("comments")
      .select(`
        *,
        users (*)
      `)
      .eq("track_id", trackId)
      .order("created_at", { ascending: false })

    // Format the track details
    const trackDetails: TrackDetails = {
      ...track,
      artist: track.users,
      comments: comments || [],
    }

    // Get related tracks (same artist or genre)
    const { data: relatedTracks } = await supabase
      .from("tracks")
      .select(`
        *,
        users (*)
      `)
      .neq("id", trackId)
      .eq("user_id", track.user_id)
      .limit(4)

    if (relatedTracks && relatedTracks.length > 0) {
      trackDetails.relatedTracks = relatedTracks
    } else {
      // If no tracks from same artist, get tracks with same genre
      const { data: genreTracks } = await supabase
        .from("tracks")
        .select(`
          *,
          users (*)
        `)
        .neq("id", trackId)
        .eq("genre", track.genre)
        .limit(4)

      trackDetails.relatedTracks = genreTracks || []
    }

    return trackDetails
  } catch (error) {
    console.error("Error in getTrackById:", error)
    return null
  }
}

// Add comment to track
export async function addComment(trackId: string, userId: string, content: string): Promise<Comment | null> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        track_id: trackId,
        user_id: userId,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding comment:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in addComment:", error)
    return null
  }
}

// Check if user has liked track
export async function checkIfLiked(trackId: string, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("likes")
      .select("id")
      .eq("track_id", trackId)
      .eq("user_id", userId)
      .single()

    if (error) {
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error in checkIfLiked:", error)
    return false
  }
}
