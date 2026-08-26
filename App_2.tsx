import React, { useState, useEffect } from 'react';
import { ActiveView, Book, FilterState } from './types';
import {
  getBooks,
  getBooksReleasingOnDate,
  getThisDayInHistory,
  getFeaturedHistoricalEntry,
  getBooksByAuthors,
} from './services/bookService';
import { useUserPreferences } from './hooks/useUserPreferences';
import { Navbar } from './components/Navbar';
import { TodayView } from './components/TodayView';
import { CalendarView } from './components/CalendarView';
import { ComingThisMonthView } from './components/ComingThisMonthView';
import { WatchlistView } from './components/WatchlistView';
import { CountdownView } from './components/CountdownView';
import { BookDetailModal } from './components/BookDetailModal';
import { FollowedAuthorsModal } from './components/FollowedAuthorsModal';
import { KawaiiStickerBar } from './components/KawaiiStickerBar';
import { NotificationToastBanner } from './components/NotificationToastBanner';
import { notificationService } from './services/notificationService';
import { BookOpen, Calendar, Star, Compass, Layers, Heart, Sparkles, Code, Bell } from 'lucide-react';

export default function App() {
  // Navigation and Route State — Defaults to today's releases
  const [activeView, setActiveView] = useState<ActiveView>('today');
  const [countdownIsbn, setCountdownIsbn] = useState<string | null>(null);

  // Selected Date Anchor: Defaults to Aug 26, 2026 for rich seed dataset compatibility
  const [currentDateStr, setCurrentDateStr] = useState<string>('2026-08-26');

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    genre: null,
    publisher: null,
    format: 'all',
    searchQuery: '',
    onlyFollowedAuthors: false,
    sortBy: 'date-asc',
  });

  // User Local Preferences
  const {
    followedAuthors,
    watchlist,
    anticipated,
    notifiedBooks,
    toggleFollowAuthor,
    isAuthorFollowed,
    toggleWatchlist,
    isInWatchlist,
    isWatchlisted,
    toggleAnticipate,
    isAnticipated,
    toggleNotifyBook,
    isBookNotified,
    notificationPermission,
    requestPermission,
  } = useUserPreferences();

  // Modals State
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null);
  const [isFollowedAuthorsModalOpen, setIsFollowedAuthorsModalOpen] = useState(false);

  // All catalog books
  const allBooks = getBooks();

  // Trigger release day notifications when date or notified books change
  useEffect(() => {
    if (notifiedBooks.length > 0) {
      notificationService.checkDueNotifications(allBooks, notifiedBooks, currentDateStr);
    }
  }, [currentDateStr, notifiedBooks, allBooks]);

  // Parse URL Hash on Load and Hash Change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const [route, param] = hash.split('/');

      if (route === 'countdown' && param) {
        setCountdownIsbn(param);
        setActiveView('countdown');
      } else if (route === 'calendar') {
        setActiveView('calendar');
        if (param) {
          setFilters((prev) => ({ ...prev, genre: decodeURIComponent(param) }));
        }
      } else if (route === 'digest' || route === 'month') {
        setActiveView('digest');
      } else if (route === 'watchlist') {
        setActiveView('watchlist');
      } else if (route === 'today') {
        setActiveView('today');
      } else {
        setActiveView('today');
      }

      // Check for URL search params if present
      const urlParams = new URLSearchParams(window.location.search);
      const genreParam = urlParams.get('genre');
      const publisherParam = urlParams.get('publisher');
      const formatParam = urlParams.get('format');
      if (genreParam || publisherParam || formatParam) {
        setFilters((prev) => ({
          ...prev,
          genre: genreParam || prev.genre,
          publisher: publisherParam || prev.publisher,
          format: (formatParam as any) || prev.format,
        }));
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectView = (view: ActiveView) => {
    setActiveView(view);
    setCountdownIsbn(null);
    window.location.hash = `#/${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      genre: null,
      publisher: null,
      format: 'all',
      searchQuery: '',
      onlyFollowedAuthors: false,
      sortBy: 'date-asc',
    });
  };

  const handleOpenCountdown = (isbn: string) => {
    setCountdownIsbn(isbn);
    setActiveView('countdown');
    window.location.hash = `#/countdown/${isbn}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format active date string for presentation: "Wednesday, August 26, 2026"
  const formattedDateDisplay = (() => {
    try {
      const [y, m, d] = currentDateStr.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return currentDateStr;
    }
  })();

  // Retrieve today's releases from thin data access layer
  const todayReleasing = getBooksReleasingOnDate(
    currentDateStr,
    filters.genre,
    filters.publisher
  ).filter(({ book }) => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.includes(q);
      if (!match) return false;
    }
    if (filters.onlyFollowedAuthors) {
      return isAuthorFollowed(book.author);
    }
    return true;
  });

  // Followed author books releasing today or active in feed
  const followedAuthorsReleases = getBooksByAuthors(followedAuthors);

  // Historical entry for current day/month
  const [cYear, cMonth, cDay] = currentDateStr.split('-').map(Number);
  const historicalEntry = getFeaturedHistoricalEntry(cMonth, cDay);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffbfd] text-[#4a3832]">
      {/* Editorial Announcement Banner */}
      <div className="bg-gradient-to-r from-[#ff85a2] via-[#ffb6ce] to-[#f4b5d6] text-white text-xs py-1.5 px-4 text-center font-kawaii font-semibold flex items-center justify-center gap-2 border-b border-pink-200 shadow-xs">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          <strong>BookBloom:</strong> Kawaii Book Release Calendar, Reading Alarms & Cozy Discoveries 🌸✨
        </span>
      </div>

      {/* Primary Sticky Navigation */}
      <Navbar
        activeView={activeView}
        onSelectView={handleSelectView}
        watchlistCount={watchlist.length}
        followedAuthorsCount={followedAuthors.length}
        notifiedCount={notifiedBooks.length}
        onOpenFollowedAuthors={() => setIsFollowedAuthorsModalOpen(true)}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        currentDateStr={currentDateStr}
        onChangeDate={(d) => setCurrentDateStr(d)}
      />

      {/* In-App Release Day Notification Toast Banner */}
      <NotificationToastBanner
        onOpenBookDetails={(book) => setSelectedBookForModal(book)}
        onOpenCountdown={handleOpenCountdown}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 pb-20">
        {/* ================= STANDARD BOOK VIEWS ================= */}
        {activeView === 'today' && (
          <TodayView
            currentDateStr={currentDateStr}
            currentDateDisplay={formattedDateDisplay}
            releasingBooks={todayReleasing}
            followedAuthorsBooks={followedAuthorsReleases}
            historicalEntry={historicalEntry}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            followedAuthors={followedAuthors}
            isStarred={isInWatchlist}
            onToggleStar={toggleWatchlist}
            isAnticipated={isAnticipated}
            onToggleAnticipate={toggleAnticipate}
            isAuthorFollowed={isAuthorFollowed}
            onToggleFollowAuthor={toggleFollowAuthor}
            isNotified={isBookNotified}
            onToggleNotify={toggleNotifyBook}
            onOpenDetails={(book) => setSelectedBookForModal(book)}
            onOpenCountdown={handleOpenCountdown}
            onNavigateToCalendar={() => handleSelectView('calendar')}
          />
        )}

        {activeView === 'calendar' && (
          <CalendarView
            currentDateStr={currentDateStr}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            followedAuthors={followedAuthors}
            isStarred={isInWatchlist}
            onToggleStar={toggleWatchlist}
            isAnticipated={isAnticipated}
            onToggleAnticipate={toggleAnticipate}
            isAuthorFollowed={isAuthorFollowed}
            onToggleFollowAuthor={toggleFollowAuthor}
            isNotified={isBookNotified}
            onToggleNotify={toggleNotifyBook}
            onOpenDetails={(book) => setSelectedBookForModal(book)}
            onOpenCountdown={handleOpenCountdown}
          />
        )}

        {activeView === 'digest' && (
          <ComingThisMonthView
            currentDateStr={currentDateStr}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            followedAuthors={followedAuthors}
            isStarred={isInWatchlist}
            onToggleStar={toggleWatchlist}
            isAnticipated={isAnticipated}
            onToggleAnticipate={toggleAnticipate}
            isAuthorFollowed={isAuthorFollowed}
            onToggleFollowAuthor={toggleFollowAuthor}
            isNotified={isBookNotified}
            onToggleNotify={toggleNotifyBook}
            onOpenDetails={(book) => setSelectedBookForModal(book)}
            onOpenCountdown={handleOpenCountdown}
          />
        )}

        {activeView === 'watchlist' && (
          <WatchlistView
            currentDateStr={currentDateStr}
            watchlistIds={watchlist}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            followedAuthors={followedAuthors}
            isStarred={isInWatchlist}
            onToggleStar={toggleWatchlist}
            isAnticipated={isAnticipated}
            onToggleAnticipate={toggleAnticipate}
            isAuthorFollowed={isAuthorFollowed}
            onToggleFollowAuthor={toggleFollowAuthor}
            isNotified={isBookNotified}
            onToggleNotify={toggleNotifyBook}
            onOpenDetails={(book) => setSelectedBookForModal(book)}
            onOpenCountdown={handleOpenCountdown}
            onNavigateToExplore={() => handleSelectView('today')}
          />
        )}

        {activeView === 'countdown' && countdownIsbn && (
          <CountdownView
            isbn={countdownIsbn}
            onBack={() => handleSelectView('today')}
            isStarred={Boolean(
              getBooks({ searchQuery: countdownIsbn })[0] &&
                isInWatchlist(getBooks({ searchQuery: countdownIsbn })[0].id)
            )}
            onToggleStar={(id) => toggleWatchlist(id)}
            isAnticipated={Boolean(
              getBooks({ searchQuery: countdownIsbn })[0] &&
                isAnticipated(getBooks({ searchQuery: countdownIsbn })[0].id)
            )}
            onToggleAnticipate={(id) => toggleAnticipate(id)}
            onToggleFollowAuthor={toggleFollowAuthor}
            isAuthorFollowed={
              Boolean(getBooks({ searchQuery: countdownIsbn })[0]) &&
              isAuthorFollowed(getBooks({ searchQuery: countdownIsbn })[0]?.author || '')
            }
            isNotified={Boolean(
              getBooks({ searchQuery: countdownIsbn })[0] &&
                isBookNotified(getBooks({ searchQuery: countdownIsbn })[0].id)
            )}
            onToggleNotify={(id) => toggleNotifyBook(id)}
          />
        )}
      </main>

      {/* Floating Kawaii Sticker & Audio Sound Bar */}
      <KawaiiStickerBar />

      {/* Global Book Details Modal */}
      <BookDetailModal
        book={selectedBookForModal}
        onClose={() => setSelectedBookForModal(null)}
        isStarred={Boolean(selectedBookForModal && isInWatchlist(selectedBookForModal.id))}
        onToggleStar={toggleWatchlist}
        isAnticipated={Boolean(selectedBookForModal && isAnticipated(selectedBookForModal.id))}
        onToggleAnticipate={toggleAnticipate}
        isAuthorFollowed={Boolean(
          selectedBookForModal && isAuthorFollowed(selectedBookForModal.author)
        )}
        onToggleFollowAuthor={toggleFollowAuthor}
        isNotified={Boolean(selectedBookForModal && isBookNotified(selectedBookForModal.id))}
        onToggleNotify={toggleNotifyBook}
        onOpenCountdown={handleOpenCountdown}
      />

      {/* Followed Authors Drawer/Modal */}
      <FollowedAuthorsModal
        isOpen={isFollowedAuthorsModalOpen}
        onClose={() => setIsFollowedAuthorsModalOpen(false)}
        followedAuthors={followedAuthors}
        onToggleFollowAuthor={toggleFollowAuthor}
        onOpenBookDetails={(b) => setSelectedBookForModal(b)}
      />

      {/* Cute Editorial Footer */}
      <footer className="mt-16 bg-[#fff0f5] border-t border-[#ffd6e6] py-12 text-[#6d5045]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff85a2] to-[#ffb6ce] text-white flex items-center justify-center text-xs shadow-xs">
                  🌸
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-kawaii text-xl font-bold text-[#d63384]">BookBloom</span>
                </div>
              </div>
              <p className="text-xs text-[#6d5045] max-w-sm leading-relaxed font-cute">
                A kawaii reader-first book release calendar, cozy alarms, format roadmap, and preorder discovery nook.
                Bridging authors, independent presses, and book lovers.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-kawaii uppercase tracking-wider text-[#d63384] mb-2.5 font-bold">
                Navigation 🌸
              </h4>
              <ul className="space-y-1.5 text-xs font-cute">
                <li>
                  <button
                    onClick={() => handleSelectView('today')}
                    className="hover:text-[#d63384] transition-colors"
                  >
                    🌸 Releasing Today
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSelectView('calendar')}
                    className="hover:text-[#d63384] transition-colors"
                  >
                    📅 Catalog Calendar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSelectView('digest')}
                    className="hover:text-[#d63384] transition-colors"
                  >
                    📚 This Month's Books
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSelectView('watchlist')}
                    className="hover:text-[#d63384] transition-colors"
                  >
                    💖 Wishlist & Watchlist
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-kawaii uppercase tracking-wider text-[#d63384] mb-2.5 font-bold">
                Release Data
              </h4>
              <p className="text-xs text-[#6d5045] leading-relaxed mb-2 font-cute">
                Hand-curated release dates with audiobooks, hardcovers, and paperbacks.
              </p>
              <div className="text-[11px] font-mono text-[#d63384]">
                <span>Schema: </span>
                <span className="font-semibold">ADD_BOOKS.md</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#ffd6e6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c6b61] font-cute">
            <div>© {new Date().getFullYear()} BookBloom 🌸. Happy Reading!</div>
            <div className="flex items-center gap-4 text-[#8c6b61]">
              <span>Goodreads & StoryGraph ISBN Sync</span>
              <span>·</span>
              <span>Audio Chimes & Synthesizers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
