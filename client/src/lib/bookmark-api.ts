import {
  clearBookmarks as clearBookmarkStore,
  getBookmarkByUserAndItem,
  getBookmarksByUser,
  removeBookmark as removeBookmarkStore,
  upsertBookmark,
  type BookmarkRecord,
} from "@/lib/bookmarks"

export const bookmarkEndpoints = {
  list: (userId: string) => `/bookmarks/users/${encodeURIComponent(userId)}`,
  item: (userId: string, itemId: string) =>
    `/bookmarks/users/${encodeURIComponent(userId)}/items/${encodeURIComponent(itemId)}`,
} as const

export type SaveProjectBookmarkInput = {
  user_id: string
  item_id: string
  title: string
  description: string
  owner_name?: string
  created_at?: string
}

export async function listBookmarksByUser(userId: string): Promise<BookmarkRecord[]> {
  // GET /bookmarks/users/:userId
  return getBookmarksByUser(userId)
}

export async function isBookmarkedByUserAndItem(
  userId: string,
  itemId: string,
): Promise<boolean> {
  // GET /bookmarks/users/:userId/items/:itemId
  return Boolean(getBookmarkByUserAndItem(userId, itemId))
}

export async function saveProjectBookmark(
  input: SaveProjectBookmarkInput,
): Promise<BookmarkRecord> {
  // PUT /bookmarks/users/:userId/items/:itemId
  return upsertBookmark({
    user_id: input.user_id,
    item_id: input.item_id,
    item_type: "project",
    title: input.title,
    description: input.description,
    owner_name: input.owner_name,
    created_at: input.created_at,
  })
}

export async function deleteBookmark(userId: string, itemId: string): Promise<void> {
  // DELETE /bookmarks/users/:userId/items/:itemId
  removeBookmarkStore(userId, itemId)
}

export async function clearBookmarksForUser(userId: string): Promise<void> {
  // DELETE /bookmarks/users/:userId
  clearBookmarkStore(userId)
}

