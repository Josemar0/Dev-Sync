import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bookmark, Trash2 } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  clearBookmarksForUser,
  deleteBookmark,
  listBookmarksByUser,
} from "@/lib/bookmark-api"
import { type BookmarkRecord } from "@/lib/bookmarks"
import { useAuth } from "@/lib/auth-context"
import { formatTimeAgo } from "@/lib/datetime-display"

export function BookmarksPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([])

  useEffect(() => {
    if (!user?.id) return
    void listBookmarksByUser(user.id).then(setBookmarks)
  }, [user?.id])

  const refresh = async () => {
    if (!user?.id) return
    setBookmarks(await listBookmarksByUser(user.id))
  }

  const handleRemove = (itemId: string) => {
    if (!user?.id) return
    void deleteBookmark(user.id, itemId).then(refresh)
  }

  const handleClearAll = () => {
    if (!user?.id) return
    void clearBookmarksForUser(user.id).then(refresh)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">My Bookmarks</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearAll} disabled={bookmarks.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </div>

          {bookmarks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No bookmarked projects yet. Open a project and click Bookmark.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <Card key={`${bookmark.user_id}-${bookmark.item_id}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      <Link to={`/project/${bookmark.item_id}`} className="hover:text-primary">
                        {bookmark.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{bookmark.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {bookmark.owner_name ? `by ${bookmark.owner_name} · ` : ""}
                        saved {formatTimeAgo(bookmark.saved_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(bookmark.item_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}

