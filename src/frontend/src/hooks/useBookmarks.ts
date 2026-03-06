import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "stemonef_bookmarks";

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadFromStorage());

  // Sync to localStorage on every change
  useEffect(() => {
    saveToStorage(bookmarks);
  }, [bookmarks]);

  const addBookmark = useCallback((id: string) => {
    setBookmarks((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b !== id));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.includes(id),
    [bookmarks],
  );

  const clearAll = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAll,
    count: bookmarks.length,
  };
}
