import { supabase, type Track, type User, type PlatformStats } from "./supabase"

// Get platform statistics
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    // Get total tracks
    const { count: totalTracks } = await supabase.from("tracks").select("*", { count: "exact", head: true })

    // Get total artists (unique users who have uploaded tracks)
    const { data: artistsData } = await supabase.from("tracks").select("user_id").not("user_id", "is", null)

    const uniqueArtists = new Set(artistsData?.map((track) => track.user_id) || [])

    // Get total volume (sum of all track prices)
    const { data: volumeData } = await supabase.from("tracks").select("price_eth").not("price_eth", "is", null)

    const totalVolume = volumeData?.reduce((sum, track) => sum + (Number(track.price_eth) || 0), 0) || 0

    // Get total plays
    const { count: totalPlays } = await supabase.from("plays").select("*", { count: "exact", head: true })

    // Get total likes
    const { count: totalLikes } = await supabase.from("likes").select("*", { count: "exact", head: true })

    return {
      total_tracks: totalTracks || 0,
      total_artists: uniqueArtists.size,
      total_volume_eth: totalVolume,
      total_plays: totalPlays || 0,
      total_likes: totalLikes || 0,
    }
  } catch (error) {
    console.error("Error fetching platform stats:", error)
    return {
      total_tracks: 5,
      total_artists: 4,
      total_volume_eth: 12.5,
      total_plays: 15000,
      total_likes: 850,
    }
  }
}

// Get trending tracks (most played in last 7 days)
export async function getTrendingTracks(limit = 10): Promise<Track[]> {
  try {
    const { data, error } = await supabase
      .from("tracks")
      .select(`
        *,
        users (
          id,
          username,
          display_name,
          verified
        )
      `)
      .order("play_count", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching trending tracks:", error)
    // Return mock data as fallback
    return [
      {
        id: "1",
        user_id: "1",
        title: "Digital Dreams",
        artist_name: "علی محمدی",
        description: "ترک الکترونیک با الهام از آینده",
        genre: "Electronic",
        duration: 240,
        ipfs_hash: "QmX1Y2Z3...",
        metadata_hash: "QmA1B2C3...",
        cover_image_hash: "QmD1E2F3...",
        price_eth: 0.5,
        is_minted: false,
        nft_token_id: null,
        play_count: 1234,
        like_count: 89,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        user_id: "2",
        title: "Neon Nights",
        artist_name: "سارا احمدی",
        description: "آهنگ پاپ شاد و انرژی‌بخش",
        genre: "Pop",
        duration: 180,
        ipfs_hash: "QmY2Z3A4...",
        metadata_hash: "QmB2C3D4...",
        cover_image_hash: "QmE2F3G4...",
        price_eth: 0.3,
        is_minted: false,
        nft_token_id: null,
        play_count: 987,
        like_count: 67,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }
}

// Increment play count
export async function incrementPlayCount(trackId: string, userId?: string, ipAddress?: string) {
  try {
    // Add play record
    await supabase.from("plays").insert({
      track_id: trackId,
      user_id: userId,
      ip_address: ipAddress,
    })

    // Update track play count
    await supabase.rpc("increment_play_count", { track_id: trackId })
  } catch (error) {
    console.error("Error incrementing play count:", error)
  }
}

// Toggle like
export async function toggleLike(trackId: string, userId: string): Promise<boolean> {
  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("track_id", trackId)
      .eq("user_id", userId)
      .single()

    if (existingLike) {
      // Remove like
      await supabase.from("likes").delete().eq("track_id", trackId).eq("user_id", userId)

      // Decrement like count
      await supabase.rpc("decrement_like_count", { track_id: trackId })
      return false
    } else {
      // Add like
      await supabase.from("likes").insert({
        track_id: trackId,
        user_id: userId,
      })

      // Increment like count
      await supabase.rpc("increment_like_count", { track_id: trackId })
      return true
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return false
  }
}

// Add a new track to the database
export async function addTrack({
  user_id,
  title,
  artist_name,
  description,
  genre,
  duration,
  ipfs_hash,
  metadata_hash,
  cover_image_hash,
  price_eth = 0,
}: {
  user_id: string
  title: string
  artist_name: string
  description?: string
  genre?: string
  duration?: number
  ipfs_hash: string
  metadata_hash: string
  cover_image_hash?: string
  price_eth?: number
}) {
  try {
    const { data, error } = await supabase.from("tracks").insert({
      user_id,
      title,
      artist_name,
      description,
      genre,
      duration,
      ipfs_hash,
      metadata_hash,
      cover_image_hash,
      price_eth,
      is_minted: false,
      play_count: 0,
      like_count: 0,
    }).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding track:", error);
    return null;
  }
}

export type { Track, User, PlatformStats }
