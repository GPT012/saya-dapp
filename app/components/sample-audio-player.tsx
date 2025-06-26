"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2 } from "lucide-react"

interface SampleAudioPlayerProps {
  title: string
  artist: string
  duration: number
}

export function SampleAudioPlayer({ title, artist, duration }: SampleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate audio playback since we don't have real audio files
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, duration])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-white font-medium">{title}</h4>
          <p className="text-white/60 text-sm">{artist}</p>
        </div>
        <Button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-[#7B61FF] hover:bg-[#7B61FF]/80">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-3">
        {/* Progress */}
        <div className="space-y-1">
          <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} />
          <div className="flex justify-between text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-white/60" />
          <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="flex-1" />
        </div>
      </div>
    </div>
  )
}
