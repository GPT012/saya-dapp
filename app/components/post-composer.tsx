import { Button } from "@/components/ui/button"

export function PostComposer() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200"></div>
      <div className="flex-1">
        <div className="rounded-lg border border-gray-200 px-4 py-2 text-gray-500">Sign in to post...</div>
      </div>
      <Button className="rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300">Post</Button>
    </div>
  )
}
