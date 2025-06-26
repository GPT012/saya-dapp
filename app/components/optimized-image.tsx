"use client"

import Image from "next/image"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        className={`bg-white/10 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-white/40 text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-white/20 rounded"></div>
          <div className="text-xs">تصویر یافت نشد</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={fill ? {} : { width, height }}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-white/10 flex items-center justify-center z-10"
          style={fill ? {} : { width, height }}
        >
          <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}
