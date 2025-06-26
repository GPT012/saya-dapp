import Image from "next/image"
import Link from "next/link"

interface SoundCardProps {
  number: number
  image: string
  artist: string
  title: string
  posts: number
}

export function SoundCard({ number, image, artist, title, posts }: SoundCardProps) {
  return (
    <Link href="#" className="group relative block overflow-hidden rounded-lg">
      <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
        {number}
      </div>
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-2">
        <div className="text-xs font-semibold uppercase text-gray-500">{artist}</div>
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="mt-1 flex items-center">
          <div className="flex -space-x-1">
            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
            <div className="h-4 w-4 rounded-full bg-gray-400"></div>
            <div className="h-4 w-4 rounded-full bg-gray-500"></div>
          </div>
          <span className="ml-1 text-xs text-gray-500">{posts} posts</span>
        </div>
      </div>
    </Link>
  )
}
