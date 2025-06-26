"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Maximize2,
  Minimize2,
  Loader2,
  Radio,
  AlertCircle,
} from "lucide-react"
import { useMusicPlayer } from "@/contexts/music-player-context"
import { formatTime } from "@/lib/utils"

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    isDemoMode,
    pauseTrack,
    resumeTrack,
    seekTo,
    setVolume,
    nextTrack,
    previousTrack,
    toggleDemoMode,
  } = useMusicPlayer()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  if (!currentTrack) return null

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack()
    } else {
      resumeTrack()
    }
  }

  const handleSeek = (value: number[]) => {
    seekTo(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Mini Player */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-white/10 transition-all duration-300 ${
          isExpanded ? "h-screen" : "h-20"
        }`}
      >
        {!isExpanded ? (
          // Mini Player View
          <div className="flex items-center justify-between h-full px-4">
            {/* Demo Mode Indicator */}
            {isDemoMode && (
              <div className="absolute top-1 left-4 flex items-center text-xs text-[#00D4FF]">
                <Radio className="h-3 w-3 mr-1" />
                <span>حالت دمو</span>
              </div>
            )}

            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={
                    currentTrack.cover_image_hash
                      ? `https://ipfs.io/ipfs/${currentTrack.cover_image_hash}`
                      : "/placeholder.svg?height=48&width=48"
                  }
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  loading="eager"
                  priority
                />
                {/* Playing animation */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-[#7B61FF]/20 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-white animate-pulse"></div>
                      <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
                <p className="text-white/60 text-sm truncate">{currentTrack.artist_name}</p>
              </div>
            </div>

            {/* Controls - Fixed alignment and spacing */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousTrack}
                className="text-white hover:bg-white/10 h-10 w-10 rounded-full"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                disabled={isLoading}
                className="text-white hover:bg-white/10 h-12 w-12 rounded-full bg-[#7B61FF] flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                className="text-white hover:bg-white/10 h-10 w-10 rounded-full"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="hidden md:flex items-center space-x-3 flex-1 max-w-md">
              <span className="text-white/60 text-xs min-w-[40px] text-center">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-white/60 text-xs min-w-[40px] text-center">{formatTime(duration)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDemoMode}
                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                title={isDemoMode ? "تلاش برای پخش واقعی" : "تغییر به حالت دمو"}
              >
                <Radio className={`h-4 w-4 ${isDemoMode ? "text-[#00D4FF]" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(true)}
                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Expanded Player View
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <h3 className="text-white font-semibold">در حال پخش</h3>
                {isDemoMode && (
                  <div className="flex items-center text-sm text-[#00D4FF]">
                    <Radio className="h-4 w-4 mr-1" />
                    <span>حالت دمو</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDemoMode}
                  className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                  title={isDemoMode ? "تلاش برای پخش واقعی" : "تغییر به حالت دمو"}
                >
                  <Radio className={`h-4 w-4 ${isDemoMode ? "text-[#00D4FF]" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
              {/* Large Cover */}
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <Image
                  src={
                    currentTrack.cover_image_hash
                      ? `https://ipfs.io/ipfs/${currentTrack.cover_image_hash}`
                      : "/placeholder.svg?height=320&width=320"
                  }
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  loading="eager"
                  priority
                />
                {/* Playing overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                    <div className="flex space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h1>
                <p className="text-xl text-white/60">{currentTrack.artist_name}</p>
                {isDemoMode && (
                  <div className="mt-2 flex items-center justify-center text-sm text-[#00D4FF]">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>شبیه‌سازی پخش - فایل صوتی واقعی موجود نیست</span>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="w-full mb-8">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-white/60 text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls - Fixed alignment and spacing */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousTrack}
                  className="text-white hover:bg-white/10 h-14 w-14 rounded-full"
                >
                  <SkipBack className="h-7 w-7" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  disabled={isLoading}
                  className="text-white hover:bg-white/10 h-20 w-20 rounded-full bg-[#7B61FF] flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-10 w-10 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-10 w-10" />
                  ) : (
                    <Play className="h-10 w-10 ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  className="text-white hover:bg-white/10 h-14 w-14 rounded-full"
                >
                  <SkipForward className="h-7 w-7" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-3 w-full max-w-xs">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="flex-1" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer for mini player */}
      {!isExpanded && <div className="h-20" />}
    </>
  )
}
