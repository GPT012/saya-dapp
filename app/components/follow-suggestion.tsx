import { Button } from "@/components/ui/button"

export function FollowSuggestion() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-3 h-10 w-10 rounded-full bg-gray-200"></div>
        <div>
          <div className="text-sm font-medium">Artist Name</div>
          <div className="text-xs text-gray-500">@artistname</div>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">
        Follow
      </Button>
    </div>
  )
}
