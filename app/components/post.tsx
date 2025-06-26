import { Heart, MessageCircle, Repeat2, Share2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PostProps {
  artist: string
  verified?: boolean
  time: string
  title: string
  minted: number
  comments: number
  reposts: number
  likes: number
}

export function Post({ artist, verified = false, time, title, minted, comments, reposts, likes }: PostProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-800"></div>
        <Link href="#" className="mr-1 font-medium hover:underline">
          {artist}
        </Link>
        {verified && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-4 w-4 text-pink-500"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        )}
        <span className="text-sm text-gray-500">· {time}</span>
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-900 text-white">
        <div className="p-4">
          <div className="text-sm">{artist}</div>
          <div className="text-lg font-medium">{title}</div>
          <div className="mt-1 text-xs text-gray-400">{minted} minted</div>
        </div>
        <div className="flex justify-between border-t border-gray-800 p-2">
          <div></div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-full bg-gray-800 text-white hover:bg-gray-700">
              Collect
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 p-0 text-white hover:bg-gray-700"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <Repeat2 className="h-4 w-4" />
            <span className="text-xs">{reposts}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{likes}</span>
          </button>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Comment example */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex">
          <div className="mr-3 h-8 w-8 flex-shrink-0 rounded-full bg-gray-200"></div>
          <div>
            <div className="flex items-center">
              <Link href="#" className="mr-2 text-sm font-medium hover:underline">
                jefferson dener
              </Link>
              <span className="text-xs text-gray-500">· 38m</span>
            </div>
            <p className="text-sm">nice</p>
            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
              <button className="hover:text-gray-700">0</button>
              <button className="hover:text-gray-700">Reply</button>
            </div>
            <button className="mt-2 text-xs text-gray-500 hover:text-gray-700">View 1 reply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
