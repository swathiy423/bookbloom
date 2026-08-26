import { useState, useEffect } from 'react';
import { notificationService, NotificationStatus } from '../services/notificationService';

const STORAGE_KEYS = {
  FOLLOWED_AUTHORS: 'releaseday_followed_authors',
  WATCHLIST: 'releaseday_watchlist',
  ANTICIPATED: 'releaseday_anticipated',
  NOTIFIED_BOOKS: 'releaseday_notified_books',
};

export function useUserPreferences() {
  const [followedAuthors, setFollowedAuthors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWED_AUTHORS);
      return saved ? JSON.parse(saved) : ['Rebecca Yarros', 'Brandon Sanderson'];
    } catch {
      return ['Rebecca Yarros', 'Brandon Sanderson'];
    }
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return saved ? JSON.parse(saved) : ['book-001', 'book-003', 'book-010', 'book-014'];
    } catch {
      return ['book-001', 'book-003', 'book-010', 'book-014'];
    }
  });

  const [anticipated, setAnticipated] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANTICIPATED);
      return saved ? JSON.parse(saved) : ['book-001', 'book-004'];
    } catch {
      return ['book-001', 'book-004'];
    }
  });

  // Books with active release day notifications
  const [notifiedBooks, setNotifiedBooks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFIED_BOOKS);
      return saved ? JSON.parse(saved) : ['book-001', 'book-003'];
    } catch {
      return ['book-001', 'book-003'];
    }
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationStatus>(() => {
    try {
      return notificationService.getPermissionStatus();
    } catch {
      return 'default';
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOWED_AUTHORS, JSON.stringify(followedAuthors));
    } catch (e) {
      console.warn('Failed to save followed authors', e);
    }
  }, [followedAuthors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist', e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANTICIPATED, JSON.stringify(anticipated));
    } catch (e) {
      console.warn('Failed to save anticipated books', e);
    }
  }, [anticipated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFIED_BOOKS, JSON.stringify(notifiedBooks));
    } catch (e) {
      console.warn('Failed to save notified books', e);
    }
  }, [notifiedBooks]);

  const toggleFollowAuthor = (authorName: string) => {
    setFollowedAuthors((prev) => {
      const clean = authorName.trim();
      if (prev.some((a) => a.toLowerCase() === clean.toLowerCase())) {
        return prev.filter((a) => a.toLowerCase() !== clean.toLowerCase());
      } else {
        return [...prev, clean];
      }
    });
  };

  const isAuthorFollowed = (authorName: string): boolean => {
    return followedAuthors.some((a) => a.toLowerCase() === authorName.trim().toLowerCase());
  };

  const toggleWatchlist = (bookId: string) => {
    setWatchlist((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const isInWatchlist = (bookId: string): boolean => {
    return watchlist.includes(bookId);
  };

  const toggleAnticipate = (bookId: string) => {
    setAnticipated((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const isAnticipated = (bookId: string): boolean => {
    return anticipated.includes(bookId);
  };

  const toggleNotifyBook = async (bookId: string) => {
    // If not granted yet, ask for permission when enabling
    if (!notifiedBooks.includes(bookId) && notificationPermission === 'default') {
      const perm = await notificationService.requestPermission();
      setNotificationPermission(perm);
    }

    setNotifiedBooks((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const isBookNotified = (bookId: string): boolean => {
    return notifiedBooks.includes(bookId);
  };

  const requestPermission = async () => {
    const perm = await notificationService.requestPermission();
    setNotificationPermission(perm);
    return perm;
  };

  return {
    followedAuthors,
    watchlist,
    anticipated,
    notifiedBooks,
    notificationPermission,
    toggleFollowAuthor,
    isAuthorFollowed,
    toggleWatchlist,
    isInWatchlist,
    isWatchlisted: isInWatchlist,
    toggleAnticipate,
    isAnticipated,
    toggleNotifyBook,
    isBookNotified,
    requestPermission,
  };
}
