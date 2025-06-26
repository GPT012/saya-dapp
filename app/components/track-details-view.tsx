"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  Music,
  Clock,
  ShoppingCart,
  Loader2,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import { formatTime } from "@/lib/utils"
import { useMusicPlayer } from "@/contexts/music-player-context"
import { useAuth } from "@/contexts/auth-context"
import { type TrackDetails, addComment } from "@/lib/track-details"
import { toggleLike } from "@/lib/database"

interface TrackDetailsViewProps {
  track: TrackDetails
  initialIsLiked?: boolean
}

export function TrackDetailsView({ track, initialIsLiked = false }: TrackDetailsViewProps) {
  const { currentTrack, isPlaying, isLoading, playTrack, pauseTrack, resumeTrack } = useMusicPlayer()
  const { user, isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(track.like_count)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(track.comments || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAllDescription, setShowAllDescription] = useState(false)

  const isCurrentTrack = currentTrack?.id === track.id
  const isTrackPlaying = isCurrentTrack && isPlaying

  const handlePlayPause = async () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pauseTrack()
      } else {
        await resumeTrack()
      }
    } else {
      await playTrack(track)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated || !user) return

    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikeCount((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)))

    try {
      await toggleLike(track.id, user.id)
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState)
      setLikeCount((prev) => (!newLikedState ? prev + 1 : Math.max(0, prev - 1)))
      console.error("Error toggling like:", error)
    }
  }

  const handleSubmitComment = async () => {
    if (!isAuthenticated || !user || !comment.trim()) return

    setIsSubmitting(true)

    try {
      const newComment = await addComment(track.id, user.id, comment.trim())
      if (newComment) {
        // Add user info to the comment for display
        const commentWithUser = {
          ...newComment,
          user: user,
        }
        setComments([commentWithUser, ...comments])
        setComment("")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format creation date
  const creationDate = new Date(track.created_at).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Truncate description if needed
  const description = track.description || "توضیحاتی برای این ترک ثبت نشده است."
  const isLongDescription = description.length > 300
  const displayDescription = isLongDescription && !showAllDescription ? description.slice(0, 300) + "..." : description

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image (blurred) */}
        <div className="absolute inset-0 overflow-hidden">
          {track.cover_image_hash && (
            <Image
              src={`https://ipfs.io/ipfs/${track.cover_image_hash}`}
              alt={track.title}
              fill
              className="object-cover opacity-20 blur-xl"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900"></div>
        </div>

        {/* Content */}
        <div className="container relative mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Cover Art */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
              <Image
                src={
                  track.cover_image_hash
                    ? `https://ipfs.io/ipfs/${track.cover_image_hash}`
                    : "/placeholder.svg?height=320&width=320"
                }
                alt={track.title}
                fill
                className="object-cover"
                priority
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 h-16 w-16 flex items-center justify-center"
                  onClick={handlePlayPause}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : isTrackPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )}
                </Button>
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 text-center md:text-right">
              <div className="mb-2">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 mb-2">
                  {track.genre || "بدون ژانر"}
                </Badge>
                {track.is_minted && (
                  <Badge className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white border-none mr-2 mb-2">
                    NFT
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{track.title}</h1>

              <div className="flex items-center justify-center md:justify-end mb-6">
                <Link
                  href={`/artist/${track.user_id}`}
                  className="flex items-center hover:text-[#00D4FF] transition-colors"
                >
                  <span className="text-xl text-white/80">{track.artist_name}</span>
                  {track.artist?.verified && <CheckCircle className="mr-1 h-4 w-4 text-[#00D4FF]" />}
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 mb-8">
                <div className="flex items-center text-white/60">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>{creationDate}</span>
                </div>
                <div className="flex items-center text-white/60">
                  <Music className="h-4 w-4 ml-1" />
                  <span>{track.play_count.toLocaleString()} پخش</span>
                </div>
                <div className="flex items-center text-white/60">
                  <Heart className="h-4 w-4 ml-1" />
                  <span>{likeCount.toLocaleString()} لایک</span>
                </div>
                <div className="flex items-center text-white/60">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>{formatTime(track.duration || 0)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                <Button
                  className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90"
                  onClick={handlePlayPause}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال بارگذاری...
                    </>
                  ) : isTrackPlaying ? (
                    <>
                      <Pause className="ml-2 h-4 w-4" />
                      توقف پخش
                    </>
                  ) : (
                    <>
                      <Play className="ml-2 h-4 w-4" />
                      پخش ترک
                    </>
                  )}
                </Button>

                {track.is_minted ? (
                  <Button className="rounded-full bg-white/10 text-white hover:bg-white/20">
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    خرید NFT
                  </Button>
                ) : (
                  <Button className="rounded-full bg-white/10 text-white hover:bg-white/20" disabled>
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    به‌زودی
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className={`rounded-full ${
                    isLiked ? "text-red-500 hover:bg-red-500/10" : "text-white hover:bg-white/10"
                  }`}
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                >
                  <Heart className={`ml-2 h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                  {isLiked ? "پسندیده شده" : "پسندیدن"}
                </Button>

                <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">
                  <Share2 className="ml-2 h-4 w-4" />
                  اشتراک‌گذاری
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Comments */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">درباره این ترک</h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">{displayDescription}</p>
              {isLongDescription && (
                <Button
                  variant="link"
                  className="text-[#00D4FF] p-0 h-auto mt-2"
                  onClick={() => setShowAllDescription(!showAllDescription)}
                >
                  {showAllDescription ? "نمایش کمتر" : "نمایش بیشتر"}
                </Button>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">نظرات</h2>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  {comments.length} نظر
                </Badge>
              </div>

              {/* Comment Form */}
              {isAuthenticated ? (
                <div className="mb-8">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar_url || ""} alt={user?.display_name || ""} />
                      <AvatarFallback className="bg-[#7B61FF]/30 text-white">
                        {user?.display_name?.[0] || user?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Textarea
                      placeholder="نظر خود را بنویسید..."
                      className="flex-1 bg-white/10 border-white/20 text-white resize-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!comment.trim() || isSubmitting}
                      className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="ml-2 h-4 w-4" />
                          ارسال نظر
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 rounded-lg p-4 text-center mb-8">
                  <p className="text-white/60 mb-2">برای ارسال نظر ابتدا وارد شوید</p>
                  <Button className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90">
                    اتصال کیف پول
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-white/10 pb-6 last:border-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.user?.avatar_url || ""} alt={comment.user?.display_name || ""} />
                          <AvatarFallback className="bg-[#7B61FF]/30 text-white">
                            {comment.user?.display_name?.[0] || comment.user?.username?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-white">
                              {comment.user?.display_name || comment.user?.username || "کاربر ناشناس"}
                            </span>
                            {comment.user?.verified && <CheckCircle className="mr-1 h-3 w-3 text-[#00D4FF]" />}
                            <span className="text-white/40 text-sm mr-2">
                              {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                          <p className="text-white/80">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهد!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Artist Info & Related Tracks */}
          <div>
            {/* Artist Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={track.artist?.avatar_url || ""} alt={track.artist_name} />
                  <AvatarFallback className="bg-[#7B61FF]/30 text-white text-xl">{track.artist_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold text-white">{track.artist_name}</h3>
                    {track.artist?.verified && <CheckCircle className="mr-1 h-4 w-4 text-[#00D4FF]" />}
                  </div>
                  {track.artist?.username && <p className="text-white/60">{track.artist.username}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{track.artist?.followers_count || 0}</div>
                  <div className="text-sm text-white/60">دنبال‌کننده</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{track.artist?.tracks_count || 0}</div>
                  <div className="text-sm text-white/60">ترک</div>
                </div>
              </div>

              <Link href={`/artist/${track.user_id}`}>
                <Button className="w-full rounded-full bg-white/10 text-white hover:bg-white/20">مشاهده پروفایل</Button>
              </Link>
            </div>

            {/* IPFS Info */}
            {track.ipfs_hash && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">اطلاعات IPFS</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60 mb-1">هش فایل صوتی:</div>
                    <div className="bg-white/10 rounded p-2 text-xs text-white/80 break-all">{track.ipfs_hash}</div>
                  </div>
                  {track.metadata_hash && (
                    <div>
                      <div className="text-sm text-white/60 mb-1">هش متادیتا:</div>
                      <div className="bg-white/10 rounded p-2 text-xs text-white/80 break-all">
                        {track.metadata_hash}
                      </div>
                    </div>
                  )}
                  <a
                    href={`https://ipfs.io/ipfs/${track.ipfs_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#00D4FF] hover:underline text-sm mt-2"
                  >
                    <ExternalLink className="h-3 w-3 ml-1" />
                    مشاهده در IPFS
                  </a>
                </div>
              </div>
            )}

            {/* NFT Info */}
            {track.is_minted && track.nft_token_id && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">اطلاعات NFT</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60 mb-1">شناسه توکن:</div>
                    <div className="bg-white/10 rounded p-2 text-xs text-white/80">{track.nft_token_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">قیمت:</div>
                    <div className="text-xl font-bold text-white">{track.price_eth || 0} ETH</div>
                  </div>
                  <Button className="w-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90">
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    خرید NFT
                  </Button>
                </div>
              </div>
            )}

            {/* Related Tracks */}
            {track.relatedTracks && track.relatedTracks.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">ترک‌های مرتبط</h3>
                <div className="space-y-4">
                  {track.relatedTracks.map((relatedTrack) => (
                    <Link href={`/track/${relatedTrack.id}`} key={relatedTrack.id}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              relatedTrack.cover_image_hash
                                ? `https://ipfs.io/ipfs/${relatedTrack.cover_image_hash}`
                                : "/placeholder.svg?height=48&width=48"
                            }
                            alt={relatedTrack.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{relatedTrack.title}</h4>
                          <p className="text-white/60 text-sm truncate">{relatedTrack.artist_name}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
