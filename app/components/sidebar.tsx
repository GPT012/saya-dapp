import Link from "next/link"
import { Home, BarChart2, Globe, Bell, User } from "lucide-react"

export function Sidebar() {
  return (
    <div className="sticky top-0 flex h-screen w-60 flex-col border-r border-gray-200 bg-white p-4">
      <Link href="/" className="mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
          <span className="text-xl font-bold text-white">S</span>
        </div>
      </Link>

      <nav className="space-y-1">
        <Link href="/" className="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100">
          <Home className="mr-3 h-5 w-5" />
          <span className="font-medium">Home</span>
        </Link>
        <Link href="/viral-sounds" className="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100">
          <BarChart2 className="mr-3 h-5 w-5" />
          <span className="font-medium">Viral Sounds</span>
        </Link>
        <Link href="/explore" className="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100">
          <Globe className="mr-3 h-5 w-5" />
          <span className="font-medium">Explore</span>
        </Link>
        <Link href="/notifications" className="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100">
          <Bell className="mr-3 h-5 w-5" />
          <span className="font-medium">Notifications</span>
        </Link>
        <Link href="/profile" className="flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100">
          <User className="mr-3 h-5 w-5" />
          <span className="font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  )
}
