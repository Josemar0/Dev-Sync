export type BookmarkRecord = {
  user_id: string
  item_id: string
  item_type: "project"
  title: string
  description: string
  owner_name?: string
  created_at?: string
  saved_at: string
}

const BOOKMARKS_STORAGE_KEY = "devsync_project_bookmarks_v1"

function readBookmarks(): BookmarkRecord[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as BookmarkRecord[]
  } catch {
    return []
  }
}

function writeBookmarks(records: BookmarkRecord[]): void {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(records))
}

export function getBookmarksByUser(userId: string): BookmarkRecord[] {
  const list = readBookmarks().filter((b) => b.user_id === userId)
  return [...list].sort((a, b) => b.saved_at.localeCompare(a.saved_at))
}

export function getBookmarkByUserAndItem(
  userId: string,
  itemId: string,
): BookmarkRecord | undefined {
  return readBookmarks().find((b) => b.user_id === userId && b.item_id === itemId)
}

export function upsertBookmark(
  bookmark: Omit<BookmarkRecord, "saved_at"> & { saved_at?: string },
): BookmarkRecord {
  const all = readBookmarks()
  const next: BookmarkRecord = {
    ...bookmark,
    saved_at: new Date().toISOString(),
  }
  const filtered = all.filter(
    (b) => !(b.user_id === bookmark.user_id && b.item_id === bookmark.item_id),
  )
  const records = [next, ...filtered]
  writeBookmarks(records)
  return next
}

export function removeBookmark(userId: string, itemId: string): void {
  const all = readBookmarks()
  const records = all.filter((b) => !(b.user_id === userId && b.item_id === itemId))
  writeBookmarks(records)
}

export function clearBookmarks(userId: string): void {
  const all = readBookmarks()
  const records = all.filter((b) => b.user_id !== userId)
  writeBookmarks(records)
}

