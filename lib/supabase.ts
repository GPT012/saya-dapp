import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  wallet_address: string
  username?: string
  display_name?: string
  bio?: string
  avatar_url?: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Track {
  id: string
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
  is_minted: boolean
  nft_token_id?: string
  play_count: number
  like_count: number
  created_at: string
  updated_at: string
  users?: User
}

export interface Like {
  id: string
  user_id: string
  track_id: string
  created_at: string
}

export interface Play {
  id: string
  user_id?: string
  track_id: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

// Stats interface
export interface PlatformStats {
  total_tracks: number
  total_artists: number
  total_volume_eth: number
  total_plays: number
  total_likes: number
}
