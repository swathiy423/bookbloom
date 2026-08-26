import React from 'react';
import { Book, FilterState, PublishingHistoryEntry } from '../types';
import { BookCard } from './BookCard';
import { PublishingHistoryWidget } from './PublishingHistoryWidget';
import { FilterBar } from './FilterBar';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Users,
  BookOpen,
  ArrowRight,
  Headphones,
  FileText,
  Bookmark,
  BookMarked,
  Layers,
} from 'lucide-react';

interface TodayViewProps {
  currentDateStr: string; // "2026-08-26"
  currentDateDisplay: string; // "Wednesday, August 26, 2026"
  releasingBooks: { book: Book; releasingFormats: any[] }[];
  followedAuthorsBooks: Book[];
  historicalEntry?: PublishingHistoryEntry;
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
  onNavigateToCalendar: () => void;
  isNotified?: (id: string) => boolean;
  onToggleNotify?: (id: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  currentDateStr,
  currentDateDisplay,
  releasingBooks,
  followedAuthorsBooks,
  historicalEntry,
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
  onNavigateToCalendar,
  isNotified = (_id: string) => false,
  onToggleNotify,
}) => {
  // Calculate today's format totals
  const formatCounts = releasingBooks.reduce(
    (acc, item) => {
      item.releasingFormats.forEach((f) => {
        if (f.type in acc) acc[f.type as keyof typeof acc]++;
      });
      return acc;
    },
    { hardcover: 0, paperback: 0, ebook: 0, audiobook: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Date & Feed Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#e8e4dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#b85d38] uppercase tracking-wider mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Publishing Today</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1c20] tracking-tight">
            {currentDateDisplay}
          </h1>
          <p className="text-sm md:text-base text-neutral-600 mt-1 max-w-2xl">
            Verified new literary releases arriving in bookstores and digital feeds today.
          </p>
        </div>

        {/* Format Count Snapshot Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-[#f5f4f0] p-2 rounded-xl border border-[#e8e4dc]">
          <span className="text-neutral-500 font-sans text-[11px] font-medium mr-1">Formats arriving:</span>
          {formatCounts.hardcover > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-neutral-800 border border-neutral-200">
              <BookMarked className="w-3 h-3 text-[#b85d38]" />
              <strong>{formatCounts.hardcover}</strong> Hardcover
            </span>
          )}
          {formatCounts.audiobook > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-neutral-800 border border-neutral-200">
              <Headphones className="w-3 h-3 text-[#2d6a4f]" />
              <strong>{formatCounts.audiobook}</strong> Audio
            </span>
          )}
          {formatCounts.ebook > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-neutral-800 border border-neutral-200">
              <FileText className="w-3 h-3 text-[#1e3a5f]" />
              <strong>{formatCounts.ebook}</strong> eBook
            </span>
          )}
          {formatCounts.paperback > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-neutral-800 border border-neutral-200">
              <Bookmark className="w-3 h-3 text-[#92400e]" />
              <strong>{formatCounts.paperback}</strong> Paperback
            </span>
          )}
        </div>
      </div>

      {/* This Day in Publishing History Module */}
      {historicalEntry && (
        <PublishingHistoryWidget
          entry={historicalEntry}
          currentDateDisplay={currentDateDisplay}
        />
      )}

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        followedAuthorsCount={followedAuthors.length}
      />

      {/* Followed Authors Alert Section (if any followed author books exist) */}
      {followedAuthorsBooks.length > 0 && !filters.onlyFollowedAuthors && (
        <section aria-label="Followed authors section" className="mb-8 p-4 md:p-5 bg-[#eef5ee] rounded-xl border border-[#c3dfc9]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#2d6a4f] text-white">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1b4332]">
                  New Releases from Authors You Follow
                </h3>
                <p className="text-xs text-[#2d6a4f]">
                  Surfaced from your author watch alerts ({followedAuthors.length} followed)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {followedAuthorsBooks.map((book) => (
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

      {/* Today's Full Releases Feed */}
      <section aria-label="Today's releases list">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-[#1a1c20]">
            Today's Releases ({releasingBooks.length})
          </h2>
          <button
            onClick={onNavigateToCalendar}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#b85d38] hover:underline"
          >
            <span>View Month Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {releasingBooks.length > 0 ? (
          <div className="space-y-4">
            {releasingBooks.map(({ book }) => (
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
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-[#d8d4cb]">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-neutral-800">
              No matching releases today with current filters
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-4">
              Try adjusting your genre or publisher filters, or jump into the full month calendar.
            </p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-xs font-semibold bg-[#1c1d22] text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
