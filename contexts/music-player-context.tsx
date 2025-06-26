"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { Track } from "@/lib/supabase"

interface MusicPlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  isDemoMode: boolean
  playTrack: (track: Track) => Promise<void>
  pauseTrack: () => void
  resumeTrack: () => Promise<void>
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  playlist: Track[]
  setPlaylist: (tracks: Track[]) => void
  toggleDemoMode: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isLoading: false,
  isDemoMode: true,
  playTrack: async () => {},
  pauseTrack: () => {},
  resumeTrack: async () => {},
  seekTo: () => {},
  setVolume: () => {},
  nextTrack: async () => {},
  previousTrack: async () => {},
  playlist: [],
  setPlaylist: () => {},
  toggleDemoMode: () => {},
})

export const useMusicPlayer = () => useContext(MusicPlayerContext)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Demo mode simulation
  useEffect(() => {
    if (!isMounted) return

    if (isDemoMode && isPlaying && currentTrack) {
      const trackDuration = currentTrack.duration || 180
      setDuration(trackDuration)

      demoIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= trackDuration - 1) {
            setIsPlaying(false)
            setTimeout(() => nextTrack(), 1000)
            return trackDuration
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current)
      }
    }

    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current)
      }
    }
  }, [isMounted, isDemoMode, isPlaying, currentTrack])

  const playTrack = async (track: Track) => {
    setCurrentTrack(track)
    setCurrentTime(0)

    if (isDemoMode) {
      setIsLoading(true)
      setDuration(track.duration || 180)

      setTimeout(() => {
        setIsLoading(false)
        setIsPlaying(true)
      }, 800)
      return
    }

    // Real audio mode would go here
    setIsDemoMode(true)
    setTimeout(() => playTrack(track), 100)
  }

  const pauseTrack = () => {
    setIsPlaying(false)
  }

  const resumeTrack = async () => {
    if (currentTrack) {
      setIsPlaying(true)
    }
  }

  const seekTo = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)))
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
  }

  const nextTrack = async () => {
    if (!currentTrack || playlist.length === 0) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    await playTrack(playlist[nextIndex])
  }

  const previousTrack = async () => {
    if (!currentTrack || playlist.length === 0) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    await playTrack(playlist[prevIndex])
  }

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode)
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(false)
  }

  if (!isMounted) {
    return (
      <MusicPlayerContext.Provider
        value={{
          currentTrack: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          volume: 0.7,
          isLoading: false,
          isDemoMode: true,
          playTrack: async () => {},
          pauseTrack: () => {},
          resumeTrack: async () => {},
          seekTo: () => {},
          setVolume: () => {},
          nextTrack: async () => {},
          previousTrack: async () => {},
          playlist: [],
          setPlaylist: () => {},
          toggleDemoMode: () => {},
        }}
      >
        {children}
      </MusicPlayerContext.Provider>
    )
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isLoading,
        isDemoMode,
        playTrack,
        pauseTrack,
        resumeTrack,
        seekTo,
        setVolume,
        nextTrack,
        previousTrack,
        playlist,
        setPlaylist,
        toggleDemoMode,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}
