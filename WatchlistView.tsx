import React, { useState } from 'react';
import { Book, FilterState } from '../types';
import { calculateDaysUntil, getBookById } from '../services/bookService';
import { BookCard } from './BookCard';
import {
  Star,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface WatchlistViewProps {
  currentDateStr: string; // e.g. "2026-08-26"
  watchlistIds: string[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  followedAuthors: string[];
  isStarred: (id: string) => boolean;
  onToggleStar: (id: string) => void;
  isAnticipated: (id: string) => boolean;
  onToggleAnticipate: (id: string) => void;
  isAuthorFollowed: (author: string) => boolean;
  onToggleFollowAuthor: (author: string) => void;
  onOpenDetails: (book: Book) => void;
  onOpenCountdown: (isbn: string) => void;
  onNavigateToExplore: () => void;
  isNotified?: (id: string) => boolean;
  onToggleNotify?: (id: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  currentDateStr,
  watchlistIds,
  filters,
  onFilterChange,
  onResetFilters,
  followedAuthors,
  isStarred,
  onToggleStar,
  isAnticipated,
  onToggleAnticipate,
  isAuthorFollowed,
  onToggleFollowAuthor,
  onOpenDetails,
  onOpenCountdown,
  onNavigateToExplore,
  isNotified = (_id: string) => false,
  onToggleNotify,
}) => {
  const [copiedList, setCopiedList] = useState(false);

  // Retrieve book objects
  const watchlistBooks: { book: Book; daysUntil: number }[] = watchlistIds
    .map((id) => getBookById(id))
    .filter((b): b is Book => Boolean(b))
    .map((book) => {
      // Earliest upcoming format release date
      const futureDates = book.formats.map((f) => f.releaseDate);
      const earliestDate = futureDates.sort()[0] || book.primaryReleaseDate;
      const daysUntil = calculateDaysUntil(earliestDate, currentDateStr);
      return { book, daysUntil };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // Filter by genre/search if user selected
  const filteredBooks = watchlistBooks.filter(({ book }) => {
    if (filters.genre && !book.genreTags.some((g) => g.toLowerCase() === filters.genre?.toLowerCase())) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.includes(q)
      );
    }
    return true;
  });

  // Categorize by release proximity
  const releasingToday = filteredBooks.filter((item) => item.daysUntil === 0);
  const next7Days = filteredBooks.filter((item) => item.daysUntil > 0 && item.daysUntil <= 7);
  const thisMonth = filteredBooks.filter((item) => item.daysUntil > 7 && item.daysUntil <= 30);
  const futureReleases = filteredBooks.filter((item) => item.daysUntil > 30);
  const pastReleases = filteredBooks.filter((item) => item.daysUntil < 0);

  const handleExportWatchlist = () => {
    if (watchlistBooks.length === 0) return;
    const lines = [
      `🌸 My BookBloom Watchlist (${watchlistBooks.length} titles)`,
      `==============================================`,
    ];
    watchlistBooks.forEach(({ book, daysUntil }, i) => {
      const countdownText =
        daysUntil === 0
          ? '🎉 RELEASING TODAY!'
          : daysUntil > 0
          ? `In ${daysUntil} days (${book.primaryReleaseDate})`
          : `Released on ${book.primaryReleaseDate}`;
      lines.push(`${i + 1}. "${book.title}" by ${book.author}`);
      lines.push(`   Status: ${countdownText}`);
      lines.push(`   Publisher: ${book.publisher} | ISBN: ${book.isbn}`);
      lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#e8e4dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#b85d38] uppercase tracking-wider mb-1.5">
            <Star className="w-3.5 h-3.5 fill-[#b85d38]" />
            <span>Personal Watchlist</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1c20] tracking-tight">
            My Saved Titles ({watchlistBooks.length})
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Personal release tracker sorted by days-until-release with closest arrivals highlighted.
          </p>
        </div>

        {/* Export Watchlist Action */}
        {watchlistBooks.length > 0 && (
          <button
            onClick={handleExportWatchlist}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#faf8f5] hover:bg-[#f0ebe1] text-neutral-800 rounded-lg border border-[#e8e4dc] transition-colors self-start md:self-auto"
          >
            {copiedList ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Watchlist Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export Watchlist</span>
              </>
            )}
          </button>
        )}
      </div>

      {watchlistBooks.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-2xl border border-dashed border-[#d8d4cb] max-w-2xl mx-auto my-8">
          <Star className="w-12 h-12 text-[#d8d4cb] mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Your Watchlist is empty</h2>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
            Click the "Remind Me" / Star button on any book in the Today feed, Calendar, or Weekly Digest to track upcoming publication dates here.
          </p>
          <button
            onClick={onNavigateToExplore}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-[#1c1d22] text-white rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <span>Explore Today's Releases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Releasing Today Group */}
          {releasingToday.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#fed7aa]">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ea580c] text-white">
                  🎉 RELEASING TODAY
                </span>
                <span className="text-xs text-neutral-500">
                  {releasingToday.length} {releasingToday.length === 1 ? 'title' : 'titles'}
                </span>
              </div>
              <div className="space-y-4">
                {releasingToday.map(({ book }) => (
                  <div key={book.id} className="relative">
                    <BookCard
                      book={book}
                      isStarred={isStarred(book.id)}
                      onToggleStar={onToggleStar}
                      isAnticipated={isAnticipated(book.id)}
                      onToggleAnticipate={onToggleAnticipate}
                      isAuthorFollowed={isAuthorFollowed(book.author)}
                      onToggleFollowAuthor={onToggleFollowAuthor}
                      isNotified={isNotified(book.id)}
                      onToggleNotify={onToggleNotify}
                      onOpenDetails={onOpenDetails}
                      onOpenCountdown={onOpenCountdown}
                      highlightDate={currentDateStr}
                      selectedFormat={filters.format}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next 7 Days Group (Urgent / Imminent) */}
          {next7Days.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#fde68a]">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#d97706] text-white">
                  ⚡ RELEASING IN THE NEXT 7 DAYS
                </span>
                <span className="text-xs text-neutral-500">
                  {next7Days.length} {next7Days.length === 1 ? 'title' : 'titles'}
                </span>
              </div>
              <div className="space-y-4">
                {next7Days.map(({ book, daysUntil }) => (
                  <div key={book.id} className="relative">
                    <div className="absolute top-2 right-4 z-10 hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                      <Clock className="w-3 h-3" />
                      <span>Releases in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}</span>
                    </div>
                    <BookCard
                      book={book}
                      isStarred={isStarred(book.id)}
                      onToggleStar={onToggleStar}
                      isAnticipated={isAnticipated(book.id)}
                      onToggleAnticipate={onToggleAnticipate}
                      isAuthorFollowed={isAuthorFollowed(book.author)}
                      onToggleFollowAuthor={onToggleFollowAuthor}
                      isNotified={isNotified(book.id)}
                      onToggleNotify={onToggleNotify}
                      onOpenDetails={onOpenDetails}
                      onOpenCountdown={onOpenCountdown}
                      highlightDate={currentDateStr}
                      selectedFormat={filters.format}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* This Month Group (8 - 30 Days) */}
          {thisMonth.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#e8e4dc]">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#f5f4f0] text-neutral-800 border border-[#e8e4dc]">
                  🗓️ COMING THIS MONTH (8–30 DAYS)
                </span>
                <span className="text-xs text-neutral-500">
                  {thisMonth.length} {thisMonth.length === 1 ? 'title' : 'titles'}
                </span>
              </div>
              <div className="space-y-4">
                {thisMonth.map(({ book, daysUntil }) => (
                  <div key={book.id} className="relative">
                    <div className="absolute top-2 right-4 z-10 hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-neutral-600 bg-[#f5f4f0] border border-[#e8e4dc]">
                      <Clock className="w-3 h-3" />
                      <span>In {daysUntil} days</span>
                    </div>
                    <BookCard
                      book={book}
                      isStarred={isStarred(book.id)}
                      onToggleStar={onToggleStar}
                      isAnticipated={isAnticipated(book.id)}
                      onToggleAnticipate={onToggleAnticipate}
                      isAuthorFollowed={isAuthorFollowed(book.author)}
                      onToggleFollowAuthor={onToggleFollowAuthor}
                      isNotified={isNotified(book.id)}
                      onToggleNotify={onToggleNotify}
                      onOpenDetails={onOpenDetails}
                      onOpenCountdown={onOpenCountdown}
                      highlightDate={currentDateStr}
                      selectedFormat={filters.format}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Future Releases Group (> 30 Days) */}
          {futureReleases.length > 0 && (
            <section>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#e8e4dc]">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#f5f4f0] text-neutral-800 border border-[#e8e4dc]">
                  🔮 LATER RELEASES (30+ DAYS)
                </span>
                <span className="text-xs text-neutral-500">
                  {futureReleases.length} {futureReleases.length === 1 ? 'title' : 'titles'}
                </span>
              </div>
              <div className="space-y-4">
                {futureReleases.map(({ book, daysUntil }) => (
                  <div key={book.id} className="relative">
                    <div className="absolute top-2 right-4 z-10 hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-neutral-500 bg-[#faf8f5] border border-neutral-200">
                      <span>In {daysUntil} days</span>
                    </div>
                    <BookCard
                      book={book}
                      isStarred={isStarred(book.id)}
                      onToggleStar={onToggleStar}
                      isAnticipated={isAnticipated(book.id)}
                      onToggleAnticipate={onToggleAnticipate}
                      isAuthorFollowed={isAuthorFollowed(book.author)}
                      onToggleFollowAuthor={onToggleFollowAuthor}
                      isNotified={isNotified(book.id)}
                      onToggleNotify={onToggleNotify}
                      onOpenDetails={onOpenDetails}
                      onOpenCountdown={onOpenCountdown}
                      highlightDate={currentDateStr}
                      selectedFormat={filters.format}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Past Releases Group */}
          {pastReleases.length > 0 && (
            <section className="opacity-80">
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#e8e4dc]">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#faf8f5] text-neutral-600 border border-neutral-200">
                  ✓ ALREADY RELEASED
                </span>
                <span className="text-xs text-neutral-500">
                  {pastReleases.length} {pastReleases.length === 1 ? 'title' : 'titles'}
                </span>
              </div>
              <div className="space-y-4">
                {pastReleases.map(({ book }) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isStarred={isStarred(book.id)}
                    onToggleStar={onToggleStar}
                    isAnticipated={isAnticipated(book.id)}
                    onToggleAnticipate={onToggleAnticipate}
                    isAuthorFollowed={isAuthorFollowed(book.author)}
                    onToggleFollowAuthor={onToggleFollowAuthor}
                    isNotified={isNotified(book.id)}
                    onToggleNotify={onToggleNotify}
                    onOpenDetails={onOpenDetails}
                    onOpenCountdown={onOpenCountdown}
                    highlightDate={currentDateStr}
                    selectedFormat={filters.format}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
